"use client"; // <-- Wajib ditambahkan di baris paling atas!

import { useState, useRef } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import ReCAPTCHA from "react-google-recaptcha";

export default function RegistrasiPage() {
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fungsi utama saat tombol Google diklik
  const handleGoogleSignIn = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      // 1. Pemicu reCAPTCHA Invisible untuk bekerja di latar belakang
      const token = await recaptchaRef.current?.executeAsync();

      if (!token) {
        alert("Gagal memverifikasi CAPTCHA. Silakan coba lagi.");
        setIsSubmitting(false);
        return;
      }

      // (Opsional) Jika kamu mau verifikasi token di backend kamu dulu, lakukan di sini.
      // console.log("Token CAPTCHA Berhasil Didapat:", token);

      // 2. Jika lolos verifikasi latar belakang, jalankan sign-in Google
      await signIn("google", { callbackUrl: "/" });
    } catch (error) {
      console.error("Error captcha:", error);
      alert("Terjadi kesalahan sistem.");
    } finally {
      // Reset reCAPTCHA agar bisa digunakan kembali jika klik selanjutnya gagal
      recaptchaRef.current?.reset();
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

        {/* Komponen CAPTCHA (Sekarang Invisible & Tersembunyi) */}
        <ReCAPTCHA
          ref={recaptchaRef}
          size="invisible" // <-- WAJIB diganti ke invisible
          sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ""} 
        />

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