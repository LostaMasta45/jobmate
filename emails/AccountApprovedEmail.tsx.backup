// emails/AccountApprovedEmail.tsx
import React from 'react';

interface AccountApprovedEmailProps {
  userName: string;
  email: string;
  approvedAt: string;
  loginUrl: string;
}

export const AccountApprovedEmail: React.FC<AccountApprovedEmailProps> = ({
  userName,
  email,
  approvedAt,
  loginUrl,
}) => {
  return (
    <html>
      <head>
        <style>{`
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; background: #f9fafb; }
          .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 50px 20px; text-align: center; border-radius: 12px 12px 0 0; }
          .logo { font-size: 32px; font-weight: bold; margin-bottom: 10px; }
          .success-icon { font-size: 64px; margin: 20px 0; }
          .content { background: white; padding: 40px 30px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
          .status-badge { display: inline-block; background: #d1fae5; color: #065f46; padding: 10px 20px; border-radius: 20px; font-weight: 600; font-size: 16px; margin: 20px 0; }
          .cta-button { display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 16px 40px; text-decoration: none; border-radius: 10px; margin: 25px 0; font-weight: 600; font-size: 18px; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3); }
          .feature-grid { display: grid; gap: 15px; margin: 30px 0; }
          .feature-item { display: flex; gap: 15px; padding: 15px; background: #f9fafb; border-radius: 8px; border-left: 4px solid #10b981; }
          .feature-icon { font-size: 24px; }
          .info-box { background: #eff6ff; border: 1px solid #bfdbfe; padding: 20px; margin: 25px 0; border-radius: 8px; }
          .footer { text-align: center; padding: 30px 20px; color: #6b7280; font-size: 14px; }
          .divider { height: 1px; background: #e5e7eb; margin: 30px 0; }
        `}</style>
      </head>
      <body>
        <div className="container">
          <div className="header">
            <div className="logo">🎯 JobMate</div>
            <div className="success-icon">🎉</div>
            <h1 style={{ margin: 0, fontSize: '32px' }}>Selamat! Akun Anda Disetujui</h1>
          </div>
          
          <div className="content">
            <div style={{ textAlign: 'center' }}>
              <div className="status-badge">
                ✅ Akun Telah Aktif
              </div>
            </div>

            <p style={{ fontSize: '18px', margin: '30px 0 10px 0' }}>Halo {userName},</p>
            
            <p style={{ fontSize: '16px', color: '#4b5563', lineHeight: 1.8 }}>
              Kabar gembira! 🎊 Pengajuan akun Anda telah <strong>disetujui</strong> oleh tim kami. 
              Sekarang Anda dapat mengakses semua fitur JobMate untuk mendukung pencarian kerja Anda.
            </p>

            <div className="info-box">
              <h3 style={{ margin: '0 0 15px 0', color: '#1e40af' }}>📋 Informasi Akun</h3>
              <p style={{ margin: '8px 0' }}><strong>Nama:</strong> {userName}</p>
              <p style={{ margin: '8px 0' }}><strong>Email:</strong> {email}</p>
              <p style={{ margin: '8px 0' }}><strong>Status:</strong> <span style={{ color: '#059669', fontWeight: 600 }}>Aktif ✓</span></p>
              <p style={{ margin: '8px 0' }}><strong>Disetujui pada:</strong> {new Date(approvedAt).toLocaleString('id-ID', { 
                dateStyle: 'full',
                timeStyle: 'short'
              })}</p>
            </div>

            <div style={{ textAlign: 'center', margin: '35px 0' }}>
              <a href={loginUrl} className="cta-button">
                🚀 Login Sekarang
              </a>
              <p style={{ fontSize: '14px', color: '#6b7280', margin: '15px 0 0 0' }}>
                Klik tombol di atas untuk mulai menggunakan JobMate
              </p>
            </div>

            <div className="divider"></div>

            <h3 style={{ color: '#1f2937', marginBottom: '20px' }}>🎁 Fitur yang Bisa Anda Akses:</h3>
            
            <div className="feature-grid">
              <div className="feature-item">
                <div className="feature-icon">💼</div>
                <div>
                  <strong style={{ color: '#1f2937' }}>Lowongan Kerja VIP</strong>
                  <p style={{ margin: '5px 0 0 0', color: '#6b7280', fontSize: '14px' }}>
                    Akses ribuan lowongan kerja terbaru di Jombang
                  </p>
                </div>
              </div>

              <div className="feature-item">
                <div className="feature-icon">🔖</div>
                <div>
                  <strong style={{ color: '#1f2937' }}>Simpan Loker Favorit</strong>
                  <p style={{ margin: '5px 0 0 0', color: '#6b7280', fontSize: '14px' }}>
                    Bookmark lowongan menarik untuk dilamar nanti
                  </p>
                </div>
              </div>

              <div className="feature-item">
                <div className="feature-icon">🏢</div>
                <div>
                  <strong style={{ color: '#1f2937' }}>Database Perusahaan</strong>
                  <p style={{ margin: '5px 0 0 0', color: '#6b7280', fontSize: '14px' }}>
                    Cari info lengkap tentang perusahaan di Jombang
                  </p>
                </div>
              </div>

              <div className="feature-item">
                <div className="feature-icon">🔔</div>
                <div>
                  <strong style={{ color: '#1f2937' }}>Notifikasi Real-time</strong>
                  <p style={{ margin: '5px 0 0 0', color: '#6b7280', fontSize: '14px' }}>
                    Dapatkan update lowongan kerja terbaru
                  </p>
                </div>
              </div>
            </div>

            <div style={{ background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)', padding: '25px', borderRadius: '10px', margin: '30px 0', textAlign: 'center' }}>
              <h3 style={{ margin: '0 0 10px 0', color: '#92400e' }}>⭐ Upgrade ke Premium?</h3>
              <p style={{ margin: '10px 0', color: '#78350f' }}>
                Dapatkan akses ke <strong>Tools JobMate</strong> untuk membuat CV ATS, Surat Lamaran AI, dan banyak lagi!
              </p>
              <a href="https://t.me/jobmate_support" style={{ display: 'inline-block', background: '#92400e', color: 'white', padding: '10px 25px', textDecoration: 'none', borderRadius: '8px', marginTop: '10px', fontWeight: 600 }}>
                💎 Info Upgrade Premium
              </a>
            </div>

            <p style={{ fontSize: '14px', color: '#6b7280', margin: '30px 0 0 0', textAlign: 'center', lineHeight: 1.8 }}>
              <strong>Selamat bergabung di JobMate!</strong><br/>
              Kami siap membantu Anda menemukan pekerjaan impian. 💪
            </p>
          </div>
          
          <div className="footer">
            <p style={{ margin: '5px 0' }}>📧 Email ini dikirim secara otomatis oleh sistem JobMate</p>
            <p style={{ margin: '5px 0' }}>Butuh bantuan? Hubungi: <a href="https://t.me/jobmate_support" style={{ color: '#3b82f6' }}>@jobmate_support</a></p>
            <p style={{ margin: '15px 0 0 0', fontSize: '12px', color: '#9ca3af' }}>
              © 2025 JobMate - Platform Pencarian Kerja Terpercaya
            </p>
          </div>
        </div>
      </body>
    </html>
  );
};

// Plain text version
export const AccountApprovedEmailText = ({
  userName,
  email,
  approvedAt,
  loginUrl,
}: AccountApprovedEmailProps) => `
JobMate - Selamat! Akun Anda Disetujui 🎉
=====================================

STATUS: Akun Telah Aktif ✅

Halo ${userName},

Kabar gembira! Pengajuan akun Anda telah DISETUJUI oleh tim kami.
Sekarang Anda dapat mengakses semua fitur JobMate.

Informasi Akun:
- Nama: ${userName}
- Email: ${email}
- Status: Aktif ✓
- Disetujui pada: ${new Date(approvedAt).toLocaleString('id-ID')}

LOGIN SEKARANG:
${loginUrl}

Fitur yang Bisa Anda Akses:
💼 Lowongan Kerja VIP - Akses ribuan lowongan kerja terbaru
🔖 Simpan Loker Favorit - Bookmark lowongan menarik
🏢 Database Perusahaan - Info lengkap perusahaan di Jombang
🔔 Notifikasi Real-time - Update lowongan terbaru

⭐ UPGRADE KE PREMIUM?
Dapatkan akses ke Tools JobMate: CV ATS, Surat Lamaran AI, dll
Info: https://t.me/jobmate_support

Selamat bergabung di JobMate!
Kami siap membantu Anda menemukan pekerjaan impian. 💪

---
Email ini dikirim secara otomatis oleh sistem JobMate
Butuh bantuan? Hubungi: @jobmate_support
© 2025 JobMate - Platform Pencarian Kerja Terpercaya
`;
