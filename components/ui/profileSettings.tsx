"use client";

import { useState } from "react";

export default function ProfileSettings() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="p-1 text-gray-400 hover:text-gray-900 transition-colors rounded-md"
      >
        <i className="bx bx-cog text-xl"></i>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1 w-40 bg-white border border-gray-200 rounded-lg shadow-md py-1 z-10 text-sm">
          <button 
            onClick={() => alert("Fitur Edit Profile segera hadir")}
            className="w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-50 flex items-center gap-2"
          >
            <i className="bx bx-edit"></i> Edit Profile
          </button>
          <button 
            onClick={() => alert("Link disalin!")}
            className="w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-50 flex items-center gap-2"
          >
            <i className="bx bx-share-alt"></i> Share
          </button>
        </div>
      )}
    </div>
  );
}