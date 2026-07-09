"use client";

import React, { useState, useEffect, useRef } from "react";
import { ZoomIn, ZoomOut, Maximize, LayoutTemplate } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Resume } from "@/lib/schemas/cv-ats";
import { ATS_TEMPLATES, ATSTemplateId } from "@/lib/ats-templates";
import { TemplateClassic } from "./templates/TemplateClassic";
import { TemplateModern } from "./templates/TemplateModern";
import { TemplateExecutive } from "./templates/TemplateExecutive";
import { TemplateMinimalist } from "./templates/TemplateMinimalist";
import { TemplateCorporate } from "./templates/TemplateCorporate";
import { TemplateElegant } from "./templates/TemplateElegant";
import { TemplateFunctional } from "./templates/TemplateFunctional";
import { TemplateSidebar } from "./templates/TemplateSidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface CVPreviewProps {
  resume: Resume;
  scale?: number;
  fitMode?: "width" | "page";
  templateId?: ATSTemplateId;
  onTemplateChange?: (id: ATSTemplateId) => void;
}

// A4 dimensions in mm: 210mm x 297mm
// At 96 DPI: 1mm = 3.7795px
// So A4 in pixels: 794px x 1123px
const A4_WIDTH_PX = 794;
const A4_HEIGHT_PX = 1123;

