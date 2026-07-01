import { NextResponse } from "next/server";
import { Resend } from "resend";
import { connectDB } from "@/lib/db";
import { User } from "@/lib/models";

// Inisialisasi Resend dengan API Key dari .env
const resend = new Resend(process.env.RESEND_API_KEY);

// Fungsi mengambil data user RILL dari database MongoDB
async function getUsersFromDatabase(targetType: "all" | "selected", selectedIds?: string[]) {
  await connectDB();

  try {
    if (targetType === "all") {
      // Ambil semua user, hanya ambil field name dan email agar query ringan
      const users = await User.find({}, "name email").lean();
      return users.map((u: any) => ({
        id: String(u._id),
        email: String(u.email || ""),
        name: String(u.name || "User")
      }));
    }
    
    if (targetType === "selected" && selectedIds && selectedIds.length > 0) {
      // Ambil user berdasarkan array ID yang dipilih oleh admin
      const users = await User.find({ _id: { $in: selectedIds } }, "name email").lean();
      return users.map((u: any) => ({
        id: String(u._id),
        email: String(u.email || ""),
        name: String(u.name || "User")
      }));
    }
  } catch (err) {
    console.error("Gagal mengambil data user dari database:", err);
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

    // 2. Ambil list email target dari database rill
    const targetUsers = await getUsersFromDatabase(targetType, selectedUserIds);

    // Filter email kosong / tidak valid agar Resend tidak error saat batch sending
    const validTargetUsers = targetUsers.filter(user => user.email && user.email.includes("@"));

    if (validTargetUsers.length === 0) {
      return NextResponse.json({ error: "Tidak ada user tujuan dengan email valid yang ditemukan!" }, { status: 400 });
    }

    // 3. Render Elemen Isi Pesan secara Dinamis menjadi HTML Paragraph
    const renderedElementsHtml = contentElements
      .map((el: string) => `<p style="font-size: 15px; line-height: 1.6; color: #475569; margin-bottom: 14px; font-family: sans-serif;">${el.replace(/\n/g, '<br>')}</p>`)
      .join("");

    // 4. Render Tombol Kustom secara Dinamis jika diaktifkan oleh Admin
    const buttonHtml = hasButton && buttonUrl && buttonText
      ? `
        <div style="text-align: center; margin: 30px 0 15px 0;">
          <a href="${buttonUrl}" target="_blank" style="background-color: #3b82f6; color: #ffffff; padding: 12px 24px; font-weight: 600; text-decoration: none; border-radius: 6px; display: inline-block; font-size: 15px; font-family: sans-serif; box-shadow: 0 2px 4px rgba(59, 130, 246, 0.3);">
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

    // 6. Kelompokkan Data Kirim sesuai spesifikasi payload array koleksi Resend SDK
    const batchPayload = validTargetUsers.map(user => ({
      from: "Admin Resmi <admin@domainkamu.com>", // PENTING: Ganti dengan domain yang sudah verified/di-approve di dashboard Resend kamu!
      to: [user.email],
      subject: subject,
      html: mainHtmlTemplate,
    }));

    // 7. FIXED: Tembakkan langsung array objek payload ke resend.batch.send
    const { data, error } = await resend.batch.send(batchPayload);

    if (error) {
      console.error("Resend Batch Error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      message: `Pesan berhasil di-broadcast ke ${validTargetUsers.length} user!`,
      batchData: data 
    });

  } catch (error: any) {
    console.error("Broadcast Error:", error);
    return NextResponse.json({ error: "Gagal memproses broadcast email internal." }, { status: 500 });
  }
}