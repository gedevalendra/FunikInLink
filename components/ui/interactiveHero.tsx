"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface HeroProps {
  session: any;
  userUsername: string;
}

export default function InteractiveHero({ session, userUsername }: HeroProps) {
  // 1. Animasi Teks Berganti (Looping)
  const words = [
    "Semua Kreativitasmu",
    "Semua Portofoliomu",
    "Bisnis Digitalmu",
    "Media Sosialmu",
    "FunikIn Link",
  ];
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
      setFade(false);
      setTimeout(() => {
        setWordIndex((prev) => (prev + 1) % words.length);
        setFade(true);
      }, 400);
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
    <main className="relative flex-grow flex flex-col items-center justify-center text-center px-4 sm:px-6 w-full mx-auto overflow-hidden min-h-[70vh] z-0 bg-white">
      {/* ======================================================== */}
      {/* BACKGROUND GRID (KOTAK-KOTAK) & CAHAYA MENGIKUTI KURSOR */}
      {/* ======================================================== */}
      {isMounted && (
        <div className="absolute inset-0 z-0 pointer-events-none">
          {/* Pola Grid (Kotak-kotak) */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `linear-gradient(to right, #f0f0f0 1px, transparent 1px), linear-gradient(to bottom, #f0f0f0 1px, transparent 1px)`,
              backgroundSize: "40px 40px", // Ukuran kotak-kotak
            }}
          />

          {/* Masking Cahaya (Light) yang Mengikuti Mouse */}
          <div
            className="absolute inset-0"
            style={{
              background: `radial-gradient(400px circle at ${mousePos.x}px ${mousePos.y}px, rgba(250, 204, 21, 0.15), transparent 40%)`,
              willChange: "background",
            }}
          />
        </div>
      )}

      {/* ======================================================== */}
      {/* KONTEN UTAMA */}
      {/* ======================================================== */}
      <div className="relative z-10 w-full max-w-3xl space-y-6 sm:space-y-8 flex flex-col items-center py-12 md:py-16">
        {/* IKON DENGAN ANIMASI MENGAMBANG */}
        <div
          className={`w-16 h-16 sm:w-20 sm:h-20 bg-gray-900 rounded-2xl flex items-center justify-center shadow-lg transform transition-transform duration-1000 ease-in-out ${
            float ? "translate-y-1 rotate-6" : "-translate-y-1 rotate-2"
          }`}
        >
          <i className="bx bx-link text-3xl sm:text-4xl text-white"></i>
        </div>

        {/* JUDUL UTAMA DENGAN FONT RESPONSIVE */}
        <h1 className="font-black tracking-tight text-gray-900 leading-tight min-h-[100px] sm:min-h-[120px] md:min-h-[150px] text-[clamp(2rem,6vw,4rem)]">
          Satu Tautan untuk <br />
          <span
            className={`text-yellow-600 inline-block transition-all duration-500 transform ${
              fade ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
            }`}
          >
            {words[wordIndex]}
          </span>
        </h1>

        {/* DESKRIPSI (Responsif) */}
        <p className="text-sm sm:text-base md:text-lg text-gray-500 max-w-md md:max-w-xl mx-auto leading-relaxed font-normal px-4">
          Kelola portofolio, media sosial, dan tautan pentingmu dalam satu
          halaman profil kustom yang indah dan responsif.
        </p>

        {/* TOMBOL BERANDA */}
        <div className="pt-4 sm:pt-6">
          {session ? (
            <Link
              href={`/${userUsername}`}
              className="bg-yellow-500 text-white font-medium py-3 px-6 sm:py-4 sm:px-8 rounded-xl hover:bg-yellow-600 transition-all shadow-md hover:shadow-lg inline-block active:scale-95 text-sm sm:text-base"
            >
              Halo, {userUsername}! Ke Profil Saya
            </Link>
          ) : (
            <Link
              href="/registrasi"
              className="bg-gray-900 text-white font-medium py-3 px-6 sm:py-4 sm:px-8 rounded-xl hover:bg-transparent hover:text-gray-900 hover:ring-2 hover:ring-gray-900 transition-all shadow-md hover:shadow-lg inline-block active:scale-95 text-sm sm:text-base"
            >
              Buat FunikIn Link Gratis
            </Link>
          )}
        </div>
      </div>
    </main>
  );
}