"use server";

import { connectDB } from "./db";
import { SharedLink, Admin } from "./models";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth";

export async function addLink(formData: FormData) {
  await connectDB();
  
  // Ambil sesi user yang sedang login saat ini
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) throw new Error("Kamu harus login terlebih dahulu!");

  // Cari data username berdasarkan email yang sedang login
  const currentUser = await Admin.findOne({ email: session.user.email });
  if (!currentUser) throw new Error("User tidak ditemukan!");

  await SharedLink.create({
    username: currentUser.username, // <-- Simpan sesuai username pemiliknya
    title: formData.get("title"),
    url: formData.get("url"),
    description: formData.get("description"),
    icon: formData.get("icon") || "bx-link",
  });
  
  revalidatePath(`/${currentUser.username}`);
}

export async function deleteLink(id: string) {
  await connectDB();
  
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) throw new Error("Unauthorized");

  const currentUser = await Admin.findOne({ email: session.user.email });
  
  await SharedLink.findByIdAndDelete(id);
  
  if (currentUser) {
    revalidatePath(`/${currentUser.username}`);
  }
}

export async function updateProfile(formData: FormData) {
  await connectDB();
  
  const userId = formData.get("userId");
  const name = formData.get("name");
  const bio = formData.get("bio");
  const hashtagString = formData.get("hashtags") as string;

  const hashtags = hashtagString
    ? hashtagString.split(" ").filter((tag) => tag.startsWith("#"))
    : [];

  const updatedUser = await Admin.findByIdAndUpdate(userId, {
    name,
    bio,
    hashtags,
  }, { new: true });

  if (updatedUser) {
    revalidatePath(`/${updatedUser.username}`);
  }
}