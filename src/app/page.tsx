"use client";
import type { RootState } from "@/store";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  CommandLineIcon,
  FingerPrintIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { setSelectedAcc } from "@/store/accountSlice";
import { FlattradeApi } from "@/lib/flattradeApi";

export default function Home() {
  const router = useRouter();
  const dispatch = useDispatch();
  const accounts = useSelector((store: RootState) => store.accounts.accounts);
  return (
    <main className="flex min-h-screen flex-col items-center justify-start py-8 px-2">
      <div className="fixed bottom-8 right-6">
        <Link href="/account/add" className={buttonVariants()}>
          <PlusIcon className="w-4 h-4 mr-2" /> Add Account
        </Link>
      </div>
      <h2 className="text-xl">Accounts</h2>
      <div className="w-full space-y-2">
        {accounts.length < 1 && <div>No Account</div>}
        {accounts.map((account) => {
          const isValid: boolean =
            account.token != "" &&
            account.tokenExp === new Date().toDateString();
          return (
            <Card key={account.userId}>
              <CardContent className="flex p-2 justify-between items-center">
                <div className="flex flex-auto gap-4">
                  <span>{account.name}</span>
                  <span className="capitalize">{account.broker}</span>
                  <span>{account.userId}</span>
                </div>
                <div className="flex">
                  <Link
                    href={
                      account.broker === "finvasia"
                        ? "/"
                        : `https://auth.flattrade.in/?app_key=${account.key}`
                    }
                    className={buttonVariants({
                      size: "sm",
                      variant: "outline",
                    })}
                  >
                    <FingerPrintIcon className="w-4 h-4" />
                  </Link>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={!isValid}
                    className="p-2"
                    onClick={() => {
                      if (account.broker === "flattrade") {
                        dispatch(
                          setSelectedAcc(
                            new FlattradeApi(account.userId, account.token!)
                          )
                        );
                      }
                      router.push("/terminal");
                    }}
                  >
                    <CommandLineIcon className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="destructive" className="p-2">
                    <TrashIcon className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </main>
  );
}
