"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { FinvasiaApi } from "@/lib/finvasiaApi";
import { initAccount } from "@/store/accountSlice";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { z } from "zod";

const formSchema = z.object({
  userid: z.string().min(1, { message: "User Id Required" }),
  password: z.string().min(1, { message: "Password Required" }),
  otp: z.string().min(1, { message: "OTP is Required" }),
});

export default function Page() {
  const router = useRouter();
  const { toast } = useToast();
  const dispatch = useDispatch();
  const serarchParam = useSearchParams();
  const key = serarchParam.get("key");
  const vc = serarchParam.get("vc");
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userid: "",
      password: "",
      otp: "",
    },
  });

  async function login(data: z.infer<typeof formSchema>) {
    const res = await FinvasiaApi.getToken(
      data.userid,
      data.password,
      data.otp,
      vc!,
      key!
    );
    if (res.stat === "Not_Ok") {
      toast({ variant: "destructive", description: res.emsg });
      return;
    }
    fetch("/api/accounts", {
      method: "PATCH",
      body: JSON.stringify({
        userId: res.uid,
        token: res.susertoken,
      }),
    })
      .then((res) => {
        if (res.status !== 200) throw new Error("someting went wrong");
        return res.json();
      })
      .then((resdata) => {
        dispatch(initAccount(resdata.accounts));
        router.push("/");
      });
  }
  useEffect(() => {
    if (!vc || !key) {
      router.push("/");
    }
  }, []);
  return (
    <div className="flex justify-center">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(login)}>
          <div className="w-96 space-y-4 p-4 m-8">
            <h2 className="text-2xl font-light text-center">
              Login to SHOONYA
            </h2>
            <FormField
              name="userid"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>User Id</FormLabel>
                  <FormControl>
                    <Input placeholder="user id" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input placeholder="Password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="otp"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>OTP/TOTP</FormLabel>
                  <FormControl>
                    <Input placeholder="OTP/TOTP" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full">
              Login
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
