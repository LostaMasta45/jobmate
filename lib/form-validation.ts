// Form validation utilities

export function validateEmail(email: string): { valid: boolean; error?: string; suggestion?: string } {
  if (!email) {
    return { valid: false, error: 'Email tidak boleh kosong' };
  }

  // Basic email regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!emailRegex.test(email)) {
    return { valid: false, error: 'Format email tidak valid' };
  }

  // Common typo suggestions
  const commonTypos: Record<string, string> = {
    'gmai.com': 'gmail.com',
    'gmial.com': 'gmail.com',
    'yahooo.com': 'yahoo.com',
    'yaho.com': 'yahoo.com',
    'hotmial.com': 'hotmail.com',
    'outlok.com': 'outlook.com',
  };

  const domain = email.split('@')[1];
  if (domain && commonTypos[domain]) {
    return {
      valid: false,
      error: 'Mungkin ada typo di email Anda',
      suggestion: email.replace(domain, commonTypos[domain])
    };
  }

  return { valid: true };
}

export function formatWhatsApp(phone: string): string {
  // Remove all non-numeric characters
  const clean = phone.replace(/\D/g, '');
  
  // Format: 081234567890 → +62 812-3456-7890
  if (clean.startsWith('0')) {
    const withoutZero = clean.substring(1);
    if (withoutZero.length >= 9) {
      return `+62 ${withoutZero.substring(0, 3)}-${withoutZero.substring(3, 7)}-${withoutZero.substring(7)}`;
    }
    return `+62 ${withoutZero}`;
  }
  
  if (clean.startsWith('62')) {
    const withoutPrefix = clean.substring(2);
    if (withoutPrefix.length >= 9) {
      return `+62 ${withoutPrefix.substring(0, 3)}-${withoutPrefix.substring(3, 7)}-${withoutPrefix.substring(7)}`;
    }
    return `+62 ${withoutPrefix}`;
  }
  
  // If starts with +62
  if (phone.startsWith('+62')) {
    const withoutPrefix = clean.substring(2);
    if (withoutPrefix.length >= 9) {
      return `+62 ${withoutPrefix.substring(0, 3)}-${withoutPrefix.substring(3, 7)}-${withoutPrefix.substring(7)}`;
    }
  }
  
  return phone;
}

export function validateWhatsApp(phone: string): { valid: boolean; error?: string } {
  const clean = phone.replace(/\D/g, '');
  
  if (!clean) {
    return { valid: false, error: 'Nomor WhatsApp tidak boleh kosong' };
  }
  
  // Check minimum length (Indonesian number: 10-13 digits)
  if (clean.length < 10) {
    return { valid: false, error: 'Nomor WhatsApp terlalu pendek (min. 10 digit)' };
  }
  
  if (clean.length > 15) {
    return { valid: false, error: 'Nomor WhatsApp terlalu panjang (max. 15 digit)' };
  }
  
  // Check if starts with valid Indonesian prefix
  const validPrefixes = ['08', '628', '62'];
  const hasValidPrefix = validPrefixes.some(prefix => clean.startsWith(prefix));
  
  if (!hasValidPrefix) {
    return { valid: false, error: 'Nomor harus dimulai dengan 08 atau 62' };
  }
  
  return { valid: true };
}

export function formatWhatsAppForAPI(phone: string): string {
  const clean = phone.replace(/\D/g, '');
  
  if (clean.startsWith('0')) {
    return `+62${clean.substring(1)}`;
  }
  
  if (clean.startsWith('62')) {
    return `+${clean}`;
  }
  
  return `+62${clean}`;
}
