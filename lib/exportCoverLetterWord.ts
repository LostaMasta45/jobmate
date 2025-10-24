// Export Cover Letter to Word (.docx)
// Proper A4 formatting dengan margins yang rapi

import { Document, Packer, Paragraph, TextRun, AlignmentType, convertInchesToTwip } from "docx";
import { saveAs } from "file-saver";

export async function exportCoverLetterToWord(htmlContent: string, filename: string) {
  try {
    // Detect if content is HTML or plain text
    const isHTML = htmlContent.trim().startsWith('<!DOCTYPE') || htmlContent.trim().startsWith('<html');
    
    let textContent: string;
    if (isHTML) {
      // Parse HTML content to extract text - ROBUST METHOD
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = htmlContent;
      
      // Remove script and style tags
      const scripts = tempDiv.getElementsByTagName('script');
      const styles = tempDiv.getElementsByTagName('style');
      for (let i = scripts.length - 1; i >= 0; i--) {
        scripts[i].parentNode?.removeChild(scripts[i]);
      }
      for (let i = styles.length - 1; i >= 0; i--) {
        styles[i].parentNode?.removeChild(styles[i]);
      }
      
      // Get text content
      textContent = tempDiv.textContent || tempDiv.innerText || "";
      
      // Clean up extra whitespace
      textContent = textContent
        .replace(/\s+/g, ' ')  // Replace multiple spaces with single space
        .replace(/\n\s*\n/g, '\n')  // Remove empty lines
        .trim();
    } else {
      // Already plain text
      textContent = htmlContent;
    }
    
    // Split into lines
    const lines = textContent
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);

    // Create paragraphs
    const paragraphs: Paragraph[] = [];
    
    lines.forEach((line, index) => {
      // Detect line type and format accordingly
      let alignment: typeof AlignmentType.LEFT | typeof AlignmentType.RIGHT | typeof AlignmentType.CENTER | typeof AlignmentType.JUSTIFIED = AlignmentType.LEFT;
      let bold = false;
      let spacing: { before?: number; after?: number } = { after: 200 }; // Default spacing
      
      // Header (first line - city, date)
      if (index === 0) {
        alignment = AlignmentType.RIGHT;
        spacing = { after: 400 };
      }
      // Lampiran, Perihal
      else if (line.startsWith("Lampiran") || line.startsWith("Perihal")) {
        spacing = { after: 100 };
      }
      // Kepada Yth
      else if (line.includes("Kepada Yth") || line.includes("PT") || line.includes("CV") || line.includes("Yayasan")) {
        spacing = { after: 100 };
      }
      // "Dengan hormat,"
      else if (line.includes("Dengan hormat")) {
        bold = true;
        spacing = { after: 200 };
      }
      // "Hormat saya,"
      else if (line.includes("Hormat saya")) {
        bold = true;
        spacing = { before: 400, after: 800 }; // Space for signature
      }
      // Name (last line)
      else if (index === lines.length - 1) {
        bold = true;
        spacing = { before: 0 };
      }
      // Data diri section
      else if (line.startsWith("Nama:") || line.startsWith("Tempat") || 
               line.startsWith("Alamat:") || line.startsWith("Telepon:") || 
               line.startsWith("Email:") || line.startsWith("Pendidikan:") || 
               line.startsWith("Status:")) {
        spacing = { after: 100 };
      }
      // Regular paragraphs
      else {
        alignment = AlignmentType.JUSTIFIED;
        spacing = { after: 200 };
      }

      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: line,
              font: "Times New Roman",
              size: 24, // 12pt (size in half-points) - Match sederhana
              bold: bold,
            }),
          ],
          alignment: alignment,
          spacing: spacing,
        })
      );
    });

    // Create document with proper A4 settings
    const doc = new Document({
      sections: [
        {
          properties: {
            page: {
              // A4 size: 210mm x 297mm = 8.27" x 11.69"
              size: {
                width: convertInchesToTwip(8.27),
                height: convertInchesToTwip(11.69),
              },
              margin: {
                top: convertInchesToTwip(0.98), // 25mm - Match sederhana
                right: convertInchesToTwip(0.98), // 25mm
                bottom: convertInchesToTwip(0.98), // 25mm
                left: convertInchesToTwip(0.98), // 25mm
              },
            },
          },
          children: paragraphs,
        },
      ],
    });

    // Generate and save
    const blob = await Packer.toBlob(doc);
    saveAs(blob, filename);

    return { success: true };
  } catch (error) {
    console.error("Error exporting Word:", error);
    return { error: "Failed to export Word document" };
  }
}

