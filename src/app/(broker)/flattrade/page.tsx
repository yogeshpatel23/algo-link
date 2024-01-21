"use client";
import { FlattradeApi } from "@/lib/flattradeApi";
import { RootState } from "@/store";
import { initAccount } from "@/store/accountSlice";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const dispatch = useDispatch();
  const router = useRouter();
  const accounts = useSelector((store: RootState) => store.accounts.accounts);
  const code = searchParams?.code || "";
  const userId = searchParams?.client || "";
  if (!code && !userId) throw new Error("Unable to get code or userid");

  useEffect(() => {
    if (accounts.length < 1) return;
    const account = accounts.find((acc) => acc.userId == userId);
    if (!account) throw new Error("Unable to get code or userid");
    FlattradeApi.getToken(account.key, code, account.secret)
      .then((data) => {
        if (data.stat === "Not_Ok") {
          //TODO: show in UI
          return;
        }
        fetch("/api/accounts", {
          method: "PATCH",
          body: JSON.stringify({
            userId,
            token: data.token,
          }),
        })
          .then((res) => {
            if (res.status !== 200) throw new Error("someting went wrong");
            return res.json();
          })
          .then((data) => {
            dispatch(initAccount(data.accounts));
            console.log(data);
            router.push("/");
          });
      })
      .catch((err) => console.log(err));
  }, [accounts]);
  return <h1>FT LOgin</h1>;
}

// http://localhost:3000/flattrade?code=17ac5b8471c36418.ae540a126c9fc45a66292dd76d4881ca838098e02e744996ed8c9f37cde162d2&client=FT006654
