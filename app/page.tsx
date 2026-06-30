// app/page.tsx
import Header from "../components/layout/header";
import Footer from "../components/layout/footer";
import ProfileSettings from "../components/ui/profileSettings";
import { connectDB } from "../lib/db"; // Ganti dengan path file db Anda kemarin

// Skema Model Mongoose sederhana (bisa dipindah ke file terpisah di folder models/)
import mongoose from "mongoose";
const LinkSchema = new mongoose.Schema({
  icon: String,
  title: String,
  description: String,
  url: String,
});
const SharedLink = mongoose.models.SharedLink || mongoose.model("SharedLink", LinkSchema);

export default async function Home() {
  // 1. Koneksi langsung ke MongoDB secara aman dari sisi Server
  await connectDB();
  
  // 2. Ambil data link dari database asli
  const sharedLinks = await SharedLink.find({}).lean();

  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-900 font-sans">
      <Header />
      
      <main className="flex-grow max-w-xl w-full mx-auto px-6 py-12">
        
        {/* ================= SECTION 1: PROFILE (MINIMALIS) ================= */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            {/* Foto Profil Bulat 1x1 Simpel */}
            <div className="w-14 h-14 rounded-full bg-gray-900 text-white font-medium flex items-center justify-center text-lg flex-shrink-0">
              GV
            </div>

            {/* Informasi Akun */}
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="text-lg font-bold tracking-tight">Gede Valendra</h2>
                <i className="bx bxs-badge-check text-blue-500 text-lg"></i>
              </div>
              <p className="text-xs text-gray-500 font-mono">@gedevalendra</p>
            </div>
          </div>

          {/* Komponen Dropdown Client */}
          <ProfileSettings />
        </div>

        {/* Bio & Hashtag */}
        <div className="mt-4 space-y-3">
          <p className="text-sm text-gray-600 leading-relaxed max-w-md">
            Full-Stack Developer membangun solusi praktis berbasis web modern. Fokus pada performa, keamanan, dan pengalaman pengguna.
          </p>
          <div className="flex gap-2 text-xs font-mono text-gray-400">
            <span>#Developer</span>
            <span>#NextJS</span>
            <span>#FullStack</span>
          </div>
        </div>

        <hr className="my-8 border-gray-100" />

        {/* ================= SECTION 2: TAUTAN (DESAIN MANUSIAWI) ================= */}
        <div className="space-y-6">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Tautan Resmi</h3>
          
          {sharedLinks.length === 0 ? (
            <p className="text-xs text-gray-400 font-mono italic">Belum ada tautan di database...</p>
          ) : (
            sharedLinks.map((link: any) => (
              <div key={link._id.toString()} className="group relative flex items-start gap-4">
                {/* Icon Sederhana Tanpa Box Pembungkus Tebal */}
                <div className="text-gray-400 group-hover:text-yellow-600 transition-colors pt-0.5 text-xl">
                  <i className={`bx ${link.icon}`}></i>
                </div>

                {/* Teks Konten */}
                <div className="space-y-0.5 flex-1 min-w-0">
                  <h4 className="text-sm font-semibold text-gray-900">
                    {link.title}
                  </h4>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    {link.description}
                  </p>
                  <a 
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-yellow-600 hover:text-yellow-700 font-medium pt-1"
                  >
                    {link.url.replace(/^https?:\/\//, '')}
                    <i className="bx bx-link-external text-[10px]"></i>
                  </a>
                </div>
              </div>
            ))
          )}
        </div>

      </main>
      
      <Footer />
    </div>
  );
}