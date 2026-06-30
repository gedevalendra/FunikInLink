"use server";

import { connectDB } from "./db";
import { SharedLink, User } from "./models";
import { revalidatePath } from "next/cache";

export async function addLink(formData: FormData) {
  await connectDB();
  
  await SharedLink.create({
    title: formData.get("title"),
    url: formData.get("url"),
    description: formData.get("description"),
    icon: formData.get("icon") || "bx-link",
  });
  
  revalidatePath("/");
}

export async function deleteLink(id: string) {
  await connectDB();
  await SharedLink.findByIdAndDelete(id);
  revalidatePath("/");
}

// FUNGSI BARU UNTUK EDIT PROFILE
export async function updateProfile(formData: FormData) {
  await connectDB();
  
  const userId = formData.get("userId");
  const name = formData.get("name");
  const bio = formData.get("bio");
  const hashtagString = formData.get("hashtags") as string;

  // Ubah string "#Dev #Next" menjadi array ["#Dev", "#Next"]
  const hashtags = hashtagString
    ? hashtagString.split(" ").filter((tag) => tag.startsWith("#"))
    : [];

  await User.findByIdAndUpdate(userId, {
    name,
    bio,
    hashtags,
  });

  revalidatePath("/"); // Segarkan halaman agar perubahan langsung terlihat
}