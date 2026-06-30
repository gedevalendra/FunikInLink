"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface HeroProps {
  session: any;
  userUsername: string;
}

export default function InteractiveHero({ session, userUsername }: HeroProps) {
  // 1. Animasi Teks Berganti
  const words = [
    "Semua Kreativitasmu",
    "Semua Portofoliomu",
    "Bisnis Digitalmu",
    "Media Sosialmu",
    "FunikIn Link",
  ];
  const [wordIndex, setWordIndex] = useState(0);
  const [fade, setFade] = useState(true);

  // 2. Animasi Efek Mengetik Username
  const targetText = "username_kamu";
  const [typedText, setTypedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    // Looping Teks Judul Utama
    const wordInterval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setWordIndex((prev) => (prev + 1) % words.length);
        setFade(true);
      }, 400);
    }, 3000);

    return () => clearInterval(wordInterval);
  }, []);

  // Logika Efek Mengetik Ketik-Hapus Looping
  useEffect(() => {
    let timer: NodeJS.Timeout;
    const handleTyping = () => {
      if (!isDeleting) {
        setTypedText(targetText.substring(0, typedText.length + 1));
        if (typedText === targetText) {
          timer = setTimeout(() => setIsDeleting(true), 2000); // Jeda sebelum hapus
        } else {
          timer = setTimeout(handleTyping, 100);
        }
      } else {
        setTypedText(targetText.substring(0, typedText.length - 1));
        if (typedText === "") {
          setIsDeleting(false);
          timer = setTimeout(handleTyping, 500); // Jeda sebelum mulai ketik lagi
        } else {
          timer = setTimeout(handleTyping, 60);
        }
      }
    };

    timer = setTimeout(handleTyping, 100);
    return () => clearTimeout(timer);
  }, [typedText, isDeleting]);

  return (
    <main className="relative flex-grow flex flex-col items-center justify-center text-center px-4 sm:px-6 w-full mx-auto overflow-hidden min-h-[90vh] z-0 bg-[#FAFAFA] pt-12 md:pt-20">
      
      {/* CSS CUSTOM UNTUK GRID BACKDROP & CAHAYA SCANNING */}
      <style>{`
        @keyframes sweepX {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100vw); }
        }
        .animate-sweep-x {
          animation: sweepX 8s linear infinite;
        }
      `}</style>

      {/* BACKGROUND GRID PATTERN & GRADIENT AURA */}
      {isMounted && (
        <>
          <div
            className="absolute inset-0 z-0 pointer-events-none opacity-40"
            style={{
              backgroundImage: `linear-gradient(to right, #e2e8f0 1px, transparent 1px), linear-gradient(to bottom, #e2e8f0 1px, transparent 1px)`,
              backgroundSize: "50px 50px",
            }}
          />
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-yellow-400/10 rounded-full blur-[120px] pointer-events-none z-0" />
          <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
            <div className="absolute top-0 bottom-0 left-0 w-[500px] bg-gradient-to-r from-transparent via-yellow-500/5 via-50% to-transparent animate-sweep-x" />
          </div>
        </>
      )}

      {/* KONTEN UTAMA */}
      <div className="relative z-10 w-full max-w-4xl space-y-6 sm:space-y-8 flex flex-col items-center">
        
        {/* 1. ANIMASI FLIP 3D BOX ICON (Menggunakan Framer Motion) */}
        <motion.div
          animate={{ 
            rotateY: [0, 180, 180, 360, 360],
            y: [0, -6, 0, -6, 0]
          }}
          transition={{ 
            duration: 6, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
          style={{ transformStyle: "preserve-3d" }}
          className="w-16 h-16 sm:w-20 sm:h-20 bg-slate-900 rounded-2xl flex items-center justify-center shadow-xl cursor-pointer border border-slate-800"
        >
          <i className="bx bx-link text-3xl sm:text-4xl text-yellow-400"></i>
        </motion.div>

        {/* 2. JUDUL UTAMA DENGAN FORMAT "FunikIn" */}
        <h1 className="font-black tracking-tight text-slate-900 leading-tight min-h-[90px] min-[400px]:min-h-[100px] sm:min-h-[120px] md:min-h-[150px] text-3xl min-[400px]:text-4xl sm:text-5xl md:text-6xl max-w-2xl">
          Satu Tautan untuk <br />
          <span
            className={`inline-block transition-all duration-500 transform ${
              fade ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
            }`}
          >
            {words[wordIndex] === "FunikIn Link" ? (
              <span className="text-black">
                Funik<span className="text-yellow-500">In</span> Link
              </span>
            ) : (
              <span className="text-yellow-500">{words[wordIndex]}</span>
            )}
          </span>
        </h1>

        {/* 3. MOCKUP SEARCH BAR / URL IPHONE DENGAN EFEK MENGETIK */}
        <div className="w-full max-w-md bg-white border border-slate-200 shadow-sm rounded-full px-5 py-2.5 flex items-center gap-2.5 mx-auto font-sans">
          <div className="flex gap-1.5 shrink-0">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
          </div>
          <div className="flex-1 text-left text-xs sm:text-sm text-slate-400 truncate select-none flex items-center font-mono">
            <i className="bx bx-lock-alt text-emerald-500 mr-1.5 text-sm shrink-0"></i>
            <span className="text-slate-600">https://funikin.it.com/</span>
            <span className="text-yellow-600 font-semibold">{typedText}</span>
            <span className="w-1 h-4 bg-yellow-500 ml-0.5 animate-pulse shrink-0" />
          </div>
          <i className="bx bx-refresh text-slate-400 text-lg shrink-0"></i>
        </div>

        {/* DESKRIPSI */}
        <p className="text-sm sm:text-base md:text-lg text-slate-500 max-w-md md:max-w-xl mx-auto leading-relaxed font-normal px-4">
          Kelola portofolio, media sosial, dan tautan pentingmu dalam satu halaman profil kustom yang indah, cepat, dan responsif.
        </p>

        {/* TOMBOL BERANDA */}
        <div className="pt-2">
          {session ? (
            <Link
              href={`/${userUsername}`}
              className="bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-3 px-6 sm:py-3.5 sm:px-8 rounded-xl transition-all shadow-md hover:shadow-lg inline-block active:scale-95 text-sm sm:text-base border border-yellow-600/20"
            >
              Halo, {userUsername}! Ke Profil Saya
            </Link>
          ) : (
            <Link
              href="/registrasi"
              className="bg-slate-900 hover:bg-slate-800 text-white font-medium py-3 px-6 sm:py-3.5 sm:px-8 rounded-xl transition-all shadow-md hover:shadow-lg inline-block active:scale-95 text-sm sm:text-base"
            >
              Buat Funik<span className="text-yellow-400">In</span> Link Gratis
            </Link>
          )}
        </div>

        {/* 4. TAMPILAN PREMIUM: IOS APP VIEW PREVIEW (MOCKUP GAWAI MELAYANG) */}
        <div className="w-full pt-10 pb-4 flex justify-center perspective-[1000px]">
          <motion.div 
            initial={{ y: 40, opacity: 0, rotateX: 10 }}
            animate={{ y: 0, opacity: 1, rotateX: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="w-[280px] h-[380px] sm:w-[320px] sm:h-[430px] bg-slate-950 rounded-[40px] p-3 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.3)] border-4 border-slate-800 relative overflow-hidden flex flex-col"
          >
            {/* Dynamic Island iPhone */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-24 h-4 bg-black rounded-full z-30 flex items-center justify-end px-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-900/40" />
            </div>

            {/* iOS App View Content */}
            <div className="w-full h-full bg-white rounded-[32px] overflow-hidden flex flex-col p-4 relative text-left">
              {/* Top Safari Mini Header */}
              <div className="w-full bg-slate-50 border border-slate-100 py-1 px-3 rounded-full text-[9px] font-mono text-slate-400 mb-5 flex items-center justify-between mt-2">
                <span className="truncate">funikin.it.com/{userUsername || "kamu"}</span>
                <i className="bx bx-redo text-slate-300"></i>
              </div>

              {/* Simulasi Profil User Dalam Mockup */}
              <div className="flex flex-col items-center text-center space-y-2 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-yellow-400 to-amber-500 flex items-center justify-center font-bold text-white text-xs shadow-sm">
                  FI
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800 flex items-center justify-center gap-0.5">
                    Your Name <i className="bx bxs-badge-check text-blue-500 text-[10px]"></i>
                  </h4>
                  <p className="text-[9px] text-slate-400 font-mono">@ {userUsername || "username"}</p>
                </div>
              </div>

              {/* Simulasi Tautan Link List */}
              <div className="space-y-2 flex-1 overflow-hidden">
                <div className="w-full py-2 px-3 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-medium text-slate-700 flex items-center gap-2 hover:bg-slate-100/50 transition-colors">
                  <i className="bx bxl-instagram text-slate-600 text-xs"></i> Ikuti Instagram Saya
                </div>
                <div className="w-full py-2 px-3 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-medium text-slate-700 flex items-center gap-2 hover:bg-slate-100/50 transition-colors">
                  <i className="bx bxl-linkedin text-slate-600 text-xs"></i> Hubungkan via LinkedIn
                </div>
                <div className="w-full py-2 px-3 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-medium text-slate-700 flex items-center gap-2 hover:bg-slate-100/50 transition-colors">
                  <i className="bx bx-globe text-slate-600 text-xs"></i> Kunjungi Website Portofolio
                </div>
              </div>

              {/* Bottom iOS Indicator bar */}
              <div className="w-20 h-1 bg-slate-200 rounded-full mx-auto mt-auto shrink-0" />
            </div>
          </motion.div>
        </div>

      </div>
    </main>
  );
}