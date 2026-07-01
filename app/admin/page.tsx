import { getServerSession } from "next-auth/next";
import { authOptions } from "../../lib/auth"; 
import { connectDB } from "../../lib/db"; 
import { User, SharedLink, AdminList } from "../../lib/models"; 
import { revalidatePath } from "next/cache";
import DeleteUserButton from "../../components/ui/DeleteUserButton"; 
import BroadcastModalClient from "../../components/ui/broadcastModalClient"; // Kita panggil client component pembungkus modal disini
import { sendAdminActionEmail } from "../../lib/emailNotification"; // 🚀 1. IMPORT HELPER EMAIL KAMU DI SINI

// =========================================================================
// SERVER ACTIONS (SUDAH INTEGRASI KIRIM EMAIL RESEND)
// =========================================================================

// 1. Server Action untuk menghapus pengguna beserta tautannya & AdminList (jika dia admin)
async function deleteUserAction(formData: FormData) {
  "use server";
  await connectDB();
  
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) throw new Error("Akses tidak sah!");
  
  const checkAdmin = await AdminList.findOne({ email: session.user.email });
  if (!checkAdmin) throw new Error("Akses ditolak!");

  const userId = formData.get("userId") as string;
  
  const userDoc = await User.findById(userId);
  if (userDoc) {
    const targetEmail = userDoc.email;
    const targetName = userDoc.name || "User";

    // Jika user yang dihapus merupakan admin, hapus juga dari koleksi AdminList
    await AdminList.deleteOne({ email: userDoc.email });
    // Hapus tautan dan data user
    await SharedLink.deleteMany({ username: userDoc.username });
    await User.findByIdAndDelete(userId);

    // 🚀 2. KIRIM EMAIL NOTIFIKASI: Akun Dihapus
    await sendAdminActionEmail({
      toEmail: targetEmail,
      userName: targetName,
      actionType: "delete"
    });
  }

  revalidatePath("/admin");
}

// 2. Server Action untuk verifikasi manual status pengguna baru (Onboarding/Setup Status)
async function toggleVerifyUserAction(formData: FormData) {
  "use server";
  await connectDB();

  const session = await getServerSession(authOptions);
  if (!session?.user?.email) throw new Error("Akses tidak sah!");

  const checkAdmin = await AdminList.findOne({ email: session.user.email });
  if (!checkAdmin) throw new Error("Akses ditolak!");

  const userId = formData.get("userId") as string;
  const currentStatus = formData.get("currentStatus") === "true";

  // Tangkap data user menggunakan findByIdAndUpdate dengan opsi { new: true } agar mendapat data terupdate
  const userDoc = await User.findByIdAndUpdate(userId, { isNewUser: !currentStatus }, { new: true });

  if (userDoc) {
    // 🚀 3. KIRIM EMAIL NOTIFIKASI: Reset Status / Aktifkan Kembali
    await sendAdminActionEmail({
      toEmail: userDoc.email,
      userName: userDoc.name || "User",
      actionType: !currentStatus ? "reset_setup" : "reset_active"
    });
  }

  revalidatePath("/admin");
}

// 3. Server Action untuk Mengaktifkan / Menonaktifkan Centang Biru (Badge)
async function toggleBadgeVerificationAction(formData: FormData) {
  "use server";
  await connectDB();

  const session = await getServerSession(authOptions);
  if (!session?.user?.email) throw new Error("Akses tidak sah!");

  const checkAdmin = await AdminList.findOne({ email: session.user.email });
  if (!checkAdmin) throw new Error("Akses ditolak!");

  const userId = formData.get("userId") as string;
  const currentVerifiedStatus = formData.get("currentVerifiedStatus") === "true";

  // Gunakan { new: true } agar data kembalian userDoc membawa status verifikasi terbaru
  const userDoc = await User.findByIdAndUpdate(userId, { isVerified: !currentVerifiedStatus }, { new: true });

  if (userDoc) {
    // 🚀 4. KIRIM EMAIL NOTIFIKASI: Beri Centang / Hapus Centang Biru
    await sendAdminActionEmail({
      toEmail: userDoc.email,
      userName: userDoc.name || "User",
      actionType: !currentVerifiedStatus ? "verify" : "unverify"
    });
  }

  revalidatePath("/admin");
}

