"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CustomizeProfileModal({ user, onClose }: { user: any, onClose: () => void }) {
  // State kustomisasi (Mengambil konfigurasi simpanan dari database)
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
        router.refresh(); // Memicu Server Component untuk menarik data terbaru
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
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-[100] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-md shadow-xl overflow-hidden flex flex-col max-h-[85vh] border border-slate-200/60">
        
        {/* HEADER MODAL */}
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h2 className="font-bold text-xs uppercase tracking-wider text-slate-800 flex items-center gap-2">
            <i className="bx bx-palette text-slate-900 text-base"></i> Kustomisasi Tampilan
          </h2>
          <button 
            onClick={onClose} 
            className="text-slate-400 hover:text-slate-600 transition-colors text-xl p-1 flex items-center justify-center"
          >
            <i className="bx bx-x"></i>
          </button>
        </div>

        {/* KONTEN - SCROLLABLE */}
        <div className="p-5 overflow-y-auto space-y-5 no-scrollbar">
          
          {/* 1. Background Halaman */}
          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Background Halaman
            </label>
            <div className="flex gap-2 items-center">
              <input 
                type="color" 
                value={config.background}
                onChange={(e) => setConfig({...config, background: e.target.value})}
                className="w-9 h-9 rounded-md cursor-pointer border border-slate-200 p-0 overflow-hidden shrink-0"
              />
              <input 
                type="text"
                value={config.background}
                onChange={(e) => setConfig({...config, background: e.target.value})}
                className="flex-1 border border-slate-200 rounded-md px-3 py-2 text-xs font-mono text-slate-700 focus:outline-none focus:border-slate-950 transition-colors"
                placeholder="#hexcode"
              />
            </div>
          </div>

          {/* 2. Gaya Elemen (Blur & Rounded) */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Efek Glassmorphism
              </label>
              <button 
                onClick={() => setConfig({...config, isBlur: !config.isBlur})}
                className={`w-full py-2 px-3 rounded-md border text-xs font-semibold transition-all ${
                  config.isBlur 
                    ? 'bg-slate-950 border-slate-950 text-white' 
                    : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                {config.isBlur ? 'Blur Aktif' : 'Tanpa Blur'}
              </button>
            </div>
            
            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Lekukan Elemen
              </label>
              <select 
                value={config.rounded}
                onChange={(e) => setConfig({...config, rounded: e.target.value})}
                className="w-full border border-slate-200 rounded-md px-2 py-2 text-xs text-slate-700 bg-white focus:outline-none focus:border-slate-950 transition-colors"
              >
                <option value="rounded-none">Siku Tajam (None)</option>
                <option value="rounded-md">Sedang (MD)</option>
                <option value="rounded-xl">Membulat Premium (XL)</option>
                <option value="rounded-3xl">Sangat Bulat (3XL)</option>
              </select>
            </div>
          </div>

          {/* 3. Dekorasi Foto Profil */}
          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Bingkai Foto Profil
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { key: 'none', label: 'Polos' },
                { key: 'ring-slate-950', label: 'Gelap' },
                { key: 'ring-amber-400', label: 'Emas' },
                { key: 'ring-blue-500', label: 'Verifikasi' },
                { key: 'ring-offset-2', label: 'Jarak Spasi' }
              ].map((item) => (
                <button
                  key={item.key}
                  onClick={() => setConfig({...config, profileBorder: item.key})}
                  className={`py-2 px-1 text-[11px] font-medium border rounded-md transition-all truncate ${
                    config.profileBorder === item.key 
                      ? 'border-slate-950 bg-slate-50 text-slate-950 font-bold' 
                      : 'border-slate-200 text-slate-500 hover:border-slate-300'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* 4. Gaya Tautan (Link) */}
          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Gaya Tombol Tautan
            </label>
            <select 
              value={config.linkStyle}
              onChange={(e) => setConfig({...config, linkStyle: e.target.value})}
              className="w-full border border-slate-200 rounded-md px-2 py-2 text-xs text-slate-700 bg-white focus:outline-none focus:border-slate-950 transition-colors"
            >
              <option value="solid">Minimalis Solid (Warna Penuh)</option>
              <option value="outline">Clean Outline (Garis Tepi)</option>
              <option value="shadow">Soft Shadow (Efek Bayangan)</option>
            </select>
          </div>

          {/* 5. Pop Up Pesan */}
          <div className="bg-slate-50 border border-slate-200/60 p-3.5 rounded-md space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                <i className="bx bx-message-detail text-sm"></i> Pop-up Sambutan
              </label>
              <input 
                type="checkbox" 
                checked={config.showPopup}
                onChange={(e) => setConfig({...config, showPopup: e.target.checked})}
                className="w-3.5 h-3.5 accent-slate-950 cursor-pointer"
              />
            </div>
            {config.showPopup && (
              <textarea 
                value={config.popupMessage}
                onChange={(e) => setConfig({...config, popupMessage: e.target.value})}
                className="w-full bg-white border border-slate-200 rounded-md p-2.5 text-xs text-slate-700 focus:outline-none focus:border-slate-950 transition-colors min-h-[70px] resize-none"
                placeholder="Tulis pesan salam pembuka..."
              />
            )}
          </div>

        </div>

        {/* FOOTER MODAL */}
        <div className="p-4 border-t border-slate-100 flex gap-2.5 bg-slate-50/30">
          <button 
            onClick={onClose}
            className="flex-1 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100 border border-slate-200 rounded-md transition-colors"
          >
            Batal
          </button>
          <button 
            onClick={handleSave}
            disabled={loading}
            className="flex-1 py-2 text-xs font-bold text-white bg-slate-950 hover:bg-slate-800 rounded-md transition-all shadow-xs disabled:opacity-50"
          >
            {loading ? 'Menyimpan...' : 'Terapkan'}
          </button>
        </div>

      </div>
    </div>
  );
}