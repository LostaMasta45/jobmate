import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { CreativeCV } from "./schemas/cv-creative";

export async function exportToPDF(element: HTMLElement, filename: string) {
  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    logging: false,
    backgroundColor: "#ffffff",
  } as any);

  const imgData = canvas.toDataURL("image/png");
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const imgWidth = 210; // A4 width in mm
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
  pdf.save(filename);
}

export async function exportToPNG(element: HTMLElement, filename: string) {
  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    logging: false,
    backgroundColor: "#ffffff",
  } as any);

  canvas.toBlob((blob) => {
    if (blob) {
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
    }
  }, "image/png");
}

export async function exportToJPG(element: HTMLElement, filename: string) {
  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    logging: false,
    backgroundColor: "#ffffff",
  } as any);

  canvas.toBlob((blob) => {
    if (blob) {
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
    }
  }, "image/jpeg", 0.95);
}

export async function exportToWord(cv: Partial<CreativeCV>, filename: string) {
  // This is a simplified version - for production, use docx library
  // For now, we'll create a simple HTML document that Word can open
  const content = cv.content;
  if (!content) return;

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>${cv.title}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20mm; }
          h1 { color: ${cv.colorScheme?.primary}; }
          h2 { color: ${cv.colorScheme?.primary}; border-bottom: 2px solid ${cv.colorScheme?.secondary}; padding-bottom: 5px; }
          .section { margin-bottom: 20px; }
          ul { list-style-type: disc; margin-left: 20px; }
        </style>
      </head>
      <body>
        <h1>${content.basics.firstName} ${content.basics.lastName}</h1>
        <p><strong>${content.basics.headline}</strong></p>
        <p>${content.basics.email} | ${content.basics.phone || ""} | ${content.basics.city || ""}</p>
        
        ${content.summary ? `
          <div class="section">
            <h2>SUMMARY</h2>
            <p>${content.summary}</p>
          </div>
        ` : ""}
        
        ${content.experiences.length > 0 ? `
          <div class="section">
            <h2>EXPERIENCE</h2>
            ${content.experiences.map(exp => `
              <div style="margin-bottom: 15px;">
                <p><strong>${exp.title}</strong> at ${exp.company}</p>
                <p><em>${exp.startDate} - ${exp.isCurrent ? "Present" : exp.endDate}</em></p>
                <ul>
                  ${exp.bullets.map(b => b.trim() ? `<li>${b}</li>` : "").join("")}
                </ul>
              </div>
            `).join("")}
          </div>
        ` : ""}
        
        ${content.education.length > 0 ? `
          <div class="section">
            <h2>EDUCATION</h2>
            ${content.education.map(edu => `
              <div style="margin-bottom: 10px;">
                <p><strong>${edu.school}</strong></p>
                ${edu.degree ? `<p>${edu.degree} ${edu.field || ""}</p>` : ""}
                ${edu.startDate ? `<p><em>${edu.startDate} - ${edu.endDate}</em></p>` : ""}
              </div>
            `).join("")}
          </div>
        ` : ""}
        
        ${content.skills.length > 0 ? `
          <div class="section">
            <h2>SKILLS</h2>
            <p>${content.skills.join(", ")}</p>
          </div>
        ` : ""}
      </body>
    </html>
  `;

  const blob = new Blob([html], { type: "application/msword" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