// 4. Server Action untuk Mengangkat Jabatan User Menjadi Admin / Menurunkannya
async function toggleAdminRoleAction(formData: FormData) {
  "use server";
  await connectDB();

  const session = await getServerSession(authOptions);
  if (!session?.user?.email) throw new Error("Akses tidak sah!");

  const checkAdmin = await AdminList.findOne({ email: session.user.email });
  if (!checkAdmin) throw new Error("Akses ditolak!");

  const userEmail = formData.get("userEmail") as string;
  const userName = formData.get("userName") as string;
  const isCurrentlyAdmin = formData.get("isCurrentlyAdmin") === "true";

  if (isCurrentlyAdmin) {
    if (userEmail === session.user.email) {
      const totalAdminCount = await AdminList.countDocuments({});
      if (totalAdminCount <= 1) {
        throw new Error("Anda tidak bisa menurunkan jabatan Anda sendiri karena Anda adalah satu-satunya admin tersisa!");
      }
    }
    await AdminList.deleteOne({ email: userEmail });

    // 🚀 5. KIRIM EMAIL NOTIFIKASI: Akses Admin Dicabut
    await sendAdminActionEmail({
      toEmail: userEmail,
      userName: userName,
      actionType: "admin_revoke"
    });
  } else {
    await AdminList.create({
      nama: userName,
      email: userEmail
    });

    // 🚀 6. KIRIM EMAIL NOTIFIKASI: Diangkat Jadi Admin
    await sendAdminActionEmail({
      toEmail: userEmail,
      userName: userName,
      actionType: "admin_grant"
    });
  }

  revalidatePath("/admin");
}


