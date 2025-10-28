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
    <div 
      className="mx-auto bg-white shadow-lg" 
      style={{ 
        width: "210mm",
        minHeight: "297mm", 
        padding: "25mm 20mm",
        color: colors.text,
        fontFamily: "'Times New Roman', ui-serif, Georgia, serif",
        fontSize: "11pt",
        lineHeight: "1.5"
      }}
    >
      {/* Header with gradient */}
      <div 
        className="mb-6 rounded-lg p-6"
        style={{ background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})` }}
      >
        <div className="flex items-center gap-6">
          {photo && photoOpts && (
            <div
              className={`flex-shrink-0 overflow-hidden ${
                photoOpts.shape === "circle" ? "rounded-full" : photoOpts.shape === "rounded-square" ? "rounded-lg" : ""
              }`}
              style={{
                width: photoOpts.size === "small" ? 80 : photoOpts.size === "large" ? 150 : 120,
                height: photoOpts.size === "small" ? 80 : photoOpts.size === "large" ? 150 : 120,
                border: photoOpts.border.style !== "none" ? `${photoOpts.border.width}px ${photoOpts.border.style} white` : "none",
              }}
            >
              <img src={photo} alt="Profile" className="h-full w-full object-cover" />
            </div>
          )}
          <div className="flex-1 text-white">
            <h1 className="text-3xl font-bold">
              {content.basics.firstName} {content.basics.lastName}
            </h1>
            {content.basics.headline && (
              <p className="mt-1 text-lg opacity-90">{content.basics.headline}</p>
            )}
            <div className="mt-3 flex flex-wrap gap-3 text-sm opacity-80">
              {content.basics.email && <span>{content.basics.email}</span>}
              {content.basics.phone && <span>• {content.basics.phone}</span>}
              {content.basics.city && <span>• {content.basics.city}</span>}
            </div>
          </div>
        </div>
      </div>

      {/* Summary */}
      {content.summary && (
        <div className="mb-6">
          <h2 className="mb-3 text-xl font-bold" style={{ color: colors.primary }}>
            SUMMARY
          </h2>
          <p className="leading-relaxed">{content.summary}</p>
        </div>
      )}

      {/* Experience */}
      {content.experiences && content.experiences.length > 0 && (
        <div className="mb-6">
          <h2 className="mb-3 text-xl font-bold" style={{ color: colors.primary }}>
            PROFESSIONAL EXPERIENCE
          </h2>
          <div className="space-y-4">
            {content.experiences.map((exp, idx) => (
              <div key={idx}>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold">{exp.title}</h3>
                    <p className="text-sm" style={{ color: colors.accent }}>
                      {exp.company}
                    </p>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {exp.startDate} - {exp.isCurrent ? "Present" : exp.endDate}
                  </span>
                </div>
                <ul className="mt-2 space-y-1 text-sm">
                  {exp.bullets.map((bullet, i) => (
                    bullet.trim() && <li key={i} className="ml-4 list-disc">{bullet}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {content.education && content.education.length > 0 && (
        <div className="mb-6">
          <h2 className="mb-3 text-xl font-bold" style={{ color: colors.primary }}>
            EDUCATION
          </h2>
          <div className="space-y-3">
            {content.education.map((edu, idx) => (
              <div key={idx}>
                <h3 className="font-bold">{edu.school}</h3>
                {edu.degree && <p className="text-sm">{edu.degree} {edu.field}</p>}
                {edu.startDate && (
                  <p className="text-sm text-muted-foreground">
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
          <h2 className="mb-3 text-xl font-bold" style={{ color: colors.primary }}>
            SKILLS
          </h2>
          <div className="flex flex-wrap gap-2">
            {content.skills.map((skill, idx) => (
              <span
                key={idx}
                className="rounded-full px-3 py-1 text-sm"
                style={{ backgroundColor: `${colors.primary}20`, color: colors.primary }}
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
