"use client";

import { useState, useEffect, useRef } from "react";
import LinkCard from "./linkCard";
import AddLinkModal from "./addLinkModal";
import { Reorder, useDragControls } from "framer-motion";

interface LinkListWrapperProps {
  initialLinks: any[];
  isAdmin: boolean;
  dummyLinks: any[];
  customVariant?: string;
}

export default function LinkListWrapper({ initialLinks, isAdmin, dummyLinks, customVariant }: LinkListWrapperProps) {
  // Urutkan initial data berdasarkan order database (ascending)
  const sortedInitial = [...initialLinks].sort((a, b) => (a.order || 0) - (b.order || 0));
  const [links, setLinks] = useState(sortedInitial);

  // Memicu Server Component update ketika initialLinks berubah
  useEffect(() => {
    const updatedSorted = [...initialLinks].sort((a, b) => (a.order || 0) - (b.order || 0));
    setLinks(updatedSorted);
  }, [initialLinks]);

  // Fungsi menyimpan urutan baru ke API Backend
  const saveNewOrder = async (updatedLinks: any[]) => {
    try {
      await fetch("/api/links/reorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          links: updatedLinks.map((link, index) => ({
            id: link._id.toString(),
            order: index // Gunakan index array sebagai order baru
          }))
        })
      });
    } catch (error) {
      console.error("Gagal memperbarui urutan link:", error);
    }
  };

  // Dipicu otomatis oleh Reorder.Group sewaktu pergeseran selesai
  const handleReorderEnd = (newOrder: any[]) => {
    setLinks(newOrder);
    if (isAdmin) {
      saveNewOrder(newOrder); // Simpan permanen jika admin
    }
  };

  return (
    <div className="space-y-2 relative">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Tautan Resmi</h3>
      </div>

      {isAdmin && <AddLinkModal />}

      {/* RENDER MODE KOSONG / DUMMY */}
      {links.length === 0 ? (
        <div className="flex flex-col gap-3 pt-2">
          {isAdmin && (
            <div className="p-3 bg-amber-50 border border-amber-100 rounded-md text-xs text-amber-700 leading-relaxed font-medium">
              <i className="bx bx-info-circle mr-1 text-sm align-middle"></i>
              Kamu belum menambahkan tautan apa pun.
            </div>
          )}

          {dummyLinks.map((dummy, idx) => (
            // Dummy item diset statis tanpa reorder system
            <div key={dummy._id} className="relative flex items-start gap-3 p-3 rounded-md border border-gray-100/50 opacity-60 bg-gray-50/50 pointer-events-none">
              <LinkCard 
                link={dummy} 
                isAdmin={isAdmin} 
                isDummy={true} 
                index={idx} 
                isDraggable={false} 
                isHolding={false} 
                handleStartHold={() => {}} 
                handleEndHold={() => {}} 
              />
            </div>
          ))}
        </div>
      ) : (
        // RENDER MODE RESMI (Reorder System Aktif)
        <Reorder.Group 
          axis="y" 
          values={links} 
          onReorder={handleReorderEnd}
          className="flex flex-col gap-2 p-1 relative"
          style={{ touchAction: "none" }}
        >
          {links.map((link, index) => {
            return (
              <ReorderItemWrapper 
                key={link._id.toString()} 
                link={link} 
                index={index} 
                isAdmin={isAdmin} 
              />
            );
          })}
        </Reorder.Group>
      )}
    </div>
  );
}

// Sub-komponen pembungkus item agar Reorder.Item menjadi direct child Reorder.Group
function ReorderItemWrapper({ link, index, isAdmin }: { link: any, index: number, isAdmin: boolean }) {
  const [isDraggable, setIsDraggable] = useState(false);
  const [isHolding, setIsHolding] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  // FIXED: Menggunakan dragControls kustom untuk instruksi drag manual seketika
  const dragControls = useDragControls();

  const handleStartHold = (event: React.PointerEvent) => {
    if (!isAdmin) return;
    setIsHolding(true);
    
    // Amankan nativeEvent agar koordinat kursor/sentuhan tidak hilang di dalam antrean asinkronus setTimeout
    const savedEvent = event.nativeEvent || event;

    if (timerRef.current) clearTimeout(timerRef.current);

    // Kunci timer selama 0.2 detik (Hold Timer)
    timerRef.current = setTimeout(() => {
      setIsDraggable(true);
      
      // Kunci scroll body agar halaman HP tidak bergoyang sewaktu di-drag
      document.body.style.overflow = "hidden";
      
      // FIXED: Tembakkan instruksi geser paksa seketika saat waktu tahan terpenuhi
      // Tidak perlu lepas tekan lagi, langsung drag murni
      dragControls.start(savedEvent);
    }, 200); 
  };

  const handleEndHold = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setIsHolding(false);
    // Jika dilepas sebelum 200ms, batalkan mode drag kustom
    if (!isDraggable) {
      setIsDraggable(false);
    }
  };

  const handleDragEndLocal = () => {
    setIsDraggable(false);
    setIsHolding(false);
    // Kembalikan fungsionalitas scroll layar normal
    document.body.style.overflow = "";
  };

  return (
    <Reorder.Item 
      value={link}
      id={link._id.toString()}
      // dragListener dimatikan agar tidak konflik, kita gunakan dragControls manual
      dragListener={false} 
      dragControls={dragControls}
      layout
      onDragEnd={handleDragEndLocal}
      className={`relative flex items-start gap-3 p-3 rounded-md border select-none transition-all ${
        isDraggable 
          ? "bg-slate-100 border-blue-400 shadow-xl z-50 scale-[1.015]" 
          : "bg-white border-gray-100/70 shadow-sm"
      }`}
      style={{ 
        touchAction: "none", 
        userSelect: "none", 
        WebkitUserSelect: "none",
        cursor: isDraggable ? "grabbing" : "auto"
      }}
      // FIXED: Konfigurasi transisi spring untuk efek SNAP/MAGNET yang tajam
      // Stiffness tinggi = nempel cepat. Damping tinggi = tidak membal, langsung mengunci 'PLEK'.
      transition={{ type: "spring", stiffness: 700, damping: 50 }}
    >
      <LinkCard 
        link={link} 
        isAdmin={isAdmin} 
        isDummy={false} 
        index={index}
        isDraggable={isDraggable}
        isHolding={isHolding}
        handleStartHold={handleStartHold}
        handleEndHold={handleEndHold}
      />
    </Reorder.Item>
  );
}