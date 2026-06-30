"use client"; // <-- Wajib ditambahkan di baris paling atas!

import Link from "next/link";
import { signIn } from "next-auth/react";

export default function RegistrasiPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6 font-sans">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center space-y-8 border border-gray-100">
        
        {/* Header Teks */}
        <div className="space-y-3">
          <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="bx bx-link text-3xl text-white"></i>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Selamat Datang di FunikIn
          </h1>
          <p className="text-sm text-gray-500 leading-relaxed px-4">
            Masuk atau daftar secara otomatis menggunakan akun Google untuk mulai mengelola tautanmu.
          </p>
        </div>

        {/* Tombol Login Google */}
        <button 
          onClick={() => signIn("google", { callbackUrl: "/" })}
          className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 text-gray-700 font-medium py-3 px-4 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all active:scale-[0.98]"
        >
          <img 
            src="https://www.svgrepo.com/show/475656/google-color.svg" 
            alt="Google Logo" 
            className="w-5 h-5"
          />
          Lanjutkan dengan Google
        </button>

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