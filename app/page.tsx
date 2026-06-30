import Link from "next/link";
import Header from "../components/layout/header";
import Footer from "../components/layout/footer";
import { getServerSession } from "next-auth";
import { authOptions } from "../lib/auth";

export default async function LandingPage() {
  const session = await getServerSession(authOptions);
  
  // Ambil username dengan aman jika ada
  const userUsername = (session?.user as any)?.username || "";

  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-900 font-sans">
      <Header />
      <main className="flex-grow flex flex-col items-center justify-center text-center px-6 max-w-2xl mx-auto space-y-6">
        <div className="w-20 h-20 bg-gray-900 rounded-2xl flex items-center justify-center shadow-lg transform rotate-3">
          <i className="bx bx-link text-4xl text-white"></i>
        </div>
        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-gray-900 leading-tight">
          Satu Tautan untuk <span className="text-yellow-600">Semua Kreativitasmu</span>
        </h1>
        <p className="text-base text-gray-500 max-w-md leading-relaxed">
          Kelola portofolio, media sosial, dan tautan pentingmu dalam satu halaman profil kustom yang indah dan responsif.
        </p>
        <div className="pt-4">
          
          {/* LOGIKA TOMBOL BERANDA SEKARANG MENANGKAP URL USERNAME */}
          {session ? (
            <Link 
              href={`/${userUsername}`} 
              className="bg-yellow-500 text-white font-medium py-3.5 px-8 rounded-xl hover:bg-yellow-600 transition-all shadow-md hover:shadow-lg inline-block active:scale-95"
            >
              Halo, {session.user?.name}! Ke Profil Saya 
            </Link>
          ) : (
            <Link 
              href="/registrasi" 
              className="bg-gray-900 text-white font-medium py-3.5 px-8 rounded-xl hover:bg-black transition-all shadow-md hover:shadow-lg inline-block active:scale-95"
            >
              Buat FunikIn Link Gratis
            </Link>
          )}

        </div>
      </main>
      <Footer />
    </div>
  );
}