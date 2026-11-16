/**
 * Centralized Security, Sanitization & Validation Utilities (Client-Safe)
 *
 * NOTE: All cryptographic salts, password hashing (scrypt), and session token signing
 * are executed exclusively on the Express backend (`server.ts`) via environment variables.
 * No secrets, salts, or passwords exist in this client module.
 */

import { User } from '../types';

/**
 * Strips HTML angle brackets, null bytes, and dangerous control characters
 * while preserving Bengali (বাংলা) Unicode script and standard punctuation.
 */
export function sanitizeText(input: string, maxLength = 500): string {
  if (typeof input !== 'string') return '';
  return input
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
    .replace(/[<>]/g, '')
    .trim()
    .slice(0, maxLength);
}

/**
 * Validates and normalizes external URLs.
 * Strictly allows only http: and https: protocols to prevent javascript:, data:, or vbscript: XSS.
 */
export function sanitizeSafeUrl(rawUrl: string): string | null {
  if (typeof rawUrl !== 'string') return null;
  const trimmed = rawUrl.trim();
  if (!trimmed) return null;
  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
      return null;
    }
    return parsed.toString();
  } catch {
    return null;
  }
}

/**
 * Validates Free Fire Numeric Player UID (Bangladesh Server: 8 to 12 digits).
 */
export function isValidFreeFireUid(uid: string): boolean {
  if (typeof uid !== 'string') return false;
  return /^\d{8,12}$/.test(uid.trim());
}

/**
 * Validates Bangladesh mobile banking numbers (013..019 followed by 8 digits, optional +88).
 */
export function isValidBdPhone(phone: string): boolean {
  if (typeof phone !== 'string') return false;
  const cleaned = phone.replace(/[\s-]/g, '');
  return /^(?:\+?88)?01[3-9]\d{8}$/.test(cleaned);
}

/**
 * Validates Mobile Banking Transaction IDs (TrxID: 6 to 24 alphanumeric/hyphen characters).
 */
export function isValidTrxId(trxId: string): boolean {
  if (typeof trxId !== 'string') return false;
  return /^[A-Za-z0-9-]{6,24}$/.test(trxId.trim());
}

/**
 * Validates standard email format safely without catastrophic backtracking.
 */
export function isValidEmail(email: string): boolean {
  if (typeof email !== 'string' || email.length > 160) return false;
  return /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]{2,}$/.test(email.trim());
}

/**
 * Validates positive integer BDT financial amounts within safe bounds.
 */
export function isValidBdtAmount(amount: unknown, min = 1, max = 500000): boolean {
  if (typeof amount !== 'number' || !Number.isFinite(amount)) return false;
  return Number.isInteger(amount) && amount >= min && amount <= max;
}

/**
 * Strips any `password` field from User objects before persisting to browser localStorage
 * so credentials are never stored in client-side storage.
 */
export function stripSensitiveUserFields(users: User[]): User[] {
  return users.map(({ password: _redacted, ...safeUser }) => safeUser);
}

/**
 * Safe JSON parser that blocks prototype pollution keys (__proto__, constructor, prototype).
 */
export function safeJsonParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    const parsed = JSON.parse(raw, (key, value) => {
      if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
        return undefined;
      }
      return value;
    });
    if (parsed === null || typeof parsed !== typeof fallback) {
      return fallback;
    }
    if (Array.isArray(fallback) && !Array.isArray(parsed)) {
      return fallback;
    }
    return parsed as T;
  } catch {
    return fallback;
  }
}