// =========================================================================
// HALAMAN UTAMA PANEL ADMIN
// =========================================================================
export default async function admin() {
  await connectDB();

  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-500 text-sm font-medium">
        Silakan login terlebih dahulu untuk mengakses halaman ini.
      </div>
    );
  }

  const checkAdmin = await AdminList.findOne({ email: session.user.email }).lean();
  if (!checkAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50">
        <div className="bg-white p-6 rounded-xl border border-slate-200 max-w-sm w-full text-center shadow-sm space-y-3">
          <i className="bx bx-error-circle text-3xl text-red-500"></i>
          <h1 className="text-lg font-medium text-slate-900">Akses Ditolak</h1>
          <p className="text-sm text-slate-500 leading-relaxed">
            Email <span className="font-mono text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded text-xs">{session.user.email}</span> tidak terdaftar sebagai Administrator.
          </p>
        </div>
      </div>
    );
  }

  // Ambil data User rill dari DB
  const rawUsers = await User.find({}).lean();
  
  // Ambil semua daftar Administrator resmi untuk pembanding status role
  const rawAdmins = await AdminList.find({}).lean();
  const adminEmails = new Set(rawAdmins.map((adm: any) => String(adm.email)));

  // SINKRONISASI OTOMATIS: Update nama admin di AdminList jika nama di akun User berubah
  await Promise.all(
    rawUsers.map(async (u: any) => {
      if (adminEmails.has(String(u.email))) {
        const matchingAdmin = rawAdmins.find((adm: any) => String(adm.email) === String(u.email));
        if (matchingAdmin && matchingAdmin.nama !== u.name) {
          await AdminList.updateOne({ email: u.email }, { nama: u.name });
        }
      }
    })
  );

  // Ambil data ulang setelah proses sinkronisasi nama selesai agar datanya up-to-date
  const totalAdmins = await AdminList.find({}).lean();
  const updatedAdminEmails = new Set(totalAdmins.map((adm: any) => String(adm.email)));

  const processedUsers = await Promise.all(
    rawUsers.map(async (u: any) => {
      const linkCount = await SharedLink.countDocuments({ username: u.username });
      const isUserAdmin = updatedAdminEmails.has(String(u.email));
      
      return {
        _id: String(u._id), 
        name: String(u.name || "User"),
        email: String(u.email || ""),
        username: String(u.username || "user"),
        bio: String(u.bio || ""),
        isNewUser: u.isNewUser !== undefined ? Boolean(u.isNewUser) : false,
        isVerified: u.isVerified !== undefined ? Boolean(u.isVerified) : false,
        isAdmin: isUserAdmin, 
        hashtags: Array.isArray(u.hashtags) ? u.hashtags.map((tag: any) => String(tag)) : [],
        linkCount: Number(linkCount)
      };
    })
  );

  const totalActiveLinks = processedUsers.reduce((acc, curr) => acc + curr.linkCount, 0);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-800 font-sans antialiased">

      <main className="flex-grow max-w-6xl w-full mx-auto px-4 sm:px-6 py-8 space-y-6">
        
        {/* Atas: Ringkasan Judul & Tombol Pemicu Broadcast */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2">
          <div>
            <h1 className="text-xl font-medium tracking-tight text-slate-900 flex items-center gap-2">
              <i className="bx bx-shield-quarter text-slate-600"></i> Admin Panel
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Login sebagai: <span className="text-slate-600 font-medium">{String(checkAdmin.nama)}</span>
            </p>
          </div>

          {/* MENYALURKAN DATA USER DARI MONGODB KE BUTTON MODAL CLIENT */}
          <div>
            <BroadcastModalClient users={processedUsers} />
          </div>
        </div>

        {/* Tengah: Sistem Pemantau Online */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Card Status Admin Online */}
          <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm md:col-span-1">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium tracking-wider uppercase text-slate-400">Admin Aktif Sistem ({totalAdmins.length})</span>
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            </div>
            <div className="space-y-2 max-h-[110px] overflow-y-auto pr-1">
              {totalAdmins.map((adminItem: any) => (
                <div key={String(adminItem._id)} className="flex items-center gap-2.5 text-xs">
                  <div className="w-5 h-5 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-medium uppercase text-[10px]">
                    {String(adminItem.nama).substring(0,2)}
                  </div>
                  <div className="truncate w-full">
                    <p className="text-slate-700 font-medium truncate">{String(adminItem.nama)}</p>
                    <p className="text-[10px] text-slate-400 font-mono truncate">{String(adminItem.email)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Card Status User Online Baru-baru Ini */}
          <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm md:col-span-1">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium tracking-wider uppercase text-slate-400">User Terdaftar</span>
              <span className="text-xs font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded">Rill DB</span>
            </div>
            <div className="space-y-2 max-h-[110px] overflow-y-auto pr-1">
              {processedUsers.length === 0 ? (
                <p className="text-xs text-slate-400 italic pt-2">Belum ada user</p>
              ) : (
                processedUsers.slice(0, 3).map((userItem) => (
                  <div key={userItem._id} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-5 h-5 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-medium uppercase text-[10px]">
                        {userItem.name.substring(0,2)}
                      </div>
                      <p className="text-slate-700 font-medium truncate min-w-0 flex items-center gap-1">
                        {userItem.name}
                        {userItem.isVerified && <i className="bx bxs-badge-check text-blue-500 text-xs"></i>}
                        {userItem.isAdmin && <span className="text-[9px] bg-red-50 text-red-600 border border-red-200/50 px-1 rounded">Admin</span>}
                      </p>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 shrink-0">@{userItem.username}</span>
                  </div>
                ))
              )}
              {processedUsers.length > 3 && (
                <p className="text-[10px] text-slate-400 text-center pt-1">+ {processedUsers.length - 3} pengguna lainnya</p>
              )}
            </div>
          </div>

          {/* Card Performa Global Ringkas */}
          <div className="grid grid-cols-2 gap-3 md:col-span-1">
            <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm flex flex-col justify-center">
              <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Total User</p>
              <p className="text-2xl font-semibold text-slate-800 mt-1">{processedUsers.length}</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm flex flex-col justify-center">
              <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Total Link</p>
              <p className="text-2xl font-semibold text-slate-800 mt-1">{totalActiveLinks}</p>
            </div>
          </div>

        </div>

        {/* Bawah: Kontainer Utama List Pengguna */}
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
          
          <div className="p-4 border-b border-slate-100 bg-slate-50/50">
            <h3 className="text-xs font-medium uppercase tracking-wider text-slate-400">Daftar Pengguna</h3>
          </div>

          {/* RESPONSIVE LAYOUT 1: Tampilan Desktop */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-[11px] font-medium uppercase tracking-wider text-slate-400 bg-slate-50/30">
                  <th className="p-4 pl-6">Profil Pengguna</th>
                  <th className="p-4">Role Jabatan</th>
                  <th className="p-4">Setup Profil</th>
                  <th className="p-4">Centang Biru</th>
                  <th className="p-4">Tautan Aktif</th>
                  <th className="p-4 pr-6 text-right">Aksi Manajemen</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm text-slate-600">
                {processedUsers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-12 text-center text-xs text-slate-400 italic">
                      Belum ada data pendaftar sistem di database...
                    </td>
                  </tr>
                ) : (
                  processedUsers.map((user) => (
                    <tr key={user._id} className="hover:bg-slate-50/40 transition-colors">
                      <td className="p-4 pl-6">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-slate-800 text-white font-medium flex items-center justify-center text-xs uppercase shrink-0">
                            {user.name.substring(0, 2)}
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-slate-700 truncate flex items-center gap-1">
                              {user.name}
                              {user.isVerified && <i className="bx bxs-badge-check text-blue-500 text-sm" title="Verified Profile"></i>}
                            </p>
                            <p className="text-xs text-slate-400 font-mono truncate mt-0.5">{user.email}</p>
                          </div>
                        </div>
                      </td>

                      <td className="p-4">
                        {user.isAdmin ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-red-50 text-red-700 px-2 py-0.5 rounded-md border border-red-200">
                            ADMINISTRATOR
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">
                            STANDARD USER
                          </span>
                        )}
                      </td>

                      <td className="p-4">
                        {user.isNewUser ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-medium bg-amber-50 text-amber-700 px-2 py-0.5 rounded-md border border-amber-200/60">
                            ✖
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-medium bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-md border border-emerald-200/60">
                            ✔
                          </span>
                        )}
                      </td>

                      <td className="p-4">
                        {user.isVerified ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-medium bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md border border-blue-200/60 shadow-sm">
                            Verified
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-400 italic">Standar</span>
                        )}
                      </td>

                      <td className="p-4">
                        <span className="text-xs text-slate-600 bg-slate-100 px-2 py-0.5 rounded font-medium">
                          {user.linkCount}
                        </span>
                      </td>

                      <td className="p-4 pr-6">
                        <div className="flex items-center justify-end gap-2">
                          
                          <form action={toggleAdminRoleAction}>
                            <input type="hidden" name="userEmail" value={user.email} />
                            <input type="hidden" name="userName" value={user.name} />
                            <input type="hidden" name="isCurrentlyAdmin" value={String(user.isAdmin)} />
                            <button 
                              type="submit"
                              className={`text-xs font-medium px-2.5 py-1 rounded-md border transition-all ${
                                user.isAdmin 
                                  ? "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100" 
                                  : "bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100"
                              }`}
                            >
                              {user.isAdmin ? "Turunkan Admin" : "Jadikan Admin"}
                            </button>
                          </form>

                          <form action={toggleBadgeVerificationAction}>
                            <input type="hidden" name="userId" value={user._id} />
                            <input type="hidden" name="currentVerifiedStatus" value={String(user.isVerified)} />
                            <button 
                              type="submit"
                              className={`text-xs font-medium px-2.5 py-1 rounded-md border transition-all ${
                                user.isVerified 
                                  ? "bg-rose-50 text-rose-600 border-rose-200 hover:bg-rose-100" 
                                  : "bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100"
                              }`}
                            >
                              {user.isVerified ? "Hapus Centang" : "Beri Centang"}
                            </button>
                          </form>

                          <form action={toggleVerifyUserAction}>
                            <input type="hidden" name="userId" value={user._id} />
                            <input type="hidden" name="currentStatus" value={String(user.isNewUser)} />
                            <button 
                              type="submit"
                              className="text-xs font-medium px-2.5 py-1 rounded-md bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 transition-all"
                            >
                              {user.isNewUser ? "Aktifkan" : "Reset Status"}
                            </button>
                          </form>

                          <DeleteUserButton 
                            userId={user._id} 
                            userName={user.name} 
                            deleteAction={deleteUserAction} 
                          />
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* RESPONSIVE LAYOUT 2: Tampilan Mobile */}
          <div className="block md:hidden divide-y divide-slate-100">
            {processedUsers.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400 italic">
                Belum ada data pendaftar sistem di database...
              </div>
            ) : (
              processedUsers.map((user) => (
                <div key={user._id} className="p-4 space-y-4 hover:bg-slate-50/30 transition-colors">
                  
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-full bg-slate-800 text-white font-medium flex items-center justify-center text-xs uppercase shrink-0">
                        {user.name.substring(0, 2)}
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-medium text-slate-700 truncate text-sm flex items-center gap-1">
                          {user.name}
                          {user.isVerified && <i className="bx bxs-badge-check text-blue-500 text-xs"></i>}
                        </h4>
                        <p className="text-xs text-slate-400 font-mono truncate">{user.email}</p>
                      </div>
                    </div>
                    
                    <div className="shrink-0 flex flex-col gap-1 items-end">
                      {user.isAdmin && (
                        <span className="text-[9px] font-bold bg-red-50 text-red-700 px-1.5 py-0.5 rounded border border-red-200">Admin</span>
                      )}
                      <div className="flex gap-1">
                        {user.isVerified && (
                          <span className="text-[9px] font-medium bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded border border-blue-200">Badge</span>
                        )}
                        {user.isNewUser ? (
                          <span className="text-[9px] font-medium bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded border border-amber-200/50">New</span>
                        ) : (
                          <span className="text-[9px] font-medium bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded border border-emerald-200/50">Active</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 bg-slate-50 p-2.5 rounded-lg text-xs font-mono text-slate-500">
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase tracking-tight">Username</p>
                      <p className="text-slate-700 mt-0.5 truncate">@{user.username}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase tracking-tight">Koleksi Link</p>
                      <p className="text-slate-700 mt-0.5">{user.linkCount} Tautan</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 w-full pt-1">
                    
                    <form action={toggleAdminRoleAction} className="w-full">
                      <input type="hidden" name="userEmail" value={user.email} />
                      <input type="hidden" name="userName" value={user.name} />
                      <input type="hidden" name="isCurrentlyAdmin" value={String(user.isAdmin)} />
                      <button 
                        type="submit"
                        className={`w-full text-center text-[10px] sm:text-xs font-medium px-1 py-1.5 rounded-md border transition-all ${
                          user.isAdmin ? 'bg-amber-50 text-amber-700 border-amber-200':'bg-purple-50 text-purple-700 border-purple-200'
                        }`}
                      >
                        {user.isAdmin ? "Turunkan Admin" : "Jadikan Admin"}
                      </button>
                    </form>
                    
                    <form action={toggleBadgeVerificationAction} className="w-full">
                      <input type="hidden" name="userId" value={user._id} />
                      <input type="hidden" name="currentVerifiedStatus" value={String(user.isVerified)} />
                      <button 
                        type="submit" 
                        className={`w-full text-center text-[10px] sm:text-xs font-medium px-1 py-1.5 rounded-md border transition-all ${
                          user.isVerified ? 'bg-rose-50 text-rose-600 border-rose-200':'bg-blue-50 text-blue-600 border-blue-200'
                        }`}
                      >
                        {user.isVerified ? "Hapus Centang" : "Beri Centang"}
                      </button>
                    </form>

                    <form action={toggleVerifyUserAction} className="w-full">
                      <input type="hidden" name="userId" value={user._id} />
                      <input type="hidden" name="currentStatus" value={String(user.isNewUser)} />
                      <button 
                        type="submit"
                        className="w-full text-center text-[10px] sm:text-xs font-medium px-1 py-1.5 rounded-md bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 transition-all"
                      >
                        {user.isNewUser ? "Aktifkan" : "Reset"}
                      </button>
                    </form>

                    <div className="w-full [&>button]:w-full [&>button]:text-[10px] sm:[&>button]:text-xs [&>button]:py-1.5 [&>button]:px-1 [&>button]:rounded-md">
                      <DeleteUserButton 
                        userId={user._id} 
                        userName={user.name} 
                        deleteAction={deleteUserAction} 
                      />
                    </div>

                  </div>
                </div>
              ))
            )}
          </div>

        </div>
      </main>

    </div>
  );
}