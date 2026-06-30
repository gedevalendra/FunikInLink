import Header from "../../components/layout/header";
import Footer from "../../components/layout/footer";

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-700 font-sans">
      
      <main className="flex-grow max-w-2xl w-full mx-auto px-6 py-16 space-y-8">
        <h1 className="text-3xl tracking-tight font-normal text-gray-700">
          Tentang FunikIn Link
        </h1>
        
        <p className="text-sm leading-relaxed text-gray-600 font-normal">
          FunikIn Link adalah platform penyedia halaman profil satu tautan yang dirancang untuk membantu mengelola seluruh portofolio digital Anda dalam satu wadah yang teratur.
        </p>

        <p className="text-sm leading-relaxed text-gray-600 font-normal">
          Kami berfokus pada kemudahan akses, kecepatan pemuatan halaman, serta antarmuka yang bersih agar para pengunjung dapat langsung tertuju pada informasi atau tautan penting yang Anda bagikan tanpa hambatan visual.
        </p>

        <div className="space-y-3 pt-4">
          <h2 className="text-lg font-normal text-gray-700">
            Layanan Kami
          </h2>
          <p className="text-sm leading-relaxed text-gray-600 font-normal">
            Platform ini menyediakan manajemen tautan instan, integrasi profil kustom, keamanan akses melalui autentikasi Google, serta optimasi performa halaman untuk kenyamanan penggunaan harian.
          </p>
        </div>
      </main>
      
    </div>
  );
}