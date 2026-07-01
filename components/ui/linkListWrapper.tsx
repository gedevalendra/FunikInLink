"use client";

import { useState } from "react";
import LinkCard from "./linkCard";
import AddLinkModal from "./addLinkModal";

interface LinkListWrapperProps {
  initialLinks: any[];
  isAdmin: boolean;
  dummyLinks: any[];
  customVariant?: string; // Menambahkan properti baru kustomisasi gaya
}

export default function LinkListWrapper({ initialLinks, isAdmin, dummyLinks, customVariant = "solid" }: LinkListWrapperProps) {
  // Urutkan data awal berdasarkan index order dari terkecil ke terbesar (0, 1, 2, ...)
  const sortedInitial = [...initialLinks].sort((a, b) => (a.order || 0) - (b.order || 0));
  const [links, setLinks] = useState(sortedInitial);

  // Fungsi untuk menyimpan urutan baru ke database via API internal
  const saveNewOrder = async (updatedLinks: any[]) => {
    try {
      await fetch("/api/links/reorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          links: updatedLinks.map((link, index) => ({
            id: link._id.toString(),
            order: index // Urutan otomatis diset dari 0, 1, 2, dst.
          }))
        })
      });
    } catch (error) {
      console.error("Gagal memperbarui urutan link:", error);
    }
  };

  const moveLink = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= links.length) return;

    const newLinks = [...links];
    // Tukar posisi elemen array
    const temp = newLinks[index];
    newLinks[index] = newLinks[targetIndex];
    newLinks[targetIndex] = temp;

    setLinks(newLinks);
    if (isAdmin) {
      saveNewOrder(newLinks);
    }
  };

  // Helper fungsi untuk menentukan class CSS pembungkus variant tombol link jika diperlukan global
  const getVariantStyles = () => {
    switch (customVariant) {
      case "outline":
        return "[&_a]:border-2 [&_a]:border-slate-950 [&_a]:bg-transparent [&_a]:text-slate-950 [&_a]:shadow-none";
      case "shadow":
        return "[&_a]:bg-white [&_a]:border [&_a]:border-slate-100 [&_a]:shadow-md [&_a]:text-slate-950 hover:[&_a]:shadow-lg";
      case "solid":
      default:
        return "[&_a]:bg-slate-950 [&_a]:text-white [&_a]:border-none";
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Tautan Resmi</h3>
      </div>

      {isAdmin && <AddLinkModal />}
      
      {links.length === 0 ? (
        <div className={`flex flex-col gap-3 pt-2 ${getVariantStyles()}`}>
          {isAdmin && (
            <div className="p-3 bg-amber-50 border border-amber-100 rounded-xl text-xs text-amber-700 leading-relaxed font-medium">
              <i className="bx bx-info-circle mr-1 text-sm align-middle"></i>
              Kamu belum menambahkan tautan apa pun. Di bawah ini adalah pratinjau tampilan profilmu jika nanti sudah diisi:
            </div>
          )}
          
          {dummyLinks.map((dummy) => (
            <LinkCard 
              key={dummy._id} 
              link={dummy} 
              isAdmin={isAdmin} 
              isDummy={true} 
            />
          ))}
        </div>
      ) : (
        <div className={`flex flex-col gap-2 ${getVariantStyles()}`}>
          {links.map((link, index) => (
            <LinkCard 
              key={link._id.toString()} 
              link={link} 
              isAdmin={isAdmin} 
              isDummy={false}
              isFirst={index === 0}
              isLast={index === links.length - 1}
              onMoveUp={() => moveLink(index, "up")}
              onMoveDown={() => moveLink(index, "down")}
            />
          ))}
        </div>
      )}
    </div>
  );
}