import React from "react";
import { Resume } from "@/lib/schemas/cv-ats";

interface TemplateProps {
  resume: Resume;
}

// Modern: Left Align, Sans-Serif, No Lines, Bold Headers
// IMPROVED: Better typography, clearer hierarchy, better spacing
export function TemplateModern({ resume }: TemplateProps) {
  const { basics, summary, experiences, education, skills, customSections } = resume;

  return (
    <div 
      className="p-[20mm] h-full flex flex-col bg-white"
      style={{
        fontFamily: '"Inter", "Roboto", "Helvetica Neue", Arial, sans-serif', // Updated font stack
        fontSize: "10.5pt",
        lineHeight: 1.5,
        color: "#1a1a1a",
      }}
    >
      {/* Header - Left Aligned */}
      <div className="mb-10">
        <h1 
          className="font-extrabold uppercase tracking-tight text-slate-900"
          style={{ fontSize: "28pt", lineHeight: 1.1 }}
        >
          {basics.firstName || "NAMA"} {basics.lastName || "LENGKAP"}
        </h1>
        {basics.headline && (
          <p 
            className="mt-2 text-slate-600 font-medium text-lg"
          >
            {basics.headline}
          </p>
        )}

        {/* Contact Info - Stacked or Grid */}
        <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-slate-500 text-sm font-medium">
          {basics.email && (
            <div>{basics.email}</div>
          )}
          {basics.phone && (
            <div>{basics.phone}</div>
          )}
          {(basics.city || basics.address) && (
            <div>{basics.city || basics.address}</div>
          )}
          {basics.linkedin && (
            <div className="break-all">{basics.linkedin.replace(/^https?:\/\//, '')}</div>
          )}
           {basics.website && (
            <div className="break-all">{basics.website.replace(/^https?:\/\//, '')}</div>
          )}
        </div>
      </div>

      {/* Summary */}
      {summary && (
        <div className="mb-8">
          <h2 
            className="font-bold text-slate-900 uppercase tracking-widest mb-3 text-xs border-b-2 border-slate-900 pb-2 inline-block"
          >
            Ringkasan
          </h2>
          <p className="text-justify text-slate-800 leading-relaxed">
            {summary}
          </p>
        </div>
      )}

      {/* Experience */}
      {experiences.length > 0 && (
        <div className="mb-8">
          <h2 
            className="font-bold text-slate-900 uppercase tracking-widest mb-6 text-xs border-b-2 border-slate-900 pb-2 inline-block"
          >
            Pengalaman Kerja
          </h2>
          <div className="space-y-8">
            {experiences.map((exp, idx) => (
              <div key={idx}>
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-bold text-slate-900 text-lg">
                    {exp.title}
                  </h3>
                  <div className="text-right text-slate-500 text-xs shrink-0 ml-4 font-semibold bg-slate-100 px-2 py-1 rounded">
                    {exp.startDate} – {exp.isCurrent ? "Sekarang" : exp.endDate || ""}
                  </div>
                </div>
                <div className="mb-3 text-slate-700 font-medium">
                   <span>{exp.company}</span>
                   {exp.city && <span className="text-slate-400 font-normal"> | {exp.city}</span>}
                </div>
                {exp.bullets.length > 0 && (
                  <ul className="list-disc ml-4 space-y-2 text-slate-600">
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
        <div className="mb-8">
          <h2 
            className="font-bold text-slate-900 uppercase tracking-widest mb-5 text-xs border-b-2 border-slate-900 pb-2 inline-block"
          >
            Pendidikan
          </h2>
          <div className="space-y-5">
            {education.map((edu, idx) => (
              <div key={idx}>
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-bold text-slate-900 text-base">
                    {edu.school}
                  </h3>
                  <div className="text-right text-slate-500 text-xs shrink-0 ml-4 font-medium">
                     {edu.startDate} – {edu.endDate || "Sekarang"}
                  </div>
                </div>
                <div>
                  {(edu.degree || edu.field) && (
                    <span className="text-slate-700 font-medium">
                      {edu.degree} {edu.field && `in ${edu.field}`}
                    </span>
                  )}
                </div>
                {edu.description && (
                  <p className="mt-2 text-slate-600 text-sm leading-relaxed">
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
        <div className="mb-8">
          <h2 
            className="font-bold text-slate-900 uppercase tracking-widest mb-4 text-xs border-b-2 border-slate-900 pb-2 inline-block"
          >
            Keterampilan
          </h2>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, idx) => (
                <span key={idx} className="bg-slate-100 px-3 py-1.5 rounded-md text-slate-800 text-sm font-medium border border-slate-200 print:border-slate-300">
                    {skill}
                </span>
            ))}
          </div>
        </div>
      )}

      {/* Custom Sections */}
      {customSections && customSections.length > 0 && customSections.map((section, idx) => (
        <div key={idx} className="mb-8">
          <h2 
            className="font-bold text-slate-900 uppercase tracking-widest mb-4 text-xs border-b-2 border-slate-900 pb-2 inline-block"
          >
            {section.title}
          </h2>
          <div className="space-y-4">
            {section.items.map((item, iidx) => (
              <div key={iidx}>
                <p className="font-bold text-slate-900 mb-1">
                  {item.label}
                </p>
                {item.description && (
                  <p className="text-slate-600 leading-relaxed">
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
