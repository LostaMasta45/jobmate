import type { FormState } from "@/lib/surat-lamaran-utils"
import { Template1Classic } from "./templates/Template1Classic"
import { Template2Modern } from "./templates/Template2Modern"
import { Template3Corporate } from "./templates/Template3Corporate"
import { Template4Creative } from "./templates/Template4Creative"
import { Template5Elegant } from "./templates/Template5Elegant"
import { Template6TwoColumn } from "./templates/Template6TwoColumn"
import { Template7Bold } from "./templates/Template7Bold"
import { Template8Compact } from "./templates/Template8Compact"
import { Template9Executive } from "./templates/Template9Executive"
import { Template10FreshGrad } from "./templates/Template10FreshGrad"
import { getThemeById } from "@/lib/colorThemes"

type Props = {
  data: FormState
  templateId: string
}

export function Letter({ data, templateId }: Props) {
  // Get color theme
  const colorTheme = getThemeById(data.colorTheme || 'classic')
  
  // Apply color theme as CSS variables
  const themeStyles = {
    '--theme-primary': colorTheme.colors.primary,
    '--theme-accent': colorTheme.colors.accent,
    '--theme-text': colorTheme.colors.text,
  } as React.CSSProperties
  // Template switcher based on selected template ID
  let TemplateComponent
  
  switch (templateId) {
    case "template-1":
      TemplateComponent = Template1Classic
      break
    case "template-2":
      TemplateComponent = Template2Modern
      break
    case "template-3":
      TemplateComponent = Template3Corporate
      break
    case "template-4":
      TemplateComponent = Template4Creative
      break
    case "template-5":
      TemplateComponent = Template5Elegant
      break
    case "template-6":
      TemplateComponent = Template6TwoColumn
      break
    case "template-7":
      TemplateComponent = Template7Bold
      break
    case "template-8":
      TemplateComponent = Template8Compact
      break
    case "template-9":
      TemplateComponent = Template9Executive
      break
    case "template-10":
      TemplateComponent = Template10FreshGrad
      break
    default:
      // Fallback to template 1 if unknown
      TemplateComponent = Template1Classic
  }
  
  return (
    <div className="themed-letter" style={themeStyles}>
      <TemplateComponent data={data} />
    </div>
  )
}
