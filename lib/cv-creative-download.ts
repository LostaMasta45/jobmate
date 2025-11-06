// Client-side CV Creative download utilities

import { CreativeCV } from "@/lib/schemas/cv-creative";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

/**
 * Download Creative CV as PDF
 * Captures the rendered template as image and converts to PDF
 */
export async function downloadCreativeCVAsPDF(cv: Partial<CreativeCV>): Promise<void> {
  try {
    // Get the preview element
    const element = document.getElementById("cv-preview-content");
    if (!element) {
      throw new Error("Preview element not found");
    }

    // Show loading state
    const originalContent = element.innerHTML;
    
    // Capture as canvas with high quality
    const canvas = await html2canvas(element, {
      scale: 2, // Higher resolution
      useCORS: true,
      logging: false,
      backgroundColor: "#ffffff",
    } as any);

    // Create PDF (A4 size)
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    // Calculate dimensions to fit A4
    const imgData = canvas.toDataURL("image/png");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    
    // Add image to PDF (fit to page)
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);

    // Generate filename
    const firstName = cv.content?.basics?.firstName || "User";
    const lastName = cv.content?.basics?.lastName || "";
    const filename = `CV_Creative_${firstName}_${lastName}_${cv.templateId || "template"}.pdf`
      .replace(/\s+/g, "_");

    // Download
    pdf.save(filename);
  } catch (error) {
    console.error("PDF download error:", error);
    throw new Error("Gagal download PDF. Silakan coba lagi.");
  }
}

/**
 * Download Creative CV as PNG image
 */
export async function downloadCreativeCVAsPNG(cv: Partial<CreativeCV>): Promise<void> {
  try {
    const element = document.getElementById("cv-preview-content");
    if (!element) {
      throw new Error("Preview element not found");
    }

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: "#ffffff",
    } as any);

    // Convert to blob and download
    canvas.toBlob((blob) => {
      if (!blob) {
        throw new Error("Failed to create image");
      }

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      
      const firstName = cv.content?.basics?.firstName || "User";
      const lastName = cv.content?.basics?.lastName || "";
      a.href = url;
      a.download = `CV_Creative_${firstName}_${lastName}.png`.replace(/\s+/g, "_");
      
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
  } catch (error) {
    console.error("PNG download error:", error);
    throw new Error("Gagal download PNG. Silakan coba lagi.");
  }
}
