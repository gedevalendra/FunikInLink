import mongoose, { Schema, model, models } from "mongoose";

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // Untuk login manual jika tidak pakai Google Auth
    bio: { type: String, default: "" },
    hashtags: { type: [String], default: [] },
    totalViews: { type: Number, default: 0 }, // Indikator total pengunjung profil
  },
  { timestamps: true }
);

export const User = models.User || model("User", UserSchema);