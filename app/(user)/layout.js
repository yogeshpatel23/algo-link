"use client";
import Navbar from "@/components/back/Navbar";
import Sidebar from "@/components/back/sidebar";
import { useState } from "react";

export default function Layout({ children }) {
  const [showSidebar, setShowSidebar] = useState(false);
  return (
    <div className="min-h-screen m-0 md:ml-72">
      <Sidebar isVisible={showSidebar} handleVisible={setShowSidebar} />
      <div className="relative">
        <Navbar handleVisible={setShowSidebar} />
        <div className="p-4 md:p-6">{children}</div>
      </div>
    </div>
  );
}
