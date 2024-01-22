// type BrokerResponse = {
//     stat: 'Ok' | 'Not_Ok'
// }

export type BrokerErrorResponse = {
  stat: "Not_Ok";
  emsg: string;
};

export type SearchScriptResponse = {
  stat: "Ok";
  values: (NFOScript | NSEScript)[];
};

export type NSEScript = {
  exch: "NSE";
  tsym: string;
  token: string;
  instname: string;
  pp: string;
  ti: string;
  ls: string;
  cname?: string;
  ltp?: string;
};

export type NFOScript = {
  exch: "NFO";
  tsym: string;
  token: string;
  instname: string;
  pp: string;
  ti: string;
  ls: string;
  dname: string;
  optt: string;
  weekly?: string;
  ltp?: string;
};
