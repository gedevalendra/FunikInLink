"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export default function ButtonLoaderInterceptor() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Setiap kali halaman berhasil berpindah rute, matikan semua loading pada tombol
  useEffect(() => {
    const activeLoaders = document.querySelectorAll('[data-loading="true"]');
    activeLoaders.forEach((el) => {
      el.removeAttribute("data-loading");
      el.classList.remove("pointer-events-none", "opacity-90");
    });
  }, [pathname, searchParams]);

  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      // Cari apakah elemen yang diklik (atau parent-nya) adalah button atau tag <a>
      const clickableEl = target.closest("button, a") as HTMLElement;

      if (clickableEl) {
        // Abaikan jika berupa link eksternal, anchor internal (#), atau target _blank
        const href = clickableEl.getAttribute("href");
        const targetAttr = clickableEl.getAttribute("target");
        if (href && (href.startsWith("http") || href.startsWith("#") || targetAttr === "_blank")) {
          return;
        }

        // Tandai tombol/link tersebut sedang memuat halaman
        clickableEl.setAttribute("data-loading", "true");
        // Kunci tombol agar tidak bisa diklik berkali-kali
        clickableEl.classList.add("pointer-events-none", "opacity-90");
      }
    };

    document.body.addEventListener("click", handleGlobalClick);
    return () => document.body.removeEventListener("click", handleGlobalClick);
  }, []);

  return (
    /* Menyisipkan CSS Global khusus untuk menyembunyikan teks & memunculkan spinner di tengah */
    <style jsx global>{`
      /* 1. Ketika loading aktif, buat posisi relatif dan buat teks/konten asli menjadi transparan (hilang) */
      [data-loading="true"] {
        position: relative !important;
        color: transparent !important;
      }

      /* Sembunyikan juga icon Boxicons agar tidak berbayang */
      [data-loading="true"] i,
      [data-loading="true"] span,
      [data-loading="true"] img {
        opacity: 0 !important;
        visibility: hidden !important;
      }

      /* 2. Buat spinner baru menggunakan pseudo-element ::after tepat di tengah-tengah tombol */
      [data-loading="true"]::after {
        content: "";
        position: absolute;
        top: 50%;
        left: 50%;
        width: 18px;
        height: 18px;
        margin-top: -9px; /* Setengah dari height untuk center vertical */
        margin-left: -9px; /* Setengah dari width untuk center horizontal */
        border: 2px solid rgba(0, 0, 0, 0.1);
        /* Gunakan warna teks asli tombol sebelum transparan untuk spinner-nya */
        border-top-color: currentColor; 
        border-radius: 50%;
        animation: spin-button-center 0.6s linear infinite;
        z-index: 10;
      }

      /* Penyesuaian khusus: Jika tombolnya memiliki teks putih (seperti tombol merah/hitam kamu), 
         buat base border spinner-nya putih transparan agar terlihat kontras */
      [data-loading="true"].bg-gradient-to-r::after,
      [data-loading="true"].bg-slate-900::after,
      [data-loading="true"].text-white::after {
        border: 2px solid rgba(255, 255, 255, 0.2);
        border-top-color: #fff;
      }

      /* 3. Animasi rotasi spinner */
      @keyframes spin-button-center {
        to { transform: rotate(360deg); }
      }
    `}</style>
  );
}