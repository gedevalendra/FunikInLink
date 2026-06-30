"use client";

import { useState } from "react";
import { addLink } from "../../lib/actions";

export default function AddLinkModal() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="w-full py-3 mb-6 border-2 border-dashed border-gray-200 rounded-xl text-sm font-medium text-gray-500 hover:border-yellow-400 hover:text-yellow-600 transition-all flex items-center justify-center gap-2"
      >
        <i className="bx bx-plus text-lg"></i> Tambah Tautan Baru
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl animate-fadeIn">
            <h3 className="font-bold text-lg mb-4 text-gray-800">Tambah Tautan</h3>
            
            <form action={(formData) => { addLink(formData); setIsOpen(false); }} className="space-y-4">
              <input name="title" placeholder="Judul (misal: GitHub Saya)" required className="w-full p-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-yellow-500" />
              <input name="url" placeholder="URL Lengkap (misal: https://github.com/)" required className="w-full p-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-yellow-500" />
              <input name="description" placeholder="Deskripsi singkat (Opsional)" className="w-full p-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-yellow-500" />
              <input name="icon" placeholder="Icon Boxicons (misal: bxl-github)" className="w-full p-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-yellow-500" />
              
              <div className="flex gap-3 mt-6 pt-2">
                <button type="button" onClick={() => setIsOpen(false)} className="flex-1 py-2.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">Batal</button>
                <button type="submit" className="flex-1 py-2.5 bg-yellow-500 text-white rounded-lg text-sm font-medium hover:bg-yellow-600 transition-colors">Simpan Tautan</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}