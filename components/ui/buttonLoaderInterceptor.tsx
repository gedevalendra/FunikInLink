"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export default function ButtonLoaderInterceptor() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  // Menyimpan referensi tombol dan timer pemaksa mati (timeout)
  const lastClickedButtonRef = useRef<HTMLElement | null>(null);
  const maxTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Helper untuk mematikan status loading pada tombol
  const removeLoading = (el: Element) => {
    el.removeAttribute("data-loading");
    el.classList.remove("pointer-events-none", "opacity-90");
  };

  // Bersihkan semua loader & timer jika berpindah halaman
  useEffect(() => {
    const activeLoaders = document.querySelectorAll('[data-loading="true"]');
    activeLoaders.forEach(removeLoading);
    if (maxTimeoutRef.current) clearTimeout(maxTimeoutRef.current);
    lastClickedButtonRef.current = null;
  }, [pathname, searchParams]);

  // Intercept Jaringan (Fetch & XHR) secara Global
  useEffect(() => {
    let activeRequests = 0;

    const checkAndResetLoader = () => {
      // Jika semua request jaringan selesai, matikan loading
      if (activeRequests <= 0) {
        activeRequests = 0;
        if (lastClickedButtonRef.current) {
          removeLoading(lastClickedButtonRef.current);
          lastClickedButtonRef.current = null;
        }
        if (maxTimeoutRef.current) clearTimeout(maxTimeoutRef.current);
      }
    };

    // --- INTERCEPT FETCH API ---
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      activeRequests++;
      try {
        return await originalFetch(...args);
      } finally {
        activeRequests--;
        setTimeout(checkAndResetLoader, 50); // Jeda mikro 50ms biar transisi smooth
      }
    };

    // --- INTERCEPT XMLHTTPREQUEST (XHR / Axios) ---
    const originalOpen = XMLHttpRequest.prototype.open;
    const originalSend = XMLHttpRequest.prototype.send;

    XMLHttpRequest.prototype.open = function (method: string, url: string | URL, async: boolean = true, username?: string | null, password?: string | null) {
      this.addEventListener("loadend", () => {
        activeRequests--;
        setTimeout(checkAndResetLoader, 50);
      });
      return originalOpen.call(this, method, url, async, username, password);
    };

    XMLHttpRequest.prototype.send = function (body?: Document | XMLHttpRequestBodyInit | null) {
      activeRequests++;
      return originalSend.call(this, body);
    };

    return () => {
      window.fetch = originalFetch;
      XMLHttpRequest.prototype.open = originalOpen;
      XMLHttpRequest.prototype.send = originalSend;
    };
  }, []);

  // Handle Event Klik Global
  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      // Abaikan jika mengklik input centang / radio secara langsung
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

        // --- INSTAN LOADING DI SINI ---
        // Bersihkan timer lama jika ada klik beruntun sebelum proses selesai
        if (maxTimeoutRef.current) clearTimeout(maxTimeoutRef.current);

        lastClickedButtonRef.current = clickableEl;
        clickableEl.setAttribute("data-loading", "true");
        clickableEl.classList.add("pointer-events-none", "opacity-90");

        // --- PENGAMAN MAKSIMAL 3 DETIK ---
        // Jika dalam 3 detik server/database ngadat atau lambat, paksa matikan loading-nya
        maxTimeoutRef.current = setTimeout(() => {
          if (clickableEl.getAttribute("data-loading") === "true") {
            removeLoading(clickableEl);
            if (lastClickedButtonRef.current === clickableEl) {
              lastClickedButtonRef.current = null;
            }
          }
        }, 3000); // 3000ms = 3 detik pas
      }
    };

    // Gunakan capture phase (true) agar event klik ditangkap paling pertama sebelum fungsi bawaan tombol berjalan
    document.body.addEventListener("click", handleGlobalClick, true);
    return () => document.body.removeEventListener("click", handleGlobalClick, true);
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