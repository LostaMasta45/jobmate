import jsPDF from "jspdf";
import html2pdf from "html2pdf.js";

export function exportCoverLetterToPDF(htmlContent: string, filename: string) {
  try {
    // Detect if content is HTML (modern template) or plain text (ATS)
    const isHTML = htmlContent.trim().startsWith('<!DOCTYPE') || htmlContent.trim().startsWith('<html');
    
    if (isHTML) {
      // Use html2pdf for modern styled templates
      return exportHTMLToPDF(htmlContent, filename);
    }
    
    // Use jsPDF parser for plain text (ATS template)
    return exportPlainTextToPDF(htmlContent, filename);
  } catch (error) {
    console.error("Error exporting PDF:", error);
    throw error;
  }
}

function exportHTMLToPDF(htmlContent: string, filename: string) {
  const opt = {
    margin: [10, 15, 10, 15] as [number, number, number, number], // top, right, bottom, left in mm
    filename: filename,
    image: { type: 'jpeg' as const, quality: 0.98 },
    html2canvas: { 
      scale: 2,
      useCORS: true,
      letterRendering: true
    },
    jsPDF: { 
      unit: 'mm' as const, 
      format: 'a4' as const, 
      orientation: 'portrait' as const
    }
  };

  return html2pdf().set(opt).from(htmlContent).save();
}

function exportPlainTextToPDF(htmlContent: string, filename: string) {
  try {
    // Create PDF with proper A4 settings
    const pdf = new jsPDF({
      format: "a4",
      unit: "mm",
      compress: true,
    });

    // A4 size: 210 x 297 mm
    // Professional margins for Indonesia: 2.5cm (25mm) top/bottom, 2cm (20mm) left/right
    const pageWidth = 210;
    const pageHeight = 297;
    const marginLeft = 20;
    const marginRight = 20;
    const marginTop = 20;
    const marginBottom = 25;
    const contentWidth = pageWidth - marginLeft - marginRight; // 170mm

    let y = marginTop;
    const lineHeight = 4.5; // Tight spacing for 1 page
    const paragraphSpacing = 2.5; // Reduced spacing

    // Set default font
    pdf.setFont("times", "normal");
    pdf.setFontSize(11);

    // Helper function to add text with proper wrapping
    const addText = (text: string, options: { bold?: boolean; align?: "left" | "right" | "center" } = {}) => {
      const { bold = false, align = "left" } = options;
      
      pdf.setFont("times", bold ? "bold" : "normal");
      
      const lines = pdf.splitTextToSize(text, contentWidth);
      
      lines.forEach((line: string) => {
        if (y > pageHeight - marginBottom) {
          return; // Skip if exceeds page
        }
        
        let x = marginLeft;
        if (align === "right") {
          const textWidth = pdf.getTextWidth(line);
          x = pageWidth - marginRight - textWidth;
        } else if (align === "center") {
          const textWidth = pdf.getTextWidth(line);
          x = (pageWidth - textWidth) / 2;
        }
        
        pdf.text(line, x, y);
        y += lineHeight;
      });
    };

    // Parse HTML and extract text only
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = htmlContent;
    const textContent = tempDiv.textContent || tempDiv.innerText || "";
    
    // Split by double newlines to get sections
    const allLines = textContent
      .split('\n')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    // Process each line
    for (let i = 0; i < allLines.length; i++) {
      const line = allLines[i];
      
      if (!line || y > pageHeight - marginBottom - 10) continue;
      
      // Detect first line (city, date) - right aligned
      if (i === 0 && (line.includes(",") && line.includes("20"))) {
        addText(line, { align: "right" });
        y += paragraphSpacing * 2;
      }
      // Lampiran & Perihal
      else if (line.startsWith("Lampiran") || line.startsWith("Perihal")) {
        addText(line);
        if (line.startsWith("Perihal")) {
          y += paragraphSpacing * 1.5;
        }
      }
      // Kepada Yth section
      else if (line.includes("Kepada Yth") || 
               (i > 0 && allLines[i-1].includes("Kepada Yth"))) {
        addText(line);
        if (i < allLines.length - 1 && !allLines[i+1].includes("Kepada") && !allLines[i+1].startsWith("PT") && !allLines[i+1].startsWith("CV")) {
          y += paragraphSpacing * 1.5;
        }
      }
      // "Dengan hormat," - bold
      else if (line.includes("Dengan hormat")) {
        addText(line, { bold: true });
        y += paragraphSpacing;
      }
      // Data diri lines (Nama:, Tempat:, etc)
      else if (line.startsWith("Nama:") || line.startsWith("Tempat,") || 
               line.startsWith("Alamat:") || line.startsWith("Telepon:") || 
               line.startsWith("Email:") || line.startsWith("Pendidikan:") || 
               line.startsWith("Status:")) {
        addText(line);
        // Add spacing after Status (last data diri item)
        if (line.startsWith("Status:")) {
          y += paragraphSpacing;
        }
      }
      // "Hormat saya," - bold with signature space
      else if (line.includes("Hormat saya")) {
        y += paragraphSpacing * 2;
        addText(line, { bold: true });
        y += lineHeight * 3; // Space for signature
      }
      // Last line (name) - bold
      else if (i === allLines.length - 1) {
        addText(line, { bold: true });
      }
      // Regular paragraphs
      else {
        addText(line);
        y += paragraphSpacing;
      }
    }

    // Save PDF
    pdf.save(filename);
    
    return { success: true };
  } catch (error) {
    console.error("Error exporting PDF:", error);
    return { error: "Failed to export PDF" };
  }
}

