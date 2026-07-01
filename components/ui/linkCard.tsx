"use client";

import { useState } from "react";
import { deleteLink, updateLink } from "../../lib/actions";

const BOXICONS = [
  "bx-link",
  "bx-globe",
  "bxl-instagram",
  "bxl-tiktok",
  "bxl-youtube",
  "bxl-facebook",
  "bxl-twitter",
  "bxl-whatsapp",
  "bxl-telegram",
  "bxl-discord",
  "bxl-github",
  "bxl-linkedin",
  "bxl-spotify",
  "bx-store",
  "bx-shopping-bag",
  "bx-cart",
  "bx-home",
  "bx-envelope",
  "bx-phone",
  "bx-map",
  "bx-user",
  "bx-heart",
  "bx-star",
  "bx-camera",
  "bx-music",
  "bx-video",
  "bx-image",
  "bx-book",
  "bx-briefcase",
  "bx-coffee",
  "bx-bulb",
  "bx-calendar",
  "bx-compass",
  "bx-file",
  "bx-folder",
  "bx-gift",
  "bx-laptop",
  "bx-mobile",
  "bx-palette",
  "bx-pin",
  "bx-podcast",
  "bx-rocket",
  "bx-trophy",
  "bx-wallet",
  "bx-medal",
  "bx-store-alt",
  "bx-restaurant",
  "bx-building",
  "bxl-apple",
  "bxl-play-store",
  "bxl-steam",
  "bxl-twitch",
  "bxl-snapchat",
  "bxl-pinterest",
  "bxl-reddit",
  "bxl-medium",
  "bxl-dribbble",
  "bxl-behance",
  "bxl-figma",
  "bxl-wordpress",
  "bx-world",
  "bx-news",
  "bx-edit",
  "bx-chalkboard",
  "bx-bar-chart",
  "bx-line-chart",
  "bx-dollar-circle",
  "bx-credit-card",
  "bx-bitcoin",
  "bx-cloud",
  "bx-shield",
  "bx-check-shield",
  "bx-bus",
  "bx-car",
  "bx-train",
  "bx-plane",
  "bx-bed",
  "bx-book-reader",
  "bx-dumbbell",
  "bx-football",
  "bx-swim",
  "bx-spa",
  "bx-clinic",
  "bx-plus-medical",
  "bx-cake",
  "bx-bowl-hot",
  "bx-water",
  "bx-wind",
  "bx-sun",
  "bx-moon",
  "bx-leaf",
  "bx-flower",
  "bx-crown",
  "bx-diamond",
  "bx-cookie",
  "bx-game",
  "bx-ghost",
  "bx-bot",
  "bx-joystick",
  "bx-party",
];

interface LinkCardProps {
  link: any;
  isAdmin: boolean;
  isDummy?: boolean;
  index: number;
  isDraggable: boolean;
  isHolding: boolean;
  handleStartHold: (e: any) => void;
  handleEndHold: () => void;
}

