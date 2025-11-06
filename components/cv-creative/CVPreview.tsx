"use client";

import * as React from "react";
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
}

export function CVPreview({ cv }: CVPreviewProps) {
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
    <div className="cv-creative-wrap">
      <div id="cv-preview-content" className="cv-creative-page">
        {renderTemplate()}
      </div>
    </div>
  );
}
