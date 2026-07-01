"use client";

import { useState } from "react";
import { useParams } from "next/navigation"; // 🚀 Tambahkan useParams untuk ambil username dari URL

interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  price: number;
  salesCount: number;
}

interface ProfileTabsProps {
  linksComponent: React.ReactNode;
  products: Product[];
}

export default function ProfileTabs({ linksComponent, products }: ProfileTabsProps) {
  const [activeTab, setActiveTab] = useState<"links" | "products">("links");
  const params = useParams();
  
  // Ambil username aktif dari URL (misal: /johndoe/produk/slug -> username = johndoe)
  const username = params?.username as string;

  // Format rupiah helper
  const formatRupiah = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="w-full space-y-6">
      {/* Tombol Navigasi Tab */}
      <div className="flex items-center gap-2 border-b border-gray-100 pb-px">
        <button
          onClick={() => setActiveTab("links")}
          className={`flex items-center gap-2 pb-3 text-sm font-medium border-b-2 transition-all px-2 ${
            activeTab === "links"
              ? "border-gray-900 text-gray-900 font-semibold"
              : "border-transparent text-gray-400 hover:text-gray-600"
          }`}
        >
          <i className="bx bx-link-alt text-base"></i> Tautan
        </button>
        <button
          onClick={() => setActiveTab("products")}
          className={`flex items-center gap-2 pb-3 text-sm font-medium border-b-2 transition-all px-2 ${
            activeTab === "products"
              ? "border-gray-900 text-gray-900 font-semibold"
              : "border-transparent text-gray-400 hover:text-gray-600"
          }`}
        >
          <i className="bx bx-shopping-bag text-base"></i> Produk
        </button>
      </div>

      {/* Konten Berdasarkan Tab yang Aktif */}
      <div className="transition-all duration-300">
        {activeTab === "links" ? (
          <div>{linksComponent}</div>
        ) : (
          /* Grid 2 Kolom Skala 2x4 */
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-4xl mx-auto">
            {products.map((product) => (
              <div
                key={product._id}
                className="group relative flex flex-col bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 h-full"
              >
                {/* Bagian Atas: Background Gambar Produk (Diubah ke /[username]/produk/[slug]) */}
                <a
                  href={`/${username}/produk/${product.slug}`}
                  className="relative block w-full aspect-[16/10] overflow-hidden bg-gray-50 cursor-pointer"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src =
                        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600";
                    }}
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
                </a>

                {/* Bagian Bawah: Konten Informasi Ber-background Putih */}
                <div className="flex flex-col p-4 flex-grow bg-white">
                  {/* Judul & Deskripsi */}
                  <div className="flex-grow space-y-1.5 mb-4">
                    <h3 className="font-bold text-gray-800 text-sm sm:text-base line-clamp-1 group-hover:text-blue-600 transition-colors">
                      {/* Diubah ke /[username]/produk/[slug] */}
                      <a href={`/${username}/produk/${product.slug}`}>{product.name}</a>
                    </h3>
                    <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                      {product.description}
                    </p>
                    <p className="text-[11px] text-gray-400 flex items-center gap-1 font-medium pt-0.5">
                      <i className="bx bx-package text-xs"></i> Terjual {product.salesCount}+ produk
                    </p>
                  </div>

                  {/* Bagian Paling Bawah: Harga (Kiri) & Keranjang (Kanan) */}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-50 mt-auto">
                    <span className="font-bold text-gray-900 text-sm sm:text-base">
                      {formatRupiah(product.price)}
                    </span>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        alert(`Berhasil menambahkan "${product.name}" ke keranjang!`);
                      }}
                      className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-900 text-white hover:bg-gray-800 active:scale-95 transition-all shadow-sm"
                      title="Tambah ke Keranjang"
                    >
                      <i className="bx bx-cart text-lg"></i>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}