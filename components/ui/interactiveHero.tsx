"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface HeroProps {
  session: any;
  userUsername: string;
  Name: string;
}

export default function InteractiveHero({
  session,
  userUsername,
  Name,
}: HeroProps) {
  // 1. Daftar kata ganti yang diketik di dalam Mockup Safari iOS
  const iosKeywords = [
    "brand", 
    "influencer", 
    "youtuber", 
    "streamer", 
    "freelancer"
  ];
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
    exit: { transition: { staggerChildren: 0.02, staggerDirection: -1 } },
  } as const;

  const letterVariants = {
    initial: { opacity: 0, y: 15 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { type: "spring" as const, damping: 12, stiffness: 200 },
    },
    exit: {
      opacity: 0,
      y: -15,
      transition: { ease: "easeIn" as const, duration: 0.15 },
    },
  } as const;

  return (
    <main className="relative flex-grow flex flex-col items-center justify-center text-center px-4 sm:px-6 w-full mx-auto overflow-hidden min-h-[95vh] z-0 bg-[#FAFAFA] pt-24 md:pt-28">
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
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-slate-200/50 rounded-full blur-[120px] pointer-events-none z-0" />
        </>
      )}

      <div className="relative z-10 w-full max-w-4xl space-y-6 sm:space-y-8 flex flex-col items-center">
        
        {/* 1. ANIMASI FLIP 3D BOX ICON (FIXED: JUMLAH TITIK POLYGON DISAMAKAN BIAR TRANSISI SHAPE JALAN) */}
        <motion.div
          animate={{ 
            rotateY: [0, 180, 180, 360, 360], 
            y: [0, -6, 0, -6, 0],
            clipPath: [
              // Kondisi 1: Kotak Sempurna (16 titik koordinat ditarik ke sudut-sudut luar)
              "polygon(50% 0%, 100% 0%, 100% 0%, 100% 35%, 100% 50%, 100% 65%, 100% 100%, 100% 100%, 50% 100%, 0% 100%, 0% 100%, 0% 65%, 0% 50%, 0% 35%, 0% 0%, 0% 0%)",
              // Kondisi 2: Berubah jadi Gerigi Prisma Tajam saat posisi miring/putar (180°)
              "polygon(50% 0%, 68% 18%, 90% 10%, 82% 38%, 100% 50%, 82% 62%, 90% 90%, 68% 82%, 50% 100%, 32% 82%, 10% 90%, 18% 62%, 0% 50%, 18% 38%, 10% 10%, 32% 18%)",
              // Kondisi 3: Tahan bentuk gerigi sejenak sebelum berputar kembali
              "polygon(50% 0%, 68% 18%, 90% 10%, 82% 38%, 100% 50%, 82% 62%, 90% 90%, 68% 82%, 50% 100%, 32% 82%, 10% 90%, 18% 62%, 0% 50%, 18% 38%, 10% 10%, 32% 18%)",
              // Kondisi 4: Kembali menjadi Kotak Sempurna (360°)
              "polygon(50% 0%, 100% 0%, 100% 0%, 100% 35%, 100% 50%, 100% 65%, 100% 100%, 100% 100%, 50% 100%, 0% 100%, 0% 100%, 0% 65%, 0% 50%, 0% 35%, 0% 0%, 0% 0%)",
              // Kondisi 5: Loop Stanby Kotak
              "polygon(50% 0%, 100% 0%, 100% 0%, 100% 35%, 100% 50%, 100% 65%, 100% 100%, 100% 100%, 50% 100%, 0% 100%, 0% 100%, 0% 65%, 0% 50%, 0% 35%, 0% 0%, 0% 0%)"
            ]
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformStyle: "preserve-3d" }}
          className="w-16 h-16 sm:w-20 sm:h-20 bg-slate-900 rounded-md flex items-center justify-center shadow-md border border-slate-800"
        >
          <i className="bx bx-link text-3xl sm:text-4xl text-slate-100"></i>
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
                    {/* Render Manual untuk Funik(Hitam) In(Abu-abu Premium) Link(Hitam) */}
                    {"Funik".split("").map((char, i) => (
                      <motion.span
                        key={`f-${i}`}
                        variants={letterVariants}
                        className="text-black inline-block"
                      >
                        {char}
                      </motion.span>
                    ))}
                    {"In".split("").map((char, i) => (
                      <motion.span
                        key={`i-${i}`}
                        variants={letterVariants}
                        className="text-slate-500 inline-block"
                      >
                        {char}
                      </motion.span>
                    ))}
                    <motion.span
                      variants={letterVariants}
                      className="text-black inline-block"
                    >
                      &nbsp;
                    </motion.span>
                    {"Link".split("").map((char, i) => (
                      <motion.span
                        key={`l-${i}`}
                        variants={letterVariants}
                        className="text-black inline-block"
                      >
                        {char}
                      </motion.span>
                    ))}
                  </>
                ) : (
                  // Kata standar berwarna gelap minimalis
                  words[wordIndex].split("").map((char, i) => (
                    <motion.span
                      key={`w-${i}`}
                      variants={letterVariants}
                      className="text-slate-900 inline-block"
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
        <div className="w-full max-w-md bg-white border border-slate-200 shadow-xs rounded-md px-5 py-2.5 flex items-center gap-2.5 mx-auto">
          <div className="flex gap-1.5 shrink-0">
            <span className="w-2 h-2 rounded-full bg-slate-300" />
            <span className="w-2 h-2 rounded-full bg-slate-300" />
            <span className="w-2 h-2 rounded-full bg-slate-300" />
          </div>
          <div className="flex-1 text-left text-xs sm:text-sm text-slate-400 truncate flex items-center font-mono">
            <i className="bx bx-lock-alt text-slate-800 mr-1.5 text-sm shrink-0"></i>
            <span className="text-slate-600">https://funikin.it/</span>
            <span className="text-slate-900 font-semibold">{iosTyped}</span>
            <span className="w-0.5 h-3.5 bg-slate-950 ml-0.5 animate-pulse shrink-0" />
          </div>
          <i className="bx bx-refresh text-slate-400 text-lg shrink-0"></i>
        </div>

        {/* DESKRIPSI */}
        <p className="text-xs sm:text-sm text-slate-400 max-w-md md:max-w-xl mx-auto leading-relaxed px-4">
          Kelola portofolio, media sosial, dan tautan pentingmu dalam satu
          halaman profil kustom yang indah, cepat, dan responsif.
        </p>

        {/* TOMBOL AKSI */}
        <div className="pt-2">
          {session ? (
            <Link
              href={`/${userUsername}`}
              className="bg-slate-950 hover:bg-slate-800 text-white font-bold py-3 px-6 rounded-md transition-all shadow-xs inline-block active:scale-[0.98] text-xs tracking-wide border border-slate-900"
            >
              Halo, {userUsername}! Ke Profil Saya
            </Link>
          ) : (
            <Link
              href="/registrasi"
              className="bg-slate-950 hover:bg-slate-800 text-white font-bold py-3 px-6 rounded-md transition-all shadow-xs inline-block active:scale-[0.98] text-xs tracking-wide"
            >
              Buat Funik<span className="text-slate-400">In</span> Link Gratis
            </Link>
          )}
        </div>

        {/* 4. PREMIUM IPHONE 14 PRO MAX MOCKUP */}
        <div className="w-full pt-6 flex justify-center relative">
          {/* Efek Opacity Gradasi Masking Bawah ke Atas */}
          <div
            className="w-[360px] h-[400px] relative overflow-hidden flex justify-center z-10"
            style={{
              maskImage:
                "linear-gradient(to top, transparent 0%, rgba(0,0,0,0.4) 20%, black 55%)",
              WebkitMaskImage:
                "linear-gradient(to top, transparent 0%, rgba(0,0,0,0.4) 20%, black 55%)",
            }}
          >
            {/* Rangka iPhone 14 Pro Max Dinamis */}
            <motion.div
              initial={{ y: 60, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
              className="w-[340px] h-[660px] bg-slate-950 rounded-md p-3.5 shadow-md border-[4px] border-slate-900 flex flex-col shrink-0"
            >
              {/* Aplikasi Web Funikin di dalam iOS */}
              <div className="w-full h-full bg-slate-50 rounded-md overflow-hidden flex flex-col relative text-left select-none font-sans border border-slate-100">
                {/* Navbar Mini Atas Match UI Gambar Kamu */}
                <div className="w-full bg-white border-b border-slate-200/60 px-6 pt-5 pb-3 flex items-center justify-between shrink-0">
                  <span className="text-xs font-bold text-black font-sans uppercase tracking-wider">
                    Funik<span>In</span>{" "}
                    <span className="bg-slate-950 text-white text-[8px] px-1.5 py-0.5 rounded-md ml-0.5 font-bold">
                      Link
                    </span>
                  </span>
                  <i className="bx bx-menu text-xl text-slate-800"></i>
                </div>

                {/* Konten Scrollable Profile */}
                <div className="flex-1 overflow-y-auto p-5 space-y-4 no-scrollbar">
                  {/* Bagian Foto & Username Header Dinamis */}
                  <div className="flex items-center gap-3 pt-1">
                    <div className="w-12 h-12 rounded-md bg-slate-950 text-white font-bold flex items-center justify-center text-xs tracking-wide uppercase shrink-0">
                      {String(Name || userUsername || "Y").substring(0, 2)}
                    </div>
                    <div className="space-y-0.5 min-w-0 flex-1">
                      <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1 w-full">
                        <span className="truncate">
                          {Name || userUsername || "Your Name"}
                        </span>
                        <i className="bx bxs-badge-check text-slate-900 text-sm shrink-0"></i>
                      </h3>
                      <p className="text-[10px] text-slate-400 font-mono truncate">
                        @{userUsername || "username"}
                      </p>
                    </div>
                  </div>

                  {/* Deskripsi Bio & Hashtags */}
                  <div className="space-y-1.5">
                    <p className="text-[11px] text-slate-500 leading-relaxed font-normal">
                      Halo, selamat datang di tautan resmi saya! Mari
                      berkolaborasi dan saling berbagi ilmu.
                    </p>
                    <div className="flex gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      <span>#Developer</span>
                      <span>#FunikIn</span>
                    </div>
                  </div>

                  {/* Title Section */}
                  <div className="pt-1">
                    <p className="text-[9px] font-bold tracking-wider uppercase text-slate-400 mb-2">
                      Tautan Resmi
                    </p>

                    {/* Tombol Tambah Tautan */}
                    <div className="w-full py-2 border border-dashed border-slate-300 rounded-md text-center text-[11px] font-bold text-slate-400 bg-white mb-2.5 flex items-center justify-center gap-1">
                      <i className="bx bx-plus text-xs"></i> Tambah Tautan Baru
                    </div>

                    {/* Daftar List Card */}
                    <div className="space-y-2">
                      {/* Card 1: Edu */}
                      <div className="bg-white p-3 rounded-md border border-slate-200/60 shadow-xs flex items-start gap-2.5 relative">
                        <div className="w-8 h-8 rounded-md bg-slate-50 text-slate-900 flex items-center justify-center text-base shrink-0 border border-slate-200">
                          <i className="bx bx-globe"></i>
                        </div>
                        <div className="min-w-0 flex-1 pr-6">
                          <h4 className="text-[11px] font-bold text-slate-800">
                            FunikIn—Edu
                          </h4>
                          <p className="text-[9px] text-slate-400 mt-0.5 line-clamp-1">
                            Bergabung, belajar, bermain, semua dalam satu
                            platform.
                          </p>
                          <p className="text-[9px] text-slate-900 font-mono mt-0.5 font-bold">
                            www.funikin.com ↗
                          </p>
                        </div>
                      </div>

                      {/* Card 2: LinkedIn */}
                      <div className="bg-white p-3 rounded-md border border-slate-200/60 shadow-xs flex items-start gap-2.5 relative">
                        <div className="w-8 h-8 rounded-md bg-slate-50 text-slate-900 flex items-center justify-center text-base shrink-0 border border-slate-200">
                          <i className="bx bxl-linkedin"></i>
                        </div>
                        <div className="min-w-0 flex-1 pr-6">
                          <h4 className="text-[11px] font-bold text-slate-800">
                            LinkedIn
                          </h4>
                          <p className="text-[9px] text-slate-400 mt-0.5 line-clamp-1">
                            Ayo buat koneksi bersama!
                          </p>
                          <p className="text-[9px] text-slate-900 font-mono mt-0.5 font-bold">
                            linkedin.com/in/... ↗
                          </p>
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