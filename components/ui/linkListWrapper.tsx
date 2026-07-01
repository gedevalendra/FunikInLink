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

  // Fungsi yang dipicu otomatis saat pelepasan drag selesai dilakukan oleh Reorder
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
              Kamu belum menambahkan tautan apa pun. Di bawah ini adalah pratinjau tampilan profilmu jika nanti sudah diisi:
            </div>
          )}

          {dummyLinks.map((dummy, idx) => (
            <LinkCard 
              key={dummy._id} 
              link={dummy} 
              isAdmin={isAdmin} 
              isDummy={true}
              index={idx}
              onDragStart={() => {}}
              onDragOver={() => {}}
              onDragEnd={() => {}}
            />
          ))}
        </div>
      ) : (
        /* Menggunakan Reorder Group bawaan framer-motion untuk sumbu vertikal (axis y) */
        <Reorder.Group 
          axis="y" 
          values={links} 
          onReorder={handleReorderEnd}
          className="flex flex-col gap-1.5 p-1 relative"
        >
          {links.map((link, index) => (
            <LinkCard 
              key={link._id.toString()} 
              link={link} 
              isAdmin={isAdmin} 
              isDummy={false}
              index={index}
              onDragStart={() => {}}
              onDragOver={() => {}}
              onDragEnd={() => {}}
            />
          ))}
        </Reorder.Group>
      )}
    </div>
  );
}