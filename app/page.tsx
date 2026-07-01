import { getServerSession } from "next-auth";
import { authOptions } from "../lib/auth";
import InteractiveHero from "../components/ui/interactiveHero";
import ParallaxWrapper from "../components/ui/parallaxWrapper"; 
import { connectDB } from "../lib/db"; 
import { User } from "../lib/models";   
import Link from "next/link";

export default async function LandingPage() {
  const session = await getServerSession(authOptions);
  
  let userUsername = "";
  let Name = "";

  if (session?.user?.email) {
    await connectDB();
    const dbUser = await User.findOne({ email: session.user.email }).lean();
    
    if (dbUser) {
      userUsername = dbUser.username || "";
      Name = dbUser.name || "";
    }
  }

  // Data Dummy untuk FAQ
  const faqData = [
    {
      q: "Apa itu FunikIn Link?",
      a: "FunikIn Link adalah platform penyedia 'Link in Bio' yang memudahkan kreator, pebisnis, dan profesional untuk mengumpulkan semua tautan penting, media sosial, dan portofolio mereka dalam satu halaman kustom yang indah."
    },
    {
      q: "Apakah layanan ini gratis?",
      a: "Ya! Kami menyediakan fitur dasar secara gratis yang bisa langsung kamu gunakan setelah mendaftar. Kami juga memiliki paket premium dengan fitur kustomisasi tingkat lanjut."
    },
    {
      q: "Bagaimana cara menghubungkan dengan Midtrans?",
      a: "Kamu bisa mengintegrasikan pembayaran digital secara langsung melalui dashboard pengaturan profil milikmu dengan memasukkan Client Key Midtrans yang sudah disediakan."
    },
    {
      q: "Apakah halaman profil saya ramah perangkat seluler?",
      a: "Tentu saja. Semua tema dan tata letak di FunikIn Link didesain dengan pendekatan mobile-first agar terlihat sempurna di layar smartphone maupun desktop."
    }
  ];

  return (
    <div className="flex flex-col min-h-screen text-gray-900 font-sans pt-20 relative overflow-x-hidden bg-slate-50">
      
      {/* ==========================================
          1. SECTION HERO ANIMASI (TRUE PARALLAX)
          ========================================== */}
      <ParallaxWrapper>
        <InteractiveHero session={session} userUsername={userUsername} Name={Name} />
      </ParallaxWrapper>

      {/* ==========================================
          2. WRAPPER KONTEN BAWAH (Modern & High Converting)
          ========================================== */}
      <div className="relative z-10 bg-white mt-[100vh] shadow-[0_-20px_50px_rgba(0,0,0,0.08)] rounded-t-[2.5rem]">
        
        {/* SECTION MEDIA PARTNER */}
        <section className="w-full bg-slate-50/60 py-12 border-b border-slate-100 overflow-hidden flex flex-col items-center rounded-t-[2.5rem]">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-6 text-center">
            Our Main Partners
          </p>
          <div className="w-full max-w-[30rem] px-4 opacity-60 hover:opacity-100 transition-opacity duration-300">
            <div className="flex flex-row items-center justify-center gap-12 text-center">
              <div className="flex items-center gap-2 font-bold text-base text-slate-600 whitespace-nowrap">
                <i className="bx bx-globe text-2xl text-yellow-500"></i>
                FunikIn Edu
              </div>
            </div>
          </div>
        </section>

        {/* SECTION STRUKTUR PROGRAM / FITUR UTAMA */}
        <section className="w-full py-24 bg-white">
          <div className="max-w-5xl mx-auto px-6">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-xs font-bold text-yellow-600 uppercase tracking-widest bg-yellow-50 px-3 py-1 rounded-full">Fitur Unggulan</span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mt-3">
                Cara Kerja & Keunggulan Utama
              </h2>
              <p className="text-sm md:text-base text-slate-500 mt-3 leading-relaxed">
                Didesain super ringkas agar profil sosial mediamu menghasilkan lebih banyak klik, konversi, dan interaksi.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-8 bg-slate-50/50 border border-slate-100 rounded-2xl hover:bg-white hover:shadow-xl hover:border-transparent transition-all duration-300 group">
                <div className="w-12 h-12 bg-yellow-500 text-white flex items-center justify-center rounded-xl mb-6 shadow-md shadow-yellow-500/20 group-hover:scale-110 transition-transform">
                  <i className="bx bx-slider-alt text-2xl"></i>
                </div>
                <h3 className="font-bold text-lg text-slate-800 mb-3">1. Hias Profil Instan</h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Kamu bisa ganti warna, pasang foto terbaik, susun link sesukamu, dan langsung pakai animasi tombol keren agar pengunjung betah berlama-lama.
                </p>
              </div>

              <div className="p-8 bg-slate-50/50 border border-slate-100 rounded-2xl hover:bg-white hover:shadow-xl hover:border-transparent transition-all duration-300 group">
                <div className="w-12 h-12 bg-red-500 text-white flex items-center justify-center rounded-xl mb-6 shadow-md shadow-red-500/20 group-hover:scale-110 transition-transform">
                  <i className="bx bx-wallet text-2xl"></i>
                </div>
                <h3 className="font-bold text-lg text-slate-800 mb-3">2. Terima Uang & Donasi</h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Pengunjung bisa langsung bayar produk digitalmu atau kirim donasi dukungan lewat QRIS, transfer bank, dan e-wallet secara aman dari profilmu.
                </p>
              </div>

              <div className="p-8 bg-slate-50/50 border border-slate-100 rounded-2xl hover:bg-white hover:shadow-xl hover:border-transparent transition-all duration-300 group">
                <div className="w-12 h-12 bg-slate-900 text-white flex items-center justify-center rounded-xl mb-6 shadow-md shadow-slate-900/20 group-hover:scale-110 transition-transform">
                  <i className="bx bx-line-chart text-2xl"></i>
                </div>
                <h3 className="font-bold text-lg text-slate-800 mb-3">3. Laporan Analitik</h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Pantau dengan mudah berapa orang yang mengintip profilmu hari ini, link mana yang paling sering diklik, tanpa perlu pusing membaca grafik rumit.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION LIVE PREVIEW MOCKUP (Simulasi Ringan [username]/page) */}
        <section className="w-full py-20 bg-slate-50 border-y border-slate-100">
          <div className="max-w-5xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-5 space-y-5 text-center lg:text-left">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full">Live Demo Layout</span>
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
                Tampilan Halaman yang Didapatkan Pengunjung
              </h2>
              <p className="text-sm md:text-base text-slate-500 leading-relaxed">
                Ini adalah visualisasi nyata dari halaman link bio milikmu. Responsif, memuat sangat cepat, dan dioptimalkan penuh untuk kenyamanan navigasi ponsel seluler.
              </p>
            </div>

            <div className="lg:col-span-7 flex justify-center w-full">
              {/* Kontainer Smartphone Mockup Ringan */}
              <div className="w-full max-w-[340px] bg-white rounded-[2.5rem] p-4 shadow-2xl border-4 border-slate-900 relative aspect-[9/16] flex flex-col">
                <div className="w-28 h-4 bg-slate-900 absolute top-0 left-1/2 transform -translate-x-1/2 rounded-b-xl z-20"></div>
                
                {/* Isi Komponen Simulasi Dinamis */}
                <div className="flex-grow flex flex-col items-center pt-8 overflow-y-auto no-scrollbar text-center px-4">
                  <div className="w-16 h-16 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center text-lg uppercase shadow-md mb-3">
                    GV
                  </div>
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-1">
                    Gede Valendra
                    <i className="bx bxs-badge-check text-blue-500 text-sm"></i>
                  </h3>
                  <p className="text-[11px] text-slate-400 font-mono mt-0.5">@gedevalendra</p>
                  <p className="text-xs text-slate-500 mt-2 line-clamp-2">Full-Stack Developer | Passionate about practical solutions.</p>
                  
                  <hr className="w-full my-4 border-slate-100" />
                  
                  {/* List Tautan Simulasi Standar */}
                  <div className="w-full space-y-2.5">
                    <div className="w-full p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-3">
                      <i className="bx bxl-github text-xl text-slate-700"></i>
                      <div className="text-left min-w-0 flex-1">
                        <p className="text-xs font-bold text-slate-800 truncate">GitHub Repository</p>
                      </div>
                    </div>
                    <div className="w-full p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-3">
                      <i className="bx bxl-linkedin text-xl text-blue-600"></i>
                      <div className="text-left min-w-0 flex-1">
                        <p className="text-xs font-bold text-slate-800 truncate">LinkedIn Professional</p>
                      </div>
                    </div>
                    <div className="w-full p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-3">
                      <i className="bx bx-globe text-xl text-emerald-600"></i>
                      <div className="text-left min-w-0 flex-1">
                        <p className="text-xs font-bold text-slate-800 truncate">FunikIn Edu Platform</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* SECTION PREMIUM BANNER / CALL TO ACTION PROMO */}
        <section className="w-full py-20 bg-white">
          <div className="max-w-4xl mx-auto px-6">
            <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 rounded-3xl p-8 md:p-12 shadow-xl text-center md:text-left relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/10 rounded-full blur-3xl pointer-events-none"></div>
              
              <div className="space-y-3 max-w-xl relative z-10">
                <span className="text-xs font-bold text-yellow-400 bg-yellow-400/10 px-3 py-1 rounded-md uppercase tracking-wider">Penawaran Terbatas</span>
                <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
                  Tingkatkan Potensi Profilmu ke Paket Premium
                </h2>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Dapatkan kontrol kustomisasi penuh tanpa batas, integrasi sistem pembayaran otomatis, verifikasi akun badge biru, serta akses data analitik berkala.
                </p>
                
                {/* Benefit Ringkas Checklist */}
                <div className="grid grid-cols-2 gap-2 text-white pt-2 text-xs text-left">
                  <div className="flex items-center gap-2">
                    <i className="bx bx-check-circle text-yellow-400 text-sm"></i> Custom Branding Domain
                  </div>
                  <div className="flex items-center gap-2">
                    <i className="bx bx-check-circle text-yellow-400 text-sm"></i> Integrasi Midtrans QRIS
                  </div>
                  <div className="flex items-center gap-2">
                    <i className="bx bx-check-circle text-yellow-400 text-sm"></i> Verified Badge Biru
                  </div>
                  <div className="flex items-center gap-2">
                    <i className="bx bx-check-circle text-yellow-400 text-sm"></i> Prioritas CS Support 24/7
                  </div>
                </div>
              </div>

              <div className="shrink-0 w-full md:w-auto relative z-10">
                <Link 
                  href="/pricing"
                  className="w-full md:w-auto inline-flex items-center justify-center gap-2 bg-yellow-500 text-slate-950 font-bold px-6 py-3.5 rounded-xl shadow-lg shadow-yellow-500/20 hover:bg-yellow-400 active:scale-95 transition-all text-sm tracking-wide text-center"
                >
                  <i className="bx bx-crown text-base"></i>
                  Lihat Paket & Benefit
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION FAQ ACCORDION */}
        <section className="w-full py-20 bg-slate-50/50 border-t border-slate-100">
          <div className="max-w-4xl lg:max-w-[60%] mx-auto px-6 flex flex-col md:flex-row gap-10 md:gap-16">
            
            <div className="w-full md:w-1/3 flex flex-col justify-start">
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight leading-tight">
                Pertanyaan yang Sering Diajukan
              </h2>
              <p className="text-xs text-slate-400 mt-3 leading-relaxed">
                Punya pertanyaan seputar layanan kami? Temukan jawaban instan di kolom bantuan sebelah kanan.
              </p>
            </div>

            <div className="w-full md:w-2/3 flex flex-col gap-3">
              {faqData.map((item, index) => (
                <details 
                  key={index} 
                  name="funikin-faq"
                  className="group bg-white border border-slate-100 rounded-xl shadow-xs overflow-hidden transition-all duration-300 [&_summary::-webkit-details-marker]:hidden"
                >
                  <summary className="flex items-center justify-between p-4 cursor-pointer select-none font-semibold text-sm text-slate-800 hover:bg-slate-50/50 list-none transition-colors">
                    <span>{item.q}</span>
                    <i className="bx bx-chevron-down text-xl text-slate-400 group-open:rotate-180 transition-transform duration-200"></i>
                  </summary>
                  
                  <div className="px-4 pb-4 pt-1 text-xs text-slate-500 leading-relaxed border-t border-slate-50 bg-slate-50/30">
                    {item.a}
                  </div>
                </details>
              ))}
            </div>

          </div>
        </section>

      </div>
    </div>
  );
}