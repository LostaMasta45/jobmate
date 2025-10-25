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
import { Template11BlueBox } from "./templates/Template11BlueBox"
import { Template12GreenPro } from "./templates/Template12GreenPro"
import { Template13TealModern } from "./templates/Template13TealModern"
import { Template14PurpleExec } from "./templates/Template14PurpleExec"
import { Template15OrangeCreative } from "./templates/Template15OrangeCreative"
import { Template16NavyCorp } from "./templates/Template16NavyCorp"
import { Template17ForestGreen } from "./templates/Template17ForestGreen"
import { Template18RoyalBlue } from "./templates/Template18RoyalBlue"
import { Template19BurgundyElegant } from "./templates/Template19BurgundyElegant"
import { Template20SlatePro } from "./templates/Template20SlatePro"
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
    case "template-11":
      TemplateComponent = Template11BlueBox
      break
    case "template-12":
      TemplateComponent = Template12GreenPro
      break
    case "template-13":
      TemplateComponent = Template13TealModern
      break
    case "template-14":
      TemplateComponent = Template14PurpleExec
      break
    case "template-15":
      TemplateComponent = Template15OrangeCreative
      break
    case "template-16":
      TemplateComponent = Template16NavyCorp
      break
    case "template-17":
      TemplateComponent = Template17ForestGreen
      break
    case "template-18":
      TemplateComponent = Template18RoyalBlue
      break
    case "template-19":
      TemplateComponent = Template19BurgundyElegant
      break
    case "template-20":
      TemplateComponent = Template20SlatePro
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
