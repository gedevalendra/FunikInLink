import Header from "../components/layout/header";
import Footer from "../components/layout/footer";
import { getServerSession } from "next-auth";
import { authOptions } from "../lib/auth";
import InteractiveHero from "../components/ui/interactiveHero"; // <-- Import file animasi baru

export default async function LandingPage() {
  const session = await getServerSession(authOptions);
  
  // Ambil username dengan aman jika ada
  const userUsername = (session?.user as any)?.username || "";

  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-900 font-sans relative">
      <Header />
      
      {/* Memanggil section utama yang sudah berisi animasi lengkap */}
      <InteractiveHero session={session} userUsername={userUsername} />
      
      <Footer />
    </div>
  );
}