"use server";

import { connectDB } from "./db";
import { SharedLink } from "./models";
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