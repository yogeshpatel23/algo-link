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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { BROKER } from "@/lib/constants";
import { AccountSchema, Account } from "@/model/accountSchema";
import { addAccount } from "@/store/accountSlice";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import * as z from "zod";

export default function AddAccount() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { toast } = useToast();
  const form = useForm<Account>({
    resolver: zodResolver(AccountSchema),
    defaultValues: {
      name: "",
      // broker: BROKER[0],
      userId: "",
      key: "",
      secret: "",
    },
  });

  async function onSubmit(values: Account) {
    try {
      const res = await fetch("/api/accounts", {
        method: "POST",
        body: JSON.stringify(values),
      });
      const resdata = await res.json();
      if (res.status !== 200) {
        toast({
          variant: "destructive",
          description: resdata["msg"],
        });
      }
      dispatch(addAccount(values));
      router.push("/");
    } catch (error) {
      console.log("first");
    }
  }
  return (
    <div className="max-w-96 m-auto">
      <div className="relative flex justify-center items-center my-4">
        <h2 className="text-2xl">Add Account</h2>
        <Button
          variant={"outline"}
          className="absolute top-1/2 -translate-y-1/2 left-2"
          onClick={() => {
            router.push("/");
          }}
        >
          <ArrowLeftIcon className="w-4 h-4" />
        </Button>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="broker"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Select Broker</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="capitalize">
                      <SelectValue placeholder="Select Broker" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {BROKER.map((b) => (
                      <SelectItem key={b} value={b} className="capitalize">
                        {b}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="userId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>User Id</FormLabel>
                <FormControl>
                  <Input placeholder="User Id" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="key"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Key</FormLabel>
                <FormControl>
                  <Input placeholder="key" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="secret"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Secret</FormLabel>
                <FormControl>
                  <Input placeholder="secret / _i" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Add</Button>
        </form>
      </Form>
    </div>
  );
}
