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
  
  // KONDISI JIKA PRODUK KOSONG
  if (products.length === 0) {
    return (
      <div className="w-full flex flex-col items-center justify-center p-8 text-center min-h-[220px] bg-neutral-50/50 border border-dashed border-neutral-200 rounded-2xl max-w-md mx-auto">
        <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400 mb-3">
          <i className="bx bx-store-alt text-xl"></i>
        </div>
        
        <h4 className="text-xs sm:text-sm font-medium text-neutral-800 mb-1">
          {isAdmin ? "Produk Anda Masih Kosong" : "Belum Ada Produk"}
        </h4>
        
        <p className="text-[11px] sm:text-xs text-neutral-400 leading-relaxed mb-5 px-4">
          {isAdmin 
            ? "Mulai tambahkan produk digital atau fisik Anda agar pembeli dapat melakukan transaksi langsung."
            : `@${username} belum mengunggah produk apa pun untuk saat ini.`
          }
        </p>

        {/* Tombol tambah produk hanya muncul jika dia pemilik akun (Admin) */}
        {isAdmin && <AddProdukModal />}
      </div>
    );
  }

  // KONDISI JIKA PRODUK ADA
  return (
    <div className="space-y-4">
      {/* Tombol Tambah Produk khusus Admin ditaruh di atas grid */}
      {isAdmin && (
        <div className="w-full flex justify-start">
          <AddProdukModal />
        </div>
      )}

      {/* Grid Daftar Produk */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {products.map((product) => (
          <ProductCard 
            key={product._id} 
            product={product} 
            username={username} 
          />
        ))}
      </div>
    </div>
  );
}