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

// 4. Model untuk Koleksi Produk
const ProdukSchema = new mongoose.Schema({
  username: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true }, 
  description: { type: String, default: "" },
  image: { type: String, required: true }, 
  price: { type: Number, required: true, default: 0 },
  salesCount: { type: Number, default: 0 }, 
}, { 
  collection: "Produk", 
  timestamps: true      
});

export const Produk = mongoose.models.Produk || mongoose.model("Produk", ProdukSchema);

// 5. Model untuk Koleksi Keranjang (Koleksi: "Chart")
const ChartSchema = new mongoose.Schema({
  userId: { type: String, required: true }, 
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Produk", required: true },
  title: { type: String, required: true },  
  price: { type: Number, required: true },
  image: { type: String, required: true },
  qty: { type: Number, required: true, default: 1 },
}, { 
  collection: "Chart",
  timestamps: true 
});

export const Chart = mongoose.models.Chart || mongoose.model("Chart", ChartSchema);