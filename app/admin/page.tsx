import { getServerSession } from "next-auth/next";
import { authOptions } from "../../lib/auth"; 
import { connectDB } from "../../lib/db"; 
import { User, SharedLink, AdminList } from "../../lib/models"; 
import Header from "../../components/layout/header"; 
import Footer from "../../components/layout/footer"; 
import { revalidatePath } from "next/cache";
// 1. IMPORT TOMBOL HAPUS BARU YANG SUDAH BERBASIS CLIENT
import DeleteUserButton from "../../components/ui/DeleteUserButton"; 

// Server Action untuk menghapus pengguna beserta tautannya
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
    await SharedLink.deleteMany({ username: userDoc.username });
    await User.findByIdAndDelete(userId);
  }

  revalidatePath("/admin");
}

// Server Action untuk verifikasi manual status pengguna baru
async function toggleVerifyUserAction(formData: FormData) {
  "use server";
  await connectDB();

  const session = await getServerSession(authOptions);
  if (!session?.user?.email) throw new Error("Akses tidak sah!");

  const checkAdmin = await AdminList.findOne({ email: session.user.email });
  if (!checkAdmin) throw new Error("Akses ditolak!");

  const userId = formData.get("userId") as string;
  const currentStatus = formData.get("currentStatus") === "true";

  await User.findByIdAndUpdate(userId, { isNewUser: !currentStatus });

  revalidatePath("/admin");
}

export default async function admin() {
  await connectDB();

  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return (
      <div className="min-h-screen flex items-center justify-center font-sans bg-gray-50 text-gray-500 text-sm">
        Silakan login terlebih dahulu untuk mengakses halaman ini.
      </div>
    );
  }

  const checkAdmin = await AdminList.findOne({ email: session.user.email }).lean();
  if (!checkAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center p-6 bg-gray-50 font-sans">
        <div className="space-y-2">
          <h1 className="text-2xl font-black text-red-600">Akses Ditolak!</h1>
          <p className="text-sm text-gray-500 max-w-sm">
            Email <span className="font-mono text-gray-800 font-semibold">{session.user.email}</span> tidak terdaftar sebagai Administrator.
          </p>
        </div>
      </div>
    );
  }

  const rawUsers = await User.find({}).lean();

  const processedUsers = await Promise.all(
    rawUsers.map(async (u: any) => {
      const linkCount = await SharedLink.countDocuments({ username: u.username });
      
      return {
        _id: String(u._id), 
        name: String(u.name || "User"),
        email: String(u.email || ""),
        username: String(u.username || "user"),
        bio: String(u.bio || ""),
        isNewUser: Boolean(u.isNewUser),
        hashtags: Array.isArray(u.hashtags) ? u.hashtags.map((tag: any) => String(tag)) : [],
        linkCount: Number(linkCount)
      };
    })
  );

  const totalActiveLinks = processedUsers.reduce((acc, curr) => acc + curr.linkCount, 0);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-900 font-sans">
      <Header />

      <main className="flex-grow max-w-5xl w-full mx-auto px-6 py-10">
        <div className="mb-6">
          <h1 className="text-2xl font-black tracking-tight text-gray-900 flex items-center gap-2">
            <i className="bx bx-shield-quarter text-blue-600"></i> Admin Panel
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Administrator Aktif: <span className="font-semibold text-gray-700">{String(checkAdmin.nama)}</span>
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center text-xl">
              <i className="bx bx-user"></i>
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Pengguna</p>
              <p className="text-xl font-black">{processedUsers.length}</p>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
            <div className="w-10 h-10 bg-green-50 text-green-600 rounded-lg flex items-center justify-center text-xl">
              <i className="bx bx-link-external"></i>
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Tautan Aktif</p>
              <p className="text-xl font-black">{totalActiveLinks}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                  <th className="p-4">Pengguna / Profil</th>
                  <th className="p-4">Username</th>
                  <th className="p-4">Verifikasi Akun</th>
                  <th className="p-4">Indikator Tautan</th>
                  <th className="p-4 text-center">Aksi Administrasi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {processedUsers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-xs text-gray-400 font-mono italic">
                      Belum ada data pendaftar di database...
                    </td>
                  </tr>
                ) : (
                  processedUsers.map((user) => (
                    <tr key={user._id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gray-900 text-white font-bold flex items-center justify-center text-xs uppercase flex-shrink-0">
                            {user.name.substring(0, 2)}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800 leading-tight">{user.name}</p>
                            <p className="text-xs text-gray-400 font-mono mt-0.5">{user.email}</p>
                          </div>
                        </div>
                      </td>

                      <td className="p-4 font-mono text-xs text-gray-600">
                        @{user.username}
                      </td>

                      <td className="p-4">
                        {user.isNewUser ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-amber-50 text-amber-700 px-2.5 py-1 rounded-full border border-amber-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                            Belum Setup
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-green-50 text-green-700 px-2.5 py-1 rounded-full border border-green-200">
                            <i className="bx bx-check-circle text-xs"></i>
                            Terverifikasi
                          </span>
                        )}
                      </td>

                      <td className="p-4">
                        {user.linkCount > 0 ? (
                          <div className="flex items-center gap-1.5 text-xs text-gray-700 font-medium">
                            <span className="w-2 h-2 rounded-full bg-green-500"></span>
                            <span>{user.linkCount} Link Aktif</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 text-xs text-gray-400">
                            <span className="w-2 h-2 rounded-full bg-gray-300"></span>
                            <span className="italic">Tidak Aktif</span>
                          </div>
                        )}
                      </td>

                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <form action={toggleVerifyUserAction}>
                            <input type="hidden" name="userId" value={user._id} />
                            <input type="hidden" name="currentStatus" value={String(user.isNewUser)} />
                            <button 
                              type="submit"
                              className={`text-xs font-semibold px-2.5 py-1.5 rounded-lg transition-all border ${
                                user.isNewUser 
                                  ? "bg-white text-gray-700 border-gray-200 hover:bg-gray-50" 
                                  : "bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-100"
                              }`}
                            >
                              {user.isNewUser ? "Verifikasi" : "Unverify"}
                            </button>
                          </form>

                          {/* 2. GUNAKAN COMPONENT BARU DI SINI */}
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
        </div>
      </main>

      <Footer />
    </div>
  );
}