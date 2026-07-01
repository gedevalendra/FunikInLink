"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CustomizeProfileModal({ user, onClose }: { user: any, onClose: () => void }) {
  // State kustomisasi (Idealnya ini mengambil dari user.settings di database)
  const [config, setConfig] = useState({
    background: user.customization?.background || "#f8fafc",
    isBlur: user.customization?.isBlur || false,
    rounded: user.customization?.rounded || "rounded-xl",
    profileBorder: user.customization?.profileBorder || "none",
    linkStyle: user.customization?.linkStyle || "solid",
    showPopup: user.customization?.showPopup || false,
    popupMessage: user.customization?.popupMessage || "Halo! Selamat datang di profil saya.",
  });

  const [loading, setLoading] = useState(false);
const router = useRouter();

const handleSave = async () => {
  setLoading(true);
  try {
    const response = await fetch("/api/profile/customize", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(config),
    });

    const result = await response.json();

    if (response.ok) {
      router.refresh(); // Memicu Server Component (page.tsx) untuk mengambil data terbaru
      alert("Kustomisasi berhasil diterapkan secara permanen!");
      onClose();
    } else {
      alert(result.error || "Gagal menyimpan perubahan");
    }
  } catch (error) {
    console.error(error);
    alert("Terjadi kesalahan jaringan.");
  } finally {
    setLoading(false);
  }
};
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-4 border-b flex justify-between items-center bg-gray-50">
          <h2 className="font-bold text-gray-800 flex items-center gap-2">
            <i className="bx bx-palette text-indigo-500 text-xl"></i> Kustomisasi Tampilan
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
        </div>

        {/* Content - Scrollable */}
        <div className="p-5 overflow-y-auto space-y-6">
          
          {/* 1. Background Halaman */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Background Halaman</label>
            <div className="flex gap-3 items-center">
              <input 
                type="color" 
                value={config.background}
                onChange={(e) => setConfig({...config, background: e.target.value})}
                className="w-10 h-10 rounded-md cursor-pointer border-none"
              />
              <input 
                type="text"
                value={config.background}
                onChange={(e) => setConfig({...config, background: e.target.value})}
                className="flex-1 border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-indigo-500"
                placeholder="#hexcode"
              />
            </div>
          </div>

          {/* 2. Gaya Elemen (Blur & Rounded) */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Efek Glassmorphism</label>
              <button 
                onClick={() => setConfig({...config, isBlur: !config.isBlur})}
                className={`w-full py-2 rounded-md border text-sm transition-all ${config.isBlur ? 'bg-indigo-50 border-indigo-500 text-indigo-600' : 'bg-white border-gray-200 text-gray-600'}`}
              >
                {config.isBlur ? 'Blur Aktif' : 'Tanpa Blur'}
              </button>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Lekukan (Rounded)</label>
              <select 
                value={config.rounded}
                onChange={(e) => setConfig({...config, rounded: e.target.value})}
                className="w-full border border-gray-200 rounded-md px-2 py-2 text-sm focus:outline-indigo-500"
              >
                <option value="rounded-none">Tajam (None)</option>
                <option value="rounded-md">Sedang (MD)</option>
                <option value="rounded-2xl">Membulat (2XL)</option>
                <option value="rounded-full">Lingkaran (Full)</option>
              </select>
            </div>
          </div>

          {/* 3. Dekorasi Foto Profil */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Border Foto Profil</label>
            <div className="grid grid-cols-3 gap-2">
              {['none', 'ring-indigo-500', 'ring-yellow-400', 'ring-red-500', 'ring-offset-2'].map((border) => (
                <button
                  key={border}
                  onClick={() => setConfig({...config, profileBorder: border})}
                  className={`py-2 text-xs border rounded-md capitalize ${config.profileBorder === border ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200'}`}
                >
                  {border === 'none' ? 'Polos' : border.split('-')[1]}
                </button>
              ))}
            </div>
          </div>

          {/* 4. Gaya Tautan (Link) */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Gaya Tombol Tautan</label>
            <select 
              value={config.linkStyle}
              onChange={(e) => setConfig({...config, linkStyle: e.target.value})}
              className="w-full border border-gray-200 rounded-md px-2 py-2 text-sm focus:outline-indigo-500"
            >
              <option value="solid">Solid (Warna Penuh)</option>
              <option value="outline">Outline (Garis Tepi)</option>
              <option value="shadow">Shadow (Bayangan)</option>
            </select>
          </div>

          {/* 5. Pop Up Pesan */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
            <div className="flex justify-between items-center mb-3">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Aktifkan Pop-up Sambutan</label>
              <input 
                type="checkbox" 
                checked={config.showPopup}
                onChange={(e) => setConfig({...config, showPopup: e.target.checked})}
                className="w-4 h-4 accent-indigo-500"
              />
            </div>
            {config.showPopup && (
              <textarea 
                value={config.popupMessage}
                onChange={(e) => setConfig({...config, popupMessage: e.target.value})}
                className="w-full border border-gray-200 rounded-md p-3 text-sm focus:outline-indigo-500 min-h-[80px]"
                placeholder="Tulis pesan sambutan..."
              />
            )}
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t flex gap-3">
          <button 
            onClick={onClose}
            className="flex-1 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
          >
            Batal
          </button>
          <button 
            onClick={handleSave}
            disabled={loading}
            className="flex-1 py-2.5 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-lg shadow-indigo-200 transition-all disabled:opacity-50"
          >
            {loading ? 'Menyimpan...' : 'Terapkan'}
          </button>
        </div>

      </div>
    </div>
  );
}