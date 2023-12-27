import Link from "next/link";

const Sidebar = ({ isVisible, handleVisible }) => {
  return (
    <div
      className={`fixed top-0 left-0 w-72 h-screen bg-gray-50 dark:bg-slate-800 shadow-lg z-10  transition-all ${
        isVisible ? "" : "-translate-x-72"
      } md:translate-x-0`}
      onClick={() => handleVisible(false)}
    >
      <div className="flex justify-center items-center h-16 shadow-lg dark:shadow-black/50 ring-1 ring-gray-300/50 dark:ring-black/50">
        <h2 className="text-3xl font-bold">Algo Link</h2>
      </div>
      <div className="pl-2 md:pl-4 py-6">
        <ul className="flex flex-col gap-2">
          <li>
            {/* TODO: Add Iocns */}
            <Link
              className="block pl-16 py-3 font-medium bg-blue-600 text-white"
              href="/"
            >
              Dashboard
            </Link>
          </li>
          <li className="block pl-16 py-3 font-medium bg-gray-300/50 dark:bg-gray-600 hover:bg-blue-400 hover:text-white transition-all">
            <Link href="/">Dashboard</Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
