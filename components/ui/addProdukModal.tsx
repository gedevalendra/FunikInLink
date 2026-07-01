"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { addProduk } from "../../lib/actions";

export default function AddProdukModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Mencegah hidrasi error pada Next.js Server-Side Rendering (SSR)
  useEffect(() => {
    setMounted(true);
  }, []);

  // Mengunci scroll layar belakang (Scroll Lock) saat modal terbuka
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    try {
      await addProduk(formData);
      setIsOpen(false);
      (e.target as HTMLFormElement).reset();
    } catch (err: any) {
      setError(err.message || "Gagal menambahkan produk.");
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <>
      {/* Tombol Pemicu Modal */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-3 rounded-lg text-xs sm:text-sm font-medium shadow-xs transition-all duration-200 active:scale-95"
      >
        <i className="bx bx-plus text-lg"></i> Tambah Produk Baru
      </button>

      {/* Backdrop & Dialog Modal menggunakan React Portal */}
      {isOpen && createPortal(
        <div 
          className="fixed inset-0 z-[9999] flex items-end justify-center bg-black/50 backdrop-blur-xs animate-fadeIn"
          onClick={() => setIsOpen(false)}
        >
          <div 
            className="w-full max-w-md bg-white rounded-t-3xl shadow-2xl p-6 text-slate-800 border-t border-neutral-100 max-h-[85vh] overflow-y-auto animate-slideUp"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Handle Bar dekorasi indikator bottom sheet (iOS style) */}
            <div className="w-12 h-1 bg-neutral-200 rounded-full mx-auto mb-5"></div>

            {/* Header Modal */}
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3 mb-4">
              <h3 className="text-base font-semibold text-neutral-900 flex items-center gap-2">
                <i className="bx bx-store text-yellow-500 text-xl"></i>
                Tambah Produk Baru
              </h3>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-md text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600 transition-colors"
              >
                <i className="bx bx-x text-xl"></i>
              </button>
            </div>

            {/* Form Pengisian Data */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-xs text-red-600 font-normal">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-neutral-500 mb-1">Nama Produk *</label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="Contoh: Ebook Panduan Next.js 15"
                  className="w-full px-3.5 py-2.5 bg-neutral-50/50 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-500 mb-1">Harga (Rupiah) *</label>
                <input
                  type="number"
                  name="price"
                  required
                  placeholder="Contoh: 150000"
                  className="w-full px-3.5 py-2.5 bg-neutral-50/50 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-500 mb-1">URL Link Gambar Produk *</label>
                <input
                  type="url"
                  name="image"
                  required
                  placeholder="https://domain.com/gambar-produk.jpg"
                  className="w-full px-3.5 py-2.5 bg-neutral-50/50 border border-neutral-200 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-500 mb-1">Deskripsi Singkat (Opsional)</label>
                <textarea
                  name="description"
                  rows={3}
                  placeholder="Tuliskan spesifikasi atau detail singkat produk Anda..."
                  className="w-full px-3.5 py-2.5 bg-neutral-50/50 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500 transition-all resize-none"
                />
              </div>

              {/* Tombol Aksi */}
              <div className="flex gap-3 mt-6 pt-2">
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => setIsOpen(false)}
                  className="flex-1 py-2.5 bg-neutral-100 text-neutral-600 rounded-xl text-sm font-medium hover:bg-neutral-200 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-2.5 bg-yellow-500 text-white rounded-xl text-sm font-medium hover:bg-yellow-600 transition-colors flex items-center justify-center gap-1.5"
                >
                  {loading ? (
                    <>
                      <i className="bx bx-loader-alt animate-spin text-sm"></i>
                      <span>Menyimpan...</span>
                    </>
                  ) : (
                    <span>Simpan Produk</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}