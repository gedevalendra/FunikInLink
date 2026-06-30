import Header from "../components/layout/header";
import Footer from "../components/layout/footer";
import { getServerSession } from "next-auth";
import { authOptions } from "../lib/auth";
import InteractiveHero from "../components/ui/interactiveHero";

export default async function LandingPage() {
  const session = await getServerSession(authOptions);
  
  // Ambil username dengan aman jika ada
  const userUsername = (session?.user as any)?.username || "";

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
    <div className="flex flex-col min-h-screen bg-white text-gray-900 font-sans relative overflow-x-hidden">
      <Header />
      
      {/* 1. SECTION HERO ANIMASI */}
      <InteractiveHero session={session} userUsername={userUsername} />
      
      {/* ==========================================
          2. SECTION MEDIA PARTNER (Simple & Lebar Terbatas)
          ========================================== */}
      <section className="w-full bg-slate-50 py-10 border-y border-slate-100 overflow-hidden flex flex-col items-center">
        <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-6 text-center">
          Our Main Partners
        </p>
        
        {/* Container Utama dengan Lebar Maksimal 30rem, ditengah */}
        <div className="w-full max-w-[30rem] px-4 overflow-hidden opacity-60 hover:opacity-100 transition-opacity duration-300">
          
          {/* Barisan Logo yang Bergerak Bolak-balik (Cuma 3 Elemen) */}
          <div className="animate-simple-marquee flex flex-row items-center justify-center gap-12 text-center">
            
            {/* Elemen 1 */}
            <div className="flex flex-col items-center gap-2 font-bold text-base text-slate-600 whitespace-nowrap">
              <i className="bx bx-globe text-3xl text-slate-400"></i>
              FunikIn Edu
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          3. SECTION STRUKTUR PROGRAM / FITUR UTAMA
          ========================================== */}
      <section className="w-full py-20 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
              Cara Kerja & Keunggulan Utama
            </h2>
            <p className="text-sm text-slate-500 mt-2">
              Didesain super ringkas agar profil sosial mediamu menghasilkan lebih banyak klik dan jualan.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-slate-50 border border-slate-100 rounded-md hover:shadow-sm transition-all duration-200">
              <div className="w-10 h-10 bg-yellow-500 text-white flex items-center justify-center rounded-md mb-4 shadow-sm">
                <i className="bx bx-slider-alt text-xl"></i>
              </div>
              <h3 className="font-bold text-base text-slate-800 mb-2">1. Hias Profil Instan</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Kamu bisa ganti warna, pasang foto terbaik, susun link sesukamu, dan langsung pakai animasi tombol keren agar pengunjung betah berlama-lama.
              </p>
            </div>

            <div className="p-6 bg-slate-50 border border-slate-100 rounded-md hover:shadow-sm transition-all duration-200">
              <div className="w-10 h-10 bg-red-500 text-white flex items-center justify-center rounded-md mb-4 shadow-sm">
                <i className="bx bx-wallet text-xl"></i>
              </div>
              <h3 className="font-bold text-base text-slate-800 mb-2">2. Terima Uang & Donasi</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Pengunjung bisa langsung bayar produk digitalmu atau kirim donasi dukungan lewat QRIS, transfer bank, dan e-wallet secara aman dari profilmu.
              </p>
            </div>

            <div className="p-6 bg-slate-50 border border-slate-100 rounded-md hover:shadow-sm transition-all duration-200">
              <div className="w-10 h-10 bg-slate-900 text-white flex items-center justify-center rounded-md mb-4 shadow-sm">
                <i className="bx bx-line-chart text-xl"></i>
              </div>
              <h3 className="font-bold text-base text-slate-800 mb-2">3. Laporan Pengunjung</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Lihat dengan mudah berapa orang yang mengintip profilmu hari ini, link mana yang paling sering diklik, tanpa perlu pusing membaca grafik rumit.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          4. SECTION FAQ ACCORDION (Max Width 60% Desktop & Auto-Close)
          ========================================== */}
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
                name="funikin-faq" // Trik Browser: name sama membuat faq lain otomatis menutup
                className="group bg-white border border-slate-100 rounded-md shadow-xs overflow-hidden transition-all duration-300 [&_summary::-webkit-details-marker]:hidden"
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

      <Footer />
    </div>
  );
}