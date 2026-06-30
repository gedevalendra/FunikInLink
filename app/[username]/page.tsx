import { connectDB } from "../../lib/db";
import { User, SharedLink } from "../../lib/models";
import { notFound } from "next/navigation";
import ProfileSettings from "../../components/ui/profileSettings";
import LinkCard from "../../components/ui/linkCard";

// params.username akan menangkap apapun teks di URL (misal: /gedevalendra)
export default async function UserProfilePage({ params }: { params: { username: string } }) {
  await connectDB();

  // 1. Cari user berdasarkan username di URL
  const user = await User.findOne({ username: params.username }).lean();

  // Jika user tidak ditemukan, tampilkan halaman 404
  if (!user) {
    return notFound(); 
  }

  // 2. Ambil HANYA tautan milik user tersebut
  const sharedLinks = await SharedLink.find({ userId: user._id }).sort({ _id: -1 }).lean();

  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-900 font-sans">
      <main className="flex-grow max-w-xl w-full mx-auto px-6 py-12">
        
        {/* ================= SECTION PROFILE ================= */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-gray-900 text-white font-medium flex items-center justify-center text-lg uppercase">
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
          
          <ProfileSettings user={user} />
        </div>

        {/* ... (Tampilkan Bio, Hashtags, dan LinkCard di sini seperti biasa) ... */}
        
        <div className="mt-8 space-y-2">
          {sharedLinks.length === 0 ? (
            <p className="text-xs text-gray-400 font-mono italic">Belum ada tautan...</p>
          ) : (
            sharedLinks.map((link: any) => (
              <LinkCard key={link._id.toString()} link={link} />
            ))
          )}
        </div>

      </main>
    </div>
  );
}