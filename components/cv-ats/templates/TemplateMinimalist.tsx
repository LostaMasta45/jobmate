import React from "react";
import { Resume } from "@/lib/schemas/cv-ats";

interface TemplateProps {
  resume: Resume;
}

// Minimalist: Unique Left Sidebar-ish header for Name, Right for contact
// IMPROVED: Better typography, spacing, and alignment
export function TemplateMinimalist({ resume }: TemplateProps) {
  const { basics, summary, experiences, education, skills, customSections } = resume;

  return (
    <div 
      className="p-[20mm] h-full flex flex-col bg-white"
      style={{
        fontFamily: '"Verdana", "Geneva", sans-serif',
        fontSize: "10pt",
        lineHeight: 1.6,
        color: "#333333",
      }}
    >
      {/* Header - Name Left, Contact Right */}
      <div className="flex justify-between items-start border-b border-gray-300 pb-8 mb-8">
        <div className="max-w-[60%]">
          <h1 
            className="font-bold text-gray-900 uppercase tracking-tight"
            style={{ fontSize: "24pt", lineHeight: 1.1 }}
          >
            {basics.firstName}
            <br />
            {basics.lastName}
          </h1>
          {basics.headline && (
            <p 
              className="mt-3 text-gray-500 uppercase tracking-[0.15em] text-xs font-medium"
            >
              {basics.headline}
            </p>
          )}
        </div>
        <div className="text-right text-xs text-gray-600 space-y-1.5 max-w-[35%] font-medium">
          {basics.email && <div className="truncate">{basics.email}</div>}
          {basics.phone && <div>{basics.phone}</div>}
          {(basics.city || basics.address) && <div>{basics.city || basics.address}</div>}
          {basics.linkedin && <div className="truncate text-gray-400">{basics.linkedin.replace(/^https?:\/\//, '')}</div>}
          {basics.website && <div className="truncate text-gray-400">{basics.website.replace(/^https?:\/\//, '')}</div>}
        </div>
      </div>

      {/* Summary */}
      {summary && (
        <div className="mb-8 flex gap-6">
          <h2 className="w-[140px] shrink-0 font-bold text-gray-900 uppercase text-xs tracking-wider pt-1">
            Profile
          </h2>
          <p className="flex-1 text-justify text-sm text-gray-800 leading-relaxed">
            {summary}
          </p>
        </div>
      )}

      {/* Experience */}
      {experiences.length > 0 && (
        <div className="mb-8 flex gap-6">
          {/* Left Column: Title */}
          <h2 className="w-[140px] shrink-0 font-bold text-gray-900 uppercase text-xs tracking-wider pt-[2px]">
            Experience
          </h2>

          {/* Right Column: Divider + Content */}
          <div className="flex-1 min-w-0">
            <div className="h-px bg-gray-200 w-full mb-6 mt-2"></div>
            
            <div className="space-y-8">
              {experiences.map((exp, idx) => (
                <div key={idx} className="relative">
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="font-bold text-gray-900 text-sm">
                      {exp.title}
                    </h3>
                    <span className="text-gray-500 text-xs whitespace-nowrap font-medium ml-4">
                      {exp.startDate} – {exp.isCurrent ? "Present" : exp.endDate || ""}
                    </span>
                  </div>
                  <div className="text-xs text-gray-600 font-bold mb-2.5 uppercase tracking-wide">
                     {exp.company} {exp.city && <span className="text-gray-400 font-medium">— {exp.city}</span>}
                  </div>
                  {exp.bullets.length > 0 && (
                    <ul className="space-y-1.5 text-sm text-gray-700">
                      {exp.bullets.filter(b => b.trim()).map((bullet, bidx) => (
                        <li key={bidx} className="flex items-start gap-2">
                          <span className="mt-2 h-1 w-1 rounded-full bg-gray-300 shrink-0"></span>
                          <span className="text-justify leading-relaxed">{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Education */}
      {education.length > 0 && (
        <div className="mb-8 flex gap-6">
          {/* Left Column: Title */}
          <h2 className="w-[140px] shrink-0 font-bold text-gray-900 uppercase text-xs tracking-wider pt-[2px]">
            Education
          </h2>

          {/* Right Column: Divider + Content */}
          <div className="flex-1 min-w-0">
            <div className="h-px bg-gray-200 w-full mb-6 mt-2"></div>
            
            <div className="space-y-5">
              {education.map((edu, idx) => (
                <div key={idx}>
                   <div className="flex justify-between items-baseline mb-1">
                    <h3 className="font-bold text-gray-900 text-sm">
                      {edu.school}
                    </h3>
                    <span className="text-gray-500 text-xs whitespace-nowrap font-medium ml-4">
                       {edu.startDate} – {edu.endDate || "Present"}
                    </span>
                  </div>
                  {(edu.degree || edu.field) && (
                      <div className="text-sm text-gray-800 italic">
                        {edu.degree} {edu.field && `in ${edu.field}`}
                      </div>
                  )}
                  {edu.description && (
                    <p className="mt-1.5 text-xs text-gray-600 leading-relaxed">
                      {edu.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <div className="mb-8 flex gap-6">
          <h2 className="w-[140px] shrink-0 font-bold text-gray-900 uppercase text-xs tracking-wider pt-1">
            Skills
          </h2>
          <div className="flex-1 text-sm text-gray-800 leading-relaxed">
            {skills.join(", ")}
          </div>
        </div>
      )}

      {/* Custom Sections */}
      {customSections && customSections.length > 0 && customSections.map((section, idx) => (
        <div key={idx} className="mb-8 flex gap-6">
          <h2 className="w-[140px] shrink-0 font-bold text-gray-900 uppercase text-xs tracking-wider pt-1">
            {section.title}
          </h2>
          <div className="flex-1 space-y-3">
            {section.items.map((item, iidx) => (
              <div key={iidx}>
                <p className="font-bold text-gray-900 text-sm">
                  {item.label}
                </p>
                {item.description && (
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {item.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