export default function LinkCard({
  link,
  isAdmin,
  isDummy = false,
  index,
  isDraggable,
  isHolding,
  handleStartHold,
  handleEndHold,
}: LinkCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState(link.icon || "bx-link");
  const [showPicker, setShowPicker] = useState(false);

  return (
    <>
      {/* INDICATOR HANDLE DRAG */}
      // Ganti bagian INDICATOR HANDLE DRAG di dalam file linkCard.tsx kamu
      dengan kode ini:
      {isAdmin && !isDummy && (
        <div
          onMouseDown={handleStartHold}
          onMouseUp={handleEndHold}
          onMouseLeave={handleEndHold}
          onTouchStart={handleStartHold}
          onTouchEnd={handleEndHold}
          // FIXED: Ditambahkan class 'touch-none' agar browser mobile menyerahkan kendali sentuhan penuh ke Framer Motion
          className={`flex items-center justify-center self-center p-1 rounded text-gray-400 cursor-grab hover:text-slate-700 hover:bg-slate-100 transition-colors shrink-0 touch-none ${
            isDraggable
              ? "text-blue-600 bg-blue-50 cursor-grabbing animate-pulse"
              : ""
          }`}
          title="Tahan 0.2 detik untuk menyeret urutan"
        >
          <i
            className={`bx ${isDraggable ? "bx-grid-vertical" : "bx-grid-horizontal"} text-xl`}
          ></i>
        </div>
      )}
      {/* IKON UTAMA LINK */}
      <div className="text-yellow-600 transition-colors pt-0.5 text-2xl shrink-0">
        <i className={`bx ${link.icon}`}></i>
      </div>
      {/* INFORMASI KONTEN */}
      <div className="space-y-0.5 flex-1 min-w-0 pr-16">
        <h4 className="text-sm font-semibold text-gray-900 truncate flex items-center gap-2">
          {link.title}
          {isDummy && (
            <span className="text-[10px] font-normal px-1.5 py-0.5 bg-gray-200 text-gray-600 rounded-sm">
              Contoh
            </span>
          )}
          {isHolding && !isDraggable && (
            <span className="text-[10px] font-medium text-amber-600 bg-amber-50 px-1 py-0.5 rounded animate-pulse">
              Menyiapkan (0.2s)...
            </span>
          )}
          {isDraggable && (
            <span className="text-[10px] font-medium text-blue-600 bg-blue-50 px-1 py-0.5 rounded">
              Siap Geser!
            </span>
          )}
        </h4>
        {link.description && (
          <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
            {link.description}
          </p>
        )}
        <a
          href={isDummy ? "#" : link.url}
          target={isDummy ? "_self" : "_blank"}
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs text-blue-500 hover:text-blue-700 font-medium pt-1 truncate max-w-full"
        >
          <span className="truncate">
            {link.url.replace(/^https?:\/\//, "")}
          </span>
          <i className="bx bx-link-external text-[10px] shrink-0"></i>
        </a>
      </div>
      {/* TOMBOL AKSI EDIT & HAPUS */}
      {isAdmin && !isDummy && (
        <div className="absolute top-3 right-3 flex gap-1">
          <button
            onClick={() => {
              setSelectedIcon(link.icon || "bx-link");
              setIsEditing(true);
            }}
            className="p-1 text-gray-400 hover:text-blue-600 rounded hover:bg-slate-50 transition-colors"
          >
            <i className="bx bx-edit text-base"></i>
          </button>
          <button
            onClick={() => {
              if (confirm("Yakin ingin menghapus tautan ini?")) {
                deleteLink(link._id.toString());
              }
            }}
            className="p-1 text-gray-400 hover:text-rose-600 rounded hover:bg-slate-50 transition-colors"
          >
            <i className="bx bx-trash text-base"></i>
          </button>
        </div>
      )}
      {/* MODAL EDIT TAUTAN */}
      {isEditing && !isDummy && (
        <div className="fixed inset-0 bg-black/40 z-[200] flex items-center justify-center p-4">
          <div className="bg-white rounded-md p-6 w-full max-w-md shadow-xl max-h-[90vh] overflow-y-auto">
            <h3 className="font-bold text-lg mb-4 text-gray-800">
              Edit Tautan
            </h3>
            <form
              action={(formData) => {
                updateLink(formData);
                setIsEditing(false);
              }}
              className="space-y-4"
            >
              <input type="hidden" name="id" value={link._id.toString()} />
              <input type="hidden" name="icon" value={selectedIcon} />
              <input
                name="title"
                defaultValue={link.title}
                placeholder="Judul"
                required
                className="w-full p-2.5 border border-gray-200 rounded-md text-sm focus:outline-none"
              />
              <input
                name="url"
                defaultValue={link.url}
                placeholder="URL Lengkap"
                required
                className="w-full p-2.5 border border-gray-200 rounded-md text-sm focus:outline-none"
              />
              <input
                name="description"
                defaultValue={link.description}
                placeholder="Deskripsi singkat (Opsional)"
                className="w-full p-2.5 border border-gray-200 rounded-md text-sm focus:outline-none"
              />

              <div className="pt-2">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-semibold text-gray-500 uppercase">
                    Pilih Ikon
                  </p>
                  <button
                    type="button"
                    onClick={() => setShowPicker(!showPicker)}
                    className="text-xs text-yellow-600"
                  >
                    {showPicker ? "Sembunyikan" : "Ubah Ikon"}
                  </button>
                </div>
                {showPicker && (
                  <div className="grid grid-cols-6 sm:grid-cols-8 gap-2 max-h-48 overflow-y-auto p-2 border bg-gray-50 rounded-md">
                    {BOXICONS.map((icon) => (
                      <button
                        key={icon}
                        type="button"
                        onClick={() => setSelectedIcon(icon)}
                        className={`text-2xl p-1.5 rounded-md ${selectedIcon === icon ? "bg-yellow-100 text-yellow-600 ring-2 ring-yellow-500" : "text-gray-400"}`}
                      >
                        <i className={`bx ${icon}`}></i>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="flex-1 py-2.5 bg-gray-100 rounded-md text-sm"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-yellow-500 text-white rounded-md text-sm"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