// Simple version using text only (fallback)
export function exportCoverLetterToPDFSimple(data: any, filename: string) {
  try {
    const pdf = new jsPDF({
      format: "a4",
      unit: "mm",
    });

    // Set font
    pdf.setFont("times", "normal");
    pdf.setFontSize(12);

    let y = 20;
    const margin = 20;
    const pageWidth = pdf.internal.pageSize.getWidth();
    const lineHeight = 7;

    // Helper to add text with word wrap
    const addText = (text: string, isBold = false) => {
      if (isBold) {
        pdf.setFont("times", "bold");
      } else {
        pdf.setFont("times", "normal");
      }
      
      const lines = pdf.splitTextToSize(text, pageWidth - 2 * margin);
      lines.forEach((line: string) => {
        if (y > 280) {
          pdf.addPage();
          y = 20;
        }
        pdf.text(line, margin, y);
        y += lineHeight;
      });
    };

    // Generate content
    const city = data.address ? data.address.split(",")[0] : "Jakarta";
    const today = new Date().toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    // Header (right-aligned)
    pdf.text(`${city}, ${today}`, pageWidth - margin, y, { align: "right" });
    y += lineHeight * 2;

    // Lampiran & Perihal
    addText(`Lampiran     : 1 (satu) berkas`);
    addText(`Perihal      : Lamaran Pekerjaan sebagai ${data.position}`);
    y += lineHeight;

    // Kepada Yth
    addText(`Kepada Yth.`);
    addText(`${data.hrdName || "HRD Manager"} ${data.companyName}`);
    if (data.companyAddress) {
      addText(data.companyAddress);
    }
    y += lineHeight;

    addText("Dengan hormat,", true);
    y += lineHeight * 0.5;

    // Opening
    addText(
      `Saya yang bertanda tangan di bawah ini bermaksud mengajukan lamaran pekerjaan untuk posisi ${data.position} di ${data.companyName}.`
    );
    y += lineHeight * 0.5;

    // Personal Data
    addText("Adapun data diri saya sebagai berikut:");
    y += lineHeight * 0.5;
    
    addText(`Nama                    : ${data.fullName}`);
    addText(`Tempat, Tanggal Lahir   : ${data.birthPlace}, ${data.birthDate}`);
    addText(`Alamat                  : ${data.address}`);
    addText(`No. Telepon             : ${data.phone}`);
    addText(`Email                   : ${data.email}`);
    y += lineHeight * 0.5;

    // Closing
    addText(
      "Demikian surat lamaran ini saya buat dengan sebenar-benarnya. Besar harapan saya untuk dapat diberikan kesempatan interview. Atas perhatian dan kesempatan yang diberikan, saya ucapkan terima kasih."
    );
    y += lineHeight * 2;

    addText("Hormat saya,", true);
    y += lineHeight * 3;
    addText(data.fullName, true);

    // Download
    pdf.save(filename);

    return { success: true };
  } catch (error) {
    console.error("Error exporting PDF:", error);
    return { error: "Failed to export PDF" };
  }
}
