"use server";

import { connectDB } from "./db";
import { SharedLink, User } from "./models";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth";

export async function addLink(formData: FormData) {
  await connectDB();
  
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) throw new Error("Kamu harus login terlebih dahulu!");

  const currentUser = await User.findOne({ email: session.user.email });
  if (!currentUser) throw new Error("User tidak ditemukan!");

  await SharedLink.create({
    username: currentUser.username, 
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

  const currentUser = await User.findOne({ email: session.user.email });
  
  await SharedLink.findByIdAndDelete(id);
  
  if (currentUser) {
    revalidatePath(`/${currentUser.username}`);
  }
}

// ==========================================
// ACTION BARU: UNTUK EDIT/UPDATE LINK
// ==========================================
export async function updateLink(formData: FormData) {
  await connectDB();
  
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) throw new Error("Unauthorized");

  const currentUser = await User.findOne({ email: session.user.email });
  if (!currentUser) throw new Error("User tidak ditemukan!");

  const id = formData.get("id") as string;
  
  await SharedLink.findOneAndUpdate(
    { _id: id, username: currentUser.username }, // Memastikan hanya pemilik yang bisa edit
    {
      title: formData.get("title"),
      url: formData.get("url"),
      description: formData.get("description"),
      icon: formData.get("icon") || "bx-link",
    }
  );
  
  revalidatePath(`/${currentUser.username}`);
}

export async function updateProfile(formData: FormData) {
  await connectDB();
  
  const userId = formData.get("userId");
  const name = formData.get("name");
  const bio = formData.get("bio");
  const hashtagString = formData.get("hashtags") as string;
  const usernameInput = formData.get("username") as string;

  const cleanUsername = usernameInput ? usernameInput.toLowerCase().trim().replace(/\s+/g, "-") : "";

  if (cleanUsername) {
    const existingUsername = await User.findOne({ 
      username: cleanUsername, 
      _id: { $ne: userId } 
    });

    if (existingUsername) {
      throw new Error("Username sudah digunakan oleh orang lain! Silakan pilih yang lain.");
    }
  }

  const hashtags = hashtagString
    ? hashtagString.split(" ").filter((tag) => tag.startsWith("#"))
    : [];

  const oldUser = await User.findById(userId);

  const updatedUser = await User.findByIdAndUpdate(userId, {
    username: cleanUsername || oldUser?.username, 
    name,
    bio,
    hashtags,
    isNewUser: false, 
  }, { new: true });

  if (updatedUser) {
    if (oldUser && oldUser.username !== updatedUser.username) {
      await SharedLink.updateMany(
        { username: oldUser.username },
        { $set: { username: updatedUser.username } }
      );
      revalidatePath(`/${oldUser.username}`);
    }

    revalidatePath(`/${updatedUser.username}`);
  }
}