// Simple version (fallback)
export async function exportCoverLetterToWordSimple(data: any, filename: string) {
  try {
    const city = data.address ? data.address.split(",")[0] : "Jakarta";
    const today = new Date().toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    const paragraphs: Paragraph[] = [
      // Header - right aligned
      new Paragraph({
        children: [
          new TextRun({
            text: `${city}, ${today}`,
            font: "Times New Roman",
            size: 24, // 12pt
          }),
        ],
        alignment: AlignmentType.RIGHT,
        spacing: { after: 400 },
      }),

      // Lampiran
      new Paragraph({
        children: [
          new TextRun({
            text: "Lampiran : 1 (satu) berkas",
            font: "Times New Roman",
            size: 24, // 12pt
          }),
        ],
        spacing: { after: 100 },
      }),

      // Perihal
      new Paragraph({
        children: [
          new TextRun({
            text: `Perihal  : Lamaran Pekerjaan sebagai ${data.position}`,
            font: "Times New Roman",
            size: 24, // 12pt
          }),
        ],
        spacing: { after: 200 },
      }),

      // Kepada Yth
      new Paragraph({
        children: [
          new TextRun({
            text: "Kepada Yth.",
            font: "Times New Roman",
            size: 24, // 12pt
          }),
        ],
        spacing: { after: 100 },
      }),

      new Paragraph({
        children: [
          new TextRun({
            text: `${data.hrdName || "HRD Manager"}`,
            font: "Times New Roman",
            size: 24, // 12pt
          }),
        ],
        spacing: { after: 100 },
      }),

      new Paragraph({
        children: [
          new TextRun({
            text: data.companyName,
            font: "Times New Roman",
            size: 24, // 12pt
          }),
        ],
        spacing: { after: 200 },
      }),

      // Dengan hormat
      new Paragraph({
        children: [
          new TextRun({
            text: "Dengan hormat,",
            font: "Times New Roman",
            size: 24, // 12pt
            bold: true,
          }),
        ],
        spacing: { after: 200 },
      }),

      // Opening paragraph
      new Paragraph({
        children: [
          new TextRun({
            text: `Saya bermaksud melamar posisi ${data.position} di ${data.companyName}. Saya yakin dapat memberikan kontribusi positif bagi perusahaan.`,
            font: "Times New Roman",
            size: 24, // 12pt
          }),
        ],
        alignment: AlignmentType.JUSTIFIED,
        spacing: { after: 200 },
      }),

      // Data diri
      new Paragraph({
        children: [
          new TextRun({
            text: `Nama: ${data.fullName}`,
            font: "Times New Roman",
            size: 24, // 12pt
          }),
        ],
        spacing: { after: 100 },
      }),

      new Paragraph({
        children: [
          new TextRun({
            text: `Telepon: ${data.phone}`,
            font: "Times New Roman",
            size: 24, // 12pt
          }),
        ],
        spacing: { after: 100 },
      }),

      new Paragraph({
        children: [
          new TextRun({
            text: `Email: ${data.email}`,
            font: "Times New Roman",
            size: 24, // 12pt
          }),
        ],
        spacing: { after: 200 },
      }),

      // Closing
      new Paragraph({
        children: [
          new TextRun({
            text: "Demikian surat lamaran ini saya buat. Besar harapan saya untuk diberikan kesempatan wawancara. Atas perhatian Bapak/Ibu, saya ucapkan terima kasih.",
            font: "Times New Roman",
            size: 24, // 12pt
          }),
        ],
        alignment: AlignmentType.JUSTIFIED,
        spacing: { after: 400 },
      }),

      // Hormat saya
      new Paragraph({
        children: [
          new TextRun({
            text: "Hormat saya,",
            font: "Times New Roman",
            size: 24, // 12pt
            bold: true,
          }),
        ],
        spacing: { after: 800 },
      }),

      // Name
      new Paragraph({
        children: [
          new TextRun({
            text: data.fullName,
            font: "Times New Roman",
            size: 24, // 12pt
            bold: true,
          }),
        ],
      }),
    ];

    // Create document
    const doc = new Document({
      sections: [
        {
          properties: {
            page: {
              size: {
                width: convertInchesToTwip(8.27),
                height: convertInchesToTwip(11.69),
              },
              margin: {
                top: convertInchesToTwip(0.79),
                right: convertInchesToTwip(0.79),
                bottom: convertInchesToTwip(0.79),
                left: convertInchesToTwip(0.79),
              },
            },
          },
          children: paragraphs,
        },
      ],
    });

    // Generate and save
    const blob = await Packer.toBlob(doc);
    saveAs(blob, filename);

    return { success: true };
  } catch (error) {
    console.error("Error exporting Word:", error);
    return { error: "Failed to export Word document" };
  }
}
