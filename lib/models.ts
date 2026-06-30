import mongoose from "mongoose";

const LinkSchema = new mongoose.Schema({
  icon: { type: String, default: "bx-link" },
  title: { type: String, required: true },
  description: { type: String, default: "" },
  url: { type: String, required: true },
});

export const SharedLink = mongoose.models.SharedLink || mongoose.model("SharedLink", LinkSchema);a