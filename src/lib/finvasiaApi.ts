import { VyApi } from "./VyApi";
import { sha256 } from "js-sha256";
import {
  BrokerErrorResponse,
  BrokerOrder,
  CancelOrderResponse,
  OrderResponse,
  PositionResponse,
  SearchScriptResponse,
} from "./types";
import { MOrder, OrderType } from "@/model/orderSchema";

export class FinvasiaApi implements VyApi {
  baseurl: string = "https://api.shoonya.com/NorenWClientTP";
  wsurl: string = "wss://api.shoonya.com/NorenWSTP/";

  constructor(public uid: string, public token: string) {}
  static async getToken(
    userId: string,
    password: string,
    otp: string,
    vc: string,
    key: string
  ) {
    try {
      const response = await fetch(
        "https://api.shoonya.com/NorenWClientTP/QuickAuth",
        {
          method: "POST",
          body: `jData=${JSON.stringify({
            apkversion: "1.0.0",
            uid: userId,
            pwd: sha256(password),
            factor2: otp,
            vc: vc,
            appkey: sha256(`${userId}|${key}`),
            imei: "abcd123",
            source: "API",
          })}`,
        }
      );
      // if (response.status !== 200) throw new Error(await response.json());
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

  async getPositionBook(): Promise<PositionResponse[] | BrokerErrorResponse> {
    return await this.postCall<PositionResponse[] | BrokerErrorResponse>(
      "/PositionBook",
      { uid: this.uid, actid: this.uid }
    );
  }

  private async postCall<T>(endpoint: string, payload: {}): Promise<T> {
    try {
      const response = await fetch(`${this.baseurl}${endpoint}`, {
        headers: { "Content-Type": "text/plain" },
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
