"use client";

import React, { useRef, useState, useEffect } from "react";
import { Resume } from "@/lib/schemas/cv-ats";
import { ATSTemplateId } from "@/lib/ats-templates";
import { TemplateClassic } from "./templates/TemplateClassic";
import { TemplateModern } from "./templates/TemplateModern";
import { TemplateExecutive } from "./templates/TemplateExecutive";
import { TemplateMinimalist } from "./templates/TemplateMinimalist";
import { TemplateCorporate } from "./templates/TemplateCorporate";
import { TemplateElegant } from "./templates/TemplateElegant";
import { TemplateFunctional } from "./templates/TemplateFunctional";
import { TemplateSidebar } from "./templates/TemplateSidebar";

interface TemplateThumbnailProps {
  resume: Resume;
  templateId: ATSTemplateId;
}

// A4 dimensions in px at 96 DPI
const A4_WIDTH_PX = 794; 
const A4_HEIGHT_PX = 1123; 

export function TemplateThumbnail({ resume, templateId }: TemplateThumbnailProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.2); // Start small

  useEffect(() => {
    if (!containerRef.current) return;

    const updateScale = () => {
      if (containerRef.current) {
        const { width } = containerRef.current.getBoundingClientRect();
        // Calculate exact scale to fit width
        // Add a tiny buffer to prevent overflow issues
        const newScale = width / A4_WIDTH_PX;
        setScale(newScale);
      }
    };

    // Initial update
    updateScale();

    // Observe resize
    const observer = new ResizeObserver(updateScale);
    observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, []);

  const renderTemplate = () => {
    const props = { resume };
    switch (templateId) {
      case "modern": return <TemplateModern {...props} />;
      case "executive": return <TemplateExecutive {...props} />;
      case "minimalist": return <TemplateMinimalist {...props} />;
      case "corporate": return <TemplateCorporate {...props} />;
      case "elegant": return <TemplateElegant {...props} />;
      case "functional": return <TemplateFunctional {...props} />;
      case "sidebar": return <TemplateSidebar {...props} />;
      case "classic": default: return <TemplateClassic {...props} />;
    }
  };

  return (
    <div 
      ref={containerRef} 
      className="relative w-full aspect-[210/297] bg-white overflow-hidden shadow-sm select-none isolate"
    >
      <div 
        style={{
          width: A4_WIDTH_PX,
          height: A4_HEIGHT_PX,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
        }}
        className="origin-top-left pointer-events-none"
      >
        {renderTemplate()}
      </div>
      
      {/* Overlay to ensure clicks register on the card, not the content */}
      <div className="absolute inset-0 z-10 bg-transparent" />
    </div>
  );
}
