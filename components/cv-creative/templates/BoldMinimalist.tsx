"use client";

import * as React from "react";
import { CreativeCV } from "@/lib/schemas/cv-creative";

interface BoldMinimalistProps {
  cv: Partial<CreativeCV>;
}

export function BoldMinimalist({ cv }: BoldMinimalistProps) {
  const colors = cv.colorScheme || { primary: "#0ea5e9", secondary: "#0284c7", accent: "#0ea5e9", background: "#ffffff", text: "#0f172a" };
  const content = cv.content;
  const photo = cv.photoUrl;
  const photoOpts = cv.photoOptions;

  if (!content) return null;

  return (
    <div className="mx-auto max-w-4xl bg-white p-8" style={{ color: colors.text }}>
      {/* Bold Header */}
      <div className="mb-8 border-l-8 pl-6" style={{ borderColor: colors.primary }}>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-5xl font-black uppercase tracking-tight" style={{ color: colors.text }}>
              {content.basics.firstName}
              <br />
              {content.basics.lastName}
            </h1>
            {content.basics.headline && (
              <p className="mt-2 text-2xl font-bold" style={{ color: colors.primary }}>
                {content.basics.headline}
              </p>
            )}
          </div>
          {photo && photoOpts && (
            <div
              className={`ml-4 flex-shrink-0 overflow-hidden ${
                photoOpts.shape === "circle" ? "rounded-full" : photoOpts.shape === "rounded-square" ? "rounded-lg" : ""
              }`}
              style={{
                width: photoOpts.size === "small" ? 100 : photoOpts.size === "large" ? 160 : 130,
                height: photoOpts.size === "small" ? 100 : photoOpts.size === "large" ? 160 : 130,
              }}
            >
              <img src={photo} alt="Profile" className="h-full w-full object-cover" />
            </div>
          )}
        </div>
        <div className="mt-4 flex flex-wrap gap-4 text-sm font-medium">
          {content.basics.email && <span>{content.basics.email}</span>}
          {content.basics.phone && <span>{content.basics.phone}</span>}
          {content.basics.city && <span>{content.basics.city}</span>}
        </div>
      </div>

      {/* Summary */}
      {content.summary && (
        <div className="mb-8">
          <h2 className="mb-3 text-2xl font-black uppercase tracking-wide" style={{ color: colors.primary }}>
            Profile
          </h2>
          <p className="text-base leading-relaxed">{content.summary}</p>
        </div>
      )}

      {/* Experience */}
      {content.experiences && content.experiences.length > 0 && (
        <div className="mb-8">
          <h2 className="mb-4 text-2xl font-black uppercase tracking-wide" style={{ color: colors.primary }}>
            Experience
          </h2>
          <div className="space-y-6">
            {content.experiences.map((exp, idx) => (
              <div key={idx}>
                <div className="mb-2">
                  <h3 className="text-lg font-bold">{exp.title}</h3>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-semibold" style={{ color: colors.secondary }}>{exp.company}</span>
                    <span className="text-muted-foreground">
                      {exp.startDate} - {exp.isCurrent ? "Present" : exp.endDate}
                    </span>
                  </div>
                </div>
                <ul className="space-y-1 text-sm">
                  {exp.bullets.map((bullet, i) => (
                    bullet.trim() && <li key={i} className="ml-5 list-disc">{bullet}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education & Skills side by side */}
      <div className="grid gap-8 md:grid-cols-2">
        {/* Education */}
        {content.education && content.education.length > 0 && (
          <div>
            <h2 className="mb-3 text-2xl font-black uppercase tracking-wide" style={{ color: colors.primary }}>
              Education
            </h2>
            <div className="space-y-3">
              {content.education.map((edu, idx) => (
                <div key={idx}>
                  <h3 className="font-bold">{edu.school}</h3>
                  {edu.degree && <p className="text-sm">{edu.degree} {edu.field}</p>}
                  {edu.startDate && (
                    <p className="text-xs text-muted-foreground">
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
            <h2 className="mb-3 text-2xl font-black uppercase tracking-wide" style={{ color: colors.primary }}>
              Skills
            </h2>
            <div className="flex flex-wrap gap-2">
              {content.skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="border-2 px-3 py-1 text-sm font-semibold"
                  style={{ borderColor: colors.primary, color: colors.primary }}
                >
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
