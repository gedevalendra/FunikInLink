"use client";

import { useState, useEffect } from "react";

export default function WelcomePopup({ message }: { message: string }) {
  const [visible, setVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    // Memunculkan popup dengan sedikit delay efek halus
    const timer = setTimeout(() => setVisible(true), 400);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsLeaving(true);
    // Beri waktu animasi keluar selesai sebelum unmount komponen
    setTimeout(() => {
      setVisible(false);
    }, 200);
  };

  if (!visible) return null;

  return (
    <div 
      className={`fixed inset-0 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs z-[150] p-4 transition-opacity duration-200 ${
        isLeaving ? "opacity-0" : "opacity-100 animate-fade-in"
      }`}
    >
      {/* CARD POPUP - Menggunakan gabungan animasi:
        1. 'animate-pop-in' saat pertama kali muncul.
        2. 'animate-float-loop' (melayang atas-bawah terus menerus) setelah muncul.
      */}
      <div 
        className={`bg-white max-w-sm w-full p-6 rounded-md shadow-2xl border border-slate-100 text-center space-y-4 transition-all duration-200 ${
          isLeaving 
            ? "scale-95 opacity-0" 
            : "scale-100 opacity-100 animate-pop-in [animation-composition:accumulate] hover:[animation-play-state:paused]"
        }`}
        style={{
          // Menjalankan animasi melayang loop secara paralel setelah animasi masuk selesai
          animation: isLeaving 
            ? "none" 
            : "pop-in 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards, float-loop 3s ease-in-out infinite 0.3s"
        }}
      >
        {/* CONTAINER ICON - Ditambahkan animasi 'bx-tada' bawaan Boxicons */}

        {/* KONTEN PESAN */}
        <div className="space-y-1">
          <p className="text-sm text-slate-700 leading-relaxed font-medium px-2">
            {message}
          </p>
        </div>

        {/* BUTTON PENUTUP - Hanya tulisan 'Tutup' dengan rounded-md */}
        <button 
          type="button"
          onClick={handleClose}
          className="w-full py-2.5 bg-slate-950 text-white font-bold text-xs rounded-md hover:bg-slate-800 active:scale-[0.99] transition-all shadow-xs tracking-wide uppercase"
        >
          Tutup
        </button>
      </div>
    </div>
  );
}