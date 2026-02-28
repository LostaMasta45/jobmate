// lib/resend.ts
import { Resend } from 'resend';

if (!process.env.RESEND_API_KEY) {
  throw new Error('RESEND_API_KEY is not defined');
}

export const resend = new Resend(process.env.RESEND_API_KEY);

// Professional sender email with verified domain
// Domain: infolokerjombang.id (verified in Resend)
// Use plain email format for better compatibility
export const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'admin@infolokerjombang.id';
export const FROM_NAME = 'InfoLokerJombang';
export const FROM_ADDRESS = 'admin@infolokerjombang.id';

// Helper function to format sender email
export function getFromEmail(customName?: string): string {
  if (customName) {
    return `${customName} <${FROM_ADDRESS}>`;
  }
  return FROM_EMAIL;
}
