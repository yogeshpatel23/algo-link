import { getFileData, saveFile } from "@/lib/filehandel";
import { AccountSchema } from "@/model/account.model";
import { NextResponse } from "next/server";
import { z } from "zod";

type Account = z.infer<typeof AccountSchema>;

export const GET = async (requst: Request) => {
  const res = await getFileData("accounts.txt");
  let accounts: Account[] = [];
  if (res) {
    accounts = JSON.parse(res)["accounts"];
  }
  return NextResponse.json({ accounts: accounts }, { status: 200 });
};

export const POST = async (requst: Request) => {
  const data: Account = await requst.json();
  const res = await getFileData("accounts.txt");
  let accounts: Account[] = [];
  if (res) {
    accounts = JSON.parse(res)["accounts"];
    if (accounts.find((account) => account.userId == data.userId)) {
      return NextResponse.json(
        { msg: "User id Already exist" },
        { status: 409 }
      );
    }
  }

  accounts.push(data);
  await saveFile("accounts.txt", JSON.stringify({ accounts: accounts }));
  return NextResponse.json({ msg: "ok" }, { status: 200 });
};

export const PATCH = async (requst: Request) => {
  const data: { token: string; userId: string } = await requst.json();
  const res = await getFileData("accounts.txt");
  let accounts: Account[] = [];
  if (res) {
    accounts = JSON.parse(res)["accounts"];
    const updatedAccounts = accounts.map((account) => {
      if (account.userId == data.userId) {
        account.token = data.token;
        account.tokenExp = new Date().toDateString();
      }
      return account;
    });
    await saveFile(
      "accounts.txt",
      JSON.stringify({ accounts: updatedAccounts })
    );
    return NextResponse.json({ accounts: updatedAccounts }, { status: 200 });
  }
  return NextResponse.json({ msg: "bbj" }, { status: 500 });
};
