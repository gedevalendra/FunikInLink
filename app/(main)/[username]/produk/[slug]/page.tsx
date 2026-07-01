import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { connectDB } from "../../../../../lib/db";
import { User, Produk } from "../../../../../lib/models";
import ProductDetailClient from "./ProductDetailClient";

interface Props {
  params: Promise<{ username: string; slug: string }> | { username: string; slug: string };
}

// ==========================================
// 1. GENERATE METADATA (SEO Dinamis Produk)
// ==========================================
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  await connectDB();
  const resolvedParams = await params;
  const { username, slug } = resolvedParams;

  const product = await Produk.findOne({ slug, username }).lean() as any;
  const user = await User.findOne({ username }).lean() as any;

  if (!product || !user) {
    return { title: "Produk Tidak Ditemukan" };
  }

  const pageTitle = `${product.name} - Oleh ${user.name} | FunikIn`;
  return {
    title: pageTitle,
    description: product.description || `Beli ${product.name} langsung dari halaman resmi ${user.name}.`,
    openGraph: {
      title: pageTitle,
      images: [product.image],
    },
  };
}

// ==========================================
// 2. SERVER COMPONENT UTAMA
// ==========================================
export default async function DetailProdukPage({ params }: Props) {
  await connectDB();
  const resolvedParams = await params;
  const { username, slug } = resolvedParams;

  // 1. Ambil data pemilik profil
  const user = await User.findOne({ username }).lean() as any;
  if (!user) return notFound();

  // 2. Ambil data produk utama yang sedang dibuka
  const product = await Produk.findOne({ slug, username }).lean() as any;
  if (!product) return notFound();

  // 3. Ambil rekomendasi produk lain milik user ini (maksimal 4 produk, exclude produk saat ini)
  const otherProductsRaw = await Produk.find({ 
    username, 
    _id: { $ne: product._id } 
  }).limit(4).lean();

  const otherProducts = otherProductsRaw.map((p: any) => ({
    _id: String(p._id),
    name: p.name,
    slug: p.slug,
    description: p.description,
    image: p.image,
    price: p.price,
    salesCount: p.salesCount || 0
  }));

  // Normalisasi gambar jika dalam bentuk string atau array
  const imagesArray = Array.isArray(product.image) 
    ? product.image 
    : [product.image];

  const serializedProduct = {
    _id: String(product._id),
    name: product.name,
    slug: product.slug,
    description: product.description || "Tidak ada deskripsi produk.",
    images: imagesArray,
    price: product.price,
    salesCount: product.salesCount || 0
  };

  const serializedUser = {
    name: user.name,
    username: user.username,
    profileBorder: user.customization?.profileBorder || "none",
  };

  return (
    <div className="min-h-screen bg-gray-50/50 font-sans py-8 px-4 sm:px-6">
      <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden pb-8">
        
        {/* Tombol Kembali / Header Mini */}
        <div className="p-4 flex items-center border-b border-gray-50">
          <Link 
            href={`/${username}`}
            className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 transition-colors"
          >
            <i className="bx bx-arrow-back text-lg"></i> Kembali ke Profil
          </Link>
        </div>

        {/* Kirim ke Client Component untuk Slider & Deskripsi Gradasi Fade */}
        <ProductDetailClient 
          product={serializedProduct} 
          user={serializedUser} 
          otherProducts={otherProducts} 
        />

      </div>
    </div>
  );
}