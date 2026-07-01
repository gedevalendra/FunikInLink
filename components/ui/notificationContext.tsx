"use client";

import React, { createContext, useState, useEffect, ReactNode, useContext } from "react";

// 1. Definisi Tipe Data untuk State Toast
type ToastType = "success" | "error" | "info";

interface ToastState {
  isOpen: boolean;
  message: string;
  type: ToastType;
}

interface NotificationContextType {
  showAlert: (message: string, type?: ToastType) => void;
}

// 2. Inisialisasi Context dengan Type Safety
const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<ToastState>({ isOpen: false, message: "", type: "info" });
  const [progress, setProgress] = useState<number>(100);

  // Fungsi internal untuk memicu custom toast alert
  const showAlert = (message: string, type: ToastType = "info") => {
    setProgress(100); // Reset progress bar setiap ada alert baru
    setToast({ isOpen: true, message, type });
  };

  useEffect(() => {
    // 3. MEMBAJAK (OVERRIDE) WINDOW.ALERT BAWAAN BROWSER
    window.alert = (message: any) => {
      const msgString = String(message);
      let type: ToastType = "info";
      const msgLower = msgString.toLowerCase();
      
      if (msgLower.includes("berhasil") || msgLower.includes("sukses") || msgLower.includes("aktif")) {
        type = "success";
      } else if (
        msgLower.includes("gagal") || 
        msgLower.includes("salah") || 
        msgLower.includes("wajib") || 
        msgLower.includes("kosong") ||
        msgLower.includes("error")
      ) {
        type = "error";
      }

      showAlert(msgString, type);
    };
  }, []);

  // 4. Handler untuk animasi penyusutan Progress Bar (Total 3.5 detik / 3500ms)
  useEffect(() => {
    if (toast.isOpen) {
      const intervalTime = 35; // Update setiap 35ms
      const decrement = 100 / (3500 / intervalTime);

      const timer = setInterval(() => {
        setProgress((prev) => {
          if (prev <= 0) {
            clearInterval(timer);
            setToast((t) => ({ ...t, isOpen: false }));
            return 0;
          }
          return prev - decrement;
        });
      }, intervalTime);

      return () => clearInterval(timer);
    }
  }, [toast.isOpen]);

  // Pemetaan class warna tailwind dinamis berdasarkan tipe data toast
  const themeClasses = {
    success: {
      border: "border-emerald-500/20",
      bgIcon: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
      bar: "bg-emerald-600",
      glow: "bg-emerald-500/10"
    },
    error: {
      border: "border-rose-500/20",
      bgIcon: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
      bar: "bg-rose-600",
      glow: "bg-rose-500/10"
    },
    info: {
      border: "border-slate-500/20",
      bgIcon: "bg-slate-900/10 text-slate-900 dark:bg-white/10 dark:text-white border-slate-500/20",
      bar: "bg-slate-900 dark:bg-white",
      glow: "bg-slate-500/5"
    }
  };

  const currentTheme = themeClasses[toast.type];

  return (
    <NotificationContext.Provider value={{ showAlert }}>
      {children}

      {/* UI TOAST PREMIUM DENGAN GLOW & PROGRESS BAR */}
      {toast.isOpen && (
        <div className="fixed z-[9999] max-w-[340px] w-full p-2 transition-all duration-500 md:top-5 md:right-5 md:left-auto md:translate-x-0 top-4 left-1/2 -translate-x-1/2">
          <div className={`relative overflow-hidden flex items-center pl-3.5 pr-2.5 py-3 rounded-md border ${currentTheme.border} bg-white/90 dark:bg-slate-950/90 backdrop-blur-xl shadow-md`}>
            
            {/* Dekorasi Glow Ringan di Background Belakang Ikon */}
            <div className={`absolute -left-4 top-1/2 -translate-y-1/2 w-12 h-12 ${currentTheme.glow} blur-xl rounded-full pointer-events-none`}></div>

            {/* Bagian Kiri: Ikon dengan Desain Bingkai Lingkaran Minimalis */}
            <div className={`mr-3 flex items-center justify-center w-7 h-7 rounded-md ${currentTheme.bgIcon} border flex-shrink-0 text-sm`}>
              {toast.type === "success" && (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10s-10-4.477-10-10s4.477-10 10-10zm2.293 7.293a1 1 0 0 0 -1.414 0l-3.293 3.293l-1.293 -1.293a1 1 0 0 0 -1.414 1.414l2 2a1 1 0 0 0 1.414 0l4 -4a1 1 0 0 0 0 -1.414z"/>
                </svg>
              )}
              {toast.type === "error" && (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 1.67a3 3 0 0 1 2.53 1.39l8.16 14.28a3 3 0 0 1 -2.53 4.66h-16.32a3 3 0 0 1 -2.53 -4.66l8.16 -14.28a3 3 0 0 1 2.53 -1.39zm0 11.33a1 1 0 0 0 -1 1v2a1 1 0 0 0 2 0v-2a1 1 0 0 0 -1 -1zm0 -4a1 1 0 0 0 -1 1v2a1 1 0 0 0 2 0v-2a1 1 0 0 0 -1 -1z"/>
                </svg>
              )}
              {toast.type === "info" && (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10s-10-4.477-10-10s4.477-10 10-10zm0 9h-1a1 1 0 0 0 0 2h1v3a1 1 0 0 0 2 0v-4a1 1 0 0 0 -1 -1zm0 -4a1.25 1.25 0 1 0 0 2.5a1.25 1.25 0 0 0 0 -2.5z"/>
                </svg>
              )}
            </div>

            {/* Bagian Tengah: Konten Teks Berita */}
            <div className="flex-1 pr-1 text-left">
              <p className="text-[11px] font-bold tracking-wide uppercase text-slate-400 mb-0.5">
                {toast.type}
              </p>
              <p className="text-[11.5px] font-medium leading-relaxed text-slate-700 dark:text-slate-300">
                {toast.message}
              </p>
            </div>

            {/* Bagian Kanan: Tombol Close Transparan */}
            <button 
              onClick={() => setToast((prev) => ({ ...prev, isOpen: false }))}
              className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 flex-shrink-0"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>

            {/* Bagian Bawah: Animated Progress Bar */}
            <div className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-slate-100 dark:bg-slate-800/50">
              <div 
                className={`h-full ${currentTheme.bar} transition-all ease-linear`}
                style={{ width: `${progress}%` }}
              ></div>
            </div>

          </div>
        </div>
      )}
    </NotificationContext.Provider>
  );
}

// Custom hook pembantu jika sewaktu-waktu butuh memanggil toast manual tanpa string template window.alert
export function useNotification() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotification harus digunakan di dalam NotificationProvider");
  }
  return context;
}