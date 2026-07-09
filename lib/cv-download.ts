// Client-side CV download utilities

import { Resume } from "@/lib/schemas/cv-ats";
import jsPDF from "jspdf";
import { Document, Paragraph, TextRun, HeadingLevel, AlignmentType, BorderStyle, ShadingType } from "docx";
import { saveAs } from "file-saver";
import { Packer } from "docx";
import React from "react";
import { createRoot } from "react-dom/client";
import html2canvas from "html2canvas";

// Generate plain text from resume
export function generatePlainTextResume(resume: Resume): string {
  let text = "";

  // Header
  text += `${resume.basics.firstName} ${resume.basics.lastName}\n`;
  if (resume.basics.headline) text += `${resume.basics.headline}\n`;
  text += "\n";
  
  // Contact
  if (resume.basics.email) text += `Email: ${resume.basics.email}\n`;
  if (resume.basics.phone) text += `Phone: ${resume.basics.phone}\n`;
  if (resume.basics.city) text += `Location: ${resume.basics.city}\n`;
  if (resume.basics.website) text += `Website: ${resume.basics.website}\n`;
  if (resume.basics.linkedin) text += `LinkedIn: ${resume.basics.linkedin}\n`;
  text += "\n";

  // Summary
  if (resume.summary) {
    text += "SUMMARY\n";
    text += "=".repeat(60) + "\n";
    text += `${resume.summary}\n\n`;
  }

  // Experience
  if (resume.experiences && resume.experiences.length > 0) {
    text += "PROFESSIONAL EXPERIENCE\n";
    text += "=".repeat(60) + "\n";
    resume.experiences.forEach((exp) => {
      text += `\n${exp.title} | ${exp.company}\n`;
      text += `${exp.startDate} - ${exp.isCurrent ? "Present" : exp.endDate || ""}`;
      if (exp.city) text += ` | ${exp.city}`;
      text += "\n";
      exp.bullets.forEach((bullet) => {
        if (bullet.trim()) text += `• ${bullet}\n`;
      });
      text += "\n";
    });
  }

  // Education
  if (resume.education && resume.education.length > 0) {
    text += "EDUCATION\n";
    text += "=".repeat(60) + "\n";
    resume.education.forEach((edu) => {
      text += `\n${edu.school}\n`;
      if (edu.degree || edu.field) {
        text += `${edu.degree || ""} ${edu.field || ""}`.trim() + "\n";
      }
      if (edu.startDate || edu.endDate) {
        text += `${edu.startDate || ""} - ${edu.endDate || ""}`.trim() + "\n";
      }
      if (edu.description) {
        text += `${edu.description}\n`;
      }
      text += "\n";
    });
  }

  // Skills
  if (resume.skills && resume.skills.length > 0) {
    text += "SKILLS\n";
    text += "=".repeat(60) + "\n";
    text += resume.skills.join(", ") + "\n\n";
  }

  // Custom Sections
  if (resume.customSections && resume.customSections.length > 0) {
    resume.customSections.forEach((section) => {
      text += `${section.title.toUpperCase()}\n`;
      text += "=".repeat(60) + "\n";
      section.items.forEach((item) => {
        text += `\n${item.label}\n`;
        if (item.description) {
          text += `${item.description}\n`;
        }
      });
      text += "\n";
    });
  }

  return text;
}

