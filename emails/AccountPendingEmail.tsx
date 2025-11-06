// emails/AccountPendingEmail.tsx
import React from 'react';

interface AccountPendingEmailProps {
  userName: string;
  email: string;
  submittedAt: string;
}

export const AccountPendingEmail: React.FC<AccountPendingEmailProps> = ({
  userName,
  email,
  submittedAt,
}) => {
  return (
    <html>
      <head>
        <style>{`
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; background: #f9fafb; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px 20px; text-align: center; border-radius: 12px 12px 0 0; }
          .logo { font-size: 32px; font-weight: bold; margin-bottom: 10px; }
          .content { background: white; padding: 40px 30px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
          .status-badge { display: inline-block; background: #fef3c7; color: #92400e; padding: 8px 16px; border-radius: 20px; font-weight: 600; font-size: 14px; margin: 20px 0; }
          .info-box { background: #eff6ff; border-left: 4px solid #3b82f6; padding: 20px; margin: 25px 0; border-radius: 6px; }
          .info-box h3 { margin-top: 0; color: #1e40af; }
          .timeline { margin: 30px 0; }
          .timeline-item { display: flex; gap: 15px; margin: 15px 0; }
          .timeline-icon { width: 30px; height: 30px; background: #e0e7ff; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
          .timeline-content { flex: 1; }
          .footer { text-align: center; padding: 30px 20px; color: #6b7280; font-size: 14px; }
          .contact-button { display: inline-block; background: #8b5cf6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; margin: 20px 0; font-weight: 600; }
          .divider { height: 1px; background: #e5e7eb; margin: 30px 0; }
        `}</style>
      </head>
      <body>
        <div className="container">
          <div className="header">
            <div className="logo">🎯 JobMate</div>
            <h1 style={{ margin: 0, fontSize: '28px' }}>Pengajuan Akun Diterima</h1>
          </div>
          
          <div className="content">
            <p style={{ fontSize: '18px', margin: '0 0 10px 0' }}>Halo {userName},</p>
            
            <p style={{ fontSize: '16px', color: '#4b5563', margin: '20px 0' }}>
              Terima kasih telah mengajukan akun di <strong>JobMate</strong>! 🎉
            </p>

            <div className="status-badge">
              ⏳ Status: Menunggu Verifikasi
            </div>
            
            <div className="info-box">
              <h3>📋 Detail Pengajuan</h3>
              <p style={{ margin: '5px 0' }}><strong>Nama:</strong> {userName}</p>
              <p style={{ margin: '5px 0' }}><strong>Email:</strong> {email}</p>
              <p style={{ margin: '5px 0' }}><strong>Waktu Pengajuan:</strong> {new Date(submittedAt).toLocaleString('id-ID', { 
                dateStyle: 'full',
                timeStyle: 'short'
              })}</p>
            </div>

            <div className="timeline">
              <h3 style={{ color: '#1f2937' }}>📍 Proses Selanjutnya:</h3>
              
              <div className="timeline-item">
                <div className="timeline-icon" style={{ background: '#10b981', color: 'white' }}>✓</div>
                <div className="timeline-content">
                  <strong>Pengajuan Diterima</strong>
                  <p style={{ margin: '5px 0 0 0', color: '#6b7280', fontSize: '14px' }}>
                    Kami telah menerima pengajuan akun Anda
                  </p>
                </div>
              </div>

              <div className="timeline-item">
                <div className="timeline-icon" style={{ background: '#fbbf24' }}>⏳</div>
                <div className="timeline-content">
                  <strong>Verifikasi Admin</strong>
                  <p style={{ margin: '5px 0 0 0', color: '#6b7280', fontSize: '14px' }}>
                    Tim kami sedang meninjau pengajuan Anda (1-2 hari kerja)
                  </p>
                </div>
              </div>

              <div className="timeline-item">
                <div className="timeline-icon">📧</div>
                <div className="timeline-content">
                  <strong>Notifikasi Persetujuan</strong>
                  <p style={{ margin: '5px 0 0 0', color: '#6b7280', fontSize: '14px' }}>
                    Anda akan menerima email konfirmasi setelah disetujui
                  </p>
                </div>
              </div>
            </div>

            <div className="divider"></div>

            <div style={{ textAlign: 'center', background: '#f9fafb', padding: '25px', borderRadius: '8px', margin: '25px 0' }}>
              <h3 style={{ margin: '0 0 10px 0', color: '#1f2937' }}>💡 Butuh Bantuan?</h3>
              <p style={{ margin: '10px 0', color: '#6b7280' }}>
                Jika ada pertanyaan atau ingin mempercepat proses verifikasi, hubungi kami:
              </p>
              <a href="https://t.me/jobmate_support" className="contact-button">
                💬 Hubungi Support
              </a>
            </div>

            <p style={{ fontSize: '14px', color: '#6b7280', margin: '30px 0 0 0', textAlign: 'center' }}>
              ⚡ <strong>Tips:</strong> Pastikan email Anda aktif untuk menerima notifikasi persetujuan.
            </p>
          </div>
          
          <div className="footer">
            <p style={{ margin: '5px 0' }}>📧 Email ini dikirim secara otomatis oleh sistem JobMate</p>
            <p style={{ margin: '5px 0' }}>Jangan membalas email ini</p>
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
export const AccountPendingEmailText = ({
  userName,
  email,
  submittedAt,
}: AccountPendingEmailProps) => `
JobMate - Pengajuan Akun Diterima
=====================================

Halo ${userName},

Terima kasih telah mengajukan akun di JobMate! 🎉

STATUS: Menunggu Verifikasi ⏳

Detail Pengajuan:
- Nama: ${userName}
- Email: ${email}
- Waktu Pengajuan: ${new Date(submittedAt).toLocaleString('id-ID')}

Proses Selanjutnya:
1. ✓ Pengajuan Diterima - Kami telah menerima pengajuan akun Anda
2. ⏳ Verifikasi Admin - Tim kami sedang meninjau (1-2 hari kerja)
3. 📧 Notifikasi Persetujuan - Anda akan menerima email konfirmasi

Butuh Bantuan?
Hubungi support kami: https://t.me/jobmate_support

Tips: Pastikan email Anda aktif untuk menerima notifikasi persetujuan.

---
Email ini dikirim secara otomatis oleh sistem JobMate
© 2025 JobMate - Platform Pencarian Kerja Terpercaya
`;
