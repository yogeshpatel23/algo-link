"use client";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { VyApi } from "@/lib/VyApi";
import { FinvasiaApi } from "@/lib/finvasiaApi";
import { FlattradeApi } from "@/lib/flattradeApi";
import { NFOScript, NSEScript } from "@/lib/types";
import { RootState } from "@/store";
import { addToWhatchlist, removeFromWatchlist } from "@/store/watchlistSlice";
import {
  ArrowLeftIcon,
  PlusIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { SelectTrigger, SelectValue } from "@radix-ui/react-select";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function AddScript() {
  const [stext, setStext] = useState("");
  const [exch, setExch] = useState("NFO");
  const [scripts, setScripts] = useState<(NFOScript | NSEScript)[]>([]);
  const { toast } = useToast();
  const dispatch = useDispatch();
  const selectedAcc = useSelector(
    (store: RootState) => store.accounts.selectedAcc
  );
  const watchlist = useSelector((store: RootState) => store.watchlist.scripts);

  const vy = useRef<VyApi>();

  useEffect(() => {
    if (!selectedAcc) return;
    if (selectedAcc?.broker === "flattrade") {
      vy.current = new FlattradeApi(selectedAcc.userId, selectedAcc.token!);
    } else {
      vy.current = new FinvasiaApi(selectedAcc.userId, selectedAcc.token!);
    }
  }, []);

  useEffect(() => {
    if (stext.length < 3) return;
    const t = setTimeout(() => {
      searchScript();
    }, 500);

    return () => {
      clearTimeout(t);
    };
  }, [stext]);

  // /////////////////
  async function searchScript() {
    const data = await vy.current?.searchScript(stext, exch);
    if (data) {
      if (data.stat === "Not_Ok") {
        toast({ variant: "destructive", description: data.emsg });
        return;
      }
      setScripts(data.values);
    }
  }

  return (
    <div className="min-h-screen">
      <div className="flex justify-between items-center gap-2 shadow-md p-2  dark:border-b dark:border-b-gray-600">
        <Link
          href="/terminal"
          className={buttonVariants({ variant: "outline" })}
        >
          <ArrowLeftIcon className="w-4 h-4" />
        </Link>
        <div className="flex-grow flex">
          <Select value={exch} onValueChange={(e) => setExch(e)}>
            <SelectTrigger className="w-12">
              <SelectValue placeholder="nfo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="NFO">NFO</SelectItem>
              <SelectItem value="NSE">NSE</SelectItem>
            </SelectContent>
          </Select>
          <Input
            placeholder="Search Scrtipts"
            value={stext}
            onChange={(e) => setStext(e.target.value)}
          />
        </div>
      </div>
      <div className="px-4 md:px-6 space-y-2">
        {scripts.map((script) => {
          let inWatchlist =
            watchlist.find((s) => s.token === script.token) !== undefined;
          return (
            <div
              key={script.token}
              className="bg-slate-950 dark:bg-slate-900 flex border rounded-lg p-2 cursor-pointer hover:scale-105 transition-all"
            >
              <div className="flex-grow">
                {script.exch === "NSE" ? (
                  <div className="text-sm">
                    {script.cname}
                    <Badge variant="outline" className="text-xs ml-4">
                      {script.exch}
                    </Badge>
                    <Badge variant="outline" className="text-xs ml-1">
                      {script.instname}
                    </Badge>
                  </div>
                ) : (
                  <div className="text-sm">
                    {script.dname}
                    <Badge variant="outline" className="text-xs ml-4">
                      {script.exch}
                    </Badge>
                    <Badge variant="outline" className="text-xs ml-1">
                      {script.instname}
                    </Badge>
                    {script.weekly && (
                      <Badge variant="outline" className="text-xs ml-1">
                        {script.weekly}
                      </Badge>
                    )}
                  </div>
                )}
                <div className="text-xs">{script.tsym}</div>
              </div>
              <div>
                {inWatchlist ? (
                  <Button
                    size="sm"
                    onClick={() => {
                      dispatch(removeFromWatchlist(script.token));
                      // toast({ description: `${script.tsym} R Watchlist` });
                    }}
                  >
                    <XMarkIcon className="w-4 h-4" />
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    onClick={() => {
                      dispatch(addToWhatchlist(script));
                      toast({
                        description: `${script.tsym} added to Watchlist`,
                      });
                    }}
                  >
                    <PlusIcon className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
