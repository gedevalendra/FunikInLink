"use client";

import { useState } from "react";
import { deleteLink, updateLink } from "../../lib/actions";

// Daftar 100 Ikon
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

interface LinkCardProps {
  link: any;
  isAdmin: boolean;
  isDummy?: boolean;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  isFirst?: boolean;
  isLast?: boolean;
}

export default function LinkCard({ 
  link, 
  isAdmin, 
  isDummy = false, 
  onMoveUp, 
  onMoveDown, 
  isFirst = false, 
  isLast = false 
}: LinkCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState(link.icon || "bx-link");
  const [showPicker, setShowPicker] = useState(false);

  return (
    <>
      <div 
        className={`relative flex items-start gap-4 p-3 -mx-3 rounded-xl transition-colors shadow-xs border border-gray-100/30 group ${
          isDummy ? "opacity-60 bg-gray-50/50 pointer-events-none select-none" : ""
        }`}
      >
        {/* Navigasi Sortir Atas Bawah (Hanya untuk Admin & Bukan Dummy) */}
        {isAdmin && !isDummy && (
          <div className="flex flex-col gap-0.5 self-center">
            <button
              onClick={onMoveUp}
              disabled={isFirst}
              className={`p-0.5 rounded text-gray-400 hover:bg-gray-100 hover:text-gray-900 transition-colors ${
                isFirst ? "opacity-20 cursor-not-allowed" : "opacity-100"
              }`}
              title="Pindahkan ke atas"
            >
              <i className="bx bx-chevron-up text-lg"></i>
            </button>
            <button
              onClick={onMoveDown}
              disabled={isLast}
              className={`p-0.5 rounded text-gray-400 hover:bg-gray-100 hover:text-gray-900 transition-colors ${
                isLast ? "opacity-20 cursor-not-allowed" : "opacity-100"
              }`}
              title="Pindahkan ke bawah"
            >
              <i className="bx bx-chevron-down text-lg"></i>
            </button>
          </div>
        )}

        <div className="text-yellow-600 transition-colors pt-0.5 text-2xl shrink-0">
          <i className={`bx ${link.icon}`}></i>
        </div>

        <div className="space-y-0.5 flex-1 min-w-0 pr-16">
          <h4 className="text-sm font-semibold text-gray-900 truncate">
            {link.title} {isDummy && <span className="text-[10px] font-normal px-1.5 py-0.5 bg-gray-200 text-gray-600 rounded-sm ml-1.5">Contoh</span>}
          </h4>
          {link.description && (
            <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{link.description}</p>
          )}
          <a 
            href={isDummy ? "#" : link.url}
            target={isDummy ? "_self" : "_blank"}
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-blue-500 hover:text-blue-700 font-medium pt-1 truncate max-w-full"
          >
            <span className="truncate">{link.url.replace(/^https?:\/\//, '')}</span>
            <i className="bx bx-link-external text-[10px] shrink-0"></i>
          </a>
        </div>

        {/* Tombol Aksi Edit dan Hapus */}
        {isAdmin && !isDummy && (
          <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity duration-200">
            <button 
              onClick={() => {
                setSelectedIcon(link.icon || "bx-link");
                setIsEditing(true);
              }}
              className="p-1.5 w-fit h-fit flex text-gray-400 hover:bg-blue-50 hover:text-blue-600 rounded-md transition-colors"
            >
              <i className="bx bx-edit text-base"></i>
            </button>
            <button 
              onClick={() => {
                if(confirm("Yakin ingin menghapus tautan ini?")) {
                  deleteLink(link._id.toString());
                }
              }}
              className="p-1.5 w-fit h-fit flex text-gray-400 hover:bg-rose-50 hover:text-rose-600 rounded-md transition-colors"
            >
              <i className="bx bx-trash text-base"></i>
            </button>
          </div>
        )}
      </div>

      {/* MODAL EDIT TAUTAN */}
      {isEditing && !isDummy && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl max-h-[90vh] overflow-y-auto">
            <h3 className="font-bold text-lg mb-4 text-gray-800">Edit Tautan</h3>
            
            <form action={(formData) => { updateLink(formData); setIsEditing(false); }} className="space-y-4">
              <input type="hidden" name="id" value={link._id.toString()} />
              <input type="hidden" name="icon" value={selectedIcon} />

              <input 
                name="title" 
                defaultValue={link.title}
                placeholder="Judul" 
                required 
                className="w-full p-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-yellow-500" 
              />
              <input 
                name="url" 
                defaultValue={link.url}
                placeholder="URL Lengkap" 
                required 
                className="w-full p-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-yellow-500" 
              />
              <input 
                name="description" 
                defaultValue={link.description}
                placeholder="Deskripsi singkat (Opsional)" 
                className="w-full p-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-yellow-500" 
              />
              
              {/* PEMILIH IKON */}
              <div className="pt-2">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Pilih Ikon</p>
                  <button 
                    type="button" 
                    onClick={() => setShowPicker(!showPicker)}
                    className="text-xs text-yellow-600 hover:text-yellow-700 flex items-center gap-1"
                  >
                    <i className="bx bx-slider-alt"></i> {showPicker ? "Sembunyikan Pilihan" : "Ubah Ikon"}
                  </button>
                </div>

                <div className="flex items-center gap-4 p-3 border border-gray-200 rounded-lg bg-gray-50">
                  <i className={`bx ${selectedIcon} text-3xl text-yellow-600 bg-yellow-100 p-2 rounded-lg`}></i>
                  <div className="text-xs text-gray-500">
                    Ikon tautan yang saat ini sedang digunakan.
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
                <button type="button" onClick={() => setIsEditing(false)} className="flex-1 py-2.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">Batal</button>
                <button type="submit" className="flex-1 py-2.5 bg-yellow-500 text-white rounded-lg text-sm font-medium hover:bg-yellow-600 transition-colors">Simpan Perubahan</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}