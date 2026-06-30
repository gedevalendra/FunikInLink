import Header from "../../components/layout/header";
import Footer from "../../components/layout/footer";

export default function PrivacyPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-700 font-sans">
      <Header />
      
      <main className="flex-grow max-w-2xl w-full mx-auto px-6 py-16 space-y-10">
        <h1 className="text-3xl tracking-tight font-normal text-gray-700">
          Kebijakan Privasi
        </h1>

        <div className="space-y-3">
          <h2 className="text-lg font-normal text-gray-700">
            1. Pengumpulan Data
          </h2>
          <p className="text-sm leading-relaxed text-gray-600 font-normal">
            Saat Anda masuk menggunakan akun Google, sistem kami mencatat informasi dasar berupa nama dan alamat email Anda. Informasi tambahan berupa bio, tagar, dan tautan luar murni berasal dari data yang Anda masukkan sendiri.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-lg font-normal text-gray-700">
            2. Penggunaan Informasi
          </h2>
          <p className="text-sm leading-relaxed text-gray-600 font-normal">
            Seluruh informasi yang dikumpulkan digunakan secara eksklusif untuk menjalankan fungsionalitas halaman profil publik Anda, menjaga otentikasi sesi masuk, serta memproses pembaruan data yang Anda kelola.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-lg font-normal text-gray-700">
            3. Perlindungan Data
          </h2>
          <p className="text-sm leading-relaxed text-gray-600 font-normal">
            Kami berkomitmen penuh untuk melindungi privasi Anda. Data pribadi Anda disimpan secara aman dalam pangkalan data terenkripsi dan tidak akan pernah dijual atau dibagikan kepada pihak ketiga.
          </p>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}