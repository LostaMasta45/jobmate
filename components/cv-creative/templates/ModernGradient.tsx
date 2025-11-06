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
    <div className="cv-template" style={{ color: colors.text }}>
      {/* Header with gradient */}
      <div 
        style={{ 
          background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
          padding: "16pt",
          borderRadius: "8pt",
          marginBottom: "12pt",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16pt" }}>
          {photo && photoOpts && (
            <div
              style={{
                flexShrink: 0,
                width: photoOpts.size === "small" ? "60pt" : photoOpts.size === "large" ? "100pt" : "80pt",
                height: photoOpts.size === "small" ? "60pt" : photoOpts.size === "large" ? "100pt" : "80pt",
                borderRadius: photoOpts.shape === "circle" ? "50%" : photoOpts.shape === "rounded-square" ? "8pt" : "0",
                border: photoOpts.border.style !== "none" ? `${photoOpts.border.width}px ${photoOpts.border.style} white` : "none",
                overflow: "hidden",
              }}
            >
              <img src={photo} alt="Profile" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
          )}
          <div style={{ flex: 1, color: "white" }}>
            <h1 style={{ margin: 0, fontSize: "24pt", fontWeight: 700, lineHeight: 1.2 }}>
              {content.basics.firstName} {content.basics.lastName}
            </h1>
            {content.basics.headline && (
              <p style={{ margin: "4pt 0 0 0", fontSize: "13pt", opacity: 0.9 }}>{content.basics.headline}</p>
            )}
            <div style={{ marginTop: "8pt", fontSize: "9pt", opacity: 0.85, display: "flex", flexWrap: "wrap", gap: "8pt" }}>
              {content.basics.email && <span>{content.basics.email}</span>}
              {content.basics.phone && <span>• {content.basics.phone}</span>}
              {content.basics.city && <span>• {content.basics.city}</span>}
            </div>
          </div>
        </div>
      </div>

      {/* Summary */}
      {content.summary && (
        <div style={{ marginBottom: "12pt" }}>
          <h2 style={{ color: colors.primary }}>SUMMARY</h2>
          <p>{content.summary}</p>
        </div>
      )}

      {/* Experience */}
      {content.experiences && content.experiences.length > 0 && (
        <div style={{ marginBottom: "12pt" }}>
          <h2 style={{ color: colors.primary }}>PROFESSIONAL EXPERIENCE</h2>
          <div>
            {content.experiences.map((exp, idx) => (
              <div key={idx} style={{ marginBottom: "10pt" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                  <div>
                    <h3>{exp.title}</h3>
                    <p style={{ fontSize: "9pt", color: colors.accent, margin: "2pt 0" }}>
                      {exp.company}
                    </p>
                  </div>
                  <span style={{ fontSize: "9pt", color: "#64748b", whiteSpace: "nowrap", marginLeft: "8pt" }}>
                    {exp.startDate} - {exp.isCurrent ? "Present" : exp.endDate}
                  </span>
                </div>
                <ul style={{ marginTop: "4pt", paddingLeft: "18pt" }}>
                  {exp.bullets.map((bullet, i) => (
                    bullet.trim() && <li key={i} style={{ marginBottom: "2pt", fontSize: "9pt" }}>{bullet}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {content.education && content.education.length > 0 && (
        <div style={{ marginBottom: "12pt" }}>
          <h2 style={{ color: colors.primary }}>EDUCATION</h2>
          <div>
            {content.education.map((edu, idx) => (
              <div key={idx} style={{ marginBottom: "8pt" }}>
                <h3>{edu.school}</h3>
                {edu.degree && <p style={{ fontSize: "9pt", margin: "2pt 0" }}>{edu.degree} {edu.field}</p>}
                {edu.startDate && (
                  <p style={{ fontSize: "9pt", color: "#64748b", margin: "2pt 0" }}>
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
          <h2 style={{ color: colors.primary }}>SKILLS</h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6pt", marginTop: "8pt" }}>
            {content.skills.map((skill, idx) => (
              <span
                key={idx}
                style={{
                  backgroundColor: `${colors.primary}20`,
                  color: colors.primary,
                  padding: "4pt 10pt",
                  borderRadius: "12pt",
                  fontSize: "9pt",
                  fontWeight: 500,
                }}
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
