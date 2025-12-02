"use client";

import * as React from "react";
import { CreativeCV } from "@/lib/schemas/cv-creative";

interface ModernGradientProps {
  cv: Partial<CreativeCV>;
}

export function ModernGradient({ cv }: ModernGradientProps) {
  const colors = cv.colorScheme || { primary: "#6366f1", secondary: "#8b5cf6", accent: "#a855f7", background: "#ffffff", text: "#1e293b" };
  const content = cv.content;
  const photo = cv.photoUrl;
  const photoOpts = cv.photoOptions;

  if (!content) return null;

  return (
    <div className="cv-template" style={{ 
      color: colors.text, 
      fontFamily: "'Inter', sans-serif",
      lineHeight: 1.5,
      backgroundColor: "white",
      minHeight: "297mm"
    }}>
      {/* Header with gradient */}
      <div 
        style={{ 
          background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
          padding: "24pt",
          borderRadius: "8pt",
          marginBottom: "20pt",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "20pt" }}>
          {photo && photoOpts && (
            <div
              style={{
                flexShrink: 0,
                width: photoOpts.size === "small" ? "70pt" : photoOpts.size === "large" ? "110pt" : "90pt",
                height: photoOpts.size === "small" ? "70pt" : photoOpts.size === "large" ? "110pt" : "90pt",
                borderRadius: photoOpts.shape === "circle" ? "50%" : photoOpts.shape === "rounded-square" ? "12pt" : "0",
                border: photoOpts.border.style !== "none" ? `${photoOpts.border.width}px ${photoOpts.border.style} white` : "none",
                overflow: "hidden",
                backgroundColor: "white",
                boxShadow: "0 4px 8px rgba(0,0,0,0.2)"
              }}
            >
              <img src={photo} alt="Profile" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
          )}
          <div style={{ flex: 1, color: "white" }}>
            <h1 style={{ margin: 0, fontSize: "28pt", fontWeight: 800, lineHeight: 1.1, letterSpacing: "-0.5px" }}>
              {content.basics.firstName} {content.basics.lastName}
            </h1>
            {content.basics.headline && (
              <p style={{ margin: "6pt 0 0 0", fontSize: "12pt", opacity: 0.95, fontWeight: 500 }}>{content.basics.headline}</p>
            )}
            <div style={{ marginTop: "10pt", fontSize: "9pt", opacity: 0.9, display: "flex", flexWrap: "wrap", gap: "12pt", fontWeight: 500 }}>
              {content.basics.email && <span style={{ display: "flex", alignItems: "center", gap: "4pt" }}>✉ {content.basics.email}</span>}
              {content.basics.phone && <span style={{ display: "flex", alignItems: "center", gap: "4pt" }}>📱 {content.basics.phone}</span>}
              {content.basics.city && <span style={{ display: "flex", alignItems: "center", gap: "4pt" }}>📍 {content.basics.city}</span>}
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding: "0 8pt" }}>
        {/* Summary */}
        {content.summary && (
          <div style={{ marginBottom: "20pt" }}>
            <h2 style={{ 
              color: colors.primary, 
              fontSize: "11pt", 
              fontWeight: 700, 
              borderBottom: `2px solid ${colors.primary}20`, 
              paddingBottom: "6pt", 
              marginBottom: "8pt",
              textTransform: "uppercase",
              letterSpacing: "1px"
            }}>SUMMARY</h2>
            <p style={{ fontSize: "9.5pt", color: "#334155", lineHeight: 1.6 }}>{content.summary}</p>
          </div>
        )}

        {/* Experience */}
        {content.experiences && content.experiences.length > 0 && (
          <div style={{ marginBottom: "20pt" }}>
            <h2 style={{ 
              color: colors.primary, 
              fontSize: "11pt", 
              fontWeight: 700, 
              borderBottom: `2px solid ${colors.primary}20`, 
              paddingBottom: "6pt", 
              marginBottom: "12pt",
              textTransform: "uppercase",
              letterSpacing: "1px"
            }}>PROFESSIONAL EXPERIENCE</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "16pt" }}>
              {content.experiences.map((exp, idx) => (
                <div key={idx}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "2pt" }}>
                    <h3 style={{ fontSize: "11pt", fontWeight: 700, color: "#0f172a" }}>{exp.title}</h3>
                    <span style={{ 
                      fontSize: "8.5pt", 
                      color: colors.primary, 
                      fontWeight: 600, 
                      whiteSpace: "nowrap",
                      backgroundColor: `${colors.primary}10`,
                      padding: "2pt 8pt",
                      borderRadius: "4pt"
                    }}>
                      {exp.startDate} - {exp.isCurrent ? "Present" : exp.endDate}
                    </span>
                  </div>
                  <p style={{ fontSize: "10pt", color: "#475569", fontWeight: 500, marginBottom: "6pt" }}>
                    {exp.company}
                  </p>
                  <ul style={{ margin: 0, paddingLeft: "0", listStyle: "none" }}>
                    {exp.bullets.map((bullet, i) => (
                      bullet.trim() && (
                        <li key={i} style={{ 
                          marginBottom: "3pt", 
                          fontSize: "9.5pt", 
                          color: "#334155", 
                          display: "flex", 
                          gap: "6pt",
                          alignItems: "flex-start"
                        }}>
                          <span style={{ color: colors.primary, marginTop: "4pt", fontSize: "6pt" }}>●</span>
                          <span style={{ flex: 1 }}>{bullet}</span>
                        </li>
                      )
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24pt" }}>
          {/* Education */}
          {content.education && content.education.length > 0 && (
            <div>
              <h2 style={{ 
                color: colors.primary, 
                fontSize: "11pt", 
                fontWeight: 700, 
                borderBottom: `2px solid ${colors.primary}20`, 
                paddingBottom: "6pt", 
                marginBottom: "12pt",
                textTransform: "uppercase",
                letterSpacing: "1px"
              }}>EDUCATION</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "12pt" }}>
                {content.education.map((edu, idx) => (
                  <div key={idx}>
                    <h3 style={{ fontSize: "10pt", fontWeight: 700, color: "#0f172a" }}>{edu.school}</h3>
                    {edu.degree && <p style={{ fontSize: "9pt", margin: "2pt 0", color: "#334155" }}>{edu.degree} {edu.field}</p>}
                    {edu.startDate && (
                      <p style={{ fontSize: "8.5pt", color: "#64748b", marginTop: "2pt" }}>
                        {edu.startDate} - {edu.endDate}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Skills */}
          {content.skills && content.skills.length > 0 && (
            <div>
              <h2 style={{ 
                color: colors.primary, 
                fontSize: "11pt", 
                fontWeight: 700, 
                borderBottom: `2px solid ${colors.primary}20`, 
                paddingBottom: "6pt", 
                marginBottom: "12pt",
                textTransform: "uppercase",
                letterSpacing: "1px"
              }}>SKILLS</h2>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6pt" }}>
                {content.skills.map((skill, idx) => (
                  <span
                    key={idx}
                    style={{
                      backgroundColor: "white",
                      border: `1px solid ${colors.primary}40`,
                      color: colors.primary,
                      padding: "4pt 10pt",
                      borderRadius: "20pt",
                      fontSize: "8.5pt",
                      fontWeight: 600,
                      boxShadow: "0 1px 2px rgba(0,0,0,0.05)"
                    }}
                  >
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
