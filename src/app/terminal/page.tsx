"use client";
import { Order } from "@/components/Order";
import Ticker from "@/components/Ticker";
import { Button, buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";

import { VyApi } from "@/lib/VyApi";
import { FlattradeApi } from "@/lib/flattradeApi";
import { WsResponse } from "@/lib/types";
import { RootState } from "@/store";
import { initOrderList } from "@/store/orderSlice";
import { updateScript } from "@/store/watchlistSlice";
import { PlusIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";
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
        return;
      }
      // console.log(res);
      //TODO: Filter Ordrlist
      dispatch(initOrderList(res));
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
        } else if (data.lp) {
          dispatch(updateScript({ token: data.tk, lp: data.lp }));
        } else if (data.pc) {
          dispatch(updateScript({ token: data.tk, pc: data.pc }));
        }
        break;

      default:
        console.log(data);
    }
  }

  return (
    <div className="min-h-screen">
      <div className="flex justify-between items-center shadow-md p-2  dark:border-b dark:border-b-gray-600">
        <Link href="/" className={buttonVariants({ variant: "outline" })}>
          <ArrowLeftIcon className="w-4 h-4" />
        </Link>
        <h2>Watchlist</h2>
        <Link
          href="/terminal/add"
          className={buttonVariants({ variant: "outline" })}
        >
          <PlusIcon className="w-4 h-4" />
        </Link>
      </div>
      <div className="h-60">
        {scripts.map((script) => (
          <Ticker key={script.token} vy={vy.current!} script={script} />
        ))}
      </div>
      <Separator className="my-2" />
      <div>
        <h2 className="text-center">Orders</h2>
        {orderList.map((order) => (
          <Order key={order.norenordno} order={order} />
        ))}
      </div>
    </div>
  );
}
