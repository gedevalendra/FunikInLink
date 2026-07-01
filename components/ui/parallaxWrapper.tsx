"use client";

import { useEffect, useState } from "react";

export default function ParallaxWrapper({ children }: { children: React.ReactNode }) {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY <= window.innerHeight) {
        setOffset(window.scrollY);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      // PERBAIKAN: Mengubah -z-10 menjadi z-0 agar elemen di dalamnya bisa diklik
      className="fixed top-0 left-0 w-full h-fit z-0 bg-slate-50 will-change-transform"
      style={{
        transform: `translateY(-${offset * 0.4}px)`,
      }}
    >
      {children}
    </div>
  );
}