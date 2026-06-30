import Header from "../../components/layout/header"; 
import Footer from "../../components/layout/footer"; 
import ProfileSettings from "../../components/ui/profileSettings";
import AddLinkModal from "../../components/ui/addLinkModal";
import LinkCard from "../../components/ui/linkCard";
import OnboardingModal from "../../components/ui/onboardingModal"; // <-- IMPORT MODAL BARU
import { connectDB } from "../../lib/db";
import { SharedLink, Admin } from "../../lib/models"; 

import { getServerSession } from "next-auth/next";
import { authOptions } from "../../lib/auth";

interface Props {
  params: Promise<{ username: string }> | { username: string };
}

export default async function DynamicProfilePage({ params }: Props) {
  await connectDB();
  
  // Resolving params untuk mendukung Next.js versi terbaru (14/15)
  const resolvedParams = await params;
  const username = resolvedParams.username;

  // 1. Ambil data profil berdasarkan username yang ada di URL direktori
  const user = await Admin.findOne({ username: username }).lean();

  // Jika username tidak ada di database, tampilkan pesan error 404
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

  // 2. Cek siapa yang sedang login saat ini via Google
  const session = await getServerSession(authOptions);
  
  // Logika Utama: Pengunjung dianggap ADMIN jika email yang login COCOK dengan email pemilik profil ini
  const isAdmin = session?.user?.email === user.email;

  // LOGIKA POP-UP ONBOARDING SETUP PROFILE
  // Muncul hanya jika dia pemilik halaman profil ini dan status session-nya masih merupakan user baru (isNewUser)
  const showOnboarding = isAdmin && (session?.user as any)?.isNewUser;

  // 3. Ambil data Link yang HANYA dimiliki oleh username ini saja
  const sharedLinks = await SharedLink.find({ username: user.username }).sort({ _id: -1 }).lean();

  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-900 font-sans">
      {/* JIKA MEMENUHI SYARAT ONBOARDING, TAMPILKAN POP-UP SECARA OTOMATIS */}
      {showOnboarding && <OnboardingModal user={user} />}

      <Header />
      
      <main className="flex-grow max-w-xl w-full mx-auto px-6 py-12">
        
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-gray-900 text-white font-medium flex items-center justify-center text-lg flex-shrink-0 uppercase">
              {user.name.substring(0, 2)}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="text-lg font-bold tracking-tight">{user.name}</h2>
                <i className="bx bxs-badge-check text-blue-500 text-lg"></i>
              </div>
              <p className="text-xs text-gray-500 font-mono">@{user.username}</p>
            </div>
          </div>
          
          {/* Tombol setting gear hanya akan muncul jika isAdmin bernilai TRUE */}
          <ProfileSettings user={user} isAdmin={isAdmin} />
        </div>

        <div className="mt-4 space-y-3">
          <p className="text-sm text-gray-600 leading-relaxed max-w-md">
            {user.bio}
          </p>
          <div className="flex gap-2 text-xs font-mono text-gray-400">
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
            <p className="text-xs text-gray-400 font-mono italic">Belum ada tautan di profil ini...</p>
          ) : (
            sharedLinks.map((link: any) => (
              <LinkCard key={link._id.toString()} link={link} isAdmin={isAdmin} />
            ))
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}