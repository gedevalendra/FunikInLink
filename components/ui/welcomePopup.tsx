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
        isLeaving ? "opacity-0 animate-fade-out" : "opacity-100 animate-fade-in"
      }`}
    >
      {/* CARD POPUP - Menggunakan animasi skala masuk/keluar & kelengkungan maksimal rounded-md */}
      <div 
        className={`bg-white max-w-sm w-full p-6 rounded-md shadow-2xl border border-slate-100 text-center space-y-4 transition-all duration-200 ${
          isLeaving ? "scale-95 opacity-0" : "scale-100 opacity-100 animate-pop-in"
        }`}
      >
        {/* CONTAINER ICON - Ditambahkan animasi 'bx-tada' bawaan Boxicons agar ikon bergerak menarik */}
        <div className="w-14 h-14 bg-amber-50 text-amber-500 rounded-md flex items-center justify-center mx-auto text-2xl border border-amber-100/70 shadow-xs">
          <i className="bx bx-party bx-tada"></i>
        </div>

        {/* KONTEN PESAN */}
        <div className="space-y-1">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Pesan Sambutan</h4>
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