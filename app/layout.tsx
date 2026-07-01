import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import { Suspense } from "react"; // 1. Import Suspense dari React
import AuthProvider from "../components/AuthProvider";
import ButtonLoaderInterceptor from "../components/ui/buttonLoaderInterceptor";
import Header from "../components/layout/header";
import Footer from "../components/layout/footer";
import { NotificationProvider } from "@/context/NotificationContext";

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
    template: "%s | FunikIn Link", // Format judul untuk halaman lain
  },
  description:
    "Kelola portofolio, media sosial, dan tautan pentingmu dalam satu halaman profil kustom yang indah dan responsif.",
  keywords: [
    "link in bio",
    "portfolio",
    "social media",
    "funikin link",
    "profil kreator",
  ],
  authors: [{ name: "FunikIn Dev" }],

  // Konfigurasi Open Graph (Ini yang dibaca oleh WhatsApp, Facebook, LinkedIn)
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://funikin.com",
    siteName: "FunikIn Link",
    title: "FunikIn Link - Satu Tautan untuk Semua",
    description:
      "Kelola portofolio, media sosial, dan tautan pentingmu dalam satu halaman profil kustom yang indah dan responsif.",
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
    description:
      "Kelola portofolio, media sosial, dan tautan pentingmu dalam satu halaman profil kustom.",
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
      <head>
        {/* Memindahkan CSS Boxicons ke dalam head agar valid secara struktur HTML */}
        <link
          href="https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col">
        {/* 2. Membungkus Interceptor dengan Suspense agar lolos build prerender Vercel */}

        <NotificationProvider>
          <AuthProvider>
            <Header />
            {children}
            <Footer />
          </AuthProvider>
        </NotificationProvider>
        <Script
          src="https://unpkg.com/boxicons@2.1.4/dist/boxicons.js"
          strategy="afterInteractive"
        />

        <Script
          src="https://app.sandbox.midtrans.com/snap/snap.js"
          data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
          strategy="lazyOnload"
        />
      </body>
    </html>
  );
}
