import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { connectDB } from "../../lib/db";
import { User } from "../../lib/models";

export default async function MePage() {
  const session = await getServerSession();

  if (!session?.user?.email) {
    redirect("/registrasi");
  }

  await connectDB();

  // 2. Cari data user di database berdasarkan email Google-nya
  const currentUser = await User.findOne({ email: session.user.email }).lean();

  // 3. Jika ketemu, lempar langsung ke URL /username-nya!
  if (currentUser) {
    redirect(`/${currentUser.username}`);
  }

  // Jika error tidak terduga, kembalikan ke home
  redirect("/");
}