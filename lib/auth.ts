import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { connectDB } from "./db";
import { Admin, AdminList } from "./models"; // Pastikan model AdminList ditambahkan di import sini

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    // 1. FUNGSI SIGN-IN: Untuk menyimpan data siapa saja yang login (User Biasa)
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        await connectDB();
        try {
          // Cek apakah profil user ini sudah ada di database
          const existingUser = await Admin.findOne({ email: user.email });
          
          if (!existingUser) {
            const baseUsername = user.email?.split("@")[0] || "user";
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
          console.log("Error saat menyimpan profil user:", error);
          return false;
        }
      }
      return false;
    },

    // 2. FUNGSI JWT: Untuk mengecek apakah email yang login adalah ADMIN TERDAFTAR
    async jwt({ token, user }) {
      if (user) {
        await connectDB();
        
        // Cek secara spesifik ke collection AdminList (yang isinya cuma gmail pilihan)
        const isAdmin = await AdminList.findOne({ email: user.email }).lean();
        
        if (isAdmin) {
          token.role = "admin"; // Jika emailnya terdaftar di AdminList, beri akses admin
        } else {
          token.role = "user";  // Jika tidak terdaftar, dia cuma user biasa
        }
      }
      return token;
    },

    // 3. FUNGSI SESSION: Meneruskan role dari JWT ke Frontend (untuk merubah UI Beranda/Sidebar)
    async session({ session, token }) {
      if (session?.user) {
        (session.user as any).role = token.role;
      }
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
};