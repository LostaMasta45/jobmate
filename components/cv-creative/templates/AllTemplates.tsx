"use client";
import * as React from "react";
import { CreativeCV } from "@/lib/schemas/cv-creative";

// ColorfulBlocks Template
export function ColorfulBlocks({ cv }: { cv: Partial<CreativeCV> }) {
  const colors = cv.colorScheme || { primary: "#f59e0b", secondary: "#fbbf24", accent: "#fcd34d", background: "#ffffff", text: "#1e293b" };
  const content = cv.content;
  if (!content) return null;

  return (
    <div className="mx-auto max-w-4xl bg-white p-8">
      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-lg p-4" style={{ backgroundColor: `${colors.primary}20` }}>
          <h1 className="text-3xl font-bold">{content.basics.firstName} {content.basics.lastName}</h1>
        </div>
        <div className="rounded-lg p-4 md:col-span-2" style={{ backgroundColor: `${colors.secondary}20` }}>
          <p className="text-lg font-semibold" style={{ color: colors.primary }}>{content.basics.headline}</p>
        </div>
      </div>

      {content.summary && (
        <div className="mb-4 rounded-lg p-4" style={{ backgroundColor: `${colors.accent}20` }}>
          <p className="text-sm">{content.summary}</p>
        </div>
      )}

      {content.experiences.length > 0 && (
        <div className="mb-4">
          <h2 className="mb-2 text-lg font-bold" style={{ color: colors.primary }}>Experience</h2>
          {content.experiences.map((exp, idx) => (
            <div key={idx} className="mb-2 rounded-lg p-3" style={{ backgroundColor: `${colors.primary}10` }}>
              <h3 className="font-semibold">{exp.title} - {exp.company}</h3>
              <p className="text-xs">{exp.startDate} - {exp.isCurrent ? "Present" : exp.endDate}</p>
            </div>
          ))}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {content.education.length > 0 && (
          <div className="rounded-lg p-4" style={{ backgroundColor: `${colors.secondary}15` }}>
            <h2 className="mb-2 font-bold" style={{ color: colors.primary }}>Education</h2>
            {content.education.map((edu, idx) => (
              <div key={idx} className="text-sm"><strong>{edu.school}</strong> - {edu.degree}</div>
            ))}
          </div>
        )}

        {content.skills.length > 0 && (
          <div className="rounded-lg p-4" style={{ backgroundColor: `${colors.accent}15` }}>
            <h2 className="mb-2 font-bold" style={{ color: colors.primary }}>Skills</h2>
            <div className="flex flex-wrap gap-1">
              {content.skills.map((s, idx) => (
                <span key={idx} className="rounded px-2 py-1 text-xs font-semibold" style={{ backgroundColor: colors.primary, color: "white" }}>{s}</span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// TimelineHero Template
export function TimelineHero({ cv }: { cv: Partial<CreativeCV> }) {
  const colors = cv.colorScheme || { primary: "#8b5cf6", secondary: "#a78bfa", accent: "#c4b5fd", background: "#ffffff", text: "#1e293b" };
  const content = cv.content;
  if (!content) return null;

  return (
    <div className="mx-auto max-w-4xl bg-white p-8" style={{ color: colors.text }}>
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold">{content.basics.firstName} {content.basics.lastName}</h1>
        <p className="mt-2 text-xl" style={{ color: colors.primary }}>{content.basics.headline}</p>
        <div className="mt-2 text-sm">{content.basics.email} | {content.basics.phone}</div>
      </div>

      {content.summary && (
        <div className="mb-6 rounded-lg border-l-4 p-4" style={{ borderColor: colors.primary, backgroundColor: `${colors.primary}10` }}>
          <p>{content.summary}</p>
        </div>
      )}

      {content.experiences.length > 0 && (
        <div className="relative mb-6 border-l-2 pl-8" style={{ borderColor: colors.secondary }}>
          <h2 className="mb-4 text-xl font-bold" style={{ color: colors.primary }}>Career Timeline</h2>
          {content.experiences.map((exp, idx) => (
            <div key={idx} className="relative mb-6">
              <div className="absolute -left-10 h-4 w-4 rounded-full" style={{ backgroundColor: colors.primary }}></div>
              <h3 className="font-bold">{exp.title}</h3>
              <p className="text-sm" style={{ color: colors.secondary }}>{exp.company}</p>
              <p className="text-xs text-muted-foreground">{exp.startDate} - {exp.isCurrent ? "Present" : exp.endDate}</p>
              {exp.bullets[0] && <p className="mt-1 text-sm">{exp.bullets[0]}</p>}
            </div>
          ))}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {content.education.length > 0 && (
          <div>
            <h2 className="mb-2 font-bold" style={{ color: colors.primary }}>Education</h2>
            {content.education.map((edu, idx) => (
              <div key={idx} className="mb-2">
                <p className="font-semibold">{edu.school}</p>
                <p className="text-sm">{edu.degree}</p>
              </div>
            ))}
          </div>
        )}

        {content.skills.length > 0 && (
          <div>
            <h2 className="mb-2 font-bold" style={{ color: colors.primary }}>Skills</h2>
            <div className="flex flex-wrap gap-1">
              {content.skills.map((s, idx) => (
                <span key={idx} className="rounded-full px-3 py-1 text-xs" style={{ backgroundColor: `${colors.primary}20`, color: colors.primary }}>{s}</span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// PortfolioGrid Template
export function PortfolioGrid({ cv }: { cv: Partial<CreativeCV> }) {
  const colors = cv.colorScheme || { primary: "#06b6d4", secondary: "#22d3ee", accent: "#67e8f9", background: "#ffffff", text: "#1e293b" };
  const content = cv.content;
  if (!content) return null;

  return (
    <div className="mx-auto max-w-4xl bg-white p-6">
      <div className="mb-6 rounded-lg p-6" style={{ background: `linear-gradient(to right, ${colors.primary}, ${colors.secondary})`, color: "white" }}>
        <h1 className="text-3xl font-bold">{content.basics.firstName} {content.basics.lastName}</h1>
        <p className="text-lg">{content.basics.headline}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {content.experiences.slice(0, 4).map((exp, idx) => (
          <div key={idx} className="rounded-lg border-2 p-4" style={{ borderColor: colors.primary }}>
            <h3 className="font-bold" style={{ color: colors.primary }}>{exp.title}</h3>
            <p className="text-sm">{exp.company}</p>
            <p className="mt-2 text-xs">{exp.bullets[0]}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <div>
          <h3 className="mb-2 font-bold" style={{ color: colors.primary }}>Contact</h3>
          <p className="text-sm">{content.basics.email}</p>
          <p className="text-sm">{content.basics.phone}</p>
        </div>
        <div>
          <h3 className="mb-2 font-bold" style={{ color: colors.primary }}>Education</h3>
          {content.education[0] && <p className="text-sm">{content.education[0].school}</p>}
        </div>
        <div>
          <h3 className="mb-2 font-bold" style={{ color: colors.primary }}>Top Skills</h3>
          <div className="flex flex-wrap gap-1">
            {content.skills.slice(0, 6).map((s, idx) => (
              <span key={idx} className="text-xs" style={{ color: colors.primary }}>• {s}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// InfographicStyle Template
export function InfographicStyle({ cv }: { cv: Partial<CreativeCV> }) {
  const colors = cv.colorScheme || { primary: "#ec4899", secondary: "#f472b6", accent: "#f9a8d4", background: "#ffffff", text: "#1e293b" };
  const content = cv.content;
  if (!content) return null;

  return (
    <div className="mx-auto max-w-4xl bg-white p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold" style={{ color: colors.primary }}>{content.basics.firstName} {content.basics.lastName}</h1>
          <p className="text-lg">{content.basics.headline}</p>
        </div>
        <div className="text-right text-sm">
          <p>{content.basics.email}</p>
          <p>{content.basics.phone}</p>
        </div>
      </div>

      <div className="mb-6 grid gap-4 md:grid-cols-4">
        <div className="rounded-lg p-4 text-center" style={{ backgroundColor: `${colors.primary}20` }}>
          <div className="text-2xl font-bold" style={{ color: colors.primary }}>{content.experiences.length}</div>
          <div className="text-xs">Jobs</div>
        </div>
        <div className="rounded-lg p-4 text-center" style={{ backgroundColor: `${colors.secondary}20` }}>
          <div className="text-2xl font-bold" style={{ color: colors.secondary }}>{content.education.length}</div>
          <div className="text-xs">Degrees</div>
        </div>
        <div className="rounded-lg p-4 text-center" style={{ backgroundColor: `${colors.accent}20` }}>
          <div className="text-2xl font-bold" style={{ color: colors.primary }}>{content.skills.length}</div>
          <div className="text-xs">Skills</div>
        </div>
        <div className="rounded-lg p-4 text-center" style={{ backgroundColor: `${colors.primary}15` }}>
          <div className="text-2xl font-bold" style={{ color: colors.primary }}>A+</div>
          <div className="text-xs">Rating</div>
        </div>
      </div>

      {content.experiences.length > 0 && (
        <div className="mb-6">
          <h2 className="mb-3 text-xl font-bold" style={{ color: colors.primary }}>Experience</h2>
          {content.experiences.map((exp, idx) => (
            <div key={idx} className="mb-3 rounded p-3" style={{ backgroundColor: `${colors.primary}10` }}>
              <h3 className="font-bold">{exp.title} @ {exp.company}</h3>
              <p className="text-xs">{exp.startDate} - {exp.isCurrent ? "Present" : exp.endDate}</p>
            </div>
          ))}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {content.education.length > 0 && (
          <div>
            <h2 className="mb-2 font-bold" style={{ color: colors.primary }}>Education</h2>
            {content.education.map((edu, idx) => (
              <div key={idx} className="text-sm"><strong>{edu.school}</strong></div>
            ))}
          </div>
        )}

        {content.skills.length > 0 && (
          <div>
            <h2 className="mb-2 font-bold" style={{ color: colors.primary }}>Skills</h2>
            <div className="flex flex-wrap gap-1">
              {content.skills.map((s, idx) => (
                <span key={idx} className="rounded px-2 py-1 text-xs" style={{ backgroundColor: colors.primary, color: "white" }}>{s}</span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// SplitScreen Template
export function SplitScreen({ cv }: { cv: Partial<CreativeCV> }) {
  const colors = cv.colorScheme || { primary: "#14b8a6", secondary: "#2dd4bf", accent: "#5eead4", background: "#ffffff", text: "#1e293b" };
  const content = cv.content;
  if (!content) return null;

  return (
    <div className="mx-auto max-w-4xl grid md:grid-cols-2">
      <div className="p-8" style={{ backgroundColor: colors.primary, color: "white" }}>
        <h1 className="text-3xl font-bold">{content.basics.firstName}<br/>{content.basics.lastName}</h1>
        <p className="mt-2 text-lg">{content.basics.headline}</p>
        
        <div className="mt-6 space-y-4 text-sm">
          <div>
            <h3 className="mb-1 font-bold uppercase">Contact</h3>
            <p>{content.basics.email}</p>
            <p>{content.basics.phone}</p>
          </div>

          {content.skills.length > 0 && (
            <div>
              <h3 className="mb-2 font-bold uppercase">Skills</h3>
              <div className="flex flex-wrap gap-1">
                {content.skills.map((s, idx) => (
                  <span key={idx} className="rounded bg-white/20 px-2 py-1 text-xs">{s}</span>
                ))}
              </div>
            </div>
          )}

          {content.education.length > 0 && (
            <div>
              <h3 className="mb-1 font-bold uppercase">Education</h3>
              {content.education.map((edu, idx) => (
                <div key={idx} className="text-xs">
                  <p className="font-semibold">{edu.school}</p>
                  <p>{edu.degree}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="p-8 bg-white" style={{ color: colors.text }}>
        {content.summary && (
          <div className="mb-4">
            <h2 className="mb-2 text-lg font-bold" style={{ color: colors.primary }}>About</h2>
            <p className="text-sm">{content.summary}</p>
          </div>
        )}

        {content.experiences.length > 0 && (
          <div>
            <h2 className="mb-2 text-lg font-bold" style={{ color: colors.primary }}>Experience</h2>
            {content.experiences.map((exp, idx) => (
              <div key={idx} className="mb-3">
                <h3 className="font-semibold">{exp.title}</h3>
                <p className="text-xs" style={{ color: colors.secondary }}>{exp.company} | {exp.startDate} - {exp.isCurrent ? "Now" : exp.endDate}</p>
                {exp.bullets[0] && <p className="mt-1 text-xs">{exp.bullets[0]}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// GeometricModern Template
export function GeometricModern({ cv }: { cv: Partial<CreativeCV> }) {
  const colors = cv.colorScheme || { primary: "#6366f1", secondary: "#818cf8", accent: "#a5b4fc", background: "#ffffff", text: "#1e293b" };
  const content = cv.content;
  if (!content) return null;

  return (
    <div className="mx-auto max-w-4xl bg-white p-8">
      <div className="relative mb-6 overflow-hidden rounded-lg p-6" style={{ backgroundColor: `${colors.primary}10` }}>
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full" style={{ backgroundColor: `${colors.accent}40` }}></div>
        <div className="absolute -bottom-10 -left-10 h-32 w-32" style={{ backgroundColor: `${colors.secondary}30`, transform: "rotate(45deg)" }}></div>
        <div className="relative">
          <h1 className="text-4xl font-bold">{content.basics.firstName} {content.basics.lastName}</h1>
          <p className="mt-1 text-xl" style={{ color: colors.primary }}>{content.basics.headline}</p>
          <div className="mt-2 text-sm">{content.basics.email} • {content.basics.phone}</div>
        </div>
      </div>

      {content.summary && (
        <div className="mb-6">
          <div className="mb-2 inline-block rounded px-3 py-1" style={{ backgroundColor: colors.primary, color: "white" }}>
            <h2 className="text-sm font-bold">SUMMARY</h2>
          </div>
          <p className="text-sm">{content.summary}</p>
        </div>
      )}

      {content.experiences.length > 0 && (
        <div className="mb-6">
          <div className="mb-2 inline-block rounded px-3 py-1" style={{ backgroundColor: colors.secondary, color: "white" }}>
            <h2 className="text-sm font-bold">EXPERIENCE</h2>
          </div>
          {content.experiences.map((exp, idx) => (
            <div key={idx} className="mb-3 rounded-lg border-l-4 p-3" style={{ borderColor: colors.accent, backgroundColor: `${colors.primary}05` }}>
              <h3 className="font-bold">{exp.title}</h3>
              <p className="text-sm" style={{ color: colors.primary }}>{exp.company}</p>
              <p className="text-xs text-muted-foreground">{exp.startDate} - {exp.isCurrent ? "Present" : exp.endDate}</p>
            </div>
          ))}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {content.education.length > 0 && (
          <div className="rounded-lg p-4" style={{ backgroundColor: `${colors.primary}10` }}>
            <h2 className="mb-2 font-bold" style={{ color: colors.primary }}>Education</h2>
            {content.education.map((edu, idx) => (
              <div key={idx} className="text-sm"><strong>{edu.school}</strong><br/>{edu.degree}</div>
            ))}
          </div>
        )}

        {content.skills.length > 0 && (
          <div className="rounded-lg p-4" style={{ backgroundColor: `${colors.secondary}10` }}>
            <h2 className="mb-2 font-bold" style={{ color: colors.secondary }}>Skills</h2>
            <div className="flex flex-wrap gap-1">
              {content.skills.map((s, idx) => (
                <span key={idx} className="rounded px-2 py-1 text-xs" style={{ backgroundColor: colors.accent, color: "white" }}>{s}</span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// WatercolorArtist Template
export function WatercolorArtist({ cv }: { cv: Partial<CreativeCV> }) {
  const colors = cv.colorScheme || { primary: "#f472b6", secondary: "#fb923c", accent: "#fbbf24", background: "#fffbeb", text: "#1e293b" };
  const content = cv.content;
  if (!content) return null;

  return (
    <div className="mx-auto max-w-4xl p-8" style={{ backgroundColor: colors.background, color: colors.text }}>
      <div className="relative mb-6 overflow-hidden rounded-2xl p-6" style={{ background: `linear-gradient(135deg, ${colors.primary}30, ${colors.secondary}20, ${colors.accent}30)` }}>
        <h1 className="font-serif text-5xl italic">{content.basics.firstName} {content.basics.lastName}</h1>
        <p className="mt-2 text-xl font-light">{content.basics.headline}</p>
        <div className="mt-2 text-sm">{content.basics.email} | {content.basics.phone}</div>
      </div>

      {content.summary && (
        <div className="mb-6 rounded-xl p-4" style={{ backgroundColor: `${colors.accent}20` }}>
          <p className="font-serif italic leading-relaxed">{content.summary}</p>
        </div>
      )}

      {content.experiences.length > 0 && (
        <div className="mb-6">
          <h2 className="mb-3 font-serif text-2xl italic" style={{ color: colors.primary }}>Experience</h2>
          {content.experiences.map((exp, idx) => (
            <div key={idx} className="mb-4 rounded-lg p-4" style={{ backgroundColor: `${colors.primary}15` }}>
              <h3 className="font-semibold">{exp.title}</h3>
              <p className="text-sm italic" style={{ color: colors.secondary }}>{exp.company}</p>
              <p className="mt-1 text-xs">{exp.bullets[0]}</p>
            </div>
          ))}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {content.education.length > 0 && (
          <div className="rounded-lg p-4" style={{ backgroundColor: `${colors.secondary}20` }}>
            <h2 className="mb-2 font-serif text-xl italic" style={{ color: colors.secondary }}>Education</h2>
            {content.education.map((edu, idx) => (
              <div key={idx} className="text-sm">
                <p className="font-semibold">{edu.school}</p>
                <p>{edu.degree}</p>
              </div>
            ))}
          </div>
        )}

        {content.skills.length > 0 && (
          <div className="rounded-lg p-4" style={{ backgroundColor: `${colors.accent}20` }}>
            <h2 className="mb-2 font-serif text-xl italic" style={{ color: colors.accent }}>Skills</h2>
            <div className="flex flex-wrap gap-1">
              {content.skills.map((s, idx) => (
                <span key={idx} className="rounded-full px-3 py-1 text-xs" style={{ backgroundColor: colors.primary, color: "white" }}>{s}</span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
