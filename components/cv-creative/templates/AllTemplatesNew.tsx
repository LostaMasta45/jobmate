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

// 2. Bold Minimalist - Strong typography, minimal colors
export function BoldMinimalist({ cv }: TemplateProps) {
  const colors = cv.colorScheme || { primary: "#0ea5e9", secondary: "#0284c7", accent: "#0ea5e9", background: "#ffffff", text: "#0f172a" };
  const content = cv.content;
  if (!content) return null;

  return (
    <div className="cv-template" style={{ color: colors.text, fontFamily: "'Helvetica Neue', Arial, sans-serif" }}>
      {/* Header - Bold & Minimal */}
      <div style={{ borderBottom: `4pt solid ${colors.primary}`, paddingBottom: "12pt", marginBottom: "12pt" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "16pt", justifyContent: "space-between" }}>
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: "32pt", fontWeight: 900, margin: 0, textTransform: "uppercase", letterSpacing: "-1pt" }}>
              {content.basics.firstName}<br/>{content.basics.lastName}
            </h1>
            {content.basics.headline && (
              <p style={{ fontSize: "12pt", marginTop: "6pt", fontWeight: 600, color: colors.primary }}>
                {content.basics.headline}
              </p>
            )}
          </div>
          <PhotoComponent photo={cv.photoUrl} photoOpts={cv.photoOptions} borderColor={colors.primary} />
        </div>
        <div style={{ marginTop: "8pt", fontSize: "9pt", display: "flex", flexWrap: "wrap", gap: "12pt", color: colors.text }}>
          {content.basics.email && <span>✉ {content.basics.email}</span>}
          {content.basics.phone && <span>☎ {content.basics.phone}</span>}
          {content.basics.city && <span>📍 {content.basics.city}</span>}
        </div>
      </div>

      {/* Summary */}
      {content.summary && (
        <div style={{ marginBottom: "12pt", borderLeft: `3pt solid ${colors.primary}`, paddingLeft: "10pt" }}>
          <h2 style={{ color: colors.primary, fontSize: "11pt", fontWeight: 700 }}>PROFILE</h2>
          <p style={{ fontSize: "9pt" }}>{content.summary}</p>
        </div>
      )}

      {/* Experience */}
      {content.experiences && content.experiences.length > 0 && (
        <div style={{ marginBottom: "12pt" }}>
          <h2 style={{ color: colors.primary, fontSize: "11pt", fontWeight: 700, borderBottom: `2pt solid ${colors.primary}`, paddingBottom: "4pt" }}>EXPERIENCE</h2>
          {content.experiences.map((exp, idx) => (
            <div key={idx} style={{ marginTop: "8pt" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <h3 style={{ fontWeight: 700, fontSize: "10pt" }}>{exp.title}</h3>
                <span style={{ fontSize: "8pt", color: "#64748b" }}>{exp.startDate} - {exp.isCurrent ? "Present" : exp.endDate}</span>
              </div>
              <p style={{ fontSize: "9pt", color: colors.primary, margin: "2pt 0" }}>{exp.company}</p>
              <ul style={{ marginTop: "4pt", paddingLeft: "14pt", fontSize: "9pt" }}>
                {exp.bullets.map((bullet, i) => bullet.trim() && <li key={i} style={{ marginBottom: "2pt" }}>{bullet}</li>)}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {content.education && content.education.length > 0 && (
        <div style={{ marginBottom: "12pt" }}>
          <h2 style={{ color: colors.primary, fontSize: "11pt", fontWeight: 700, borderBottom: `2pt solid ${colors.primary}`, paddingBottom: "4pt" }}>EDUCATION</h2>
          {content.education.map((edu, idx) => (
            <div key={idx} style={{ marginTop: "6pt" }}>
              <h3 style={{ fontWeight: 700, fontSize: "10pt" }}>{edu.school}</h3>
              {edu.degree && <p style={{ fontSize: "9pt", margin: "2pt 0" }}>{edu.degree} {edu.field}</p>}
              {edu.startDate && <p style={{ fontSize: "8pt", color: "#64748b" }}>{edu.startDate} - {edu.endDate}</p>}
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {content.skills && content.skills.length > 0 && (
        <div>
          <h2 style={{ color: colors.primary, fontSize: "11pt", fontWeight: 700, borderBottom: `2pt solid ${colors.primary}`, paddingBottom: "4pt" }}>SKILLS</h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6pt", marginTop: "8pt" }}>
            {content.skills.map((skill, idx) => (
              <span key={idx} style={{ backgroundColor: colors.primary, color: "white", padding: "3pt 8pt", fontSize: "9pt", fontWeight: 600 }}>
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// 3. Pastel Professional - Soft colors, approachable
export function PastelProfessional({ cv }: TemplateProps) {
  const colors = cv.colorScheme || { primary: "#10b981", secondary: "#34d399", accent: "#6ee7b7", background: "#ffffff", text: "#1e293b" };
  const content = cv.content;
  if (!content) return null;

  return (
    <div className="cv-template" style={{ color: colors.text, backgroundColor: "#fafaf9" }}>
      {/* Header with pastel background */}
      <div style={{ 
        background: `linear-gradient(120deg, ${colors.secondary}30, ${colors.accent}30)`,
        padding: "16pt",
        borderRadius: "12pt",
        marginBottom: "12pt",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "16pt" }}>
          <PhotoComponent photo={cv.photoUrl} photoOpts={cv.photoOptions} borderColor={colors.primary} />
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: "22pt", fontWeight: 600, margin: 0, color: colors.primary }}>
              {content.basics.firstName} {content.basics.lastName}
            </h1>
            {content.basics.headline && (
              <p style={{ fontSize: "11pt", marginTop: "4pt", color: colors.text, opacity: 0.8 }}>{content.basics.headline}</p>
            )}
            <div style={{ marginTop: "6pt", fontSize: "8pt", display: "flex", flexWrap: "wrap", gap: "10pt", opacity: 0.7 }}>
              {content.basics.email && <span>{content.basics.email}</span>}
              {content.basics.phone && <span>• {content.basics.phone}</span>}
              {content.basics.city && <span>• {content.basics.city}</span>}
            </div>
          </div>
        </div>
      </div>

      {/* Summary with pastel border */}
      {content.summary && (
        <div style={{ 
          backgroundColor: `${colors.primary}10`,
          padding: "12pt",
          borderRadius: "8pt",
          marginBottom: "12pt",
          borderLeft: `4pt solid ${colors.primary}`,
        }}>
          <h2 style={{ color: colors.primary, margin: 0, marginBottom: "6pt", fontSize: "11pt" }}>About Me</h2>
          <p style={{ fontSize: "9pt", lineHeight: 1.6 }}>{content.summary}</p>
        </div>
      )}

      {/* Content sections */}
      {content.experiences && content.experiences.length > 0 && (
        <div style={{ marginBottom: "12pt" }}>
          <h2 style={{ 
            color: colors.primary,
            backgroundColor: `${colors.primary}15`,
            padding: "6pt 10pt",
            borderRadius: "6pt",
            fontSize: "11pt",
            fontWeight: 600,
          }}>Work Experience</h2>
          {content.experiences.map((exp, idx) => (
            <div key={idx} style={{ marginTop: "10pt", paddingLeft: "10pt", borderLeft: `2pt solid ${colors.accent}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                <div>
                  <h3 style={{ fontSize: "10pt", fontWeight: 600, color: colors.primary }}>{exp.title}</h3>
                  <p style={{ fontSize: "9pt", margin: "2pt 0", color: colors.text, opacity: 0.8 }}>{exp.company}</p>
                </div>
                <span style={{ fontSize: "8pt", color: "#64748b", whiteSpace: "nowrap", marginLeft: "8pt" }}>
                  {exp.startDate} - {exp.isCurrent ? "Present" : exp.endDate}
                </span>
              </div>
              <ul style={{ marginTop: "4pt", paddingLeft: "14pt", fontSize: "9pt" }}>
                {exp.bullets.map((bullet, i) => bullet.trim() && <li key={i} style={{ marginBottom: "2pt" }}>{bullet}</li>)}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* Education & Skills in 2 columns */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12pt" }}>
        {content.education && content.education.length > 0 && (
          <div>
            <h2 style={{ 
              color: colors.primary,
              backgroundColor: `${colors.primary}15`,
              padding: "6pt 10pt",
              borderRadius: "6pt",
              fontSize: "11pt",
              fontWeight: 600,
            }}>Education</h2>
            {content.education.map((edu, idx) => (
              <div key={idx} style={{ marginTop: "8pt" }}>
                <h3 style={{ fontSize: "10pt", fontWeight: 600 }}>{edu.school}</h3>
                {edu.degree && <p style={{ fontSize: "9pt", margin: "2pt 0" }}>{edu.degree} {edu.field}</p>}
                {edu.startDate && <p style={{ fontSize: "8pt", color: "#64748b" }}>{edu.startDate} - {edu.endDate}</p>}
              </div>
            ))}
          </div>
        )}

        {content.skills && content.skills.length > 0 && (
          <div>
            <h2 style={{ 
              color: colors.primary,
              backgroundColor: `${colors.primary}15`,
              padding: "6pt 10pt",
              borderRadius: "6pt",
              fontSize: "11pt",
              fontWeight: 600,
            }}>Skills</h2>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "5pt", marginTop: "8pt" }}>
              {content.skills.map((skill, idx) => (
                <span key={idx} style={{
                  backgroundColor: `${colors.primary}20`,
                  color: colors.primary,
                  padding: "4pt 8pt",
                  borderRadius: "10pt",
                  fontSize: "8pt",
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
