"use client";

import { deleteLink } from "../../lib/actions";

export default function LinkCard({ link, isAdmin }: { link: any, isAdmin: boolean }) {
  return (
    <div className="group relative flex items-start gap-4 p-3 -mx-3 rounded-xl hover:bg-gray-50 transition-colors">
      <div className="text-gray-400 group-hover:text-yellow-600 transition-colors pt-0.5 text-xl">
        <i className={`bx ${link.icon}`}></i>
      </div>

      <div className="space-y-0.5 flex-1 min-w-0">
        <h4 className="text-sm font-semibold text-gray-900">{link.title}</h4>
        {link.description && (
          <p className="text-xs text-gray-500 leading-relaxed">{link.description}</p>
        )}
        <a 
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs text-yellow-600 hover:text-yellow-700 font-medium pt-1"
        >
          {link.url.replace(/^https?:\/\//, '')}
          <i className="bx bx-link-external text-[10px]"></i>
        </a>
      </div>

      {/* TAMPILKAN TOMBOL ACTION HANYA JIKA ADMIN */}
      {isAdmin && (
        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
          <button 
            onClick={() => alert("Fitur edit spesifik akan ditambahkan di sini")}
            className="p-1.5 text-gray-400 hover:text-blue-500 rounded-md"
          >
            <i className="bx bx-edit text-lg"></i>
          </button>
          <button 
            onClick={() => {
              if(confirm("Yakin ingin menghapus tautan ini?")) {
                deleteLink(link._id.toString());
              }
            }}
            className="p-1.5 text-gray-400 hover:text-red-500 rounded-md"
          >
            <i className="bx bx-trash text-lg"></i>
          </button>
        </div>
      )}
    </div>
  );
}