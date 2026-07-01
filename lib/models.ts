import mongoose from "mongoose";

// 1. Model untuk Link
const LinkSchema = new mongoose.Schema({
  username: { type: String, required: true }, 
  icon: { type: String, default: "bx-link" },
  title: { type: String, required: true },
  description: { type: String, default: "" },
  url: { type: String, required: true },
  // FIELD BARU: Untuk menyimpan urutan atas-bawah link
  order: { type: Number, default: 0 },
}, { 
  collection: "SharedLink" 
});

export const SharedLink = mongoose.models.SharedLink || mongoose.model("SharedLink", LinkSchema);

// 2. Model untuk Profil Pengguna (User)
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  bio: { type: String, default: "" },
  hashtags: { type: [String], default: [] },
  isNewUser: { type: Boolean, default: true },
  isVerified: { type: Boolean, default: false }, 
  // ==========================================
  // FIELD BARU: PENTING AGAR KUSTOMISASI TERSIMPAN
  // ==========================================
  customization: {
    background: { type: String, default: "#ffffff" },
    isBlur: { type: Boolean, default: false },
    rounded: { type: String, default: "rounded-xl" },
    profileBorder: { type: String, default: "none" },
    linkStyle: { type: String, default: "solid" },
    showPopup: { type: Boolean, default: false },
    popupMessage: { type: String, default: "" }
  }
}, { 
  collection: "User"
});

export const User = mongoose.models.User || mongoose.model("User", UserSchema);

// 3. Model untuk Hak Akses Admin Panel
const AdminListSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  nama: { type: String, required: true },
}, { 
  collection: "AdminList",
  timestamps: true 
});

export const AdminList = mongoose.models.AdminList || mongoose.model("AdminList", AdminListSchema);


// ========================================================
// 🚀 MODEL BARU: Skema untuk Koleksi Produk (Koleksi: "Produk")
// ========================================================
const ProdukSchema = new mongoose.Schema({
  // Relasi kepemilikan produk (bisa diisi username atau ID User pemiliknya)
  username: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  
  // Informasi Utama Produk
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true }, // URL ramah SEO, contoh: "premium-notion-template"
  description: { type: String, default: "" },
  image: { type: String, required: true }, // Menyimpan URL string dari image hosting (Unsplash/Cloudinary)
  
  // Finansial & Statistik
  price: { type: Number, required: true, default: 0 },
  salesCount: { type: Number, default: 0 }, // Total pembelian produk
}, { 
  collection: "Produk", // Nama koleksi di database MongoDB kamu wajib sama
  timestamps: true      // Otomatis membuat field createdAt dan updatedAt
});

// Daftarkan model "Produk" agar bisa dipanggil oleh server Next.js tanpa crash duplikasi
export const Produk = mongoose.models.Produk || mongoose.model("Produk", ProdukSchema);