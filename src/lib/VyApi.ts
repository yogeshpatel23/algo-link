import { BrokerErrorResponse, SearchScriptResponse } from "./types";

export interface VyApi {
  uid: string;
  token: string;
  getWsUrl(): string;
  searchScript(
    stext: string,
    exch: string
  ): Promise<SearchScriptResponse | BrokerErrorResponse>;
}
