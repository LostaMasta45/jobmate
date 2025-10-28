"use client";
import * as React from "react";
import { CreativeCV } from "@/lib/schemas/cv-creative";

export function MagazineLayout({ cv }: { cv: Partial<CreativeCV> }) {
  const colors = cv.colorScheme || { primary: "#dc2626", secondary: "#ef4444", accent: "#f87171", background: "#ffffff", text: "#1e293b" };
  const content = cv.content;
  if (!content) return null;

  return (
    <div className="mx-auto max-w-4xl bg-white p-8" style={{ color: colors.text }}>
      <div className="mb-6 border-t-4" style={{ borderColor: colors.primary }}>
        <h1 className="mt-4 text-6xl font-serif italic">{content.basics.firstName}<br/>{content.basics.lastName}</h1>
        <p className="mt-2 text-xl font-light tracking-wide" style={{ color: colors.primary }}>{content.basics.headline}</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-4">
          {content.summary && <p className="text-justify leading-relaxed">{content.summary}</p>}
          
          {content.experiences.length > 0 && (
            <div>
              <h2 className="mb-2 font-serif text-2xl" style={{ color: colors.primary }}>Experience</h2>
              {content.experiences.map((exp, idx) => (
                <div key={idx} className="mb-3 border-l-2 pl-4" style={{ borderColor: colors.accent }}>
                  <h3 className="font-bold">{exp.title}</h3>
                  <p className="text-sm italic">{exp.company}</p>
                  <ul className="mt-1 space-y-0.5 text-xs">
                    {exp.bullets.slice(0, 2).map((b, i) => b.trim() && <li key={i} className="ml-4 list-disc">{b}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-4 border-l-2 pl-4" style={{ borderColor: colors.primary }}>
          <div>
            <h3 className="font-bold uppercase text-xs" style={{ color: colors.primary }}>Contact</h3>
            <p className="text-xs">{content.basics.email}</p>
            {content.basics.phone && <p className="text-xs">{content.basics.phone}</p>}
          </div>
          
          {content.skills.length > 0 && (
            <div>
              <h3 className="font-bold uppercase text-xs mb-2" style={{ color: colors.primary }}>Skills</h3>
              {content.skills.slice(0, 8).map((skill, idx) => <div key={idx} className="text-xs">{skill}</div>)}
            </div>
          )}

          {content.education.length > 0 && (
            <div>
              <h3 className="font-bold uppercase text-xs mb-2" style={{ color: colors.primary }}>Education</h3>
              {content.education.map((edu, idx) => (
                <div key={idx} className="text-xs mb-2">
                  <p className="font-semibold">{edu.school}</p>
                  <p>{edu.degree}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
