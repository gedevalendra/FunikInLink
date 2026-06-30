"use client";

import { useState } from "react";
import Sidebar from "../ui/sidebar";

export default function Header() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <>
      {/* PERBAIKAN DI SINI: bg-white/80 dan backdrop-blur-md */}
      <div className="w-full sticky top-0 flex items-center justify-between bg-white/80 backdrop-blur-md shadow-sm px-[5%] py-3 z-30">
        
        {/* Logo */}
        <h1 className="font-bold w-fit flex items-center">
          Funik
          <span className="text-yellow-500">In</span>
          <span className="flex items-center justify-center gap-1 mx-2 bg-yellow-500 p-1 px-2 text-xs rounded-xs text-white">
            Link
          </span>
        </h1>

        {/* Tombol Menu/Hamburger */}
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="flex items-center cursor-pointer p-2 rounded-lg text-gray-700 hover:bg-gray-100 active:outline outline-gray-300 transition-all"
        >
          <i className="bx bx-menu text-2xl"></i>
        </button>
      </div>

      {/* Komponen Sidebar dipanggil di sini */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
    </>
  );
}