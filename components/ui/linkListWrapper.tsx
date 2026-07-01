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
    <div className="space-y-3.5 relative w-full max-w-xl mx-auto px-2">
      {/* Header Section Minimalis */}
      <div className="flex justify-between items-center border-b border-neutral-50 pb-1.5">
        <h3 className="text-[10px] sm:text-xs font-medium uppercase tracking-wider text-neutral-400">
          Tautan Resmi
        </h3>
      </div>

      {isAdmin && (
        <div className="w-full flex justify-end">
          <AddLinkModal />
        </div>
      )}

      {links.length === 0 ? (
        <div className="flex flex-col gap-2.5 pt-1">
          {isAdmin && (
            <div className="p-3 bg-neutral-50 border border-neutral-100 rounded-xl text-[11px] sm:text-xs text-neutral-500 leading-relaxed font-normal flex items-center gap-2">
              <i className="bx bx-info-circle text-neutral-400 text-sm shrink-0"></i>
              <span>Kamu belum menambahkan tautan apa pun.</span>
            </div>
          )}

          {dummyLinks.map((dummy, idx) => (
            <div 
              key={dummy._id} 
              className="relative flex items-center gap-2.5 p-3 rounded-xl border border-neutral-100/60 opacity-50 bg-neutral-50/40 pointer-events-none select-none"
            >
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
          className="flex flex-col gap-2.5 relative"
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

// Sub-komponen pembungkus item reorder (dioptimalkan untuk handphone)
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
    }, 400); // Dipercepat ke 0.4 detik agar lebih responsif di handphone
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
      className={`relative flex items-center gap-3 p-3 rounded-xl border select-none transition-all duration-200 ${
        isDraggable 
          ? "bg-neutral-50/90 border-neutral-300 shadow-md z-50 cursor-grabbing backdrop-blur-xs" 
          : "bg-white border-neutral-100 hover:border-neutral-200 shadow-xs"
      }`}
      style={{ 
        touchAction: "none", 
        userSelect: "none", 
        WebkitUserSelect: "none"
      }}
      transition={{ type: "tween", duration: 0.15 }}
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