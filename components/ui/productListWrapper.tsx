"use client";

import AddProdukModal from "./addProdukModal";
import ProductCard from "./productCard";

interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  price: number;
  salesCount: number;
}

interface ProductListWrapperProps {
  products: Product[];
  isAdmin: boolean;
  username: string;
}

export default function ProductListWrapper({ products, isAdmin, username }: ProductListWrapperProps) {
  return (
    <div className="space-y-4">
      {/* Tombol Tambah Produk khusus Admin */}
      {isAdmin && (
        <div className="w-full flex justify-start">
          <AddProdukModal />
        </div>
      )}

      {/* Grid Daftar Produk */}
      {products.length === 0 ? (
        <div className="p-4 bg-neutral-50 border border-neutral-100 rounded-xl text-xs text-neutral-500 leading-relaxed font-normal flex items-center gap-2 justify-center text-center">
          <i className="bx bx-store-alt text-neutral-400 text-sm"></i>
          <span>Belum ada produk terdaftar untuk saat ini.</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {products.map((product) => (
            <ProductCard 
              key={product._id} 
              product={product} 
              username={username} 
            />
          ))}
        </div>
      )}
    </div>
  );
}