import React from "react";
import { Resume } from "@/lib/schemas/cv-ats";

interface TemplateProps {
  resume: Resume;
}

// Corporate: Grid layout, Left column for skills/contact, Right for Experience
// IMPROVED: Better structure, spacing, and font usage for density
export function TemplateCorporate({ resume }: TemplateProps) {
  const { basics, summary, experiences, education, skills, customSections } = resume;

  return (
    <div 
      className="p-[20mm] h-full flex flex-col bg-white"
      style={{
        fontFamily: '"Roboto", "Arial", sans-serif', // Changed to Roboto for better legibility
        fontSize: "10pt",
        lineHeight: 1.5,
        color: "#333333",
      }}
    >
      {/* Header */}
      <div className="border-b-[3px] border-slate-800 pb-5 mb-8">
        <h1 
          className="text-4xl font-bold text-slate-900 uppercase tracking-tight mb-2"
          style={{ lineHeight: 1 }}
        >
          {basics.firstName} <span className="text-slate-600">{basics.lastName}</span>
        </h1>
        {basics.headline && (
          <p className="text-xl text-slate-700 font-medium">
            {basics.headline}
          </p>
        )}
      </div>

      <div className="flex gap-10 h-full">
        {/* Left Column (Sidebar) - 30% - darker background optional, but kept white for ATS safety */}
        <div className="w-[28%] space-y-8 shrink-0 border-r border-slate-100 pr-4">
          {/* Contact */}
          <div className="space-y-3 text-sm">
            <h3 className="font-bold text-slate-900 uppercase tracking-wider text-xs border-b-2 border-slate-800 pb-1 mb-3">
              Contact
            </h3>
            {basics.email && (
              <div className="break-words">
                <span className="block text-xs font-bold text-slate-400 uppercase mb-0.5">Email</span>
                {basics.email}
              </div>
            )}
            {basics.phone && (
              <div>
                <span className="block text-xs font-bold text-slate-400 uppercase mb-0.5">Phone</span>
                {basics.phone}
              </div>
            )}
            {(basics.city || basics.address) && (
              <div>
                <span className="block text-xs font-bold text-slate-400 uppercase mb-0.5">Location</span>
                {basics.city || basics.address}
              </div>
            )}
            {basics.linkedin && (
              <div className="break-words text-xs">
                <span className="block text-xs font-bold text-slate-400 uppercase mb-0.5">LinkedIn</span>
                {basics.linkedin.replace(/^https?:\/\//, '')}
              </div>
            )}
            {basics.website && (
              <div className="break-words text-xs">
                <span className="block text-xs font-bold text-slate-400 uppercase mb-0.5">Website</span>
                {basics.website.replace(/^https?:\/\//, '')}
              </div>
            )}
          </div>

          {/* Education (Sidebar) */}
          {education.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-bold text-slate-900 uppercase tracking-wider text-xs border-b-2 border-slate-800 pb-1 mb-3">
                Education
              </h3>
              {education.map((edu, idx) => (
                <div key={idx} className="text-sm">
                  <div className="font-bold text-slate-900 leading-tight">{edu.school}</div>
                  <div className="text-xs text-slate-500 mb-1 font-medium">
                    {edu.startDate} – {edu.endDate || "Present"}
                  </div>
                  {(edu.degree || edu.field) && (
                    <div className="italic text-slate-700 text-xs">
                      {edu.degree}
                      <br/>
                      {edu.field && `${edu.field}`}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Skills */}
          {skills.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-bold text-slate-900 uppercase tracking-wider text-xs border-b-2 border-slate-800 pb-1 mb-3">
                Skills
              </h3>
              <div className="flex flex-col gap-1.5">
                {skills.map((skill, idx) => (
                  <div key={idx} className="text-sm text-slate-700 bg-slate-50 px-2 py-1 border-l-2 border-slate-300">
                    {skill}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column (Main) - 70% */}
        <div className="w-[72%] space-y-8">
          {/* Summary */}
          {summary && (
            <div>
              <h3 className="font-bold text-slate-900 uppercase tracking-wider text-sm border-b border-slate-200 pb-2 mb-3">
                Professional Summary
              </h3>
              <p className="text-justify text-slate-700 leading-relaxed text-[10.5pt]">
                {summary}
              </p>
            </div>
          )}

          {/* Experience */}
          {experiences.length > 0 && (
            <div>
              <h3 className="font-bold text-slate-900 uppercase tracking-wider text-sm border-b border-slate-200 pb-2 mb-5">
                Work Experience
              </h3>
              <div className="space-y-6">
                {experiences.map((exp, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between items-baseline font-bold text-slate-900 mb-0.5">
                      <span className="text-lg">{exp.title}</span>
                      <span className="text-xs text-slate-500 font-medium whitespace-nowrap ml-2 bg-slate-100 px-2 py-0.5 rounded">
                        {exp.startDate} – {exp.isCurrent ? "Present" : exp.endDate || ""}
                      </span>
                    </div>
                    <div className="text-sm font-semibold text-slate-700 mb-2 uppercase tracking-wide flex items-center">
                      {exp.company} 
                      {exp.city && <span className="text-slate-400 font-normal text-xs ml-2 normal-case">| {exp.city}</span>}
                    </div>
                    {exp.bullets.length > 0 && (
                      <ul className="list-disc ml-4 space-y-1.5 text-sm text-slate-600">
                        {exp.bullets.filter(b => b.trim()).map((bullet, bidx) => (
                          <li key={bidx} className="pl-1 text-justify leading-relaxed">{bullet}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Custom Sections */}
          {customSections && customSections.length > 0 && customSections.map((section, idx) => (
            <div key={idx}>
              <h3 className="font-bold text-slate-900 uppercase tracking-wider text-sm border-b border-slate-200 pb-2 mb-4">
                {section.title}
              </h3>
              <div className="space-y-4">
                {section.items.map((item, iidx) => (
                  <div key={iidx}>
                    <div className="font-bold text-slate-900 text-sm mb-1">
                      {item.label}
                    </div>
                    {item.description && (
                      <p className="text-sm text-slate-700 leading-relaxed">
                        {item.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
