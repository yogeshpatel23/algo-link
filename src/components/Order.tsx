import { BrokerOrder } from "@/lib/types";
import React from "react";
import { Badge } from "./ui/badge";

export const Order = ({ order }: { order: BrokerOrder }) => {
  return (
    <div className="border-y p-2 text-sm">
      <div className="flex justify-between">
        <div className="space-x-2">
          <Badge
            className={`${
              order.trantype === "B" ? "bg-green-700" : "bg-red-700"
            } text-white `}
          >
            {order.trantype === "B" ? "Buy" : "Sell"}
          </Badge>
          <span>Qty : {order.qty}</span>
        </div>
        <div className="space-x-2">
          <span>{order.norentm.split(" ")[0]}</span>
          <span>{order.status}</span>
        </div>
      </div>
      <div className="flex justify-between">
        <span>{order.tsym}</span>
        <div className="space-x-2">
          <span>{order.prc}</span>
          <span>{order.trgprc}</span>
        </div>
      </div>
      <div className="flex justify-between">
        <div className="space-x-2">
          <span>{order.exch}</span>
          <span>{order.s_prdt_ali}</span>
          <span>{order.prctyp}</span>
        </div>
        <div>{order.ltp}</div>
      </div>
    </div>
  );
};
