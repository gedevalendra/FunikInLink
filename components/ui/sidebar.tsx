"use client";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  return (
    <>
      {/* Backdrop (Latar belakang gelap transparan saat sidebar buka) */}
      <div
        className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-100 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Kontainer Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-[75%] max-w-[350px] bg-white shadow-xl z-50 p-6 flex flex-col justify-start transition-transform duration-00 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Tombol Close */}
        <div className="w-full flex justify-end mb-8">
          <button
            onClick={onClose}
            className="p-2 flex w-fit h-fit cursor-pointer rounded-lg text-gray-600 hover:bg-gray-100 active:scale-95 transition-transform"
          >
            <i className="bx bx-x text-2xl"></i>
          </button>
        </div>

        {/* Daftar Menu dengan Animasi Muncul dari Atas ke Bawah */}
        <nav className="flex flex-col gap-4">
          <a
            href="#about"
            className={`text-lg font-medium text-gray-700 hover:text-yellow-500 transition-all transform duration-500 ${
              isOpen ? "translate-y-0 opacity-100 delay-[100ms]" : "-translate-y-4 opacity-0"
            }`}
          >
            About
          </a>
          <a
            href="#privacy"
            className={`text-lg font-medium text-gray-700 hover:text-yellow-500 transition-all transform duration-500 ${
              isOpen ? "translate-y-0 opacity-100 delay-[200ms]" : "-translate-y-4 opacity-0"
            }`}
          >
            Privacy
          </a>
          <a
            href="#get-started"
            className={`text-lg font-medium bg-yellow-500 text-white text-center p-3 rounded-xl shadow-md hover:bg-yellow-600 transition-all transform duration-500 ${
              isOpen ? "translate-y-0 opacity-100 delay-[300ms]" : "-translate-y-4 opacity-0"
            }`}
          >
            Get Started
          </a>
        </nav>
      </div>
    </>
  );
}