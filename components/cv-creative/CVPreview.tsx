"use client";

import * as React from "react";
import { useState, useEffect, useRef } from "react";
import { ZoomIn, ZoomOut, Maximize } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CreativeCV } from "@/lib/schemas/cv-creative";
import { ModernGradient } from "./templates/ModernGradient";
import { BoldMinimalist, PastelProfessional, DarkModePro } from "./templates/AllTemplatesNew";
import { CV075Professional } from "./templates/CV075Professional";
import { 
  MagazineLayout,
  ColorfulBlocks, 
  TimelineHero, 
  PortfolioGrid, 
  InfographicStyle, 
  SplitScreen, 
  GeometricModern, 
  WatercolorArtist 
} from "./templates/RemainingTemplates";

interface CVPreviewProps {
  cv: Partial<CreativeCV>;
  showControls?: boolean;
  simple?: boolean; // If true, renders just the template without auto-scaling container
}

// A4 dimensions in mm: 210mm x 297mm
// At 96 DPI: 1mm = 3.7795px
// So A4 in pixels: 794px x 1123px
const A4_WIDTH_PX = 794;
const A4_HEIGHT_PX = 1123;

// Helper function to render template content
function renderTemplateContent(cv: Partial<CreativeCV>) {
  const templateId = cv.templateId || "modern-gradient";
  
  switch (templateId) {
    case "modern-gradient":
      return <ModernGradient cv={cv} />;
    case "bold-minimalist":
      return <BoldMinimalist cv={cv} />;
    case "pastel-professional":
      return <PastelProfessional cv={cv} />;
    case "dark-mode-pro":
      return <DarkModePro cv={cv} />;
    case "magazine-layout":
      return <MagazineLayout cv={cv} />;
    case "colorful-blocks":
      return <ColorfulBlocks cv={cv} />;
    case "cv075-professional":
      return <CV075Professional cv={cv} />;
    case "timeline-hero":
      return <TimelineHero cv={cv} />;
    case "portfolio-grid":
      return <PortfolioGrid cv={cv} />;
    case "infographic-style":
      return <InfographicStyle cv={cv} />;
    case "split-screen":
      return <SplitScreen cv={cv} />;
    case "geometric-modern":
      return <GeometricModern cv={cv} />;
    case "watercolor-artist":
      return <WatercolorArtist cv={cv} />;
    default:
      return <ModernGradient cv={cv} />;
  }
}

