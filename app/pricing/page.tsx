"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";

export default function PricingPage() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState<string | null>(null);

  const handleCheckout = async (planType: "premium" | "deluxe") => {
    if (!session) {
      alert("Silakan login terlebih dahulu untuk berlangganan!");
      return;
    }

    setLoading(planType);

    try {
      const response = await fetch("/api/payment/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planType }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || "Gagal checkout");

      if ((window as any).snap) {
        (window as any).snap.pay(data.token, {
          onSuccess: function (result: any) {
            alert("Pembayaran sukses! Status akunmu akan segera diperbarui.");
            window.location.reload();
          },
          onPending: function (result: any) {
            alert("Menunggu pembayaran. Silakan selesaikan di aplikasi e-wallet kamu.");
          },
          onError: function (result: any) {
            alert("Pembayaran gagal! Silakan coba lagi.");
          },
          onClose: function () {
            alert("Kamu menutup halaman pembayaran sebelum selesai.");
          },
        });
      } else {
        alert("Sistem pembayaran (Snap.js) belum termuat sempurna. Coba refresh halaman.");
      }
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-start pt-32 pb-20 px-4 text-gray-900 font-sans">
      
      {/* HEADER SECTION */}
      <div className="text-center max-w-xl mx-auto mb-12">
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider bg-slate-200/60 px-2.5 py-1 rounded-md">
          Paket Langganan
        </span>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight mt-3">
          Pilih Paket Funikin Link
        </h1>
        <p className="text-xs md:text-sm text-slate-500 mt-2 leading-relaxed">
          Buka fitur kustomisasi penuh dan tingkatkan kredibilitas halaman tautan kreasimu sekarang juga.
        </p>
      </div>

      {/* PRICING CARDS CONTAINER */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-3xl w-full">

        {/* KARTU PREMIUM PLAN */}
        <div className="bg-white p-6 rounded-md shadow-xs border border-slate-200/60 flex flex-col justify-between transition-all duration-200 hover:border-slate-300">
          <div>
            <div className="flex justify-between items-center">
              <h2 className="text-sm font-bold uppercase tracking-wide text-slate-400">Premium Plan</h2>
            </div>
            <div className="my-4 flex items-baseline">
              <span className="text-3xl font-bold text-slate-900 tracking-tight">Rp 25.000</span>
              <span className="text-slate-400 text-xs font-medium ml-1">/ tahun</span>
            </div>
            <p className="text-xs text-slate-400 mb-5 border-b border-slate-100 pb-4">
              Pilihan esensial untuk personal branding yang bersih tanpa distraksi.
            </p>
            
            <ul className="text-xs text-slate-600 space-y-3 mb-8">
              <li className="flex items-start gap-2.5">
                <i className="bx bx-check text-slate-900 font-bold bg-slate-50 border border-slate-200 rounded-md p-0.5 shrink-0 text-[10px]"></i>
                <span>Custom Tema Lebih Banyak</span>
              </li>
              <li className="flex items-start gap-2.5">
                <i className="bx bx-check text-slate-900 font-bold bg-slate-50 border border-slate-200 rounded-md p-0.5 shrink-0 text-[10px]"></i>
                <span>Analitik Pengunjung Dasar</span>
              </li>
              <li className="flex items-start gap-2.5">
                <i className="bx bx-check text-slate-900 font-bold bg-slate-50 border border-slate-200 rounded-md p-0.5 shrink-0 text-[10px]"></i>
                <span>Tanpa Iklan Atribut Funikin</span>
              </li>
            </ul>
          </div>

          <button
            onClick={() => handleCheckout("premium")}
            disabled={loading !== null}
            className="w-full py-3 bg-white hover:bg-slate-50 text-slate-900 font-bold border border-slate-300 rounded-md transition text-xs tracking-wide active:scale-[0.98] disabled:opacity-50"
          >
            {loading === "premium" ? "Memproses..." : "Pilih Premium"}
          </button>
        </div>

        {/* KARTU DELUXE PLAN (BEST VALUE) */}
        <div className="bg-white p-6 rounded-md shadow-xs border-2 border-slate-950 flex flex-col justify-between relative transition-all duration-200">
          {/* Lencana Unggulan Minimalis */}
          <span className="absolute -top-2.5 right-4 bg-slate-950 text-white text-[9px] px-2 py-0.5 rounded-md font-bold tracking-wider uppercase">
            Best Value
          </span>

          <div>
            <div className="flex justify-between items-center">
              <h2 className="text-sm font-bold uppercase tracking-wide text-slate-900 flex items-center gap-1">
                Deluxe Plan
                <i className="bx bx-crown text-amber-500 text-xs"></i>
              </h2>
            </div>
            <div className="my-4 flex items-baseline">
              <span className="text-3xl font-bold text-slate-900 tracking-tight">Rp 50.000</span>
              <span className="text-slate-400 text-xs font-medium ml-1">/ tahun</span>
            </div>
            <p className="text-xs text-slate-400 mb-5 border-b border-slate-100 pb-4">
              Akses kontrol penuh, integrasi payment gateway, dan fitur profesional tingkat lanjut.
            </p>
            
            <ul className="text-xs text-slate-600 space-y-3 mb-8">
              <li className="flex items-start gap-2.5">
                <i className="bx bx-check text-slate-900 font-bold bg-slate-50 border border-slate-200 rounded-md p-0.5 shrink-0 text-[10px]"></i>
                <span className="font-medium text-slate-900">Semua Fitur Premium Terbuka</span>
              </li>
              <li className="flex items-start gap-2.5">
                <i className="bx bx-check text-slate-900 font-bold bg-slate-50 border border-slate-200 rounded-md p-0.5 shrink-0 text-[10px]"></i>
                <span>Custom Domain Pribadi (funikin.it/namamu)</span>
              </li>
              <li className="flex items-start gap-2.5">
                <i className="bx bx-check text-slate-900 font-bold bg-slate-50 border border-slate-200 rounded-md p-0.5 shrink-0 text-[10px]"></i>
                <span>Integrasi Pembayaran Digital (Midtrans)</span>
              </li>
              <li className="flex items-start gap-2.5">
                <i className="bx bx-check text-slate-900 font-bold bg-slate-50 border border-slate-200 rounded-md p-0.5 shrink-0 text-[10px]"></i>
                <span>Analitik Pengunjung Lengkap & Realtime</span>
              </li>
              <li className="flex items-start gap-2.5">
                <i className="bx bx-check text-slate-900 font-bold bg-slate-50 border border-slate-200 rounded-md p-0.5 shrink-0 text-[10px]"></i>
                <span>Prioritas Dukungan Sistem & Binc Badge Resmi</span>
              </li>
            </ul>
          </div>

          <button
            onClick={() => handleCheckout("deluxe")}
            disabled={loading !== null}
            className="w-full py-3 bg-slate-950 hover:bg-slate-800 text-white font-bold rounded-md transition text-xs tracking-wide active:scale-[0.98] shadow-sm disabled:opacity-50"
          >
            {loading === "deluxe" ? "Memproses..." : "Pilih Deluxe"}
          </button>
        </div>

      </div>

    </div>
  );
}