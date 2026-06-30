import { getServerSession } from "next-auth/next";
import { authOptions } from "../../lib/auth"; // Sesuaikan path relative ke folder lib kamu
import { connectDB } from "../../lib/db"; 
import { Admin, SharedLink, AdminList } from "../../lib/models"; 
import Header from "../../components/layout/header"; 
import Footer from "../../components/layout/footer"; 
import { revalidatePath } from "next/cache";

// Server Action untuk Menghapus Pengguna
async function deleteUserAction(formData: FormData) {
  "use server";
  await connectDB();
  
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) throw new Error("Akses tidak sah!");
  
  const checkAdmin = await AdminList.findOne({ email: session.user.email });
  if (!checkAdmin) throw new Error("Akses ditolak!");

  const userId = formData.get("userId") as string;
  const userDoc = await Admin.findById(userId);
  
  if (userDoc) {
    // Hapus tautan dan profil pengguna
    await SharedLink.deleteMany({ username: userDoc.username });
    await Admin.findByIdAndDelete(userId);
  }

  revalidatePath("/admin");
}

export default async function AdminDashboardPage() {
  await connectDB();

  // 1. Ambil session user yang sedang aktif login
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return (
      <div className="min-h-screen flex items-center justify-center font-sans bg-gray-50 text-gray-500 text-sm">
        Silakan login terlebih dahulu untuk mengakses halaman ini.
      </div>
    );
  }

  // 2. Ambil koleksi AdminList untuk mencocokkan email login
  const checkAdmin = await AdminList.findOne({ email: session.user.email }).lean();
  
  // Jika email tidak terdaftar di AdminList, blokir akses halaman admin
  if (!checkAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center p-6 bg-gray-50 font-sans">
        <div className="space-y-2">
          <h1 className="text-2xl font-black text-red-600">Akses Ditolak!</h1>
          <p className="text-sm text-gray-500 max-w-sm">
            Email <span className="font-mono text-gray-800 font-semibold">{session.user.email}</span> tidak terdaftar sebagai Administrator pada sistem ini.
          </p>
        </div>
      </div>
    );
  }

  // 3. Ambil data seluruh user pendaftar
  const rawUsers = await Admin.find({}).lean();

  // 4. Transformasi data agar bebas dari error render Next.js (_id diubah ke String)
  const processedUsers = await Promise.all(
    rawUsers.map(async (u: any) => {
      const linkCount = await SharedLink.countDocuments({ username: u.username });
      return {
        _id: String(u._id), // PENTING: Mencegah crash komponen server
        name: String(u.name || "User"),
        email: String(u.email || ""),
        username: String(u.username || "user"),
        linkCount: Number(linkCount)
      };
    })
  );

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-900 font-sans">
      <Header />

      <main className="flex-grow max-w-4xl w-full mx-auto px-6 py-10">
        <div className="mb-6">
          <h1 className="text-2xl font-black tracking-tight text-gray-900 flex items-center gap-2">
            <i className="bx bx-shield-quarter text-blue-600"></i> Admin Panel
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Masuk sebagai Admin: <span className="font-semibold text-gray-700">{String(checkAdmin.nama)}</span>
          </p>
        </div>

        {/* Tabel Administrasi Pengguna */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                <th className="p-4">Nama / Email</th>
                <th className="p-4">Username</th>
                <th className="p-4">Jumlah Link</th>
                <th className="p-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {processedUsers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-xs text-gray-400 italic">
                    Belum ada pendaftar di database...
                  </td>
                </tr>
              ) : (
                processedUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-4">
                      <p className="font-semibold text-gray-800">{user.name}</p>
                      <p className="text-xs text-gray-400 font-mono">{user.email}</p>
                    </td>
                    <td className="p-4 font-mono text-xs text-gray-600">
                      @{user.username}
                    </td>
                    <td className="p-4 text-xs text-gray-600">
                      {user.linkCount} Tautan Aktif
                    </td>
                    <td className="p-4 text-center">
                      <form 
                        action={deleteUserAction} 
                        onSubmit={(e) => {
                          if(!confirm(`Hapus permanen akun ${user.name}?`)) e.preventDefault();
                        }}
                      >
                        <input type="hidden" name="userId" value={user._id} />
                        <button type="submit" className="text-xs text-red-600 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg font-medium transition-all">
                          Hapus
                        </button>
                      </form>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>

      <Footer />
    </div>
  );
}