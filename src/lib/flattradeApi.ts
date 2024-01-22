import { VyApi } from "./VyApi";
import { sha256 } from "js-sha256";
import { BrokerErrorResponse, SearchScriptResponse } from "./types";

export class FlattradeApi implements VyApi {
  baseurl: string = "https://piconnect.flattrade.in/PiConnectTP";

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

  private async postCall<T>(endpoint: string, payload: {}): Promise<T> {
    const response = await fetch(`${this.baseurl}${endpoint}`, {
      method: "POST",
      body: `jData=${JSON.stringify(payload)}&jKey=${this.token}`,
    });
    const responseData = await response.json();
    return responseData;
  }
}
