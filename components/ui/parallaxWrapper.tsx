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
      // HAPUS flex, flex-col, dan justify-center. Biarkan normal.
      className="fixed top-0 left-0 w-full h-screen -z-10 bg-slate-50 will-change-transform"
      style={{
        transform: `translateY(-${offset * 0.4}px)`,
      }}
    >
      {children}
    </div>
  );
}