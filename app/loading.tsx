export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-2">
        {/* Spinner Muter-Muter Kecil */}
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-200 border-t-yellow-500" />
        {/* Teks Loading Opsional (Bisa dihapus jika hanya ingin lingkaran saja) */}
        <p className="text-xs font-medium text-gray-400 tracking-wide">Memuat...</p>
      </div>
    </div>
  );
}