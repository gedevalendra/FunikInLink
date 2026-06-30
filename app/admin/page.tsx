import { getServerSession } from "next-auth/next";
import { authOptions } from "../../lib/auth";
import { connectDB } from "../../lib/db";
import { Admin, SharedLink, AdminList } from "../../lib/models";
import Header from "../../components/layout/header";
import Footer from "../../components/layout/footer";
import { revalidatePath } from "next/cache";

// Server Action untuk menghapus user dan link-linknya
async function deleteUserAction(formData: FormData) {
  "use server";
  await connectDB();
  
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) throw new Error("Unauthorized");
  
  // Keamanan ganda: pastikan yang mengeksekusi beneran admin
  const checkAdmin = await AdminList.findOne({ email: session.user.email });
  if (!checkAdmin) throw new Error("Forbidden");

  const userId = formData.get("userId") as string;
  
  // Ambil data user terlebih dahulu untuk tahu username-nya sebelum dihapus
  const userDoc = await Admin.findById(userId);
  if (userDoc) {
    // 1. Hapus semua link yang dimiliki user ini
    await SharedLink.deleteMany({ username: userDoc.username });
    // 2. Hapus user dari collection Admin
    await Admin.findByIdAndDelete(userId);
  }

  revalidatePath("/admin");
}

export default async function AdminDashboardPage() {
  await connectDB();

  // 1. Validasi Akses Admin
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return <div className="min-h-screen flex items-center justify-center font-mono">Silakan login terlebih dahulu.</div>;
  }

  const checkAdmin = await AdminList.findOne({ email: session.user.email });
  if (!checkAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center p-4">
        <div>
          <h1 className="text-2xl font-bold text-red-600">Akses Ditolak!</h1>
          <p className="text-sm text-gray-500 mt-1">Halaman ini hanya ditujukan khusus untuk Administrator.</p>
        </div>
      </div>
    );
  }

  // 2. Ambil seluruh data user dari database
  const allUsers = await Admin.find({}).lean();

  // 3. Ambil statistik jumlah link per user untuk indikator keaktifan dasar
  // (Di sini kita hitung apakah user punya link aktif atau profilnya kosong/tidak diurus)
  const usersWithLinkCount = await Promise.all(
    allUsers.map(async (user: any) => {
      const linkCount = await SharedLink.countDocuments({ username: user.username });
      return {
        ...user,
        _id: user._id.toString(),
        linkCount,
      };
    })
  );

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-900 font-sans">
      <Header />

      <main className="flex-grow max-w-5xl w-full mx-auto px-6 py-10">
        <div className="mb-6">
          <h1 className="text-2xl font-black tracking-tight text-gray-900 flex items-center gap-2">
            <i className="bx bx-shield-quarter text-blue-600"></i> Admin Panel
          </h1>
          <p className="text-xs text-gray-500">Kelola kredensial pengguna, verifikasi status, dan moderasi tautan aplikasi FunikIn.</p>
        </div>

        {/* Kartu Ringkasan Statistik */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center text-xl">
              <i className="bx bx-user"></i>
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase">Total Pengguna</p>
              <p className="text-xl font-black">{allUsers.length}</p>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
            <div className="w-10 h-10 bg-green-50 text-green-600 rounded-lg flex items-center justify-center text-xl">
              <i className="bx bx-link-external"></i>
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase">Total Tautan Dibuat</p>
              <p className="text-xl font-black">
                {usersWithLinkCount.reduce((acc, curr) => acc + curr.linkCount, 0)}
              </p>
            </div>
          </div>
        </div>

        {/* Tabel Utama Daftar User */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                  <th className="p-4">Pengguna / Profile</th>
                  <th className="p-4">Username</th>
                  <th className="p-4">Status Akun</th>
                  <th className="p-4">Indikator Tautan</th>
                  <th className="p-4 text-center">Aksi Administrasi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {usersWithLinkCount.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-xs text-gray-400 font-mono italic">
                      Belum ada pendaftar user di database...
                    </td>
                  </tr>
                ) : (
                  usersWithLinkCount.map((user) => (
                    <tr key={user._id} className="hover:bg-gray-50/50 transition-colors">
                      {/* Kolom Nama & Email */}
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gray-900 text-white font-bold flex items-center justify-center text-xs uppercase">
                            {user.name.substring(0, 2)}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800 leading-tight">{user.name}</p>
                            <p className="text-xs text-gray-400 font-mono mt-0.5">{user.email}</p>
                          </div>
                        </div>
                      </td>

                      {/* Kolom Username kustom */}
                      <td className="p-4 font-mono text-xs text-gray-600">
                        @{user.username}
                      </td>

                      {/* Kolom Status Akun (isNewUser) */}
                      <td className="p-4">
                        {user.isNewUser ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full border border-amber-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                            Belum Setup
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-green-50 text-green-700 px-2 py-0.5 rounded-full border border-green-200">
                            <i className="bx bx-check-circle text-xs"></i>
                            Terverifikasi
                          </span>
                        )}
                      </td>

                      {/* Kolom Indikator Keaktifan Link */}
                      <td className="p-4">
                        {user.linkCount > 0 ? (
                          <div className="flex items-center gap-1.5 text-xs text-gray-700 font-medium">
                            <span className="w-2 h-2 rounded-full bg-green-500"></span>
                            <span>{user.linkCount} Link Aktif</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 text-xs text-gray-400">
                            <span className="w-2 h-2 rounded-full bg-gray-300"></span>
                            <span className="italic">Kosong</span>
                          </div>
                        )}
                      </td>

                      {/* Kolom Tombol Hapus Aksi */}
                      <td className="p-4 text-center">
                        <form action={deleteUserAction} onSubmit={(e) => {
                          if(!confirm(`Apakah kamu yakin ingin menghapus user ${user.name}? Semua tautan miliknya juga akan hilang permanen!`)) {
                            e.preventDefault();
                          }
                        }}>
                          <input type="hidden" name="userId" value={user._id} />
                          <button 
                            type="submit" 
                            className="text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 hover:text-red-700 px-3 py-1.5 rounded-lg transition-all active:scale-95"
                          >
                            <i className="bx bx-trash-alt mr-1"></i> Hapus
                          </button>
                        </form>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}