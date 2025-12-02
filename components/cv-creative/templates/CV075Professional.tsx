import React from 'react';
import { CreativeCV } from '@/lib/schemas/cv-creative';
import { Basics } from '@/lib/schemas/cv-ats';

interface CV075ProfessionalProps {
  cv: Partial<CreativeCV>;
}

// Photo component with yellow background
const PhotoComponent = ({ photoUrl, size = 140 }: { photoUrl?: string | null; size?: number }) => {
  if (!photoUrl) return null;
  
  return (
    <div
      style={{
        width: `${size}px`,
        height: `${size}px`,
        backgroundColor: '#FFD700',
        borderRadius: '12px',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '20pt',
      }}
    >
      <img
        src={photoUrl}
        alt="Profile"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
      />
    </div>
  );
};

// Progress Bar Component
const ProgressBar = ({ label, level = 80 }: { label: string; level?: number }) => {
  return (
    <div style={{ marginBottom: '8pt' }}>
      <div style={{ 
        fontSize: '9pt', 
        marginBottom: '3pt',
        color: '#1e293b',
      }}>
        {label}
      </div>
      <div style={{ 
        width: '100%', 
        height: '6pt', 
        backgroundColor: '#e5e7eb',
        borderRadius: '3pt',
        overflow: 'hidden',
      }}>
        <div style={{ 
          width: `${level}%`, 
          height: '100%', 
          backgroundColor: '#FFD700',
          borderRadius: '3pt',
        }} />
      </div>
    </div>
  );
};

// Section Header Component
const SectionHeader = ({ title, color = '#4A7BA7' }: { title: string; color?: string }) => {
  return (
    <h2 style={{ 
      fontSize: '13pt', 
      fontWeight: '700',
      color: color,
      textTransform: 'uppercase',
      marginBottom: '10pt',
      marginTop: '0',
      letterSpacing: '1px',
    }}>
      {title}
    </h2>
  );
};

