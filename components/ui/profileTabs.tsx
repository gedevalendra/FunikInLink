"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { addToCartAction } from "../../lib/actions";
import AddProdukModal from "./addProdukModal";

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
  isAdmin: boolean;
}

export default function ProfileTabs({ linksComponent, products, isAdmin }: ProfileTabsProps) {
  const [activeTab, setActiveTab] = useState<"links" | "products">("links");
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const params = useParams();
  const username = params?.username as string;

  const formatRupiah = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const handleAddToCart = async (product: Product) => {
    try {
      setLoadingId(product._id);
      await addToCartAction(product._id, product.name, product.price, product.image);
      alert(`"${product.name}" berhasil dimasukkan ke keranjang belanja.`);
    } catch (error: any) {
      alert(error.message || "Gagal menambahkan ke keranjang. Silakan login.");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="w-full space-y-5 px-2 max-w-xl mx-auto">
      {/* Tab Navigasi Minimalis */}
      <div className="flex items-center justify-left gap-6 border-b border-gray-100 pb-px">
        <button
          onClick={() => setActiveTab("links")}
          className={`flex items-center gap-1.5 pb-2 text-xs sm:text-sm font-medium border-b transition-all ${
            activeTab === "links"
              ? "border-neutral-800 text-neutral-800 font-normal"
              : "border-transparent text-neutral-400 hover:text-neutral-600"
          }`}
        >
          <i className="bx bx-link-alt text-sm"></i> Tautan
        </button>
        <button
          onClick={() => setActiveTab("products")}
          className={`flex items-center gap-1.5 pb-2 text-xs sm:text-sm font-medium border-b transition-all ${
            activeTab === "products"
              ? "border-neutral-800 text-neutral-800 font-normal"
              : "border-transparent text-neutral-400 hover:text-neutral-600"
          }`}
        >
          <i className="bx bx-shopping-bag text-sm"></i> Produk
        </button>
      </div>

      {/* Konten Halaman */}
      <div className="transition-all duration-300">
        {activeTab === "links" ? (
          <div>{linksComponent}</div>
        ) : (
          <div className="space-y-4">
            {/* Tombol Tambah Produk khusus Admin */}
            {isAdmin && (
              <div className="w-full flex justify-end">
                <AddProdukModal />
              </div>
            )}

            {/* Grid Daftar Produk rill */}
            {products.length === 0 ? (
              <div className="p-4 bg-neutral-50 border border-neutral-100 rounded-xl text-xs text-neutral-500 leading-relaxed font-normal flex items-center gap-2 justify-center text-center">
                <i className="bx bx-store-alt text-neutral-400 text-sm"></i>
                <span>Belum ada produk terdaftar untuk saat ini.</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {products.map((product) => (
                  <div
                    key={product._id}
                    className="group relative flex flex-col bg-white border border-neutral-100 rounded-xl overflow-hidden transition-all duration-200 h-full hover:border-neutral-200"
                  >
                    {/* Gambar Produk */}
                    <a
                      href={`/${username}/produk/${product.slug}`}
                      className="relative block w-full aspect-[4/3] overflow-hidden bg-neutral-50 cursor-pointer"
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover grayscale-[10%] group-hover:grayscale-0 transition-all duration-300"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src =
                            "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600";
                        }}
                      />
                    </a>

                    {/* Info Produk */}
                    <div className="flex flex-col p-3.5 flex-grow bg-white">
                      <div className="flex-grow space-y-1 mb-3">
                        <h3 className="text-xs sm:text-sm font-medium text-neutral-800 line-clamp-1 group-hover:text-neutral-600 transition-colors">
                          <a href={`/${username}/produk/${product.slug}`}>{product.name}</a>
                        </h3>
                        <p className="text-[11px] sm:text-xs text-neutral-400 line-clamp-2 leading-relaxed">
                          {product.description}
                        </p>
                        <span className="inline-block text-[10px] text-neutral-400 font-light pt-1">
                          Terjual {product.salesCount}+
                        </span>
                      </div>

                      {/* Harga & Tombol Keranjang */}
                      <div className="flex items-center justify-between pt-2.5 border-t border-neutral-50 mt-auto">
                        <span className="text-xs sm:text-sm font-medium text-neutral-800">
                          {formatRupiah(product.price)}
                        </span>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            handleAddToCart(product);
                          }}
                          disabled={loadingId === product._id}
                          className="flex items-center justify-center w-7 h-7 rounded-lg bg-neutral-900 text-white hover:bg-neutral-800 active:scale-95 transition-all disabled:bg-neutral-300"
                        >
                          {loadingId === product._id ? (
                            <i className="bx bx-loader-alt animate-spin text-xs"></i>
                          ) : (
                            <i className="bx bx-cart text-sm"></i>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}