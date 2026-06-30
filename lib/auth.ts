import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { connectDB } from "./db";
import { Admin } from "./models"; // Kita akan buat model Admin setelah ini

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        await connectDB();
        try {
          // Cek di collection Admin apakah ada email ini
          const existingAdmin = await Admin.findOne({ email: user.email });
          
          if (!existingAdmin) {
            const baseUsername = user.email?.split("@")[0] || "admin";
            const randomNum = Math.floor(Math.random() * 1000);
            
            // Jika belum ada, buat sebagai profil baru
            await Admin.create({
              name: user.name,
              email: user.email,
              username: `${baseUsername}_${randomNum}`,
              bio: "Halo, selamat datang di tautan resmi saya!",
            });
          }
          return true;
        } catch (error) {
          console.log("Error saat menyimpan admin:", error);
          return false;
        }
      }
      return false;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};