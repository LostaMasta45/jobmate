// Client-side CV Creative download utilities
import { CreativeCV } from "@/lib/schemas/cv-creative";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import React from "react";
import { createRoot } from "react-dom/client";

// Import templates
import { ModernGradient } from "@/components/cv-creative/templates/ModernGradient";
import { BoldMinimalist, PastelProfessional, DarkModePro } from "@/components/cv-creative/templates/AllTemplatesNew";
import { CV075Professional } from "@/components/cv-creative/templates/CV075Professional";
import { 
  MagazineLayout,
  ColorfulBlocks, 
  TimelineHero, 
  PortfolioGrid, 
  InfographicStyle, 
  SplitScreen, 
  GeometricModern, 
  WatercolorArtist 
} from "@/components/cv-creative/templates/RemainingTemplates";

const A4_WIDTH_PX = 794;
const A4_HEIGHT_PX = 1123;

function renderTemplateContent(cv: Partial<CreativeCV>) {
  const templateId = cv.templateId || "modern-gradient";
  
  switch (templateId) {
    case "modern-gradient": return React.createElement(ModernGradient, { cv });
    case "bold-minimalist": return React.createElement(BoldMinimalist, { cv });
    case "pastel-professional": return React.createElement(PastelProfessional, { cv });
    case "dark-mode-pro": return React.createElement(DarkModePro, { cv });
    case "magazine-layout": return React.createElement(MagazineLayout, { cv });
    case "colorful-blocks": return React.createElement(ColorfulBlocks, { cv });
    case "cv075-professional": return React.createElement(CV075Professional, { cv });
    case "timeline-hero": return React.createElement(TimelineHero, { cv });
    case "portfolio-grid": return React.createElement(PortfolioGrid, { cv });
    case "infographic-style": return React.createElement(InfographicStyle, { cv });
    case "split-screen": return React.createElement(SplitScreen, { cv });
    case "geometric-modern": return React.createElement(GeometricModern, { cv });
    case "watercolor-artist": return React.createElement(WatercolorArtist, { cv });
    default: return React.createElement(ModernGradient, { cv });
  }
}

async function renderTemplateToDOM(cv: Partial<CreativeCV>): Promise<HTMLDivElement> {
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

                // For Creative, we also want to catch general block elements
                const checkElements = el.querySelectorAll('h1, h2, h3, h4, h5, h6, p, li, hr, .cv-section, [data-section]');
                
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
        React.createElement("div", { className: "cv-creative-page" }, renderTemplateContent(cv))
      )
    );
  });
}

/**
 * Download Creative CV as PDF
 * Captures the rendered template as image and converts to PDF
 */
export async function downloadCreativeCVAsPDF(cv: Partial<CreativeCV>): Promise<void> {
  try {
    const container = await renderTemplateToDOM(cv);
    
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
    while (heightLeft > 1) {
      position -= pageHeightMM; // Shift the image up by exactly one page height
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, pdfWidth, pdfHeight);
      heightLeft -= pageHeightMM;
    }

    const firstName = cv.content?.basics?.firstName || "User";
    const lastName = cv.content?.basics?.lastName || "";
    const filename = `CV_Creative_${firstName}_${lastName}_${cv.templateId || "template"}.pdf`
      .replace(/\s+/g, "_");
    
    pdf.save(filename);
  } catch (error) {
    console.error("Failed to generate PDF:", error);
    alert("Gagal mengunduh PDF. Silakan coba lagi.");
  }
}

/**
 * Download Creative CV as PNG image
 */
export async function downloadCreativeCVAsPNG(cv: Partial<CreativeCV>): Promise<void> {
  try {
    const container = await renderTemplateToDOM(cv);
    const canvas = await html2canvas(container, {
      scale: 4, // scale 4 for ultra crisp Full HD +
      useCORS: true,
      logging: false,
      windowWidth: A4_WIDTH_PX,
    });
    
    document.body.removeChild(container);

    const imgData = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    
    const firstName = cv.content?.basics?.firstName || "User";
    const lastName = cv.content?.basics?.lastName || "";
    a.href = imgData;
    a.download = `CV_Creative_${firstName}_${lastName}.png`.replace(/\s+/g, "_");
    
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  } catch (error) {
    console.error("Failed to generate PNG:", error);
    alert("Gagal mengunduh PNG. Silakan coba lagi.");
  }
}
