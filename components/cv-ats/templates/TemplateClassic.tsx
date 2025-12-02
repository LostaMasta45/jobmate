import React from "react";
import { Resume } from "@/lib/schemas/cv-ats";
import { Mail, Phone, Globe, Linkedin, MapPin } from "lucide-react";

interface TemplateProps {
  resume: Resume;
}

// Classic: Center Header, Serif, Horizontal Lines
// IMPROVED: Better typography, spacing, and visual hierarchy
export function TemplateClassic({ resume }: TemplateProps) {
  const { basics, summary, experiences, education, skills, customSections } = resume;

  return (
    <div 
      className="p-[20mm] h-full flex flex-col bg-white"
      style={{
        fontFamily: '"Charter", "Bitstream Charter", "Sitka Text", Cambria, serif',
        fontSize: "10.5pt",
        lineHeight: 1.5, // Increased from 1.2 for better readability
        color: "#111827", // text-gray-900
      }}
    >
      {/* Header */}
      <div className="border-b-2 border-gray-900 pb-6 mb-6">
        <h1 
          className="text-center font-bold text-gray-900 uppercase tracking-wide"
          style={{ fontSize: "24pt", lineHeight: 1.1 }} // Increased size
        >
          {basics.firstName || "NAMA"} {basics.lastName || "LENGKAP"}
        </h1>
        {basics.headline && (
          <p 
            className="mt-2 text-center font-medium text-gray-700"
            style={{ fontSize: "12pt" }}
          >
            {basics.headline}
          </p>
        )}

        {/* Contact Info */}
        <div className="mt-4 flex flex-wrap justify-center gap-x-3 gap-y-1 text-gray-600 font-medium" style={{ fontSize: "10pt" }}>
          {basics.email && (
            <div className="flex items-center">
              <span>{basics.email}</span>
            </div>
          )}
          {basics.phone && (
            <div className="flex items-center">
              <span className="mx-2 text-gray-300">|</span>
              <span>{basics.phone}</span>
            </div>
          )}
          {(basics.city || basics.address) && (
            <div className="flex items-center">
              <span className="mx-2 text-gray-300">|</span>
              <span>{basics.city || basics.address}</span>
            </div>
          )}
          {basics.linkedin && (
            <div className="flex items-center">
              <span className="mx-2 text-gray-300">|</span>
              <span className="break-all">{basics.linkedin.replace(/^https?:\/\//, '')}</span>
            </div>
          )}
          {basics.website && (
            <div className="flex items-center">
              <span className="mx-2 text-gray-300">|</span>
              <span className="break-all">{basics.website.replace(/^https?:\/\//, '')}</span>
            </div>
          )}
        </div>
      </div>

      {/* Summary */}
      {summary && (
        <div className="mb-6">
          <h2 
            className="font-bold text-gray-900 border-b border-gray-300 pb-1 uppercase tracking-widest mb-3"
            style={{ fontSize: "11pt" }}
          >
            Ringkasan Profesional
          </h2>
          <p className="text-justify leading-relaxed text-gray-800">
            {summary}
          </p>
        </div>
      )}

      {/* Experience */}
      {experiences.length > 0 && (
        <div className="mb-6">
          <h2 
            className="font-bold text-gray-900 border-b border-gray-300 pb-1 uppercase tracking-widest mb-4"
            style={{ fontSize: "11pt" }}
          >
            Pengalaman Kerja
          </h2>
          <div className="space-y-6">
            {experiences.map((exp, idx) => (
              <div key={idx}>
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-bold text-gray-900" style={{ fontSize: "12pt" }}>
                    {exp.title}
                  </h3>
                  <div className="text-right whitespace-nowrap shrink-0 ml-4 italic text-gray-600" style={{ fontSize: "10pt" }}>
                    {exp.startDate} – {exp.isCurrent ? "Sekarang" : exp.endDate || ""}
                  </div>
                </div>
                
                <div className="flex justify-between items-center mb-2 text-gray-700">
                   <span className="font-semibold" style={{ fontSize: "11pt" }}>
                    {exp.company}
                  </span>
                  {exp.city && (
                    <span className="text-gray-500 text-sm">
                      {exp.city}
                    </span>
                  )}
                </div>
                
                {exp.bullets.length > 0 && (
                  <ul className="ml-4 list-disc marker:text-gray-500 space-y-1.5">
                    {exp.bullets.filter(b => b.trim()).map((bullet, bidx) => (
                      <li key={bidx} className="pl-1 text-justify leading-relaxed text-gray-800">{bullet}</li>
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
            className="font-bold text-gray-900 border-b border-gray-300 pb-1 uppercase tracking-widest mb-4"
            style={{ fontSize: "11pt" }}
          >
            Pendidikan
          </h2>
          <div className="space-y-4">
            {education.map((edu, idx) => (
              <div key={idx}>
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-bold text-gray-900" style={{ fontSize: "12pt" }}>
                    {edu.school}
                  </h3>
                  <div className="text-right whitespace-nowrap shrink-0 ml-4 italic text-gray-600" style={{ fontSize: "10pt" }}>
                     {edu.startDate} – {edu.endDate || "Sekarang"}
                  </div>
                </div>
                <div className="text-gray-800">
                  {(edu.degree || edu.field) && (
                    <span className="font-medium italic" style={{ fontSize: "11pt" }}>
                      {edu.degree} {edu.field && `in ${edu.field}`}
                    </span>
                  )}
                </div>
                {edu.description && (
                  <p className="mt-1 text-sm leading-relaxed text-gray-700" style={{ fontSize: "10pt" }}>
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
            className="font-bold text-gray-900 border-b border-gray-300 pb-1 uppercase tracking-widest mb-3"
            style={{ fontSize: "11pt" }}
          >
            Keterampilan
          </h2>
          <div className="leading-relaxed text-justify text-gray-800">
            {skills.join(" • ")}
          </div>
        </div>
      )}

      {/* Custom Sections */}
      {customSections && customSections.length > 0 && customSections.map((section, idx) => (
        <div key={idx} className="mb-6">
          <h2 
            className="font-bold text-gray-900 border-b border-gray-300 pb-1 uppercase tracking-widest mb-3"
            style={{ fontSize: "11pt" }}
          >
            {section.title}
          </h2>
          <div className="space-y-3">
            {section.items.map((item, iidx) => (
              <div key={iidx}>
                <p className="font-bold text-gray-900" style={{ fontSize: "11pt" }}>
                  {item.label}
                </p>
                {item.description && (
                  <p className="leading-relaxed text-gray-800" style={{ fontSize: "10pt" }}>
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
