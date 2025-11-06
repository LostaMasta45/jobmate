"use client";

import * as React from "react";
import { Resume } from "@/lib/schemas/cv-ats";

interface CVATSPreviewProps {
  resume: Resume;
}

export function CVATSPreview({ resume }: CVATSPreviewProps) {
  return (
    <div 
      style={{
        width: '210mm',
        minHeight: '297mm',
        backgroundColor: '#ffffff',
        padding: '20mm',
        fontFamily: 'Arial, sans-serif',
        fontSize: '11pt',
        lineHeight: 1.5,
        color: '#000000',
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: '16pt' }}>
        <h1 style={{ 
          fontSize: '20pt', 
          fontWeight: 'bold', 
          margin: 0,
          marginBottom: '4pt',
          textTransform: 'uppercase',
        }}>
          {resume.basics?.firstName} {resume.basics?.lastName}
        </h1>
        {resume.basics?.headline && (
          <div style={{ fontSize: '12pt', fontWeight: '600', marginBottom: '8pt' }}>
            {resume.basics.headline}
          </div>
        )}
        <div style={{ fontSize: '10pt', lineHeight: 1.6 }}>
          {resume.basics?.email && <div>Email: {resume.basics.email}</div>}
          {resume.basics?.phone && <div>Phone: {resume.basics.phone}</div>}
          {resume.basics?.city && <div>Location: {resume.basics.city}</div>}
          {resume.basics?.linkedin && <div>LinkedIn: {resume.basics.linkedin}</div>}
        </div>
      </div>

      {/* Summary */}
      {resume.summary && (
        <div style={{ marginBottom: '16pt' }}>
          <h2 style={{ 
            fontSize: '14pt', 
            fontWeight: 'bold',
            borderBottom: '2pt solid #000',
            paddingBottom: '4pt',
            marginBottom: '8pt',
            textTransform: 'uppercase',
          }}>
            Professional Summary
          </h2>
          <p style={{ margin: 0 }}>{resume.summary}</p>
        </div>
      )}

      {/* Experience */}
      {resume.experiences && resume.experiences.length > 0 && (
        <div style={{ marginBottom: '16pt' }}>
          <h2 style={{ 
            fontSize: '14pt', 
            fontWeight: 'bold',
            borderBottom: '2pt solid #000',
            paddingBottom: '4pt',
            marginBottom: '8pt',
            textTransform: 'uppercase',
          }}>
            Work Experience
          </h2>
          {resume.experiences.map((exp, idx) => (
            <div key={idx} style={{ marginBottom: '12pt' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2pt' }}>
                <div style={{ fontWeight: 'bold', fontSize: '12pt' }}>{exp.title}</div>
                <div style={{ fontSize: '10pt' }}>
                  {exp.startDate} - {exp.isCurrent ? 'Present' : exp.endDate}
                </div>
              </div>
              <div style={{ fontWeight: '600', marginBottom: '4pt' }}>{exp.company}</div>
              {exp.bullets && exp.bullets.length > 0 && (
                <ul style={{ margin: '4pt 0', paddingLeft: '20pt' }}>
                  {exp.bullets.slice(0, 3).map((bullet, bidx) => (
                    <li key={bidx} style={{ marginBottom: '2pt' }}>{bullet}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {resume.education && resume.education.length > 0 && (
        <div style={{ marginBottom: '16pt' }}>
          <h2 style={{ 
            fontSize: '14pt', 
            fontWeight: 'bold',
            borderBottom: '2pt solid #000',
            paddingBottom: '4pt',
            marginBottom: '8pt',
            textTransform: 'uppercase',
          }}>
            Education
          </h2>
          {resume.education.map((edu, idx) => (
            <div key={idx} style={{ marginBottom: '8pt' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontWeight: 'bold' }}>{edu.school}</div>
                  <div>{edu.degree} {edu.field}</div>
                </div>
                <div style={{ fontSize: '10pt' }}>
                  {edu.startDate} - {edu.endDate}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {resume.skills && resume.skills.length > 0 && (
        <div>
          <h2 style={{ 
            fontSize: '14pt', 
            fontWeight: 'bold',
            borderBottom: '2pt solid #000',
            paddingBottom: '4pt',
            marginBottom: '8pt',
            textTransform: 'uppercase',
          }}>
            Skills
          </h2>
          <div style={{ lineHeight: 1.8 }}>
            {resume.skills.join(' • ')}
          </div>
        </div>
      )}
    </div>
  );
}
