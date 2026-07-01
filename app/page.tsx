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
          2. WRAPPER KONTEN BAWAH (Max Rounded: md)
          ========================================== */}
      <div className="relative z-10 bg-white mt-[100vh] shadow-[0_-20px_50px_rgba(0,0,0,0.05)] rounded-t-md">
        
        {/* SECTION MEDIA PARTNER */}
        <section className="w-full bg-slate-50/60 py-10 border-b border-slate-100 overflow-hidden flex flex-col items-center rounded-t-md">
          <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-4 text-center">
            Our Main Partners
          </p>
          <div className="w-full max-w-[30rem] px-4 opacity-60 hover:opacity-100 transition-opacity duration-300">
            <div className="flex flex-row items-center justify-center gap-12 text-center">
              <div className="flex items-center gap-2 font-bold text-sm text-slate-600 whitespace-nowrap">
                <i className="bx bx-globe text-xl text-yellow-500"></i>
                FunikIn Edu
              </div>
            </div>
          </div>
        </section>

        {/* SECTION CARA KERJA & KEUNGGULAN UTAMA (Minimalis, Padat, Mobile Grid Max 2) */}
        <section className="w-full py-16 bg-white border-b border-slate-100">
          <div className="max-w-5xl mx-auto px-4">
            <div className="text-center max-w-xl mx-auto mb-10">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider bg-slate-100 px-2.5 py-1 rounded-md">
                Kenapa harus Funik<span className="text-yellow-500">In</span> ?
              </span>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight mt-2.5">
                Fitur Unggulan
              </h2>
            </div>

            {/* Grid 2 Kolom di Mobile, 4 Kolom di Desktop - Desain Ultra Minimalis & Pendek */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              
              {/* Poin 1 */}
              <div className="p-4 bg-slate-50/70 border border-slate-100 rounded-md hover:bg-white hover:shadow-md hover:border-slate-200 transition-all duration-200 group">
                <h3 className="font-bold text-sm text-slate-800 mb-1">1. Profile Instan</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Ganti warna, foto, susun link sesukamu dan animasi keren.
                </p>
              </div>

              {/* Poin 2 */}
              <div className="p-4 bg-slate-50/70 border border-slate-100 rounded-md hover:bg-white hover:shadow-md hover:border-slate-200 transition-all duration-200 group">
                <h3 className="font-bold text-sm text-slate-800 mb-1">2. Template atau Custom</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Gunakan desain template instan atau buat kustomisasi penuh.
                </p>
              </div>

              {/* Poin 3 */}
              <div className="p-4 bg-slate-50/70 border border-slate-100 rounded-md hover:bg-white hover:shadow-md hover:border-slate-200 transition-all duration-200 group">
                <h3 className="font-bold text-sm text-slate-800 mb-1">3. Jual atau beli produk</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Jual produk digital atau terima donasi lewat QRIS & e-wallet.
                </p>
              </div>

              {/* Poin 4 */}
              <div className="p-4 bg-slate-50/70 border border-slate-100 rounded-md hover:bg-white hover:shadow-md hover:border-slate-200 transition-all duration-200 group">
                <h3 className="font-bold text-sm text-slate-800 mb-1">4. Laporan analitik</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Pantau pengunjung dan klik link, laporan sederhana & akurat.
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* SECTION LIVE PREVIEW: USER DATABASE (Max Rounded: md) */}
        <section className="w-full py-16 bg-slate-50 border-b border-slate-100 overflow-hidden">
          <div className="max-w-5xl mx-auto px-4 mb-10 text-center">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider bg-slate-200/60 px-2.5 py-1 rounded-md">
              Komunitas Kreator
            </span>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight mt-2.5">
              Kreator yang Telah Bergabung
            </h2>
          </div>

          {/* Container Jalur Marquee Gulir Kiri-Kanan Otomatis */}
          <div className="w-full flex overflow-hidden relative py-2 select-none">
            <div className="animate-marquee-container gap-4 px-4">
              {marqueeUsers.map((user, idx) => {
                const iconDelay1 = `${(idx % 4) * 0.6}s`;
                const iconDelay2 = `${((idx % 4) * 0.6) + 1.2}s`;
                const leftPos1 = `${25 + (idx % 3) * 15}%`;
                const leftPos2 = `${50 + (idx % 3) * 12}%`;
                const floatDelay = `${(idx % 3) * -1.3}s`;

                return (
                  <div 
                    key={idx} 
                    className="floating-user-card w-[240px] bg-white rounded-md p-4 shadow-xs hover:shadow-md border border-slate-200/60 flex items-center gap-3 shrink-0 text-left relative overflow-hidden transition-all duration-200"
                    style={{ animationDelay: floatDelay }}
                  >
                    {/* Elemen Semburan Boxicons Meluncur ke Atas */}
                    <i 
                      className={`bx ${burstIcons[idx % burstIcons.length]} boxicon-burst text-xs`}
                      style={{ animationDelay: iconDelay1, left: leftPos1 }}
                    ></i>
                    <i 
                      className={`bx ${burstIcons[(idx + 2) % burstIcons.length]} boxicon-burst text-[10px]`}
                      style={{ animationDelay: iconDelay2, left: leftPos2 }}
                    ></i>

                    {/* Avatar Inisial User */}
                    <div className="w-9 h-9 rounded-md bg-slate-900 text-white font-bold flex items-center justify-center text-xs flex-shrink-0 uppercase tracking-wider">
                      {user.initial}
                    </div>

                    {/* Informasi Akun */}
                    <div className="min-w-0 flex-1 relative z-10">
                      <h3 className="text-xs font-bold tracking-tight text-slate-900 flex items-center gap-1">
                        <span className="truncate">{user.name}</span>
                        {user.isVerified && (
                          <i className="bx bxs-badge-check text-blue-500 text-xs flex-shrink-0"></i>
                        )}
                      </h3>
                      <p className="text-[10px] text-slate-400 font-mono truncate">@{user.username}</p>
                    </div>

                    {/* Panah Indikator Aksi Tautan */}
                    <div className="text-slate-300">
                      <i className="bx bx-chevron-right text-base"></i>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* SECTION PREMIUM BANNER / CALL TO ACTION PROMO (Max Rounded: md) */}
        <section className="w-full py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4">
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 md:p-10 flex flex-col lg:flex-row items-center justify-between gap-8 shadow-xs relative overflow-hidden">
              
              <div className="space-y-3 max-w-xl text-center lg:text-left">
                <div className="inline-flex items-center gap-1 bg-slate-900 text-white text-[9px] font-bold px-2 py-0.5 rounded-md tracking-wider uppercase mx-auto lg:mx-0">
                  <i className="bx bx-crown"></i> Funikin Premium
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight leading-tight">
                  Tingkatkan Potensi Profilmu ke Paket Premium
                </h2>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Dapatkan ekosistem kustomisasi desain tingkat lanjut untuk menciptakan portofolio yang kredibel, eksklusif, dan profesional.
                </p>
                
                {/* Benefit List Checklist */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 text-slate-600 text-xs text-left">
                  <div className="flex items-center gap-2">
                    <i className="bx bx-check text-slate-900 font-bold text-xs bg-white border border-slate-200 rounded-md p-0.5 shrink-0"></i> 
                    <span>Integrasi Midtrans</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <i className="bx bx-check text-slate-900 font-bold text-xs bg-white border border-slate-200 rounded-md p-0.5 shrink-0"></i> 
                    <span>Binc Badge Resmi</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <i className="bx bx-check text-slate-900 font-bold text-xs bg-white border border-slate-200 rounded-md p-0.5 shrink-0"></i> 
                    <span>Analitik Pengunjung Realtime</span>
                  </div>
                </div>
              </div>

              {/* Tombol Akses */}
              <div className="shrink-0 w-full lg:w-auto">
                <Link 
                  href="/pricing"
                  className="w-full lg:w-auto inline-flex items-center justify-center gap-1.5 bg-slate-950 text-white font-bold px-5 py-3 rounded-md hover:bg-slate-800 active:scale-95 transition-all text-xs tracking-wide text-center"
                >
                  Pelajari Paket
                  <i className="bx bx-right-arrow-alt text-sm"></i>
                </Link>
              </div>

            </div>
          </div>
        </section>

        {/* SECTION FAQ ACCORDION (Max Rounded: md) */}
        <section className="w-full py-16 bg-slate-50/50 border-t border-slate-100">
          <div className="max-w-4xl lg:max-w-[65%] mx-auto px-4 flex flex-col md:flex-row gap-8 md:gap-12">
            
            <div className="w-full md:w-1/3 flex flex-col justify-start">
              <h2 className="text-xl font-bold text-slate-900 tracking-tight leading-tight">
                FAQ Accordion
              </h2>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Punya pertanyaan seputar layanan kami? Temukan jawaban instan di kolom bantuan berikut.
              </p>
            </div>

            <div className="w-full md:w-2/3 flex flex-col gap-2.5">
              {faqData.map((item, index) => (
                <details 
                  key={index} 
                  name="funikin-faq"
                  className="group bg-white border border-slate-200 rounded-md shadow-2xs overflow-hidden transition-all duration-200 [&_summary::-webkit-details-marker]:hidden"
                >
                  <summary className="flex items-center justify-between p-3.5 cursor-pointer select-none font-semibold text-xs text-slate-800 hover:bg-slate-50/50 list-none transition-colors">
                    <span>{item.q}</span>
                    <i className="bx bx-chevron-down text-base text-slate-400 group-open:rotate-180 transition-transform duration-200"></i>
                  </summary>
                  
                  <div className="px-3.5 pb-3.5 pt-0.5 text-xs text-slate-500 leading-relaxed border-t border-slate-100 bg-slate-50/30">
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