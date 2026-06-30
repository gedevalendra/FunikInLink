"use client";

import { useState } from "react";
import { updateProfile } from "../../lib/actions"; // sesuaikan letak folder actions kamu

interface Props {
  user: any;
}

export default function OnboardingModal({ user }: Props) {
  const [isOpen, setIsOpen] = useState(true);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-[99] flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl animate-fadeIn">
        <div className="text-center mb-4">
          <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2 text-yellow-600 text-xl">
            <i className="bx bx-party"></i>
          </div>
          <h3 className="font-bold text-xl text-gray-800">Selamat Datang di FunikIn!</h3>
          <p className="text-xs text-gray-500 mt-1">Yuk, atur dan klaim username kustom unikmu sebelum membuat halaman link pertamamu.</p>
        </div>
        
        <form action={async (formData) => {
          try {
            await updateProfile(formData);
            setIsOpen(false); 
            // Ambil input username yang diketik untuk pengalihan halaman instan ke rute baru
            const inputUser = formData.get("username") as string;
            const targetRoute = inputUser ? inputUser.toLowerCase().trim().replace(/\s+/g, "-") : user.username;
            window.location.href = `/${targetRoute}`;
          } catch (err: any) {
            alert(err.message || "Terjadi kesalahan saat menyimpan data.");
          }
        }} className="space-y-4">
          
          <input type="hidden" name="userId" value={user._id.toString()} />

          <div>
            <label className="text-xs font-bold text-gray-400 uppercase">Klaim Username Kustom</label>
            <div className="flex items-center mt-1 border border-gray-200 rounded-lg focus-within:border-yellow-500 overflow-hidden px-2.5 bg-white">
              <span className="text-sm text-gray-400 select-none">funikin.it.com/</span>
              <input 
                name="username" 
                defaultValue={user.username} 
                required 
                placeholder="username_baru"
                pattern="^[a-zA-Z0-9_-]+$"
                title="Hanya huruf, angka, underscore, dan tanda hubung tanpa spasi."
                className="w-full p-2.5 text-sm outline-none pl-0.5 font-medium text-yellow-600" 
                onChange={(e) => {
                  e.target.value = e.target.value.toLowerCase().replace(/\s+/g, "-");
                }}
              />
            </div>
            <p className="text-[10px] text-gray-400 mt-1">Hanya huruf kecil, angka, tanda hubung (-), dan underscore (_).</p>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-400 uppercase">Nama Profil</label>
            <input name="name" defaultValue={user.name} required className="w-full mt-1 p-2.5 border border-gray-200 rounded-lg text-sm focus:border-yellow-500 outline-none" />
          </div>

          <div>
            <label className="text-xs font-bold text-gray-400 uppercase">Bio Singkat</label>
            <textarea name="bio" placeholder="Halo, selamat datang di tautan resmi saya!" rows={2} className="w-full mt-1 p-2.5 border border-gray-200 rounded-lg text-sm focus:border-yellow-500 outline-none resize-none" />
          </div>
          
          <button type="submit" className="w-full py-3 bg-gray-900 text-white rounded-lg text-sm font-semibold hover:bg-black mt-2 transition-all">
            Selesai & Buat Halaman Profil!
          </button>
        </form>
      </div>
    </div>
  );
}