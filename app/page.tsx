import Header from "../components/layout/header"; 
import Footer from "../components/layout/footer"; 
import ProfileSettings from "../components/ui/profileSettings";
import AddLinkModal from "../components/ui/addLinkModal";
import LinkCard from "../components/ui/linkCard";
import { connectDB } from "../lib/db";
import { SharedLink, User } from "../lib/models"; 

export default async function Home() {
  await connectDB();
  
  // 1. Ambil data User dari database
  let user = await User.findOne({}).lean();

  // Jika database masih kosong, buat 1 user default otomatis
  if (!user) {
    user = await User.create({
      name: "Gede Valendra",
      username: "gedevalendra",
      bio: "Full-Stack Developer membangun solusi praktis berbasis web modern. Fokus pada performa, keamanan, dan pengalaman pengguna.",
      hashtags: ["#Developer", "#NextJS", "#FullStack"]
    });
  }

  // 2. Ambil data Link
  const sharedLinks = await SharedLink.find({}).sort({ _id: -1 }).lean();

  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-900 font-sans">
      <Header />
      
      <main className="flex-grow max-w-xl w-full mx-auto px-6 py-12">
        
        {/* ================= SECTION 1: PROFILE ================= */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-gray-900 text-white font-medium flex items-center justify-center text-lg flex-shrink-0 uppercase">
              {/* Ambil 2 huruf pertama dari nama user */}
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
          
          {/* Kirim data user ke komponen dropdown agar bisa diedit di modal */}
          <ProfileSettings user={user} />
        </div>

        <div className="mt-4 space-y-3">
          <p className="text-sm text-gray-600 leading-relaxed max-w-md">
            {user.bio}
          </p>
          <div className="flex gap-2 text-xs font-mono text-gray-400">
            {/* Looping hashtags dari database */}
            {user.hashtags?.map((tag: string, index: number) => (
              <span key={index}>{tag}</span>
            ))}
          </div>
        </div>

        <hr className="my-8 border-gray-100" />

        {/* ================= SECTION 2: TAUTAN ================= */}
        <div className="space-y-2">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Tautan Resmi</h3>
          </div>

          <AddLinkModal />
          
          {sharedLinks.length === 0 ? (
            <p className="text-xs text-gray-400 font-mono italic">Belum ada tautan di database...</p>
          ) : (
            sharedLinks.map((link: any) => (
              <LinkCard key={link._id.toString()} link={link} />
            ))
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}