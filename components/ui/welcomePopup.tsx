"use client";

import { useState, useEffect } from "react";

export default function WelcomePopup({ message }: { message: string }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Memunculkan popup dengan sedikit delay efek halus
    const timer = setTimeout(() => setVisible(true), 600);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-xs z-50 p-4 animate-fade-in">
      <div className="bg-white max-w-sm w-full p-6 rounded-2xl shadow-xl border border-gray-100 text-center space-y-4 transform scale-100 transition-all">
        <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto text-xl">
          <i className="bx bx-party"></i>
        </div>
        <p className="text-sm text-gray-700 leading-relaxed font-medium">
          {message}
        </p>
        <button 
          onClick={() => setVisible(false)}
          className="w-full py-2 bg-gray-900 text-white font-bold text-xs rounded-xl hover:bg-gray-800 transition-colors"
        >
          Halo Juga!
        </button>
      </div>
    </div>
  );
}