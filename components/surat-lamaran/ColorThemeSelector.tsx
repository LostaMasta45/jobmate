"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { getAllThemes, type ColorTheme } from "@/lib/colorThemes"
import { Check } from "lucide-react"

type Props = {
  selected: string
  onChange: (themeId: string) => void
  showRecommended?: boolean
  position?: string
}

export function ColorThemeSelector({ selected, onChange, showRecommended = false, position }: Props) {
  const themes = getAllThemes()

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold">Pilih Warna Template</h3>
          <p className="text-xs text-muted-foreground">
            Semua warna tetap ATS-friendly dengan score 96-100%
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {themes.map((theme) => (
          <ThemeCard
            key={theme.id}
            theme={theme}
            isSelected={selected === theme.id}
            onClick={() => onChange(theme.id)}
          />
        ))}
      </div>

      {/* Selected Theme Info */}
      {selected && (
        <Card className="bg-muted/50">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="flex gap-2">
                <div
                  className="w-12 h-12 rounded border"
                  style={{ backgroundColor: themes.find(t => t.id === selected)?.colors.primary }}
                />
                <div
                  className="w-12 h-12 rounded border"
                  style={{ backgroundColor: themes.find(t => t.id === selected)?.colors.accent }}
                />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold">{themes.find(t => t.id === selected)?.name}</h4>
                  <Badge variant="outline" className="text-xs">
                    ATS {themes.find(t => t.id === selected)?.atsScore}%
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  {themes.find(t => t.id === selected)?.description}
                </p>
                <div className="flex flex-wrap gap-1">
                  {themes.find(t => t.id === selected)?.recommended.slice(0, 3).map(rec => (
                    <Badge key={rec} variant="secondary" className="text-xs">
                      {rec}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function ThemeCard({ 
  theme, 
  isSelected, 
  onClick 
}: { 
  theme: ColorTheme
  isSelected: boolean
  onClick: () => void
}) {
  return (
    <Card
      className={cn(
        "cursor-pointer transition-all hover:border-primary hover:shadow-md",
        isSelected && "border-primary ring-2 ring-primary ring-offset-2"
      )}
      onClick={onClick}
    >
      <CardContent className="p-3">
        <div className="space-y-2">
          {/* Color Preview */}
          <div className="flex gap-2">
            <div
              className="w-10 h-10 rounded border flex items-center justify-center"
              style={{ backgroundColor: theme.colors.primary }}
            >
              {isSelected && (
                <Check className="w-4 h-4 text-white" />
              )}
            </div>
            <div
              className="w-10 h-10 rounded border"
              style={{ backgroundColor: theme.colors.accent }}
            />
          </div>

          {/* Theme Info */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <h4 className="font-semibold text-sm">{theme.name}</h4>
            </div>
            <Badge variant="outline" className="text-xs mb-2">
              ATS {theme.atsScore}%
            </Badge>
            <p className="text-xs text-muted-foreground line-clamp-2">
              {theme.category}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
