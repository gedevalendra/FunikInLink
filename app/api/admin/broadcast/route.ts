import { NextResponse } from "next/server";
import { Resend } from "resend";

// Inisialisasi Resend dengan API Key dari .env
const resend = new Resend(process.env.RESEND_API_KEY);

// Simulasi fungsi mengambil data user dari Database (Ganti dengan ORM/Model database kamu, misal Prisma/Mongoose)
async function getUsersFromDatabase(targetType: "all" | "selected", selectedIds?: string[]) {
  // CONTOH MOCK DATA: Ganti bagian ini dengan query database asli kamu
  const mockUsers = [
    { id: "1", email: "user1@example.com", name: "User Satu" },
    { id: "2", email: "user2@example.com", name: "User Dua" },
    { id: "3", email: "user3@example.com", name: "User Tiga" },
  ];

  if (targetType === "all") {
    return mockUsers;
  }
  
  if (targetType === "selected" && selectedIds) {
    return mockUsers.filter(user => selectedIds.includes(user.id));
  }

  return [];
}

export async function POST(request: Request) {
  try {
    // Ambil semua data kustomisasi elemen dari halaman admin
    const { 
      targetType,      // "all" atau "selected"
      selectedUserIds, // Array ID jika memilih user tertentu
      subject,         // Subjek Email
      title,           // Judul Utama (Header)
      subtitle,        // Subjudul
      contentElements, // Array berisi baris teks/elemen isi pesan
      hasButton,       // Boolean: Apakah pakai tombol kustom?
      buttonText,      // Teks di dalam tombol
      buttonUrl        // URL tujuan tombol
    } = await request.json();

    // 1. Validasi Input Dasar
    if (!subject || !title || !contentElements || !Array.isArray(contentElements)) {
      return NextResponse.json({ error: "Elemen pesan wajib diisi lengkap!" }, { status: 400 });
    }

    // 2. Ambil list email target dari database
    const targetUsers = await getUsersFromDatabase(targetType, selectedUserIds);

    if (targetUsers.length === 0) {
      return NextResponse.json({ error: "Tidak ada user tujuan yang ditemukan!" }, { status: 400 });
    }

    // 3. Render Elemen Isi Pesan secara Dinamis menjadi HTML Paragraph
    const renderedElementsHtml = contentElements
      .map((el: string) => `<p style="font-size: 15px; line-height: 1.6; color: #475569; margin-bottom: 14px;">${el.replace(/\n/g, '<br>')}</p>`)
      .join("");

    // 4. Render Tombol Kustom secara Dinamis jika diaktifkan oleh Admin
    const buttonHtml = hasButton && buttonUrl && buttonText
      ? `
        <div style="text-align: center; margin: 30px 0 15px 0;">
          <a href="${buttonUrl}" target="_blank" style="background-color: #3b82f6; color: #ffffff; padding: 12px 24px; font-weight: 600; text-decoration: none; border-radius: 6px; display: inline-block; font-size: 15px; box-shadow: 0 2px 4px rgba(59, 130, 246, 0.3);">
            ${buttonText}
          </a>
        </div>
      `
      : "";

    // 5. Rakit Struktur Template Email Utama HTML
    const mainHtmlTemplate = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${subject}</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 20px;">
        <div style="max-width: 580px; margin: 0 auto; background-color: #ffffff; padding: 32px; border-radius: 12px; border: 1px solid #e2e8f0; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
          
          <div style="border-bottom: 1px solid #f1f5f9; padding-bottom: 16px; margin-bottom: 24px;">
            <h1 style="color: #0f172a; font-size: 24px; font-weight: 700; margin: 0 0 6px 0; line-height: 1.3;">${title}</h1>
            ${subtitle ? `<p style="color: #64748b; font-size: 14px; margin: 0; line-height: 1.4;">${subtitle}</p>` : ""}
          </div>

          <div style="margin-bottom: 24px;">
            ${renderedElementsHtml}
          </div>

          ${buttonHtml}

          <div style="margin-top: 40px; padding-top: 16px; border-top: 1px solid #f1f5f9; text-align: center; font-size: 12px; color: #94a3b8;">
            <p style="margin: 0 0 4px 0;">Pesan ini dikirimkan resmi oleh Admin dari aplikasi Anda.</p>
            <p style="margin: 0;">&copy; ${new Date().getFullYear()} Sistem Broadcast Hub</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // 6. Kelompokkan Data Kirim untuk Fitur Batch Sending Milik Resend
    // Resend mengizinkan pengiriman hingga 100 email berbeda dalam satu kali pemicuan API
    const batchPayload = targetUsers.map(user => ({
      from: "Admin Resmi <admin@domainkamu.com>", // Ganti dengan domain yang sudah kamu verifikasi di dashboard Resend
      to: [user.email],
      subject: subject,
      html: mainHtmlTemplate,
    }));

    // 7. Tembakkan ke Resend menggunakan batch.send
    const { data, error } = await resend.batches.send(batchPayload);

    if (error) {
      console.error("Resend Batch Error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      message: `Pesan berhasil di-broadcast ke ${targetUsers.length} user!`,
      batchData: data 
    });

  } catch (error: any) {
    console.error("Broadcast Error:", error);
    return NextResponse.json({ error: "Gagal memproses broadcast email internal." }, { status: 500 });
  }
}