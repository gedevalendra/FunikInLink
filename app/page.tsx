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

  // 1. Ambil data session user yang login
  if (session?.user?.email) {
    await connectDB();
    const dbUser = await User.findOne({ email: session.user.email }).lean();
    
    if (dbUser) {
      userUsername = dbUser.username || "";
      Name = dbUser.name || "";
    }
  }

  // 2. Ambil data user dari database untuk komponen Live Preview Showcase (Maksimal 6 user)
  await connectDB();
  const rawDbUsers = await User.find({ username: { $ne: userUsername } }).limit(6).lean();
  
  // Mapping data agar aman digunakan pada rendering komponen
  const showcaseUsers = rawDbUsers.map((u: any) => ({
    name: u.name || "User FunikIn",
    username: u.username || "user",
    bio: u.bio || "Belum ada bio resmi.",
    isVerified: !!u.isVerified,
    initial: String(u.name || "U").substring(0, 2).toUpperCase()
  }));

  // Fallback data dummy jika database kamu masih kosong / baru agar tidak kosong saat awal dideploy
  const fallbackUsers = [
    { name: "Gede Valendra", username: "gedevalendra", bio: "Full-Stack Developer | Practical solutions.", isVerified: true, initial: "GV" },
    { name: "Riska Amanda", username: "riska_am", bio: "Content Creator & Digital Marketer", isVerified: true, initial: "RA" },
    { name: "Budi Santoso", username: "budistore", bio: "E-Commerce Owner | Gadget Specialist", isVerified: false, initial: "BS" },
  ];

  const displayUsers = showcaseUsers.length > 0 ? showcaseUsers : fallbackUsers;

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
      
      {/* Struktur Animasi Marquee via CSS Global */}


      {/* ==========================================
          1. SECTION HERO ANIMASI (TRUE PARALLAX)
          ========================================== */}
      <ParallaxWrapper>
        <InteractiveHero session={session} userUsername={userUsername} Name={Name} />
      </ParallaxWrapper>

      {/* ==========================================
          2. SECOND PARALLAX: OUR PARTNER SECTION
          Mengunci di posisi atas setelah Hero selesai di-scroll
          ========================================== */}
      <div className="sticky top-20 z-0 h-[120px] bg-slate-900 flex items-center justify-center w-full overflow-hidden border-b border-slate-800">
        <div className="text-center">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 mb-2">
            Our Main Partners
          </p>
          <div className="flex items-center justify-center gap-2 font-semibold text-lg text-white">
            <i className="bx bx-globe text-xl text-yellow-500 animate-spin" style={{ animationDuration: '10s' }}></i>
            <span className="tracking-wide">FunikIn Edu Platform</span>
          </div>
        </div>
      </div>

      {/* ==========================================
          3. WRAPPER KONTEN UTAMA BAWAH
          ========================================== */}
      <div className="relative z-10 bg-white shadow-[0_-20px_50px_rgba(0,0,0,0.05)] rounded-t-[2.5rem]">
        
        {/* SECTION STRUKTUR PROGRAM / FITUR UTAMA */}
        <section className="w-full py-24 bg-white rounded-t-[2.5rem]">
          <div className="max-w-5xl mx-auto px-6">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest border border-slate-200 px-3 py-1 rounded-full bg-slate-50">Fitur Unggulan</span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mt-4">
                Cara Kerja & Keunggulan Utama
              </h2>
              <p className="text-sm md:text-base text-slate-500 mt-3 leading-relaxed">
                Didesain super ringkas agar profil sosial mediamu menghasilkan lebih banyak klik, konversi, dan interaksi.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-8 bg-slate-50/50 border border-slate-100 rounded-2xl hover:bg-white hover:shadow-xl hover:border-transparent transition-all duration-300 group">
                <div className="w-12 h-12 bg-slate-900 text-white flex items-center justify-center rounded-xl mb-6 shadow-sm group-hover:bg-yellow-500 transition-colors">
                  <i className="bx bx-slider-alt text-2xl"></i>
                </div>
                <h3 className="font-bold text-lg text-slate-800 mb-3">1. Hias Profil Instan</h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Kamu bisa ganti warna, pasang foto terbaik, susun link sesukamu, dan langsung pakai animasi tombol keren agar pengunjung betah berlama-lama.
                </p>
              </div>

              <div className="p-8 bg-slate-50/50 border border-slate-100 rounded-2xl hover:bg-white hover:shadow-xl hover:border-transparent transition-all duration-300 group">
                <div className="w-12 h-12 bg-slate-900 text-white flex items-center justify-center rounded-xl mb-6 shadow-sm group-hover:bg-yellow-500 transition-colors">
                  <i className="bx bx-wallet text-2xl"></i>
                </div>
                <h3 className="font-bold text-lg text-slate-800 mb-3">2. Terima Uang & Donasi</h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Pengunjung bisa langsung bayar produk digitalmu atau kirim donasi dukungan lewat QRIS, transfer bank, dan e-wallet secara aman dari profilmu.
                </p>
              </div>

              <div className="p-8 bg-slate-50/50 border border-slate-100 rounded-2xl hover:bg-white hover:shadow-xl hover:border-transparent transition-all duration-300 group">
                <div className="w-12 h-12 bg-slate-900 text-white flex items-center justify-center rounded-xl mb-6 shadow-sm group-hover:bg-yellow-500 transition-colors">
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

        {/* SECTION LIVE PREVIEW SHOWCASE 
            Mengambil data koleksi database User asli & bergulir kiri-kanan secara horizontal */}
        <section className="w-full py-20 bg-slate-50 border-y border-slate-100 overflow-hidden">
          <div className="max-w-5xl mx-auto px-6 mb-12 text-center">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest border border-slate-200 px-3 py-1 rounded-full bg-white">Live User Preview</span>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-4">
              Halaman Kreator yang Telah Bergabung
            </h2>
            <p className="text-sm text-slate-500 mt-2 max-w-xl mx-auto">
              Pratinjau tampilan nyata halaman profil milik pengguna kami. Didesain bersih, minimalis, responsif, dan terstruktur sempurna.
            </p>
          </div>

          {/* Kontainer Marquee Horizontal Gunting Kiri-Kanan Tunggal */}
          <div className="w-full overflow-hidden flex whitespace-nowrap">
            <div className="animate-preview-marquee gap-6 px-4">
              {/* Me-render data display users sebanyak dua kali agar loop animasi marquee tidak patah */}
              {[...displayUsers, ...displayUsers].map((user, idx) => (
                <div 
                  key={idx} 
                  className="w-[320px] bg-white rounded-2xl p-6 shadow-md border border-slate-100/80 flex flex-col shrink-0 text-left select-none transition-transform duration-200 hover:scale-[1.01]"
                >
                  {/* Header Profil (Disamakan strukturnya dengan layout asli page.tsx) */}
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-12 h-12 rounded-full bg-gray-900 text-white font-medium flex items-center justify-center text-sm flex-shrink-0 uppercase">
                      {user.initial}
                    </div>
                    <div className="min-w-0 flex-1 whitespace-normal">
                      <h2 className="text-sm font-bold tracking-tight flex items-center gap-1 text-gray-900">
                        <span className="truncate">{user.name}</span>
                        {user.isVerified && (
                          <i className="bx bxs-badge-check text-blue-500 text-base flex-shrink-0"></i>
                        )}
                      </h2>
                      <p className="text-[11px] text-gray-400 font-mono truncate">@{user.username}</p>
                    </div>
                  </div>

                  {/* Deskripsi Bio */}
                  <div className="mt-4 whitespace-normal">
                    <p className="text-xs text-gray-600 leading-relaxed line-clamp-2 h-9">
                      {user.bio}
                    </p>
                  </div>

                  <hr className="my-4 border-gray-100" />

                  {/* Pratinjau Tautan Resmi Dummy sesuai bawaan system link */}
                  <div className="space-y-2 flex-grow flex flex-col justify-start">
                    <div className="w-full p-2.5 bg-gray-50 rounded-xl border border-gray-100 flex items-center gap-2 text-xs font-semibold text-gray-700 truncate">
                      <i className="bx bx-link text-sm text-gray-400"></i> GitHub Repository
                    </div>
                    <div className="w-full p-2.5 bg-gray-50 rounded-xl border border-gray-100 flex items-center gap-2 text-xs font-semibold text-gray-700 truncate">
                      <i className="bx bx-link text-sm text-gray-400"></i> LinkedIn Professional
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION PREMIUM BANNER / CALL TO ACTION PROMO 
            Desain Profesional Nordic Style, Bersih, Serius, Elegan & Tidak Alay */}
        <section className="w-full py-24 bg-white">
          <div className="max-w-4xl mx-auto px-6">
            <div className="bg-slate-900 rounded-[2.5rem] p-8 md:p-14 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-10 relative overflow-hidden shadow-lg shadow-slate-900/5">
              
              <div className="space-y-4 max-w-xl text-left">
                <div className="inline-flex items-center gap-1.5 bg-white/10 text-yellow-400 text-[10px] font-bold px-3 py-1 rounded-md tracking-wider uppercase border border-white/5">
                  <i className="bx bx-crown"></i> Funikin Premium Account
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight leading-tight">
                  Kembangkan Akses Kontrol Bisnis dan Personal Branding Anda
                </h2>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Tingkatkan profil Anda melewati batas tautan standar. Dapatkan ekosistem kustomisasi desain tingkat lanjut untuk menciptakan halaman bio yang kredibel dan eksklusif.
                </p>
                
                {/* Komponen Benefit Grid List Checklist */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-4 text-slate-300 text-xs">
                  <div className="flex items-center gap-2.5">
                    <i className="bx bx-check text-slate-900 text-xs bg-slate-100 rounded-full p-0.5 shrink-0"></i> 
                    <span>Custom Branding & Domain Pribadi</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <i className="bx bx-check text-slate-900 text-xs bg-slate-100 rounded-full p-0.5 shrink-0"></i> 
                    <span>Integrasi Gerbang Pembayaran Midtrans</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <i className="bx bx-check text-slate-900 text-xs bg-slate-100 rounded-full p-0.5 shrink-0"></i> 
                    <span>Lencana Verifikasi Akun Resmi</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <i className="bx bx-check text-slate-900 text-xs bg-slate-100 rounded-full p-0.5 shrink-0"></i> 
                    <span>Akses Data Analitik Pengunjung Realtime</span>
                  </div>
                </div>
              </div>

              {/* Tombol Arah ke Halaman /pricing */}
              <div className="shrink-0 w-full lg:w-auto pt-4 lg:pt-0">
                <Link 
                  href="/pricing"
                  className="w-full lg:w-auto inline-flex items-center justify-center gap-2 bg-white text-slate-900 font-semibold px-7 py-4 rounded-xl hover:bg-slate-100 active:scale-95 transition-all text-sm tracking-wide text-center font-medium shadow-sm"
                >
                  Pelajari Paket & Benefit
                  <i className="bx bx-right-arrow-alt text-base"></i>
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