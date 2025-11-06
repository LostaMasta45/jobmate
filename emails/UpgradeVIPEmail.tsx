// emails/UpgradeVIPEmail.tsx - Simplified version with minimal inline styles
import React from 'react';

interface UpgradeVIPEmailProps {
  userName: string;
  email: string;
  membershipType: 'vip_basic' | 'vip_premium';
  upgradedAt: string;
  dashboardUrl: string;
}

export const UpgradeVIPEmail: React.FC<UpgradeVIPEmailProps> = ({
  userName,
  email,
  membershipType,
  upgradedAt,
  dashboardUrl,
}) => {
  const isPremium = membershipType === 'vip_premium';
  const membershipName = isPremium ? 'VIP Premium' : 'VIP Basic';
  
  return (
    <html>
      <head>
        <style>{`
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; background: #f9fafb; }
          .header-basic { background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); color: white; padding: 50px 20px; text-align: center; border-radius: 12px 12px 0 0; }
          .header-premium { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; padding: 50px 20px; text-align: center; border-radius: 12px 12px 0 0; }
          .logo { font-size: 32px; font-weight: bold; margin-bottom: 10px; }
          .crown-icon { font-size: 80px; margin: 20px 0; }
          .content { background: white; padding: 40px 30px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
          .badge-basic { display: inline-block; background: #dbeafe; color: #1e40af; padding: 12px 24px; border-radius: 25px; font-weight: 700; font-size: 18px; margin: 20px 0; border: 2px solid #1e40af; }
          .badge-premium { display: inline-block; background: #fef3c7; color: #92400e; padding: 12px 24px; border-radius: 25px; font-weight: 700; font-size: 18px; margin: 20px 0; border: 2px solid #92400e; }
          .cta-button-basic { display: inline-block; background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); color: white; padding: 16px 40px; text-decoration: none; border-radius: 10px; margin: 25px 0; font-weight: 600; font-size: 18px; }
          .cta-button-premium { display: inline-block; background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; padding: 16px 40px; text-decoration: none; border-radius: 10px; margin: 25px 0; font-weight: 600; font-size: 18px; }
          .benefit-item { display: flex; gap: 15px; padding: 18px; background: #f9fafb; border-radius: 10px; margin: 12px 0; }
          .benefit-item-basic { border-left: 4px solid #3b82f6; }
          .benefit-item-premium { border-left: 4px solid #f59e0b; }
          .benefit-icon { font-size: 28px; }
          .premium-box { background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); padding: 20px; border-radius: 10px; margin: 15px 0; border: 2px dashed #f59e0b; }
          .info-box { background: #eff6ff; border: 1px solid #bfdbfe; padding: 20px; margin: 25px 0; border-radius: 8px; }
          .footer { text-align: center; padding: 30px 20px; color: #6b7280; font-size: 14px; }
          h1 { margin: 0; font-size: 32px; }
          h3 { color: #1f2937; }
        `}</style>
      </head>
      <body>
        <div className="container">
          <div className={isPremium ? 'header-premium' : 'header-basic'}>
            <div className="logo">🎯 JobMate</div>
            <div className="crown-icon">{isPremium ? '👑' : '⭐'}</div>
            <h1>Selamat Upgrade ke<br/>{membershipName}!</h1>
          </div>
          
          <div className="content">
            <div style={{ textAlign: 'center' }}>
              <div className={isPremium ? 'badge-premium' : 'badge-basic'}>
                {isPremium ? '👑' : '⭐'} {membershipName.toUpperCase()}
              </div>
            </div>

            <p><strong>Halo {userName},</strong></p>
            
            <p>
              <strong>Luar biasa!</strong> ✨ Akun Anda telah berhasil di-upgrade ke <strong>{membershipName}</strong>. 
              Sekarang Anda memiliki akses penuh ke fitur-fitur premium yang akan mempercepat pencarian kerja Anda!
            </p>

            <div className="info-box">
              <h3>📋 Detail Membership</h3>
              <p><strong>Nama:</strong> {userName}</p>
              <p><strong>Email:</strong> {email}</p>
              <p><strong>Status:</strong> <strong>{membershipName}</strong> {isPremium ? '👑' : '⭐'}</p>
              <p><strong>Di-upgrade pada:</strong> {new Date(upgradedAt).toLocaleString('id-ID', { 
                dateStyle: 'full',
                timeStyle: 'short'
              })}</p>
            </div>

            <div style={{ textAlign: 'center', margin: '35px 0' }}>
              <a href={dashboardUrl} className={isPremium ? 'cta-button-premium' : 'cta-button-basic'}>
                🚀 Mulai Gunakan Fitur {membershipName}
              </a>
            </div>

            <h3>🎁 Benefit {membershipName} Anda:</h3>
            
            <div className={`benefit-item ${isPremium ? 'benefit-item-premium' : 'benefit-item-basic'}`}>
              <div className="benefit-icon">💼</div>
              <div>
                <strong>Akses Penuh Lowongan VIP</strong>
                <p>Lihat semua lowongan kerja eksklusif tanpa batas</p>
              </div>
            </div>

            <div className={`benefit-item ${isPremium ? 'benefit-item-premium' : 'benefit-item-basic'}`}>
              <div className="benefit-icon">🔖</div>
              <div>
                <strong>Unlimited Bookmark</strong>
                <p>Simpan sebanyak mungkin lowongan favorit</p>
              </div>
            </div>

            <div className={`benefit-item ${isPremium ? 'benefit-item-premium' : 'benefit-item-basic'}`}>
              <div className="benefit-icon">🏢</div>
              <div>
                <strong>Database Perusahaan Lengkap</strong>
                <p>Info detail perusahaan & budaya kerja</p>
              </div>
            </div>

            <div className={`benefit-item ${isPremium ? 'benefit-item-premium' : 'benefit-item-basic'}`}>
              <div className="benefit-icon">🔔</div>
              <div>
                <strong>Priority Notifications</strong>
                <p>Dapatkan alert lowongan baru paling cepat</p>
              </div>
            </div>

            {isPremium && (
              <div className="premium-box">
                <h4 style={{ margin: '0 0 15px 0', color: '#92400e' }}>⚡ BONUS FITUR PREMIUM:</h4>
                
                <div className="benefit-item" style={{ background: 'white' }}>
                  <div className="benefit-icon">📝</div>
                  <div>
                    <strong>Surat Lamaran AI</strong>
                    <p>Generate surat lamaran profesional dengan AI</p>
                  </div>
                </div>

                <div className="benefit-item" style={{ background: 'white' }}>
                  <div className="benefit-icon">🎨</div>
                  <div>
                    <strong>CV ATS Optimizer</strong>
                    <p>Buat CV yang lolos sistem ATS perusahaan</p>
                  </div>
                </div>

                <div className="benefit-item" style={{ background: 'white' }}>
                  <div className="benefit-icon">📧</div>
                  <div>
                    <strong>Email Generator</strong>
                    <p>Template email follow-up & networking</p>
                  </div>
                </div>

                <div className="benefit-item" style={{ background: 'white' }}>
                  <div className="benefit-icon">📊</div>
                  <div>
                    <strong>Job Tracker</strong>
                    <p>Kelola semua lamaran Anda dalam satu dashboard</p>
                  </div>
                </div>

                <div className="benefit-item" style={{ background: 'white' }}>
                  <div className="benefit-icon">📄</div>
                  <div>
                    <strong>PDF Tools Premium</strong>
                    <p>Merge, split, dan edit PDF untuk berkas lamaran</p>
                  </div>
                </div>

                <div className="benefit-item" style={{ background: 'white' }}>
                  <div className="benefit-icon">💬</div>
                  <div>
                    <strong>WA Message Generator</strong>
                    <p>Template pesan WhatsApp profesional</p>
                  </div>
                </div>
              </div>
            )}

            {!isPremium && (
              <div style={{ background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)', padding: '25px', borderRadius: '10px', margin: '30px 0', textAlign: 'center', border: '2px dashed #f59e0b' }}>
                <h3 style={{ margin: '0 0 10px 0', color: '#92400e' }}>👑 Mau Upgrade ke Premium?</h3>
                <p>Dapatkan akses ke <strong>6 Tools JobMate</strong> untuk maksimalkan peluang diterima kerja!</p>
                <a href="https://t.me/jobmate_support" style={{ display: 'inline-block', background: '#f59e0b', color: 'white', padding: '12px 30px', textDecoration: 'none', borderRadius: '8px', marginTop: '10px', fontWeight: 600 }}>
                  💎 Info Upgrade Premium
                </a>
              </div>
            )}

            <p style={{ fontSize: '14px', color: '#6b7280', marginTop: '30px', textAlign: 'center' }}>
              <strong>Selamat menikmati fitur {membershipName}!</strong><br/>
              Semoga segera mendapatkan pekerjaan impian Anda. 🎯💼
            </p>
          </div>
          
          <div className="footer">
            <p>📧 Email ini dikirim secara otomatis oleh sistem JobMate</p>
            <p>Butuh bantuan? Hubungi: <a href="https://t.me/jobmate_support" style={{ color: '#3b82f6' }}>@jobmate_support</a></p>
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
export const UpgradeVIPEmailText = ({
  userName,
  email,
  membershipType,
  upgradedAt,
  dashboardUrl,
}: UpgradeVIPEmailProps) => {
  const isPremium = membershipType === 'vip_premium';
  const membershipName = isPremium ? 'VIP Premium 👑' : 'VIP Basic ⭐';

  return `
JobMate - Selamat Upgrade ke ${membershipName}!
=====================================

${isPremium ? '👑' : '⭐'} STATUS: ${membershipName.toUpperCase()}

Halo ${userName},

Luar biasa! ✨ Akun Anda telah berhasil di-upgrade ke ${membershipName}.
Sekarang Anda memiliki akses penuh ke fitur-fitur premium!

Detail Membership:
- Nama: ${userName}
- Email: ${email}
- Status: ${membershipName}
- Di-upgrade pada: ${new Date(upgradedAt).toLocaleString('id-ID')}

MULAI GUNAKAN FITUR:
${dashboardUrl}

Benefit ${membershipName} Anda:
💼 Akses Penuh Lowongan VIP - Lihat semua lowongan eksklusif
🔖 Unlimited Bookmark - Simpan lowongan favorit tanpa batas
🏢 Database Perusahaan Lengkap - Info detail perusahaan
🔔 Priority Notifications - Alert lowongan baru paling cepat

${isPremium ? `
⚡ BONUS FITUR PREMIUM:
📝 Surat Lamaran AI - Generate surat lamaran profesional
🎨 CV ATS Optimizer - Buat CV yang lolos ATS
📧 Email Generator - Template email follow-up
📊 Job Tracker - Kelola semua lamaran Anda
📄 PDF Tools Premium - Edit PDF untuk berkas lamaran
💬 WA Message Generator - Template WhatsApp profesional
` : `
👑 MAU UPGRADE KE PREMIUM?
Dapatkan akses ke 6 Tools JobMate untuk maksimalkan peluang diterima!
Info: https://t.me/jobmate_support
`}

Selamat menikmati fitur ${membershipName}!
Semoga segera mendapatkan pekerjaan impian Anda. 🎯💼

---
Email ini dikirim secara otomatis oleh sistem JobMate
Butuh bantuan? Hubungi: @jobmate_support
© 2025 JobMate - Platform Pencarian Kerja Terpercaya
`;
};
