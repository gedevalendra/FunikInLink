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
  const sortedInitial = [...initialLinks].sort((a, b) => (a.order || 0) - (b.order || 0));
  const [links, setLinks] = useState(sortedInitial);

  useEffect(() => {
    const updatedSorted = [...initialLinks].sort((a, b) => (a.order || 0) - (b.order || 0));
    setLinks(updatedSorted);
  }, [initialLinks]);

  const saveNewOrder = async (updatedLinks: any[]) => {
    try {
      await fetch("/api/links/reorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          links: updatedLinks.map((link, index) => ({
            id: link._id.toString(),
            order: index
          }))
        })
      });
    } catch (error) {
      console.error("Gagal memperbarui urutan link:", error);
    }
  };

  const handleReorderEnd = (newOrder: any[]) => {
    setLinks(newOrder);
    if (isAdmin) {
      saveNewOrder(newOrder);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Tautan Resmi</h3>
      </div>

      {isAdmin && <AddLinkModal />}

      {links.length === 0 ? (
        <div className="flex flex-col gap-3 pt-2">
          {isAdmin && (
            <div className="p-3 bg-amber-50 border border-amber-100 rounded-md text-xs text-amber-700 leading-relaxed font-medium">
              <i className="bx bx-info-circle mr-1 text-sm align-middle"></i>
              Kamu belum menambahkan tautan apa pun.
            </div>
          )}

          {dummyLinks.map((dummy, idx) => (
            <div key={dummy._id} className="relative flex items-start gap-3 p-3 rounded-md border border-gray-100/50 opacity-60 bg-gray-50/50 pointer-events-none">
              {/* FIXED: Properti yang dikirim disamakan dengan interface LinkCardProps milik linkCard.tsx */}
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
        <Reorder.Group 
          axis="y" 
          values={links} 
          onReorder={handleReorderEnd}
          className="flex flex-col gap-1.5 p-1 relative"
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

// Sub-komponen pembungkus item agar useDragControls terpanggil dengan benar di dalam Reorder.Group
// Jalankan perbaikan pada fungsi ReorderItemWrapper di bagian bawah file LinkListWrapper.tsx

function ReorderItemWrapper({ link, index, isAdmin }: { link: any, index: number, isAdmin: boolean }) {
  const [isDraggable, setIsDraggable] = useState(false);
  const [isHolding, setIsHolding] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const dragControls = useDragControls();

  const handleStartHold = (event: any) => {
    if (!isAdmin) return;
    setIsHolding(true);
    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(() => {
      setIsDraggable(true);
      
      // FIXED: Matikan scroll layar HP saat item mulai digeser agar tidak bentrok
      document.body.style.overflow = "hidden";
      document.body.style.touchAction = "none";
      
      dragControls.start(event);
    }, 200); // Tahan 0.2 detik
  };

  const handleEndHold = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setIsHolding(false);
  };

  const handleDragEndLocal = () => {
    setIsDraggable(false);
    setIsHolding(false);
    
    // FIXED: Kembalikan fungsi scroll layar HP seperti semula setelah jari dilepas
    document.body.style.overflow = "";
    document.body.style.touchAction = "";
  };

  return (
    <Reorder.Item 
      value={link}
      id={link._id.toString()}
      dragListener={false}
      dragControls={dragControls}
      onDragEnd={handleDragEndLocal}
      // FIXED: touch-none ditambahkan agar browser HP tidak salah paham mengira ini perintah scroll halaman
      className={`relative flex items-start gap-3 p-3 rounded-md transition-colors border border-gray-100/50 select-none touch-none ${
        isDraggable ? "bg-slate-50 border-dashed border-slate-300 shadow-lg scale-[1.02] z-50 cursor-grabbing" : "bg-white"
      }`}
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