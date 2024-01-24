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
import { useForm } from "react-hook-form";
import { OrderShema, OrderType } from "@/model/orderSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { VyApi } from "@/lib/VyApi";
import { useToast } from "./ui/use-toast";

const Ticker = ({
  script,
  vy,
}: {
  script: NSEScript | NFOScript;
  vy: VyApi;
}) => {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const form = useForm<OrderType>({
    resolver: zodResolver(OrderShema),
    defaultValues: {
      exch: script.exch,
      tsym: script.tsym,
      prd: "I",
      prctyp: "MKT",
    },
  });
  async function onSubmit(data: OrderType) {
    try {
      const res = await vy.placeOrder(data);
      console.log(res);
      if (res.stat === "Not_Ok") {
        toast({
          variant: "destructive",
          description: res.emsg,
        });
        return;
      }
      toast({
        title: "Success",
        description: `Order no. ${res.norenordno} placed`,
      });
      setOpen(false);
    } catch (e) {
      console.log(e);
    }
  }

  const showTriggerInput =
    form.watch("prctyp") === "SL-LMT" || form.watch("prctyp") === "SL-MKT";

  const showPriceInput =
    form.watch("prctyp") === "SL-LMT" || form.watch("prctyp") === "LMT";
  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <Form {...form}>
        <form>
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
                    form.setValue("trantype", "B");
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
                    form.setValue("trantype", "S");
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
                <FormField
                  name="trantype"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="flex gap-2 space-y-0 items-center">
                      <Switch
                        className="data-[state=unchecked]:bg-red-600 data-[state=checked]:bg-teal-600"
                        defaultValue={"B"}
                        checked={field.value === "B"}
                        onCheckedChange={(checked) => {
                          checked
                            ? form.setValue("trantype", "B")
                            : form.setValue("trantype", "S");
                        }}
                        id="trademode"
                      />
                      <FormLabel htmlFor="trademode">
                        {field.value === "B" ? "BUY" : "SELL"}
                      </FormLabel>
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="px-4">
              <div className="flex justify-between">
                <FormField
                  name="prd"
                  control={form.control}
                  render={({ field }) => (
                    <ToggleGroup
                      type="single"
                      size="sm"
                      value={field.value}
                      onValueChange={(v) => {
                        switch (v) {
                          case "M":
                            form.setValue("prd", v);
                            break;
                          case "I":
                            form.setValue("prd", v);
                            break;
                          case "C":
                            form.setValue("prd", v);
                            break;
                          default:
                            break;
                        }
                      }}
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
                  )}
                />
                <FormField
                  name="prctyp"
                  control={form.control}
                  render={({ field }) => (
                    <ToggleGroup
                      type="single"
                      size="sm"
                      value={field.value}
                      onValueChange={(v) => {
                        switch (v) {
                          case "LMT":
                            form.setValue("prctyp", v);
                            break;
                          case "MKT":
                            form.setValue("prctyp", v);
                            break;
                          case "SL-LMT":
                            form.setValue("prctyp", v);
                            break;
                          case "SL-MKT":
                            form.setValue("prctyp", v);
                            break;
                          default:
                            break;
                        }
                      }}
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
                  )}
                />
              </div>

              <div className="grid grid-cols-3 mt-4">
                <div className="p-2">
                  <div className="grid w-full max-w-sm items-center gap-1.5">
                    <FormField
                      name="qty"
                      control={form.control}
                      defaultValue={script.ls}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Qty</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="number"
                              min={script.ls}
                              step={script.ls}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                <div className="col-span-2 p-2">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="grid w-full max-w-sm items-center gap-1.5">
                      {showPriceInput && (
                        <FormField
                          name="prc"
                          control={form.control}
                          shouldUnregister={true}
                          defaultValue={script.ltp}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Price</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  type="number"
                                  min={script.ti}
                                  step={script.ti}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}
                    </div>
                    <div className="grid w-full max-w-sm items-center gap-1.5">
                      {showTriggerInput && (
                        <FormField
                          name="trgprc"
                          shouldUnregister={true}
                          control={form.control}
                          defaultValue={script.ltp}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Tigger Price</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  type="number"
                                  min={script.ti}
                                  step={script.ti}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <DrawerFooter>
              <div className="flex justify-end gap-2">
                <Button
                  onClick={form.handleSubmit(onSubmit)}
                  className={`${
                    form.getValues("trantype") === "B"
                      ? "bg-teal-600 hover:bg-teal-800"
                      : "bg-red-600 hover:bg-red-800"
                  } text-white`}
                >
                  {form.getValues("trantype") === "B" ? "BUY" : "SELL"}
                </Button>
                <DrawerClose asChild>
                  <Button variant="outline">Cancle</Button>
                </DrawerClose>
              </div>
            </DrawerFooter>
          </DrawerContent>
        </form>
      </Form>
    </Drawer>
  );
};

export default Ticker;
