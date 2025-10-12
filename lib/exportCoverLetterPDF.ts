import jsPDF from "jspdf";

export function exportCoverLetterToPDF(htmlContent: string, filename: string) {
  try {
    // Create new PDF document - A4 size
    const pdf = new jsPDF({
      format: "a4",
      unit: "mm",
    });

    // Create a temporary container for HTML content
    const container = document.createElement("div");
    container.innerHTML = htmlContent;
    container.style.width = "210mm"; // A4 width
    container.style.padding = "20mm";
    container.style.fontFamily = "'Times New Roman', serif";
    container.style.fontSize = "12pt";
    container.style.lineHeight = "1.6";
    container.style.color = "#000";
    container.style.backgroundColor = "#fff";
    document.body.appendChild(container);

    // Use html method to render HTML to PDF
    pdf.html(container, {
      callback: (doc) => {
        // Remove temporary container
        document.body.removeChild(container);
        
        // Download PDF
        doc.save(filename);
      },
      x: 20,
      y: 20,
      width: 170, // A4 width minus margins (210 - 40)
      windowWidth: 800,
      html2canvas: {
        scale: 0.25,
      },
    });

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
