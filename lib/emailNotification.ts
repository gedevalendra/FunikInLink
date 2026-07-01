import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

interface NotificationPayload {
  toEmail: string;
  userName: string;
  actionType: "delete" | "verify" | "unverify" | "admin_grant" | "admin_revoke" | "reset_active" | "reset_setup";
}

export async function sendAdminActionEmail({ toEmail, userName, actionType }: NotificationPayload) {
  if (!toEmail || !toEmail.includes("@")) return;

  let subject = "";
  let title = "";
  let message = "";
  
  // Variabel styling dinamis untuk status-box
  let statusText = "";
  let statusColor = "#2563eb"; // default biru
  let statusBg = "#eff6ff";    // default biru muda
  let statusBorder = "#bfdbfe"; // default border biru
  let boxiconName = "bx-info-circle"; // default icon

  // Penentuan konten, warna status box, dan icon boxicons
  switch (actionType) {
    case "delete":
      subject = "Pemberitahuan Penghapusan Akun FunikIn";
      title = "Akun Anda Telah Dihapus";
      message = `Halo ${userName},<br><br>Kami ingin menginformasikan bahwa akun Anda beserta seluruh data tautan yang terkait telah dihapus secara permanen dari sistem kami oleh Administrator. Jika Anda merasa ini adalah kesalahan, silakan hubungi tim dukungan kami.`;
      statusText = "Dihapus Permanen";
      statusColor = "#dc2626"; // merah
      statusBg = "#fef2f2";
      statusBorder = "#fecaca";
      boxiconName = "bx-trash";
      break;
    
    case "verify":
      subject = "Selamat! Akun Anda Telah Terverifikasi";
      title = "Lencana Verifikasi Aktif";
      message = `Halo ${userName},<br><br>Kabar gembira! Administrator baru saja memberikan lencana verifikasi ke akun profil Anda. Sekarang halaman profil Anda akan terlihat jauh lebih tepercaya bagi para pengunjung.`;
      statusText = "Terverifikasi (Verified)";
      statusColor = "#16a34a"; // hijau
      statusBg = "#f0fdf4";
      statusBorder = "#bbf7d0";
      boxiconName = "bx-badge-check";
      break;

    case "unverify":
      subject = "Pembaruan Status Verifikasi Akun Anda";
      title = "Status Verifikasi Dicabut";
      message = `Halo ${userName},<br><br>Kami ingin menginformasikan bahwa lencana verifikasi pada akun Anda telah dinonaktifkan oleh Administrator karena alasan penyesuaian kebijakan sistem.`;
      statusText = "Verifikasi Dicabut";
      statusColor = "#d97706"; // amber/oranye
      statusBg = "#fffbeb";
      statusBorder = "#fef3c7";
      boxiconName = "bx-x-circle";
      break;

    case "admin_grant":
      subject = "Jabatan Anda Diangkat Menjadi Administrator";
      title = "Selamat Datang di Tim Admin";
      message = `Halo ${userName},<br><br>Anda telah resmi diangkat menjadi Administrator oleh sistem. Sekarang Anda memiliki akses penuh ke halaman Admin Panel untuk mengelola pengguna dan memantau performa sistem global.`;
      statusText = "Akses Admin Aktif";
      statusColor = "#7c3aed"; // ungu
      statusBg = "#f5f3ff";
      statusBorder = "#ddd6fe";
      boxiconName = "bx-shield-quarter";
      break;

    case "admin_revoke":
      subject = "Pembaruan Role Akses Akun Anda";
      title = "Akses Admin Dinonaktifkan";
      message = `Halo ${userName},<br><br>Jabatan Administrator Anda telah dinonaktifkan oleh pemilik sistem. Status akun Anda kini telah kembali menjadi Standard User (Pengguna Biasa).`;
      statusText = "Kembali ke Standard User";
      statusColor = "#4b5563"; // abu-abu tua
      statusBg = "#f9fafb";
      statusBorder = "#e5e7eb";
      boxiconName = "bx-user";
      break;

    case "reset_active":
      subject = "Akun Anda Telah Diaktifkan Kembali";
      title = "Akun Anda Kini Aktif";
      message = `Halo ${userName},<br><br>Status onboarding akun Anda baru saja disetel ulang dan diaktifkan kembali oleh Administrator. Silakan masuk ke dashboard Anda untuk melanjutkan pengelolaan profil seperti biasa.`;
      statusText = "Akun Diaktifkan";
      statusColor = "#16a34a"; // hijau
      statusBg = "#f0fdf4";
      statusBorder = "#bbf7d0";
      boxiconName = "bx-check-shield";
      break;

    case "reset_setup":
      subject = "Status Profil Anda Disetel Ulang";
      title = "Permintaan Setup Ulang Profil";
      message = `Halo ${userName},<br><br>Administrator telah menyetel ulang status profil Anda menjadi akun baru (Reset Setup). Anda akan diminta untuk melakukan konfigurasi ulang atau langkah onboarding pada saat login berikutnya.`;
      statusText = "Butuh Setup Ulang";
      statusColor = "#2563eb"; // biru
      statusBg = "#eff6ff";
      statusBorder = "#bfdbfe";
      boxiconName = "bx-refresh";
      break;
  }

  const htmlTemplate = `
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
        .greeting { font-size: 17px; font-weight: 500; color: #171717; margin: 0 0 15px 0; }
        .message { font-size: 14px; line-height: 1.6; margin: 0 0 25px 0; color: #525252; }
        .welcome-box { background-color: ${statusBg}; border: 1px solid ${statusBorder}; border-radius: 8px; padding: 20px; text-align: center; margin-bottom: 25px; }
        .welcome-label { font-size: 10px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; color: #737373; margin-bottom: 8px; }
        .welcome-status { font-size: 18px; font-weight: 600; color: ${statusColor}; line-height: 1.4; margin: 0; display: inline-flex; items: center; gap: 6px; justify-content: center; }
        .warning-text { font-size: 12px; line-height: 1.5; color: #737373; margin: 0; padding-top: 20px; border-top: 1px solid #f5f5f5; }
        .footer { background-color: #171717; padding: 20px; text-align: center; }
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
            <h1 class="greeting">${title}</h1>
            <p class="message">${message}</p>
            
            <div class="welcome-box">
              <div class="welcome-label">Pembaruan Sistem</div>
              <div class="welcome-status">
                <i class="bx ${boxiconName}" style="font-size: 22px; vertical-align: middle;"></i>
                <span style="vertical-align: middle;">${statusText}</span>
              </div>
            </div>
            
            <p class="warning-text">Pesan ini dikirimkan secara otomatis oleh sistem manajemen internal karena adanya perubahan data pada akun Anda.</p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} FunikIn. Hak cipta dilindungi undang-undang.</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    await resend.emails.send({
      from: "Funikin <noreply@funikin.it.com>",
      to: [toEmail],
      subject: subject,
      html: htmlTemplate,
    });
  } catch (error) {
    console.error(`Gagal mengirim email notifikasi tindakan ke ${toEmail}:`, error);
  }
}