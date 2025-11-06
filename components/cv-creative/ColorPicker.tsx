"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ColorScheme, COLOR_PRESETS } from "@/lib/schemas/cv-creative";
import { Check } from "lucide-react";

interface ColorPickerProps {
  value: ColorScheme;
  onChange: (colors: ColorScheme) => void;
}

export function ColorPicker({ value, onChange }: ColorPickerProps) {
  const isSelected = (preset: typeof COLOR_PRESETS[0]) => 
    value.primary === preset.colors.primary;

  return (
    <div className="space-y-4">
      {/* Color Presets Grid */}
      <div className="grid gap-3 sm:grid-cols-2">
        {COLOR_PRESETS.map((preset) => {
          const selected = isSelected(preset);
          
          return (
            <Card
              key={preset.name}
              className={`group cursor-pointer transition-all hover:shadow-lg ${
                selected ? "ring-2 ring-primary shadow-md" : "hover:ring-1 hover:ring-muted-foreground/20"
              }`}
              onClick={() => onChange(preset.colors)}
            >
              <CardContent className="p-4">
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex gap-2">
                    {[preset.colors.primary, preset.colors.secondary, preset.colors.accent].map((color, i) => (
                      <div
                        key={i}
                        className="h-10 w-10 rounded-md shadow-sm transition-transform group-hover:scale-110"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                  {selected && (
                    <div className="rounded-full bg-primary p-1">
                      <Check className="h-4 w-4 text-primary-foreground" />
                    </div>
                  )}
                </div>
                
                <div>
                  <p className="text-sm font-semibold">{preset.name}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Current Selection Detail */}
      <Card className="bg-muted/30">
        <CardContent className="p-4">
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Selected Colors
          </p>
          <div className="flex flex-wrap gap-3">
            {Object.entries(value).map(([key, color]) => (
              <div key={key} className="flex items-center gap-2">
                <div 
                  className="h-6 w-6 rounded border shadow-sm" 
                  style={{ backgroundColor: color }} 
                />
                <div className="text-xs">
                  <p className="font-medium capitalize">{key}</p>
                  <p className="font-mono text-muted-foreground">{color}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
