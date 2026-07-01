"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
// Pastikan nama file sesuai dengan komponen (menggunakan Huruf Besar/CamelCase)
import ProductListWrapper from "./ProductListWrapper";

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
  const params = useParams();
  const username = params?.username as string;

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
      {/* Menghapus 'transition-all duration-300' dari div pembungkus utama ini 
        agar tidak merusak rendering sub-komponen atau element berposisi absolut/fixed.
      */}
      <div className="w-full">
        {activeTab === "links" ? (
          <div className="animate-fadeIn">{linksComponent}</div>
        ) : (
          <div className="animate-fadeIn">
            <ProductListWrapper 
              products={products} 
              isAdmin={isAdmin} 
              username={username} 
            />
          </div>
        )}
      </div>
    </div>
  );
}