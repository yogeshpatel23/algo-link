import { Bars3BottomLeftIcon } from "@heroicons/react/24/outline";
import Image from "next/image";

const Navbar = ({ handleVisible }) => {
  return (
    <div className="bg-white dark:bg-slate-800 h-16 shadow-xl sticky top-0 flex justify-between items-center px-6 md:px-8">
      <div>
        <Bars3BottomLeftIcon
          className="w-10 p-2 block md:hidden rounded-md ring-1 shadow-lg ring-gray-300/50 hover:bg-gray-400 transition-all"
          onClick={() => handleVisible(true)}
        />
      </div>
      <div>
        <h2 className="text-3xl font-bold block md:hidden">AlgoLink</h2>
      </div>
      <div className="relative">
        <Image
          width={48}
          height={48}
          alt="user Avare"
          src="/avatar1.jpg"
          className="peer rounded-full"
        />
        <div className="absolute w-32 right-0 top-14 border border-gray-500/50 shadow-lg rounded-lg bg-white dark:bg-slate-600 z-20 p-2 transition-all scale-y-0 origin-top hover:scale-y-100 peer-hover:scale-y-100">
          <div>lgtobbger</div>
          <div>orifue</div>
          <div>logout</div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
