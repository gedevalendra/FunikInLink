"use client"; // 1. Wajib deklarasikan sebagai Client Component

interface DeleteButtonProps {
  userId: string;
  userName: string;
  deleteAction: (formData: FormData) => Promise<void>;
}

export default function DeleteUserButton({ userId, userName, deleteAction }: DeleteButtonProps) {
  return (
    <form 
      action={deleteAction} 
      onSubmit={(e) => {
        // Now confirm() safely runs on the browser!
        if (!confirm(`Hapus pengguna ${userName}? Semua link-nya akan dihapus permanen.`)) {
          e.preventDefault();
        }
      }}
    >
      <input type="hidden" name="userId" value={userId} />
      <button 
        type="submit" 
        className="w-full flex items-center justify-center text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 border border-red-100 px-2.5 py-1.5 rounded-md transition-all"
      >
        <i className="bx bx-trash-alt"></i>
      </button>
    </form>
  );
}