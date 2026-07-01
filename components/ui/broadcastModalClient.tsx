"use client";

import { useState, useEffect } from "react";

interface UserItem {
  _id: string;
  name: string;
  email: string;
  username: string;
}

export default function BroadcastModalClient({ users }: { users: UserItem[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form states
  const [targetType, setTargetType] = useState<"all" | "selected">("all");
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [subject, setSubject] = useState("");
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [messageText, setMessageText] = useState("");
  const [hasButton, setHasButton] = useState(false);
  const [buttonText, setButtonText] = useState("");
  const [buttonUrl, setButtonUrl] = useState("");

  // LOCK SCROLL SYSTEM: Mencegah layar utama di-scroll ketika modal terbuka
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const handleCheckboxUser = (userId: string) => {
    if (selectedUserIds.includes(userId)) {
      setSelectedUserIds(selectedUserIds.filter(id => id !== userId));
    } else {
      setSelectedUserIds([...selectedUserIds, userId]);
    }
  };

  const handleSendBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !title || !messageText) return alert("Harap isi elemen wajib!");
    if (targetType === "selected" && selectedUserIds.length === 0) return alert("Pilih minimal satu user tujuan!");

    setLoading(true);

    // Memisahkan teks pesan berdasarkan baris baru (\n) menjadi kumpulan elemen paragraf dinamis
    const contentElements = messageText.split("\n").filter(line => line.trim() !== "");

    const payload = {
      targetType,
      selectedUserIds: targetType === "selected" ? selectedUserIds : [],
      subject,
      title,
      subtitle,
      contentElements,
      hasButton,
      buttonText: hasButton ? buttonText : "",
      buttonUrl: hasButton ? buttonUrl : ""
    };

    try {
      const response = await fetch("/api/admin/broadcast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const result = await response.json();
      if (result.success) {
        alert(result.message);
        setIsOpen(false);
        // Reset form
        setSubject(""); setTitle(""); setSubtitle(""); setMessageText("");
        setHasButton(false); setButtonText(""); setButtonUrl(""); setSelectedUserIds([]);
      } else {
        alert("Gagal: " + result.error);
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan koneksi API!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Tombol Pemicu Utama */}
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-all shadow-sm"
      >
        <i className="bx bx-paper-plane text-sm"></i> Kirim Broadcast Email
      </button>

      {/* MODAL WINDOW */}
      {isOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 overflow-y-auto backdrop-blur-[8px] bg-black/40 animate-fade-in">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden transform scale-100 transition-all duration-300">
            
            {/* Header Modal */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <i className="bx bx-envelope text-blue-600 text-lg"></i>
                <h3 className="font-bold text-slate-800 text-sm sm:text-base">Kirim Pesan Custom Ke Pengguna</h3>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-xl"
              >
                <i className="bx bx-x"></i>
              </button>
            </div>

            {/* Isi Form Konten */}
            <form onSubmit={handleSendBroadcast} className="p-6 overflow-y-auto space-y-4 flex-1 text-xs sm:text-sm text-slate-700">
              
              {/* Opsi Target Pengguna */}
              <div className="space-y-1.5">
                <label className="block font-semibold text-slate-700">Target Penerima</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input type="radio" checked={targetType === "all"} onChange={() => setTargetType("all")} name="target" />
                    Semua User Terdaftar ({users.length})
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input type="radio" checked={targetType === "selected"} onChange={() => setTargetType("selected")} name="target" />
                    Pilih User Tertentu
                  </label>
                </div>
              </div>

              {/* Box Pilihan User (Muncul jika opsi 'selected' dipilih) */}
              {targetType === "selected" && (
                <div className="border border-slate-200 bg-slate-50 rounded-lg p-3 max-h-32 overflow-y-auto space-y-1.5">
                  <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Daftar Akun Database:</p>
                  {users.map(u => (
                    <label key={u._id} className="flex items-center gap-2 text-xs text-slate-600 hover:text-slate-900 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={selectedUserIds.includes(u._id)} 
                        onChange={() => handleCheckboxUser(u._id)} 
                      />
                      <span className="font-medium">{u.name}</span> 
                      <span className="text-[10px] text-slate-400 font-mono">({u.email})</span>
                    </label>
                  ))}
                </div>
              )}

              {/* Subjek & Judul */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block font-medium text-slate-600">Subjek Email *</label>
                  <input type="text" value={subject} onChange={(e)=>setSubject(e.target.value)} placeholder="Contoh: Info Pembaruan Sistem" className="w-full p-2 border rounded-md text-xs focus:outline-blue-500" required />
                </div>
                <div className="space-y-1">
                  <label className="block font-medium text-slate-600">Judul Utama Konten *</label>
                  <input type="text" value={title} onChange={(e)=>setTitle(e.target.value)} placeholder="Contoh: Selamat Datang di Versi Baru" className="w-full p-2 border rounded-md text-xs focus:outline-blue-500" required />
                </div>
              </div>

              {/* Subjudul */}
              <div className="space-y-1">
                <label className="block font-medium text-slate-600">Subjudul (Opsional)</label>
                <input type="text" value={subtitle} onChange={(e)=>setSubtitle(e.target.value)} placeholder="Teks kecil di bawah judul utama" className="w-full p-2 border rounded-md text-xs focus:outline-blue-500" />
              </div>

              {/* Isi Pesan Utama */}
              <div className="space-y-1">
                <label className="block font-medium text-slate-600">Isi Elemen Pesan (Mendukung Enter Kalimat) *</label>
                <textarea 
                  rows={4} 
                  value={messageText}
                  onChange={(e)=>setMessageText(e.target.value)}
                  placeholder="Ketik isi pesan kamu disini...&#10;Setiap kali menekan enter, teks otomatis dibungkus menjadi paragraf (<p>) baru yang rapi saat terkirim." 
                  className="w-full p-2.5 border rounded-md text-xs focus:outline-blue-500 font-sans" 
                  required
                />
              </div>

              {/* Opsi Tombol Kustom */}
              <div className="pt-2 border-t border-slate-100 space-y-3">
                <label className="flex items-center gap-2 font-medium text-slate-700 cursor-pointer">
                  <input type="checkbox" checked={hasButton} onChange={(e)=>setHasButton(e.target.checked)} />
                  Tambahkan Elemen Tombol Aksi Kustom (Call to Action)
                </label>

                {hasButton && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-blue-50/50 p-3 rounded-lg border border-blue-100 animate-fade-in">
                    <div className="space-y-1">
                      <label className="block text-xs font-medium text-slate-600">Teks Dalam Tombol</label>
                      <input type="text" value={buttonText} onChange={(e)=>setButtonText(e.target.value)} placeholder="Contoh: Klaim Fitur Premium" className="w-full p-2 bg-white border rounded-md text-xs focus:outline-blue-500" required={hasButton} />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-xs font-medium text-slate-600">URL Tujuan Tautan</label>
                      <input type="url" value={buttonUrl} onChange={(e)=>setButtonUrl(e.target.value)} placeholder="Contoh: https://aplikasikamu.com/fitur" className="w-full p-2 bg-white border rounded-md text-xs focus:outline-blue-500" required={hasButton} />
                    </div>
                  </div>
                )}
              </div>

              {/* Tombol Footer Aksi */}
              <div className="flex gap-3 pt-4 border-t border-slate-100">
                <button 
                  type="button" 
                  onClick={() => setIsOpen(false)} 
                  className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 font-medium rounded-lg text-xs"
                >
                  Batalkan
                </button>
                <button 
                  type="submit" 
                  disabled={loading}
                  className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg text-xs disabled:bg-gray-400"
                >
                  {loading ? "Sedang Memproses Kirim..." : "Broadcast Sekarang 🚀"}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}
    </>
  );
}