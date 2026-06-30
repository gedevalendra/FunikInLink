import mongoose from "mongoose";

// 1. Model untuk Link
const LinkSchema = new mongoose.Schema({
  username: { type: String, required: true }, 
  icon: { type: String, default: "bx-link" },
  title: { type: String, required: true },
  description: { type: String, default: "\"\"" },
  url: { type: String, required: true },
}, { 
  collection: "SharedLink" 
});

export const SharedLink = mongoose.models.SharedLink || mongoose.model("SharedLink", LinkSchema);

// 2. Model untuk Profil Pengguna (User)
// Di dalam UserSchema Anda, tambahkan:
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  bio: { type: String, default: "" },
  hashtags: { type: [String], default: [] },
  isNewUser: { type: Boolean, default: true },
  // TAMBAHKAN FIELD BARU INI:
  isVerified: { type: Boolean, default: false }, 
}, { 
  collection: "User" // atau "User" tergantung setup koleksi Anda
});

export const User = mongoose.models.User || mongoose.model("User", UserSchema);

// 3. Model untuk Hak Akses Admin Panel (PASTIKAN BAGIAN INI ADA)
const AdminListSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  nama: { type: String, required: true },
}, { 
  collection: "AdminList", // Pastikan nama collection sesuai di MongoDB Compass Anda
  timestamps: true 
});

export const AdminList = mongoose.models.AdminList || mongoose.model("AdminList", AdminListSchema);