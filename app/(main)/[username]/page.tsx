import { Metadata } from "next"; 
import Header from "../../../components/layout/header"; 
import Footer from "../../../components/layout/footer"; 
import ProfileSettings from "../../../components/ui/profileSettings";
import AddLinkModal from "../../../components/ui/addLinkModal";
import LinkCard from "../../../components/ui/linkCard";
import OnboardingModal from "../../../components/ui/onboardingModal"; 
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
  const user = await User.findOne({ username: username }).lean();

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

  // 3. Ambil data Link asli milik username ini
  const sharedLinks = await SharedLink.find({ username: user.username }).sort({ _id: -1 }).lean();

  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-900 font-sans">
      {showOnboarding && <OnboardingModal user={user} />}

      <main className="flex-grow max-w-xl w-full mx-auto px-6 py-12">
        
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-gray-900 text-white font-medium flex items-center justify-center text-lg flex-shrink-0 uppercase">
              {String(user.name || "U").substring(0, 2)}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="text-lg font-bold tracking-tight">{user.name}</h2>
                {user.isVerified && (
                  <i className="bx bxs-badge-check text-blue-500 text-lg" title="Verified Account"></i>
                )}
              </div>
              <p className="text-xs text-gray-500 font-mono">@{user.username}</p>
            </div>
          </div>
          
          <ProfileSettings user={user} isAdmin={isAdmin} />
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

        <div className="space-y-2">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Tautan Resmi</h3>
          </div>

          {/* Tombol tambah link hanya muncul jika kamu adalah pemilik profil tersebut */}
          {isAdmin && <AddLinkModal />}
          
          {sharedLinks.length === 0 ? (
            <div className="flex flex-col gap-3 pt-2">
              {/* Notifikasi khusus pemilik/admin agar tidak bingung */}
              {isAdmin && (
                <div className="p-3 bg-amber-50 border border-amber-100 rounded-xl text-xs text-amber-700 leading-relaxed font-medium">
                  <i className="bx bx-info-circle mr-1 text-sm align-middle"></i>
                  Kamu belum menambahkan tautan apa pun. Di bawah ini adalah pratinjau tampilan profilmu jika nanti sudah diisi:
                </div>
              )}
              
              {/* Me-render 3 dummy preview link (GitHub, LinkedIn, TikTok) */}
              {DUMMY_PREVIEW_LINKS.map((dummy) => (
                <LinkCard 
                  key={dummy._id} 
                  link={dummy} 
                  isAdmin={isAdmin} 
                  isDummy={true} 
                />
              ))}
            </div>
          ) : (
            // Jika ada tautan asli dari database, tampilkan data aslinya
            sharedLinks.map((link: any) => (
              <LinkCard 
                key={link._id.toString()} 
                link={link} 
                isAdmin={isAdmin} 
                isDummy={false} 
              />
            ))
          )}
        </div>
      </main>
    </div>
  );
}