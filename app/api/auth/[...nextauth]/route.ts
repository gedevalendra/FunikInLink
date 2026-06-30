import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { connectDB } from "../../../../lib/db"; 
import { User } from "../../../../lib/models"; 

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    // Fungsi ini otomatis berjalan saat user berhasil memilih akun Google
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        await connectDB();
        
        try {
          // 1. Cek apakah email user sudah ada di database
          const existingUser = await User.findOne({ email: user.email });
          
          // 2. Jika belum ada, otomatis buatkan akun baru!
          if (!existingUser) {
            // Buat username otomatis dari nama email (contoh: gede@gmail.com -> gede_123)
            const baseUsername = user.email?.split("@")[0] || "user";
            const randomNum = Math.floor(Math.random() * 1000);
            
            await User.create({
              name: user.name,
              email: user.email,
              username: `${baseUsername}_${randomNum}`,
              bio: "Halo, selamat datang di tautan saya!",
            });
          }
          return true; // Izinkan login
        } catch (error) {
          console.log("Error saat menyimpan user:", error);
          return false; // Tolak login jika error
        }
      }
      return false;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };