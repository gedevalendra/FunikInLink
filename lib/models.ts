import mongoose from "mongoose";

const LinkSchema = new mongoose.Schema({
  icon: { type: String, default: "bx-link" },
  title: { type: String, required: true },
  description: { type: String, default: "" },
  url: { type: String, required: true },
}, { 
  collection: "SharedLink" 
});

export const SharedLink = mongoose.models.SharedLink || mongoose.model("SharedLink", LinkSchema);


const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  bio: { type: String, default: "" },
  hashtags: { type: [String], default: [] }, // Disimpan sebagai Array
}, { 
  collection: "User" 
});

export const User = mongoose.models.User || mongoose.model("User", UserSchema);