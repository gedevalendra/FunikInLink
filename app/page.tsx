import Header from "../components/layout/header"; 
import Footer from "../components/layout/footer"; 
import ProfileSettings from "../components/ui/profileSettings";
import AddLinkModal from "../components/ui/addLinkModal";
import LinkCard from "../components/ui/linkCard";
import { connectDB } from "../lib/db";
import { SharedLink, Admin } from "../lib/models"; 

// Import NextAuth
import { getServerSession } from "next-auth/next";
import { authOptions } from "../lib/auth";

export default async function Home() {
  await connectDB();
  
  // 1. Cek sesi login
  const session = await getServerSession(authOptions);

  // =========================================================
  // GANTI INI DENGAN EMAIL GOOGLE-MU (sebagai pemilik web)
  // =========================================================
  const ADMIN_EMAIL = "emailkamu@gmail.com"; 

  // Jika email yang login sama dengan email admin, maka dia punya akses penuh
  const isAdmin = session?.user?.email === ADMIN_EMAIL;
  
  // 2. Ambil data profil HANYA DARI ADMIN_EMAIL
  let user = await Admin.findOne({ email: ADMIN_EMAIL }).lean();

  if (!user) {
    user = await Admin.create({
      name: "Gede Valendra",
      email: ADMIN_EMAIL,
      username: "gedevalendra",
      bio: "Profil ini dikelola oleh Admin.",
      hashtags: ["#Admin", "#FunikIn"]
    });
  }

  const sharedLinks = await SharedLink.find({}).sort({ _id: -1 }).lean();

  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-900 font-sans">
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
          
          {/* Kirim status isAdmin ke ProfileSettings */}
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

          {/* Tombol tambah link hanya muncul jika yang buka adalah Admin */}
          {isAdmin && <AddLinkModal />}
          
          {sharedLinks.length === 0 ? (
            <p className="text-xs text-gray-400 font-mono">Belum ada tautan di database...</p>
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