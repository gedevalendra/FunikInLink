import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { connectDB } from "./db";
import { User, AdminList } from "./models";

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
          const existingUser = await User.findOne({ email: user.email });
          
          if (!existingUser) {
            const baseUsername = user.email?.split("@")[0] || "user";
            const randomNum = Math.floor(Math.random() * 1000);
            
            await User.create({
              name: user.name,
              email: user.email,
              username: `${baseUsername}_${randomNum}`,
              bio: "Halo, selamat datang di tautan resmi saya!",
              isNewUser: true,
              password: Math.random().toString(36).slice(-8), // Dummy password untuk OAuth
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

    async jwt({ token, user }) {
      await connectDB();

      if (token.email) {
        const userDoc = await User.findOne({ email: token.email }).lean();
        if (userDoc) {
          token.id = userDoc._id.toString(); // Simpan ID user untuk mempermudah transaksi
          token.username = userDoc.username; 
          token.isNewUser = userDoc.isNewUser;
          token.subscriptionStatus = userDoc.subscriptionStatus || "free"; // <-- MASUKKAN STATUS KE TOKEN
        }
      }

      if (user) {
        const isAdmin = await AdminList.findOne({ email: user.email }).lean();
        if (isAdmin) {
          token.role = "admin";
        } else {
          token.role = "user";
        }
      }
      return token;
    },

    async session({ session, token }) {
      if (session?.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
        (session.user as any).username = token.username; 
        (session.user as any).isNewUser = token.isNewUser; 
        (session.user as any).subscriptionStatus = token.subscriptionStatus; // <-- KIRIM KE FRONTEND
      }
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
};