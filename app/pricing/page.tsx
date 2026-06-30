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
      // 1. Panggil API Backend Next.js yang sudah kita buat sebelumnya
      const response = await fetch("/api/payment/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planType }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || "Gagal checkout");

      // 2. Panggil pop-up Midtrans Snap menggunakan token dari backend
      if ((window as any).snap) {
        (window as any).snap.pay(data.token, {
          onSuccess: function (result: any) {
            alert("Pembayaran sukses! Status akunmu akan segera diperbarui.");
            window.location.reload(); // Refresh halaman untuk memperbarui session
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
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-black">
      <h1 className="text-3xl font-bold mb-2 text-center text-gray-800">Pilih Paket Funikin Link</h1>
      <p className="text-gray-500 mb-10 text-center">Buka fitur kustomisasi penuh untuk link kreasimu!</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full">
        
        {/* KARTU PREMIUM */}
        <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-200 flex flex-col justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-700">Premium Plan</h2>
            <div className="my-4">
              <span className="text-4xl font-bold">Rp 25.000</span>
              <span className="text-gray-500 text-sm"> / tahun</span>
            </div>
            <ul className="text-gray-600 space-y-2 mb-6">
              <li>✓ Custom Tema Lebih Banyak</li>
              <li>✓ Analitik Pengunjung Dasar</li>
              <li>✓ Tanpa Iklan Funikin</li>
            </ul>
          </div>
          <button
            onClick={() => handleCheckout("premium")}
            disabled={loading !== null}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition disabled:opacity-50"
          >
            {loading === "premium" ? "Memproses..." : "Pilih Premium"}
          </button>
        </div>

        {/* KARTU DELUXE */}
        <div className="bg-white p-8 rounded-2xl shadow-md border-2 border-purple-500 flex flex-col justify-between relative">
          <span className="absolute -top-3 right-6 bg-purple-500 text-white text-xs px-3 py-1 rounded-full font-semibold">BEST VALUE</span>
          <div>
            <h2 className="text-xl font-semibold text-purple-700">Deluxe Plan</h2>
            <div className="my-4">
              <span className="text-4xl font-bold">Rp 50.000</span>
              <span className="text-gray-500 text-sm"> / tahun</span>
            </div>
            <ul className="text-gray-600 space-y-2 mb-6">
              <li>✓ Semua Fitur Premium</li>
              <li>✓ Custom Domain (funikin.it/namamu)</li>
              <li>✓ Prioritas Dukungan Sistem</li>
              <li>✓ Analitik Pengunjung Lengkap (Realtime)</li>
            </ul>
          </div>
          <button
            onClick={() => handleCheckout("deluxe")}
            disabled={loading !== null}
            className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-xl transition disabled:opacity-50"
          >
            {loading === "deluxe" ? "Memproses..." : "Pilih Deluxe"}
          </button>
        </div>

      </div>
    </div>
  );
}