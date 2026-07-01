"use client"; // <-- Wajib ditambahkan di baris paling atas!

import { useState, useRef } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { Turnstile, TurnstileInstance } from "@marsidev/react-turnstile";

export default function RegistrasiPage() {
  const turnstileRef = useRef<TurnstileInstance>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleGoogleSignIn = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      // 1. Jalankan Turnstile secara manual di latar belakang
      // Kita panggil reset dulu untuk memastikan token fresh, lalu execute
      turnstileRef.current?.reset();
      
      // Tunggu jeda sebentar agar Turnstile siap mengeksekusi
      const token = await new Promise<string | null>((resolve) => {
        // Kita modifikasi sedikit flow-nya menggunakan callback bawaan Turnstile
        // Namun cara paling aman di Turnstile adalah membiarkannya mendapatkan token otomatis
        // atau mengeksekusinya via ref jika diset ke 'invisible'.
        const checkToken = setInterval(() => {
          const currentToken = turnstileRef.current?.getResponse();
          if (currentToken) {
            clearInterval(checkToken);
            resolve(currentToken);
          }
        }, 100);

        // Jika dalam 5 detik tidak merespon, kita batalkan
        setTimeout(() => {
          clearInterval(checkToken);
          resolve(null);
        }, 5000);
      });

      if (!token) {
        alert("Gagal memverifikasi keamanan (Turnstile). Silakan coba lagi.");
        setIsSubmitting(false);
        return;
      }

      // (Opsional) Token bisa dikirim ke backend untuk divalidasi via API Cloudflare
      // console.log("Token Cloudflare Turnstile:", token);

      // 2. Jalankan proses sign-in Google jika lolos
      await signIn("google", { callbackUrl: "/" });
    } catch (error) {
      console.error("Error Turnstile:", error);
      alert("Terjadi kesalahan sistem.");
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
          {isSubmitting ? "Memverifikasi..." : "Lanjutkan dengan Google"}
        </button>

        {/* Komponen Cloudflare Turnstile (Invisible) */}
        <div className="hidden">
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