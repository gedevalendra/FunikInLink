"use client";

import { useState } from "react";
import Link from "next/link";

interface ProductDetailClientProps {
  product: {
    name: string;
    slug: string;
    description: string;
    images: string[];
    price: number;
    salesCount: number;
  };
  user: {
    name: string;
    username: string;
    profileBorder: string;
  };
  otherProducts: any[];
}

export default function ProductDetailClient({ product, user, otherProducts }: ProductDetailClientProps) {
  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const [isDescExpanded, setIsDescExpanded] = useState(false);

  const formatRupiah = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const nextSlide = () => {
    setCurrentImgIndex((prev) => (prev + 1) % product.images.length);
  };

  const prevSlide = () => {
    setCurrentImgIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
  };

  return (
    <div>
      {/* 1. BAGIAN ATAS: SLIDER GAMBAR */}
      <div className="relative w-full aspect-[4/3] bg-gray-50 overflow-hidden group">
        <img
          src={product.images[currentImgIndex]}
          alt={product.name}
          className="w-full h-full object-cover transition-all duration-500"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src =
              "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600";
          }}
        />

        {/* Navigasi Panah jika Gambar > 1 */}
        {product.images.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 backdrop-blur shadow-sm flex items-center justify-center text-gray-700 hover:bg-white active:scale-95 transition-all"
            >
              <i className="bx bx-chevron-left text-xl"></i>
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 backdrop-blur shadow-sm flex items-center justify-center text-gray-700 hover:bg-white active:scale-95 transition-all"
            >
              <i className="bx bx-chevron-right text-xl"></i>
            </button>

            {/* Indikator Titik Posisi Slider */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 bg-black/20 px-2 py-1 rounded-full backdrop-blur-sm">
              {product.images.map((_, idx) => (
                <div
                  key={idx}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    idx === currentImgIndex ? "w-3 bg-white" : "w-1.5 bg-white/50"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      <div className="px-6 pt-5 space-y-5">
        {/* 2. JUDUL PRODUK (Maksimal 2 baris) */}
        <h1 className="text-xl font-extrabold text-gray-900 tracking-tight leading-snug line-clamp-2">
          {product.name}
        </h1>

        {/* 3. INFORMASI JUMLAH PEMBELI & HARGA */}
        <div className="flex items-center justify-between bg-gray-50/50 border border-gray-100 rounded-xl p-3.5">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-500">
            <i className="bx bx-package text-base text-gray-400"></i>
            <span>Terjual {product.salesCount}+ produk</span>
          </div>
          <div className="text-lg font-black text-gray-900">
            {formatRupiah(product.price)}
          </div>
        </div>

        {/* 4. DESKRIPSI DENGAN GRADASI OPACITY MULUS */}
        <div className="space-y-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-gray-400">Deskripsi Produk</h2>
          <div className="relative">
            <div
              className={`text-sm text-gray-600 leading-relaxed overflow-hidden transition-all duration-500 ${
                isDescExpanded ? "max-h-[2000px]" : "max-h-[7.5rem]" 
              }`}
              style={{
                // 7.5rem setara dengan tinggi ±5 baris teks
                display: "-webkit-box",
                WebkitBoxOrient: "vertical",
                WebkitLineClamp: isDescExpanded ? "unset" : 5,
              }}
            >
              {product.description}
            </div>

            {/* Efek Gradasi Fade Putih Menutup Baris Bawah saat tertutup */}
            {!isDescExpanded && (
              <div className="absolute bottom-0 left-0 right-0 h-14 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none transition-opacity duration-300" />
            )}
          </div>

          {/* Tombol Lihat Deskripsi */}
          <button
            onClick={() => setIsDescExpanded(!isDescExpanded)}
            className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 pt-1 active:scale-95 transition-transform"
          >
            {isDescExpanded ? (
              <>Sembunyikan <i className="bx bx-chevron-up text-base"></i></>
            ) : (
              <>Lihat Deskripsi Lengkap <i className="bx bx-chevron-down text-base"></i></>
            )}
          </button>
        </div>

        <hr className="border-gray-100 my-2" />

        {/* 5. INFORMASI PROFIL PEMILIK */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100/50">
          <div className="flex items-center gap-3 min-w-0">
            <div className={`w-11 h-11 rounded-full bg-gray-900 text-white font-bold flex items-center justify-center text-sm shrink-0 uppercase
              ${user.profileBorder !== 'none' ? `ring-2 ${user.profileBorder}` : ""}
            `}>
              {user.name.substring(0, 2)}
            </div>
            <div className="min-w-0">
              <h4 className="text-sm font-bold text-gray-800 truncate">{user.name}</h4>
              <p className="text-xs text-gray-400 font-mono truncate">@{user.username}</p>
            </div>
          </div>
          <Link
            href={`/${user.username}`}
            className="text-xs font-bold bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 active:scale-95 transition-all shadow-sm shrink-0"
          >
            Kunjungi
          </Link>
        </div>

        {/* 6. DAFTAR PRODUK LAIN */}
        <div className="pt-4 space-y-4">
          <h3 className="text-sm font-bold text-gray-800 flex items-center gap-1">
            <i className="bx bx-grid-alt text-base text-gray-400"></i> Produk Lain dari Toko Ini
          </h3>

          {otherProducts.length === 0 ? (
            <p className="text-xs text-gray-400 italic bg-gray-50/50 rounded-lg p-4 text-center border border-dashed border-gray-200">
              (tidak ada produk lain)
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {otherProducts.map((item) => (
                <Link
                  key={item._id}
                  href={`/${user.username}/produk/${item.slug}`}
                  className="group block bg-white border border-gray-100 rounded-xl overflow-hidden hover:shadow-sm transition-all"
                >
                  <div className="w-full aspect-[4/3] bg-gray-50 overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-3 space-y-1">
                    <h4 className="text-xs font-bold text-gray-700 line-clamp-1 group-hover:text-blue-600 transition-colors">
                      {item.name}
                    </h4>
                    <p className="text-xs font-extrabold text-gray-950">
                      {formatRupiah(item.price)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}