"use client";

import React, { useRef, useState, useEffect } from "react";
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

interface CreativeThumbnailProps {
  cv: Partial<CreativeCV>;
}

// A4 dimensions in px at 96 DPI
const A4_WIDTH_PX = 794; 
const A4_HEIGHT_PX = 1123; 

export function CreativeThumbnail({ cv }: CreativeThumbnailProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.2);

  useEffect(() => {
    if (!containerRef.current) return;

    const updateScale = () => {
      if (containerRef.current) {
        const { width } = containerRef.current.getBoundingClientRect();
        const newScale = width / A4_WIDTH_PX;
        setScale(newScale);
      }
    };

    updateScale();

    const observer = new ResizeObserver(updateScale);
    observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, []);

  const renderTemplate = () => {
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
