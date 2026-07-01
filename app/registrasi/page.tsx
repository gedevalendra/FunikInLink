"use client"; // <-- Wajib ditambahkan di baris paling atas!

import { useState, useRef } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import ReCAPTCHA from "react-google-recaptcha";

export default function RegistrasiPage() {
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  // Fungsi untuk menangani perubahan status CAPTCHA
  const handleCaptchaChange = (token: string | null) => {
    setCaptchaToken(token);
  };

  const handleGoogleSignIn = async () => {
    // Validasi: Jika CAPTCHA belum dicentang, jangan izinkan login
    if (!captchaToken) {
      alert("Silakan centang CAPTCHA terlebih dahulu!");
      return;
    }

    // Jika sudah dicentang, jalankan proses sign-in
    await signIn("google", { callbackUrl: "/" });
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
          className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 text-gray-700 font-medium py-3 px-4 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all active:scale-[0.98]"
        >
          <img 
            src="https://www.svgrepo.com/show/475656/google-color.svg" 
            alt="Google Logo" 
            className="w-5 h-5"
          />
          Lanjutkan dengan Google
        </button>

        {/* Komponen CAPTCHA */}
        <div className="flex justify-center pt-2">
          <ReCAPTCHA
            ref={recaptchaRef}
            sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ""} 
            onChange={handleCaptchaChange}
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