import mongoose from "mongoose";

const LinkSchema = new mongoose.Schema({
  username: { type: String, required: true }, // <-- TAMBAHKAN INI agar link tidak bercampur
  icon: { type: String, default: "bx-link" },
  title: { type: String, required: true },
  description: { type: String, default: "" },
  url: { type: String, required: true },
}, { 
  collection: "SharedLink" 
});

export const SharedLink = mongoose.models.SharedLink || mongoose.model("SharedLink", LinkSchema);

const AdminSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  bio: { type: String, default: "" },
  hashtags: { type: [String], default: [] },
}, { 
  collection: "Admin" 
});

export const Admin = mongoose.models.Admin || mongoose.model("Admin", AdminSchema);