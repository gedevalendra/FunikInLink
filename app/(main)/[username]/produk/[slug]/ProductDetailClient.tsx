"use client";

import { useState } from "react";
import Link from "next/link";
import { addToCartAction } from "../../../../../lib/actions";

interface ProductDetailClientProps {
  product: {
    _id: string;
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
  const [isAdding, setIsAdding] = useState(false);

  const formatRupiah = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const handleAddToCart = async () => {
    try {
      setIsAdding(true);
      await addToCartAction(product._id, product.name, product.price, product.images[0]);
      alert(`"${product.name}" dimasukkan ke keranjang.`);
    } catch (error: any) {
      alert(error.message || "Gagal menambah ke keranjang belanja. Silakan login.");
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="px-3 sm:px-0">
      {/* 1. SLIDER GAMBAR MINIMALIS */}
      <div className="relative w-full aspect-[4/3] bg-neutral-50 rounded-xl overflow-hidden group border border-neutral-100">
        <img
          src={product.images[currentImgIndex]}
          alt={product.name}
          className="w-full h-full object-cover transition-all duration-300"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src =
              "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600";
          }}
        />

        {product.images.length > 1 && (
          <>
            <button
              onClick={() => setCurrentImgIndex((prev) => (prev - 1 + product.images.length) % product.images.length)}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 border border-neutral-100 shadow-sm flex items-center justify-center text-neutral-600 hover:bg-white active:scale-95 transition-all"
            >
              <i className="bx bx-chevron-left text-lg"></i>
            </button>
            <button
              onClick={() => setCurrentImgIndex((prev) => (prev + 1) % product.images.length)}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 border border-neutral-100 shadow-sm flex items-center justify-center text-neutral-600 hover:bg-white active:scale-95 transition-all"
            >
              <i className="bx bx-chevron-right text-lg"></i>
            </button>

            {/* Titik Indikator */}
            <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex gap-1 bg-neutral-900/10 px-1.5 py-0.5 rounded-full backdrop-blur-sm">
              {product.images.map((_, idx) => (
                <div
                  key={idx}
                  className={`h-1 rounded-full transition-all duration-300 ${
                    idx === currentImgIndex ? "w-2.5 bg-white" : "w-1 bg-white/60"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      <div className="pt-4 space-y-4">
        {/* 2. JUDUL PRODUK (Maksimal 2 baris, responsif hf) */}
        <h1 className="text-base sm:text-lg font-normal text-neutral-800 leading-snug line-clamp-2">
          {product.name}
        </h1>

        {/* 3. INFO PEMBELI & HARGA */}
        <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
          <div className="flex items-center gap-1 text-[11px] sm:text-xs text-neutral-400">
            <i className="bx bx-package text-sm"></i>
            <span>Terjual {product.salesCount}+</span>
          </div>
          <div className="text-sm sm:text-base font-medium text-neutral-900">
            {formatRupiah(product.price)}
          </div>
        </div>

        {/* 4. BUTTON KERANJANG */}
        <button
          onClick={handleAddToCart}
          disabled={isAdding}
          className="w-full bg-neutral-900 hover:bg-neutral-800 text-white py-3 px-4 rounded-xl flex items-center justify-center gap-2 text-xs sm:text-sm transition-all disabled:bg-neutral-300"
        >
          {isAdding ? (
            <>
              <i className="bx bx-loader-alt animate-spin"></i> Menyimpan...
            </>
          ) : (
            <>
              <i className="bx bx-cart-add text-sm sm:text-base"></i> Masukkan ke Keranjang
            </>
          )}
        </button>

        {/* 5. DESKRIPSI DENGAN GRADASI OPACITY SLOW */}
        <div className="space-y-1 pt-1">
          <h2 className="text-[10px] uppercase font-medium tracking-wider text-neutral-400">Deskripsi</h2>
          <div className="relative">
            <div
              className={`text-xs sm:text-sm text-neutral-500 leading-relaxed overflow-hidden transition-all duration-300 ${
                isDescExpanded ? "max-h-[2000px]" : "max-h-[6.5rem]" 
              }`}
              style={{
                display: "-webkit-box",
                WebkitBoxOrient: "vertical",
                WebkitLineClamp: isDescExpanded ? "unset" : 5,
              }}
            >
              {product.description}
            </div>

            {!isDescExpanded && (
              <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-white via-white/70 to-transparent pointer-events-none" />
            )}
          </div>

          <button
            onClick={() => setIsDescExpanded(!isDescExpanded)}
            className="text-[11px] font-medium text-neutral-600 hover:text-neutral-900 flex items-center gap-0.5 pt-1"
          >
            {isDescExpanded ? (
              <>Sembunyikan <i className="bx bx-chevron-up"></i></>
            ) : (
              <>Lihat Selengkapnya <i className="bx bx-chevron-down"></i></>
            )}
          </button>
        </div>

        <hr className="border-neutral-100/70" />

        {/* 6. PROFIL PEMILIK (MINIMALIS) */}
        <div className="flex items-center justify-between p-3 border border-neutral-100 rounded-xl bg-neutral-50/50">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-full bg-neutral-200 text-neutral-700 flex items-center justify-center text-xs shrink-0 uppercase">
              {user.name.substring(0, 2)}
            </div>
            <div className="min-w-0">
              <h4 className="text-xs sm:text-sm font-medium text-neutral-800 truncate">{user.name}</h4>
              <p className="text-[10px] sm:text-xs text-neutral-400 font-mono truncate">@{user.username}</p>
            </div>
          </div>
          <Link
            href={`/${user.username}`}
            className="text-[11px] bg-white border border-neutral-200 text-neutral-700 px-3 py-1.5 rounded-lg hover:bg-neutral-50 active:scale-95 transition-all"
          >
            Kunjungi
          </Link>
        </div>

        {/* 7. PRODUK LAIN */}
        <div className="pt-3 space-y-3">
          <h3 className="text-xs font-medium text-neutral-400 flex items-center gap-1">
            Produk Lain Dari Toko Ini
          </h3>

          {otherProducts.length === 0 ? (
            <p className="text-xs text-neutral-400 font-light bg-neutral-50 rounded-lg p-4 text-center border border-dashed border-neutral-200">
              (tidak ada produk lain)
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-2.5">
              {otherProducts.map((item) => (
                <Link
                  key={item._id}
                  href={`/${user.username}/produk/${item.slug}`}
                  className="group block bg-white border border-neutral-100 rounded-xl overflow-hidden hover:border-neutral-200 transition-all"
                >
                  <div className="w-full aspect-[4/3] bg-neutral-50 overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover grayscale-[10%] group-hover:grayscale-0 transition-all duration-300"
                    />
                  </div>
                  <div className="p-2.5 space-y-0.5">
                    <h4 className="text-[11px] sm:text-xs text-neutral-700 line-clamp-1">
                      {item.name}
                    </h4>
                    <p className="text-xs font-medium text-neutral-900">
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