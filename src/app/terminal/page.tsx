"use client";
import { Order } from "@/components/Order";
import Ticker from "@/components/Ticker";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";

import { VyApi } from "@/lib/VyApi";
import { FlattradeApi } from "@/lib/flattradeApi";
import { WsResponse } from "@/lib/types";
import { RootState } from "@/store";
import {
  initOrderList,
  removeOrdrer,
  updateOrderLtp,
} from "@/store/orderSlice";
import { updateScript } from "@/store/watchlistSlice";
import { PlusIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";
import { ScrollArea } from "@/components/ui/scroll-area";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function Terminal() {
  const scripts = useSelector((store: RootState) => store.watchlist.scripts);
  const selectAcc = useSelector(
    (store: RootState) => store.accounts.selectedAcc
  );
  const orderList = useSelector((store: RootState) => store.order.orders);
  const dispatch = useDispatch();
  const { toast } = useToast();
  const ws = useRef<WebSocket>();
  const vy = useRef<VyApi>();

  useEffect(() => {
    if (!selectAcc) return;
    if (selectAcc?.broker === "flattrade") {
      vy.current = new FlattradeApi(selectAcc.userId, selectAcc.token!);
    } else {
      throw new Error("invalid borker");
    }

    getOrders(vy.current);

    ws.current = new WebSocket(vy.current.getWsUrl());
    ws.current.onopen = wsOpen;

    ws.current.onmessage = wsMsg;

    ws.current.onclose = (ev) => {
      // console.log(ev);
    };
    ws.current.onerror = (ev) => {
      // console.log(ev);
    };

    return () => {
      ws.current?.close(1000, "removed");
    };
  }, []);

  // API Calls
  async function getOrders(vy: VyApi) {
    try {
      const res = await vy.getOrderBook();
      if ("stat" in res) {
        toast({ description: res.emsg });
        return;
      }
      // console.log(res);
      let filtered = res.filter(
        (res) => res.status === "PENDING" || res.status === "OPEN"
      );
      dispatch(initOrderList(filtered));
    } catch (error: any) {
      toast({ description: error.message });
    }
  }
  // Ws Functions
  function wsOpen(this: WebSocket, ev: Event) {
    // console.log(ev);
    ws.current?.send(
      JSON.stringify({
        t: "c",
        uid: selectAcc?.userId,
        actid: selectAcc?.userId,
        source: "API",
        susertoken: selectAcc?.token,
      })
    );
  }

  function wsMsg(this: WebSocket, ev: MessageEvent<string>) {
    let data: WsResponse = JSON.parse(ev.data);
    switch (data.t) {
      case "ck":
        let tokens = scripts.map((script) => `${script.exch}|${script.token}`);
        tokens = [
          ...tokens,
          ...orderList.map((order) => `${order.exch}|${order.token}`),
        ];
        // Subscribe Order update
        ws.current?.send(
          JSON.stringify({
            t: "o",
            uid: selectAcc?.userId,
            actid: selectAcc?.userId,
          })
        );
        // Subcribe Watchlist script touchline
        ws.current?.send(
          JSON.stringify({
            t: "t",
            k: tokens.join("#"),
          })
        );
        break;
      case "tk":
      case "tf":
        if (data.lp && data.pc) {
          dispatch(updateScript({ token: data.tk, lp: data.lp, pc: data.pc }));
          dispatch(updateOrderLtp({ token: data.tk, lp: data.lp }));
        } else if (data.lp) {
          dispatch(updateScript({ token: data.tk, lp: data.lp }));
          dispatch(updateOrderLtp({ token: data.tk, lp: data.lp }));
        } else if (data.pc) {
          dispatch(updateScript({ token: data.tk, pc: data.pc }));
        }
        break;
      case "om":
        switch (data.reporttype) {
          case "New":
          case "Replaced":
            getOrders(vy.current!);
            break;
          case "Canceled":
            dispatch(removeOrdrer(data.norenordno));
            break;
          case "Rejected":
            toast({ variant: "destructive", description: data.rejreason });
            break;
          case "NewAck" ||
            "ModAck" ||
            "PendingNew" ||
            "PendingReplace" ||
            "PendingReplace":
            console.log(data.status);
            break;

          default:
            console.log(data);
            break;
        }
        break;

      default:
        console.log(data);
    }
  }

  return (
    <div className="min-h-screen p-4">
      <div className="fixed top-0 left-0 flex justify-between items-center p-1">
        <Link href="/" className={buttonVariants()}>
          <ArrowLeftIcon className="w-4 h-4" />
        </Link>
      </div>
      <ResizablePanelGroup
        direction="vertical"
        className="min-h-svh rounded-lg border"
      >
        <ResizablePanel defaultSize={40}>
          <div className="h-60">
            <h2 className=" text-center">Watchlist</h2>
            <ScrollArea>
              <div>
                {scripts.map((script) => (
                  <Ticker key={script.token} vy={vy.current!} script={script} />
                ))}

                <div className="flex justify-center w-full mt-2">
                  <Link
                    href="/terminal/add"
                    className={buttonVariants({ variant: "outline" })}
                  >
                    <PlusIcon className="w-4 h-4 mr-2" /> Add
                  </Link>
                </div>
              </div>
            </ScrollArea>
          </div>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={30}>
          <div>
            <h2 className="text-center">Orders</h2>
            {orderList.map((order) => (
              <Order key={order.norenordno} order={order} vy={vy.current!} />
            ))}
          </div>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={30}>
          <div>
            <h2 className="text-center">Positions</h2>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
