"use client";

import { useState } from "react";
import Link from "next/link";
import { updateCartQtyAction, removeFromCartAction } from "../../lib/actions";

interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  qty: number;
}

interface Props {
  initialCart: CartItem[];
  username: string;
}

// Komponen Pendukung Gambar dengan Deteksi Error Terintegrasi
function CartItemImage({ src, alt }: { src: string; alt: string }) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div className="w-16 h-16 rounded-xl flex flex-col items-center justify-center bg-neutral-50 border border-neutral-100 text-neutral-400 p-1 select-none shrink-0">
        <i className="bx bx-error-circle text-lg text-neutral-300"></i>
        <span className="text-[8px] text-neutral-400 text-center scale-90">Error</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      onError={() => setHasError(true)}
      className="w-16 h-16 rounded-xl object-cover bg-neutral-50 border border-neutral-100 shrink-0"
    />
  );
}

export default function CartClientContainer({ initialCart, username }: Props) {
  const [cart, setCart] = useState<CartItem[]>(initialCart);
  const [swipedId, setSwipedId] = useState<string | null>(null);
  const [showPopup, setShowPopup] = useState(false);

  const handleUpdateQty = async (id: string, delta: number, currentQty: number) => {
    if (currentQty === 1 && delta === -1) return;

    setCart(prev => prev.map(item => item.id === id ? { ...item, qty: item.qty + delta } : item));
    
    try {
      await updateCartQtyAction(id, delta);
    } catch (err) {
      setCart(prev => prev.map(item => item.id === id ? { ...item, qty: item.qty - delta } : item));
    }
  };

  const handleRemoveItem = async (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
    setSwipedId(null);
    try {
      await removeFromCartAction(id);
    } catch (err) {
      alert("Gagal menghapus item dari database.");
    }
  };

  const totalPrice = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
  const formatRupiah = (val: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(val);

  return (
    <div className="min-h-screen bg-white font-sans pb-32">
      {/* Top Navigation Minimalis */}
      <div className="sticky top-0 bg-white/80 backdrop-blur-md z-30 border-b border-neutral-100/60 p-4 flex items-center gap-3">
        <Link href={`/${username}`} className="text-neutral-800 p-0.5 rounded-lg hover:bg-neutral-50 transition-colors">
          <i className="bx bx-chevron-left text-2xl flex"></i>
        </Link>
        <h1 className="text-sm font-semibold text-neutral-800">Keranjang Belanja</h1>
      </div>

      {/* Daftar Item */}
      <div className="mt-2 space-y-px overflow-x-hidden">
        {cart.length === 0 ? (
          <div className="text-center py-24 px-6 max-w-sm mx-auto flex flex-col items-center">
            <div className="w-14 h-14 rounded-full bg-neutral-50 flex items-center justify-center text-neutral-400 mb-4 border border-neutral-100">
              <i className="bx bx-shopping-bag text-xl"></i>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed">Wah, keranjang belanja Anda masih kosong nih.</p>
            <Link href={`/${username}`} className="mt-5 inline-block bg-neutral-900 text-white px-5 py-2 rounded-xl text-xs font-medium hover:bg-neutral-800 active:scale-95 transition-all">
              Cari Produk
            </Link>
          </div>
        ) : (
          cart.map((item) => (
            <div key={item.id} className="relative bg-white group touch-pan-y">
              {/* Tombol Hapus Geser */}
              <div 
                className="absolute right-0 top-0 bottom-0 w-20 bg-neutral-900 flex items-center justify-center text-white cursor-pointer active:bg-neutral-800" 
                onClick={() => handleRemoveItem(item.id)}
              >
                <i className="bx bx-trash text-lg"></i>
              </div>

              {/* Konten Item Utama */}
              <div 
                className={`relative z-10 bg-white p-4 flex items-center gap-4 transition-transform duration-300 ease-out border-b border-neutral-100/60 ${swipedId === item.id ? "-translate-x-20" : "translate-x-0"}`}
                onTouchStart={(e) => {
                  const startX = e.touches[0].clientX;
                  (e.currentTarget as any).ontouchend = (ev: TouchEvent) => {
                    const endX = ev.changedTouches[0].clientX;
                    if (startX - endX > 50) setSwipedId(item.id);
                    if (endX - startX > 50) setSwipedId(null);
                  };
                }}
                onMouseDown={(e) => {
                   const startX = e.clientX;
                   (e.currentTarget as any).onmouseup = (ev: MouseEvent) => {
                     if (startX - ev.clientX > 50) setSwipedId(item.id);
                     if (ev.clientX - startX > 50) setSwipedId(null);
                   };
                }}
              >
                {/* Menggunakan Subkomponen Deteksi Gambar Rusak */}
                <CartItemImage src={item.image} alt={item.name} />

                <div className="flex-1 min-w-0 pr-2">
                  <h3 className="text-xs sm:text-sm font-medium text-neutral-800 truncate">{item.name}</h3>
                  <p className="text-xs font-semibold text-neutral-900 mt-0.5">{formatRupiah(item.price)}</p>
                </div>

                {/* Pengatur Kuantitas Minimalis */}
                <div className="flex items-center gap-2 bg-neutral-50/60 p-1 rounded-xl border border-neutral-200/50">
                  <button 
                    onClick={() => handleUpdateQty(item.id, -1, item.qty)} 
                    disabled={item.qty <= 1}
                    className="w-6 h-6 flex items-center justify-center text-neutral-400 hover:text-neutral-600 disabled:opacity-30 transition-colors"
                  >
                    <i className="bx bx-minus text-xs"></i>
                  </button>
                  <span className="text-[11px] font-semibold w-4 text-center text-neutral-700">{item.qty}</span>
                  <button 
                    onClick={() => handleUpdateQty(item.id, 1, item.qty)} 
                    className="w-6 h-6 flex items-center justify-center text-neutral-400 hover:text-neutral-600 transition-colors"
                  >
                    <i className="bx bx-plus text-xs"></i>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Bottom Bar Total Pembayaran */}
      {cart.length > 0 && (
        <div className="fixed bottom-0 inset-x-0 bg-white/90 backdrop-blur-md border-t border-neutral-100 p-4 z-10">
          <div className="max-w-xl mx-auto flex items-center justify-between gap-4">
            <div className="flex flex-col">
              <span className="text-[9px] uppercase font-medium tracking-wider text-neutral-400">Total Pembayaran</span>
              <span className="text-base font-semibold text-neutral-900">{formatRupiah(totalPrice)}</span>
            </div>
            <button 
              onClick={() => setShowPopup(true)} 
              className="bg-neutral-900 text-white px-7 py-2.5 rounded-xl font-medium text-xs sm:text-sm active:scale-95 transition-all hover:bg-neutral-800"
            >
              Checkout
            </button>
          </div>
        </div>
      )}

      {/* Popup Dialog "Segera Hadir" Modis */}
      {showPopup && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-black/40 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-2xl p-6 max-w-xs w-full text-center border border-neutral-100 shadow-xl animate-slideUp">
            <div className="w-12 h-12 bg-neutral-50 border border-neutral-100 text-neutral-600 rounded-full flex items-center justify-center mx-auto mb-3.5">
              <i className="bx bx-credit-card text-xl"></i>
            </div>
            <h2 className="text-sm font-semibold text-neutral-900">Fitur Segera Hadir</h2>
            <p className="text-[11px] sm:text-xs text-neutral-400 mt-1.5 leading-relaxed">
              Integrasi sistem pembayaran sedang dipersiapkan. Tunggu pembaruan selanjutnya ya!
            </p>
            <button 
              onClick={() => setShowPopup(false)} 
              className="mt-5 w-full py-2.5 bg-neutral-900 text-white rounded-xl font-medium text-xs hover:bg-neutral-800 transition-colors"
            >
              Mengerti
            </button>
          </div>
        </div>
      )}
    </div>
  );
}