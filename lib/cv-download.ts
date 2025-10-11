// Client-side CV download utilities

import { Resume } from "@/lib/schemas/cv-ats";
import jsPDF from "jspdf";
import { Document, Paragraph, TextRun, HeadingLevel, AlignmentType, BorderStyle, ShadingType } from "docx";
import { saveAs } from "file-saver";
import { Packer } from "docx";

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
export function downloadResumeAsPDF(resume: Resume): void {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const maxWidth = pageWidth - 2 * margin;
  let yPos = margin;

  // Helper to add text with word wrap
  const addText = (
    text: string,
    fontSize: number,
    isBold: boolean = false,
    indent: number = 0
  ) => {
    doc.setFontSize(fontSize);
    doc.setFont("helvetica", isBold ? "bold" : "normal");
    
    const lines = doc.splitTextToSize(text, maxWidth - indent);
    
    // Check if need new page
    if (yPos + lines.length * (fontSize / 2) > pageHeight - margin) {
      doc.addPage();
      yPos = margin;
    }
    
    lines.forEach((line: string) => {
      doc.text(line, margin + indent, yPos);
      yPos += fontSize / 2;
    });
  };

  const addSpace = (space: number = 5) => {
    yPos += space;
  };

  const addLine = () => {
    doc.setLineWidth(0.5);
    doc.line(margin, yPos, pageWidth - margin, yPos);
    yPos += 3;
  };

  // Header - Name (ATS-Friendly: Large, Bold, Top)
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text(
    `${resume.basics.firstName} ${resume.basics.lastName}`.toUpperCase(),
    margin,
    yPos
  );
  yPos += 7;

  // Headline (ATS-Friendly: Clear, Professional)
  if (resume.basics.headline) {
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(resume.basics.headline, margin, yPos);
    yPos += 6;
  }

  // Extra space before line
  addSpace(3);

  // Separator line
  doc.setLineWidth(0.3);
  doc.line(margin, yPos, pageWidth - margin, yPos);
  yPos += 5; // More space after line

  // Contact Information (ATS-Friendly: Simple, Clear)
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  
  // Contact line 1
  const contacts: string[] = [];
  if (resume.basics.email) contacts.push(`Email: ${resume.basics.email}`);
  if (resume.basics.phone) contacts.push(`Phone: ${resume.basics.phone}`);
  if (resume.basics.city) contacts.push(`Location: ${resume.basics.city}`);
  
  if (contacts.length > 0) {
    doc.text(contacts.join(" | "), margin, yPos);
    yPos += 4;
  }

  // Contact line 2 (Links)
  if (resume.basics.website || resume.basics.linkedin) {
    const links: string[] = [];
    if (resume.basics.website) links.push(resume.basics.website);
    if (resume.basics.linkedin) links.push(resume.basics.linkedin);
    doc.text(links.join(" | "), margin, yPos);
    yPos += 4;
  }

  // More space after contact section
  addSpace(8);

  // Summary
  if (resume.summary && resume.summary.trim()) {
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("SUMMARY", margin, yPos);
    yPos += 6;

    addText(resume.summary, 10, false);
    addSpace(8);
  }

  // Professional Experience
  if (resume.experiences && resume.experiences.length > 0) {
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("PROFESSIONAL EXPERIENCE", margin, yPos);
    yPos += 6;

    resume.experiences.forEach((exp, idx) => {
      // Check if need new page for experience header
      if (yPos > pageHeight - 40) {
        doc.addPage();
        yPos = margin;
      }

      // Job title and company
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.text(`${exp.title} | ${exp.company}`, margin, yPos);
      yPos += 5;

      // Date and location
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      const dateStr = `${exp.startDate} - ${exp.isCurrent ? "Present" : exp.endDate || ""}`;
      const locStr = exp.city ? ` | ${exp.city}` : "";
      doc.text(dateStr + locStr, margin, yPos);
      yPos += 5;

      // Bullets
      exp.bullets.forEach((bullet) => {
        if (bullet.trim()) {
          // Check page break
          if (yPos > pageHeight - 20) {
            doc.addPage();
            yPos = margin;
          }

          doc.setFontSize(10);
          doc.setFont("helvetica", "normal");
          
          // Add bullet point
          doc.text("•", margin, yPos);
          
          // Word wrap bullet text
          const bulletLines = doc.splitTextToSize(bullet, maxWidth - 5);
          bulletLines.forEach((line: string, lineIdx: number) => {
            doc.text(line, margin + 5, yPos);
            if (lineIdx < bulletLines.length - 1) {
              yPos += 4;
            }
          });
          yPos += 5;
        }
      });

      addSpace(5);
    });

    addSpace(3);
  }

  // Education
  if (resume.education && resume.education.length > 0) {
    // Check if need new page
    if (yPos > pageHeight - 40) {
      doc.addPage();
      yPos = margin;
    }

    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("EDUCATION", margin, yPos);
    yPos += 6;

    resume.education.forEach((edu) => {
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.text(edu.school, margin, yPos);
      yPos += 5;

      if (edu.degree || edu.field) {
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        const degreeText = `${edu.degree || ""} ${edu.field || ""}`.trim();
        doc.text(degreeText, margin, yPos);
        yPos += 5;
      }

      if (edu.startDate || edu.endDate) {
        doc.setFontSize(9);
        const dateText = `${edu.startDate || ""} - ${edu.endDate || ""}`.trim();
        doc.text(dateText, margin, yPos);
        yPos += 5;
      }

      if (edu.description) {
        doc.setFontSize(9);
        const descLines = doc.splitTextToSize(edu.description, maxWidth);
        descLines.forEach((line: string) => {
          doc.text(line, margin, yPos);
          yPos += 4;
        });
      }

      addSpace(5);
    });

    addSpace(3);
  }

  // Skills
  if (resume.skills && resume.skills.length > 0) {
    if (yPos > pageHeight - 30) {
      doc.addPage();
      yPos = margin;
    }

    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("SKILLS", margin, yPos);
    yPos += 6;

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    const skillsText = resume.skills.join(", ");
    const skillLines = doc.splitTextToSize(skillsText, maxWidth);
    skillLines.forEach((line: string) => {
      doc.text(line, margin, yPos);
      yPos += 5;
    });

    addSpace(3);
  }

  // Custom Sections
  if (resume.customSections && resume.customSections.length > 0) {
    resume.customSections.forEach((section) => {
      if (yPos > pageHeight - 40) {
        doc.addPage();
        yPos = margin;
      }

      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text(section.title.toUpperCase(), margin, yPos);
      yPos += 6;

      section.items.forEach((item) => {
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.text(item.label, margin, yPos);
        yPos += 5;

        if (item.description) {
          doc.setFontSize(9);
          doc.setFont("helvetica", "normal");
          const descLines = doc.splitTextToSize(item.description, maxWidth);
          descLines.forEach((line: string) => {
            doc.text(line, margin, yPos);
            yPos += 4;
          });
        }

        addSpace(3);
      });

      addSpace(3);
    });
  }

  // Save PDF
  const filename = `${resume.title || "CV"}.pdf`;
  doc.save(filename);
}

// Download resume as Word document (.docx)
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
