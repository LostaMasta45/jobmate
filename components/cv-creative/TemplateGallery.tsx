"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TEMPLATES, TemplateId } from "@/lib/schemas/cv-creative";
import { Sparkles } from "lucide-react";

interface TemplateGalleryProps {
  onSelect: (templateId: TemplateId) => void;
  selectedTemplate?: TemplateId;
}

export function TemplateGallery({ onSelect, selectedTemplate }: TemplateGalleryProps) {
  const [filter, setFilter] = React.useState<string>("all");

  const filteredTemplates = TEMPLATES.filter((t) => 
    filter === "all" || t.category === filter
  );

  return (
    <div className="space-y-4">
      {/* Filter Buttons - Responsive */}
      <div className="flex flex-wrap gap-2">
        {["all", "modern", "professional", "creative"].map((cat) => (
          <Button
            key={cat}
            variant={filter === cat ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter(cat)}
            className="flex-1 min-w-[80px] sm:flex-none"
          >
            {cat === "all" ? "All" : cat.charAt(0).toUpperCase() + cat.slice(1)}
          </Button>
        ))}
      </div>

      {/* Template Grid - Responsive */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {filteredTemplates.map((template) => (
          <Card
            key={template.id}
            className={`cursor-pointer transition-all hover:shadow-lg ${
              selectedTemplate === template.id ? "ring-2 ring-primary" : ""
            }`}
            onClick={() => onSelect(template.id as TemplateId)}
          >
            <CardContent className="p-3">
              <div
                className="mb-2 h-32 rounded border sm:h-40"
                style={{
                  background: `linear-gradient(135deg, ${template.defaultColors.primary}, ${template.defaultColors.secondary})`,
                }}
              />
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold sm:text-base">{template.name}</h3>
                  {template.isPremium && (
                    <Badge variant="secondary" className="gap-1">
                      <Sparkles className="h-3 w-3" />
                      <span className="hidden sm:inline">VIP</span>
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground sm:text-sm">{template.description}</p>
                <div className="flex flex-wrap gap-1">
                  {template.bestFor.slice(0, 2).map((role) => (
                    <Badge key={role} variant="outline" className="text-[10px] sm:text-xs">
                      {role}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
