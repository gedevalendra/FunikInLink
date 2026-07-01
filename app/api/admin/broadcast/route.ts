import { NextResponse } from "next/server";
import { Resend } from "resend";
import { connectDB } from "../../../../lib/db"; 
import { User } from "../../../../lib/models";  

const resend = new Resend(process.env.RESEND_API_KEY);

async function getUsersFromDatabase(targetType: "all" | "selected", selectedIds?: string[]) {
  await connectDB();
  try {
    if (targetType === "all") {
      const users = await User.find({}, "name email").lean();
      return users.map((u: any) => ({
        id: String(u._id),
        email: String(u.email || ""),
        name: String(u.name || "User")
      }));
    }
    
    if (targetType === "selected" && selectedIds && selectedIds.length > 0) {
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
    const { 
      targetType,      
      selectedUserIds, 
      subject,         
      title,           
      subtitle,        
      contentElements, 
      hasButton,       
      buttonText,      
      buttonUrl        
    } = await request.json();

    if (!subject || !title || !contentElements || !Array.isArray(contentElements)) {
      return NextResponse.json({ error: "Elemen pesan wajib diisi lengkap!" }, { status: 400 });
    }

    const targetUsers = await getUsersFromDatabase(targetType, selectedUserIds);
    const validTargetUsers = targetUsers.filter(user => user.email && user.email.includes("@"));

    if (validTargetUsers.length === 0) {
      return NextResponse.json({ error: "Tidak ada user tujuan dengan email valid yang ditemukan!" }, { status: 400 });
    }

    // Render Elemen Paragraf Dinamis
    const renderedElementsHtml = contentElements
      .map((el: string) => `<p class="message">${el.replace(/\n/g, '<br>')}</p>`)
      .join("");

    // Render Tombol Kustom Dinamis
    const buttonHtml = hasButton && buttonUrl && buttonText
      ? `
        <div style="text-align: center; margin: 25px 0 10px 0;">
          <a href="${buttonUrl}" target="_blank" class="action-btn">
            <i class="bx bx-link-external" style="font-size: 16px; margin-right: 4px; vertical-align: middle;"></i>
            <span style="vertical-align: middle;">${buttonText}</span>
          </a>
        </div>
      `
      : "";

    // Rakit Struktur Template Email Utama HTML (max-width: 480px)
    const mainHtmlTemplate = `
      <!DOCTYPE html>
      <html lang="id">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${subject}</title>
        <link href="https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css" rel="stylesheet">
        <style>
          body { margin: 0; padding: 0; background-color: #ffffff; font-family: 'Helvetica Neue', Helvetica, Roboto, Arial, sans-serif; color: #525252; -webkit-font-smoothing: antialiased; }
          .wrapper { width: 100%; table-layout: fixed; background-color: #ffffff; padding: 40px 20px; box-sizing: border-box; }
          .container { max-width: 480px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e5e5e5; border-radius: 8px; overflow: hidden; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.03); }
          .header-banner { background-color: #fafafa; padding: 22px; text-align: center; border-bottom: 1px solid #e5e5e5; }
          .logo-placeholder { font-size: 19px; font-weight: bold; color: #171717; letter-spacing: -0.5px; }
          .logo-placeholder span { color: #eab308; }
          .content-body { padding: 35px 35px 25px; }
          .greeting-box { border-bottom: 1px solid #f5f5f5; padding-bottom: 15px; margin-bottom: 20px; }
          .greeting { font-size: 18px; font-weight: 600; color: #171717; margin: 0 0 4px 0; }
          .subtitle { font-size: 13px; color: #737373; margin: 0; }
          .message { font-size: 14px; line-height: 1.6; margin: 0 0 16px 0; color: #525252; }
          .action-btn { background-color: #171717; color: #ffffff !important; padding: 11px 20px; font-weight: 500; text-decoration: none; border-radius: 6px; display: inline-block; font-size: 13px; }
          .footer { background-color: #171717; padding: 20px; text-align: center; margin-top: 15px; }
          .footer p { margin: 0; font-size: 11px; color: #737373; }
        </style>
      </head>
      <body>
        <div class="wrapper">
          <div class="container">
            <div class="header-banner">
              <div class="logo-placeholder">Funik<span>In</span>.</div>
            </div>
            <div class="content-body">
              <div class="greeting-box">
                <h1 class="greeting">${title}</h1>
                ${subtitle ? `<p class="subtitle">${subtitle}</p>` : ""}
              </div>
              
              <div>
                ${renderedElementsHtml}
              </div>
              
              ${buttonHtml}
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} FunikIn. Hak cipta dilindungi undang-undang.</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    const batchPayload = validTargetUsers.map(user => ({
      from: "Funikin <noreply@funikin.it.com>", 
      to: [user.email],
      subject: subject,
      html: mainHtmlTemplate,
    }));

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
    return NextResponse.json({ error: "Gagal memproses broadcast email." }, { status: 500 });
  }
}