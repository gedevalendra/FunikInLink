"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CustomizeProfileModal({ user, onClose }: { user: any, onClose: () => void }) {
  // State kustomisasi (Mengambil konfigurasi simpanan dari database tanpa opsi background)
  const [config, setConfig] = useState({
    isBlur: user.customization?.isBlur || false,
    rounded: user.customization?.rounded || "rounded-xl",
    profileBorder: user.customization?.profileBorder || "none",
    linkStyle: user.customization?.linkStyle || "solid",
    showPopup: user.customization?.showPopup || false,
    popupMessage: user.customization?.popupMessage || "Halo! Selamat datang di profil saya.",
  });

  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // EFFECT: Mengunci scroll pada background halaman saat modal terbuka (Scroll Lock)
  useEffect(() => {
    // Simpan style overflow asli bawaan body halaman
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = "hidden";

    // Kembalikan ke style asli saat modal ditutup/unmount
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

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
        onClose();
      } else {
        alert(result.error || "Gagal menyimpan perubahan");
      }
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan jaringan.");
    } finally {
      loading;
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 [animation:fadeIn_0.2s_ease-out_forwards]">
      
      {/* Kustomisasi Inline Keyframe Tailwind CSS untuk Animasi Slide Up & Fade In */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-slide-up-custom {
          animation: slideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}} />

      {/* Container Modal: Fullscreen di Mobile (slide up), Box Center di Desktop */}
      <div className="bg-white w-full max-w-md rounded-t-2xl sm:rounded-xl shadow-2xl overflow-hidden flex flex-col h-[90vh] sm:h-auto max-h-[85vh] border border-slate-200/60 transition-all transform animate-slide-up-custom sm:[animation:none] sm:scale-100">
        
        {/* HEADER MODAL */}
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h2 className="font-bold text-xs uppercase tracking-wider text-slate-800 flex items-center gap-2">
            <i className="bx bx-palette text-slate-900 text-base"></i> Kustomisasi Tampilan
          </h2>
          <button 
            onClick={onClose} 
            className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-all text-xl p-1.5 flex items-center justify-center"
          >
            <i className="bx bx-x"></i>
          </button>
        </div>

        {/* KONTEN - SCROLLABLE */}
        <div className="p-5 overflow-y-auto space-y-6 no-scrollbar flex-grow">
          
          {/* 1. Gaya Elemen (Blur & Rounded) */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Efek Glassmorphism
              </label>
              <button 
                type="button"
                onClick={() => setConfig({...config, isBlur: !config.isBlur})}
                className={`w-full py-2.5 px-3 rounded-lg border text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
                  config.isBlur 
                    ? 'bg-slate-950 border-slate-950 text-white shadow-sm' 
                    : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                <i className={`bx ${config.isBlur ? 'bx-check-circle' : 'bx-circle'} text-sm`}></i>
                {config.isBlur ? 'Blur Aktif' : 'Tanpa Blur'}
              </button>
            </div>
            
            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Lekukan Elemen
              </label>
              <div className="relative">
                <select 
                  value={config.rounded}
                  onChange={(e) => setConfig({...config, rounded: e.target.value})}
                  className="w-full border border-slate-200 rounded-lg pl-3 pr-8 py-2.5 text-xs text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-slate-950/10 focus:border-slate-950 transition-all appearance-none cursor-pointer"
                >
                  <option value="rounded-none">Siku Tajam (None)</option>
                  <option value="rounded-md">Sedang (MD)</option>
                  <option value="rounded-xl">Membulat Premium (XL)</option>
                  <option value="rounded-3xl">Sangat Bulat (3XL)</option>
                </select>
                <i className="bx bx-chevron-down absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-base"></i>
              </div>
            </div>
          </div>

          {/* 2. Dekorasi Foto Profil */}
          <div className="space-y-2">
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Bingkai Foto Profil
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                { key: 'none', label: 'Polos' },
                { key: 'ring-slate-950', label: 'Gelap' },
                { key: 'ring-amber-400', label: 'Emas' },
                { key: 'ring-blue-500', label: 'Verifikasi' },
                { key: 'ring-offset-2', label: 'Jarak Spasi' }
              ].map((item) => (
                <button
                  type="button"
                  key={item.key}
                  onClick={() => setConfig({...config, profileBorder: item.key})}
                  className={`py-2.5 px-2 text-[11px] font-medium border rounded-lg transition-all truncate ${
                    config.profileBorder === item.key 
                      ? 'border-slate-950 bg-slate-950 text-white font-bold shadow-sm' 
                      : 'border-slate-200 text-slate-600 bg-white hover:border-slate-300'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* 3. Gaya Tautan (Link) */}
          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Gaya Tombol Tautan
            </label>
            <div className="relative">
              <select 
                value={config.linkStyle}
                onChange={(e) => setConfig({...config, linkStyle: e.target.value})}
                className="w-full border border-slate-200 rounded-lg pl-3 pr-8 py-2.5 text-xs text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-slate-950/10 focus:border-slate-950 transition-all appearance-none cursor-pointer"
              >
                <option value="solid">Minimalis Solid (Warna Penuh)</option>
                <option value="outline">Clean Outline (Garis Tepi)</option>
                <option value="shadow">Soft Shadow (Efek Bayangan)</option>
              </select>
              <i className="bx bx-chevron-down absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-base"></i>
            </div>
          </div>

          {/* 4. Pop Up Pesan */}
          <div className="bg-slate-50 border border-slate-200/80 p-4 rounded-xl space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5 cursor-pointer select-none" htmlFor="popup-toggle">
                <i className="bx bx-message-detail text-base text-slate-700"></i> Pop-up Sambutan
              </label>
              <div className="relative inline-flex items-center cursor-pointer">
                <input 
                  id="popup-toggle"
                  type="checkbox" 
                  checked={config.showPopup}
                  onChange={(e) => setConfig({...config, showPopup: e.target.checked})}
                  className="sr-only peer"
                />
                <div className="w-8 h-4 bg-slate-200 rounded-full peer peer-focus:ring-0 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-slate-950"></div>
              </div>
            </div>
            {config.showPopup && (
              <textarea 
                value={config.popupMessage}
                onChange={(e) => setConfig({...config, popupMessage: e.target.value})}
                className="w-full bg-white border border-slate-200 rounded-lg p-3 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-950/10 focus:border-slate-950 transition-all min-h-[80px] resize-none [animation:fadeIn_0.2s_ease-out_forwards]"
                placeholder="Tulis pesan salam pembuka..."
                maxLength={150}
              />
            )}
          </div>

        </div>

        {/* FOOTER MODAL - FIXED BOTTOM */}
        <div className="p-4 border-t border-slate-100 flex gap-3 bg-slate-50/50 pb-6 sm:pb-4">
          <button 
            type="button"
            onClick={onClose}
            disabled={loading}
            className="flex-1 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors disabled:opacity-50"
          >
            Batal
          </button>
          <button 
            type="button"
            onClick={handleSave}
            disabled={loading}
            className="flex-1 py-2.5 text-xs font-bold text-white bg-slate-950 hover:bg-slate-800 rounded-lg transition-all shadow-md active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-1.5"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-3.5 w-3.5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Menyimpan...
              </>
            ) : (
              'Terapkan'
            )}
          </button>
        </div>

      </div>
    </div>
  );
}