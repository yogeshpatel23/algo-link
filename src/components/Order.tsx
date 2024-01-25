import { BrokerOrder } from "@/lib/types";
import React from "react";
import { Badge } from "./ui/badge";
import { PencilIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { Button } from "./ui/button";
import { VyApi } from "@/lib/VyApi";
import { useToast } from "./ui/use-toast";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { useForm } from "react-hook-form";
import { MOSchema, MOrder } from "@/model/orderSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";
import { Input } from "./ui/input";

export const Order = ({ order, vy }: { order: BrokerOrder; vy: VyApi }) => {
  const { toast } = useToast();
  const form = useForm<MOrder>({
    resolver: zodResolver(MOSchema),
    defaultValues: {
      norenordno: order.norenordno,
      exch: order.exch,
      tsym: order.tsym,
      qty: order.qty,
      prctyp: order.prctyp as "MKT" | "LMT" | "SL-MKT" | "SL-LMT",
    },
  });

  const showPriceInput =
    form.watch("prctyp") === "LMT" || form.watch("prctyp") === "SL-LMT";
  const showTriggerPriceInput =
    form.watch("prctyp") === "SL-MKT" || form.watch("prctyp") === "SL-LMT";

  async function onSubnut(data: MOrder) {
    console.log(data);
  }
  async function cancelOrder() {
    const res = await vy.cancelOrder(order.norenordno);
    if (res.stat === "Not_Ok") {
      toast({
        variant: "destructive",
        description: res.emsg,
      });
    }
  }
  return (
    <div className="group relative border-y p-2 text-sm">
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
      {/* Overlay */}
      <div className="absolute inset-1 right-1 bg-white/15 hidden group-hover:flex flex-col justify-center gap-1 items-end">
        <Button variant="destructive" className="p-1 h-7" onClick={cancelOrder}>
          <XMarkIcon className="w-6 h-6" />
        </Button>
        <Dialog>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubnut)}>
              <DialogTrigger asChild>
                <Button className="p-1 h-7">
                  <PencilIcon className="w-6 h-6" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Modify Order</DialogTitle>
                  <DialogDescription>{order.tsym}</DialogDescription>
                </DialogHeader>
                <div>
                  <div>
                    <FormField
                      name="prctyp"
                      control={form.control}
                      render={({ field }) => (
                        <ToggleGroup
                          type="single"
                          size="sm"
                          defaultValue={order.prctyp}
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
                            className="text-xs"
                            value="LMT"
                            aria-label="Toggle LMT"
                          >
                            LMT
                          </ToggleGroupItem>
                          <ToggleGroupItem
                            className="text-xs"
                            value="MKT"
                            aria-label="Toggle MKT"
                          >
                            MKT
                          </ToggleGroupItem>
                          <ToggleGroupItem
                            className="text-xs"
                            value="SL-LMT"
                            aria-label="Toggle SL-LMT"
                          >
                            SL-LMT
                          </ToggleGroupItem>
                          <ToggleGroupItem
                            className="text-xs"
                            value="SL-MKT"
                            aria-label="Toggle SL-MKT"
                          >
                            SL-MKT
                          </ToggleGroupItem>
                        </ToggleGroup>
                      )}
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <FormField
                      name="qty"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Qty</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="number"
                              min={order.ls}
                              step={order.ls}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {showPriceInput && (
                      <FormField
                        name="prc"
                        control={form.control}
                        shouldUnregister={true}
                        defaultValue={order.prc}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Price</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                type="number"
                                min={order.ti}
                                step={order.ti}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                    {showTriggerPriceInput && (
                      <FormField
                        name="trgprc"
                        control={form.control}
                        shouldUnregister={true}
                        defaultValue={order.trgprc || ""}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Trigger Price</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                type="number"
                                min={order.ti}
                                step={order.ti}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                  </div>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="secondary">Close</Button>
                  </DialogClose>
                  <Button onClick={form.handleSubmit(onSubnut)}>Modify</Button>
                </DialogFooter>
              </DialogContent>
            </form>
          </Form>
        </Dialog>
      </div>
    </div>
  );
};
