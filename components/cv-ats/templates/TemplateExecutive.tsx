import React from "react";
import { Resume } from "@/lib/schemas/cv-ats";

interface TemplateProps {
  resume: Resume;
}

// Executive: Dense, horizontal layout for contacts, smaller margins visually
// IMPROVED: Better font (Lato/Calibri), optimized spacing for high content density
export function TemplateExecutive({ resume }: TemplateProps) {
  const { basics, summary, experiences, education, skills, customSections } = resume;

  return (
    <div 
      className="p-[15mm] h-full flex flex-col bg-white" // Reduced padding to 15mm for more space
      style={{
        fontFamily: '"Calibri", "Roboto", sans-serif',
        fontSize: "10pt", // Slightly smaller base font for density
        lineHeight: 1.4,
        color: "#0f172a",
      }}
    >
      {/* Header - Centered but Compact */}
      <div className="border-b-2 border-slate-900 pb-4 mb-5 text-center">
        <h1 
          className="font-bold text-slate-900 uppercase"
          style={{ fontSize: "24pt", letterSpacing: "1px", lineHeight: 1 }}
        >
          {basics.firstName || "NAMA"} {basics.lastName || "LENGKAP"}
        </h1>
        {basics.headline && (
          <p 
            className="text-slate-600 font-bold uppercase tracking-wider mt-1.5"
            style={{ fontSize: "10pt" }}
          >
            {basics.headline}
          </p>
        )}

        {/* Contact Info - Single Line Divider */}
        <div className="mt-3 flex flex-wrap justify-center gap-x-4 text-slate-700 text-sm font-medium">
          {[
            basics.email,
            basics.phone,
            basics.city || basics.address,
            basics.linkedin?.replace(/^https?:\/\//, ''),
            basics.website?.replace(/^https?:\/\//, '')
          ].filter(Boolean).map((item, idx, arr) => (
            <React.Fragment key={idx}>
              <span className="whitespace-nowrap">{item}</span>
              {idx < arr.length - 1 && <span className="text-slate-300 font-light">|</span>}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Summary - With grey background optional or just clean */}
      {summary && (
        <div className="mb-5">
          <h2 className="font-bold text-slate-900 uppercase text-xs tracking-widest border-b border-slate-300 mb-2 pb-1">
            Executive Summary
          </h2>
          <p className="text-justify leading-relaxed text-slate-800">
            {summary}
          </p>
        </div>
      )}

      {/* Experience */}
      {experiences.length > 0 && (
        <div className="mb-5">
          <h2 className="font-bold text-slate-900 uppercase text-xs tracking-widest border-b border-slate-300 mb-3 pb-1">
            Professional Experience
          </h2>
          <div className="space-y-4">
            {experiences.map((exp, idx) => (
              <div key={idx}>
                <div className="flex justify-between font-bold text-slate-900 items-baseline">
                  <span className="text-lg">{exp.title}</span>
                  <span className="text-right whitespace-nowrap ml-4 text-xs font-medium text-slate-600">
                    {exp.startDate} – {exp.isCurrent ? "Present" : exp.endDate || ""}
                  </span>
                </div>
                <div className="flex justify-between text-slate-700 font-semibold mb-1 text-sm">
                   <span>{exp.company}</span>
                   {exp.city && <span className="font-normal text-slate-500">{exp.city}</span>}
                </div>
                {exp.bullets.length > 0 && (
                  <ul className="list-disc ml-4 space-y-1 text-slate-800">
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

      {/* Education */}
      {education.length > 0 && (
        <div className="mb-5">
          <h2 className="font-bold text-slate-900 uppercase text-xs tracking-widest border-b border-slate-300 mb-3 pb-1">
            Education
          </h2>
          <div className="space-y-3">
            {education.map((edu, idx) => (
              <div key={idx}>
                <div className="flex justify-between font-bold text-slate-900 items-baseline">
                  <span className="text-base">{edu.school}</span>
                  <span className="text-right whitespace-nowrap ml-4 text-xs font-medium text-slate-600">
                     {edu.startDate} – {edu.endDate || "Present"}
                  </span>
                </div>
                <div className="flex justify-between">
                  {(edu.degree || edu.field) && (
                    <span className="text-slate-800 text-sm italic">
                      {edu.degree} {edu.field && `in ${edu.field}`}
                    </span>
                  )}
                </div>
                {edu.description && (
                  <p className="mt-1 text-sm text-slate-600 leading-snug">
                    {edu.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills - Grid Layout for compactness */}
      {skills.length > 0 && (
        <div className="mb-5">
          <h2 className="font-bold text-slate-900 uppercase text-xs tracking-widest border-b border-slate-300 mb-2 pb-1">
            Core Competencies
          </h2>
          <div className="grid grid-cols-3 gap-x-4 gap-y-1.5 text-sm text-slate-800">
            {skills.map((skill, idx) => (
                <div key={idx} className="truncate flex items-center">
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full mr-2 shrink-0"></span>
                    {skill}
                </div>
            ))}
          </div>
        </div>
      )}

      {/* Custom Sections */}
      {customSections && customSections.length > 0 && customSections.map((section, idx) => (
        <div key={idx} className="mb-5">
          <h2 className="font-bold text-slate-900 uppercase text-xs tracking-widest border-b border-slate-300 mb-2 pb-1">
            {section.title}
          </h2>
          <div className="space-y-2">
            {section.items.map((item, iidx) => (
              <div key={iidx}>
                <span className="font-bold text-slate-900 mr-2 text-sm">
                  {item.label}:
                </span>
                {item.description && (
                  <span className="text-slate-800 text-sm leading-relaxed">
                    {item.description}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
