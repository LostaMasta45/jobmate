"use client";

import * as React from "react";
import { CreativeCV } from "@/lib/schemas/cv-creative";

interface TemplateProps {
  cv: Partial<CreativeCV>;
}

// Helper component for photo
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

// 2. Bold Minimalist - Strong typography, minimal colors, Swiss-style
export function BoldMinimalist({ cv }: TemplateProps) {
  const colors = cv.colorScheme || { primary: "#0ea5e9", secondary: "#0284c7", accent: "#0ea5e9", background: "#ffffff", text: "#0f172a" };
  const content = cv.content;
  if (!content) return null;

  return (
    <div className="cv-template" style={{ 
      color: colors.text, 
      fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif",
      lineHeight: 1.5,
      backgroundColor: "white",
      minHeight: "297mm"
    }}>
      {/* Header - Bold & Minimal with thick border */}
      <div style={{ 
        borderBottom: `8pt solid ${colors.primary}`, 
        paddingBottom: "24pt", 
        marginBottom: "24pt" 
      }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: "24pt", justifyContent: "space-between" }}>
          <div style={{ flex: 1 }}>
            <h1 style={{ 
              fontSize: "42pt", 
              fontWeight: 900, 
              margin: 0, 
              textTransform: "uppercase", 
              letterSpacing: "-1.5pt",
              lineHeight: 0.9
            }}>
              {content.basics.firstName}<br/>
              <span style={{ color: colors.primary }}>{content.basics.lastName}</span>
            </h1>
            {content.basics.headline && (
              <p style={{ 
                fontSize: "14pt", 
                marginTop: "12pt", 
                fontWeight: 600, 
                color: "#334155",
                letterSpacing: "0.5px" 
              }}>
                {content.basics.headline.toUpperCase()}
              </p>
            )}
          </div>
          <div style={{ paddingTop: "8pt" }}>
             <PhotoComponent photo={cv.photoUrl} photoOpts={cv.photoOptions} borderColor={colors.primary} />
          </div>
        </div>
        
        <div style={{ 
          marginTop: "16pt", 
          fontSize: "9.5pt", 
          display: "flex", 
          flexWrap: "wrap", 
          gap: "16pt", 
          color: "#475569",
          fontWeight: 500
        }}>
          {content.basics.email && <span>✉ {content.basics.email}</span>}
          {content.basics.phone && <span>☎ {content.basics.phone}</span>}
          {content.basics.city && <span>📍 {content.basics.city}</span>}
          {content.basics.linkedin && <span>🔗 {content.basics.linkedin}</span>}
        </div>
      </div>

      {/* Two Column Layout for Body */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "32pt" }}>
        
        {/* Left Column */}
        <div>
          {/* Summary */}
          {content.summary && (
            <div style={{ marginBottom: "24pt" }}>
              <h2 style={{ 
                color: "#0f172a", 
                fontSize: "12pt", 
                fontWeight: 900, 
                borderBottom: "4pt solid #0f172a",
                paddingBottom: "6pt", 
                marginBottom: "12pt",
                letterSpacing: "1px"
              }}>PROFILE</h2>
              <p style={{ fontSize: "10pt", lineHeight: 1.6, color: "#334155" }}>{content.summary}</p>
            </div>
          )}

          {/* Experience */}
          {content.experiences && content.experiences.length > 0 && (
            <div style={{ marginBottom: "24pt" }}>
              <h2 style={{ 
                color: "#0f172a", 
                fontSize: "12pt", 
                fontWeight: 900, 
                borderBottom: "4pt solid #0f172a", 
                paddingBottom: "6pt",
                marginBottom: "16pt",
                letterSpacing: "1px"
              }}>EXPERIENCE</h2>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "20pt" }}>
                {content.experiences.map((exp, idx) => (
                  <div key={idx}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "4pt" }}>
                      <h3 style={{ fontWeight: 800, fontSize: "11pt", color: "#0f172a" }}>{exp.title}</h3>
                      <span style={{ fontSize: "9pt", color: "#64748b", fontWeight: 600 }}>
                        {exp.startDate} — {exp.isCurrent ? "Present" : exp.endDate}
                      </span>
                    </div>
                    <p style={{ fontSize: "10pt", color: colors.primary, fontWeight: 700, marginBottom: "8pt" }}>{exp.company}</p>
                    <ul style={{ margin: 0, paddingLeft: "0", listStyle: "none" }}>
                      {exp.bullets.map((bullet, i) => (
                        bullet.trim() && (
                          <li key={i} style={{ 
                            marginBottom: "4pt", 
                            fontSize: "9.5pt", 
                            color: "#334155", 
                            display: "flex", 
                            gap: "8pt" 
                          }}>
                            <span style={{ fontWeight: 900, color: "#0f172a" }}>·</span>
                            <span>{bullet}</span>
                          </li>
                        )
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column */}
        <div>
          {/* Skills */}
          {content.skills && content.skills.length > 0 && (
            <div style={{ marginBottom: "24pt" }}>
              <h2 style={{ 
                color: "#0f172a", 
                fontSize: "12pt", 
                fontWeight: 900, 
                borderBottom: "4pt solid #0f172a", 
                paddingBottom: "6pt", 
                marginBottom: "12pt",
                letterSpacing: "1px"
              }}>SKILLS</h2>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8pt" }}>
                {content.skills.map((skill, idx) => (
                  <span key={idx} style={{ 
                    backgroundColor: "#f1f5f9", 
                    color: "#0f172a", 
                    padding: "4pt 8pt", 
                    fontSize: "9pt", 
                    fontWeight: 700,
                    border: "1px solid #e2e8f0"
                  }}>
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {content.education && content.education.length > 0 && (
            <div style={{ marginBottom: "24pt" }}>
              <h2 style={{ 
                color: "#0f172a", 
                fontSize: "12pt", 
                fontWeight: 900, 
                borderBottom: "4pt solid #0f172a", 
                paddingBottom: "6pt", 
                marginBottom: "12pt",
                letterSpacing: "1px"
              }}>EDUCATION</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "12pt" }}>
                {content.education.map((edu, idx) => (
                  <div key={idx}>
                    <h3 style={{ fontWeight: 800, fontSize: "10.5pt", marginBottom: "2pt" }}>{edu.school}</h3>
                    {edu.degree && <p style={{ fontSize: "9.5pt", margin: 0, color: "#334155" }}>{edu.degree} {edu.field}</p>}
                    {edu.startDate && <p style={{ fontSize: "9pt", color: "#64748b", marginTop: "2pt", fontWeight: 500 }}>{edu.startDate} - {edu.endDate}</p>}
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

// 3. Pastel Professional - Soft colors, approachable, clean card style
export function PastelProfessional({ cv }: TemplateProps) {
  const colors = cv.colorScheme || { primary: "#10b981", secondary: "#34d399", accent: "#6ee7b7", background: "#ffffff", text: "#1e293b" };
  const content = cv.content;
  if (!content) return null;

  return (
    <div className="cv-template" style={{ 
      color: colors.text, 
      backgroundColor: "#f8fafc", // Very light slate
      fontFamily: "'Lato', sans-serif",
      minHeight: "297mm",
      padding: "20mm"
    }}>
      {/* Header Card */}
      <div style={{ 
        backgroundColor: "white",
        padding: "20pt",
        borderRadius: "16pt",
        marginBottom: "20pt",
        boxShadow: "0 2px 10px rgba(0,0,0,0.03)",
        display: "flex", 
        alignItems: "center", 
        gap: "20pt"
      }}>
        <PhotoComponent photo={cv.photoUrl} photoOpts={cv.photoOptions} borderColor={colors.primary} />
        <div style={{ flex: 1 }}>
          <h1 style={{ fontSize: "26pt", fontWeight: 800, margin: 0, color: "#0f172a" }}>
            {content.basics.firstName} {content.basics.lastName}
          </h1>
          {content.basics.headline && (
            <p style={{ fontSize: "12pt", marginTop: "4pt", color: colors.primary, fontWeight: 600 }}>{content.basics.headline}</p>
          )}
          <div style={{ marginTop: "8pt", fontSize: "9pt", display: "flex", flexWrap: "wrap", gap: "12pt", color: "#64748b" }}>
            {content.basics.email && <span>{content.basics.email}</span>}
            {content.basics.phone && <span>• {content.basics.phone}</span>}
            {content.basics.city && <span>• {content.basics.city}</span>}
          </div>
        </div>
      </div>

      {/* Summary Card */}
      {content.summary && (
        <div style={{ 
          backgroundColor: "white",
          padding: "16pt",
          borderRadius: "12pt",
          marginBottom: "20pt",
          boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
          borderLeft: `6pt solid ${colors.primary}`
        }}>
          <h2 style={{ color: "#0f172a", margin: 0, marginBottom: "8pt", fontSize: "11pt", fontWeight: 700 }}>About Me</h2>
          <p style={{ fontSize: "9.5pt", lineHeight: 1.6, color: "#334155" }}>{content.summary}</p>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "20pt" }}>
        {/* Main Column */}
        <div>
          {/* Experience */}
          {content.experiences && content.experiences.length > 0 && (
            <div style={{ 
              backgroundColor: "white",
              padding: "16pt",
              borderRadius: "12pt",
              boxShadow: "0 2px 8px rgba(0,0,0,0.03)"
            }}>
              <h2 style={{ 
                color: colors.primary,
                fontSize: "11pt",
                fontWeight: 700,
                marginBottom: "16pt",
                display: "flex",
                alignItems: "center",
                gap: "8pt"
              }}>
                <span style={{ width: "24pt", height: "4pt", backgroundColor: colors.secondary, borderRadius: "2pt" }}></span>
                EXPERIENCE
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "16pt" }}>
                {content.experiences.map((exp, idx) => (
                  <div key={idx} style={{ 
                    borderLeft: `2px solid ${colors.accent}40`, 
                    paddingLeft: "12pt",
                    marginLeft: "4pt"
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <h3 style={{ fontSize: "11pt", fontWeight: 700, color: "#0f172a", margin: 0 }}>{exp.title}</h3>
                      <span style={{ fontSize: "8pt", color: "#64748b", backgroundColor: "#f1f5f9", padding: "2pt 6pt", borderRadius: "4pt" }}>
                        {exp.startDate} - {exp.isCurrent ? "Present" : exp.endDate}
                      </span>
                    </div>
                    <p style={{ fontSize: "9.5pt", margin: "2pt 0 6pt 0", color: colors.primary, fontWeight: 600 }}>{exp.company}</p>
                    <ul style={{ margin: 0, paddingLeft: "12pt", fontSize: "9pt", lineHeight: 1.5, color: "#334155" }}>
                      {exp.bullets.map((bullet, i) => (
                        bullet.trim() && <li key={i} style={{ marginBottom: "3pt" }}>{bullet}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Column */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20pt" }}>
          {/* Education */}
          {content.education && content.education.length > 0 && (
            <div style={{ 
              backgroundColor: "white",
              padding: "16pt",
              borderRadius: "12pt",
              boxShadow: "0 2px 8px rgba(0,0,0,0.03)"
            }}>
              <h2 style={{ 
                color: colors.primary,
                fontSize: "11pt",
                fontWeight: 700,
                marginBottom: "12pt"
              }}>EDUCATION</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "12pt" }}>
                {content.education.map((edu, idx) => (
                  <div key={idx}>
                    <h3 style={{ fontSize: "10pt", fontWeight: 700, color: "#0f172a" }}>{edu.school}</h3>
                    {edu.degree && <p style={{ fontSize: "9pt", margin: "2pt 0", color: "#334155" }}>{edu.degree} {edu.field}</p>}
                    {edu.startDate && <p style={{ fontSize: "8pt", color: "#94a3b8" }}>{edu.startDate} - {edu.endDate}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Skills */}
          {content.skills && content.skills.length > 0 && (
            <div style={{ 
              backgroundColor: "white",
              padding: "16pt",
              borderRadius: "12pt",
              boxShadow: "0 2px 8px rgba(0,0,0,0.03)"
            }}>
              <h2 style={{ 
                color: colors.primary,
                fontSize: "11pt",
                fontWeight: 700,
                marginBottom: "12pt"
              }}>SKILLS</h2>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6pt" }}>
                {content.skills.map((skill, idx) => (
                  <span key={idx} style={{
                    backgroundColor: `${colors.primary}10`,
                    color: colors.primary,
                    padding: "4pt 10pt",
                    borderRadius: "20pt",
                    fontSize: "8.5pt",
                    fontWeight: 600,
                  }}>
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// 4. Dark Mode Pro - Midnight Executive Style
export function DarkModePro({ cv }: TemplateProps) {
  const colors = cv.colorScheme || { primary: "#3b82f6", secondary: "#60a5fa", accent: "#818cf8", background: "#0f172a", text: "#f8fafc" };
  const content = cv.content;
  if (!content) return null;

  return (
    <div className="cv-template" style={{ 
      backgroundColor: "#020617", // Darker slate
      color: "#e2e8f0",
      display: 'flex',
      flexDirection: 'column',
      minHeight: '297mm',
      fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif",
      padding: '18mm',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background Glows */}
      <div style={{
        position: 'absolute',
        top: '-100pt',
        right: '-50pt',
        width: '400pt',
        height: '400pt',
        borderRadius: '50%',
        background: `radial-gradient(circle, ${colors.primary}15 0%, transparent 70%)`,
        zIndex: 0
      }} />
      
      <div style={{
        position: 'absolute',
        bottom: '-100pt',
        left: '-50pt',
        width: '300pt',
        height: '300pt',
        borderRadius: '50%',
        background: `radial-gradient(circle, ${colors.accent}10 0%, transparent 70%)`,
        zIndex: 0
      }} />

      {/* Header Section - Horizontal with Photo Left */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '20pt', 
        marginBottom: '24pt',
        position: 'relative',
        zIndex: 1,
        borderBottom: `1px solid ${colors.primary}20`,
        paddingBottom: '20pt'
      }}>
        {/* Photo with Cyber Border */}
        <div style={{ position: 'relative' }}>
          <div style={{
            position: 'absolute',
            inset: '-3pt',
            borderRadius: '24pt',
            background: `linear-gradient(135deg, ${colors.primary}, ${colors.accent})`,
            opacity: 0.7,
            filter: 'blur(2px)'
          }} />
          <div style={{
            width: '100pt',
            height: '100pt',
            borderRadius: '22pt',
            overflow: 'hidden',
            position: 'relative',
            background: '#0f172a',
            border: '2pt solid rgba(255,255,255,0.1)'
          }}>
            {cv.photoUrl ? (
              <img src={cv.photoUrl} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: colors.primary }}>
                No Photo
              </div>
            )}
          </div>
        </div>

        {/* Name & Title */}
        <div style={{ flex: 1 }}>
          <h1 style={{ 
            fontSize: '36pt', 
            fontWeight: 800, 
            margin: 0, 
            lineHeight: 1.1,
            letterSpacing: '-0.5px',
            color: '#f8fafc'
          }}>
            {content.basics.firstName} <span style={{ color: colors.primary }}>{content.basics.lastName}</span>
          </h1>
          <div style={{ 
            fontSize: '14pt', 
            color: colors.accent, 
            marginTop: '6pt',
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            gap: '10pt'
          }}>
            <span style={{ padding: '2pt 8pt', background: `${colors.primary}20`, borderRadius: '4pt', fontSize: '10pt', border: `1px solid ${colors.primary}40` }}>
              {content.basics.headline || "Professional Title"}
            </span>
          </div>
          
          {/* Contact Row */}
          <div style={{ 
            display: 'flex', 
            gap: '16pt', 
            marginTop: '12pt', 
            fontSize: '9pt',
            color: '#94a3b8',
            flexWrap: 'wrap'
          }}>
            {content.basics.email && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6pt' }}>
                <span style={{ color: colors.primary }}>✉</span> {content.basics.email}
              </div>
            )}
            {content.basics.phone && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6pt' }}>
                <span style={{ color: colors.primary }}>📱</span> {content.basics.phone}
              </div>
            )}
            {content.basics.city && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6pt' }}>
                <span style={{ color: colors.primary }}>📍</span> {content.basics.city}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24pt', position: 'relative', zIndex: 1, flex: 1 }}>
        
        {/* Main Column (Left) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20pt' }}>
          
          {/* Summary Card */}
          {content.summary && (
            <div style={{ 
              background: 'rgba(30, 41, 59, 0.4)', 
              border: '1px solid rgba(148, 163, 184, 0.1)',
              borderRadius: '12pt',
              padding: '16pt',
              backdropFilter: 'blur(10px)'
            }}>
              <h2 style={{ 
                fontSize: '12pt', 
                fontWeight: 700, 
                color: 'white', 
                marginBottom: '10pt',
                display: 'flex',
                alignItems: 'center',
                gap: '8pt'
              }}>
                <span style={{ width: '4pt', height: '16pt', background: colors.accent, borderRadius: '2pt' }} />
                PROFILE
              </h2>
              <p style={{ fontSize: '9.5pt', lineHeight: 1.7, color: '#cbd5e1', margin: 0 }}>
                {content.summary}
              </p>
            </div>
          )}

          {/* Experience Timeline */}
          {content.experiences && content.experiences.length > 0 && (
            <div style={{ 
              background: 'rgba(30, 41, 59, 0.4)', 
              border: '1px solid rgba(148, 163, 184, 0.1)',
              borderRadius: '12pt',
              padding: '16pt',
              flex: 1
            }}>
              <h2 style={{ 
                fontSize: '12pt', 
                fontWeight: 700, 
                color: 'white', 
                marginBottom: '16pt',
                display: 'flex',
                alignItems: 'center',
                gap: '8pt'
              }}>
                <span style={{ width: '4pt', height: '16pt', background: colors.accent, borderRadius: '2pt' }} />
                EXPERIENCE
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16pt' }}>
                {content.experiences.map((exp, idx) => (
                  <div key={idx} style={{ position: 'relative', paddingLeft: '14pt', borderLeft: `1px solid ${colors.primary}30` }}>
                    {/* Dot */}
                    <div style={{
                      position: 'absolute',
                      left: '-3pt',
                      top: '6pt',
                      width: '5pt',
                      height: '5pt',
                      borderRadius: '50%',
                      background: colors.primary,
                      boxShadow: `0 0 8px ${colors.primary}`
                    }} />
                    
                    <div style={{ marginBottom: '6pt' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <h3 style={{ fontSize: '11pt', fontWeight: 700, color: 'white', margin: 0 }}>{exp.title}</h3>
                        <span style={{ 
                          fontSize: '8pt', 
                          color: colors.accent, 
                          background: 'rgba(59, 130, 246, 0.1)', 
                          padding: '2pt 6pt', 
                          borderRadius: '4pt',
                          border: `1px solid ${colors.primary}30`
                        }}>
                          {exp.startDate} — {exp.isCurrent ? 'Now' : exp.endDate}
                        </span>
                      </div>
                      <div style={{ fontSize: '9.5pt', color: colors.primary, fontWeight: 500, marginTop: '2pt' }}>
                        {exp.company}
                      </div>
                    </div>

                    {exp.bullets && exp.bullets.length > 0 && (
                      <ul style={{ margin: 0, paddingLeft: '12pt', fontSize: '9pt', lineHeight: 1.6, color: '#94a3b8' }}>
                        {exp.bullets.filter(Boolean).map((bullet: string, i: number) => (
                          <li key={i} style={{ marginBottom: '3pt' }}>{bullet}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Column (Right) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20pt' }}>
          
          {/* Skills */}
          {content.skills && content.skills.length > 0 && (
            <div style={{ 
              background: 'rgba(30, 41, 59, 0.4)', 
              border: '1px solid rgba(148, 163, 184, 0.1)',
              borderRadius: '12pt',
              padding: '16pt'
            }}>
              <h2 style={{ 
                fontSize: '11pt', 
                fontWeight: 700, 
                color: 'white', 
                marginBottom: '12pt',
                borderBottom: `1px solid ${colors.primary}30`,
                paddingBottom: '8pt'
              }}>
                SKILLS
              </h2>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6pt' }}>
                {content.skills.map((skill, idx) => (
                  <span key={idx} style={{
                    fontSize: '8pt',
                    color: '#e2e8f0',
                    background: 'rgba(15, 23, 42, 0.6)',
                    border: `1px solid ${colors.primary}40`,
                    padding: '4pt 8pt',
                    borderRadius: '6pt',
                    fontWeight: 500
                  }}>
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {content.education && content.education.length > 0 && (
            <div style={{ 
              background: 'rgba(30, 41, 59, 0.4)', 
              border: '1px solid rgba(148, 163, 184, 0.1)',
              borderRadius: '12pt',
              padding: '16pt'
            }}>
              <h2 style={{ 
                fontSize: '11pt', 
                fontWeight: 700, 
                color: 'white', 
                marginBottom: '12pt',
                borderBottom: `1px solid ${colors.primary}30`,
                paddingBottom: '8pt'
              }}>
                EDUCATION
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12pt' }}>
                {content.education.map((edu, idx) => (
                  <div key={idx}>
                    <div style={{ fontSize: '9.5pt', fontWeight: 700, color: 'white' }}>{edu.school}</div>
                    {edu.degree && <div style={{ fontSize: '9pt', color: colors.accent, marginTop: '2pt' }}>{edu.degree}</div>}
                    {edu.startDate && (
                      <div style={{ fontSize: '8pt', color: '#64748b', marginTop: '2pt' }}>
                        {edu.startDate} — {edu.endDate}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Languages or Extra (Placeholder) */}
          <div style={{ 
            background: `linear-gradient(135deg, ${colors.primary}20, transparent)`, 
            border: `1px solid ${colors.primary}30`,
            borderRadius: '12pt',
            padding: '16pt',
            marginTop: 'auto'
          }}>
            <div style={{ fontSize: '9pt', color: '#cbd5e1', textAlign: 'center', fontStyle: 'italic' }}>
              "Technology is best when it brings people together."
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

// Export remaining templates (will add more creative designs)
export { ColorfulBlocks, TimelineHero, PortfolioGrid, InfographicStyle, SplitScreen, GeometricModern, WatercolorArtist } from "./AllTemplates";
