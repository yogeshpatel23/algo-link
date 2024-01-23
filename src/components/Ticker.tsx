"use client";
import React, { useState } from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "./ui/button";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { NSEScript, NFOScript } from "@/lib/types";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";
import { Input } from "./ui/input";

const Ticker = ({ script }: { script: NSEScript | NFOScript }) => {
  const [trantype, setTrantype] = useState<"B" | "S">("B");
  const [prctyp, setPrctyp] = useState<string>("MKT");
  const [prd, setPrd] = useState<string>("I");
  return (
    <Drawer>
      <div className="group flex items-center relative h-7 border-y text-sm">
        <div className="flex items-center basis-40 h-[26px] overflow-hidden max-w-full ml-4">
          <span className="w-full overflow-hidden">{script.tsym}</span>
        </div>
        <div className="flex justify-end items-center flex-[1_1_75px] h-[26px] overflow-hidden max-w-full mx-2">
          <span className="w-full overflow-hidden text-right">
            {script.ltp}
          </span>
        </div>
        <div className="flex justify-end items-center flex-[1_1_70px] h-[26px] overflow-hidden max-w-full mx-2">
          <span className="w-full overflow-hidden  text-right">
            {((Number(script.ltp) * Number(script.cp)) / 100).toFixed(2)}
          </span>
        </div>
        <div className="flex justify-end items-center flex-[1_1_60px] h-[26px] overflow-hidden max-w-full mr-4">
          <span className="w-full overflow-hidden  text-right">
            {script.cp}
          </span>
        </div>
        {/* overlay */}
        <div className="bg-white/10 hidden group-hover:flex justify-end items-center gap-4 absolute inset-0 pr-6">
          <DrawerTrigger className="space-x-4" asChild>
            <Button
              variant="default"
              size="sm"
              className="p-2 h-5 bg-teal-700 hover:bg-teal-800 text-white"
              onClick={() => {
                setTrantype("B");
              }}
            >
              B
            </Button>
          </DrawerTrigger>
          <DrawerTrigger className="space-x-4" asChild>
            <Button
              variant="default"
              size="sm"
              className="p-2 h-5 bg-red-500 hover:bg-red-800 text-white"
              onClick={() => {
                setTrantype("S");
              }}
            >
              S
            </Button>
          </DrawerTrigger>
          <XMarkIcon className="w-5 h-5 bg-gray-400 text-red-500 rounded-md p-0.5 cursor-pointer" />
        </div>
      </div>
      <DrawerContent>
        <div className="flex justify-between items-center">
          <DrawerHeader>
            <DrawerTitle>
              {script.tsym} ({script.ltp})
            </DrawerTitle>
            <DrawerDescription>
              {script.exch === "NFO" ? script.dname : script.cname}
            </DrawerDescription>
          </DrawerHeader>
          <div className="flex items-center space-x-2 mr-4">
            <Switch
              className="data-[state=unchecked]:bg-red-600 data-[state=checked]:bg-teal-600"
              checked={trantype === "B"}
              onCheckedChange={() => {
                trantype === "B" ? setTrantype("S") : setTrantype("B");
              }}
              id="trademode"
            />
            <Label htmlFor="trademode">
              {trantype === "B" ? "BUY" : "SELL"}
            </Label>
          </div>
        </div>
        <div className="px-4">
          <div className="flex justify-between">
            <ToggleGroup
              type="single"
              size="sm"
              value={prd}
              onValueChange={(v) => setPrd(v)}
            >
              {script.exch === "NFO" ? (
                <ToggleGroupItem
                  value="M"
                  aria-label="Toggle NRML"
                  className="text-xs"
                >
                  NRML
                </ToggleGroupItem>
              ) : (
                <ToggleGroupItem
                  value="C"
                  aria-label="Toggle CNC"
                  className="text-xs"
                >
                  CNC
                </ToggleGroupItem>
              )}
              <ToggleGroupItem
                value="I"
                aria-label="Toggle MIS"
                className="text-xs"
              >
                MIS
              </ToggleGroupItem>
            </ToggleGroup>
            <ToggleGroup
              type="single"
              size="sm"
              value={prctyp}
              onValueChange={(v) => setPrctyp(v)}
            >
              <ToggleGroupItem
                value="LMT"
                aria-label="Toggle LMT"
                className="text-xs"
              >
                LIMIT
              </ToggleGroupItem>
              <ToggleGroupItem
                value="MKT"
                aria-label="Toggle MKT"
                className="text-xs"
              >
                MARKET
              </ToggleGroupItem>
              <ToggleGroupItem
                value="SL-LMT"
                aria-label="Toggle SL-LMT"
                className="text-xs"
              >
                SL
              </ToggleGroupItem>
              <ToggleGroupItem
                value="SL-MKT"
                aria-label="Toggle SL-MKT"
                className="text-xs"
              >
                SLM
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
          <div className="grid grid-cols-3 mt-4">
            <div className="p-2">
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="qty">Qty</Label>
                <Input
                  id="qty"
                  type="number"
                  defaultValue={script.ls}
                  min={script.ls}
                  step={script.ls}
                />
              </div>
            </div>
            <div className="col-span-2 p-2">
              <div className="grid grid-cols-2 gap-2">
                <div className="grid w-full max-w-sm items-center gap-1.5">
                  <Label htmlFor="price">Price</Label>
                  <Input
                    id="price"
                    type="number"
                    disabled={prctyp === "MKT" || prctyp === "SL-MKT"}
                    min={script.ti}
                    step={script.ti}
                    defaultValue={script.ltp}
                  />
                </div>
                <div className="grid w-full max-w-sm items-center gap-1.5">
                  <Label htmlFor="tprice">Trigger Price</Label>
                  <Input
                    id="tprice"
                    type="number"
                    disabled={prctyp === "MKT" || prctyp === "LMT"}
                    min={script.ti}
                    step={script.ti}
                    defaultValue={script.ltp}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <DrawerFooter>
          <div className="flex justify-end gap-2">
            <Button
              className={`${
                trantype === "B"
                  ? "bg-teal-600 hover:bg-teal-800"
                  : "bg-red-600 hover:bg-red-800"
              } text-white`}
            >
              {trantype === "B" ? "BUY" : "SELL"}
            </Button>
            <DrawerClose asChild>
              <Button variant="outline">Cancle</Button>
            </DrawerClose>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default Ticker;
