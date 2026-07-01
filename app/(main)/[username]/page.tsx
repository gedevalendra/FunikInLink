import { Metadata } from "next"; 
import ProfileSettings from "../../../components/ui/profileSettings";
import LinkListWrapper from "../../../components/ui/linkListWrapper";
import OnboardingModal from "../../../components/ui/onboardingModal"; 
import WelcomePopup from "../../../components/ui/welcomePopup"; 
import ProfileTabs from "../../../components/ui/profileTabs"; // 🚀 Import komponen tab baru kita
import { connectDB } from "../../../lib/db";
import { SharedLink, User } from "../../../lib/models";
import mongoose from "mongoose";

import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../lib/auth";

interface Props {
  params: Promise<{ username: string }> | { username: string };
}

// Data Dummy Tautan
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

// Data Dummy Produk jika di database belum ada isi data koleksi produknya
const DUMMY_PRODUCTS = [
  {
    _id: "dummy-prod-1",
    name: "Premium Notion Template Dashboard",
    slug: "premium-notion-template-dashboard",
    description: "Atur seluruh produktivitas kerja, catatan kuliah, tugas, keuangan, dan schedule harian dalam satu dashboard Notion terintegrasi.",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600",
    price: 89000,
    salesCount: 142
  },
  {
    _id: "dummy-prod-2",
    name: "E-Book: Roadmap Menjadi Fullstack Web Dev",
    slug: "ebook-roadmap-menjadi-fullstack-web-dev",
    description: "Buku panduan lengkap dari nol langkah demi langkah menguasai JavaScript, React, Next.js, Node.js hingga strategi riset portofolio kerja.",
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=600",
    price: 45000,
    salesCount: 389
  },
  {
    _id: "dummy-prod-3",
    name: "Exclusive UI/UX Icon Set Bundle",
    slug: "exclusive-ui-ux-icon-set-bundle",
    description: "Koleksi lebih dari 1500+ aset icon SVG berbasis vektor siap pakai untuk mempercantik UI desain website atau aplikasi mobile kamu.",
    image: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=600",
    price: 120000,
    salesCount: 64
  },
  {
    _id: "dummy-prod-4",
    name: "SaaS Starter Kit Next.js Tailwind",
    slug: "saas-starter-kit-nextjs-tailwind",
    description: "Source code lengkap boilerplate Next.js App Router yang sudah dilengkapi setup autentikasi, database, Stripe, dan styling UI premium.",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=600",
    price: 350000,
    salesCount: 28
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

  // 4. AMBIL DATA DARI KOLEKSI PRODUK (Menggunakan Mongoose Dinamis)
  let productsData: any[] = [];
  try {
    // Pastikan model "Produk" sudah diregistrasi di berkas models kamu, jika belum kita amankan agar tidak crash
    const ProductModel = mongoose.models.Produk || mongoose.models.Product;
    
    if (ProductModel) {
      // Ambil produk milik user ini (bisa difilter berdasarkan userId atau username sesuai skema DB-mu)
      const dbProducts = await ProductModel.find({ 
        $or: [{ userId: user._id }, { username: user.username }] 
      }).lean();
      
      productsData = dbProducts.map((p: any) => ({
        _id: String(p._id),
        name: String(p.name || "Nama Produk"),
        slug: String(p.slug || "produk-detail"),
        description: String(p.description || ""),
        image: String(p.image || ""),
        price: Number(p.price || 0),
        salesCount: Number(p.salesCount || 0)
      }));
    }
  } catch (error) {
    console.error("Gagal mengambil koleksi produk, beralih ke data dummy:", error);
  }

  // Jika di database tidak ada produk sama sekali, suntikkan dummy produk biar tetep muncul layoutnya
  if (productsData.length === 0) {
    productsData = DUMMY_PRODUCTS;
  }

  // 5. Fallback data kustomisasi jika belum dikonfigurasi di database
  const custom = user.customization || {
    background: "#ffffff",
    isBlur: false,
    rounded: "rounded-xl",
    profileBorder: "none",
    linkStyle: "solid",
    showPopup: false,
    popupMessage: ""
  };

  // Bungkus komponen LinkListWrapper ke dalam variabel untuk disalurkan ke sistem tab
  const renderLinksComponent = (
    <LinkListWrapper 
      initialLinks={sharedLinks} 
      isAdmin={isAdmin} 
      dummyLinks={DUMMY_PREVIEW_LINKS} 
    />
  );

  return (
    <div className="flex flex-col min-h-screen font-sans bg-gray-50 transition-all duration-300">
      {/* Tampilkan Onboarding Modal jika User Baru */}
      {showOnboarding && <OnboardingModal user={user} />}

      {/* Tampilkan Pop-up Pesan Selamat Datang Kustom jika diaktifkan */}
      {custom.showPopup && custom.popupMessage && (
        <WelcomePopup message={custom.popupMessage} />
      )}

      <main className={`grow max-w-4xl w-full mx-auto px-6 pt-14 py-12 mt-2 -mb-2 transition-all duration-300
        ${custom.isBlur ? "bg-white/60 backdrop-blur-md shadow-xl" : "bg-white shadow-sm"}
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
          <p className="text-sm text-gray-600 leading-relaxed max-w-2xl">
            {user.bio || "Belum ada bio."}
          </p>
          <div className="flex flex-wrap gap-2 text-xs font-mono text-blue-600">
            {user.hashtags?.map((tag: string, index: number) => (
              <span key={index}>{tag}</span>
            ))}
          </div>
        </div>

        <hr className="my-6 border-gray-100" />

        {/* 🚀 RENDER SISTEM TAB BARU (Tautan VS Produk Grid 2x4) */}
        <ProfileTabs 
          linksComponent={renderLinksComponent} 
          products={productsData} 
        />

      </main>
    </div>
  );
}