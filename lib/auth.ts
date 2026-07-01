import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { connectDB } from "./db";
import { User, AdminList } from "./models";
import { Resend } from "resend";

// Inisialisasi Resend dengan API Key dari Environment Variable
const resend = new Resend(process.env.RESEND_API_KEY);

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
          // 1. Ambil atau Buat User Baru di Database jika Belum Terdaftar
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

          // 2. INTEGRASI EMAIL: Menggunakan domain resmi funikin.it.com
          if (user.email) {
            try {
              const username = user.name || "Pengguna";
              
              console.log(`[Resend] Memulai pengiriman email ke: ${user.email}`);
              
              const emailResponse = await resend.emails.send({
                // SUDAH DIUBAH: Menggunakan domain kustom kamu agar tidak terdeteksi spoofing/spam oleh Gmail
                from: "FunikIn <noreply@funikin.it.com>", 
                to: user.email,
                subject: "Selamat Datang Kembali di FunikIn—Link!",
                html: `
                  <!DOCTYPE html>
                  <html lang="id">
                  <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Selamat Datang di FunikIn—Link</title>
                    <style>
                      body { margin: 0; padding: 0; background-color: #ffffff; font-family: 'Helvetica Neue', Helvetica, Roboto, Arial, sans-serif; color: #525252; -webkit-font-smoothing: antialiased; }
                      .wrapper { width: 100%; table-layout: fixed; background-color: #ffffff; padding: 40px 20px; }
                      .container { max-width: 520px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e5e5e5; border-radius: 8px; overflow: hidden; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05); }
                      .header-banner { background-color: #fafafa; padding: 25px; text-align: center; border-bottom: 1px solid #e5e5e5; }
                      .logo-placeholder { font-size: 20px; font-weight: bold; color: #171717; letter-spacing: -0.5px; }
                      .logo-placeholder span { color: #eab308; }
                      .content-body { padding: 40px 40px 30px; }
                      .greeting { font-size: 18px; font-weight: 500; color: #171717; margin: 0 0 15px 0; }
                      .message { font-size: 14px; line-height: 1.6; margin: 0 0 25px 0; }
                      .welcome-box { background-color: #fafafa; border: 1px solid #e5e5e5; border-radius: 8px; padding: 25px 20px; text-align: center; margin-bottom: 25px; }
                      .welcome-label { font-size: 10px; font-weight: 500; letter-spacing: 2.5px; text-transform: uppercase; color: #a3a3a3; margin-bottom: 12px; }
                      .welcome-status { font-size: 24px; font-weight: 500; color: #16a34a; line-height: 1; margin: 0 0 10px 0; }
                      .warning-text { font-size: 12px; line-height: 1.5; color: #737373; margin: 0; padding-top: 20px; border-top: 1px solid #f5f5f5; }
                      .footer { background-color: #171717; padding: 20px; text-align: center; }
                      .footer p { margin: 0; font-size: 11px; color: #737373; }
                    </style>
                  </head>
                  <body>
                    <div class="wrapper">
                      <div class="container">
                        <div class="header-banner">
                          <div class="logo-placeholder">Funik<span>In</span>.</div>
                        </div>
                        <div class="content-body">
                          <h1 class="greeting">Halo, ${username.trim()}!</h1>
                          <p class="message">Terima kasih telah masuk ke akun Anda. Kami senang melihat Anda kembali mengelola tautan terbaik Anda di platform kami.</p>
                          
                          <div class="welcome-box">
                            <div class="welcome-label">Status Sesi</div>
                            <div class="welcome-status">Berhasil Masuk</div>
                          </div>
                          
                          <p class="warning-text">Jika Anda tidak merasa melakukan login ini, segera amankan akun Google Anda dan hubungi tim bantuan kami.</p>
                        </div>
                        <div class="footer">
                          <p>&copy; ${new Date().getFullYear()} FunikIn. Hak cipta dilindungi undang-undang.</p>
                        </div>
                      </div>
                    </div>
                  </body>
                  </html>
                `,
              });
              
              console.log("[Resend] Respons API:", JSON.stringify(emailResponse));
              console.log(`[Resend] Email onboarding sukses terkirim ke ${user.email}`);
            } catch (emailError) {
              // Jika kuota Resend habis atau ada kendala network, log terekam dan user tidak terblokir loginnya
              console.error("[Resend] Gagal mengirim notifikasi email:", emailError);
            }
          }

          // Return true ditaruh di sini agar Vercel menunggu seluruh proses di atas beres
          return true;
        } catch (error) {
          console.error("Error saat menyimpan profil user atau memproses login:", error);
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
          token.id = (userDoc as any)._id.toString(); 
          token.username = (userDoc as any).username; 
          token.isNewUser = (userDoc as any).isNewUser;
          token.subscriptionStatus = (userDoc as any).subscriptionStatus || "free"; 
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
        (session.user as any).subscriptionStatus = token.subscriptionStatus; 
      }
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
};