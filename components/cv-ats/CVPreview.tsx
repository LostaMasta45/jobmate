"use client";

import { Resume } from "@/lib/schemas/cv-ats";
import { Card } from "@/components/ui/card";
import { Mail, Phone, Globe, Linkedin, MapPin } from "lucide-react";

interface CVPreviewProps {
  resume: Resume;
}

export function CVPreview({ resume }: CVPreviewProps) {
  const { basics, summary, experiences, education, skills, customSections } = resume;

  return (
    <Card className="mx-auto max-w-3xl bg-white p-8 shadow-lg">
      {/* Header */}
      <div className="border-b-2 border-gray-900 pb-4">
        <h1 className="text-3xl font-bold text-gray-900">
          {basics.firstName} {basics.lastName}
        </h1>
        {basics.headline && (
          <p className="mt-1 text-lg text-gray-700">{basics.headline}</p>
        )}

        {/* Contact Info */}
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600">
          {basics.email && (
            <div className="flex items-center gap-1">
              <Mail className="h-3.5 w-3.5" />
              <span>{basics.email}</span>
            </div>
          )}
          {basics.phone && (
            <div className="flex items-center gap-1">
              <Phone className="h-3.5 w-3.5" />
              <span>{basics.phone}</span>
            </div>
          )}
          {(basics.city || basics.address) && (
            <div className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" />
              <span>{basics.city || basics.address}</span>
            </div>
          )}
          {basics.website && (
            <div className="flex items-center gap-1">
              <Globe className="h-3.5 w-3.5" />
              <span className="break-all">{basics.website}</span>
            </div>
          )}
          {basics.linkedin && (
            <div className="flex items-center gap-1">
              <Linkedin className="h-3.5 w-3.5" />
              <span className="break-all">{basics.linkedin}</span>
            </div>
          )}
        </div>
      </div>

      {/* Summary */}
      {summary && (
        <div className="mt-6">
          <h2 className="text-lg font-bold text-gray-900">RINGKASAN</h2>
          <p className="mt-2 text-sm leading-relaxed text-gray-700">{summary}</p>
        </div>
      )}

      {/* Experience */}
      {experiences.length > 0 && (
        <div className="mt-6">
          <h2 className="text-lg font-bold text-gray-900">PENGALAMAN PROFESIONAL</h2>
          <div className="mt-3 space-y-4">
            {experiences.map((exp, idx) => (
              <div key={idx}>
                <div className="flex justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">{exp.title}</h3>
                    <p className="text-sm text-gray-700">{exp.company}</p>
                  </div>
                  <div className="text-right text-sm text-gray-600">
                    {exp.city && <p>{exp.city}</p>}
                    <p>
                      {exp.startDate} - {exp.isCurrent ? "Sekarang" : exp.endDate || ""}
                    </p>
                  </div>
                </div>
                {exp.bullets.length > 0 && (
                  <ul className="mt-2 ml-4 list-disc text-sm text-gray-700">
                    {exp.bullets.map((bullet, bidx) => (
                      <li key={bidx}>{bullet}</li>
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
        <div className="mt-6">
          <h2 className="text-lg font-bold text-gray-900">PENDIDIKAN</h2>
          <div className="mt-3 space-y-3">
            {education.map((edu, idx) => (
              <div key={idx}>
                <div className="flex justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">{edu.school}</h3>
                    {(edu.degree || edu.field) && (
                      <p className="text-sm text-gray-700">
                        {edu.degree} {edu.field && `in ${edu.field}`}
                      </p>
                    )}
                  </div>
                  {(edu.startDate || edu.endDate) && (
                    <p className="text-sm text-gray-600">
                      {edu.startDate} {edu.endDate && `- ${edu.endDate}`}
                    </p>
                  )}
                </div>
                {edu.description && (
                  <p className="mt-1 text-sm text-gray-700">{edu.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <div className="mt-6">
          <h2 className="text-lg font-bold text-gray-900">KETERAMPILAN</h2>
          <div className="mt-2 flex flex-wrap gap-2">
            {skills.map((skill, idx) => (
              <span
                key={idx}
                className="rounded bg-gray-100 px-3 py-1 text-sm text-gray-700"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Custom Sections */}
      {customSections.map((section, idx) => (
        <div key={idx} className="mt-6">
          <h2 className="text-lg font-bold text-gray-900">{section.title.toUpperCase()}</h2>
          <div className="mt-3 space-y-2">
            {section.items.map((item, iidx) => (
              <div key={iidx}>
                <p className="font-semibold text-gray-900">{item.label}</p>
                {item.description && (
                  <p className="text-sm text-gray-700">{item.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </Card>
  );
}
