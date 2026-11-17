/**
 * Centralized Public Environment Configuration (Client-Safe Only)
 *
 * SECURITY RULE:
 * Never place API keys, passwords, cryptographic salts, or private tokens here.
 * All secrets live exclusively on the Express backend (`server.ts`) via `process.env`.
 */

import { sanitizeSafeUrl } from '../utils/security';

const rawEnv = (import.meta as unknown as { env?: Record<string, string | undefined> }).env || {};

function resolvePublicUrl(envKey: string, fallback: string): string {
  const candidate = rawEnv[envKey];
  if (candidate) {
    const validated = sanitizeSafeUrl(candidate);
    if (validated) return validated;
  }
  return fallback;
}

export const PUBLIC_ENV = {
  SITE_URL: resolvePublicUrl('VITE_PUBLIC_SITE_URL', 'https://h41fftopup.com'),
  PROOF_FALLBACK_URL: resolvePublicUrl(
    'VITE_PUBLIC_SITE_URL',
    'https://h41fftopup.com/proof-submitted'
  ),
  MAP_EMBED_URL: resolvePublicUrl(
    'VITE_MAP_EMBED_URL',
    'https://www.google.com/maps?q=Banani,+Dhaka+1213,+Bangladesh&output=embed'
  ),
  FACEBOOK_URL: resolvePublicUrl('VITE_FACEBOOK_URL', 'https://facebook.com'),
  TELEGRAM_URL: resolvePublicUrl('VITE_TELEGRAM_URL', 'https://telegram.org'),
  WHATSAPP_URL: resolvePublicUrl('VITE_WHATSAPP_URL', 'https://whatsapp.com'),
} as const;
