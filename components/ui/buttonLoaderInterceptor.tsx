"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export default function ButtonLoaderInterceptor() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  // Menyimpan referensi tombol yang terakhir kali diklik oleh user
  const lastClickedButtonRef = useRef<HTMLElement | null>(null);

  // Helper untuk mematikan status loading pada tombol
  const removeLoading = (el: Element) => {
    el.removeAttribute("data-loading");
    el.classList.remove("pointer-events-none", "opacity-90");
  };

  // 1. Reset loading jika terjadi perpindahan halaman/rute URL
  useEffect(() => {
    const activeLoaders = document.querySelectorAll('[data-loading="true"]');
    activeLoaders.forEach(removeLoading);
    lastClickedButtonRef.current = null;
  }, [pathname, searchParams]);

  // 2. Intercept Network Requests (Fetch & XHR) secara Global
  useEffect(() => {
    let activeRequests = 0;

    const checkAndResetLoader = () => {
      // Jika semua request jaringan sudah beres (0), matikan loading tombol terakhir
      if (activeRequests <= 0) {
        activeRequests = 0;
        if (lastClickedButtonRef.current) {
          removeLoading(lastClickedButtonRef.current);
          lastClickedButtonRef.current = null;
        }
      }
    };

    // --- INTERCEPT FETCH API ---
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      activeRequests++;
      try {
        const response = await originalFetch(...args);
        return response;
      } finally {
        activeRequests--;
        // Beri sedikit jeda mikro (100ms) agar UI tidak berkedip terlalu cepat jika server super kilat
        setTimeout(checkAndResetLoader, 100);
      }
    };

    // --- INTERCEPT XMLHTTPREQUEST (XHR / Axios biasanya pakai ini) ---
    // cast originals to any to avoid strict TS overload mismatch when wrapping
    const originalOpen = XMLHttpRequest.prototype.open as any;
    const originalSend = XMLHttpRequest.prototype.send as any;

    XMLHttpRequest.prototype.open = function (this: XMLHttpRequest, ...args: any[]) {
      this.addEventListener("loadend", () => {
        activeRequests--;
        setTimeout(checkAndResetLoader, 100);
      });
      return originalOpen.apply(this, args);
    } as any;

    XMLHttpRequest.prototype.send = function (this: XMLHttpRequest, ...args: any[]) {
      activeRequests++;
      return originalSend.apply(this, args);
    } as any;

    // Cleanup saat komponen unmount (kembalikan fungsi asli browser)
    return () => {
      window.fetch = originalFetch;
      XMLHttpRequest.prototype.open = originalOpen;
      XMLHttpRequest.prototype.send = originalSend;
    };
  }, []);

  // 3. Handle Event Klik Global
  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      // Abaikan jika mengklik elemen input/checkbox/radio/label
      if (
        target.tagName === "INPUT" || 
        target.getAttribute("type") === "checkbox" ||
        target.closest("label")
      ) {
        return;
      }

      const clickableEl = target.closest("button, a") as HTMLElement;

      if (clickableEl) {
        const href = clickableEl.getAttribute("href");
        const targetAttr = clickableEl.getAttribute("target");
        if (href && (href.startsWith("http") || href.startsWith("#") || targetAttr === "_blank")) {
          return;
        }

        // Simpan element tombol ke ref dan nyalakan loading
        lastClickedButtonRef.current = clickableEl;
        clickableEl.setAttribute("data-loading", "true");
        clickableEl.classList.add("pointer-events-none", "opacity-90");

        // Failsafe Jaga-jaga: Jika tombol diklik tapi tidak ada request jaringan sama sekali 
        // (misal cuma buka modal lokal), matikan loading dalam 400ms biar ga stuck.
        setTimeout(() => {
          if (clickableEl.getAttribute("data-loading") === "true" && !lastClickedButtonRef.current) {
            removeLoading(clickableEl);
          }
        }, 400);
      }
    };

    document.body.addEventListener("click", handleGlobalClick);
    return () => document.body.removeEventListener("click", handleGlobalClick);
  }, []);

  return (
    <style jsx global>{`
      [data-loading="true"] {
        position: relative !important;
        color: transparent !important;
      }
      [data-loading="true"] i,
      [data-loading="true"] span,
      [data-loading="true"] img {
        opacity: 0 !important;
        visibility: hidden !important;
      }
      [data-loading="true"]::after {
        content: "";
        position: absolute;
        top: 50%;
        left: 50%;
        width: 18px;
        height: 18px;
        margin-top: -9px;
        margin-left: -9px;
        border: 2px solid rgba(0, 0, 0, 0.1);
        border-top-color: currentColor; 
        border-radius: 50%;
        animation: spin-button-center 0.6s linear infinite;
        z-index: 10;
      }
      [data-loading="true"].bg-gradient-to-r::after,
      [data-loading="true"].bg-slate-900::after,
      [data-loading="true"].text-white::after {
        border: 2px solid rgba(255, 255, 255, 0.2);
        border-top-color: #fff;
      }
      @keyframes spin-button-center {
        to { transform: rotate(360deg); }
      }
    `}</style>
  );
}