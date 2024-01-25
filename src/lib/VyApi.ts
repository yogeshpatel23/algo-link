import { MOrder, OrderType } from "@/model/orderSchema";
import {
  BrokerErrorResponse,
  BrokerOrder,
  CancelOrderResponse,
  OrderResponse,
  SearchScriptResponse,
} from "./types";

export interface VyApi {
  uid: string;
  token: string;
  getWsUrl(): string;
  searchScript(
    stext: string,
    exch: string
  ): Promise<SearchScriptResponse | BrokerErrorResponse>;
  placeOrder(data: OrderType): Promise<OrderResponse | BrokerErrorResponse>;
  modifyOrder(data: MOrder): Promise<CancelOrderResponse | BrokerErrorResponse>;
  cancelOrder(
    norenordno: string
  ): Promise<CancelOrderResponse | BrokerErrorResponse>;
  getOrderBook(): Promise<BrokerOrder[] | BrokerErrorResponse>;
}
