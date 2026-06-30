"use client";

import { updateProfile } from "../../lib/actions";

interface Props {
  user: any;
  onClose: () => void;
}

export default function EditProfileModal({ user, onClose }: Props) {
  return (
    <div className="fixed inset-0 bg-black/40 z-[60] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl animate-fadeIn">
        <h3 className="font-bold text-lg mb-4 text-gray-800">Edit Profil</h3>
        
        <form action={async (formData) => {
          await updateProfile(formData);
          onClose();
        }} className="space-y-4">
          {/* Hidden ID agar tahu user mana yang diupdate */}
          <input type="hidden" name="userId" value={user._id.toString()} />

          <div>
            <label className="text-xs font-bold text-gray-400 uppercase">Nama Lengkap</label>
            <input name="name" defaultValue={user.name} required className="w-full mt-1 p-2.5 border border-gray-200 rounded-lg text-sm focus:border-yellow-500 outline-none" />
          </div>

          <div>
            <label className="text-xs font-bold text-gray-400 uppercase">Bio</label>
            <textarea name="bio" defaultValue={user.bio} rows={3} className="w-full mt-1 p-2.5 border border-gray-200 rounded-lg text-sm focus:border-yellow-500 outline-none resize-none" />
          </div>

          <div>
            <label className="text-xs font-bold text-gray-400 uppercase">Hashtags (Gunakan spasi)</label>
            <input name="hashtags" defaultValue={user.hashtags?.join(" ")} placeholder="#Developer #Music" className="w-full mt-1 p-2.5 border border-gray-200 rounded-lg text-sm focus:border-yellow-500 outline-none" />
          </div>
          
          <div className="flex gap-3 mt-6">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium">Batal</button>
            <button type="submit" className="flex-1 py-2.5 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-black">Simpan Perubahan</button>
          </div>
        </form>
      </div>
    </div>
  );
}