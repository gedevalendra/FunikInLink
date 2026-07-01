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
    const dbUser = await User.findOne({ email: session.user.email }).lean() as any;
    
    if (dbUser) {
      userUsername = dbUser.username || "";
      Name = dbUser.name || "";
    }
  }

  // Mengambil data user terdaftar langsung dari database
  await connectDB();
  const rawDbUsers = await User.find({ username: { $ne: userUsername } }).limit(10).lean() as any[];

  // Pemetaan objek data user agar aman & terstruktur
  const registeredUsers = rawDbUsers.map((u: any) => ({
    name: u.name || "Kreator FunikIn",
    username: u.username || "user",
    initial: String(u.name || "U").substring(0, 2).toUpperCase(),
    isVerified: !!u.isVerified
  }));

  // Fallback cadangan otomatis jika database kamu masih kosong saat development
  const fallbackUsers = [
    { name: "Gede Valendra", username: "gedevalendra", initial: "GV", isVerified: true },
    { name: "Riska Amanda", username: "riska_am", initial: "RA", isVerified: true },
    { name: "Budi Santoso", username: "budistore", initial: "BS", isVerified: false },
    { name: "Siti Rahma", username: "siti_creative", initial: "SR", isVerified: true },
  ];

  const displayUsers = registeredUsers.length > 0 ? registeredUsers : fallbackUsers;

  // Duplikasi array agar loop animasi horizontal marquee tidak terputus di layar lebar
  const marqueeUsers = [...displayUsers, ...displayUsers, ...displayUsers];

  // Variasi ikon Boxicons pengganti emoji untuk efek semburan animasi
  const burstIcons = [
    "bx-star text-yellow-400",
    "bx-rocket text-indigo-500",
    "bx-like text-blue-500",
    "bx-heart text-red-500",
    "bx-crown text-amber-500",
    "bx-bolt text-orange-400",
    "bx-diamond text-cyan-400"
  ];

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

        {/* SECTION LIVE PREVIEW: USER DATABASE (MELAYANG & BOXICONS BURST EFFECTS) */}
        <section className="w-full py-20 bg-slate-50 border-y border-slate-100 overflow-hidden">
          <div className="max-w-5xl mx-auto px-6 mb-14 text-center">
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest bg-indigo-50 px-3 py-1 rounded-full">Komunitas Kreator</span>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-3">
              Kreator yang Telah Bergabung Bersama Kami
            </h2>
            <p className="text-sm text-slate-500 mt-2 max-w-xl mx-auto">
              Daftar pengguna terdaftar yang aktif membangun personal branding mereka di ekosistem platform kami.
            </p>
          </div>

          {/* Container Jalur Marquee Gulir Kiri-Kanan Otomatis */}
          <div className="w-full flex overflow-hidden relative py-6 select-none">
            <div className="animate-marquee-container gap-6 px-4">
              {marqueeUsers.map((user, idx) => {
                // Kalkulasi jeda waktu & posisi acak untuk animasi semburan ikon Boxicons
                const iconDelay1 = `${(idx % 4) * 0.6}s`;
                const iconDelay2 = `${((idx % 4) * 0.6) + 1.2}s`;
                const leftPos1 = `${25 + (idx % 3) * 15}%`;
                const leftPos2 = `${50 + (idx % 3) * 12}%`;

                // Kalkulasi jeda animasi melayang agar gerakan kartu bervariasi alami
                const floatDelay = `${(idx % 3) * -1.3}s`;

                return (
                  <div 
                    key={idx} 
                    className="floating-user-card w-[260px] bg-white rounded-2xl p-5 shadow-sm hover:shadow-xl border border-slate-100/80 flex items-center gap-3.5 shrink-0 text-left relative overflow-hidden transition-all duration-300"
                    style={{ animationDelay: floatDelay }}
                  >
                    {/* Elemen Semburan Boxicons Meluncur ke Atas */}
                    <i 
                      className={`bx ${burstIcons[idx % burstIcons.length]} boxicon-burst text-sm`}
                      style={{ animationDelay: iconDelay1, left: leftPos1 }}
                    ></i>
                    <i 
                      className={`bx ${burstIcons[(idx + 2) % burstIcons.length]} boxicon-burst text-xs`}
                      style={{ animationDelay: iconDelay2, left: leftPos2 }}
                    ></i>

                    {/* Avatar Inisial User */}
                    <div className="w-11 h-11 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center text-xs flex-shrink-0 uppercase tracking-wider">
                      {user.initial}
                    </div>

                    {/* Informasi Akun */}
                    <div className="min-w-0 flex-1 relative z-10">
                      <h3 className="text-xs font-bold tracking-tight text-slate-900 flex items-center gap-1">
                        <span className="truncate">{user.name}</span>
                        {user.isVerified && (
                          <i className="bx bxs-badge-check text-blue-500 text-sm flex-shrink-0"></i>
                        )}
                      </h3>
                      <p className="text-[10px] text-slate-400 font-mono truncate mt-0.5">@{user.username}</p>
                    </div>

                    {/* Panah Indikator Aksi Tautan */}
                    <div className="text-slate-300 group-hover:text-slate-500 transition-colors">
                      <i className="bx bx-chevron-right text-lg"></i>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* SECTION PREMIUM BANNER / CALL TO ACTION PROMO 
            Desain Baru: Terang, Latar Belakang Putih Minimalis, Elegan & Sangat User-Friendly */}
        <section className="w-full py-24 bg-white">
          <div className="max-w-4xl mx-auto px-6">
            <div className="bg-gradient-to-tr from-slate-50 via-white to-indigo-50/30 rounded-[2.5rem] p-8 md:p-14 flex flex-col lg:flex-row items-center justify-between gap-10 border border-slate-200/60 shadow-md shadow-slate-100/50 relative overflow-hidden">
              
              {/* Ornamen Akses Bantuan Halus */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-yellow-400/10 rounded-full blur-3xl pointer-events-none"></div>
              
              <div className="space-y-4 max-w-xl text-center lg:text-left">
                <div className="inline-flex items-center gap-1.5 bg-yellow-500/10 text-yellow-700 text-[10px] font-bold px-3 py-1 rounded-md tracking-wider uppercase border border-yellow-500/10 mx-auto lg:mx-0">
                  <i className="bx bx-crown"></i> Funikin Premium Account
                </div>
                <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
                  Kembangkan Akses Kontrol Bisnis dan Personal Branding Anda
                </h2>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Tingkatkan halaman profil Anda melewati batas tautan standar. Dapatkan ekosistem kustomisasi desain tingkat lanjut untuk menciptakan portofolio yang kredibel dan eksklusif.
                </p>
                
                {/* Benefit List Checklist Terang */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-4 text-slate-600 text-xs text-left">
                  <div className="flex items-center gap-2.5">
                    <i className="bx bx-check text-emerald-600 font-bold text-xs bg-emerald-50 rounded-full p-1 shrink-0"></i> 
                    <span>Custom Branding & Domain Pribadi</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <i className="bx bx-check text-emerald-600 font-bold text-xs bg-emerald-50 rounded-full p-1 shrink-0"></i> 
                    <span>Integrasi Gerbang Pembayaran Midtrans</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <i className="bx bx-check text-emerald-600 font-bold text-xs bg-emerald-50 rounded-full p-1 shrink-0"></i> 
                    <span>Lencana Verifikasi Akun Resmi (Blue Badge)</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <i className="bx bx-check text-emerald-600 font-bold text-xs bg-emerald-50 rounded-full p-1 shrink-0"></i> 
                    <span>Akses Data Analitik Pengunjung Realtime</span>
                  </div>
                </div>
              </div>

              {/* Tombol Menuju Halaman Pricing */}
              <div className="shrink-0 w-full lg:w-auto pt-2 lg:pt-0">
                <Link 
                  href="/pricing"
                  className="w-full lg:w-auto inline-flex items-center justify-center gap-2 bg-slate-950 text-white font-bold px-7 py-4 rounded-xl hover:bg-slate-800 active:scale-95 transition-all text-sm tracking-wide shadow-lg shadow-slate-900/10 text-center"
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