export function CV075Professional({ cv }: CV075ProfessionalProps) {
  const basics: Partial<Basics> = cv.content?.basics || {};
  const summary = cv.content?.summary || '';
  const experiences = cv.content?.experiences || [];
  const education = cv.content?.education || [];
  const skills = cv.content?.skills || [];
  
  const primaryColor = cv.colorScheme?.primary || '#5B8DBE';
  const secondaryColor = cv.colorScheme?.secondary || '#4A7BA7';
  const accentColor = cv.colorScheme?.accent || '#FFD700';

  return (
    <div className="cv-template" style={{ 
      width: '210mm', 
      minHeight: '297mm',
      backgroundColor: '#ffffff',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: "'Segoe UI', 'Arial', sans-serif",
    }}>
      {/* HEADER BIRU - Full Width */}
      <div style={{ 
        backgroundColor: primaryColor,
        color: '#ffffff',
        padding: '18mm 20mm 18mm 20mm',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '15mm',
        position: 'relative',
        minHeight: '65mm',
      }}>
        {/* Vertical Name & Headline */}
        <div style={{
          writingMode: 'vertical-rl',
          textOrientation: 'mixed',
          transform: 'rotate(180deg)',
          display: 'flex',
          flexDirection: 'column',
          gap: '8pt',
          flexShrink: 0,
        }}>
          <h1 style={{ 
            fontSize: '18pt',
            fontWeight: '700',
            margin: '0',
            letterSpacing: '3px',
            textTransform: 'uppercase',
            whiteSpace: 'nowrap',
          }}>
            {`${basics.firstName || ''} ${basics.lastName || ''}`.trim() || 'CATHALINA SETYA PUTRI WARDANI'}
          </h1>
        </div>

        {/* Summary Text */}
        <div style={{ flex: 1, paddingTop: '8pt' }}>
          <p style={{ 
            fontSize: '8pt',
            lineHeight: '1.5',
            margin: '0',
            textAlign: 'justify',
          }}>
            {summary || 'Saya seorang fresh graduate yang memiliki minat besar dalam bekerja di bidang angka, saya merupakan pribadi yang eMR, mengikuti dan percaya diri. Saya merupakan lulusan terbaik dari universitas. Menezima bisnis Indonesia, program study Bam Manajemen Bisnis Digital, Saya mampu mengoperasikan microsoft office dengan baik. Saya juga bekerja secara tim maupun individual, dan telah dibuktikan dengan pengalaman saat kuliah.'}
          </p>
        </div>

        {/* Photo & Contact Box */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '10pt',
          flexShrink: 0,
        }}>
          {/* Photo with yellow background */}
          <div style={{
            width: '100pt',
            height: '120pt',
            backgroundColor: accentColor,
            borderRadius: '10pt',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            {cv.photoUrl ? (
              <img
                src={cv.photoUrl}
                alt="Profile"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            ) : (
              <div style={{ fontSize: '40pt', color: '#ffffff' }}>👤</div>
            )}
          </div>

          {/* Contact Info */}
          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.15)',
            padding: '8pt',
            borderRadius: '6pt',
            fontSize: '7pt',
            lineHeight: '1.6',
            width: '100pt',
          }}>
            <div style={{ 
              fontWeight: '700',
              marginBottom: '5pt',
              fontSize: '8pt',
              letterSpacing: '1px',
            }}>
              KONTAK
            </div>
            {basics.phone && (
              <div style={{ marginBottom: '3pt', display: 'flex', alignItems: 'center', gap: '4pt' }}>
                <span>📞</span>
                <span>{basics.phone}</span>
              </div>
            )}
            {basics.email && (
              <div style={{ marginBottom: '3pt', display: 'flex', alignItems: 'center', gap: '4pt', wordBreak: 'break-all' }}>
                <span>📧</span>
                <span>{basics.email}</span>
              </div>
            )}
            {basics.linkedin && (
              <div style={{ marginBottom: '3pt', display: 'flex', alignItems: 'center', gap: '4pt', wordBreak: 'break-all' }}>
                <span>🔗</span>
                <span style={{ fontSize: '6pt' }}>{basics.linkedin}</span>
              </div>
            )}
            {basics.address && (
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '4pt' }}>
                <span>📍</span>
                <span>{basics.address}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* BODY - Two Columns */}
      <div style={{ 
        display: 'flex',
        flex: 1,
      }}>
        {/* LEFT COLUMN - White Background (65%) */}
        <div style={{ 
          width: '65%',
          padding: '15mm 12mm 15mm 20mm',
          backgroundColor: '#ffffff',
        }}>
          {/* PENGALAMAN Section */}
          {experiences.length > 0 && (
            <div style={{ marginBottom: '20pt' }}>
              <SectionHeader title="PENGALAMAN KERJA" color={primaryColor} />
              {experiences.map((exp, idx) => (
                <div key={idx} style={{ marginBottom: '15pt', position: 'relative' }}>
                  {/* Timeline vertical line */}
                  <div style={{
                    position: 'absolute',
                    left: '-8pt',
                    top: '4pt',
                    bottom: 0,
                    width: '1px',
                    backgroundColor: '#e2e8f0',
                    display: idx === experiences.length - 1 ? 'none' : 'block'
                  }} />
                  
                  <div style={{ 
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '4pt',
                    alignItems: 'baseline'
                  }}>
                    <div>
                      <div style={{ 
                        fontSize: '10pt', 
                        fontWeight: '700',
                        color: '#1e293b',
                        marginBottom: '1pt',
                        display: 'flex',
                        alignItems: 'center',
                      }}>
                         <div style={{
                          width: '5pt',
                          height: '5pt',
                          borderRadius: '50%',
                          backgroundColor: accentColor,
                          marginRight: '6pt',
                          transform: 'translateX(-10.5pt)'
                        }} />
                        {exp.title}
                      </div>
                      <div style={{ 
                        fontSize: '9pt', 
                        color: primaryColor,
                        fontWeight: '600',
                      }}>
                        {exp.company}
                      </div>
                    </div>
                    <div style={{ 
                      fontSize: '8pt', 
                      color: '#64748b',
                      textAlign: 'right',
                      whiteSpace: 'nowrap',
                      backgroundColor: '#f1f5f9',
                      padding: '2pt 6pt',
                      borderRadius: '4pt'
                    }}>
                      {exp.startDate} - {exp.isCurrent ? 'Sekarang' : exp.endDate}
                    </div>
                  </div>
                  {exp.bullets && exp.bullets.length > 0 && (
                    <ul style={{ 
                      margin: '6pt 0 0 0',
                      paddingLeft: '14pt',
                      fontSize: '8.5pt',
                      lineHeight: '1.6',
                      color: '#334155',
                    }}>
                      {exp.bullets.filter(Boolean).map((bullet: string, i: number) => (
                        <li key={i} style={{ marginBottom: '3pt' }}>
                          {bullet.replace(/^[•\-]\s*/, '')}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT COLUMN - Light Gray Background (35%) */}
        <div style={{ 
          width: '35%',
          backgroundColor: '#F8F9FA',
          padding: '15mm 12mm',
          borderLeft: '1px solid #e2e8f0'
        }}>
          {/* PENDIDIKAN Section */}
          {education.length > 0 && (
            <div style={{ marginBottom: '20pt' }}>
              <SectionHeader title="PENDIDIKAN" color={secondaryColor} />
              {education.map((edu, idx) => (
                <div key={idx} style={{ marginBottom: '12pt', paddingBottom: '12pt', borderBottom: idx !== education.length -1 ? '1px dashed #cbd5e1' : 'none' }}>
                  <div style={{ 
                    fontSize: '9pt', 
                    fontWeight: '700',
                    marginBottom: '2pt',
                    color: '#1e293b',
                  }}>
                    {edu.degree}
                  </div>
                  <div style={{ 
                    fontSize: '8.5pt',
                    color: primaryColor,
                    lineHeight: '1.4',
                    marginBottom: '2pt'
                  }}>
                    {edu.school}
                  </div>
                   <div style={{ 
                    fontSize: '8pt',
                    color: '#64748b',
                    fontStyle: 'italic'
                  }}>
                    {edu.startDate} - {edu.endDate}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* KEAHLIAN Section - Combined */}
          {skills.length > 0 && (
            <div style={{ marginBottom: '20pt' }}>
              <SectionHeader title="KEAHLIAN" color={secondaryColor} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8pt' }}>
                {skills.map((skill, idx) => (
                   <div key={idx}>
                    <div style={{ 
                      fontSize: '8.5pt', 
                      marginBottom: '2pt',
                      fontWeight: '600',
                      color: '#334155',
                      display: 'flex',
                      justifyContent: 'space-between'
                    }}>
                      <span>{skill}</span>
                    </div>
                    <div style={{ 
                      width: '100%', 
                      height: '4pt', 
                      backgroundColor: '#e2e8f0',
                      borderRadius: '2pt',
                      overflow: 'hidden',
                    }}>
                      <div style={{ 
                        width: `${Math.max(40, 100 - (idx * 5))}%`, 
                        height: '100%', 
                        backgroundColor: idx < 3 ? accentColor : primaryColor, // Top 3 skills get Gold accent
                        borderRadius: '2pt',
                        opacity: idx < 3 ? 1 : 0.7
                      }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
