"use client";

import { useState, useEffect } from "react";
import { addLink } from "../../lib/actions";

const BOXICONS = [
  "bx-link", "bx-globe", "bxl-instagram", "bxl-tiktok", "bxl-youtube", "bxl-facebook", "bxl-twitter",
  "bxl-whatsapp", "bxl-telegram", "bxl-discord", "bxl-github", "bxl-linkedin", "bxl-spotify",
  "bx-store", "bx-shopping-bag", "bx-cart", "bx-home", "bx-envelope", "bx-phone", "bx-map",
  "bx-user", "bx-heart", "bx-star", "bx-camera", "bx-music", "bx-video", "bx-image", "bx-book",
  "bx-briefcase", "bx-coffee", "bx-bulb", "bx-calendar", "bx-compass", "bx-file", "bx-folder",
  "bx-gift", "bx-laptop", "bx-mobile", "bx-palette", "bx-pin", "bx-podcast", "bx-rocket",
  "bx-trophy", "bx-wallet", "bx-medal", "bx-store-alt", "bx-restaurant", "bx-building",
  "bxl-apple", "bxl-play-store", "bxl-steam", "bxl-twitch", "bxl-snapchat", "bxl-pinterest",
  "bxl-reddit", "bxl-medium", "bxl-dribbble", "bxl-behance", "bxl-figma", "bxl-wordpress",
  "bx-world", "bx-news", "bx-edit", "bx-chalkboard", "bx-bar-chart", "bx-line-chart",
  "bx-dollar-circle", "bx-credit-card", "bx-bitcoin", "bx-cloud", "bx-shield", "bx-check-shield",
  "bx-bus", "bx-car", "bx-train", "bx-plane", "bx-bed", "bx-book-reader", "bx-dumbbell",
  "bx-football", "bx-swim", "bx-spa", "bx-clinic", "bx-plus-medical", "bx-cake", "bx-bowl-hot",
  "bx-water", "bx-wind", "bx-sun", "bx-moon", "bx-leaf", "bx-flower", "bx-crown", "bx-diamond",
  "bx-cookie", "bx-game", "bx-ghost", "bx-bot", "bx-joystick", "bx-party"
];

function getIconFromUrl(url: string) {
  const lowerUrl = url.toLowerCase();
  if (lowerUrl.includes('instagram.com')) return 'bxl-instagram';
  if (lowerUrl.includes('tiktok.com')) return 'bxl-tiktok';
  if (lowerUrl.includes('youtube.com') || lowerUrl.includes('youtu.be')) return 'bxl-youtube';
  if (lowerUrl.includes('facebook.com') || lowerUrl.includes('fb.me')) return 'bxl-facebook';
  if (lowerUrl.includes('twitter.com') || lowerUrl.includes('x.com')) return 'bxl-twitter';
  if (lowerUrl.includes('wa.me') || lowerUrl.includes('whatsapp.com')) return 'bxl-whatsapp';
  if (lowerUrl.includes('t.me') || lowerUrl.includes('telegram.org')) return 'bxl-telegram';
  if (lowerUrl.includes('discord.com') || lowerUrl.includes('discord.gg')) return 'bxl-discord';
  if (lowerUrl.includes('github.com')) return 'bxl-github';
  if (lowerUrl.includes('linkedin.com')) return 'bxl-linkedin';
  if (lowerUrl.includes('pinterest.com')) return 'bxl-pinterest';
  if (lowerUrl.includes('snapchat.com')) return 'bxl-snapchat';
  if (lowerUrl.includes('twitch.tv')) return 'bxl-twitch';
  if (lowerUrl.includes('reddit.com')) return 'bxl-reddit';
  if (lowerUrl.includes('medium.com')) return 'bxl-medium';
  return 'bx-link';
}

export default function AddLinkModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [url, setUrl] = useState("");
  const [selectedIcon, setSelectedIcon] = useState("bx-link");
  const [showPicker, setShowPicker] = useState(false);

  // Mencegah elemen di bawahnya ikut di-scroll saat modal terbuka
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

  useEffect(() => {
    if (!showPicker) {
      setSelectedIcon(getIconFromUrl(url));
    }
  }, [url, showPicker]);

  return (
    <>
      <button 
        onClick={() => {
          setIsOpen(true);
          setUrl("");
          setSelectedIcon("bx-link");
          setShowPicker(false);
        }}
        className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-3 rounded-lg text-xs sm:text-sm font-medium shadow-xs transition-all duration-200 active:scale-95"
      >
        <i className="bx bx-plus text-lg"></i> Tambah Tautan Baru
      </button>

      {isOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        >
          <div 
            className="bg-white rounded-t-2xl sm:rounded-2xl p-6 w-full max-w-md shadow-xl max-h-[90vh] overflow-y-auto animate-slideUp sm:mb-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Garis Handle dekorasi untuk indikator bottom sheet di mobile */}
            <div className="w-12 h-1 bg-neutral-200 rounded-full mx-auto mb-4 sm:hidden"></div>

            <h3 className="font-bold text-lg mb-4 text-gray-800">Tambah Tautan</h3>
            
            <form action={(formData) => { addLink(formData); setIsOpen(false); }} className="space-y-4">
              <input type="hidden" name="icon" value={selectedIcon} />

              <input 
                name="title" 
                placeholder="Judul (misal: YouTube Saya)" 
                required 
                className="w-full p-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-yellow-500" 
              />
              <input 
                name="url" 
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="URL Lengkap (misal: https://youtube.com/...)" 
                required 
                className="w-full p-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-yellow-500" 
              />
              <input 
                name="description" 
                placeholder="Deskripsi singkat (Opsional)" 
                className="w-full p-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-yellow-500" 
              />
              
              <div className="pt-2">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Pilih Ikon</p>
                  <button 
                    type="button" 
                    onClick={() => setShowPicker(!showPicker)}
                    className="text-xs text-yellow-600 hover:text-yellow-700 flex items-center gap-1"
                  >
                    <i className="bx bx-slider-alt"></i> {showPicker ? "Sembunyikan Pilihan" : "Lihat Semua Ikon"}
                  </button>
                </div>

                <div className="flex items-center gap-4 p-3 border border-gray-200 rounded-lg bg-gray-50">
                  <i className={`bx ${selectedIcon} text-3xl text-yellow-600 bg-yellow-100 p-2 rounded-lg`}></i>
                  <div className="text-xs text-gray-500">
                    Ikon disesuaikan secara otomatis. Klik "Lihat Semua Ikon" jika ingin mengubahnya secara manual.
                  </div>
                </div>

                {showPicker && (
                  <div className="grid grid-cols-6 sm:grid-cols-8 gap-2 max-h-48 overflow-y-auto p-2 border border-gray-200 rounded-lg mt-3 bg-gray-50">
                    {BOXICONS.map(icon => (
                      <button
                        key={icon}
                        type="button"
                        onClick={() => setSelectedIcon(icon)}
                        className={`text-2xl p-1.5 rounded-md flex items-center justify-center transition-all ${
                          selectedIcon === icon 
                            ? 'bg-yellow-100 text-yellow-600 ring-2 ring-yellow-500' 
                            : 'text-gray-400 hover:bg-gray-200'
                        }`}
                      >
                        <i className={`bx ${icon}`}></i>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="flex gap-3 mt-6 pt-4">
                <button type="button" onClick={() => setIsOpen(false)} className="flex-1 py-2.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">Batal</button>
                <button type="submit" className="flex-1 py-2.5 bg-yellow-500 text-white rounded-lg text-sm font-medium hover:bg-yellow-600 transition-colors">Simpan Tautan</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}