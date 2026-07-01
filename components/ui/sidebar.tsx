"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useSession, signOut } from "next-auth/react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { data: session } = useSession();

  // Ambil data profile secara aman dan akurat dari database session rill
  const userName = (session?.user as any)?.name || session?.user?.name || "Pengguna";
  const userImage = session?.user?.image || "";
  
  // Ambil username asli jika ada di session, jika tidak ada, ekstrak dari email sebagai fallback aman
  const userUsername = 
    (session?.user as any)?.username || 
    session?.user?.email?.split("@")[0] || 
    "user";

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
        className={`fixed top-0 right-0 h-full w-[80%] max-w-[340px] bg-white shadow-2xl z-50 p-6 flex flex-col justify-between transition-transform duration-300 ease-in-out text-slate-800 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* BAGIAN ATAS: Header & Info Profil */}
        <div className="flex flex-col">
          {/* Tombol Close & Logo */}
          <div className="w-full flex items-center justify-between mb-6">
            <span className="text-base sm:text-lg font-medium tracking-tight text-black">
              Funik<span className="text-yellow-500">In</span> Link
            </span>
            <button
              onClick={onClose}
              className="p-1.5 flex cursor-pointer rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-600 active:scale-95 transition-all duration-150"
            >
              <i className="bx bx-x text-2xl"></i>
            </button>
          </div>

          {/* KARTU PROFIL (Kondisional: Real User / Dummy User) */}
          {session ? (
            <div 
              className={`flex items-center gap-3 bg-slate-50 border border-slate-100 p-3 rounded-md mb-4 transition-all transform duration-300 ${
                isOpen ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0"
              }`}
            >
              {userImage ? (
                <img src={userImage} alt={userName} className="w-10 h-10 rounded-md border border-slate-200 object-cover" />
              ) : (
                <div className="w-10 h-10 rounded-md bg-slate-800 text-white font-medium flex items-center justify-center text-xs uppercase shrink-0">
                  {userName.substring(0, 2)}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="font-medium text-sm sm:text-base text-slate-800 truncate">{userName}</p>
                <p className="text-xs text-slate-400 font-mono truncate">@{userUsername}</p>
              </div>
            </div>
          ) : (
            <div 
              className={`flex items-center gap-3 bg-amber-50/50 border border-amber-100 p-3 rounded-md mb-4 transition-all transform duration-300 ${
                isOpen ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0"
              }`}
            >
              <div className="w-10 h-10 rounded-md bg-yellow-500 text-white flex items-center justify-center text-base shrink-0">
                <i className="bx bx-user-circle"></i>
              </div>
              <div className="min-w-0">
                <p className="font-medium text-sm sm:text-base text-slate-800 truncate">Tamu FunikIn</p>
                <p className="text-xs text-yellow-600 font-medium truncate">Silahkan masuk ke akun anda</p>
              </div>
            </div>
          )}

          {/* Daftar Navigasi Utama Ber-HR */}
          <nav className="flex flex-col text-sm sm:text-base">
            <div className="border-b border-slate-100">
              <Link
                href="/"
                onClick={onClose}
                className={`flex items-center gap-3 px-3 py-3.5 rounded-md font-medium text-slate-600 hover:bg-slate-50 hover:text-yellow-600 transition-all transform duration-300 ${
                  isOpen ? "translate-y-0 opacity-100 delay-[50ms]" : "-translate-y-4 opacity-0"
                }`}
              >
                <i className="bx bx-home-alt text-xl"></i>
                Home
              </Link>
            </div>
            
            <div className="border-b border-slate-100">
              <Link
                href="/About"
                onClick={onClose}
                className={`flex items-center gap-3 px-3 py-3.5 rounded-md font-medium text-slate-600 hover:bg-slate-50 hover:text-yellow-600 transition-all transform duration-300 ${
                  isOpen ? "translate-y-0 opacity-100 delay-[100ms]" : "-translate-y-4 opacity-0"
                }`}
              >
                <i className="bx bx-info-circle text-xl"></i>
                About
              </Link>
            </div>
            
            <div className="border-b border-slate-100">
              <Link
                href="/Privacy"
                onClick={onClose}
                className={`flex items-center gap-3 px-3 py-3.5 rounded-md font-medium text-slate-600 hover:bg-slate-50 hover:text-yellow-600 transition-all transform duration-300 ${
                  isOpen ? "translate-y-0 opacity-100 delay-[150ms]" : "-translate-y-4 opacity-0"
                }`}
              >
                <i className="bx bx-shield-alt-2 text-xl"></i>
                Privacy
              </Link>
            </div>

            {/* Menu Akun Tambahan */}
            {session && (
              <>
                <div className="border-b border-slate-100">
                  <Link
                    href={`/${userUsername}`}
                    onClick={onClose}
                    className={`flex items-center gap-3 px-3 py-3.5 rounded-md font-medium text-slate-600 hover:bg-slate-50 hover:text-yellow-600 transition-all transform duration-300 ${
                      isOpen ? "translate-y-0 opacity-100 delay-[200ms]" : "-translate-y-4 opacity-0"
                    }`}
                  >
                    <i className="bx bx-user text-xl"></i>
                    Profile Saya
                  </Link>
                </div>

                {/* MENU BARU: KERANJANG */}
                <div className="border-b border-slate-100">
                  <Link
                    href={`/${userUsername}/chart`}
                    onClick={onClose}
                    className={`flex items-center gap-3 px-3 py-3.5 rounded-md font-medium text-slate-600 hover:bg-slate-50 hover:text-yellow-600 transition-all transform duration-300 ${
                      isOpen ? "translate-y-0 opacity-100 delay-[220ms]" : "-translate-y-4 opacity-0"
                    }`}
                  >
                    <i className="bx bx-cart text-xl"></i>
                    Keranjang Belanja
                  </Link>
                </div>

                {/* MENU ADMIN PANEL AKTIF */}
                {(session.user as any)?.role === "admin" && (
                  <div className="border-b border-slate-100">
                    <Link
                      href="/admin"
                      onClick={onClose}
                      className={`flex items-center gap-3 px-3 py-3.5 rounded-md font-medium text-slate-600 hover:bg-slate-50 hover:text-red-600 transition-all transform duration-300 ${
                        isOpen ? "translate-y-0 opacity-100 delay-[240ms]" : "-translate-y-4 opacity-0"
                      }`}
                    >
                      <i className="bx bx-grid-alt text-xl text-red-500"></i>
                      Admin Panel
                    </Link>
                  </div>
                )}
              </>
            )}
          </nav>
        </div>

        {/* BAGIAN BAWAH: Tombol Utama Dinamis dengan Animasi Loop */}
        <div className="w-full mt-6 relative px-1">
          {session ? (
            <div className="relative group w-full">
              {/* Efek Icon Beterbangan di atas tombol merah */}
              <div className="absolute -top-4 inset-x-0 h-10 pointer-events-none overflow-visible z-20">
                <i className="bx bx-heart icon-fly text-red-500 text-xs" style={{ left: '15%', animationDuration: '2.5s', animationDelay: '0s' }}></i>
                <i className="bx bx-link-alt icon-fly text-rose-400 text-[10px]" style={{ left: '35%', animationDuration: '3.2s', animationDelay: '0.6s' }}></i>
                <i className="bx bxs-star icon-fly text-red-600 text-[10px]" style={{ left: '55%', animationDuration: '2.8s', animationDelay: '1.2s' }}></i>
                <i className="bx bx-message-rounded icon-fly text-rose-500 text-[10px]" style={{ left: '80%', animationDuration: '3.5s', animationDelay: '0.3s' }}></i>
              </div>

              <button
                onClick={() => {
                  signOut({ callbackUrl: "/" });
                  onClose();
                }}
                className={`w-full flex items-center justify-center gap-2 font-normal bg-gradient-to-r from-red-600 via-rose-600 to-red-700 animate-gradient-shift text-white py-3 rounded-md text-sm sm:text-base tracking-wide transition-all transform duration-300 ${
                  isOpen ? "translate-y-0 opacity-100 delay-[300ms]" : "-translate-y-4 opacity-0"
                }`}
              >
                <i className="bx bx-log-out text-base animate-pulse"></i>
                Keluar Akun
              </button>
            </div>
          ) : (
            <div className="relative group w-full">
              {/* Efek Icon Beterbangan di atas tombol outline hitam */}
              <div className="absolute -top-4 inset-x-0 h-10 pointer-events-none overflow-visible z-20">
                <i className="bx bx-link icon-fly text-slate-700 text-xs" style={{ left: '20%', animationDuration: '3s', animationDelay: '0.2s' }}></i>
                <i className="bx bx-camera icon-fly text-slate-500 text-[10px]" style={{ left: '45%', animationDuration: '2.4s', animationDelay: '0s' }}></i>
                <i className="bx bx-user icon-fly text-slate-600 text-[10px]" style={{ left: '70%', animationDuration: '3.6s', animationDelay: '0.8s' }}></i>
              </div>

              <Link
                href="/registrasi"
                onClick={onClose}
                className={`w-full block text-center font-normal bg-transparent text-slate-900 border border-slate-900 py-3 rounded-md text-sm sm:text-base tracking-wide transition-all transform duration-300 ${
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