// Download resume as text file
export function downloadResumeAsText(resume: Resume): void {
  const content = generatePlainTextResume(resume);
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement("a");
  a.href = url;
  a.download = `${resume.title || "CV"}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Download resume as PDF (real PDF using jsPDF)
const A4_WIDTH_PX = 794;
const A4_HEIGHT_PX = 1123;

async function renderTemplateToDOM(resume: Resume): Promise<HTMLDivElement> {
  const [
    { TemplateClassic },
    { TemplateModern },
    { TemplateExecutive },
    { TemplateMinimalist },
    { TemplateCorporate },
    { TemplateElegant },
    { TemplateFunctional },
    { TemplateSidebar }
  ] = await Promise.all([
    import("@/components/cv-ats/templates/TemplateClassic"),
    import("@/components/cv-ats/templates/TemplateModern"),
    import("@/components/cv-ats/templates/TemplateExecutive"),
    import("@/components/cv-ats/templates/TemplateMinimalist"),
    import("@/components/cv-ats/templates/TemplateCorporate"),
    import("@/components/cv-ats/templates/TemplateElegant"),
    import("@/components/cv-ats/templates/TemplateFunctional"),
    import("@/components/cv-ats/templates/TemplateSidebar"),
  ]);

  let TemplateComponent = TemplateClassic;
  switch (resume.templateId) {
    case "modern": TemplateComponent = TemplateModern; break;
    case "executive": TemplateComponent = TemplateExecutive; break;
    case "minimalist": TemplateComponent = TemplateMinimalist; break;
    case "corporate": TemplateComponent = TemplateCorporate; break;
    case "elegant": TemplateComponent = TemplateElegant; break;
    case "functional": TemplateComponent = TemplateFunctional; break;
    case "sidebar": TemplateComponent = TemplateSidebar; break;
  }

  const container = document.createElement("div");
  container.style.position = "absolute";
  container.style.top = "-9999px";
  container.style.left = "-9999px";
  container.style.width = `${A4_WIDTH_PX}px`;
  container.style.minHeight = `${A4_HEIGHT_PX}px`;
  container.style.backgroundColor = "white";
  document.body.appendChild(container);

  const root = createRoot(container);
  
  return new Promise((resolve) => {
    root.render(
      React.createElement(
        "div", 
        { 
          className: "relative bg-white shrink-0 cv-template-container", 
          style: { width: A4_WIDTH_PX, minHeight: A4_HEIGHT_PX },
          ref: (el) => {
            if (el) {
              setTimeout(() => {
                // Apply DOM Pagination to prevent text cut-off
                const pageHeight = A4_HEIGHT_PX;
                const topMargin = 40;
                const bottomMargin = 40;

                const checkElements = el.querySelectorAll('h1, h2, h3, h4, h5, h6, p, li, hr, .resume-section');
                
                for (let i = 0; i < checkElements.length; i++) {
                  const checkEl = checkElements[i] as HTMLElement;
                  const rect = checkEl.getBoundingClientRect();
                  const containerRect = el.getBoundingClientRect();
                  
                  // No scaling in off-screen render, scale = 1
                  const top = rect.top - containerRect.top;
                  const bottom = top + checkEl.offsetHeight;
                  
                  const pageNum = Math.floor(top / pageHeight);
                  const pageBottomBoundary = (pageNum + 1) * pageHeight - bottomMargin;
                  
                  if (bottom > pageBottomBoundary && checkEl.offsetHeight < (pageHeight - topMargin - bottomMargin)) {
                    const nextPageTop = (pageNum + 1) * pageHeight + topMargin;
                    const shift = nextPageTop - top;
                    checkEl.style.marginTop = `${shift}px`;
                  }
                }
                
                // Fix html2canvas native bullet alignment bug by using pseudo-elements
                const bulletFixStyle = document.createElement('style');
                bulletFixStyle.innerHTML = `
                  .cv-template-container ul.list-disc {
                    list-style-type: none !important;
                  }
                  .cv-template-container ul.list-disc > li {
                    position: relative !important;
                  }
                  .cv-template-container ul.list-disc > li::before {
                    content: '\\2022' !important;
                    position: absolute !important;
                    left: -1.2em !important;
                    top: 0 !important;
                    color: inherit;
                  }
                `;
                el.appendChild(bulletFixStyle);

                resolve(container);
              }, 800); // 800ms buffer for external fonts/images 
            }
          }
        },
        React.createElement(TemplateComponent, { resume })
      )
    );
  });
}

export async function downloadResumeAsPDF(resume: Resume): Promise<void> {
  try {
    const container = await renderTemplateToDOM(resume);
    
    const canvas = await html2canvas(container, {
      scale: 3,
      useCORS: true,
      logging: false,
      windowWidth: A4_WIDTH_PX,
    });
    
    document.body.removeChild(container);

    const imgData = canvas.toDataURL("image/png"); 
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    // Calculate the height of the full canvas in PDF mm units
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    
    let heightLeft = pdfHeight;
    let position = 0;
    
    // The A4 page height in mm is 297
    const pageHeightMM = pdf.internal.pageSize.getHeight();
    
    // Add first page
    pdf.addImage(imgData, "PNG", 0, position, pdfWidth, pdfHeight);
    heightLeft -= pageHeightMM;
    
    // Add subsequent pages if content overflows
    // We add a tiny buffer (1mm) to prevent tiny rounding errors from creating an empty extra page
    while (heightLeft > 1) {
      position -= pageHeightMM; // Shift the image up by exactly one page height
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, pdfWidth, pdfHeight);
      heightLeft -= pageHeightMM;
    }
    
    pdf.save(`${resume.title || "CV"}.pdf`);
  } catch (error) {
    console.error("Failed to generate PDF:", error);
    alert("Gagal mengunduh PDF. Silakan coba lagi.");
  }
}

export async function downloadResumeAsPNG(resume: Resume): Promise<void> {
  try {
    const container = await renderTemplateToDOM(resume);
    const canvas = await html2canvas(container, {
      scale: 4, // scale 4 for ultra crisp Full HD +
      useCORS: true,
      logging: false,
    });
    
    document.body.removeChild(container);

    const imgData = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = imgData;
    a.download = `${resume.title || "CV"}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  } catch (error) {
    console.error("Failed to generate PNG:", error);
    alert("Gagal mengunduh PNG. Silakan coba lagi.");
  }
}

