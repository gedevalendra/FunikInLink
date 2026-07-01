"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

// Tipe data properti yang wajib dibaca oleh header.tsx
interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

// Subkomponen untuk mendeteksi gambar profil yang rusak/invalid
function SidebarAvatar({ src, alt, fallbackText }: { src: string; alt: string; fallbackText: string }) {
  const [hasError, setHasError] = useState(false);

  if (!src || hasError) {
    return (
      <div className="w-10 h-10 rounded-xl bg-neutral-900 text-white font-medium flex items-center justify-center text-xs uppercase shrink-0 select-none">
        {fallbackText.substring(0, 2)}
      </div>
    );
  }

  return (
    <img 
      src={src} 
      alt={alt} 
      onError={() => setHasError(true)}
      className="w-10 h-10 rounded-xl border border-neutral-200/60 object-cover shrink-0" 
    />
  );
}

// Pastikan yang diekspor default menggunakan tipe data SidebarProps yang benar
export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { data: session } = useSession();

  const userImage = session?.user?.image || "";
  const userName = (session?.user as any)?.name || session?.user?.name || "Pengguna";
  const userUsername = (session?.user as any)?.username || session?.user?.email?.split("@")[0] || "user";

  // Efek Mengunci Scroll Halaman Belakang ketika Sidebar Aktif/Terbuka
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

  return (
    <>
      {/* Tambahan Global Keyframes khusus untuk animasi gradasi bergerak dan icon terbang */}
      <style jsx global>{`
        @keyframes gradientMove {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes floatUp {
          0% { transform: translateY(10px) scale(0.6); opacity: 0; }
          20% { opacity: 0.7; }
          80% { opacity: 0.4; }
          100% { transform: translateY(-55px) scale(1.1); opacity: 0; }
        }
        .animate-gradient-shift {
          background-size: 200% 200%;
          animation: gradientMove 4s ease infinite;
        }
        .icon-fly {
          position: absolute;
          pointer-events: none;
          animation: floatUp infinite linear;
        }
      `}</style>

      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-300 ${
          isOpen ? "opacity-100 backdrop-blur-[2px] pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Kontainer Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-[80%] max-w-[340px] bg-white shadow-2xl z-50 p-6 flex flex-col justify-between transition-transform duration-300 ease-in-out text-neutral-800 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* BAGIAN ATAS: Header & Info Profil */}
        <div className="flex flex-col">
          {/* Tombol Close & Logo */}
          <div className="w-full flex items-center justify-between mb-6">
            <span className="text-base sm:text-lg font-semibold tracking-tight text-neutral-900">
              Funik<span className="text-yellow-500 font-medium">In</span> Link
            </span>
            <button
              onClick={onClose}
              className="p-1.5 flex cursor-pointer rounded-xl text-neutral-400 hover:bg-neutral-50 hover:text-neutral-600 active:scale-95 transition-all duration-150"
            >
              <i className="bx bx-x text-2xl"></i>
            </button>
          </div>

          {/* KARTU PROFIL (Kondisional: Real User / Dummy User) */}
          {session ? (
            <div 
              className={`flex items-center gap-3 bg-neutral-50/50 border border-neutral-200/60 p-3 rounded-xl mb-4 transition-all transform duration-300 ${
                isOpen ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0"
              }`}
            >
              <SidebarAvatar src={userImage} alt={userName} fallbackText={userName} />
              
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-sm text-neutral-800 truncate">{userName}</p>
                <p className="text-xs text-neutral-400 font-mono truncate">@{userUsername}</p>
              </div>
            </div>
          ) : (
            <div 
              className={`flex items-center gap-3 bg-neutral-50/50 border border-neutral-100 p-3 rounded-xl mb-4 transition-all transform duration-300 ${
                isOpen ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0"
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-neutral-100 border border-neutral-200/40 text-neutral-500 flex items-center justify-center text-lg shrink-0">
                <i className="bx bx-user-circle"></i>
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-sm text-neutral-800 truncate">Tamu FunikIn</p>
                <p className="text-[11px] text-neutral-400 font-medium truncate">Silakan masuk ke akun Anda</p>
              </div>
            </div>
          )}

          {/* Daftar Navigasi Utama */}
          <nav className="flex flex-col text-sm">
            <div className="border-b border-neutral-100/60">
              <Link
                href="/"
                onClick={onClose}
                className={`flex items-center gap-3 px-3 py-3 rounded-xl font-medium text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 transition-all transform duration-300 ${
                  isOpen ? "translate-y-0 opacity-100 delay-[50ms]" : "-translate-y-4 opacity-0"
                }`}
              >
                <i className="bx bx-home-alt text-lg text-neutral-400"></i>
                Home
              </Link>
            </div>
            
            <div className="border-b border-neutral-100/60">
              <Link
                href="/About"
                onClick={onClose}
                className={`flex items-center gap-3 px-3 py-3 rounded-xl font-medium text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 transition-all transform duration-300 ${
                  isOpen ? "translate-y-0 opacity-100 delay-[100ms]" : "-translate-y-4 opacity-0"
                }`}
              >
                <i className="bx bx-info-circle text-lg text-neutral-400"></i>
                About
              </Link>
            </div>
            
            <div className="border-b border-neutral-100/60">
              <Link
                href="/Privacy"
                onClick={onClose}
                className={`flex items-center gap-3 px-3 py-3 rounded-xl font-medium text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 transition-all transform duration-300 ${
                  isOpen ? "translate-y-0 opacity-100 delay-[150ms]" : "-translate-y-4 opacity-0"
                }`}
              >
                <i className="bx bx-shield-alt-2 text-lg text-neutral-400"></i>
                Privacy
              </Link>
            </div>

            {/* Menu Akun Tambahan */}
            {session && (
              <>
                <div className="border-b border-neutral-100/60">
                  <Link
                    href={`/${userUsername}`}
                    onClick={onClose}
                    className={`flex items-center gap-3 px-3 py-3 rounded-xl font-medium text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 transition-all transform duration-300 ${
                      isOpen ? "translate-y-0 opacity-100 delay-[200ms]" : "-translate-y-4 opacity-0"
                    }`}
                  >
                    <i className="bx bx-user text-lg text-neutral-400"></i>
                    Profile Saya
                  </Link>
                </div>

                <div className="border-b border-neutral-100/60">
                  <Link
                    href={`/${userUsername}/chart`}
                    onClick={onClose}
                    className={`flex items-center gap-3 px-3 py-3 rounded-xl font-medium text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 transition-all transform duration-300 ${
                      isOpen ? "translate-y-0 opacity-100 delay-[220ms]" : "-translate-y-4 opacity-0"
                    }`}
                  >
                    <i className="bx bx-cart text-lg text-neutral-400"></i>
                    Keranjang Belanja
                  </Link>
                </div>

                {/* MENU ADMIN PANEL */}
                {(session.user as any)?.role === "admin" && (
                  <div className="border-b border-neutral-100/60">
                    <Link
                      href="/admin"
                      onClick={onClose}
                      className={`flex items-center gap-3 px-3 py-3 rounded-xl font-medium text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 transition-all transform duration-300 ${
                        isOpen ? "translate-y-0 opacity-100 delay-[240ms]" : "-translate-y-4 opacity-0"
                      }`}
                    >
                      <i className="bx bx-grid-alt text-lg text-neutral-400"></i>
                      Admin Panel
                    </Link>
                  </div>
                )}
              </>
            )}
          </nav>
        </div>

        {/* BAGIAN BAWAH: Tombol Keluar / Masuk */}
        <div className="w-full mt-6 relative px-1">
          {session ? (
            <div className="relative group w-full">
              <div className="absolute -top-4 inset-x-0 h-10 pointer-events-none overflow-visible z-20">
                <i className="bx bx-heart icon-fly text-neutral-400 text-xs" style={{ left: '15%', animationDuration: '2.5s', animationDelay: '0s' }}></i>
                <i className="bx bx-link-alt icon-fly text-neutral-300 text-[10px]" style={{ left: '35%', animationDuration: '3.2s', animationDelay: '0.6s' }}></i>
                <i className="bx bxs-star icon-fly text-neutral-400 text-[10px]" style={{ left: '55%', animationDuration: '2.8s', animationDelay: '1.2s' }}></i>
                <i className="bx bx-message-rounded icon-fly text-neutral-300 text-[10px]" style={{ left: '80%', animationDuration: '3.5s', animationDelay: '0.3s' }}></i>
              </div>

              <button
                onClick={() => {
                  signOut({ callbackUrl: "/" });
                  onClose();
                }}
                className={`w-full flex items-center justify-center gap-2 font-medium bg-neutral-900 text-white py-2.5 rounded-xl text-xs sm:text-sm tracking-wide transition-all transform duration-300 hover:bg-neutral-800 active:scale-95 ${
                  isOpen ? "translate-y-0 opacity-100 delay-[300ms]" : "-translate-y-4 opacity-0"
                }`}
              >
                <i className="bx bx-log-out text-sm"></i>
                Keluar Akun
              </button>
            </div>
          ) : (
            <div className="relative group w-full">
              <div className="absolute -top-4 inset-x-0 h-10 pointer-events-none overflow-visible z-20">
                <i className="bx bx-link icon-fly text-neutral-400 text-xs" style={{ left: '20%', animationDuration: '3s', animationDelay: '0.2s' }}></i>
                <i className="bx bx-camera icon-fly text-neutral-300 text-[10px]" style={{ left: '45%', animationDuration: '2.4s', animationDelay: '0s' }}></i>
                <i className="bx bx-user icon-fly text-neutral-400 text-[10px]" style={{ left: '70%', animationDuration: '3.6s', animationDelay: '0.8s' }}></i>
              </div>

              <Link
                href="/registrasi"
                onClick={onClose}
                className={`w-full block text-center font-medium bg-transparent text-neutral-900 border border-neutral-900 py-2.5 rounded-xl text-xs sm:text-sm tracking-wide transition-all transform duration-300 hover:bg-neutral-50 active:scale-95 ${
                  isOpen ? "translate-y-0 opacity-100 delay-[200ms]" : "-translate-y-4 opacity-0"
                }`}
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}