"use server";

import { connectDB } from "./db";
import { SharedLink, User, Chart } from "./models";
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

// ========================================================
// 🚀 SERVER ACTIONS INTEGRASI KERANJANG (CHART) KE MONGODB
// ========================================================

// 1. Aksi Menambah Item ke Dalam Koleksi Chart
export async function addToCartAction(productId: string, title: string, price: number, image: string) {
  await connectDB();
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    throw new Error("Kamu harus login terlebih dahulu untuk menambah ke keranjang!");
  }
  
  // Ambil ID User dari Token JWT Session yang sedang aktif
  const userId = (session.user as any).id;
  if (!userId) {
    throw new Error("ID pengguna tidak valid di dalam session!");
  }

  // Cari tahu apakah barang ini dengan User ini sudah ada record-nya di database
  const existingCartItem = await Chart.findOne({ userId, productId });

  if (existingCartItem) {
    // Jika barangnya kembar di keranjang user tersebut, cukup naikkan Qty nya (+1)
    existingCartItem.qty += 1;
    await existingCartItem.save();
  } else {
    // Jika produk baru pertama kali dimasukkan, create baris dokumen baru
    await Chart.create({
      userId,
      productId,
      title,
      price,
      image,
      qty: 1
    });
  }

  // Ambil data detail user untuk keperluan revalidasi link cache Next.js router
  const userDoc = await User.findById(userId);
  if (userDoc) {
    revalidatePath(`/${userDoc.username}/chart`);
  }
}

// 2. Aksi Mengubah Angka Kuantitas (+ / -) dari Sisi Keranjang
export async function updateCartQtyAction(cartId: string, delta: number) {
  await connectDB();
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    throw new Error("Akses tidak sah! Sila login.");
  }

  const cartItem = await Chart.findById(cartId);
  if (cartItem) {
    // Memastikan kuantitas tidak drop di bawah angka 1
    cartItem.qty = Math.max(1, cartItem.qty + delta);
    await cartItem.save();
    
    const userId = (session.user as any).id;
    const userDoc = await User.findById(userId);
    if (userDoc) {
      revalidatePath(`/${userDoc.username}/chart`);
    }
  }
}

// 3. Aksi Menghapus Item dari Keranjang Belanja secara Permanen
export async function removeFromCartAction(cartId: string) {
  await connectDB();
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    throw new Error("Akses tidak sah! Sila login.");
  }

  await Chart.findByIdAndDelete(cartId);
  
  const userId = (session.user as any).id;
  const userDoc = await User.findById(userId);
  if (userDoc) {
    revalidatePath(`/${userDoc.username}/chart`);
  }
}