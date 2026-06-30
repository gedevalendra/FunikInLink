"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface HeroProps {
  session: any;
  userUsername: string;
}

export default function InteractiveHero({ session, userUsername }: HeroProps) {
  // 1. Daftar kata ganti yang diketik di dalam Mockup Safari iOS
  const iosKeywords = ["brand", "influencer", "youtuber", "streamer", "freelancer"];
  const [iosIndex, setIosIndex] = useState(0);
  const [iosTyped, setIosTyped] = useState("");
  const [iosDeleting, setIosDeleting] = useState(false);

  // 2. Daftar frasa untuk judul utama yang dianimasikan per huruf (Slide Up)
  const words = [
    "Semua Kreativitas",
    "Semua Portofolio",
    "Bisnis Digital",
    "Media Sosial",
    "FunikIn Link",
  ];
  const [wordIndex, setWordIndex] = useState(0);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    // Interval ganti frasa judul utama
    const wordInterval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % words.length);
    }, 3500);

    return () => clearInterval(wordInterval);
  }, []);

  // 3. Efek Mengetik Otomatis untuk Mockup Search Bar iOS
  useEffect(() => {
    let timer: NodeJS.Timeout;
    const currentWord = iosKeywords[iosIndex];

    const handleTyping = () => {
      if (!iosDeleting) {
        setIosTyped(currentWord.substring(0, iosTyped.length + 1));
        if (iosTyped === currentWord) {
          timer = setTimeout(() => setIosDeleting(true), 1500); // Jeda sebelum hapus
        } else {
          timer = setTimeout(handleTyping, 80); // Kecepatan ketik
        }
      } else {
        setIosTyped(currentWord.substring(0, iosTyped.length - 1));
        if (iosTyped === "") {
          setIosDeleting(false);
          setIosIndex((prev) => (prev + 1) % iosKeywords.length);
          timer = setTimeout(handleTyping, 400); // Jeda sebelum kata berikutnya
        } else {
          timer = setTimeout(handleTyping, 40); // Kecepatan hapus
        }
      }
    };

    timer = setTimeout(handleTyping, 100);
    return () => clearTimeout(timer);
  }, [iosTyped, iosDeleting, iosIndex]);

  // Varian animasi per huruf muncul dari bawah ke atas (Slide up)
  const containerVariants = {
    initial: {},
    animate: { transition: { staggerChildren: 0.03 } },
    exit: { transition: { staggerChildren: 0.02, staggerDirection: -1 } }
  } as const;

  const letterVariants = {
    initial: { opacity: 0, y: 15 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { type: "spring" as const, damping: 12, stiffness: 200 }
    },
    exit: {
      opacity: 0,
      y: -15,
      transition: { ease: "easeIn" as const, duration: 0.15 }
    }
  } as const;

  return (
    <main className="relative pt-[10rem] md:pt-[10rem] flex-grow flex flex-col items-center justify-center text-center px-4 sm:px-6 w-full mx-auto overflow-hidden min-h-[95vh] z-0 bg-[#FAFAFA] pt-12 md:pt-16">
      
      {/* Background Grid & Light Scanner Effect */}
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
        </>
      )}

      <div className="relative z-10 w-full max-w-4xl space-y-6 sm:space-y-8 flex flex-col items-center">
        
        {/* 1. ANIMASI FLIP 3D BOX ICON */}
        <motion.div
          animate={{ rotateY: [0, 180, 180, 360, 360], y: [0, -6, 0, -6, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformStyle: "preserve-3d" }}
          className="w-16 h-16 sm:w-20 sm:h-20 bg-slate-900 rounded-2xl flex items-center justify-center shadow-xl border border-slate-800"
        >
          <i className="bx bx-link text-3xl sm:text-4xl text-yellow-400"></i>
        </motion.div>

        {/* 2. JUDUL UTAMA DENGAN ANIMASI PER HURUF (SLIDE UP) */}
        <h1 className="font-black tracking-tight text-slate-900 leading-tight text-3xl min-[400px]:text-4xl sm:text-5xl md:text-6xl max-w-2xl min-h-[100px] sm:min-h-[130px] md:min-h-[160px]">
          Satu Tautan untuk <br />
          <span className="inline-block relative">
            <AnimatePresence mode="wait">
              <motion.span
                key={wordIndex}
                variants={containerVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="inline-flex flex-wrap justify-center gap-x-[2px]"
              >
                {words[wordIndex] === "FunikIn Link" ? (
                  <>
                    {/* Render Manual untuk Funik(Hitam) In(Kuning) Link(Hitam) */}
                    {"Funik".split("").map((char, i) => (
                      <motion.span key={`f-${i}`} variants={letterVariants} className="text-black inline-block">{char}</motion.span>
                    ))}
                    {"In".split("").map((char, i) => (
                      <motion.span key={`i-${i}`} variants={letterVariants} className="text-yellow-500 inline-block">{char}</motion.span>
                    ))}
                    <motion.span variants={letterVariants} className="text-black inline-block">&nbsp;</motion.span>
                    {"Link".split("").map((char, i) => (
                      <motion.span key={`l-${i}`} variants={letterVariants} className="text-black inline-block">{char}</motion.span>
                    ))}
                  </>
                ) : (
                  // Kata standar berwarna Kuning penuh
                  words[wordIndex].split("").map((char, i) => (
                    <motion.span
                      key={`w-${i}`}
                      variants={letterVariants}
                      className="text-yellow-500 inline-block"
                    >
                      {char === " " ? "\u00A0" : char}
                    </motion.span>
                  ))
                )}
              </motion.span>
            </AnimatePresence>
          </span>
        </h1>

        {/* 3. MOCKUP URL DENGAN EFEK MENGETIK KATA TUGAS */}
        <div className="w-full max-w-md bg-white border border-slate-200 shadow-sm rounded-full px-5 py-2.5 flex items-center gap-2.5 mx-auto">
          <div className="flex gap-1.5 shrink-0">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
          </div>
          <div className="flex-1 text-left text-xs sm:text-sm text-slate-400 truncate flex items-center font-mono">
            <i className="bx bx-lock-alt text-emerald-500 mr-1.5 text-sm shrink-0"></i>
            <span className="text-slate-600">https://funikin.it.com/</span>
            <span className="text-yellow-600 font-semibold">{iosTyped}</span>
            <span className="w-1 h-4 bg-yellow-500 ml-0.5 animate-pulse shrink-0" />
          </div>
          <i className="bx bx-refresh text-slate-400 text-lg shrink-0"></i>
        </div>

        {/* DESKRIPSI */}
        <p className="text-sm sm:text-base md:text-lg text-slate-500 max-w-md md:max-w-xl mx-auto leading-relaxed px-4">
          Kelola portofolio, media sosial, dan tautan pentingmu dalam satu halaman profil kustom yang indah, cepat, dan responsif.
        </p>

        {/* TOMBOL AKSI */}
        <div className="pt-2">
          {session ? (
            <Link
              href={`/${userUsername}`}
              className="bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-3 px-6 sm:py-3.5 sm:px-8 rounded-xl transition-all shadow-md hover:shadow-lg inline-block active:scale-95 text-sm sm:text-base border border-yellow-600/20"
            >
              Halo {userUsername}! Ke Profil Saya
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

        {/* 4. PREMIUM IPHONE 14 PRO MAX MOCKUP (DENGAN REPLIKA UI RILL DASHBOARD MOBILE KAMU) */}
        <div className="w-full pt-6 flex justify-center relative">
          
          {/* Efek Opacity Gradasi Masking Bawah ke Atas */}
          <div 
            className="w-[360px] h-[400px] relative overflow-hidden flex justify-center z-10"
            style={{
              maskImage: "linear-gradient(to top, transparent 0%, rgba(0,0,0,0.4) 20%, black 55%)",
              WebkitMaskImage: "linear-gradient(to top, transparent 0%, rgba(0,0,0,0.4) 20%, black 55%)"
            }}
          >
            {/* Rangka iPhone 14 Pro Max Dinamis */}
            <motion.div 
              initial={{ y: 60, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
              className="w-[340px] h-[660px] bg-slate-950 rounded-[52px] p-3.5 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.25)] border-[5px] border-slate-800 flex flex-col shrink-0"
            >
              {/* iPhone Dynamic Island */}
              <div className="absolute top-5 left-1/2 -translate-x-1/2 w-28 h-5 bg-black rounded-full z-40 flex items-center justify-end px-3">
                <span className="w-2 h-2 rounded-full bg-slate-900 border border-slate-800/40" />
              </div>

              {/* Aplikasi Web Funikin di dalam iOS */}
              <div className="w-full h-full bg-[#f8fafc] rounded-[38px] overflow-hidden flex flex-col relative text-left select-none font-sans">
                
                {/* Navbar Mini Atas Match UI Gambar Kamu */}
                <div className="w-full bg-white border-b border-slate-100 px-6 pt-7 pb-3 flex items-center justify-between shrink-0">
                  <span className="text-sm font-bold text-black font-sans">
                    Funik<span className="text-yellow-500">In</span> <span className="bg-yellow-500 text-white text-[10px] px-1.5 py-0.5 rounded-md ml-0.5 font-medium">Link</span>
                  </span>
                  <i className="bx bx-menu text-xl text-slate-800"></i>
                </div>

                {/* Konten Scrollable Profile */}
                <div className="flex-1 overflow-y-auto p-5 space-y-5">
                  
                  {/* Bagian Foto & Username Header */}
                  <div className="flex items-center gap-4 pt-2">
                    <div className="w-14 h-14 rounded-full bg-slate-900 text-white font-semibold flex items-center justify-center text-sm tracking-wide uppercase border border-slate-200 shadow-xs">
                      GV
                    </div>
                    <div className="space-y-0.5">
                      <h3 className="text-base font-bold text-slate-900 flex items-center gap-1">
                        Gede Valendra
                        <i className="bx bxs-badge-check text-blue-500 text-base"></i>
                      </h3>
                      <p className="text-xs text-slate-400 font-mono">@{userUsername || "gedevalendra"}</p>
                    </div>
                  </div>

                  {/* Deskripsi Bio & Hashtags */}
                  <div className="space-y-2">
                    <p className="text-xs text-slate-600 leading-relaxed font-normal">
                      Halo, selamat datang di tautan resmi saya! Mari berkolaborasi, dan saling berbagi ilmu mengenai dunia tech!
                    </p>
                    <div className="flex gap-1.5 text-[11px] font-medium text-blue-600">
                      <span>#Developer</span>
                      <span>#FunikIn</span>
                    </div>
                  </div>

                  {/* Title Section */}
                  <div className="pt-2">
                    <p className="text-[10px] font-bold tracking-wider uppercase text-slate-400 mb-2.5">Tautan Resmi</p>
                    
                    {/* Tombol Tambah Tautan */}
                    <div className="w-full py-2.5 border border-dashed border-slate-300 rounded-xl text-center text-xs font-medium text-slate-500 bg-white/50 mb-3 flex items-center justify-center gap-1.5">
                      <i className="bx bx-plus text-sm"></i> Tambah Tautan Baru
                    </div>

                    {/* Daftar List Card Sesuai Screenshoot Kamu */}
                    <div className="space-y-3">
                      {/* Card 1: Edu */}
                      <div className="bg-white p-3.5 rounded-2xl border border-slate-100 shadow-xs flex items-start gap-3 relative">
                        <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-lg shrink-0 border border-amber-100">
                          <i className="bx bx-globe"></i>
                        </div>
                        <div className="min-w-0 flex-1 pr-6">
                          <h4 className="text-xs font-bold text-slate-800">FunikIn—Edu</h4>
                          <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">Bergabung, belajar, bermain, semua dalam satu platform—FunikIn</p>
                          <p className="text-[10px] text-blue-500 font-mono mt-1 font-medium">www.funikin.com ↗</p>
                        </div>
                        <div className="absolute right-3.5 top-3.5 flex gap-1.5 text-slate-300 text-xs">
                          <i className="bx bx-edit-alt"></i> <i className="bx bx-trash"></i>
                        </div>
                      </div>

                      {/* Card 2: LinkedIn */}
                      <div className="bg-white p-3.5 rounded-2xl border border-slate-100 shadow-xs flex items-start gap-3 relative">
                        <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-lg shrink-0 border border-blue-100">
                          <i className="bx bxl-linkedin"></i>
                        </div>
                        <div className="min-w-0 flex-1 pr-6">
                          <h4 className="text-xs font-bold text-slate-800">LinkedIn</h4>
                          <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">Ayo buat koneksi bersama!</p>
                          <p className="text-[10px] text-blue-500 font-mono mt-1 font-medium">www.linkedin.com/in/... ↗</p>
                        </div>
                        <div className="absolute right-3.5 top-3.5 flex gap-1.5 text-slate-300 text-xs">
                          <i className="bx bx-edit-alt"></i> <i className="bx bx-trash"></i>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>

              </div>
            </motion.div>
          </div>

        </div>

      </div>
    </main>
  );
}