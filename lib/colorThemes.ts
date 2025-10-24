export type ColorTheme = {
  id: string
  name: string
  category: string
  colors: {
    primary: string
    accent: string
    text: string
  }
  atsScore: number
  description: string
  recommended: string[]
}

export const colorThemes: Record<string, ColorTheme> = {
  classic: {
    id: 'classic',
    name: 'Klasik Hitam-Putih',
    category: 'Universal - Semua Industri',
    colors: {
      primary: '#000000',
      accent: '#000000',
      text: '#000000'
    },
    atsScore: 100,
    description: 'Template klasik tanpa warna, paling aman untuk ATS',
    recommended: ['Semua posisi', 'Government', 'Banking']
  },
  professionalBlue: {
    id: 'professional-blue',
    name: 'Professional Blue',
    category: 'Bank, Corporate, Finance',
    colors: {
      primary: '#0066CC',
      accent: '#4A90E2',
      text: '#000000'
    },
    atsScore: 98,
    description: 'Warna biru profesional untuk industri corporate',
    recommended: ['Bank', 'Finance', 'Consulting', 'Corporate']
  },
  corporateGreen: {
    id: 'corporate-green',
    name: 'Corporate Green',
    category: 'Consulting, Healthcare, NGO',
    colors: {
      primary: '#006B3F',
      accent: '#2ECC71',
      text: '#000000'
    },
    atsScore: 98,
    description: 'Hijau profesional untuk healthcare dan NGO',
    recommended: ['Healthcare', 'NGO', 'Education', 'Environmental']
  },
  executiveNavy: {
    id: 'executive-navy',
    name: 'Executive Navy',
    category: 'Manager, Senior, C-Level',
    colors: {
      primary: '#1A2332',
      accent: '#34495E',
      text: '#000000'
    },
    atsScore: 99,
    description: 'Navy profesional untuk posisi senior dan eksekutif',
    recommended: ['Manager', 'Director', 'C-Level', 'Senior Position']
  },
  modernPurple: {
    id: 'modern-purple',
    name: 'Modern Purple',
    category: 'Tech, Creative, Startup',
    colors: {
      primary: '#6C3FB5',
      accent: '#9B59B6',
      text: '#000000'
    },
    atsScore: 97,
    description: 'Ungu modern untuk industri tech dan creative',
    recommended: ['Tech', 'Startup', 'Design', 'Creative Agency']
  },
  creativeOrange: {
    id: 'creative-orange',
    name: 'Creative Orange',
    category: 'Marketing, Design, Media',
    colors: {
      primary: '#E67E22',
      accent: '#F39C12',
      text: '#000000'
    },
    atsScore: 96,
    description: 'Orange kreatif untuk marketing dan design',
    recommended: ['Marketing', 'Advertising', 'Design', 'Media']
  },
  techCyan: {
    id: 'tech-cyan',
    name: 'Tech Cyan',
    category: 'IT, Software, Engineering',
    colors: {
      primary: '#00B8D4',
      accent: '#00E5FF',
      text: '#000000'
    },
    atsScore: 97,
    description: 'Cyan modern untuk IT dan software engineering',
    recommended: ['Software Engineer', 'IT', 'Data Science', 'Engineering']
  }
}

export const getThemeById = (id: string): ColorTheme => {
  return colorThemes[id] || colorThemes.classic
}

export const getAllThemes = (): ColorTheme[] => {
  return Object.values(colorThemes)
}

export const getThemesByCategory = (category: string): ColorTheme[] => {
  return getAllThemes().filter(theme => 
    theme.category.toLowerCase().includes(category.toLowerCase())
  )
}

export const getRecommendedTheme = (position?: string, industry?: string): ColorTheme => {
  if (!position && !industry) return colorThemes.classic

  const searchTerm = `${position} ${industry}`.toLowerCase()

  // Check each theme's recommended list
  for (const theme of getAllThemes()) {
    for (const rec of theme.recommended) {
      if (searchTerm.includes(rec.toLowerCase())) {
        return theme
      }
    }
  }

  // Default based on industry keywords
  if (searchTerm.includes('tech') || searchTerm.includes('software') || searchTerm.includes('engineer')) {
    return colorThemes.techCyan
  }
  if (searchTerm.includes('marketing') || searchTerm.includes('design') || searchTerm.includes('creative')) {
    return colorThemes.creativeOrange
  }
  if (searchTerm.includes('bank') || searchTerm.includes('finance')) {
    return colorThemes.professionalBlue
  }
  if (searchTerm.includes('manager') || searchTerm.includes('senior') || searchTerm.includes('director')) {
    return colorThemes.executiveNavy
  }
  if (searchTerm.includes('health') || searchTerm.includes('ngo')) {
    return colorThemes.corporateGreen
  }

  return colorThemes.classic
}
