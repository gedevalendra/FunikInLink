"use client";

import { useState } from "react";
import EditProfileModal from "./editProfileModal";
import CustomizeProfileModal from "./customizeProfileModal"; // Import komponen baru

export default function ProfileSettings({ user, isAdmin }: { user: any, isAdmin: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCustomizeModal, setShowCustomizeModal] = useState(false); // State baru
  const [copied, setCopied] = useState(false);

  if (!isAdmin) return null;

  const handleShare = async () => {
    const currentUrl = window.location.href;
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
        console.log("Web Share dibatalkan:", err);
      }
    }

    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopied(true);
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
      >
        <i className="bx bx-cog text-xl"></i>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1 w-52 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-50 text-sm">
          {/* Edit Profile */}
          <button 
            onClick={() => { setShowEditModal(true); setIsOpen(false); }}
            className="w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-50 flex items-center gap-2"
          >
            <i className="bx bx-edit text-base text-gray-500"></i> Edit Profile
          </button>

          {/* Kustomisasi Tampilan - MENU BARU */}
          <button 
            onClick={() => { setShowCustomizeModal(true); setIsOpen(false); }}
            className="w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-50 flex items-center gap-2"
          >
            <i className="bx bx-palette text-base text-indigo-500"></i> Kustomisasi Profil
          </button>
          
          {/* Share Profile */}
          <button 
            onClick={handleShare}
            disabled={copied}
            className={`w-full text-left px-3 py-2 flex items-center justify-between transition-colors ${
              copied ? "bg-green-50 text-green-600 font-medium" : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            <div className="flex items-center gap-2">
              <i className={`bx ${copied ? "bx-check text-green-600" : "bx-share-alt text-gray-500"} text-base`}></i>
              <span>{copied ? "Link Tersalin!" : "Share Profile"}</span>
            </div>
          </button>
        </div>
      )}

      {/* Modal Render */}
      {showEditModal && (
        <EditProfileModal user={user} onClose={() => setShowEditModal(false)} />
      )}

      {showCustomizeModal && (
        <CustomizeProfileModal user={user} onClose={() => setShowCustomizeModal(false)} />
      )}
    </div>
  );
}