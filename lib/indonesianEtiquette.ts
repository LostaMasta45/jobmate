export type EtiquetteTone = 'formal' | 'semiformal' | 'casual';

export interface EtiquetteRule {
  tone: EtiquetteTone;
  greetings: string[];
  closings: string[];
}

export const INDONESIAN_ETIQUETTE: Record<EtiquetteTone, EtiquetteRule> = {
  formal: {
    tone: 'formal',
    greetings: [
      'Dengan hormat,',
      'Yang terhormat Bapak/Ibu [Nama],',
      'Yth. [Jabatan] [Nama],',
      'Yth. Bapak/Ibu HRD,'
    ],
    closings: [
      'Hormat saya,',
      'Dengan hormat,',
      'Salam hormat,'
    ]
  },
  semiformal: {
    tone: 'semiformal',
    greetings: [
      'Selamat pagi/siang/sore Pak/Bu [Nama],',
      'Halo Pak/Bu [Nama],',
      'Yth. Tim Recruitment,'
    ],
    closings: [
      'Terima kasih banyak,',
      'Salam,',
      'Best regards,'
    ]
  },
  casual: {
    tone: 'casual',
    greetings: [
      'Hai [Nama],',
      'Halo Tim [Company]!',
      'Hi [Nama],'
    ],
    closings: [
      'Cheers,',
      'Thanks!',
      'Salam hangat,'
    ]
  }
};

export const TITLE_RULES = {
  male: ['Bapak', 'Pak', 'Mas'],
  female: ['Ibu', 'Bu', 'Mbak'],
  unknown: ['Bapak/Ibu']
};

export type CompanyType = 'bank' | 'government' | 'startup' | 'multinational' | 'agency' | 'corporate' | 'unknown';

export interface CompanyTypeRule {
  type: CompanyType;
  defaultTone: EtiquetteTone;
  keywords: string[];
}

export const COMPANY_TYPES: Record<CompanyType, CompanyTypeRule> = {
  bank: { 
    type: 'bank',
    defaultTone: 'formal', 
    keywords: ['Bank', 'BCA', 'BRI', 'Mandiri', 'BNI', 'CIMB', 'Permata', 'DBS', 'HSBC', 'Citibank', 'OJK', 'BI ', 'Financial', 'Finance', 'Asuransi', 'Insurance'] 
  },
  government: { 
    type: 'government',
    defaultTone: 'formal', 
    keywords: ['Kementerian', 'BUMN', 'Pertamina', 'PLN', 'Telkom', 'Garuda', 'BPJS', 'Pemerintah', 'Government', 'Ministry'] 
  },
  startup: { 
    type: 'startup',
    defaultTone: 'casual', 
    keywords: ['Gojek', 'Tokopedia', 'Bukalapak', 'Traveloka', 'OVO', 'Dana', 'Shopee', 'Grab', 'Blibli', 'Tiket', 'Ruangguru', 'Zenius', 'Startup', 'Tech', 'Digital', 'Fintech', 'Edutech', 'E-commerce', 'SaaS'] 
  },
  multinational: { 
    type: 'multinational',
    defaultTone: 'semiformal', 
    keywords: ['Google', 'Microsoft', 'Amazon', 'Meta', 'Facebook', 'Apple', 'Netflix', 'Uber', 'Airbnb', 'Stripe', 'Oracle', 'SAP', 'IBM', 'Accenture', 'McKinsey', 'BCG', 'Bain'] 
  },
  agency: { 
    type: 'agency',
    defaultTone: 'casual', 
    keywords: ['Agency', 'Creative', 'Digital Agency', 'Studio', 'Ogilvy', 'Dentsu', 'Leo Burnett', 'TBWA', 'Grey', 'Design Studio', 'Branding'] 
  },
  corporate: { 
    type: 'corporate',
    defaultTone: 'semiformal', 
    keywords: ['PT', 'Tbk', 'Group', 'Holdings', 'Corporation', 'Corp', 'Indonesia', 'Astra', 'Sinar Mas', 'Lippo', 'Salim'] 
  },
  unknown: {
    type: 'unknown',
    defaultTone: 'semiformal',
    keywords: []
  }
};

