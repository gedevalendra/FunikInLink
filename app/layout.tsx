import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import AuthProvider from "../components/AuthProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// === KONFIGURASI SEO GLOBAL & OPEN GRAPH ===
export const metadata: Metadata = {
  // Ganti dengan domain asli Anda nanti saat sudah online
  metadataBase: new URL("https://funikin.com"), 
  
  title: {
    default: "FunikIn Link - Satu Tautan untuk Semua",
    template: "%s | FunikIn Link" // Format judul untuk halaman lain
  },
  description: "Kelola portofolio, media sosial, dan tautan pentingmu dalam satu halaman profil kustom yang indah dan responsif.",
  keywords: ["link in bio", "portfolio", "social media", "funikin link", "profil kreator"],
  authors: [{ name: "FunikIn Dev" }],
  
  // Konfigurasi Open Graph (Ini yang dibaca oleh WhatsApp, Facebook, LinkedIn)
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://funikin.com",
    siteName: "FunikIn Link",
    title: "FunikIn Link - Satu Tautan untuk Semua",
    description: "Kelola portofolio, media sosial, dan tautan pentingmu dalam satu halaman profil kustom yang indah dan responsif.",
    images: [
      {
        // Pastikan Anda menaruh gambar banner ukuran 1200x630px di folder 'public' dengan nama 'og-image.jpg'
        url: "/og-image.jpg", 
        width: 1200,
        height: 630,
        alt: "FunikIn Link Cover",
      },
    ],
  },
  
  // Konfigurasi Twitter / X
  twitter: {
    card: "summary_large_image",
    title: "FunikIn Link - Satu Tautan untuk Semua",
    description: "Kelola portofolio, media sosial, dan tautan pentingmu dalam satu halaman profil kustom.",
    images: ["/og-image.jpg"], // Sama dengan gambar OG
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id" // Ubah jadi 'id' untuk SEO Indonesia
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AuthProvider>
          {children}
        </AuthProvider>
        <Script 
          src="https://unpkg.com/boxicons@2.1.4/dist/boxicons.js" 
          strategy="afterInteractive" 
        />
        <link href='https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css' rel='stylesheet' />
      </body>
    </html>
  );
}