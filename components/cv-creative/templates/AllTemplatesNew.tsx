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

// 4. Dark Mode Pro - Sidebar with gradient accent
export function DarkModePro({ cv }: TemplateProps) {
  const colors = cv.colorScheme || { primary: "#6366f1", secondary: "#8b5cf6", accent: "#a78bfa", background: "#0f172a", text: "#f1f5f9" };
  const content = cv.content;
  if (!content) return null;

  return (
    <div className="cv-template" style={{ 
      backgroundColor: colors.background,
      color: colors.text,
      display: 'flex',
      minHeight: '297mm',
      fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif",
    }}>
      {/* LEFT SIDEBAR - 32% width for better ratio */}
      <div style={{
        width: '32%',
        background: `linear-gradient(180deg, ${colors.background} 0%, ${colors.primary}20 100%)`,
        borderRight: `1px solid ${colors.primary}30`,
        padding: '15mm 10mm',
        display: 'flex',
        flexDirection: 'column',
        gap: '12mm',
      }}>
        {/* Photo Area */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15pt' }}>
          {cv.photoUrl && cv.photoOptions && (
            <div style={{
              width: '110pt',
              height: '110pt',
              borderRadius: '50%',
              padding: '4pt',
              border: `1pt solid ${colors.accent}50`,
              background: `linear-gradient(135deg, ${colors.primary}20, transparent)`,
            }}>
              <div style={{
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                overflow: 'hidden',
              }}>
                <img src={cv.photoUrl} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            </div>
          )}
        </div>

        {/* Contact Info - Clean & Minimal */}
        <div>
          <h3 style={{ 
            color: colors.accent,
            fontSize: '9pt',
            fontWeight: 700,
            marginBottom: '12pt',
            textTransform: 'uppercase',
            letterSpacing: '2px',
            borderBottom: `1px solid ${colors.primary}40`,
            paddingBottom: '4pt',
            display: 'flex',
            alignItems: 'center',
            gap: '6pt'
          }}>
            <span style={{ fontSize: '12pt' }}>Connect</span>
          </h3>
          <div style={{ fontSize: '8.5pt', display: 'flex', flexDirection: 'column', gap: '10pt', opacity: 0.9 }}>
            {content.basics.email && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8pt' }}>
                <div style={{ color: colors.primary, fontSize: '11pt' }}>✉</div>
                <span style={{ wordBreak: 'break-all', fontWeight: 300 }}>{content.basics.email}</span>
              </div>
            )}
            {content.basics.phone && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8pt' }}>
                 <div style={{ color: colors.primary, fontSize: '11pt' }}>☎</div>
                <span style={{ fontWeight: 300 }}>{content.basics.phone}</span>
              </div>
            )}
            {content.basics.city && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8pt' }}>
                 <div style={{ color: colors.primary, fontSize: '11pt' }}>📍</div>
                <span style={{ fontWeight: 300 }}>{content.basics.city}</span>
              </div>
            )}
            {content.basics.linkedin && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8pt' }}>
                 <div style={{ color: colors.primary, fontSize: '11pt' }}>🔗</div>
                <span style={{ wordBreak: 'break-all', fontSize: '7.5pt', fontWeight: 300 }}>{content.basics.linkedin}</span>
              </div>
            )}
          </div>
        </div>

        {/* Skills - Tag Cloud Style */}
        {content.skills && content.skills.length > 0 && (
          <div>
             <h3 style={{ 
              color: colors.accent,
              fontSize: '9pt',
              fontWeight: 700,
              marginBottom: '12pt',
              textTransform: 'uppercase',
              letterSpacing: '2px',
              borderBottom: `1px solid ${colors.primary}40`,
              paddingBottom: '4pt',
            }}>
              Expertise
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6pt' }}>
              {content.skills.map((skill, idx) => (
                <span key={idx} style={{
                  backgroundColor: `${colors.primary}10`,
                  color: colors.text,
                  padding: '4pt 8pt',
                  borderRadius: '4pt',
                  fontSize: '8pt',
                  fontWeight: 500,
                  border: `1px solid ${colors.primary}20`,
                }}>
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Education - Minimal */}
        {content.education && content.education.length > 0 && (
          <div style={{ marginTop: 'auto' }}>
             <h3 style={{ 
              color: colors.accent,
              fontSize: '9pt',
              fontWeight: 700,
              marginBottom: '12pt',
              textTransform: 'uppercase',
              letterSpacing: '2px',
              borderBottom: `1px solid ${colors.primary}40`,
              paddingBottom: '4pt',
            }}>
              Education
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12pt' }}>
              {content.education.map((edu, idx) => (
                <div key={idx}>
                  <div style={{ fontSize: '9pt', fontWeight: 700, color: 'white' }}>{edu.school}</div>
                  {edu.degree && <div style={{ fontSize: '8.5pt', color: colors.accent, marginTop: '2pt' }}>{edu.degree}</div>}
                  {edu.startDate && (
                    <div style={{ fontSize: '8pt', color: colors.text, opacity: 0.5, marginTop: '2pt' }}>
                      {edu.startDate} — {edu.endDate}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* RIGHT MAIN AREA - 68% */}
      <div style={{ 
        width: '68%',
        padding: '15mm 15mm 15mm 18mm',
        display: 'flex',
        flexDirection: 'column',
        gap: '10mm',
      }}>
        {/* Header */}
        <div>
          <h1 style={{ 
            fontSize: '38pt',
            fontWeight: 800,
            margin: 0,
            backgroundImage: `linear-gradient(135deg, white, ${colors.accent})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            lineHeight: 1,
            letterSpacing: '-1px',
            marginBottom: '8pt'
          }}>
            {content.basics.firstName}<br/>{content.basics.lastName}
          </h1>
          {content.basics.headline && (
            <div style={{ 
              fontSize: '14pt',
              color: colors.primary,
              fontWeight: 500,
              letterSpacing: '0.5px',
              display: 'flex',
              alignItems: 'center',
              gap: '8pt'
            }}>
              <span style={{ width: '20pt', height: '2pt', background: colors.primary, display: 'inline-block' }} />
              {content.basics.headline}
            </div>
          )}
        </div>

        {/* Summary */}
        {content.summary && (
          <div>
            <h2 style={{ 
              color: 'white',
              fontSize: '11pt',
              fontWeight: 700,
              marginBottom: '8pt',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              display: 'flex',
              alignItems: 'center',
              gap: '8pt'
            }}>
              <span style={{ color: colors.accent }}>//</span> About Me
            </h2>
            <p style={{ fontSize: '9.5pt', lineHeight: 1.7, opacity: 0.85, fontWeight: 300 }}>{content.summary}</p>
          </div>
        )}

        {/* Experience - Modern Timeline */}
        {content.experiences && content.experiences.length > 0 && (
          <div style={{ flex: 1 }}>
            <h2 style={{ 
              color: 'white',
              fontSize: '11pt',
              fontWeight: 700,
              marginBottom: '12pt',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              display: 'flex',
              alignItems: 'center',
              gap: '8pt'
            }}>
              <span style={{ color: colors.accent }}>//</span> Professional Experience
            </h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16pt' }}>
              {content.experiences.map((exp, idx) => (
                <div key={idx} style={{ position: 'relative', paddingLeft: '16pt' }}>
                  {/* Timeline Line */}
                  <div style={{ 
                    position: 'absolute', 
                    left: 0, 
                    top: '6pt', 
                    bottom: 0, 
                    width: '1px', 
                    background: `${colors.primary}30` 
                  }} />
                  {/* Timeline Dot */}
                  <div style={{ 
                    position: 'absolute', 
                    left: '-2.5pt', 
                    top: '6pt', 
                    width: '6pt', 
                    height: '6pt', 
                    borderRadius: '50%', 
                    background: colors.accent,
                    boxShadow: `0 0 8px ${colors.accent}60`
                  }} />

                  <div style={{ marginBottom: '4pt' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                      <h3 style={{ fontSize: '12pt', fontWeight: 700, color: 'white', margin: 0 }}>{exp.title}</h3>
                      <span style={{ fontSize: '8pt', color: colors.accent, fontWeight: 500, opacity: 0.9 }}>
                        {exp.startDate} — {exp.isCurrent ? 'Present' : exp.endDate}
                      </span>
                    </div>
                    <div style={{ fontSize: '10pt', color: colors.primary, fontWeight: 500, marginTop: '2pt' }}>
                      {exp.company}
                    </div>
                  </div>

                  {exp.bullets && exp.bullets.length > 0 && (
                    <ul style={{ 
                      marginTop: '6pt', 
                      paddingLeft: '0', 
                      listStyle: 'none', 
                      fontSize: '9pt',
                      lineHeight: 1.6,
                      opacity: 0.8 
                    }}>
                      {exp.bullets.filter(Boolean).map((bullet: string, i: number) => (
                        <li key={i} style={{ marginBottom: '4pt', display: 'flex', gap: '6pt' }}>
                          <span style={{ color: colors.primary }}>›</span>
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Export remaining templates (will add more creative designs)
export { ColorfulBlocks, TimelineHero, PortfolioGrid, InfographicStyle, SplitScreen, GeometricModern, WatercolorArtist } from "./AllTemplates";
