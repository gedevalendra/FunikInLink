"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { data: session } = useSession();

  // Ambil data profile secara aman
  const userUsername = (session?.user as any)?.username || "";
  const userImage = session?.user?.image || "";
  const userName = session?.user?.name || "Pengguna";

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-300 ${
          isOpen ? "opacity-100 backdrop-blur-xs pointer-events-auto" : "opacity-0 pointer-events-none"
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
          {/* Tombol Close & Logo Sesuai Request */}
          <div className="w-full flex items-center justify-between mb-6">
            <span className="text-lg font-bold tracking-tight text-black">
              Funik<span className="text-yellow-500">In</span> Link
            </span>
            <button
              onClick={onClose}
              className="p-1.5 flex cursor-pointer rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-600 active:scale-95 transition-all duration-150"
            >
              <i className="bx bx-x text-2xl"></i>
            </button>
          </div>

          {/* Kartu Profil Ringkas (Jika Sudah Login) */}
          {session && (
            <div 
              className={`flex items-center gap-3 bg-slate-50 border border-slate-100 p-3.5 rounded-2xl mb-4 transition-all transform duration-300 ${
                isOpen ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0"
              }`}
            >
              {userImage ? (
                <img src={userImage} alt={userName} className="w-10 h-10 rounded-full border border-slate-200 object-cover" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-slate-800 text-white font-semibold flex items-center justify-center text-sm uppercase">
                  {userName.substring(0, 2)}
                </div>
              )}
              <div className="min-w-0">
                <p className="font-semibold text-sm text-slate-800 truncate">{userName}</p>
                <p className="text-xs text-slate-400 font-mono truncate">@{userUsername}</p>
              </div>
            </div>
          )}

          {/* Daftar Navigasi Utama Ber-HR */}
          <nav className="flex flex-col">
            <div className="border-b border-slate-100">
              <Link
                href="/"
                onClick={onClose}
                className={`flex items-center gap-3 px-3 py-3 rounded-xl font-medium text-slate-600 hover:bg-slate-50 hover:text-yellow-600 transition-all transform duration-300 ${
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
                className={`flex items-center gap-3 px-3 py-3 rounded-xl font-medium text-slate-600 hover:bg-slate-50 hover:text-yellow-600 transition-all transform duration-300 ${
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
                className={`flex items-center gap-3 px-3 py-3 rounded-xl font-medium text-slate-600 hover:bg-slate-50 hover:text-yellow-600 transition-all transform duration-300 ${
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
                    className={`flex items-center gap-3 px-3 py-3 rounded-xl font-medium text-slate-600 hover:bg-slate-50 hover:text-yellow-600 transition-all transform duration-300 ${
                      isOpen ? "translate-y-0 opacity-100 delay-[200ms]" : "-translate-y-4 opacity-0"
                    }`}
                  >
                    <i className="bx bx-user text-xl"></i>
                    Profile Saya
                  </Link>
                </div>

                {/* KHUSUS ADMIN PANEL */}
                {(session.user as any)?.role === "admin" && (
                  <div className="border-b border-slate-100">
                    <Link
                      href="/admin"
                      onClick={onClose}
                      className={`flex items-center gap-3 px-3 py-3 rounded-xl font-medium text-blue-600 hover:bg-blue-50 transition-all transform duration-300 ${
                        isOpen ? "translate-y-0 opacity-100 delay-[250ms]" : "-translate-y-4 opacity-0"
                      }`}
                    >
                      <i className="bx bx-shield-quarter text-xl"></i>
                      Admin Panel
                    </Link>
                  </div>
                )}
              </>
            )}
          </nav>
        </div>

        {/* BAGIAN BAWAH: Tombol Aksi Utama (Login / Logout) */}
        <div className="w-full mt-6">
          {session ? (
            <button
              onClick={() => {
                signOut({ callbackUrl: "/" });
                onClose();
              }}
              className={`w-full flex items-center justify-center gap-2 font-medium bg-rose-50 text-rose-600 border border-rose-100 py-3 rounded-2xl shadow-xs hover:bg-rose-100 active:scale-98 transition-all duration-150 transform ${
                isOpen ? "translate-y-0 opacity-100 delay-[300ms]" : "-translate-y-4 opacity-0"
              }`}
            >
              <i className="bx bx-log-out text-lg"></i>
              Keluar Akun
            </button>
          ) : (
            <Link
              href="/registrasi"
              onClick={onClose}
              className={`w-full block text-center font-medium bg-gradient-to-r from-yellow-500 to-amber-500 text-white py-3 rounded-2xl shadow-md hover:from-yellow-600 hover:to-amber-600 active:scale-98 transition-all duration-150 transform ${
                isOpen ? "translate-y-0 opacity-100 delay-[200ms]" : "-translate-y-4 opacity-0"
              }`}
            >
              Get Started
            </Link>
          )}
        </div>
      </div>
    </>
  );
}