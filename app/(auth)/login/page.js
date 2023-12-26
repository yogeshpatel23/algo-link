import Link from "next/link";
import { AtSymbolIcon, KeyIcon } from "@heroicons/react/24/outline";

export default function Page() {
  return (
    <div className="min-h-screen flex flex-col justify-center py-6 ">
      <div className="bg-white dark:bg-slate-800 px-10 pt-10 pb-4 ring-1 ring-gray-300/50 dark:ring-slate-600/50 shadow-xl sm:mx-auto sm:rounded-lg">
        <div className="mx-auto max-w-md">
          <h2 className="text-2xl font-bold my-8">Login</h2>
          <form>
            <div className="relative">
              <input
                id="email"
                name="email"
                type="email"
                className="peer vy-input"
                placeholder="E-mail"
              />
              <label htmlFor="email" className="vy-label">
                E-mail
              </label>
              <AtSymbolIcon className="w-5 absolute top-1/2 -translate-y-1/2 left-2 text-gray-800 dark:text-white peer-focus-visible:text-gray-800 peer-focus-visible:dark:text-white peer-placeholder-shown:text-gray-500" />
            </div>
            <div className="relative mt-6">
              <input
                id="password"
                name="password"
                type="password"
                className="peer vy-input"
                placeholder="Password"
              />
              <label htmlFor="password" className="vy-label">
                Password
              </label>
              <KeyIcon className="w-5 absolute top-1/2 -translate-y-1/2 left-2 text-gray-800 dark:text-white peer-focus-visible:text-gray-800 peer-focus-visible:dark:text-white peer-placeholder-shown:text-gray-500" />
            </div>
            <div className="mt-10">
              <button className="bg-blue-600 text-white text-xl px-3 py-2 rounded-md shadow-lg shadow-gray-600 dark:shadow-black/50 w-full  hover:bg-blue-800 transition-all">
                Login
              </button>
            </div>
            <div className="mt-12">
              <p className="text-sm font-medium text-gray-500">
                Don&apos;t have account?
                <Link className="text-blue-600 text-base ml-2" href="/register">
                  Register
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
