// type BrokerResponse = {
//     stat: 'Ok' | 'Not_Ok'
// }

export type BrokerErrorResponse = {
  stat: "Not_Ok";
  request_time?: string;
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
  cname?: string;
};

export type NFOScript = Script & {
  exch: "NFO";
  dname: string;
  optt: string;
  weekly?: string;
};

export type OrderResponse = {
  stat: "Ok";
  request_time: string;
  norenordno: string;
};

export type CancelOrderResponse = {
  stat: "Ok";
  request_time: string;
  result: string;
};

export type BrokerOrder = {
  stat: string; // Ok or Not_Ok
  norenordno: string; // Noren Order Number
  kidid: string; //
  uid: string; //
  actid: string; //
  exch: string; // Exchange Segment
  tsym: string; // Trading symbol
  qty: string; // Order Quantity
  ordenttm: string; //
  trantype: string; // Transaction type of the order B | S
  prctyp: string; // LMT / MKT
  fillshares?: string; // Total Traded Quantity of this order
  avgprc?: string; // Averget price for this order
  ret: string; // DAY / IOC /
  token: string; //
  mult: string; //
  prcftr: string; //
  pp: string; //
  ls: string; //
  ti: string; //
  prc: string; // Order Price
  trgprc?: string; // Order trigger price
  rprc: string; //
  dscqty: string; // Order disclosed quantity.
  s_prdt_ali: string; //
  prd: string; // I M C B O
  status: string; // Order status
  st_intrn: string; //
  norentm: string; //
  exch_tm?: string;
  remarks: string; // Any message Entered during order entry.
  rejreason?: string; // If order is rejected, reason in text form
  exchordid?: string; // Exchange Order Number
  cancelqty?: string; // Canceled qty for order which is in status cancelled.
  rqty: string; //
  ltp?: string;
};

export type PositionResponse = {
  stat: string;
  exch: string;
  tsym: string;
  token: string;
  uid: string;
  actid: string;
  prd: string;
  netqty: string;
  netavgprc: string;
  daybuyqty: string;
  daysellqty: string;
  daybuyavgprc: string;
  daysellavgprc: string;
  daybuyamt: string;
  daysellamt: string;
  cfbuyqty: string;
  cforgavgprc: string;
  cfsellqty: string;
  cfbuyavgprc: string;
  cfsellavgprc: string;
  cfbuyamt: string;
  cfsellamt: string;
  openbuyqty: string;
  opensellqty: string;
  openbuyamt: string;
  opensellamt: string;
  openbuyavgprc: string;
  opensellavgprc: string;
  mult: string;
  lp: string;
  rpnl: string;
  urmtom: string;
  bep: string;
  pp: string;
  prcftr: string;
  ti: string;
  ls: string;
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

type WsOrderUpdate = {
  t: "om"; // "om",
  norenordno: string; // "24012500098952",
  uid: string; // "FT006654",
  actid: string; // "FT006654",
  exch: string; // "NSE",
  tsym: string; // "RELIANCE-EQ",
  trantype: string; // "S",
  qty: string; // "1",
  prc: string; // "2684.00",
  pcode: string; // "I",
  remarks: string; // "algo-link",
  rejreason?: string; //
  status: "PENDING" | "OPEN" | "CANCELED" | "REJECTED";
  reporttype:
    | "NewAck"
    | "PendingNew"
    | "New"
    | "ModAck"
    | "PendingReplace"
    | "Replaced"
    | "PendingCancel"
    | "Canceled"
    | "Rejected"
    | string;
  prctyp: string; // "LMT",
  ret: string; // "DAY",
  exchordid: string; // "",
  dscqty: string; // "0"
  exch_tm?: string; //"25-01-2024 10:24:51"
};

export type WsResponse = WsConnect | WsTouchLine | WsOrderUpdate;
