import React from "react";
import { Resume } from "@/lib/schemas/cv-ats";

interface TemplateProps {
  resume: Resume;
}

// Sidebar: Header inside a box, vertical layout
// IMPROVED: Better fonts, cleaner sidebar separation, optimized spacing
export function TemplateSidebar({ resume }: TemplateProps) {
  const { basics, summary, experiences, education, skills, customSections } = resume;

  return (
    <div 
      className="p-[20mm] h-full flex flex-col bg-white"
      style={{
        fontFamily: '"Trebuchet MS", "Lucida Sans Unicode", "Lucida Grande", "Lucida Sans", Arial, sans-serif',
        fontSize: "10pt",
        lineHeight: 1.6,
        color: "#334155",
      }}
    >
      {/* Header Box - More modern styling */}
      <div className="bg-slate-100 p-8 mb-10 border-l-[6px] border-slate-800 rounded-r-sm">
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

      <div className="flex gap-10">
        {/* Left Column (Small) - Contact & Skills */}
        <div className="w-[28%] space-y-10 shrink-0">
          {/* Contact */}
          <div className="space-y-4 text-sm text-slate-600">
            <div className="font-bold text-slate-900 uppercase text-xs tracking-[0.2em] border-b border-slate-200 pb-2 mb-3">Contact</div>
            {basics.email && (
              <div className="break-words">
                <span className="block text-[10px] font-bold text-slate-400 uppercase mb-0.5">Email</span>
                <span className="font-medium text-slate-700">{basics.email}</span>
              </div>
            )}
            {basics.phone && (
              <div>
                <span className="block text-[10px] font-bold text-slate-400 uppercase mb-0.5">Phone</span>
                <span className="font-medium text-slate-700">{basics.phone}</span>
              </div>
            )}
            {(basics.city || basics.address) && (
              <div>
                <span className="block text-[10px] font-bold text-slate-400 uppercase mb-0.5">Location</span>
                <span className="font-medium text-slate-700">{basics.city || basics.address}</span>
              </div>
            )}
            {basics.linkedin && (
              <div className="break-words">
                <span className="block text-[10px] font-bold text-slate-400 uppercase mb-0.5">LinkedIn</span>
                <span className="font-medium text-slate-700">{basics.linkedin.replace(/^https?:\/\//, '').replace(/linkedin\.com\/in\//, '')}</span>
              </div>
            )}
          </div>

          {/* Skills */}
          {skills.length > 0 && (
            <div>
              <div className="font-bold text-slate-900 uppercase text-xs tracking-[0.2em] border-b border-slate-200 pb-2 mb-4">Skills</div>
              <div className="space-y-2 text-sm">
                {skills.map((skill, idx) => (
                  <div key={idx} className="pb-1 border-b border-slate-50 text-slate-700 font-medium">
                    {skill}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education (Short version) */}
          {education.length > 0 && (
            <div>
              <div className="font-bold text-slate-900 uppercase text-xs tracking-[0.2em] border-b border-slate-200 pb-2 mb-4">Education</div>
              <div className="space-y-5 text-sm">
                {education.map((edu, idx) => (
                  <div key={idx}>
                    <div className="font-bold text-slate-800 text-base leading-tight mb-0.5">{edu.degree || "Degree"}</div>
                    <div className="text-slate-600 font-medium">{edu.school}</div>
                    <div className="text-slate-400 text-xs mt-1 font-medium">{edu.endDate || "Present"}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column (Main) */}
        <div className="flex-1 space-y-10 border-l border-slate-100 pl-8">
          {/* Summary */}
          {summary && (
            <div>
              <h2 className="font-bold text-slate-900 uppercase tracking-[0.2em] text-sm mb-4 flex items-center">
                <span className="w-2 h-2 bg-slate-800 mr-3 rounded-full"></span>
                Profile
              </h2>
              <p className="text-justify text-slate-700 leading-relaxed">
                {summary}
              </p>
            </div>
          )}

          {/* Experience */}
          {experiences.length > 0 && (
            <div>
              <h2 className="font-bold text-slate-900 uppercase tracking-[0.2em] text-sm mb-6 flex items-center">
                <span className="w-2 h-2 bg-slate-800 mr-3 rounded-full"></span>
                Work Experience
              </h2>
              <div className="space-y-8">
                {experiences.map((exp, idx) => (
                  <div key={idx} className="relative pl-6 border-l-2 border-slate-200 ml-1">
                    <div className="absolute -left-[7px] top-2 w-3 h-3 bg-white border-2 border-slate-400 rounded-full"></div>
                    <div className="flex justify-between items-baseline mb-1">
                      <h3 className="font-bold text-slate-900 text-lg">{exp.title}</h3>
                      <span className="text-xs text-slate-500 font-bold whitespace-nowrap ml-4 bg-slate-100 px-2 py-0.5 rounded-full">
                        {exp.startDate} – {exp.isCurrent ? "Present" : exp.endDate || ""}
                      </span>
                    </div>
                    <div className="text-sm font-bold text-slate-600 mb-3 uppercase tracking-wide">
                      {exp.company}
                    </div>
                    {exp.bullets.length > 0 && (
                      <ul className="space-y-1.5 text-sm text-slate-700">
                        {exp.bullets.filter(b => b.trim()).map((bullet, bidx) => (
                          <li key={bidx} className="pl-1 text-justify leading-relaxed">- {bullet}</li>
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
              <h2 className="font-bold text-slate-900 uppercase tracking-[0.2em] text-sm mb-4 flex items-center">
                <span className="w-2 h-2 bg-slate-800 mr-3 rounded-full"></span>
                {section.title}
              </h2>
              <div className="space-y-4 pl-6">
                {section.items.map((item, iidx) => (
                  <div key={iidx}>
                    <div className="font-bold text-slate-800 text-sm mb-1">
                      {item.label}
                    </div>
                    {item.description && (
                      <p className="text-slate-600 text-sm leading-relaxed">
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
