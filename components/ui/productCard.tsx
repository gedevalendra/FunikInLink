"use client";

import { useState } from "react";
import { addToCartAction } from "../../lib/actions";

interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  price: number;
  salesCount: number;
}

interface ProductCardProps {
  product: Product;
  username: string;
}

export default function ProductCard({ product, username }: ProductCardProps) {
  const [isLoading, setIsLoading] = useState(false);

  const formatRupiah = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const handleAddToCart = async () => {
    try {
      setIsLoading(true);
      await addToCartAction(product._id, product.name, product.price, product.image);
      alert(`"${product.name}" berhasil dimasukkan ke keranjang belanja.`);
    } catch (error: any) {
      alert(error.message || "Gagal menambahkan ke keranjang. Silakan login.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="group relative flex flex-col bg-white border border-neutral-100 rounded-xl overflow-hidden transition-all duration-200 h-full hover:border-neutral-200">
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
            e.currentTarget.src =
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
              handleAddToCart();
            }}
            disabled={isLoading}
            className="flex items-center justify-center w-7 h-7 rounded-lg bg-neutral-900 text-white hover:bg-neutral-800 active:scale-95 transition-all disabled:bg-neutral-300"
          >
            {isLoading ? (
              <i className="bx bx-loader-alt animate-spin text-xs"></i>
            ) : (
              <i className="bx bx-cart text-sm"></i>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}