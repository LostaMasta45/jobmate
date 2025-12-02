"use client";

import * as React from "react";
import { CreativeCV } from "@/lib/schemas/cv-creative";

interface TemplateProps {
  cv: Partial<CreativeCV>;
}

const PhotoComponent = ({ photo, photoOpts, borderColor = "white" }: any) => {
  if (!photo || !photoOpts) return null;
  return (
    <div
      style={{
        flexShrink: 0,
        width: photoOpts.size === "small" ? "60pt" : photoOpts.size === "large" ? "100pt" : "80pt",
        height: photoOpts.size === "small" ? "60pt" : photoOpts.size === "large" ? "100pt" : "80pt",
        borderRadius: photoOpts.shape === "circle" ? "50%" : photoOpts.shape === "rounded-square" ? "8pt" : "0",
        border: photoOpts.border.style !== "none" ? `${photoOpts.border.width}px ${photoOpts.border.style} ${borderColor}` : "none",
        overflow: "hidden",
      }}
    >
      <img src={photo} alt="Profile" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
    </div>
  );
};

// 5. Magazine Layout - Editorial style with columns
export function MagazineLayout({ cv }: TemplateProps) {
  const colors = cv.colorScheme || { primary: "#dc2626", secondary: "#ef4444", accent: "#f87171", background: "#ffffff", text: "#1e293b" };
  const content = cv.content;
  if (!content) return null;

  return (
    <div className="cv-template" style={{ 
      color: colors.text, 
      fontFamily: "'Playfair Display', 'Georgia', serif",
      backgroundColor: '#fdfbf7' // slight paper tint
    }}>
      {/* Magazine Header */}
      <div style={{ 
        borderBottom: `4pt double ${colors.primary}`, 
        paddingBottom: "16pt", 
        marginBottom: "20pt",
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end'
      }}>
        <div style={{ flex: 1 }}>
          <h1 style={{ 
            fontSize: "48pt",
            fontWeight: 900,
            margin: 0,
            lineHeight: 0.9,
            fontStyle: "italic",
            letterSpacing: "-2pt",
            color: colors.text
          }}>
            {content.basics.firstName}<br/>
            <span style={{ color: colors.primary }}>{content.basics.lastName}</span>
          </h1>
        </div>
        
        {/* Faux Magazine Meta Data */}
        <div style={{ 
          textAlign: 'right', 
          borderLeft: `1px solid ${colors.text}`, 
          paddingLeft: '12pt',
          fontFamily: "'Lato', sans-serif",
          fontSize: '8pt',
          letterSpacing: '1pt',
          textTransform: 'uppercase'
        }}>
          <div>Vol. 01</div>
          <div style={{ fontWeight: 700, color: colors.primary }}>The Portfolio</div>
          <div>{new Date().getFullYear()} Edition</div>
        </div>
      </div>

      {/* Content Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1.8fr 1fr", gap: "24pt" }}>
        {/* Main column */}
        <div>
          {/* Drop Cap Summary */}
          {content.summary && (
            <div style={{ marginBottom: "20pt", position: 'relative' }}>
              <p style={{ 
                fontSize: "10.5pt", 
                lineHeight: 1.8, 
                textAlign: "justify", 
                color: colors.text,
                margin: 0,
                fontFamily: "'Merriweather', serif"
              }}>
                <span style={{ 
                  fontSize: "48pt",
                  float: "left",
                  lineHeight: "38pt",
                  paddingRight: "8pt",
                  color: colors.primary,
                  fontWeight: 700,
                  fontFamily: "'Playfair Display', serif"
                }}>
                  {content.summary.charAt(0)}
                </span>
                {content.summary.substring(1)}
              </p>
            </div>
          )}

          {/* Experience - Editorial Style */}
          {content.experiences && content.experiences.length > 0 && (
            <div>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8pt', 
                marginBottom: '12pt',
                borderBottom: `1px solid ${colors.text}`,
                paddingBottom: '4pt'
              }}>
                <h2 style={{ 
                  fontSize: "14pt",
                  fontWeight: 900,
                  margin: 0,
                  textTransform: "uppercase",
                  letterSpacing: "1pt",
                  fontFamily: "'Lato', sans-serif"
                }}>Experience</h2>
              </div>

              {content.experiences.map((exp, idx) => (
                <div key={idx} style={{ marginBottom: "16pt" }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '4pt' }}>
                    <h3 style={{ fontSize: "12pt", fontWeight: 700, margin: 0, fontStyle: 'italic' }}>{exp.title}</h3>
                    <span style={{ fontFamily: "'Lato', sans-serif", fontSize: "8pt", fontWeight: 700 }}>
                      {exp.startDate} — {exp.isCurrent ? "Present" : exp.endDate}
                    </span>
                  </div>
                  <div style={{ 
                    fontFamily: "'Lato', sans-serif", 
                    fontSize: "9pt", 
                    fontWeight: 700, 
                    color: colors.primary, 
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    marginBottom: '6pt'
                  }}>
                    {exp.company}
                  </div>
                  <ul style={{ margin: 0, paddingLeft: "12pt", fontSize: "9.5pt", fontFamily: "'Merriweather', serif", lineHeight: 1.6 }}>
                    {exp.bullets.slice(0, 4).map((bullet, i) => (
                      <li key={i} style={{ marginBottom: "2pt" }}>{bullet}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar column */}
        <div style={{ 
          borderLeft: `1px solid ${colors.text}20`, 
          paddingLeft: '16pt',
          display: 'flex',
          flexDirection: 'column',
          gap: '20pt'
        }}>
          {/* Photo - Clean Square */}
          {cv.photoUrl && cv.photoOptions && (
            <div style={{ 
              width: '100%', 
              aspectRatio: '1', 
              overflow: 'hidden', 
              border: `1px solid ${colors.text}` 
            }}>
              <img src={cv.photoUrl} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(100%)' }} />
            </div>
          )}

          {/* Contact Box */}
          <div>
             <h3 style={{ 
                fontSize: "9pt", 
                fontWeight: 900, 
                textTransform: "uppercase", 
                letterSpacing: "1pt", 
                borderBottom: `2px solid ${colors.primary}`,
                paddingBottom: '4pt',
                marginBottom: '8pt',
                fontFamily: "'Lato', sans-serif"
              }}>
              Details
            </h3>
            <div style={{ fontSize: "9pt", lineHeight: 1.6, fontFamily: "'Lato', sans-serif" }}>
              {content.basics.email && <div style={{ marginBottom: '4pt' }}><strong>E:</strong> {content.basics.email}</div>}
              {content.basics.phone && <div style={{ marginBottom: '4pt' }}><strong>P:</strong> {content.basics.phone}</div>}
              {content.basics.city && <div style={{ marginBottom: '4pt' }}><strong>L:</strong> {content.basics.city}</div>}
              {content.basics.headline && <div style={{ marginTop: '8pt', fontStyle: 'italic', color: colors.primary }}>"{content.basics.headline}"</div>}
            </div>
          </div>

          {/* Skills List */}
          {content.skills && content.skills.length > 0 && (
            <div>
               <h3 style={{ 
                  fontSize: "9pt", 
                  fontWeight: 900, 
                  textTransform: "uppercase", 
                  letterSpacing: "1pt", 
                  borderBottom: `2px solid ${colors.primary}`,
                  paddingBottom: '4pt',
                  marginBottom: '8pt',
                  fontFamily: "'Lato', sans-serif"
                }}>
                Expertise
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4pt' }}>
                {content.skills.map((skill, idx) => (
                  <span key={idx} style={{ 
                    fontSize: "8.5pt", 
                    fontFamily: "'Lato', sans-serif",
                    border: `1px solid ${colors.text}40`,
                    padding: '2pt 6pt',
                    borderRadius: '2pt'
                  }}>
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {content.education && content.education.length > 0 && (
            <div>
              <h3 style={{ 
                  fontSize: "9pt", 
                  fontWeight: 900, 
                  textTransform: "uppercase", 
                  letterSpacing: "1pt", 
                  borderBottom: `2px solid ${colors.primary}`,
                  paddingBottom: '4pt',
                  marginBottom: '8pt',
                  fontFamily: "'Lato', sans-serif"
                }}>
                Education
              </h3>
              {content.education.map((edu, idx) => (
                <div key={idx} style={{ marginBottom: "10pt", fontFamily: "'Lato', sans-serif" }}>
                  <div style={{ fontWeight: 700, fontSize: '9pt' }}>{edu.school}</div>
                  {edu.degree && <div style={{ fontSize: "8.5pt", fontStyle: "italic" }}>{edu.degree}</div>}
                  {edu.startDate && <div style={{ fontSize: "8pt", opacity: 0.7, marginTop: '2pt' }}>{edu.startDate} — {edu.endDate}</div>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// 6. Colorful Blocks - Vibrant sections with color blocks, now cleaner and more structured
export function ColorfulBlocks({ cv }: TemplateProps) {
  const colors = cv.colorScheme || { primary: "#f59e0b", secondary: "#fbbf24", accent: "#fcd34d", background: "#ffffff", text: "#1e293b" };
  const content = cv.content;
  if (!content) return null;

  const blockColors = [colors.primary, colors.secondary, colors.accent, "#8b5cf6", "#ec4899"];

  return (
    <div className="cv-template" style={{ 
      color: colors.text, 
      padding: "16mm", 
      fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif",
      backgroundColor: "#fdfdfd"
    }}>
      {/* Colorful header */}
      <div style={{ 
        background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary}, ${colors.accent})`,
        padding: "24pt",
        marginLeft: "-16mm",
        marginRight: "-16mm",
        marginTop: "-16mm",
        marginBottom: "20pt",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "20pt", maxWidth: "178mm", margin: "0 auto" }}>
          <PhotoComponent photo={cv.photoUrl} photoOpts={cv.photoOptions} borderColor="white" />
          <div style={{ flex: 1, color: "white" }}>
            <h1 style={{ fontSize: "32pt", fontWeight: 800, margin: 0, textShadow: "0 2px 4px rgba(0,0,0,0.1)", lineHeight: 1 }}>
              {content.basics.firstName} {content.basics.lastName}
            </h1>
            {content.basics.headline && (
              <p style={{ fontSize: "14pt", marginTop: "6pt", opacity: 0.95, fontWeight: 500 }}>{content.basics.headline}</p>
            )}
            <div style={{ marginTop: "12pt", fontSize: "9.5pt", display: "flex", flexWrap: "wrap", gap: "16pt", opacity: 0.95, fontWeight: 500 }}>
              {content.basics.email && <span style={{ display: "flex", alignItems: "center", gap: "4pt" }}>📧 {content.basics.email}</span>}
              {content.basics.phone && <span style={{ display: "flex", alignItems: "center", gap: "4pt" }}>📱 {content.basics.phone}</span>}
              {content.basics.city && <span style={{ display: "flex", alignItems: "center", gap: "4pt" }}>📍 {content.basics.city}</span>}
            </div>
          </div>
        </div>
      </div>

      {/* Summary block */}
      {content.summary && (
        <div style={{ 
          backgroundColor: "white",
          padding: "16pt",
          borderLeft: `6pt solid ${colors.primary}`,
          marginBottom: "20pt",
          borderRadius: "0 8pt 8pt 0",
          boxShadow: "0 2px 8px rgba(0,0,0,0.03)"
        }}>
          <h2 style={{ fontSize: "11pt", fontWeight: 700, color: colors.primary, marginBottom: "8pt", textTransform: "uppercase" }}>Professional Summary</h2>
          <p style={{ fontSize: "9.5pt", lineHeight: 1.6, color: "#334155", margin: 0 }}>{content.summary}</p>
        </div>
      )}

      {/* Experience blocks */}
      {content.experiences && content.experiences.length > 0 && (
        <div style={{ marginBottom: "20pt" }}>
          <h2 style={{ 
            fontSize: "14pt",
            fontWeight: 800,
            color: "#0f172a",
            marginBottom: "12pt",
            paddingBottom: "6pt",
            borderBottom: `3pt solid ${colors.primary}`,
            display: "flex",
            alignItems: "center",
            gap: "8pt"
          }}>
            <span style={{ fontSize: "16pt" }}>💼</span> Work Experience
          </h2>
          {content.experiences.map((exp, idx) => (
            <div key={idx} style={{ 
              marginBottom: "12pt",
              padding: "16pt",
              backgroundColor: "white",
              borderLeft: `5pt solid ${blockColors[idx % blockColors.length]}`,
              borderRadius: "0 8pt 8pt 0",
              boxShadow: "0 2px 6px rgba(0,0,0,0.03)"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "6pt" }}>
                <div>
                  <h3 style={{ fontSize: "12pt", fontWeight: 700, color: "#0f172a", margin: 0 }}>{exp.title}</h3>
                  <p style={{ fontSize: "10pt", margin: "2pt 0", fontWeight: 600, color: blockColors[idx % blockColors.length] }}>{exp.company}</p>
                </div>
                <span style={{ 
                  fontSize: "8.5pt", 
                  color: "#475569", 
                  padding: "4pt 10pt", 
                  backgroundColor: "#f8fafc", 
                  borderRadius: "20pt", 
                  whiteSpace: "nowrap",
                  fontWeight: 500,
                  border: "1px solid #e2e8f0"
                }}>
                  {exp.startDate} - {exp.isCurrent ? "Present" : exp.endDate}
                </span>
              </div>
              <ul style={{ margin: 0, paddingLeft: "0", listStyle: "none" }}>
                {exp.bullets.map((bullet, i) => (
                  bullet.trim() && (
                    <li key={i} style={{ marginBottom: "4pt", fontSize: "9.5pt", color: "#334155", display: "flex", gap: "8pt", lineHeight: 1.5 }}>
                      <span style={{ color: blockColors[idx % blockColors.length], fontWeight: "bold" }}>•</span>
                      <span>{bullet}</span>
                    </li>
                  )
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* Education & Skills in colored blocks */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20pt" }}>
        {content.education && content.education.length > 0 && (
          <div>
            <h2 style={{ 
              fontSize: "14pt",
              fontWeight: 800,
              color: "#0f172a",
              marginBottom: "12pt",
              paddingBottom: "6pt",
              borderBottom: `3pt solid ${colors.secondary}`,
              display: "flex",
              alignItems: "center",
              gap: "8pt"
            }}>
              <span style={{ fontSize: "16pt" }}>🎓</span> Education
            </h2>
            {content.education.map((edu, idx) => (
              <div key={idx} style={{ 
                marginBottom: "10pt",
                padding: "14pt",
                backgroundColor: "white",
                borderLeft: `4pt solid ${colors.secondary}`,
                borderRadius: "0 8pt 8pt 0",
                boxShadow: "0 2px 6px rgba(0,0,0,0.03)"
              }}>
                <h3 style={{ fontSize: "11pt", fontWeight: 700, color: "#0f172a" }}>{edu.school}</h3>
                {edu.degree && <p style={{ fontSize: "9.5pt", margin: "2pt 0", color: "#334155" }}>{edu.degree} {edu.field}</p>}
                {edu.startDate && <p style={{ fontSize: "8.5pt", color: "#64748b", marginTop: "4pt" }}>{edu.startDate} - {edu.endDate}</p>}
              </div>
            ))}
          </div>
        )}

        {content.skills && content.skills.length > 0 && (
          <div>
            <h2 style={{ 
              fontSize: "14pt",
              fontWeight: 800,
              color: "#0f172a",
              marginBottom: "12pt",
              paddingBottom: "6pt",
              borderBottom: `3pt solid ${colors.accent}`,
              display: "flex",
              alignItems: "center",
              gap: "8pt"
            }}>
              <span style={{ fontSize: "16pt" }}>⚡</span> Skills
            </h2>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8pt" }}>
              {content.skills.map((skill, idx) => (
                <span key={idx} style={{
                  backgroundColor: "white",
                  color: "#0f172a",
                  padding: "6pt 12pt",
                  borderRadius: "8pt",
                  fontSize: "9pt",
                  fontWeight: 600,
                  boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                  borderLeft: `3pt solid ${blockColors[idx % blockColors.length]}`
                }}>
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// 7. Timeline Hero - Vertical timeline with milestone circles, refined
export function TimelineHero({ cv }: TemplateProps) {
  const colors = cv.colorScheme || { primary: "#0891b2", secondary: "#06b6d4", accent: "#22d3ee", background: "#ffffff", text: "#0f172a" };
  const content = cv.content;
  if (!content) return null;

  return (
    <div className="cv-template" style={{ color: colors.text, fontFamily: "'Poppins', sans-serif", lineHeight: 1.6 }}>
      {/* Header with photo */}
      <div style={{ 
        display: 'flex',
        alignItems: 'center',
        gap: '24pt',
        marginBottom: '24pt',
        paddingBottom: '20pt',
        borderBottom: `4pt solid ${colors.primary}`,
      }}>
        {cv.photoUrl && cv.photoOptions && (
          <div style={{
            width: '100pt',
            height: '100pt',
            borderRadius: '50%',
            border: `4pt solid ${colors.primary}`,
            overflow: 'hidden',
            boxShadow: `0 0 0 4pt ${colors.primary}20`
          }}>
            <img src={cv.photoUrl} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        )}
        <div style={{ flex: 1 }}>
          <h1 style={{ fontSize: '32pt', fontWeight: 800, margin: 0, color: colors.primary, lineHeight: 1.1 }}>
            {content.basics.firstName} {content.basics.lastName}
          </h1>
          {content.basics.headline && (
            <div style={{ fontSize: '14pt', marginTop: '6pt', color: colors.secondary, fontWeight: 500 }}>
              {content.basics.headline}
            </div>
          )}
          <div style={{ marginTop: '12pt', fontSize: '9.5pt', display: 'flex', gap: '16pt', flexWrap: 'wrap', color: "#475569", fontWeight: 500 }}>
            {content.basics.email && <span>✉ {content.basics.email}</span>}
            {content.basics.phone && <span>☎ {content.basics.phone}</span>}
            {content.basics.city && <span>📍 {content.basics.city}</span>}
          </div>
        </div>
      </div>

      {/* Summary */}
      {content.summary && (
        <div style={{ 
          marginBottom: '24pt',
          padding: '16pt',
          backgroundColor: `${colors.primary}08`,
          borderLeft: `4pt solid ${colors.primary}`,
          borderRadius: '0 8pt 8pt 0'
        }}>
          <h2 style={{ fontSize: "11pt", fontWeight: 700, color: colors.primary, marginBottom: "8pt", textTransform: "uppercase" }}>Profile</h2>
          <p style={{ fontSize: "9.5pt", margin: 0 }}>{content.summary}</p>
        </div>
      )}

      {/* Experience Timeline */}
      {content.experiences && content.experiences.length > 0 && (
        <div style={{ marginBottom: '24pt' }}>
          <h2 style={{ 
            color: colors.primary,
            fontSize: '16pt',
            fontWeight: 700,
            marginBottom: '16pt',
            display: "flex",
            alignItems: "center",
            gap: "8pt"
          }}>
            Career Timeline
          </h2>
          {content.experiences.map((exp, idx) => (
            <div key={idx} style={{ 
              position: 'relative',
              paddingLeft: '32pt',
              marginBottom: '20pt',
              paddingBottom: idx === content.experiences.length - 1 ? 0 : '8pt',
            }}>
              {/* Timeline Line */}
              {idx !== content.experiences.length - 1 && (
                <div style={{
                  position: 'absolute',
                  left: '0',
                  top: '8pt',
                  bottom: '-20pt',
                  width: '2pt',
                  backgroundColor: `${colors.primary}30`,
                  marginLeft: '5pt'
                }} />
              )}

              {/* Timeline circle */}
              <div style={{
                position: 'absolute',
                left: '0',
                top: '4pt',
                width: '12pt',
                height: '12pt',
                borderRadius: '50%',
                backgroundColor: colors.primary,
                border: `2pt solid white`,
                boxShadow: `0 0 0 2pt ${colors.primary}`,
                zIndex: 1
              }} />
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6pt' }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '12pt', fontWeight: 700, color: "#0f172a", margin: 0 }}>
                    {exp.title}
                  </h3>
                  <div style={{ fontSize: '10.5pt', marginTop: '2pt', fontWeight: 600, color: colors.primary }}>
                    {exp.company}
                  </div>
                </div>
                <div style={{ 
                  fontSize: '8.5pt',
                  color: 'white',
                  backgroundColor: colors.secondary,
                  padding: '4pt 12pt',
                  borderRadius: '20pt',
                  whiteSpace: 'nowrap',
                  marginLeft: '12pt',
                  fontWeight: 600
                }}>
                  {exp.startDate} - {exp.isCurrent ? 'Now' : exp.endDate}
                </div>
              </div>
              {exp.bullets && exp.bullets.length > 0 && (
                <ul style={{ margin: 0, paddingLeft: '0', listStyle: 'none' }}>
                  {exp.bullets.filter(Boolean).map((bullet: string, i: number) => (
                    <li key={i} style={{ marginBottom: '4pt', fontSize: "9.5pt", color: "#334155", display: "flex", gap: "8pt" }}>
                      <span style={{ color: colors.primary, fontWeight: "bold" }}>›</span>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Education & Skills Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24pt' }}>
        {content.education && content.education.length > 0 && (
          <div>
            <h2 style={{ 
              color: colors.primary,
              fontSize: '14pt',
              fontWeight: 700,
              marginBottom: '12pt',
            }}>
              Education
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "12pt" }}>
              {content.education.map((edu, idx) => (
                <div key={idx} style={{ 
                  padding: '12pt',
                  backgroundColor: `${colors.accent}10`,
                  borderRadius: '12pt',
                  border: `1px solid ${colors.accent}30`
                }}>
                  <div style={{ fontSize: '11pt', fontWeight: 700, color: "#0f172a" }}>{edu.school}</div>
                  {edu.degree && <div style={{ fontSize: '10pt', marginTop: '2pt', color: colors.primary, fontWeight: 500 }}>{edu.degree}</div>}
                  {edu.startDate && (
                    <div style={{ fontSize: '9pt', color: '#64748b', marginTop: '4pt' }}>
                      {edu.startDate} - {edu.endDate}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {content.skills && content.skills.length > 0 && (
          <div>
            <h2 style={{ 
              color: colors.primary,
              fontSize: '14pt',
              fontWeight: 700,
              marginBottom: '12pt',
            }}>
              Skills & Expertise
            </h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8pt' }}>
              {content.skills.map((skill, idx) => (
                <span key={idx} style={{
                  backgroundColor: "white",
                  color: colors.primary,
                  padding: '6pt 12pt',
                  borderRadius: '8pt',
                  fontSize: '9pt',
                  fontWeight: 600,
                  border: `1px solid ${colors.primary}30`,
                  boxShadow: "0 2px 4px rgba(0,0,0,0.05)"
                }}>
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
// 8. Portfolio Grid - Modern card-based grid layout
export function PortfolioGrid({ cv }: TemplateProps) {
  const colors = cv.colorScheme || { primary: "#7c3aed", secondary: "#8b5cf6", accent: "#a78bfa", background: "#faf5ff", text: "#1e293b" };
  const content = cv.content;
  if (!content) return null;

  return (
    <div className="cv-template" style={{ 
      backgroundColor: colors.background,
      color: colors.text,
      fontFamily: "'Inter', sans-serif",
    }}>
      {/* Top Banner */}
      <div style={{
        background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
        padding: '16pt 18pt',
        marginLeft: '-20mm',
        marginRight: '-20mm',
        marginTop: '-20mm',
        marginBottom: '16pt',
        color: 'white',
      }}>
        <div style={{ maxWidth: '170mm', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '16pt' }}>
          {cv.photoUrl && cv.photoOptions && (
            <div style={{
              width: '80pt',
              height: '80pt',
              borderRadius: '12pt',
              border: '3pt solid white',
              overflow: 'hidden',
            }}>
              <img src={cv.photoUrl} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          )}
          <div>
            <h1 style={{ fontSize: '24pt', fontWeight: 800, margin: 0 }}>
              {content.basics.firstName} {content.basics.lastName}
            </h1>
            {content.basics.headline && (
              <div style={{ fontSize: '12pt', marginTop: '4pt', opacity: 0.95 }}>
                {content.basics.headline}
              </div>
            )}
            <div style={{ marginTop: '6pt', fontSize: '8pt', display: 'flex', gap: '10pt', opacity: 0.9 }}>
              {content.basics.email && <span>{content.basics.email}</span>}
              {content.basics.phone && <span>• {content.basics.phone}</span>}
            </div>
          </div>
        </div>
      </div>

      {/* Summary Card */}
      {content.summary && (
        <div style={{
          backgroundColor: 'white',
          padding: '14pt',
          borderRadius: '12pt',
          marginBottom: '14pt',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          borderLeft: `5pt solid ${colors.primary}`,
        }}>
          <h2 style={{ color: colors.primary, fontSize: '11pt', fontWeight: 700, marginBottom: '6pt' }}>
            Professional Summary
          </h2>
          <p style={{ fontSize: '9pt', lineHeight: 1.6, margin: 0 }}>{content.summary}</p>
        </div>
      )}

      {/* Experience Grid */}
      {content.experiences && content.experiences.length > 0 && (
        <div style={{ marginBottom: '14pt' }}>
          <h2 style={{ 
            color: colors.primary,
            fontSize: '14pt',
            fontWeight: 700,
            marginBottom: '12pt',
          }}>
            Work Experience
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '12pt' }}>
            {content.experiences.map((exp, idx) => (
              <div key={idx} style={{
                backgroundColor: 'white',
                padding: '14pt',
                borderRadius: '12pt',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                border: `1pt solid ${colors.accent}30`,
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8pt' }}>
                  <div>
                    <h3 style={{ fontSize: '11pt', fontWeight: 700, color: colors.primary, margin: 0 }}>
                      {exp.title}
                    </h3>
                    <div style={{ fontSize: '10pt', marginTop: '2pt', fontWeight: 600 }}>
                      {exp.company}
                    </div>
                  </div>
                  <div style={{
                    fontSize: '8pt',
                    backgroundColor: `${colors.primary}15`,
                    color: colors.primary,
                    padding: '4pt 10pt',
                    borderRadius: '8pt',
                    height: 'fit-content',
                  }}>
                    {exp.startDate} - {exp.isCurrent ? 'Present' : exp.endDate}
                  </div>
                </div>
                {exp.bullets && exp.bullets.length > 0 && (
                  <ul style={{ margin: 0, paddingLeft: '14pt', fontSize: '9pt', lineHeight: 1.5 }}>
                    {exp.bullets.filter(Boolean).slice(0, 3).map((bullet: string, i: number) => (
                      <li key={i} style={{ marginBottom: '3pt' }}>{bullet}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education & Skills Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12pt' }}>
        {content.education && content.education.length > 0 && (
          <div style={{
            backgroundColor: 'white',
            padding: '14pt',
            borderRadius: '12pt',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          }}>
            <h2 style={{ color: colors.primary, fontSize: '12pt', fontWeight: 700, marginBottom: '10pt' }}>
              Education
            </h2>
            {content.education.map((edu, idx) => (
              <div key={idx} style={{ marginBottom: '8pt' }}>
                <div style={{ fontSize: '10pt', fontWeight: 700 }}>{edu.school}</div>
                {edu.degree && <div style={{ fontSize: '9pt', marginTop: '2pt' }}>{edu.degree}</div>}
                {edu.startDate && (
                  <div style={{ fontSize: '8pt', color: '#64748b', marginTop: '2pt' }}>
                    {edu.startDate} - {edu.endDate}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {content.skills && content.skills.length > 0 && (
          <div style={{
            backgroundColor: 'white',
            padding: '14pt',
            borderRadius: '12pt',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          }}>
            <h2 style={{ color: colors.primary, fontSize: '12pt', fontWeight: 700, marginBottom: '10pt' }}>
              Skills
            </h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5pt' }}>
              {content.skills.map((skill, idx) => (
                <span key={idx} style={{
                  backgroundColor: `${colors.primary}15`,
                  color: colors.primary,
                  padding: '4pt 8pt',
                  borderRadius: '6pt',
                  fontSize: '8pt',
                  fontWeight: 500,
                }}>
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// 9. Infographic Style - Visual data with icons and progress
export function InfographicStyle({ cv }: TemplateProps) {
  const colors = cv.colorScheme || { primary: "#ea580c", secondary: "#f97316", accent: "#fb923c", background: "#ffffff", text: "#0f172a" };
  const content = cv.content;
  if (!content) return null;

  return (
    <div className="cv-template" style={{ color: colors.text, fontFamily: "'Roboto', sans-serif" }}>
      {/* Header Infographic Style */}
      <div style={{
        background: `linear-gradient(90deg, ${colors.primary}, ${colors.secondary})`,
        color: 'white',
        padding: '14pt',
        marginLeft: '-20mm',
        marginRight: '-20mm',
        marginTop: '-20mm',
        marginBottom: '14pt',
      }}>
        <div style={{ maxWidth: '170mm', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '14pt' }}>
          {cv.photoUrl && cv.photoOptions && (
            <div style={{
              width: '70pt',
              height: '70pt',
              borderRadius: '50%',
              border: '4pt solid white',
              overflow: 'hidden',
            }}>
              <img src={cv.photoUrl} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          )}
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: '26pt', fontWeight: 800, margin: 0 }}>
              {content.basics.firstName} {content.basics.lastName}
            </h1>
            {content.basics.headline && (
              <div style={{ fontSize: '12pt', marginTop: '3pt', opacity: 0.95, fontWeight: 500 }}>
                {content.basics.headline}
              </div>
            )}
          </div>
          {/* Contact Stats */}
          <div style={{ display: 'flex', gap: '10pt', fontSize: '7pt' }}>
            {content.basics.email && (
              <div style={{ textAlign: 'center', padding: '6pt', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '6pt', minWidth: '50pt' }}>
                <div style={{ fontSize: '16pt' }}>✉</div>
                <div style={{ marginTop: '2pt', wordBreak: 'break-word' }}>{content.basics.email.split('@')[0]}</div>
              </div>
            )}
            {content.basics.phone && (
              <div style={{ textAlign: 'center', padding: '6pt', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '6pt', minWidth: '50pt' }}>
                <div style={{ fontSize: '16pt' }}>☎</div>
                <div style={{ marginTop: '2pt' }}>{content.basics.phone}</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Summary with Icon */}
      {content.summary && (
        <div style={{ 
          display: 'flex',
          gap: '12pt',
          marginBottom: '14pt',
          padding: '12pt',
          backgroundColor: `${colors.primary}08`,
          borderRadius: '8pt',
        }}>
          <div style={{ fontSize: '24pt', color: colors.primary }}>👤</div>
          <div>
            <h2 style={{ color: colors.primary, fontSize: '11pt', fontWeight: 700, margin: '0 0 6pt 0' }}>
              About Me
            </h2>
            <p style={{ fontSize: '9pt', lineHeight: 1.6, margin: 0 }}>{content.summary}</p>
          </div>
        </div>
      )}

      {/* Experience with Icons */}
      {content.experiences && content.experiences.length > 0 && (
        <div style={{ marginBottom: '14pt' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8pt', marginBottom: '12pt' }}>
            <div style={{ fontSize: '20pt' }}>💼</div>
            <h2 style={{ color: colors.primary, fontSize: '14pt', fontWeight: 700, margin: 0 }}>
              Work Experience
            </h2>
          </div>
          {content.experiences.map((exp, idx) => (
            <div key={idx} style={{
              marginBottom: '12pt',
              padding: '12pt',
              backgroundColor: 'white',
              border: `2pt solid ${colors.accent}30`,
              borderRadius: '8pt',
              borderLeft: `6pt solid ${colors.primary}`,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{ fontSize: '11pt', fontWeight: 700, color: colors.primary, margin: 0 }}>
                    {exp.title}
                  </h3>
                  <div style={{ fontSize: '10pt', marginTop: '2pt', fontWeight: 600 }}>
                    {exp.company}
                  </div>
                </div>
                <div style={{
                  fontSize: '8pt',
                  backgroundColor: colors.accent,
                  color: 'white',
                  padding: '4pt 10pt',
                  borderRadius: '12pt',
                  height: 'fit-content',
                }}>
                  {exp.startDate} → {exp.isCurrent ? 'Now' : exp.endDate}
                </div>
              </div>
              {exp.bullets && exp.bullets.length > 0 && (
                <ul style={{ marginTop: '6pt', paddingLeft: '14pt', fontSize: '9pt', lineHeight: 1.5 }}>
                  {exp.bullets.filter(Boolean).slice(0, 3).map((bullet: string, i: number) => (
                    <li key={i} style={{ marginBottom: '2pt' }}>{bullet}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Education & Skills with Progress Bars */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14pt' }}>
        {content.education && content.education.length > 0 && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8pt', marginBottom: '10pt' }}>
              <div style={{ fontSize: '18pt' }}>🎓</div>
              <h2 style={{ color: colors.primary, fontSize: '12pt', fontWeight: 700, margin: 0 }}>
                Education
              </h2>
            </div>
            {content.education.map((edu, idx) => (
              <div key={idx} style={{ 
                marginBottom: '8pt',
                padding: '10pt',
                backgroundColor: `${colors.accent}15`,
                borderRadius: '8pt',
              }}>
                <div style={{ fontSize: '10pt', fontWeight: 700 }}>{edu.school}</div>
                {edu.degree && <div style={{ fontSize: '9pt', marginTop: '2pt' }}>{edu.degree}</div>}
                {edu.startDate && (
                  <div style={{ fontSize: '8pt', color: '#64748b', marginTop: '2pt' }}>
                    {edu.startDate} - {edu.endDate}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {content.skills && content.skills.length > 0 && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8pt', marginBottom: '10pt' }}>
              <div style={{ fontSize: '18pt' }}>⚡</div>
              <h2 style={{ color: colors.primary, fontSize: '12pt', fontWeight: 700, margin: 0 }}>
                Skills
              </h2>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8pt' }}>
              {content.skills.slice(0, 8).map((skill, idx) => {
                const level = 90 - (idx * 5);
                return (
                  <div key={idx}>
                    <div style={{ fontSize: '9pt', marginBottom: '3pt', fontWeight: 600 }}>{skill}</div>
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
                        background: `linear-gradient(90deg, ${colors.primary}, ${colors.accent})`,
                        borderRadius: '3pt',
                      }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// 10. Split Screen - 40-60 vertical divide with modern styling
export function SplitScreen({ cv }: TemplateProps) {
  const colors = cv.colorScheme || { primary: "#16a34a", secondary: "#22c55e", accent: "#4ade80", background: "#f0fdf4", text: "#0f172a" };
  const content = cv.content;
  if (!content) return null;

  return (
    <div className="cv-template" style={{ 
      display: 'flex',
      minHeight: '297mm',
      fontFamily: "'DM Sans', 'Nunito', sans-serif",
      backgroundColor: 'white'
    }}>
      {/* LEFT SPLIT - 40% Colored */}
      <div style={{
        width: '40%',
        backgroundColor: colors.primary,
        color: 'white',
        padding: '20mm 15mm',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Decorative Circle */}
        <div style={{
          position: 'absolute',
          top: '-50pt',
          right: '-50pt',
          width: '200pt',
          height: '200pt',
          borderRadius: '50%',
          backgroundColor: 'white',
          opacity: 0.05
        }} />

        {/* Photo */}
        {cv.photoUrl && cv.photoOptions && (
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20pt', position: 'relative' }}>
            <div style={{
              width: '120pt',
              height: '120pt',
              borderRadius: '50%',
              border: '6pt solid rgba(255,255,255,0.2)',
              padding: '4pt',
              backgroundClip: 'content-box'
            }}>
               <div style={{
                 width: '100%',
                 height: '100%',
                 borderRadius: '50%',
                 overflow: 'hidden',
                 backgroundColor: 'white'
               }}>
                 <img src={cv.photoUrl} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
               </div>
            </div>
          </div>
        )}

        {/* Name */}
        <div style={{ textAlign: 'center', marginBottom: '24pt' }}>
          <h1 style={{ fontSize: '28pt', fontWeight: 800, margin: 0, lineHeight: 1.1, letterSpacing: '-0.5px' }}>
            {content.basics.firstName}<br/>{content.basics.lastName}
          </h1>
          {content.basics.headline && (
            <div style={{ 
              fontSize: '11pt', 
              marginTop: '8pt', 
              opacity: 0.9, 
              fontWeight: 500,
              borderTop: '1px solid rgba(255,255,255,0.3)',
              paddingTop: '8pt',
              display: 'inline-block'
            }}>
              {content.basics.headline}
            </div>
          )}
        </div>

        {/* Contact */}
        <div style={{ marginBottom: '24pt' }}>
          <h3 style={{ fontSize: '10pt', fontWeight: 700, marginBottom: '12pt', textTransform: 'uppercase', letterSpacing: '2pt', opacity: 0.8 }}>
            Contact
          </h3>
          <div style={{ fontSize: '9pt', lineHeight: 2, fontWeight: 400 }}>
            {content.basics.email && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8pt' }}>
                <span style={{ opacity: 0.7 }}>✉</span> {content.basics.email}
              </div>
            )}
            {content.basics.phone && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8pt' }}>
                <span style={{ opacity: 0.7 }}>☎</span> {content.basics.phone}
              </div>
            )}
            {content.basics.city && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8pt' }}>
                <span style={{ opacity: 0.7 }}>📍</span> {content.basics.city}
              </div>
            )}
            {content.basics.linkedin && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8pt' }}>
                <span style={{ opacity: 0.7 }}>🔗</span> <span style={{ fontSize: '8pt' }}>{content.basics.linkedin}</span>
              </div>
            )}
          </div>
        </div>

        {/* Education */}
        {content.education && content.education.length > 0 && (
          <div style={{ marginBottom: '24pt' }}>
            <h3 style={{ fontSize: '10pt', fontWeight: 700, marginBottom: '12pt', textTransform: 'uppercase', letterSpacing: '2pt', opacity: 0.8 }}>
              Education
            </h3>
            {content.education.map((edu, idx) => (
              <div key={idx} style={{ marginBottom: '12pt', fontSize: '9pt' }}>
                <div style={{ fontWeight: 700, fontSize: '10pt' }}>{edu.school}</div>
                {edu.degree && <div style={{ opacity: 0.9 }}>{edu.degree}</div>}
                {edu.startDate && (
                  <div style={{ fontSize: '8.5pt', opacity: 0.7, marginTop: '2pt' }}>
                    {edu.startDate} — {edu.endDate}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Skills */}
        {content.skills && content.skills.length > 0 && (
          <div>
             <h3 style={{ fontSize: '10pt', fontWeight: 700, marginBottom: '12pt', textTransform: 'uppercase', letterSpacing: '2pt', opacity: 0.8 }}>
              Skills
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6pt' }}>
              {content.skills.map((skill, idx) => (
                <div key={idx} style={{
                  backgroundColor: 'rgba(255,255,255,0.15)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  padding: '4pt 8pt',
                  borderRadius: '4pt',
                  fontSize: '8.5pt',
                  fontWeight: 500,
                }}>
                  {skill}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* RIGHT SPLIT - 60% White */}
      <div style={{
        width: '60%',
        backgroundColor: 'white',
        padding: '20mm 15mm',
        color: colors.text,
        display: 'flex',
        flexDirection: 'column',
        gap: '20pt'
      }}>
        {/* Summary */}
        {content.summary && (
          <div>
             <h2 style={{ 
              color: colors.primary,
              fontSize: '16pt',
              fontWeight: 800,
              marginBottom: '12pt',
              display: 'flex',
              alignItems: 'center',
              gap: '8pt'
            }}>
              <span style={{ width: '8pt', height: '8pt', background: colors.accent, borderRadius: '2pt' }} />
              Profile
            </h2>
            <p style={{ fontSize: '10pt', lineHeight: 1.7, color: '#334155' }}>{content.summary}</p>
          </div>
        )}

        {/* Experience */}
        {content.experiences && content.experiences.length > 0 && (
          <div style={{ flex: 1 }}>
            <h2 style={{ 
              color: colors.primary,
              fontSize: '16pt',
              fontWeight: 800,
              marginBottom: '16pt',
              display: 'flex',
              alignItems: 'center',
              gap: '8pt'
            }}>
               <span style={{ width: '8pt', height: '8pt', background: colors.accent, borderRadius: '2pt' }} />
              Work History
            </h2>
            {content.experiences.map((exp, idx) => (
              <div key={idx} style={{ marginBottom: '20pt', position: 'relative', paddingLeft: '20pt' }}>
                 <div style={{ 
                   position: 'absolute',
                   left: '3pt',
                   top: '6pt',
                   bottom: 0,
                   width: '2pt',
                   background: '#e2e8f0',
                   display: idx === content.experiences.length - 1 ? 'none' : 'block'
                 }} />
                 <div style={{ 
                   position: 'absolute',
                   left: '0',
                   top: '6pt',
                   width: '8pt',
                   height: '8pt',
                   borderRadius: '50%',
                   background: 'white',
                   border: `2pt solid ${colors.primary}`
                 }} />

                <div style={{ marginBottom: '6pt' }}>
                  <h3 style={{ fontSize: '12pt', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                    {exp.title}
                  </h3>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2pt' }}>
                    <div style={{ fontSize: '10pt', fontWeight: 600, color: colors.primary }}>
                      {exp.company}
                    </div>
                    <div style={{
                      fontSize: '8.5pt',
                      color: '#64748b',
                      backgroundColor: '#f1f5f9',
                      padding: '2pt 6pt',
                      borderRadius: '4pt'
                    }}>
                      {exp.startDate} - {exp.isCurrent ? 'Present' : exp.endDate}
                    </div>
                  </div>
                </div>
                {exp.bullets && exp.bullets.length > 0 && (
                  <ul style={{ margin: '8pt 0 0 0', paddingLeft: '12pt', fontSize: '9.5pt', lineHeight: 1.6, color: '#334155' }}>
                    {exp.bullets.filter(Boolean).map((bullet: string, i: number) => (
                      <li key={i} style={{ marginBottom: '4pt' }}>{bullet}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// 11. Geometric Modern - Clean geometric shapes and patterns
export function GeometricModern({ cv }: TemplateProps) {
  const colors = cv.colorScheme || { primary: "#db2777", secondary: "#ec4899", accent: "#f472b6", background: "#fdf2f8", text: "#0f172a" };
  const content = cv.content;
  if (!content) return null;

  return (
    <div className="cv-template" style={{ 
      backgroundColor: colors.background,
      color: colors.text,
      fontFamily: "'Space Grotesk', 'Helvetica', sans-serif",
      position: 'relative',
    }}>
      {/* Geometric Header */}
      <div style={{
        position: 'relative',
        marginLeft: '-20mm',
        marginRight: '-20mm',
        marginTop: '-20mm',
        paddingTop: '20mm',
        paddingBottom: '16pt',
        marginBottom: '16pt',
        overflow: 'hidden',
      }}>
        {/* Geometric shapes background */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '100%',
          background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
          clipPath: 'polygon(0 0, 100% 0, 100% 85%, 0 100%)',
        }} />
        
        <div style={{ position: 'relative', maxWidth: '170mm', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '16pt', padding: '0 20mm' }}>
          {cv.photoUrl && cv.photoOptions && (
            <div style={{
              width: '85pt',
              height: '85pt',
              clipPath: 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)',
              border: '4pt solid white',
              overflow: 'hidden',
            }}>
              <img src={cv.photoUrl} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          )}
          <div style={{ color: 'white', flex: 1 }}>
            <h1 style={{ fontSize: '28pt', fontWeight: 800, margin: 0 }}>
              {content.basics.firstName} {content.basics.lastName}
            </h1>
            {content.basics.headline && (
              <div style={{ fontSize: '13pt', marginTop: '4pt', opacity: 0.95, fontWeight: 500 }}>
                {content.basics.headline}
              </div>
            )}
            <div style={{ marginTop: '8pt', fontSize: '8pt', display: 'flex', gap: '12pt', opacity: 0.9 }}>
              {content.basics.email && <span>{content.basics.email}</span>}
              {content.basics.phone && <span>• {content.basics.phone}</span>}
            </div>
          </div>
        </div>
      </div>

      {/* Summary with geometric border */}
      {content.summary && (
        <div style={{
          marginBottom: '16pt',
          padding: '14pt',
          backgroundColor: 'white',
          borderLeft: `8pt solid ${colors.primary}`,
          position: 'relative',
        }}>
          <div style={{
            position: 'absolute',
            top: '10pt',
            right: '10pt',
            width: '20pt',
            height: '20pt',
            backgroundColor: colors.accent,
            transform: 'rotate(45deg)',
            opacity: 0.3,
          }} />
          <h2 style={{ color: colors.primary, fontSize: '12pt', fontWeight: 700, marginBottom: '8pt' }}>
            About Me
          </h2>
          <p style={{ fontSize: '9pt', lineHeight: 1.7, margin: 0 }}>{content.summary}</p>
        </div>
      )}

      {/* Experience with geometric accents */}
      {content.experiences && content.experiences.length > 0 && (
        <div style={{ marginBottom: '16pt' }}>
          <h2 style={{ 
            color: colors.primary,
            fontSize: '14pt',
            fontWeight: 700,
            marginBottom: '12pt',
            display: 'flex',
            alignItems: 'center',
            gap: '8pt',
          }}>
            <div style={{
              width: '8pt',
              height: '8pt',
              backgroundColor: colors.primary,
              transform: 'rotate(45deg)',
            }} />
            Experience
          </h2>
          {content.experiences.map((exp, idx) => (
            <div key={idx} style={{
              marginBottom: '12pt',
              padding: '12pt',
              backgroundColor: 'white',
              borderLeft: `5pt solid ${colors.accent}`,
              position: 'relative',
            }}>
              <div style={{
                position: 'absolute',
                top: '10pt',
                right: '10pt',
                width: '15pt',
                height: '15pt',
                borderRadius: '50%',
                backgroundColor: `${colors.primary}20`,
              }} />
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{ fontSize: '11pt', fontWeight: 700, color: colors.primary, margin: 0 }}>
                    {exp.title}
                  </h3>
                  <div style={{ fontSize: '10pt', marginTop: '2pt', fontWeight: 600 }}>
                    {exp.company}
                  </div>
                </div>
                <div style={{
                  fontSize: '8pt',
                  backgroundColor: colors.primary,
                  color: 'white',
                  padding: '4pt 10pt',
                  borderRadius: '4pt',
                  height: 'fit-content',
                }}>
                  {exp.startDate} - {exp.isCurrent ? 'Now' : exp.endDate}
                </div>
              </div>
              {exp.bullets && exp.bullets.length > 0 && (
                <ul style={{ marginTop: '8pt', paddingLeft: '14pt', fontSize: '9pt', lineHeight: 1.6 }}>
                  {exp.bullets.filter(Boolean).slice(0, 3).map((bullet: string, i: number) => (
                    <li key={i} style={{ marginBottom: '3pt' }}>{bullet}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Education & Skills with geometric design */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14pt' }}>
        {content.education && content.education.length > 0 && (
          <div style={{
            padding: '14pt',
            backgroundColor: 'white',
            borderTop: `5pt solid ${colors.secondary}`,
          }}>
            <h2 style={{ color: colors.primary, fontSize: '12pt', fontWeight: 700, marginBottom: '10pt' }}>
              Education
            </h2>
            {content.education.map((edu, idx) => (
              <div key={idx} style={{ marginBottom: '10pt' }}>
                <div style={{ fontSize: '10pt', fontWeight: 700 }}>{edu.school}</div>
                {edu.degree && <div style={{ fontSize: '9pt', marginTop: '2pt' }}>{edu.degree}</div>}
                {edu.startDate && (
                  <div style={{ fontSize: '8pt', color: '#64748b', marginTop: '2pt' }}>
                    {edu.startDate} - {edu.endDate}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {content.skills && content.skills.length > 0 && (
          <div style={{
            padding: '14pt',
            backgroundColor: 'white',
            borderTop: `5pt solid ${colors.accent}`,
          }}>
            <h2 style={{ color: colors.primary, fontSize: '12pt', fontWeight: 700, marginBottom: '10pt' }}>
              Skills
            </h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6pt' }}>
              {content.skills.map((skill, idx) => (
                <span key={idx} style={{
                  backgroundColor: `${colors.primary}15`,
                  color: colors.primary,
                  padding: '5pt 10pt',
                  fontSize: '8pt',
                  fontWeight: 600,
                  clipPath: 'polygon(5% 0%, 100% 0%, 95% 100%, 0% 100%)',
                }}>
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// 12. Watercolor Artist - Soft artistic design with gradients
export function WatercolorArtist({ cv }: TemplateProps) {
  const colors = cv.colorScheme || { primary: "#0284c7", secondary: "#0ea5e9", accent: "#38bdf8", background: "#f0f9ff", text: "#0f172a" };
  const content = cv.content;
  if (!content) return null;

  return (
    <div className="cv-template" style={{
      backgroundColor: colors.background,
      color: colors.text,
      fontFamily: "'Quicksand', 'Comfortaa', sans-serif",
    }}>
      {/* Watercolor Header */}
      <div style={{
        marginLeft: '-20mm',
        marginRight: '-20mm',
        marginTop: '-20mm',
        marginBottom: '16pt',
        padding: '18pt',
        paddingTop: '22mm',
        background: `radial-gradient(circle at 20% 50%, ${colors.accent}40, transparent 50%), 
                     radial-gradient(circle at 80% 30%, ${colors.secondary}30, transparent 50%),
                     linear-gradient(135deg, ${colors.primary}20, ${colors.accent}10)`,
      }}>
        <div style={{ maxWidth: '170mm', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '16pt' }}>
          {cv.photoUrl && cv.photoOptions && (
            <div style={{
              width: '90pt',
              height: '90pt',
              borderRadius: '50%',
              border: `4pt solid white`,
              overflow: 'hidden',
              boxShadow: `0 8px 20px ${colors.primary}30`,
            }}>
              <img src={cv.photoUrl} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          )}
          <div>
            <h1 style={{ fontSize: '30pt', fontWeight: 700, margin: 0, color: colors.primary }}>
              {content.basics.firstName} {content.basics.lastName}
            </h1>
            {content.basics.headline && (
              <div style={{ fontSize: '13pt', marginTop: '4pt', color: colors.secondary, fontWeight: 500 }}>
                {content.basics.headline}
              </div>
            )}
            <div style={{ marginTop: '8pt', fontSize: '9pt', display: 'flex', gap: '12pt', opacity: 0.8 }}>
              {content.basics.email && <span>{content.basics.email}</span>}
              {content.basics.phone && <span>• {content.basics.phone}</span>}
            </div>
          </div>
        </div>
      </div>

      {/* Summary with soft background */}
      {content.summary && (
        <div style={{
          marginBottom: '16pt',
          padding: '14pt',
          background: `linear-gradient(120deg, ${colors.accent}15, transparent)`,
          borderRadius: '16pt',
          borderLeft: `5pt solid ${colors.primary}`,
        }}>
          <h2 style={{ color: colors.primary, fontSize: '12pt', fontWeight: 700, marginBottom: '8pt' }}>
            About Me
          </h2>
          <p style={{ fontSize: '9pt', lineHeight: 1.8, margin: 0 }}>{content.summary}</p>
        </div>
      )}

      {/* Experience with soft cards */}
      {content.experiences && content.experiences.length > 0 && (
        <div style={{ marginBottom: '16pt' }}>
          <h2 style={{ 
            color: colors.primary,
            fontSize: '14pt',
            fontWeight: 700,
            marginBottom: '12pt',
          }}>
            Experience
          </h2>
          {content.experiences.map((exp, idx) => (
            <div key={idx} style={{
              marginBottom: '12pt',
              padding: '14pt',
              background: `linear-gradient(135deg, white, ${colors.accent}05)`,
              borderRadius: '12pt',
              boxShadow: `0 4px 12px ${colors.primary}10`,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6pt' }}>
                <div>
                  <h3 style={{ fontSize: '11pt', fontWeight: 700, color: colors.primary, margin: 0 }}>
                    {exp.title}
                  </h3>
                  <div style={{ fontSize: '10pt', marginTop: '3pt', fontWeight: 600, color: colors.secondary }}>
                    {exp.company}
                  </div>
                </div>
                <div style={{
                  fontSize: '8pt',
                  backgroundColor: `${colors.accent}30`,
                  color: colors.primary,
                  padding: '5pt 12pt',
                  borderRadius: '16pt',
                  height: 'fit-content',
                  fontWeight: 500,
                }}>
                  {exp.startDate} - {exp.isCurrent ? 'Present' : exp.endDate}
                </div>
              </div>
              {exp.bullets && exp.bullets.length > 0 && (
                <ul style={{ margin: '8pt 0 0 0', paddingLeft: '14pt', fontSize: '9pt', lineHeight: 1.7 }}>
                  {exp.bullets.filter(Boolean).map((bullet: string, i: number) => (
                    <li key={i} style={{ marginBottom: '4pt' }}>{bullet}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Education & Skills with soft design */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14pt' }}>
        {content.education && content.education.length > 0 && (
          <div>
            <h2 style={{ color: colors.primary, fontSize: '12pt', fontWeight: 700, marginBottom: '10pt' }}>
              Education
            </h2>
            {content.education.map((edu, idx) => (
              <div key={idx} style={{
                marginBottom: '10pt',
                padding: '12pt',
                background: `linear-gradient(120deg, white, ${colors.accent}10)`,
                borderRadius: '12pt',
                boxShadow: `0 2px 8px ${colors.primary}08`,
              }}>
                <div style={{ fontSize: '10pt', fontWeight: 700, color: colors.primary }}>{edu.school}</div>
                {edu.degree && <div style={{ fontSize: '9pt', marginTop: '3pt' }}>{edu.degree}</div>}
                {edu.startDate && (
                  <div style={{ fontSize: '8pt', color: '#64748b', marginTop: '3pt' }}>
                    {edu.startDate} - {edu.endDate}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {content.skills && content.skills.length > 0 && (
          <div>
            <h2 style={{ color: colors.primary, fontSize: '12pt', fontWeight: 700, marginBottom: '10pt' }}>
              Skills
            </h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6pt' }}>
              {content.skills.map((skill, idx) => (
                <span key={idx} style={{
                  background: `linear-gradient(135deg, ${colors.primary}20, ${colors.accent}20)`,
                  color: colors.primary,
                  padding: '6pt 12pt',
                  borderRadius: '20pt',
                  fontSize: '8pt',
                  fontWeight: 600,
                  boxShadow: `0 2px 6px ${colors.primary}15`,
                }}>
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