export async function downloadResumeAsWord(resume: Resume): Promise<void> {
  try {
    const children: any[] = [];

    // Header - Name (Bold, Large, Centered)
    children.push(
      new Paragraph({
        text: `${resume.basics.firstName} ${resume.basics.lastName}`.toUpperCase(),
        heading: HeadingLevel.TITLE,
        alignment: AlignmentType.CENTER,
        spacing: { after: 100 },
      })
    );

    // Headline
    if (resume.basics.headline) {
      children.push(
        new Paragraph({
          text: resume.basics.headline,
          alignment: AlignmentType.CENTER,
          spacing: { after: 200 },
        })
      );
    }

    // Horizontal line (using border)
    children.push(
      new Paragraph({
        border: {
          top: {
            color: "000000",
            space: 1,
            style: BorderStyle.SINGLE,
            size: 6,
          },
        },
        spacing: { after: 150 },
      })
    );

    // Contact Information
    const contactParts: string[] = [];
    if (resume.basics.email) contactParts.push(`Email: ${resume.basics.email}`);
    if (resume.basics.phone) contactParts.push(`Phone: ${resume.basics.phone}`);
    if (resume.basics.city) contactParts.push(`Location: ${resume.basics.city}`);
    
    if (contactParts.length > 0) {
      children.push(
        new Paragraph({
          text: contactParts.join(" | "),
          alignment: AlignmentType.CENTER,
          spacing: { after: 50 },
        })
      );
    }

    // Links
    if (resume.basics.website || resume.basics.linkedin) {
      const links: string[] = [];
      if (resume.basics.website) links.push(resume.basics.website);
      if (resume.basics.linkedin) links.push(resume.basics.linkedin);
      children.push(
        new Paragraph({
          text: links.join(" | "),
          alignment: AlignmentType.CENTER,
          spacing: { after: 300 },
        })
      );
    }

    // Summary
    if (resume.summary && resume.summary.trim()) {
      children.push(
        new Paragraph({
          text: "SUMMARY",
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 200, after: 150 },
        })
      );
      children.push(
        new Paragraph({
          text: resume.summary,
          spacing: { after: 300 },
        })
      );
    }

    // Professional Experience
    if (resume.experiences && resume.experiences.length > 0) {
      children.push(
        new Paragraph({
          text: "PROFESSIONAL EXPERIENCE",
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 200, after: 150 },
        })
      );

      resume.experiences.forEach((exp) => {
        // Job title and company
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `${exp.title} | ${exp.company}`,
                bold: true,
              }),
            ],
            spacing: { before: 150, after: 50 },
          })
        );

        // Date and location
        const dateStr = `${exp.startDate} - ${exp.isCurrent ? "Present" : exp.endDate || ""}`;
        const locStr = exp.city ? ` | ${exp.city}` : "";
        children.push(
          new Paragraph({
            text: dateStr + locStr,
            spacing: { after: 100 },
          })
        );

        // Bullets
        exp.bullets.forEach((bullet) => {
          if (bullet.trim()) {
            children.push(
              new Paragraph({
                text: bullet,
                bullet: {
                  level: 0,
                },
                spacing: { after: 80 },
              })
            );
          }
        });

        children.push(
          new Paragraph({
            text: "",
            spacing: { after: 150 },
          })
        );
      });
    }

    // Education
    if (resume.education && resume.education.length > 0) {
      children.push(
        new Paragraph({
          text: "EDUCATION",
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 200, after: 150 },
        })
      );

      resume.education.forEach((edu) => {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: edu.school,
                bold: true,
              }),
            ],
            spacing: { before: 100, after: 50 },
          })
        );

        if (edu.degree || edu.field) {
          children.push(
            new Paragraph({
              text: `${edu.degree || ""} ${edu.field || ""}`.trim(),
              spacing: { after: 50 },
            })
          );
        }

        if (edu.startDate || edu.endDate) {
          children.push(
            new Paragraph({
              text: `${edu.startDate || ""} - ${edu.endDate || ""}`.trim(),
              spacing: { after: 50 },
            })
          );
        }

        if (edu.description) {
          children.push(
            new Paragraph({
              text: edu.description,
              spacing: { after: 150 },
            })
          );
        }
      });
    }

    // Skills
    if (resume.skills && resume.skills.length > 0) {
      children.push(
        new Paragraph({
          text: "SKILLS",
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 200, after: 150 },
        })
      );
      children.push(
        new Paragraph({
          text: resume.skills.join(", "),
          spacing: { after: 300 },
        })
      );
    }

    // Custom Sections
    if (resume.customSections && resume.customSections.length > 0) {
      resume.customSections.forEach((section) => {
        children.push(
          new Paragraph({
            text: section.title.toUpperCase(),
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 200, after: 150 },
          })
        );

        section.items.forEach((item) => {
          children.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: item.label,
                  bold: true,
                }),
              ],
              spacing: { before: 100, after: 50 },
            })
          );

          if (item.description) {
            children.push(
              new Paragraph({
                text: item.description,
                spacing: { after: 150 },
              })
            );
          }
        });
      });
    }

    // Create document
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: children,
        },
      ],
    });

    // Generate and download
    const blob = await Packer.toBlob(doc);
    const filename = `${resume.title || "CV"}.docx`;
    saveAs(blob, filename);
  } catch (error) {
    console.error("Word export error:", error);
    throw new Error("Gagal export ke Word");
  }
}