export function CVPreview({ resume, scale: initialScale = 1, templateId, onTemplateChange }: CVPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  
  // Determine effective template ID
  const effectiveTemplateId = templateId || (resume.templateId as ATSTemplateId) || "classic";
  
  const [scale, setScale] = useState(initialScale);
  const [isAutoFit, setIsAutoFit] = useState(true);
  const [contentHeight, setContentHeight] = useState(A4_HEIGHT_PX);

  // Measure content height
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
  }, [effectiveTemplateId]); // Re-measure when template changes

  // Auto-scale logic with ResizeObserver
  useEffect(() => {
    if (!containerRef.current || !isAutoFit) return;

    const calculateScale = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.clientWidth;
        
        // Add breathing room (margin) around the paper
        // Mobile: 24px total margin
        // Desktop: 64px total margin
        const isMobile = window.innerWidth < 640;
        const marginX = isMobile ? 24 : 64;

        if (containerWidth > 0) {
          // Calculate scale to fit the container width minus margin
          const availableWidth = containerWidth - marginX;
          const widthScale = availableWidth / A4_WIDTH_PX;
          
          // Cap scale at 1.0 (don't stretch larger than actual A4) unless very zoomed in manually
          // But for auto-fit, we usually want to see the whole width.
          // If screen is huge (4k), scale 1.0 is fine.
          // If screen is small, scale down.
          const newScale = Math.min(widthScale, 1.2); // Allow slight overscale on huge screens if desired, or stick to 1.0
          
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
        const checkElements = container.querySelectorAll('h1, h2, h3, h4, h5, h6, p, li, hr, .resume-section');
        
        for (let i = 0; i < checkElements.length; i++) {
          const el = checkElements[i] as HTMLElement;
          // Get position relative to the container
          const rect = el.getBoundingClientRect();
          const containerRect = container.getBoundingClientRect();
          
          // Unscale the coordinates since getBoundingClientRect returns scaled values
          const top = (rect.top - containerRect.top) / scale;
          const bottom = top + el.offsetHeight;
          
          const pageNum = Math.floor(top / pageHeight);
          const pageBottomBoundary = (pageNum + 1) * pageHeight - bottomMargin;
          
          // If element crosses the bottom boundary and isn't bigger than a page itself
          if (bottom > pageBottomBoundary && el.offsetHeight < (pageHeight - topMargin - bottomMargin)) {
            const nextPageTop = (pageNum + 1) * pageHeight + topMargin;
            const shift = nextPageTop - top;
            el.style.marginTop = `${shift}px`;
            el.classList.add('paginated-margin');
          }
        }
      });
    };

    // Run after DOM settles
    const timeout = setTimeout(paginate, 150);
    return () => clearTimeout(timeout);
  }, [resume, effectiveTemplateId, scale]);

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

  const renderTemplate = () => {
    switch (effectiveTemplateId) {
      case "modern":
        return <TemplateModern resume={resume} />;
      case "executive":
        return <TemplateExecutive resume={resume} />;
      case "minimalist":
        return <TemplateMinimalist resume={resume} />;
      case "corporate":
        return <TemplateCorporate resume={resume} />;
      case "elegant":
        return <TemplateElegant resume={resume} />;
      case "functional":
        return <TemplateFunctional resume={resume} />;
      case "sidebar":
        return <TemplateSidebar resume={resume} />;
      case "classic":
      default:
        return <TemplateClassic resume={resume} />;
    }
  };

  return (
    <div className="flex flex-col h-full w-full relative group bg-slate-100/50">
      {/* Zoom & Template Controls */}
      <div className="absolute top-4 right-4 z-10 flex items-center gap-1.5 bg-white shadow-md border border-slate-200 rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        {/* Template Switcher - Only shown if onTemplateChange is provided */}
        {onTemplateChange && (
          <>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full hover:bg-slate-100 text-slate-600"
                  title="Ganti Template"
                >
                  <LayoutTemplate className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Pilih Layout ATS</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {ATS_TEMPLATES.map((template) => (
                  <DropdownMenuItem
                    key={template.id}
                    onClick={() => onTemplateChange(template.id)}
                    className={cn("cursor-pointer flex items-center gap-2", effectiveTemplateId === template.id && "bg-slate-100 font-medium")}
                  >
                    <div 
                      className="w-3 h-3 rounded-full border border-slate-300" 
                      style={{ backgroundColor: template.thumbnailColor }}
                    />
                    {template.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <div className="w-px h-4 bg-slate-200 mx-1" />
          </>
        )}

        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-full hover:bg-slate-100 text-slate-600"
          onClick={handleZoomOut}
          title="Zoom Out"
        >
          <ZoomOut className="h-4 w-4" />
        </Button>
        <span className="text-xs font-medium w-12 text-center text-slate-600 tabular-nums">
          {Math.round(scale * 100)}%
        </span>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-full hover:bg-slate-100 text-slate-600"
          onClick={handleZoomIn}
          title="Zoom In"
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
        <div className="w-px h-4 bg-slate-200 mx-1" />
        <Button
          variant={isAutoFit ? "secondary" : "ghost"}
          size="icon"
          className={cn("h-8 w-8 rounded-full hover:bg-slate-100 text-slate-600", isAutoFit && "bg-slate-100 text-slate-900")}
          onClick={handleFitWidth}
          title="Fit Width"
        >
          <Maximize className="h-4 w-4" />
        </Button>
      </div>

      {/* Scrollable Container - The "Desk" */}
      <div 
        ref={containerRef} 
        className="flex-1 overflow-y-auto overflow-x-hidden bg-slate-200/80 p-4 sm:p-8 flex items-start justify-center custom-scrollbar"
      >
        {/* The Wrapper for Scale */}
        <div
          style={{
            width: A4_WIDTH_PX,
            transform: `scale(${scale})`,
            transformOrigin: "top center",
            // Center the paper horizontally after scaling
            marginBottom: -(Math.max(1, Math.ceil(contentHeight / A4_HEIGHT_PX)) * A4_HEIGHT_PX * (1 - scale)) + 40,
            marginRight: scale < 1 ? -(A4_WIDTH_PX * (1 - scale)) / 2 : 0,
            marginLeft: scale < 1 ? -(A4_WIDTH_PX * (1 - scale)) / 2 : 0,
          }}
          className="relative shrink-0 transition-transform duration-200 ease-out"
        >
          {/* Hidden reference for measuring */}
          <div
            ref={contentRef}
            style={{ 
              width: A4_WIDTH_PX, 
              minHeight: A4_HEIGHT_PX, 
              position: 'absolute', 
              visibility: 'hidden', 
              zIndex: -10 
            }}
          >
            <div className="cv-template-container w-full">{renderTemplate()}</div>
          </div>

          {/* Render visual pages */}
          {Array.from({ length: Math.max(1, Math.ceil(contentHeight / A4_HEIGHT_PX)) }).map((_, i) => {
            const numPages = Math.max(1, Math.ceil(contentHeight / A4_HEIGHT_PX));
            return (
              <div
                key={i}
                style={{
                  width: A4_WIDTH_PX,
                  height: A4_HEIGHT_PX,
                  overflow: 'hidden',
                  position: 'relative',
                  marginBottom: i < numPages - 1 ? '40px' : '0' // Gap between pages
                }}
                className="bg-white shadow-[0_4px_24px_rgba(0,0,0,0.12)] ring-1 ring-slate-900/5"
              >
                {/* Page number indicator (optional but helpful) */}
                <div className="absolute bottom-2 right-4 text-[10px] text-slate-300 z-10 pointer-events-none">
                  Page {i + 1}
                </div>
                
                {/* The offset content */}
                <div style={{ position: 'absolute', top: -(i * A4_HEIGHT_PX), width: A4_WIDTH_PX }}>
                  <div className="cv-template-container w-full">{renderTemplate()}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}