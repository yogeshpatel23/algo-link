import { VyApi } from "./VyApi";
import { sha256 } from "js-sha256";

export class FlattradeApi implements VyApi {
  baseurl: string = "https://piconnect.flattrade.in/PiConnectTP";

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

  searchScript(stext: string, exch: string): void {
    throw new Error("Method not implemented.");
  }
}
