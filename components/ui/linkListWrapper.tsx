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
  username?: string; // Menambahkan username untuk informasi pesan
}

export default function LinkListWrapper({ initialLinks, isAdmin, dummyLinks, customVariant, username = "user" }: LinkListWrapperProps) {
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
    <div className="space-y-2 relative">
      
      {/* Tombol Tambah Tautan Baru di atas */}
      {isAdmin && <AddLinkModal />}

      {/* KONDISI JIKA LINK KOSONG */}
      {links.length === 0 ? (
        <div className="flex flex-col gap-3 pt-2">
          {isAdmin ? (
            /* Jika ADMIN: Tampilkan info box dan Konten Dummy */
            <>
              <div className="p-3.5 bg-neutral-50 border border-neutral-200 border-dashed rounded-xl text-xs text-neutral-500 leading-relaxed font-normal flex items-center gap-2 justify-center text-center">
                <i className="bx bx-info-circle text-neutral-400 text-sm"></i>
                <span>Kamu belum menambahkan tautan apa pun. Berikut adalah tampilan simulasi dummy:</span>
              </div>

              {dummyLinks.map((dummy, idx) => (
                <div key={dummy._id} className="relative flex items-start gap-3 p-3 rounded-md border border-gray-100/50 opacity-50 bg-gray-50/50 pointer-events-none select-none">
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
            </>
          ) : (
            /* Jika PENGUNJUNG UMUM: Sembunyikan dummy, tampilkan box informasi bersih */
            <div className="w-full flex flex-col items-center justify-center p-8 text-center min-h-[180px] bg-neutral-50/50 border border-dashed border-neutral-200 rounded-2xl max-w-md mx-auto">
              <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400 mb-3">
                <i className="bx bx-link text-xl"></i>
              </div>
              <h4 className="text-xs sm:text-sm font-medium text-neutral-800 mb-1">Tautan Belum Tersedia</h4>
              <p className="text-[11px] sm:text-xs text-neutral-400 leading-relaxed px-4">
                @{username} belum mengunggah tautan sosial atau informasi apa pun saat ini.
              </p>
            </div>
          )}
        </div>
      ) : (
        /* KONDISI JIKA LINK ADA */
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

// Sub-komponen pembungkus item (Tetap utuh seperti sebelumnya)
function ReorderItemWrapper({ link, index, isAdmin }: { link: any, index: number, isAdmin: boolean }) {
  const [isDraggable, setIsDraggable] = useState(false);
  const [isHolding, setIsHolding] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const dragControls = useDragControls();

  const handleStartHold = (event: React.PointerEvent) => {
    if (!isAdmin) return;
    setIsHolding(true);
    
    const savedEvent = event.nativeEvent || event;

    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(() => {
      setIsDraggable(true);
      document.body.style.overflow = "hidden";
      dragControls.start(savedEvent);
    }, 500); 
  };

  const handleEndHold = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setIsHolding(false);
  };

  const handleDragEndLocal = () => {
    setIsDraggable(false);
    setIsHolding(false);
    document.body.style.overflow = "";
  };

  return (
    <Reorder.Item 
      value={link}
      id={link._id.toString()}
      dragListener={false} 
      dragControls={dragControls}
      layout
      onDragEnd={handleDragEndLocal}
      className={`relative flex items-start gap-3 p-3 rounded-md border select-none transition-shadow duration-150 ${
        isDraggable 
          ? "bg-slate-50 border-gray-300 shadow-md z-50 cursor-grabbing" 
          : "bg-white border-gray-100/70 shadow-sm"
      }`}
      style={{ 
        touchAction: "none", 
        userSelect: "none", 
        WebkitUserSelect: "none"
      }}
      transition={{ type: "tween", duration: 0.18 }}
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