"use client";

import { useState, useEffect } from "react";
import LinkCard from "./linkCard";
import AddLinkModal from "./addLinkModal";
import { Reorder } from "framer-motion";

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

// Sub-komponen pembungkus item
function ReorderItemWrapper({ link, index, isAdmin }: { link: any, index: number, isAdmin: boolean }) {
  const [activeDrag, setActiveDrag] = useState(false);

  return (
    <Reorder.Item 
      value={link}
      id={link._id.toString()}
      // Menggunakan drag native agar tracking koordinat sentuhan di HP 100% real-time & mulus
      dragListener={isAdmin}
      dragElastic={0.4}
      layout
      onDragStart={() => {
        setActiveDrag(true);
        document.body.style.overflow = "hidden";
      }}
      onDragEnd={() => {
        setActiveDrag(false);
        document.body.style.overflow = "";
      }}
      className={`relative flex items-start gap-3 p-3 rounded-md border select-none transition-shadow duration-200 ${
        activeDrag 
          ? "bg-slate-50 border-blue-400 shadow-xl z-50 scale-[1.02]" 
          : "bg-white border-gray-100/70 shadow-sm"
      }`}
      style={{ 
        touchAction: "none", 
        userSelect: "none", 
        WebkitUserSelect: "none"
      }}
      // Konfigurasi animasi pegas (spring) bawaan framer agar pertukaran posisi sangat fluid
      transition={{ type: "spring", stiffness: 500, damping: 40 }}
    >
      <LinkCard 
        link={link} 
        isAdmin={isAdmin} 
        isDummy={false} 
        index={index}
        isDraggable={activeDrag}
        isHolding={false}
        handleStartHold={() => {}}
        handleEndHold={() => {}}
      />
    </Reorder.Item>
  );
}