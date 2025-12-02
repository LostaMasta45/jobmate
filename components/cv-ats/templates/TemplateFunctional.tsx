import React from "react";
import { Resume } from "@/lib/schemas/cv-ats";

interface TemplateProps {
  resume: Resume;
}

// Functional: Monospace headers, dashed lines, technical feel
// IMPROVED: Better monospace font stack, optimized spacing
export function TemplateFunctional({ resume }: TemplateProps) {
  const { basics, summary, experiences, education, skills, customSections } = resume;

  return (
    <div 
      className="p-[20mm] h-full flex flex-col bg-white"
      style={{
        fontFamily: '"JetBrains Mono", "Fira Code", "Courier New", Courier, monospace', // Better monospace stack
        fontSize: "10pt",
        lineHeight: 1.5,
        color: "#111827",
      }}
    >
      {/* Header */}
      <div className="border-b border-dashed border-gray-400 pb-6 mb-8">
        <h1 
          className="text-3xl font-bold text-gray-900 uppercase tracking-tighter mb-2"
        >
          &gt; {basics.firstName} {basics.lastName}_
        </h1>
        {basics.headline && (
          <p className="text-gray-600 text-lg">
            {basics.headline}
          </p>
        )}

        <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-xs text-gray-600 font-medium font-sans">
          {basics.email && <span>[{basics.email}]</span>}
          {basics.phone && <span>[{basics.phone}]</span>}
          {(basics.city || basics.address) && <span>[{basics.city || basics.address}]</span>}
          {basics.linkedin && <span>[in/{basics.linkedin.replace(/^https?:\/\//, '').replace(/linkedin\.com\/in\//, '')}]</span>}
          {basics.website && <span>[{basics.website.replace(/^https?:\/\//, '')}]</span>}
        </div>
      </div>

      {/* Body Content - Switch to Sans Serif for readability but keep headers Mono */}
      <div style={{ fontFamily: '"Inter", "Roboto", "Arial", sans-serif' }}>
        
        {/* Summary */}
        {summary && (
          <div className="mb-8">
            <h2 className="font-mono font-bold text-gray-900 uppercase text-sm mb-3 border-b border-dashed border-gray-300 pb-1 tracking-tight">
              # SUMMARY
            </h2>
            <p className="text-justify text-sm leading-relaxed text-gray-800">
              {summary}
            </p>
          </div>
        )}

        {/* Experience */}
        {experiences.length > 0 && (
          <div className="mb-8">
            <h2 className="font-mono font-bold text-gray-900 uppercase text-sm mb-5 border-b border-dashed border-gray-300 pb-1 tracking-tight">
              # EXPERIENCE
            </h2>
            <div className="space-y-6">
              {experiences.map((exp, idx) => (
                <div key={idx}>
                  <div className="flex justify-between items-baseline font-mono text-sm mb-1">
                    <span className="font-bold bg-gray-100 px-1 py-0.5 rounded-sm text-gray-900">{exp.title}</span>
                    <span className="text-xs text-gray-500 shrink-0 ml-2">
                      {exp.startDate} // {exp.isCurrent ? "NOW" : exp.endDate || ""}
                    </span>
                  </div>
                  <div className="text-sm font-bold text-gray-700 mb-2 pl-1">
                     @{exp.company} {exp.city && <span className="font-normal text-gray-500">({exp.city})</span>}
                  </div>
                  {exp.bullets.length > 0 && (
                    <ul className="list-disc ml-5 space-y-1.5 text-sm text-gray-600">
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

        {/* Skills */}
        {skills.length > 0 && (
          <div className="mb-8">
            <h2 className="font-mono font-bold text-gray-900 uppercase text-sm mb-4 border-b border-dashed border-gray-300 pb-1 tracking-tight">
              # TECH_STACK
            </h2>
            <div className="flex flex-wrap gap-2 text-sm font-mono">
              {skills.map((skill, idx) => (
                  <span key={idx} className="border border-gray-300 bg-gray-50 px-2 py-1 rounded text-xs text-gray-700">
                      {skill}
                  </span>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {education.length > 0 && (
          <div className="mb-8">
            <h2 className="font-mono font-bold text-gray-900 uppercase text-sm mb-4 border-b border-dashed border-gray-300 pb-1 tracking-tight">
              # EDUCATION
            </h2>
            <div className="space-y-4">
              {education.map((edu, idx) => (
                <div key={idx} className="flex justify-between items-start text-sm">
                  <div>
                    <div className="font-bold text-gray-900">{edu.school}</div>
                    {(edu.degree || edu.field) && (
                      <div className="text-gray-600 italic mt-0.5">
                        {edu.degree} {edu.field && `in ${edu.field}`}
                      </div>
                    )}
                  </div>
                  <div className="text-xs font-mono text-gray-500 text-right shrink-0 ml-4">
                     {edu.startDate} - {edu.endDate || "NOW"}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Custom Sections */}
        {customSections && customSections.length > 0 && customSections.map((section, idx) => (
          <div key={idx} className="mb-8">
            <h2 className="font-mono font-bold text-gray-900 uppercase text-sm mb-3 border-b border-dashed border-gray-200 pb-1 tracking-tight">
              # {section.title.toUpperCase()}
            </h2>
            <div className="space-y-3 text-sm">
              {section.items.map((item, iidx) => (
                <div key={iidx} className="grid grid-cols-[140px_1fr] gap-4">
                  <span className="font-bold font-mono text-xs text-gray-700">{item.label}</span>
                  <span className="text-gray-600 leading-relaxed">{item.description}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
