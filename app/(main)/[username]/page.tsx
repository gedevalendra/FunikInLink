import { Metadata } from "next"; 
import ProfileSettings from "../../../components/ui/profileSettings";
import LinkListWrapper from "../../../components/ui/linkListWrapper";
import OnboardingModal from "../../../components/ui/onboardingModal"; 
import WelcomePopup from "../../../components/ui/welcomePopup"; 
import { connectDB } from "../../../lib/db";
import { SharedLink, User } from "../../../lib/models";

import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../lib/auth";

interface Props {
  params: Promise<{ username: string }> | { username: string };
}

// Data Dummy Preview saat tautan user masih kosong
const DUMMY_PREVIEW_LINKS = [
  { 
    _id: "dummy-github", 
    title: "GitHub Repository", 
    description: "Lihat koleksi kode proyek open-source saya di sini.", 
    icon: "bxl-github", 
    url: "https://github.com" 
  },
  { 
    _id: "dummy-linkedin", 
    title: "LinkedIn Professional", 
    description: "Mari terhubung secara profesional dan bicarakan karir.", 
    icon: "bxl-linkedin", 
    url: "https://linkedin.com" 
  },
  { 
    _id: "dummy-tiktok", 
    title: "TikTok Content", 
    description: "Kumpulan video dokumentasi daily life dan tips coding ringkas.", 
    icon: "bxl-tiktok", 
    url: "https://tiktok.com" 
  }
];

// ==========================================
// 1. FUNGSI SEO DINAMIS (generateMetadata)
// ==========================================
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  await connectDB();
  const resolvedParams = await params;
  const username = resolvedParams.username;

  const user = await User.findOne({ username: username }).lean();

  if (!user) {
    return {
      title: "Profil Tidak Ditemukan | FunikIn Link",
      description: "Halaman profil yang Anda cari tidak tersedia.",
    };
  }

  const pageTitle = `${user.name} (@${user.username}) | FunikIn Link`;
  const pageDescription = user.bio || `Lihat semua tautan, media sosial, dan portofolio milik ${user.name} di FunikIn Link.`;

  return {
    title: pageTitle,
    description: pageDescription,
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      type: "profile",
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description: pageDescription,
    }
  };
}

// ==========================================
// 2. KOMPONEN HALAMAN PROFIL (DynamicProfilePage)
// ==========================================
export default async function DynamicProfilePage({ params }: Props) {
  await connectDB();
  
  const resolvedParams = await params;
  const username = resolvedParams.username;

  // 1. Ambil data profil berdasarkan username
  const user = await User.findOne({ username: username }).lean() as any;

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 font-sans">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-extrabold text-gray-900">404</h1>
          <p className="text-gray-500">Profil @{username} tidak ditemukan.</p>
        </div>
      </div>
    );
  }

  // 2. Cek siapa yang sedang login saat ini via Google Auth
  const session = await getServerSession(authOptions);
  const isAdmin = session?.user?.email === user.email;

  // LOGIKA POP-UP ONBOARDING SETUP PROFILE
  const showOnboarding = isAdmin && (session?.user as any)?.isNewUser;

  // 3. Ambil data Link asli milik username ini dari database
  const sharedLinks = await SharedLink.find({ username: user.username }).lean();

  // 4. Fallback data kustomisasi jika belum dikonfigurasi di database
  const custom = user.customization || {
    background: "#ffffff",
    isBlur: false,
    rounded: "rounded-xl",
    profileBorder: "none",
    linkStyle: "solid",
    showPopup: false,
    popupMessage: ""
  };

  return (
    <div 
      className="flex flex-col min-h-screen font-sans transition-all duration-300"
      style={{ backgroundColor: custom.background }}
    >
      {/* Tambahkan kembali komponen Header & Footer jika memang diperlukan di halaman ini */}

      {/* Tampilkan Onboarding Modal jika User Baru */}
      {showOnboarding && <OnboardingModal user={user} />}

      {/* Tampilkan Pop-up Pesan Selamat Datang Kustom jika diaktifkan */}
      {custom.showPopup && custom.popupMessage && (
        <WelcomePopup message={custom.popupMessage} />
      )}

      {/* Konten Utama dengan Pembungkus Desain Dinamis */}
      <main className={`grow max-w-xl w-full mx-auto px-6 py-12 my-6 border transition-all duration-300
        ${custom.isBlur ? "bg-white/60 backdrop-blur-md border-white/40 shadow-xl" : "bg-white border-gray-100 shadow-sm"}
        ${custom.rounded}
      `}>
        
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4 min-w-0 flex-1">
            
            {/* Foto Profil / Avatar dengan variasi Ring Border dinamis */}
            <div className={`w-14 h-14 rounded-full bg-gray-900 text-white font-medium flex items-center justify-center text-lg shrink-0 uppercase transition-all
              ${custom.profileBorder !== 'none' ? `ring-2 ${custom.profileBorder}` : ""}
            `}>
              {String(user.name || "U").substring(0, 2)}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 w-full">
                <h2 className="text-lg font-bold tracking-tight flex items-center gap-1 w-full">
                  <span className="truncate">
                    {user.name}
                  </span>
                  {user.isVerified && (
                    <i className="bx bxs-badge-check text-blue-500 text-lg shrink-0" title="Verified Account"></i>
                  )}
                </h2>
              </div>
              <p className="text-xs text-gray-500 font-mono truncate">@{user.username}</p>
            </div>
          </div>
          
          <div className="shrink-0">
            <ProfileSettings user={user} isAdmin={isAdmin} />
          </div>
        </div>

        <div className="mt-4 space-y-3">
          <p className="text-sm text-gray-600 leading-relaxed max-w-md">
            {user.bio || "Belum ada bio."}
          </p>
          <div className="flex flex-wrap gap-2 text-xs font-mono text-blue-600">
            {user.hashtags?.map((tag: string, index: number) => (
              <span key={index}>{tag}</span>
            ))}
          </div>
        </div>

        <hr className="my-8 border-gray-100" />

        {/* Menggunakan LinkListWrapper sebagai penampung interaktif */}
        <LinkListWrapper 
          initialLinks={sharedLinks} 
          isAdmin={isAdmin} 
          dummyLinks={DUMMY_PREVIEW_LINKS} 
          customVariant={custom.linkStyle} // Dikirim ke komponen anak agar style tombol berubah dinamis
        />

      </main>

    </div>
  );
}