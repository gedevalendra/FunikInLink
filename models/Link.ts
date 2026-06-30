import mongoose, { Schema, model, models } from "mongoose";

const LinkSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true }, // Relasi ke User
    icon: { type: String, required: true }, // Nama icon Boxicons, contoh: 'bxl-github'
    title: { type: String, required: true },
    description: { type: String, default: "" },
    url: { type: String, required: true },
  },
  { timestamps: true }
);

export const Link = models.Link || model("Link", LinkSchema);