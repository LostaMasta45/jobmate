"use client";

import * as React from "react";
import { CreativeCV } from "@/lib/schemas/cv-creative";

interface DarkModeProProps {
  cv: Partial<CreativeCV>;
}

export function DarkModePro({ cv }: DarkModeProProps) {
  const colors = cv.colorScheme || { primary: "#3b82f6", secondary: "#60a5fa", accent: "#93c5fd", background: "#0f172a", text: "#f1f5f9" };
  const content = cv.content;

  if (!content) return null;

  return (
    <div className="mx-auto max-w-4xl p-8" style={{ backgroundColor: colors.background, color: colors.text }}>
      <div className="mb-8 rounded-lg p-6" style={{ background: `linear-gradient(135deg, ${colors.primary}40, ${colors.secondary}20)` }}>
        <h1 className="text-4xl font-bold">{content.basics.firstName} {content.basics.lastName}</h1>
        <p className="mt-1 text-lg" style={{ color: colors.accent }}>{content.basics.headline}</p>
        <div className="mt-3 flex gap-4 text-sm opacity-80">
          {content.basics.email && <span>{content.basics.email}</span>}
          {content.basics.phone && <span>• {content.basics.phone}</span>}
        </div>
      </div>

      {content.summary && (
        <div className="mb-6">
          <h2 className="mb-2 text-lg font-bold" style={{ color: colors.primary }}>$ WHOAMI</h2>
          <p className="rounded bg-white/5 p-4 font-mono text-sm">{content.summary}</p>
        </div>
      )}

      {content.experiences.length > 0 && (
        <div className="mb-6">
          <h2 className="mb-3 text-lg font-bold" style={{ color: colors.primary }}>$ WORK EXPERIENCE</h2>
          {content.experiences.map((exp, idx) => (
            <div key={idx} className="mb-4 rounded bg-white/5 p-4">
              <h3 className="font-bold">{exp.title}</h3>
              <p className="text-sm" style={{ color: colors.accent }}>{exp.company} | {exp.startDate} - {exp.isCurrent ? "Present" : exp.endDate}</p>
              <ul className="mt-2 space-y-1 text-sm">
                {exp.bullets.slice(0, 3).map((b, i) => b.trim() && <li key={i} className="ml-4 list-disc opacity-80">{b}</li>)}
              </ul>
            </div>
          ))}
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {content.education.length > 0 && (
          <div>
            <h2 className="mb-2 text-lg font-bold" style={{ color: colors.primary }}>$ EDUCATION</h2>
            {content.education.map((edu, idx) => (
              <div key={idx} className="mb-2 rounded bg-white/5 p-3">
                <h3 className="font-semibold">{edu.school}</h3>
                <p className="text-sm opacity-80">{edu.degree}</p>
              </div>
            ))}
          </div>
        )}

        {content.skills.length > 0 && (
          <div>
            <h2 className="mb-2 text-lg font-bold" style={{ color: colors.primary }}>$ SKILLS</h2>
            <div className="flex flex-wrap gap-2">
              {content.skills.map((skill, idx) => (
                <span key={idx} className="rounded border px-2 py-1 font-mono text-xs" style={{ borderColor: colors.primary, color: colors.accent }}>
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
