import { VyApi } from "./VyApi";
import { sha256 } from "js-sha256";
import {
  BrokerErrorResponse,
  BrokerOrder,
  CancelOrderResponse,
  OrderResponse,
  SearchScriptResponse,
} from "./types";
import { MOrder, OrderType } from "@/model/orderSchema";

export class FlattradeApi implements VyApi {
  baseurl: string = "https://piconnect.flattrade.in/PiConnectTP";
  wsurl: string = "wss://piconnect.flattrade.in/PiConnectWSTp/";

  constructor(public uid: string, public token: string) {}
  static async getToken(key: string, code: string, secret: string) {
    try {
      const response = await fetch(
        "https://authapi.flattrade.in/trade/apitoken",
        {
          method: "POST",
          body: JSON.stringify({
            api_key: key,
            request_code: code,
            api_secret: sha256(`${key}${code}${secret}`),
          }),
        }
      );
      if (response.status !== 200) throw new Error(await response.json());
      return await response.json();
    } catch (error) {
      console.log(error);
    }
  }

  getWsUrl(): string {
    return this.wsurl;
  }

  async searchScript(
    stext: string,
    exch: string
  ): Promise<SearchScriptResponse | BrokerErrorResponse> {
    const payload = {
      uid: this.uid,
      stext,
      exch,
    };
    return await this.postCall<SearchScriptResponse | BrokerErrorResponse>(
      "/SearchScrip",
      payload
    );
  }

  async placeOrder(
    data: OrderType
  ): Promise<OrderResponse | BrokerErrorResponse> {
    data.uid = this.uid;
    data.actid = this.uid;
    return await this.postCall<OrderResponse | BrokerErrorResponse>(
      "/PlaceOrder",
      data
    );
  }

  async modifyOrder(
    data: MOrder
  ): Promise<CancelOrderResponse | BrokerErrorResponse> {
    data.uid = this.uid;
    data.actid = this.uid;
    return await this.postCall<CancelOrderResponse | BrokerErrorResponse>(
      "/CancelOrder",
      data
    );
  }

  async cancelOrder(
    norenordno: string
  ): Promise<CancelOrderResponse | BrokerErrorResponse> {
    return await this.postCall<CancelOrderResponse | BrokerErrorResponse>(
      "/CancelOrder",
      { norenordno, uid: this.uid }
    );
  }

  async getOrderBook(): Promise<BrokerOrder[] | BrokerErrorResponse> {
    return await this.postCall<BrokerOrder[] | BrokerErrorResponse>(
      "/OrderBook",
      { uid: this.uid }
    );
  }

  private async postCall<T>(endpoint: string, payload: {}): Promise<T> {
    try {
      const response = await fetch(`${this.baseurl}${endpoint}`, {
        method: "POST",
        body: `jData=${JSON.stringify(payload)}&jKey=${this.token}`,
      });
      const responseData = await response.json();
      return responseData;
    } catch (error: any) {
      console.log(error);
      // console.log(error.message);
      throw new Error(error.message);
    }
  }
}
