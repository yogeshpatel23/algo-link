import { buttonVariants } from "@/components/ui/button";
import { PlusIcon } from "@heroicons/react/24/outline";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import Link from "next/link";

export default function Terminal() {
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
    </div>
  );
}
