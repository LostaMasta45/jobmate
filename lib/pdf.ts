import jsPDF from "jspdf";

export function generateCoverLetterPDF(content: string, filename: string) {
  try {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    // Set font
    doc.setFont("helvetica");
    doc.setFontSize(11);

    // Page dimensions
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    const maxWidth = pageWidth - (margin * 2);
    const lineHeight = 7;

    // Split content into lines
    const lines = content.split("\n");
    let yPosition = margin;

    lines.forEach((line) => {
      // Check if we need a new page
      if (yPosition + lineHeight > pageHeight - margin) {
        doc.addPage();
        yPosition = margin;
      }

      // Handle empty lines
      if (line.trim() === "") {
        yPosition += lineHeight / 2;
        return;
      }

      // Split long lines
      const splitLines = doc.splitTextToSize(line, maxWidth);
      
      splitLines.forEach((splitLine: string) => {
        if (yPosition + lineHeight > pageHeight - margin) {
          doc.addPage();
          yPosition = margin;
        }
        
        doc.text(splitLine, margin, yPosition);
        yPosition += lineHeight;
      });
    });

    // Save the PDF
    doc.save(filename);
    
    return { success: true };
  } catch (error) {
    console.error("PDF generation error:", error);
    throw new Error("Gagal membuat PDF");
  }
}

export function generateCoverLetterPDFBlob(content: string): Blob {
  try {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    doc.setFont("helvetica");
    doc.setFontSize(11);

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    const maxWidth = pageWidth - (margin * 2);
    const lineHeight = 7;

    const lines = content.split("\n");
    let yPosition = margin;

    lines.forEach((line) => {
      if (yPosition + lineHeight > pageHeight - margin) {
        doc.addPage();
        yPosition = margin;
      }

      if (line.trim() === "") {
        yPosition += lineHeight / 2;
        return;
      }

      const splitLines = doc.splitTextToSize(line, maxWidth);
      
      splitLines.forEach((splitLine: string) => {
        if (yPosition + lineHeight > pageHeight - margin) {
          doc.addPage();
          yPosition = margin;
        }
        
        doc.text(splitLine, margin, yPosition);
        yPosition += lineHeight;
      });
    });

    // Return blob instead of saving
    return doc.output("blob");
  } catch (error) {
    console.error("PDF generation error:", error);
    throw new Error("Gagal membuat PDF");
  }
}
