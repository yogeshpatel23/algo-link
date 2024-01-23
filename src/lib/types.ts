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

export type Script = {
  tsym: string;
  token: string;
  instname: string;
  pp: string;
  ti: string;
  ls: string;
  ltp?: string;
  chg?: string;
  cp?: string;
};

export type NSEScript = Script & {
  exch: "NSE";
  // tsym: string;
  // token: string;
  // instname: string;
  // pp: string;
  // ti: string;
  // ls: string;
  cname?: string;
  // ltp?: string;
};

export type NFOScript = Script & {
  exch: "NFO";
  // tsym: string;
  // token: string;
  // instname: string;
  // pp: string;
  // ti: string;
  // ls: string;
  dname: string;
  optt: string;
  weekly?: string;
  // ltp?: string;
};

//  WS Types
export type WsConnect = {
  t: "ck";
  uid?: string;
  s: "OK" | "Not_Ok";
};

export type WsTouchLine = {
  t: "tk" | "tf";
  e: string;
  tk: string;
  ts?: string;
  pp?: string;
  ls?: string;
  ti?: string;
  lp?: string;
  pc?: string;
  o?: string;
  h?: string;
  l?: string;
  c?: string;
  ap?: string;
  v?: string;
  oi?: string;
  poi?: string;
  bp1?: string;
  sp1?: string;
  bq1?: string;
  sq1?: string;
};

export type WsResponse = WsConnect | WsTouchLine;
