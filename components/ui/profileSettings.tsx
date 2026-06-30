"use client";

import { useState } from "react";
import EditProfileModal from "./editProfileModal";

export default function ProfileSettings({ user, isAdmin }: { user: any, isAdmin: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [copied, setCopied] = useState(false);

  // LOGIKA PENGUNJUNG: Jika bukan admin, JANGAN tampilkan tombol setting ini sama sekali
  if (!isAdmin) return null;

  // FUNGSI SHARE YANG SUDAH DIPERBAIKI
  const handleShare = async () => {
    const currentUrl = window.location.href; // Mengambil URL profil saat ini secara dinamis

    // 1. Coba gunakan Web Share API (Sangat optimal untuk browser HP/Mobile)
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Lihat profil resmi ${user.name}`,
          text: `Kunjungi tautan resmi @${user.username} di sini:`,
          url: currentUrl,
        });
        setIsOpen(false);
        return;
      } catch (err) {
        console.log("Web Share dibatalkan atau tidak didukung:", err);
      }
    }

    // 2. Fallback: Salin ke clipboard otomatis (Optimal untuk Desktop PC)
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      
      // Kembalikan teks status menjadi normal setelah 2 detik dan tutup dropdown
      setTimeout(() => {
        setCopied(false);
        setIsOpen(false);
      }, 2000);
    } catch (err) {
      alert("Gagal menyalin tautan.");
    }
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="p-1 text-gray-400 hover:text-gray-900 transition-colors rounded-md"
        aria-label="Settings"
      >
        <i className="bx bx-cog text-xl"></i>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1 w-44 bg-white border border-gray-200 rounded-lg shadow-md py-1 z-10 text-sm">
          {/* Tombol Edit Profile */}
          <button 
            onClick={() => { setShowEditModal(true); setIsOpen(false); }}
            className="w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-50 flex items-center gap-2"
          >
            <i className="bx bx-edit text-base text-gray-500"></i> Edit Profile
          </button>
          
          {/* Tombol Share yang sudah diperbaiki */}
          <button 
            onClick={handleShare}
            disabled={copied}
            className={`w-full text-left px-3 py-2 flex items-center justify-between transition-colors ${
              copied 
                ? "bg-green-50 text-green-600 font-medium" 
                : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            <div className="flex items-center gap-2">
              <i className={`bx ${copied ? "bx-check text-green-600" : "bx-share-alt text-gray-500"} text-base`}></i>
              <span>{copied ? "Link Tersalin!" : "Share Profile"}</span>
            </div>
          </button>
        </div>
      )}

      {showEditModal && (
        <EditProfileModal user={user} onClose={() => setShowEditModal(false)} />
      )}
    </div>
  );
}