export function CVPreview({ cv, showControls = false, simple = false }: CVPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  
  const [scale, setScale] = useState(1);
  const [isAutoFit, setIsAutoFit] = useState(true);
  const [contentHeight, setContentHeight] = useState(A4_HEIGHT_PX);

  // Simple mode - just render the template without container
  if (simple) {
    return (
      <div id="cv-preview-content" className="cv-creative-page">
        {renderTemplateContent(cv)}
      </div>
    );
  }

  // Measure content height (Wait for images/fonts if possible)
  useEffect(() => {
    if (contentRef.current) {
      const observer = new ResizeObserver((entries) => {
        for (const entry of entries) {
          setContentHeight(Math.max(entry.contentRect.height, A4_HEIGHT_PX));
        }
      });
      observer.observe(contentRef.current);
      return () => observer.disconnect();
    }
  }, [cv.templateId, scale]); // Recalculate if scale changes

  // Auto-scale logic with ResizeObserver
  useEffect(() => {
    if (!containerRef.current || !isAutoFit) return;

    const calculateScale = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.clientWidth;
        const isMobile = window.innerWidth < 640;
        const marginX = isMobile ? 24 : 64;

        if (containerWidth > 0) {
          const availableWidth = containerWidth - marginX;
          const widthScale = availableWidth / A4_WIDTH_PX;
          const newScale = Math.min(widthScale, 1.2);
          setScale(newScale);
        }
      }
    };

    const observer = new ResizeObserver(calculateScale);
    observer.observe(containerRef.current);
    window.addEventListener('resize', calculateScale);
    calculateScale();

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', calculateScale);
    };
  }, [isAutoFit]);

  // DOM Pagination to prevent text cut-off and add margins
  useEffect(() => {
    const paginate = () => {
      const pageHeight = A4_HEIGHT_PX;
      const topMargin = 40;
      const bottomMargin = 40;

      const containers = document.querySelectorAll('.cv-template-container');
      
      containers.forEach(container => {
        // Reset previous margins
        const elements = container.querySelectorAll('.paginated-margin');
        elements.forEach(el => {
          (el as HTMLElement).style.marginTop = '';
          el.classList.remove('paginated-margin');
        });

        // Elements to check for page break
        const checkElements = container.querySelectorAll('h1, h2, h3, h4, h5, h6, p, li, hr, .resume-section, .cv-section, [data-section]');
        
        for (let i = 0; i < checkElements.length; i++) {
          const el = checkElements[i] as HTMLElement;
          const rect = el.getBoundingClientRect();
          const containerRect = container.getBoundingClientRect();
          
          // Unscale the coordinates
          const top = (rect.top - containerRect.top) / scale;
          const bottom = top + el.offsetHeight;
          
          const pageNum = Math.floor(top / pageHeight);
          const pageBottomBoundary = (pageNum + 1) * pageHeight - bottomMargin;
          
          if (bottom > pageBottomBoundary && el.offsetHeight < (pageHeight - topMargin - bottomMargin)) {
            const nextPageTop = (pageNum + 1) * pageHeight + topMargin;
            const shift = nextPageTop - top;
            el.style.marginTop = `${shift}px`;
            el.classList.add('paginated-margin');
          }
        }
      });
    };

    const timeout = setTimeout(paginate, 150);
    return () => clearTimeout(timeout);
  }, [cv, scale]);

  const handleZoomIn = () => {
    setIsAutoFit(false);
    setScale(prev => Math.min(prev + 0.1, 2.0));
  };

  const handleZoomOut = () => {
    setIsAutoFit(false);
    setScale(prev => Math.max(prev - 0.1, 0.3));
  };

  const handleFitWidth = () => {
    setIsAutoFit(true);
  };

  // Calculate number of pages based on actual measured content height
  const numPages = Math.max(1, Math.ceil(contentHeight / A4_HEIGHT_PX));

  return (
    <div className="flex flex-col h-full w-full relative group bg-slate-100/50 dark:bg-slate-900/50">
      {/* Zoom Controls */}
      {showControls && (
        <div className="absolute top-4 right-4 z-10 flex items-center gap-1.5 bg-white dark:bg-slate-800 shadow-md border border-slate-200 dark:border-slate-700 rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300"
            onClick={handleZoomOut}
            title="Zoom Out"
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <span className="text-xs font-medium w-12 text-center text-slate-600 dark:text-slate-300 tabular-nums">
            {Math.round(scale * 100)}%
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300"
            onClick={handleZoomIn}
            title="Zoom In"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          <div className="w-px h-4 bg-slate-200 dark:bg-slate-600 mx-1" />
          <Button
            variant={isAutoFit ? "secondary" : "ghost"}
            size="icon"
            className={cn(
              "h-8 w-8 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300", 
              isAutoFit && "bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-slate-100"
            )}
            onClick={handleFitWidth}
            title="Fit Width"
          >
            <Maximize className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Scrollable Container */}
      <div 
        ref={containerRef} 
        className="flex-1 overflow-y-auto overflow-x-hidden bg-slate-200/80 dark:bg-slate-800/80 p-4 sm:p-8 flex items-start justify-center custom-scrollbar"
      >
        {/* Hidden measurement container */}
        <div className="absolute opacity-0 pointer-events-none" style={{ zIndex: -100, visibility: 'hidden' }}>
          <div
            ref={contentRef}
            style={{ width: A4_WIDTH_PX, minHeight: A4_HEIGHT_PX }}
            className="relative bg-white cv-template-container"
          >
            {renderTemplateContent(cv)}
          </div>
        </div>

        {/* Visual Pages */}
        <div 
          className="flex flex-col items-center justify-start transition-transform duration-200 ease-out"
          style={{
            transform: `scale(${scale})`,
            transformOrigin: "top center",
            marginRight: scale < 1 ? -(A4_WIDTH_PX * (1 - scale)) / 2 : 0,
            marginLeft: scale < 1 ? -(A4_WIDTH_PX * (1 - scale)) / 2 : 0,
          }}
        >
          {Array.from({ length: numPages }).map((_, i) => (
            <div 
              key={i}
              className="relative bg-white shadow-[0_4px_24px_rgba(0,0,0,0.12)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.4)] ring-1 ring-slate-900/5 dark:ring-slate-100/10 shrink-0 mb-10 last:mb-0 overflow-hidden print-page-container"
              style={{
                width: A4_WIDTH_PX,
                height: A4_HEIGHT_PX,
              }}
            >
              {/* The offset content */}
              <div 
                className="cv-template-container w-full"
                style={{ 
                  position: 'absolute', 
                  top: -(i * A4_HEIGHT_PX), 
                  width: A4_WIDTH_PX 
                }}
              >
                {renderTemplateContent(cv)}
              </div>
              
              {/* Page Number Indicator */}
              <div className="absolute bottom-4 right-4 text-xs text-slate-400 bg-white/80 px-2 py-1 rounded">
                {i + 1} / {numPages}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
