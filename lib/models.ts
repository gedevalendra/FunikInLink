import mongoose from "mongoose";

// 1. Model untuk Link
const LinkSchema = new mongoose.Schema({
  username: { type: String, required: true }, 
  icon: { type: String, default: "bx-link" },
  title: { type: String, required: true },
  description: { type: String, default: "" },
  url: { type: String, required: true },
}, { 
  collection: "SharedLink" 
});

export const SharedLink = mongoose.models.SharedLink || mongoose.model("SharedLink", LinkSchema);

// 2. Model untuk Profil Pengguna (User)
const AdminSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  bio: { type: String, default: "" },
  hashtags: { type: [String], default: [] },
  isNewUser: { type: Boolean, default: true }, // <-- TAMBAHKAN PROPERTI INI
}, { 
  collection: "Admin" 
});

export const Admin = mongoose.models.Admin || mongoose.model("Admin", AdminSchema);

// 3. Model untuk Hak Akses Admin Panel
const AdminListSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  nama: { type: String, required: true },
  iduser: { type: String },
}, { 
  collection: "AdminList" 
});

export const AdminList = mongoose.models.AdminList || mongoose.model("AdminList", AdminListSchema);