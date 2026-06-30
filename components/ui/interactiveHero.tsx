"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface HeroProps {
  session: any;
  userUsername: string;
}

export default function InteractiveHero({ session, userUsername }: HeroProps) {
  // 1. Animasi Teks Berganti (Looping)
  const words = ["Semua Kreativitasmu", "Semua Portofoliomu", "Bisnis Digitalmu", "Media Sosialmu", "FunikIn Link"];
  const [wordIndex, setWordIndex] = useState(0);
  const [fade, setFade] = useState(true);

  // 2. Koordinat Kursor Mouse
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isMounted, setIsMounted] = useState(false);

  // 3. Animasi Ikon Floating (Mengambang)
  const [float, setFloat] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    // Jalankan loop ganti teks setiap 3 detik
    const wordInterval = setInterval(() => {
      setFade(false); // Efek teks memudar keluar
      setTimeout(() => {
        setWordIndex((prev) => (prev + 1) % words.length);
        setFade(true); // Teks muncul kembali dengan kata baru
      }, 400); // Jeda transisi hilangnya teks
    }, 3000);

    // Jalankan efek ikon mengambang naik turun
    const floatInterval = setInterval(() => {
      setFloat((prev) => !prev);
    }, 2000);

    // Tangkap pergerakan kursor mouse secara presisi
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      clearInterval(wordInterval);
      clearInterval(floatInterval);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    // Menggunakan z-0 agar pembungkus utama menjadi jangkar bagi efek blur di dalamnya
    <main className="relative flex-grow flex flex-col items-center justify-center text-center px-6 w-full mx-auto overflow-hidden min-h-[70vh] z-0">
      
      {/* ======================================================== */}
      {/* EFEK BACKGROUND BLUR MENGIKUTI KURSOR (Terpampang Nyata) */}
      {/* ======================================================== */}
      {isMounted && (
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
          {/* Bola Blur Kuning (Mengikuti kursor dengan respon cepat) */}
          <div 
            className="absolute w-[400px] h-[400px] bg-yellow-200/40 rounded-full blur-[100px] will-change-transform"
            style={{ 
              transform: `translate3d(${mousePos.x - 200}px, ${mousePos.y - 200}px, 0)`,
              transition: "transform 0.3s ease-out"
            }}
          />
        </div>
      )}

      {/* ======================================================== */}
      {/* KONTEN UTAMA (Diberi z-10 agar selalu berada di atas efek blur) */}
      {/* ======================================================== */}
      <div className="relative z-10 max-w-2xl w-full space-y-6 flex flex-col items-center py-12">
        
        {/* IKON DENGAN ANIMASI MENGAMBANG */}
        <div 
          className={`w-20 h-20 bg-gray-900 rounded-2xl flex items-center justify-center shadow-lg transform transition-transform duration-1000 ease-in-out ${
            float ? "translate-y-1 rotate-6" : "-translate-y-1 rotate-2"
          }`}
        >
          <i className="bx bx-link text-4xl text-white"></i>
        </div>

        {/* JUDUL UTAMA DENGAN TEXT LOOP FADE IN/OUT */}
        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-gray-900 leading-tight min-h-[110px] md:min-h-[130px]">
          Satu Tautan untuk <br />
          <span 
            className={`text-yellow-600 inline-block transition-all duration-500 transform ${
              fade ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
            }`}
          >
            {words[wordIndex]}
          </span>
        </h1>

        {/* DESKRIPSI */}
        <p className="text-base text-gray-500 max-w-md leading-relaxed font-normal">
          Kelola portofolio, media sosial, dan tautan pentingmu dalam satu halaman profil kustom yang indah dan responsif.
        </p>

        {/* TOMBOL BERANDA */}
        <div className="pt-4">
          {session ? (
            <Link 
              href={`/${userUsername}`} 
              className="bg-yellow-500 text-white font-medium py-3.5 px-8 rounded-xl hover:bg-yellow-600 transition-all shadow-md hover:shadow-lg inline-block active:scale-95"
            >
              Halo, {session.user?.name}! Ke Profil Saya 
            </Link>
          ) : (
            <Link 
              href="/registrasi" 
              className="bg-gray-900 hover:bg-transparent hover:scale[1.1] hover:outline hover:text-gray-900 text-white font-medium py-3.5 px-8 rounded-xl hover:bg-black transition-all shadow-md hover:shadow-lg inline-block active:scale-95"
            >
              Buat FunikIn Link Gratis
            </Link>
          )}
        </div>
        
      </div>
    </main>
  );
}