"use client"; // <-- Wajib ditambahkan di baris paling atas!

import { useState, useRef } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { Turnstile, TurnstileInstance } from "@marsidev/react-turnstile";

export default function RegistrasiPage() {
  const turnstileRef = useRef<TurnstileInstance>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fungsi utama saat tombol Google diklik
  const handleGoogleSignIn = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      // 1. Reset Turnstile terlebih dahulu untuk memastikan token selalu baru
      turnstileRef.current?.reset();
      
      // 2. Berikan jeda waktu (polling) sebentar agar Turnstile menghasilkan token fresh di latar belakang
      const token = await new Promise<string | null>((resolve) => {
        let attempts = 0;
        const checkToken = setInterval(() => {
          const currentToken = turnstileRef.current?.getResponse();
          attempts++;

          if (currentToken) {
            clearInterval(checkToken);
            resolve(currentToken);
          }

          // Batasi waktu tunggu maksimal 5 detik (50 x 100ms)
          if (attempts > 50) {
            clearInterval(checkToken);
            resolve(null);
          }
        }, 100);
      });

      // 3. Validasi token hasil verifikasi latar belakang
      if (!token) {
        alert("Gagal memverifikasi keamanan (Turnstile). Silakan coba lagi.");
        setIsSubmitting(false);
        return;
      }

      // Log untuk memastikan token berhasil masuk di konsol local
      console.log("Token Cloudflare Turnstile Berhasil Didapat:", token);

      // 4. Jalankan proses sign-in Google jika lolos verifikasi
      await signIn("google", { callbackUrl: "/" });
    } catch (error) {
      console.error("Error Turnstile:", error);
      alert("Terjadi kesalahan sistem saat memproses login.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 font-sans">
      <div className="max-w-md w-full text-center space-y-8">
        
        {/* Header Teks */}
        <div className="space-y-3">
          <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="bx bx-link text-3xl text-white"></i>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Selamat Datang di Funik
            <span className="text-yellow-500">In</span>
          </h1>
          <p className="text-sm text-gray-500 leading-relaxed px-4">
            Masuk atau daftar secara otomatis menggunakan akun Google untuk mulai mengelola tautanmu.
          </p>
        </div>

        {/* Tombol Login Google */}
        <button 
          onClick={handleGoogleSignIn}
          disabled={isSubmitting}
          className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 text-gray-700 font-medium py-3 px-4 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all active:scale-[0.98] disabled:opacity-50"
        >
          <img 
            src="https://www.svgrepo.com/show/475656/google-color.svg" 
            alt="Google Logo" 
            className="w-5 h-5"
          />
          {isSubmitting ? "Memverifikasi Keamanan..." : "Lanjutkan dengan Google"}
        </button>

        {/* Komponen Cloudflare Turnstile (Disembunyikan dengan opacity agar tetap bekerja di DOM) */}
        <div className="opacity-0 absolute pointer-events-none">
          <Turnstile
            ref={turnstileRef}
            siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || ""}
            options={{
              action: "login",
              theme: "light",
            }}
          />
        </div>

        {/* Tombol Kembali */}
        <div className="pt-4">
          <Link 
            href="/" 
            className="text-sm font-medium text-gray-400 hover:text-gray-600 transition-colors inline-flex items-center gap-1"
          >
            <i className="bx bx-left-arrow-alt text-lg"></i>
            Kembali ke Beranda
          </Link>
        </div>
        
      </div>
    </div>
  );
}