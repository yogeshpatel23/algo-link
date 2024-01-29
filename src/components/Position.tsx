import { PositionResponse } from "@/lib/types";
import React, { useRef, useState } from "react";
import { Input } from "./ui/input";
import { CheckIcon, PencilIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { VyApi } from "@/lib/VyApi";

const Position = ({
  position,
  vy,
}: {
  position: PositionResponse;
  vy: VyApi;
}) => {
  const tragetRef = useRef<HTMLInputElement>(null);
  const [target, setTarget] = useState<number | null>(null);
  const [showTargetInput, setShowTargetInput] = useState<boolean>(false);

  const slRef = useRef<HTMLInputElement>(null);
  const [sl, setSl] = useState<number | null>(null);
  const [showSlInput, setShowSlInput] = useState<boolean>(false);

  function handleTarget() {
    const value = tragetRef.current?.value;
    if (Number.isNaN(Number(value)) || value === "" || value === "0") {
      setTarget(null);
      setShowTargetInput(false);
      return;
    }
    setTarget(Number(value));
    setShowTargetInput(false);
  }

  function handleSl() {
    const value = slRef.current?.value;
    if (Number.isNaN(Number(value)) || value === "" || value === "0") {
      setSl(null);
      setShowSlInput(false);
      return;
    }
    setSl(Number(value));
    setShowSlInput(false);
  }

  async function handleClosePosition(Price = 0) {
    setSl(null);
    setTarget(null);
    console.log("place close order");
  }
  return position.netqty !== "0" ? (
    <div className="group relative border-y p-2 text-sm">
      <div className="flex justify-between items-center">
        <div className="basis-40 overflow-hidden h-6 flex">
          <span className="w-full">{position.tsym}</span>
        </div>
        <div className="basis-40 overflow-hidden h-7 flex gap-2 items-center">
          {showTargetInput ? (
            <>
              <XMarkIcon
                className="w-6 h-6 cursor-pointer"
                onClick={() => {
                  setShowTargetInput(false);
                }}
              />
              <Input
                ref={tragetRef}
                defaultValue={target!}
                className="text-xs h-7"
                type="number"
              />
              <CheckIcon
                className="w-6 h-6 cursor-pointer"
                onClick={handleTarget}
              />
            </>
          ) : (
            <>
              {target ? (
                <span
                  className="cursor-pointer"
                  onClick={() => {
                    setShowTargetInput(true);
                  }}
                >
                  TGT: {target}
                </span>
              ) : (
                <span
                  className="cursor-pointer"
                  onClick={() => {
                    setShowTargetInput(true);
                  }}
                >
                  Set Traget
                </span>
              )}
            </>
          )}
        </div>
        <div className="basis-20 overflow-hidden h-6">
          P&L:{" "}
          {(
            Number(position.netqty) *
            (Number(position.lp) -
              Number(position.netavgprc) * Number(position.prcftr))
          ).toFixed(2)}
        </div>
      </div>
      <div className="flex justify-between items-center">
        <div className="basis-40 overflow-hidden h-6 flex">
          <span className="mr-4">Qty: {position.netqty}</span>
          <span>Avg: {position.netavgprc}</span>
        </div>
        <div className="basis-40 overflow-hidden h-7 flex gap-2 items-center">
          {showSlInput ? (
            <>
              <XMarkIcon
                className="w-6 h-6 cursor-pointer"
                onClick={() => {
                  setShowSlInput(false);
                }}
              />
              <Input
                ref={slRef}
                defaultValue={sl!}
                className="text-xs h-7"
                type="number"
              />
              <CheckIcon
                className="w-6 h-6 cursor-pointer"
                onClick={handleSl}
              />
            </>
          ) : (
            <>
              {sl ? (
                <span
                  className="cursor-pointer"
                  onClick={() => {
                    setShowSlInput(true);
                  }}
                >
                  SL: {sl}
                </span>
              ) : (
                <span
                  className="cursor-pointer"
                  onClick={() => {
                    setShowSlInput(true);
                  }}
                >
                  Set Stoploss
                </span>
              )}
            </>
          )}
        </div>
        <div className="basis-20 overflow-hidden h-6">LTP: {position.lp}</div>
      </div>
      {/* Over lay */}
      <div className="absolute inset-y-0 right-4 hidden group-hover:flex justify-center items-center">
        <XMarkIcon
          className="w-6 h-6 p-1 bg-red-300 hover:bg-red-500 rounded-xl cursor-pointer"
          onClick={() => {
            handleClosePosition();
          }}
        />
      </div>
    </div>
  ) : (
    <div className="border-y p-2 text-sm flex">
      <div className="basis-40 overflow-hidden h-6 flex">
        <span className="w-full">{position.tsym}</span>
      </div>
      <div className="basis-40 overflow-hidden h-6 flex">
        <span className="w-full">LTP:{position.lp}</span>
      </div>
      <div className="basis-20 overflow-hidden h-6 flex">
        <span className="w-full">MTM: {position.rpnl}</span>
      </div>
    </div>
  );
};

export default Position;
