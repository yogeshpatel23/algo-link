import { BrokerErrorResponse, SearchScriptResponse } from "./types";

export interface VyApi {
  uid: string;
  token: string;
  searchScript(
    stext: string,
    exch: string
  ): Promise<SearchScriptResponse | BrokerErrorResponse>;
}