export function detectCompanyType(companyName: string): CompanyType {
  const upperCompany = companyName.toUpperCase();
  
  for (const [type, rule] of Object.entries(COMPANY_TYPES)) {
    if (type === 'unknown') continue;
    for (const keyword of rule.keywords) {
      if (upperCompany.includes(keyword.toUpperCase())) {
        return type as CompanyType;
      }
    }
  }
  
  return 'unknown';
}

export function suggestToneForCompany(companyType: CompanyType): EtiquetteTone {
  return COMPANY_TYPES[companyType]?.defaultTone || 'semiformal';
}

export function suggestGreeting(tone: EtiquetteTone, name?: string, title?: string): string {
  const rule = INDONESIAN_ETIQUETTE[tone];
  if (!rule) return INDONESIAN_ETIQUETTE.semiformal.greetings[0]; // Fallback

  // If no name, pick a generic one from the list that doesn't need [Nama]
  if (!name) {
     // Find one that doesn't have [Nama]
     const generic = rule.greetings.find(g => !g.includes('[Nama]') && !g.includes('[Jabatan]'));
     return generic || rule.greetings[0];
  }

  // If name is present, try to detect gender/title or use title provided
  // This is a simplified version, title detection needs more logic
  const safeName = name.trim();
  
  // Find a template with [Nama]
  const template = rule.greetings.find(g => g.includes('[Nama]'));
  if (!template) return rule.greetings[0];

  // Determine title to use
  let titleToUse = '';
  if (title) {
      titleToUse = title;
  } else {
      // Try to guess from name or default to Pak/Bu/Mas/Mbak based on tone
      // Since we can't reliably guess gender from name without a large DB or AI,
      // we might look for title hints in the name input itself (e.g. "Bapak Budi")
      const lowerName = safeName.toLowerCase();
      if (lowerName.startsWith('bapak ') || lowerName.startsWith('pak ')) {
          titleToUse = 'Pak';
      } else if (lowerName.startsWith('ibu ') || lowerName.startsWith('bu ')) {
          titleToUse = 'Bu';
      } else if (lowerName.startsWith('mas ')) {
          titleToUse = 'Mas';
      } else if (lowerName.startsWith('mbak ')) {
          titleToUse = 'Mbak';
      } else {
          // Default based on tone
          if (tone === 'formal') titleToUse = 'Bapak/Ibu';
          else if (tone === 'semiformal') titleToUse = 'Pak/Bu';
          else titleToUse = ''; // Casual often doesn't use title
      }
  }

  // Replace logic
  let result = template.replace('[Nama]', safeName);
  
  // If template has Pak/Bu and we have a specific title, use it? 
  // Or just rely on the template's "Pak/Bu"? 
  // The templates in INDONESIAN_ETIQUETTE are like 'Selamat pagi/siang/sore Pak/Bu [Nama],'
  // If we detected "Mas", we might want to swap "Pak/Bu" with "Mas".
  
  if (titleToUse) {
      result = result.replace('Pak/Bu', titleToUse);
      result = result.replace('Bapak/Ibu', titleToUse);
  }

  return result;
}

export function suggestClosing(tone: EtiquetteTone): string {
    const rule = INDONESIAN_ETIQUETTE[tone];
    if (!rule) return INDONESIAN_ETIQUETTE.semiformal.closings[0];
    return rule.closings[0];
}

export function guessGenderTitle(name: string): string | null {
    const lowerName = name.toLowerCase();
    // Very basic heuristics
    if (lowerName.match(/^(bapak|pak|mr\.|mas|bang|kang|om) /)) return 'Bapak';
    if (lowerName.match(/^(ibu|bu|mrs\.|ms\.|mbak|tante|kak) /)) return 'Ibu';
    
    // Common Indonesian names endings (very rough)
    // -a often female (but Indra, Eka can be male)
    // -i often female (but Budi, Andi can be male)
    // -o often male (Joko, Susilo)
    // This is dangerous to guess, better return null and let user choose or use neutral
    return null;
}
