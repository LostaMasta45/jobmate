"use client";

import * as React from "react";
import { CreativeCV } from "@/lib/schemas/cv-creative";

interface PastelProfessionalProps {
  cv: Partial<CreativeCV>;
}

export function PastelProfessional({ cv }: PastelProfessionalProps) {
  const colors = cv.colorScheme || { primary: "#10b981", secondary: "#34d399", accent: "#6ee7b7", background: "#ffffff", text: "#1e293b" };
  const content = cv.content;
  const photo = cv.photoUrl;

  if (!content) return null;

  return (
    <div className="mx-auto max-w-4xl bg-white">
      <div className="grid md:grid-cols-[1fr,2fr]">
        {/* Left Sidebar */}
        <div className="p-8" style={{ backgroundColor: `${colors.primary}15` }}>
          {photo && (
            <div className="mb-6">
              <img src={photo} alt="Profile" className="mx-auto h-40 w-40 rounded-full object-cover shadow-lg" />
            </div>
          )}
          
          <div className="space-y-6 text-sm">
            <div>
              <h3 className="mb-2 font-bold uppercase" style={{ color: colors.primary }}>Contact</h3>
              <div className="space-y-1 text-xs">
                {content.basics.email && <p>{content.basics.email}</p>}
                {content.basics.phone && <p>{content.basics.phone}</p>}
                {content.basics.city && <p>{content.basics.city}</p>}
              </div>
            </div>

            {content.skills.length > 0 && (
              <div>
                <h3 className="mb-2 font-bold uppercase" style={{ color: colors.primary }}>Skills</h3>
                <div className="flex flex-wrap gap-1">
                  {content.skills.map((skill, idx) => (
                    <span key={idx} className="rounded-full px-2 py-1 text-xs" style={{ backgroundColor: colors.primary, color: "white" }}>
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Content */}
        <div className="p-8">
          <h1 className="mb-1 text-4xl font-bold">{content.basics.firstName} {content.basics.lastName}</h1>
          <p className="mb-6 text-xl" style={{ color: colors.primary }}>{content.basics.headline}</p>

          {content.summary && (
            <div className="mb-6">
              <h2 className="mb-2 border-b-2 pb-1 text-lg font-bold" style={{ borderColor: colors.secondary }}>About Me</h2>
              <p className="text-sm leading-relaxed">{content.summary}</p>
            </div>
          )}

          {content.experiences.length > 0 && (
            <div className="mb-6">
              <h2 className="mb-3 border-b-2 pb-1 text-lg font-bold" style={{ borderColor: colors.secondary }}>Experience</h2>
              <div className="space-y-4">
                {content.experiences.map((exp, idx) => (
                  <div key={idx}>
                    <h3 className="font-semibold">{exp.title}</h3>
                    <p className="text-xs" style={{ color: colors.primary }}>{exp.company} • {exp.startDate} - {exp.isCurrent ? "Present" : exp.endDate}</p>
                    <ul className="mt-1 space-y-0.5 text-xs">
                      {exp.bullets.slice(0, 3).map((b, i) => b.trim() && <li key={i} className="ml-4 list-disc">{b}</li>)}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {content.education.length > 0 && (
            <div>
              <h2 className="mb-2 border-b-2 pb-1 text-lg font-bold" style={{ borderColor: colors.secondary }}>Education</h2>
              <div className="space-y-2">
                {content.education.map((edu, idx) => (
                  <div key={idx}>
                    <h3 className="font-semibold text-sm">{edu.school}</h3>
                    <p className="text-xs">{edu.degree} {edu.field}</p>
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
