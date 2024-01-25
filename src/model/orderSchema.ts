import { z } from "zod";

const OrderBase = z.object({
  uid: z.string().optional(),
  actid: z.string().optional(),
  exch: z.string(),
  tsym: z.string(),
  qty: z.string(),
  prd: z.enum(["C", "M", "I"]),
  trantype: z.enum(["B", "S"]),
  ret: z.string().default("DAY"),
  remarks: z.string().default("algo-link"),
  ordersource: z.string().default("API"),
});

const OrderMkt = OrderBase.merge(
  z.object({ prctyp: z.enum(["MKT"]), prc: z.string().default("0") })
);
const OrderLimit = OrderBase.merge(
  z.object({
    prctyp: z.enum(["LMT"]),
    prc: z.string().min(1, { message: "Price is required" }),
  })
);

const OrderStop = OrderBase.merge(
  z.object({
    prctyp: z.enum(["SL-MKT"]),
    prc: z.string().default("0"),
    trgprc: z.string().min(1, { message: "Stop Price is required" }),
  })
);

const OrderStopLimt = OrderBase.merge(
  z.object({
    prctyp: z.enum(["SL-LMT"]),
    prc: z.string().min(1, { message: "Price is required" }),
    trgprc: z.string(),
  })
);

export const OrderShema = z.discriminatedUnion("prctyp", [
  OrderMkt,
  OrderLimit,
  OrderStop,
  OrderStopLimt,
]);

export type OrderType = z.infer<typeof OrderShema>;

const MOBase = z.object({
  uid: z.string().optional(),
  actid: z.string().optional(),
  exch: z.string(),
  norenordno: z.string(),
  tsym: z.string(),
  qty: z.string(),
  ret: z.string().default("DAY"),
});

const MOMkt = MOBase.merge(
  z.object({ prctyp: z.enum(["MKT"]), prc: z.string().default("0") })
);
const MOLimit = MOBase.merge(
  z.object({
    prctyp: z.enum(["LMT"]),
    prc: z.string().min(1, { message: "Price is required" }),
  })
);

const MOStop = MOBase.merge(
  z.object({
    prctyp: z.enum(["SL-MKT"]),
    prc: z.string().default("0"),
    trgprc: z.string().min(1, { message: "Stop Price is required" }),
  })
);

const MOStopLimt = MOBase.merge(
  z.object({
    prctyp: z.enum(["SL-LMT"]),
    prc: z.string().min(1, { message: "Price is required" }),
    trgprc: z.string(),
  })
);

export const MOSchema = z.discriminatedUnion("prctyp", [
  MOMkt,
  MOLimit,
  MOStop,
  MOStopLimt,
]);

export type MOrder = z.infer<typeof MOSchema>;
