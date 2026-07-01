"use client";

import { useState } from "react";
import Link from "next/link";
import { updateCartQtyAction, removeFromCartAction } from "../../../../lib/actions";

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

export default function CartClientContainer({ initialCart, username }: Props) {
  const [cart, setCart] = useState<CartItem[]>(initialCart);
  const [swipedId, setSwipedId] = useState<string | null>(null);
  const [showPopup, setShowPopup] = useState(false);

  const handleUpdateQty = async (id: string, delta: number, currentQty: number) => {
    if (currentQty === 1 && delta === -1) return; // Mencegah qty kurang dari 1

    // Optimistic Update UI (Biar kerasa instan di sisi user)
    setCart(prev => prev.map(item => item.id === id ? { ...item, qty: item.qty + delta } : item));
    
    try {
      await updateCartQtyAction(id, delta);
    } catch (err) {
      // Rollback jika server bermasalah
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
      <div className="sticky top-0 bg-white/80 backdrop-blur-md z-30 border-b border-gray-100 p-4 flex items-center gap-3">
        <Link href={`/${username}`} className="text-gray-900"><i className="bx bx-chevron-left text-3xl"></i></Link>
        <h1 className="text-lg font-bold">Keranjang Belanja</h1>
      </div>

      <div className="mt-4 space-y-px overflow-x-hidden">
        {cart.length === 0 ? (
          <div className="text-center py-20 px-6">
            <i className="bx bx-cart-alt text-6xl text-gray-200"></i>
            <p className="mt-4 text-gray-400 text-sm">Wah, keranjangmu masih kosong nih.</p>
            <Link href={`/${username}`} className="mt-6 inline-block bg-gray-900 text-white px-6 py-2 rounded-full text-sm font-bold">Cari Produk</Link>
          </div>
        ) : (
          cart.map((item) => (
            <div key={item.id} className="relative bg-white group touch-pan-y">
              <div className="absolute right-0 top-0 bottom-0 w-24 bg-red-600 flex items-center justify-center text-white cursor-pointer" onClick={() => handleRemoveItem(item.id)}>
                <i className="bx bx-trash text-2xl"></i>
              </div>

              <div 
                className={`relative z-10 bg-white p-4 flex items-center gap-4 transition-transform duration-300 ease-out border-b border-gray-50 ${swipedId === item.id ? "-translate-x-24" : "translate-x-0"}`}
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
                <img src={item.image} className="w-16 h-16 rounded-lg object-cover bg-gray-100" />
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold text-gray-800 truncate">{item.name}</h3>
                  <p className="text-sm font-black text-gray-900 mt-1">{formatRupiah(item.price)}</p>
                </div>

                <div className="flex items-center gap-3 bg-gray-50 p-1 rounded-lg border border-gray-100">
                  <button onClick={() => handleUpdateQty(item.id, -1, item.qty)} className="w-6 h-6 flex items-center justify-center text-gray-500"><i className="bx bx-minus"></i></button>
                  <span className="text-xs font-bold w-4 text-center">{item.qty}</span>
                  <button onClick={() => handleUpdateQty(item.id, 1, item.qty)} className="w-6 h-6 flex items-center justify-center text-gray-500"><i className="bx bx-plus"></i></button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {cart.length > 0 && (
        <div className="fixed bottom-0 inset-x-0 bg-white border-t border-gray-100 p-5 shadow-[0_-10px_30px_rgba(0,0,0,0.05)] z-40">
          <div className="max-w-xl mx-auto flex items-center justify-between gap-4">
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400">Total Pembayaran</span>
              <span className="text-lg font-black text-gray-900">{formatRupiah(totalPrice)}</span>
            </div>
            <button onClick={() => setShowPopup(true)} className="bg-gray-900 text-white px-8 py-3 rounded-xl font-bold text-sm active:scale-95 transition-all shadow-lg">Checkout</button>
          </div>
        </div>
      )}

      {showPopup && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-8 max-w-xs w-full text-center shadow-2xl">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4"><i className="bx bx-time-five text-3xl"></i></div>
            <h2 className="text-lg font-bold text-gray-900">Fitur Segera Hadir!</h2>
            <p className="text-sm text-gray-500 mt-2 leading-relaxed">Integrasi Payment Gateway sedang dalam tahap pengembangan. Tunggu kabar selanjutnya ya!</p>
            <button onClick={() => setShowPopup(false)} className="mt-6 w-full py-3 bg-gray-900 text-white rounded-xl font-bold text-sm">Oke, Mengerti</button>
          </div>
        </div>
      )}
    </div>
  );
}