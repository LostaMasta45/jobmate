import React from "react";
import { Resume } from "@/lib/schemas/cv-ats";

interface TemplateProps {
  resume: Resume;
}

// Elegant: Serif, Double Borders, Small Caps headers
// IMPROVED: Typography, spacing, and visual balance
export function TemplateElegant({ resume }: TemplateProps) {
  const { basics, summary, experiences, education, skills, customSections } = resume;

  return (
    <div 
      className="p-[20mm] h-full flex flex-col bg-white"
      style={{
        fontFamily: '"Georgia", "Times New Roman", serif', // Kept Georgia as primary, it's great for elegant
        fontSize: "10.5pt",
        lineHeight: 1.6, // Increased line height
        color: "#334155", // text-slate-700
      }}
    >
      {/* Header */}
      <div className="text-center mb-8">
        <h1 
          className="font-serif font-bold text-slate-900 mb-3 tracking-wide"
          style={{ fontSize: "28pt", lineHeight: 1.1 }}
        >
          {basics.firstName} {basics.lastName}
        </h1>
        {basics.headline && (
          <p 
            className="text-slate-600 italic font-serif mb-4"
            style={{ fontSize: "12pt" }}
          >
            {basics.headline}
          </p>
        )}
        
        <div className="flex flex-wrap justify-center gap-x-4 text-sm text-slate-600 border-t border-b border-double border-slate-300 py-3">
          {basics.email && <span>{basics.email}</span>}
          {basics.phone && <span className="before:content-['•'] before:mr-4 before:text-slate-400">{basics.phone}</span>}
          {(basics.city || basics.address) && <span className="before:content-['•'] before:mr-4 before:text-slate-400">{basics.city || basics.address}</span>}
          {basics.linkedin && <span className="before:content-['•'] before:mr-4 before:text-slate-400">{basics.linkedin.replace(/^https?:\/\//, '')}</span>}
        </div>
      </div>

      {/* Summary */}
      {summary && (
        <div className="mb-6">
          <h2 
            className="font-bold text-center text-slate-900 uppercase tracking-[0.2em] mb-3 border-b border-slate-200 pb-2"
            style={{ fontSize: "10pt" }}
          >
            Professional Profile
          </h2>
          <p className="text-justify text-slate-800 indent-8 leading-relaxed">
            {summary}
          </p>
        </div>
      )}

      {/* Experience */}
      {experiences.length > 0 && (
        <div className="mb-6">
          <h2 
            className="font-bold text-center text-slate-900 uppercase tracking-[0.2em] mb-5 border-b border-slate-200 pb-2"
            style={{ fontSize: "10pt" }}
          >
            Experience
          </h2>
          <div className="space-y-7">
            {experiences.map((exp, idx) => (
              <div key={idx}>
                <div className="flex justify-between items-baseline font-bold text-slate-900 mb-1">
                  <span style={{ fontSize: "12pt" }}>{exp.company}</span>
                  <span className="font-normal text-slate-500 italic text-sm">
                    {exp.startDate} – {exp.isCurrent ? "Present" : exp.endDate || ""}
                  </span>
                </div>
                <div className="flex justify-between items-baseline mb-2">
                  <span className="font-bold text-slate-700 italic">{exp.title}</span>
                  {exp.city && <span className="text-xs text-slate-500 font-sans">{exp.city}</span>}
                </div>
                {exp.bullets.length > 0 && (
                  <ul className="list-disc ml-5 space-y-1.5 text-slate-800">
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
        <div className="mb-6">
          <h2 
            className="font-bold text-center text-slate-900 uppercase tracking-[0.2em] mb-5 border-b border-slate-200 pb-2"
            style={{ fontSize: "10pt" }}
          >
            Education
          </h2>
          <div className="space-y-5">
            {education.map((edu, idx) => (
              <div key={idx}>
                <div className="flex justify-between items-baseline font-bold text-slate-900 mb-1">
                  <span style={{ fontSize: "11pt" }}>{edu.school}</span>
                  <span className="font-normal text-slate-500 italic text-sm">
                     {edu.startDate} – {edu.endDate || "Present"}
                  </span>
                </div>
                <div>
                  {(edu.degree || edu.field) && (
                    <span className="italic text-slate-800">
                      {edu.degree} {edu.field && `in ${edu.field}`}
                    </span>
                  )}
                </div>
                {edu.description && (
                  <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                    {edu.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <div className="mb-6">
          <h2 
            className="font-bold text-center text-slate-900 uppercase tracking-[0.2em] mb-3 border-b border-slate-200 pb-2"
            style={{ fontSize: "10pt" }}
          >
            Expertise
          </h2>
          <div className="text-center px-8 leading-loose text-slate-800">
            {skills.map((skill, index) => (
              <React.Fragment key={index}>
                {index > 0 && <span className="mx-3 text-slate-400">•</span>}
                <span>{skill}</span>
              </React.Fragment>
            ))}
          </div>
        </div>
      )}

      {/* Custom Sections */}
      {customSections && customSections.length > 0 && customSections.map((section, idx) => (
        <div key={idx} className="mb-6">
          <h2 
            className="font-bold text-center text-slate-900 uppercase tracking-[0.2em] mb-3 border-b border-slate-200 pb-2"
            style={{ fontSize: "10pt" }}
          >
            {section.title}
          </h2>
          <div className="space-y-3">
            {section.items.map((item, iidx) => (
              <div key={iidx}>
                <p className="font-bold text-slate-900">
                  {item.label}
                </p>
                {item.description && (
                  <p className="text-slate-700 leading-relaxed">
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
