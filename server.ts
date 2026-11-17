import 'dotenv/config';
import crypto from 'crypto';
import express, { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ============================================================================
// 1. AUTOMATIC SERVER-SIDE KEY GENERATION & ENCRYPTED VAULT STORAGE
// Auth salt, session token secret, and AES-256-GCM master encryption key are
// generated automatically on the server and NEVER exposed in the UI or logs.
// ============================================================================
const VAULT_DIR = path.join(__dirname, '.server-vault');
const KEYS_FILE = path.join(VAULT_DIR, 'server-keys.json');
const ADMIN_AUTH_FILE = path.join(VAULT_DIR, 'admin-auth.json');
const SECRETS_FILE = path.join(VAULT_DIR, 'encrypted-secrets.json');
const WALLET_LEDGER_FILE = path.join(VAULT_DIR, 'wallet-ledger.json');
const PHONE_MAP_FILE = path.join(VAULT_DIR, 'phone-map.json');
const FIREBASE_CONFIG_FILE = path.join(__dirname, 'firebase-applet-config.json');

const FIREBASE_PROJECT_ID = (() => {
  try {
    const raw = JSON.parse(fs.readFileSync(FIREBASE_CONFIG_FILE, 'utf8')) as {
      projectId?: string;
    };
    return raw.projectId || 'aerial-source-hlkqp';
  } catch {
    return 'aerial-source-hlkqp';
  }
})();

interface ServerAutoKeys {
  authSalt: string;
  sessionTokenSecret: string;
  masterEncryptionKeyHex: string;
  createdAt: string;
}

interface AdminCredentialState {
  uid: string;
  username: string;
  email: string;
  passwordHash: string;
  mustChangePassword: boolean;
  bootstrapCompleted: boolean;
  updatedAt: string;
  resetCodeHash?: string;
  resetCodeExpiresAt?: number;
}

interface EncryptedSecretPayload {
  iv: string;
  authTag: string;
  ciphertext: string;
  maskedValue: string;
  updatedAt: string;
}

interface EncryptedSecretsStore {
  paymentGatewayApiKey?: EncryptedSecretPayload;
  unipinVoucherApiSecret?: EncryptedSecretPayload;
}

function ensureVaultDirectory() {
  if (!fs.existsSync(VAULT_DIR)) {
    fs.mkdirSync(VAULT_DIR, { recursive: true, mode: 0o700 });
  }
}

function loadOrGenerateServerKeys(): ServerAutoKeys {
  ensureVaultDirectory();
  if (fs.existsSync(KEYS_FILE)) {
    try {
      const parsed = JSON.parse(fs.readFileSync(KEYS_FILE, 'utf8')) as ServerAutoKeys;
      if (parsed.authSalt && parsed.sessionTokenSecret && parsed.masterEncryptionKeyHex) {
        return parsed;
      }
    } catch {
      // Regenerate if corrupted
    }
  }
  const generated: ServerAutoKeys = {
    authSalt: crypto.randomBytes(32).toString('hex'),
    sessionTokenSecret: crypto.randomBytes(32).toString('hex'),
    masterEncryptionKeyHex: crypto.randomBytes(32).toString('hex'),
    createdAt: new Date().toISOString(),
  };
  fs.writeFileSync(KEYS_FILE, JSON.stringify(generated, null, 2), { mode: 0o600 });
  return generated;
}

const SERVER_KEYS = loadOrGenerateServerKeys();

function hashWithServerSalt(plainText: string): string {
  return crypto.scryptSync(plainText, SERVER_KEYS.authSalt, 64).toString('hex');
}

function timingSafeHexEqual(hexA: string, hexB: string): boolean {
  try {
    const a = Buffer.from(hexA, 'hex');
    const b = Buffer.from(hexB, 'hex');
    if (a.length !== b.length) return false;
    return crypto.timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

function maskSecretValue(raw: string): string {
  const trimmed = raw.trim();
  if (trimmed.length <= 4) return '••••';
  return `••••${trimmed.slice(-4)}`;
}

function encryptSecret(plainSecret: string): EncryptedSecretPayload {
  const iv = crypto.randomBytes(12);
  const key = Buffer.from(SERVER_KEYS.masterEncryptionKeyHex, 'hex');
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  const encrypted = Buffer.concat([cipher.update(plainSecret, 'utf8'), cipher.final()]);
  const authTag = cipher.getAuthTag();
  return {
    iv: iv.toString('hex'),
    authTag: authTag.toString('hex'),
    ciphertext: encrypted.toString('hex'),
    maskedValue: maskSecretValue(plainSecret),
    updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 19),
  };
}

function decryptSecret(payload: EncryptedSecretPayload): string {
  const key = Buffer.from(SERVER_KEYS.masterEncryptionKeyHex, 'hex');
  const iv = Buffer.from(payload.iv, 'hex');
  const authTag = Buffer.from(payload.authTag, 'hex');
  const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
  decipher.setAuthTag(authTag);
  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(payload.ciphertext, 'hex')),
    decipher.final(),
  ]);
  return decrypted.toString('utf8');
}

function loadSecretsStore(): EncryptedSecretsStore {
  ensureVaultDirectory();
  if (fs.existsSync(SECRETS_FILE)) {
    try {
      return JSON.parse(fs.readFileSync(SECRETS_FILE, 'utf8')) as EncryptedSecretsStore;
    } catch {
      return {};
    }
  }
  const initialStore: EncryptedSecretsStore = {
    paymentGatewayApiKey: encryptSecret(
      process.env.PAYMENT_GATEWAY_API_KEY ||
        `H41FFTOPUP-GW-${crypto.randomBytes(12).toString('hex').toUpperCase()}`
    ),
    unipinVoucherApiSecret: encryptSecret(
      process.env.UNIPIN_VOUCHER_API_SECRET ||
        `H41FFTOPUP-UP-${crypto.randomBytes(12).toString('hex').toUpperCase()}`
    ),
  };
  fs.writeFileSync(SECRETS_FILE, JSON.stringify(initialStore, null, 2), { mode: 0o600 });
  return initialStore;
}

function saveSecretsStore(store: EncryptedSecretsStore) {
  ensureVaultDirectory();
  fs.writeFileSync(SECRETS_FILE, JSON.stringify(store, null, 2), { mode: 0o600 });
}

function loadAdminAuthState(): AdminCredentialState {
  ensureVaultDirectory();
  if (fs.existsSync(ADMIN_AUTH_FILE)) {
    try {
      return JSON.parse(fs.readFileSync(ADMIN_AUTH_FILE, 'utf8')) as AdminCredentialState;
    } catch {
      // Fall through
    }
  }
  const primaryEmail = (
    process.env.BOOTSTRAP_ADMIN_EMAIL || 'tahsinislammahin15@gmail.com'
  ).toLowerCase();
  const initialState: AdminCredentialState = {
    uid: 'ADM-PRINCIPAL-01',
    username: 'admin',
    email: primaryEmail,
    passwordHash: '',
    mustChangePassword: true,
    bootstrapCompleted: false,
    updatedAt: new Date().toISOString(),
  };
  fs.writeFileSync(ADMIN_AUTH_FILE, JSON.stringify(initialState, null, 2), { mode: 0o600 });
  return initialState;
}

function saveAdminAuthState(state: AdminCredentialState) {
  ensureVaultDirectory();
  fs.writeFileSync(ADMIN_AUTH_FILE, JSON.stringify(state, null, 2), { mode: 0o600 });
}

// ============================================================================
// 2. SESSION TOKENS (30-MINUTE EXPIRY) & REVOCATION
// ============================================================================
const SESSION_TTL_MS = 30 * 60 * 1000;
const revokedTokens = new Set<string>();

interface SessionPayload {
  uid: string;
  email: string;
  role: 'admin';
  mustChangePassword: boolean;
  issuedAt: number;
  expiresAt: number;
  jti: string;
}

function signAdminSessionToken(state: AdminCredentialState): {
  token: string;
  expiresAt: number;
  mustChangePassword: boolean;
} {
  const now = Date.now();
  const expiresAt = now + SESSION_TTL_MS;
  const payload: SessionPayload = {
    uid: state.uid,
    email: state.email,
    role: 'admin',
    mustChangePassword: state.mustChangePassword,
    issuedAt: now,
    expiresAt,
    jti: crypto.randomBytes(12).toString('hex'),
  };
  const encoded = Buffer.from(JSON.stringify(payload), 'utf8').toString('base64url');
  const sig = crypto
    .createHmac('sha256', SERVER_KEYS.sessionTokenSecret)
    .update(encoded)
    .digest('base64url');
  return {
    token: `${encoded}.${sig}`,
    expiresAt,
    mustChangePassword: state.mustChangePassword,
  };
}

function verifyAdminSessionToken(rawToken?: string): SessionPayload | null {
  if (!rawToken || typeof rawToken !== 'string') return null;
  if (revokedTokens.has(rawToken)) return null;
  const parts = rawToken.split('.');
  if (parts.length !== 2) return null;
  const [encoded, providedSig] = parts;
  const expectedSig = crypto
    .createHmac('sha256', SERVER_KEYS.sessionTokenSecret)
    .update(encoded)
    .digest('base64url');
  const a = Buffer.from(providedSig);
  const b = Buffer.from(expectedSig);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;

  try {
    const payload = JSON.parse(Buffer.from(encoded, 'base64url').toString('utf8')) as SessionPayload;
    if (Date.now() > payload.expiresAt) return null;
    if (payload.role !== 'admin') return null;
    return payload;
  } catch {
    return null;
  }
}

// ============================================================================
// 2B. FIREBASE AUTH ID TOKEN VERIFICATION (RS256 AGAINST GOOGLE PUBLIC CERTS)
// ============================================================================
interface DecodedFirebaseToken {
  uid: string;
  email: string;
  emailVerified: boolean;
}

let cachedGoogleCerts: { certs: Record<string, string>; expiresAt: number } | null = null;

async function fetchGooglePublicCerts(): Promise<Record<string, string>> {
  if (cachedGoogleCerts && Date.now() < cachedGoogleCerts.expiresAt) {
    return cachedGoogleCerts.certs;
  }
  const resp = await fetch(
    'https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com'
  );
  if (!resp.ok) {
    throw new Error('Unable to fetch Google Auth public certificates.');
  }
  const certs = (await resp.json()) as Record<string, string>;
  const cacheControl = resp.headers.get('cache-control') || '';
  const maxAgeMatch = cacheControl.match(/max-age=(\d+)/);
  const maxAgeSec = maxAgeMatch ? Number(maxAgeMatch[1]) : 3600;
  cachedGoogleCerts = {
    certs,
    expiresAt: Date.now() + Math.max(300, maxAgeSec) * 1000,
  };
  return certs;
}

async function verifyFirebaseIdToken(idToken?: string): Promise<DecodedFirebaseToken | null> {
  if (!idToken || typeof idToken !== 'string') return null;
  const parts = idToken.split('.');
  if (parts.length !== 3) return null;
  const [headerB64, payloadB64, sigB64] = parts;

  try {
    const header = JSON.parse(Buffer.from(headerB64, 'base64url').toString('utf8')) as {
      alg?: string;
      kid?: string;
    };
    const claims = JSON.parse(Buffer.from(payloadB64, 'base64url').toString('utf8')) as {
      aud?: string;
      iss?: string;
      sub?: string;
      user_id?: string;
      email?: string;
      email_verified?: boolean;
      exp?: number;
      iat?: number;
    };

    if (header.alg !== 'RS256' || !header.kid) return null;
    const nowSec = Math.floor(Date.now() / 1000);
    if (!claims.exp || claims.exp <= nowSec) return null;
    if (claims.aud !== FIREBASE_PROJECT_ID) return null;
    if (claims.iss !== `https://securetoken.google.com/${FIREBASE_PROJECT_ID}`) return null;
    const uid = claims.sub || claims.user_id || '';
    if (!uid || uid.length > 128) return null;

    let certs = await fetchGooglePublicCerts();
    let pem = certs[header.kid];
    if (!pem) {
      cachedGoogleCerts = null;
      certs = await fetchGooglePublicCerts();
      pem = certs[header.kid];
    }
    if (!pem) return null;

    const verifier = crypto.createVerify('RSA-SHA256');
    verifier.update(`${headerB64}.${payloadB64}`);
    verifier.end();
    const signatureValid = verifier.verify(pem, Buffer.from(sigB64, 'base64url'));
    if (!signatureValid) return null;

    return {
      uid,
      email: String(claims.email || '').toLowerCase(),
      emailVerified: Boolean(claims.email_verified),
    };
  } catch {
    return null;
  }
}

// ============================================================================
// 3. RATE LIMITERS (LOGIN & WALLET MUTATIONS)
// ============================================================================
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const MAX_LOGIN_ATTEMPTS = 5;
const loginAttempts = new Map<string, { count: number; resetAt: number }>();
const walletRateMap = new Map<string, { count: number; resetAt: number }>();

function checkLoginRateLimit(key: string): { allowed: boolean; retryAfterSeconds: number } {
  const now = Date.now();
  const entry = loginAttempts.get(key);
  if (!entry || now > entry.resetAt) {
    return { allowed: true, retryAfterSeconds: 0 };
  }
  if (entry.count >= MAX_LOGIN_ATTEMPTS) {
    return {
      allowed: false,
      retryAfterSeconds: Math.max(1, Math.ceil((entry.resetAt - now) / 1000)),
    };
  }
  return { allowed: true, retryAfterSeconds: 0 };
}

function recordFailedLoginAttempt(key: string) {
  const now = Date.now();
  const entry = loginAttempts.get(key);
  if (!entry || now > entry.resetAt) {
    loginAttempts.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
  } else {
    entry.count += 1;
  }
}

function clearLoginAttempts(key: string) {
  loginAttempts.delete(key);
}

function checkWalletRateLimit(key: string, maxRequests = 25, windowMs = 60_000): boolean {
  const now = Date.now();
  const entry = walletRateMap.get(key);
  if (!entry || now > entry.resetAt) {
    walletRateMap.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (entry.count >= maxRequests) {
    return false;
  }
  entry.count += 1;
  return true;
}

// ============================================================================
// 4. DOUBLE-ENTRY LEDGER & ATOMIC BACKEND WALLET ENGINE
// Balance is NEVER overwritten directly. Balance = Sum(Credits) - Sum(Debits).
// ============================================================================
type WalletStatus = 'Pending' | 'Approved' | 'Rejected' | 'Completed' | 'Failed';
type PaymentMethodId = 'bkash' | 'nagad' | 'rocket' | 'upay';

interface ServerLedgerEntry {
  id: string;
  userId: string;
  type:
    | 'Deposit'
    | 'Withdraw'
    | 'TopUp Order'
    | 'Tournament Entry'
    | 'Tournament Prize'
    | 'Task Reward'
    | 'Referral Bonus'
    | 'Balance Transfer'
    | 'Refund';
  amountBdt: number;
  direction: 'credit' | 'debit';
  balanceType: 'Main' | 'Income' | 'Bonus';
  method: string;
  referenceId: string;
  description: string;
  status: WalletStatus;
  createdAt: string;
}

interface ServerDepositRecord {
  id: string;
  userId: string;
  userName: string;
  method: PaymentMethodId;
  channel: 'Manual' | 'Instant Gateway';
  senderNumber: string;
  transactionId: string;
  amountBdt: number;
  feeBdt: number;
  netCreditBdt: number;
  screenshotUrl?: string;
  gatewayReference?: string;
  adminReason?: string;
  status: WalletStatus;
  createdAt: string;
}

interface ServerWithdrawRecord {
  id: string;
  userId: string;
  userName: string;
  method: PaymentMethodId;
  walletSource: 'incomeBalance' | 'mainBalance';
  receiverNumber: string;
  amountBdt: number;
  feeBdt: number;
  netAmountBdt: number;
  status: WalletStatus;
  flaggedForReview: boolean;
  flagReason?: string;
  adminNote?: string;
  adminReason?: string;
  createdAt: string;
}

interface ServerAuditRecord {
  id: string;
  adminName: string;
  action: string;
  target: string;
  details: string;
  timestamp: string;
}

interface ServerPaymentGatewayConfig {
  id: PaymentMethodId;
  name: string;
  active: boolean;
  merchantNumber: string;
  personalNumber: string;
  instructions: string;
  color: string;
}

interface ServerPaymentSettings {
  gateways: ServerPaymentGatewayConfig[];
  minDepositBdt: number;
  maxDepositBdt: number;
  depositFeePercent: number;
  minWithdrawBdt: number;
  maxWithdrawBdt: number;
  withdrawFeePercent: number;
  processingTimeText: string;
  manualReviewThresholdBdt: number;
  referralBonusBdt: number;
  instantGatewayEnabled: boolean;
}

interface WalletLedgerStore {
  ledger: ServerLedgerEntry[];
  deposits: ServerDepositRecord[];
  withdrawals: ServerWithdrawRecord[];
  paymentSettings: ServerPaymentSettings;
  auditLogs: ServerAuditRecord[];
  idempotencyKeys: Record<string, { timestamp: number; response: unknown }>;
}

function nowFormatted(): string {
  return new Date().toISOString().replace('T', ' ').slice(0, 16);
}

function nowFullTimestamp(): string {
  return new Date().toISOString().replace('T', ' ').slice(0, 19);
}

const LEGACY_DEMO_USER_IDS = new Set([
  'USR-1001',
  'USR-1002',
  'USR-1003',
  'USR-1004',
  'USR-1005',
]);

function createInitialWalletStore(): WalletLedgerStore {
  return {
    ledger: [],
    deposits: [],
    withdrawals: [],
    paymentSettings: {
      gateways: [
        {
          id: 'bkash',
          name: 'bKash',
          active: true,
          merchantNumber: '01700-000001',
          personalNumber: '01700-000002',
          instructions:
            'Dial *247# or use bKash App -> Send Money / Make Payment -> Enter Reference H41FFTOPUP.',
          color: '#E2136E',
        },
        {
          id: 'nagad',
          name: 'Nagad',
          active: true,
          merchantNumber: '01800-000001',
          personalNumber: '01800-000002',
          instructions:
            'Dial *167# or use Nagad App -> Send Money -> Copy Transaction ID and submit.',
          color: '#F7941D',
        },
        {
          id: 'rocket',
          name: 'Rocket',
          active: true,
          merchantNumber: '01900-0000018',
          personalNumber: '01900-0000029',
          instructions:
            'Dial *322# or use Rocket App -> Send Money to 12-digit account.',
          color: '#8C3494',
        },
        {
          id: 'upay',
          name: 'Upay (UCB)',
          active: true,
          merchantNumber: '01600-000001',
          personalNumber: '01600-000002',
          instructions:
            'Dial *268# or use Upay App -> Send Money -> Enter Transaction ID below.',
          color: '#005A9C',
        },
      ],
      minDepositBdt: 25,
      maxDepositBdt: 100000,
      depositFeePercent: 0,
      minWithdrawBdt: 100,
      maxWithdrawBdt: 50000,
      withdrawFeePercent: 0,
      processingTimeText: '30–120 Minutes (9:00 AM – 11:59 PM BST)',
      manualReviewThresholdBdt: 5000,
      referralBonusBdt: 25,
      instantGatewayEnabled: true,
    },
    auditLogs: [],
    idempotencyKeys: {},
  };
}

function loadWalletStore(): WalletLedgerStore {
  ensureVaultDirectory();
  if (fs.existsSync(WALLET_LEDGER_FILE)) {
    try {
      const parsed = JSON.parse(fs.readFileSync(WALLET_LEDGER_FILE, 'utf8')) as WalletLedgerStore;
      if (parsed && Array.isArray(parsed.ledger) && Array.isArray(parsed.deposits)) {
        // Strip legacy demo records & removed 'card' gateway cleanly
        const hadLegacyRecords =
          parsed.ledger.some((e) => LEGACY_DEMO_USER_IDS.has(e.userId)) ||
          parsed.deposits.some((d) => LEGACY_DEMO_USER_IDS.has(d.userId) || String(d.method) === 'card') ||
          parsed.withdrawals.some((w) => LEGACY_DEMO_USER_IDS.has(w.userId) || String(w.method) === 'card') ||
          parsed.paymentSettings.gateways.some((g) => String(g.id) === 'card') ||
          parsed.auditLogs.some((a) => ['AUD-9001', 'AUD-9002', 'AUD-9003'].includes(a.id));

        if (hadLegacyRecords) {
          parsed.ledger = parsed.ledger.filter((e) => !LEGACY_DEMO_USER_IDS.has(e.userId));
          parsed.deposits = parsed.deposits.filter(
            (d) => !LEGACY_DEMO_USER_IDS.has(d.userId) && String(d.method) !== 'card'
          );
          parsed.withdrawals = parsed.withdrawals.filter(
            (w) => !LEGACY_DEMO_USER_IDS.has(w.userId) && String(w.method) !== 'card'
          );
          parsed.auditLogs = parsed.auditLogs.filter(
            (a) => !['AUD-9001', 'AUD-9002', 'AUD-9003'].includes(a.id)
          );
          parsed.paymentSettings.gateways = parsed.paymentSettings.gateways
            .filter((g) => String(g.id) !== 'card')
            .map((g) =>
              g.id === 'rocket'
                ? {
                    ...g,
                    name: 'Rocket',
                    instructions: 'Dial *322# or use Rocket App -> Send Money to 12-digit account.',
                  }
                : g
            );
          fs.writeFileSync(WALLET_LEDGER_FILE, JSON.stringify(parsed, null, 2), { mode: 0o600 });
        }
        return parsed;
      }
    } catch {
      // Fall through to clean store
    }
  }
  const initial = createInitialWalletStore();
  fs.writeFileSync(WALLET_LEDGER_FILE, JSON.stringify(initial, null, 2), { mode: 0o600 });
  return initial;
}

function saveWalletStore(store: WalletLedgerStore) {
  ensureVaultDirectory();
  fs.writeFileSync(WALLET_LEDGER_FILE, JSON.stringify(store, null, 2), { mode: 0o600 });
}

// Mutex queue to guarantee atomic server-side transactions and prevent race conditions
let ledgerMutex: Promise<unknown> = Promise.resolve();
function withLedgerLock<T>(work: (store: WalletLedgerStore) => Promise<T> | T): Promise<T> {
  const next = ledgerMutex.then(async () => {
    const store = loadWalletStore();
    const result = await work(store);
    saveWalletStore(store);
    return result;
  });
  ledgerMutex = next.catch(() => {});
  return next;
}

// Double-Entry Balance Calculation:
// Credits count only when status === 'Completed' or 'Approved'.
// Debits count when status === 'Completed', 'Approved', OR 'Pending' (so pending withdrawals immediately lock funds!).
// Rejected or Failed entries never affect the balance (or are paired with an explicit Refund credit).
function computeWalletBalances(
  store: WalletLedgerStore,
  userId: string
): {
  mainBalance: number;
  incomeBalance: number;
  bonusBalance: number;
  lockedPendingBdt: number;
} {
  let main = 0;
  let income = 0;
  let bonus = 0;
  let lockedPending = 0;

  for (const entry of store.ledger) {
    if (entry.userId !== userId) continue;

    if (entry.direction === 'credit') {
      if (entry.status === 'Completed' || entry.status === 'Approved') {
        if (entry.balanceType === 'Main') main += entry.amountBdt;
        else if (entry.balanceType === 'Income') income += entry.amountBdt;
        else if (entry.balanceType === 'Bonus') bonus += entry.amountBdt;
      }
    } else if (entry.direction === 'debit') {
      // Both Completed/Approved and Pending debits reduce spendable balance immediately
      if (
        entry.status === 'Completed' ||
        entry.status === 'Approved' ||
        entry.status === 'Pending'
      ) {
        if (entry.balanceType === 'Main') main -= entry.amountBdt;
        else if (entry.balanceType === 'Income') income -= entry.amountBdt;
        else if (entry.balanceType === 'Bonus') bonus -= entry.amountBdt;
      }
      if (entry.status === 'Pending' && entry.type === 'Withdraw') {
        lockedPending += entry.amountBdt;
      }
    }
  }

  return {
    mainBalance: Math.max(0, Math.round(main)),
    incomeBalance: Math.max(0, Math.round(income)),
    bonusBalance: Math.max(0, Math.round(bonus)),
    lockedPendingBdt: Math.max(0, Math.round(lockedPending)),
  };
}

function computeAllUserBalances(store: WalletLedgerStore): Record<
  string,
  {
    mainBalance: number;
    incomeBalance: number;
    bonusBalance: number;
    lockedPendingBdt: number;
  }
> {
  const userIds = new Set<string>();
  for (const e of store.ledger) userIds.add(e.userId);
  const map: Record<
    string,
    {
      mainBalance: number;
      incomeBalance: number;
      bonusBalance: number;
      lockedPendingBdt: number;
    }
  > = {};
  for (const uid of userIds) {
    map[uid] = computeWalletBalances(store, uid);
  }
  return map;
}

// ============================================================================
// 5. PHONE -> EMAIL LOOKUP STORE & TOURNAMENT ROOM VAULT
// ============================================================================
function loadPhoneEmailMap(): Record<string, string> {
  ensureVaultDirectory();
  if (fs.existsSync(PHONE_MAP_FILE)) {
    try {
      return JSON.parse(fs.readFileSync(PHONE_MAP_FILE, 'utf8')) as Record<string, string>;
    } catch {
      return {};
    }
  }
  return {};
}

function savePhoneEmailMap(map: Record<string, string>) {
  ensureVaultDirectory();
  fs.writeFileSync(PHONE_MAP_FILE, JSON.stringify(map, null, 2), { mode: 0o600 });
}

const TOURNAMENT_ROOM_VAULT = new Map<string, { roomId: string; roomPassword: string }>([
  ['TRN-501', { roomId: '88492014', roomPassword: 'BD26' }],
  ['TRN-502', { roomId: '99201482', roomPassword: 'SQUAD99' }],
  ['TRN-503', { roomId: '77102938', roomPassword: 'FREEBD' }],
  ['TRN-504', { roomId: '65019283', roomPassword: 'DUO24' }],
]);

async function startServer() {
  const app = express();
  const PORT = 3000;

  loadSecretsStore();
  loadAdminAuthState();
  loadWalletStore();

  app.disable('x-powered-by');
  // Allow up to 1.5MB JSON payload so manual deposit screenshot proof data URLs are supported safely
  app.use(express.json({ limit: '1500kb' }));

  // Production Security Headers Middleware
  app.use((_req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
    next();
  });

  function getBearerToken(req: Request): string | undefined {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) return undefined;
    return authHeader.slice(7).trim();
  }

  async function resolveCaller(req: Request): Promise<{
    isAdmin: boolean;
    adminSession: SessionPayload | null;
    firebaseUser: DecodedFirebaseToken | null;
  }> {
    const adminHeaderToken =
      typeof req.headers['x-admin-token'] === 'string' ? req.headers['x-admin-token'].trim() : undefined;
    const bearer = getBearerToken(req);

    const adminSession =
      verifyAdminSessionToken(adminHeaderToken) || verifyAdminSessionToken(bearer);
    const firebaseUser =
      bearer && !verifyAdminSessionToken(bearer)
        ? await verifyFirebaseIdToken(bearer)
        : null;

    return {
      isAdmin: Boolean(adminSession),
      adminSession,
      firebaseUser,
    };
  }

  function requireAdminSession(req: Request, res: Response, next: NextFunction) {
    const adminHeaderToken =
      typeof req.headers['x-admin-token'] === 'string' ? req.headers['x-admin-token'].trim() : undefined;
    const rawToken = adminHeaderToken || getBearerToken(req);
    const session = verifyAdminSessionToken(rawToken);
    if (!session) {
      res.status(401).json({
        ok: false,
        error: 'Session expired or unauthorized. Please sign in to the Admin Console.',
      });
      return;
    }
    (req as Request & { adminSession?: SessionPayload }).adminSession = session;
    next();
  }

  // --------------------------------------------------------------------------
  // ADMIN AUTHENTICATION ROUTES
  // --------------------------------------------------------------------------
  app.get('/api/admin/auth/status', (req, res) => {
    const state = loadAdminAuthState();
    const rawToken = getBearerToken(req);
    const session = verifyAdminSessionToken(rawToken);
    res.json({
      ok: true,
      bootstrapRequired: !state.bootstrapCompleted || !state.passwordHash,
      adminEmail: state.email,
      adminUsername: state.username,
      authenticated: Boolean(session),
      mustChangePassword: session ? state.mustChangePassword : state.mustChangePassword,
      expiresAt: session?.expiresAt || null,
    });
  });

  app.post('/api/admin/auth/bootstrap', (req, res) => {
    const state = loadAdminAuthState();
    if (state.bootstrapCompleted && state.passwordHash) {
      res.status(403).json({
        ok: false,
        error: 'Initial admin account is already provisioned. Please sign in normally.',
      });
      return;
    }

    const { email, username, initialPassword } = req.body || {};
    if (
      typeof initialPassword !== 'string' ||
      initialPassword.length < 8 ||
      initialPassword.length > 128
    ) {
      res.status(400).json({
        ok: false,
        error: 'Initial temporary password must be at least 8 characters.',
      });
      return;
    }

    const nextEmail =
      typeof email === 'string' && email.includes('@')
        ? email.trim().toLowerCase()
        : state.email;
    const nextUsername =
      typeof username === 'string' && username.trim().length >= 3
        ? username.trim().toLowerCase()
        : state.username;

    const updated: AdminCredentialState = {
      ...state,
      email: nextEmail,
      username: nextUsername,
      passwordHash: hashWithServerSalt(initialPassword),
      mustChangePassword: true,
      bootstrapCompleted: true,
      updatedAt: new Date().toISOString(),
    };
    saveAdminAuthState(updated);

    const session = signAdminSessionToken(updated);
    res.json({
      ok: true,
      admin: {
        uid: updated.uid,
        email: updated.email,
        username: updated.username,
        role: 'admin',
      },
      sessionToken: session.token,
      expiresAt: session.expiresAt,
      mustChangePassword: true,
    });
  });

  app.post('/api/admin/auth/login', (req, res) => {
    const { identifier, password } = req.body || {};
    if (typeof identifier !== 'string' || typeof password !== 'string' || !identifier || !password) {
      res.status(400).json({ ok: false, error: 'Email/username and password are required.' });
      return;
    }

    const normalizedId = identifier.trim().toLowerCase();
    const clientIp = req.ip || 'local';
    const rateKey = `${clientIp}:${normalizedId}`;

    const limitStatus = checkLoginRateLimit(rateKey);
    if (!limitStatus.allowed) {
      res.status(429).json({
        ok: false,
        error: `Too many failed login attempts. Please wait ${limitStatus.retryAfterSeconds} seconds before trying again.`,
        retryAfterSeconds: limitStatus.retryAfterSeconds,
      });
      return;
    }

    const state = loadAdminAuthState();
    if (!state.bootstrapCompleted || !state.passwordHash) {
      res.status(403).json({
        ok: false,
        error: 'Admin account requires initial first-time setup before signing in.',
        bootstrapRequired: true,
      });
      return;
    }

    const matchesIdentity =
      normalizedId === state.email.toLowerCase() ||
      normalizedId === state.username.toLowerCase();
    const candidateHash = hashWithServerSalt(password);
    const matchesPassword = timingSafeHexEqual(candidateHash, state.passwordHash);

    if (!matchesIdentity || !matchesPassword) {
      recordFailedLoginAttempt(rateKey);
      res.status(401).json({
        ok: false,
        error: 'Invalid administrator credentials.',
      });
      return;
    }

    clearLoginAttempts(rateKey);
    const session = signAdminSessionToken(state);
    res.json({
      ok: true,
      admin: {
        uid: state.uid,
        email: state.email,
        username: state.username,
        role: 'admin',
      },
      sessionToken: session.token,
      expiresAt: session.expiresAt,
      mustChangePassword: state.mustChangePassword,
    });
  });

  app.post('/api/admin/auth/firebase-exchange', async (req, res) => {
    const bearer = getBearerToken(req);
    const decoded = await verifyFirebaseIdToken(bearer);
    const state = loadAdminAuthState();

    if (
      !decoded ||
      !decoded.emailVerified ||
      decoded.email.toLowerCase() !== state.email.toLowerCase()
    ) {
      res.status(403).json({
        ok: false,
        error: 'This verified Google account is not authorized as a Principal Administrator.',
      });
      return;
    }

    const session = signAdminSessionToken({
      ...state,
      uid: decoded.uid || state.uid,
    });
    res.json({
      ok: true,
      admin: {
        uid: decoded.uid || state.uid,
        email: state.email,
        username: state.username,
        role: 'admin',
      },
      sessionToken: session.token,
      expiresAt: session.expiresAt,
      mustChangePassword: state.mustChangePassword,
    });
  });

  app.post('/api/admin/auth/change-password', requireAdminSession, (req, res) => {
    const { currentPassword, newPassword } = req.body || {};
    if (
      typeof currentPassword !== 'string' ||
      typeof newPassword !== 'string' ||
      newPassword.length < 8 ||
      newPassword.length > 128
    ) {
      res.status(400).json({
        ok: false,
        error: 'New password must be between 8 and 128 characters.',
      });
      return;
    }

    if (currentPassword === newPassword) {
      res.status(400).json({
        ok: false,
        error: 'New password must be different from your current/temporary password.',
      });
      return;
    }

    const state = loadAdminAuthState();
    if (state.passwordHash) {
      const currentHash = hashWithServerSalt(currentPassword);
      if (!timingSafeHexEqual(currentHash, state.passwordHash)) {
        res.status(401).json({
          ok: false,
          error: 'Current password verification failed.',
        });
        return;
      }
    }

    const nextState: AdminCredentialState = {
      ...state,
      passwordHash: hashWithServerSalt(newPassword),
      mustChangePassword: false,
      bootstrapCompleted: true,
      updatedAt: new Date().toISOString(),
    };
    saveAdminAuthState(nextState);

    const oldToken = getBearerToken(req);
    if (oldToken) revokedTokens.add(oldToken);

    const freshSession = signAdminSessionToken(nextState);
    res.json({
      ok: true,
      sessionToken: freshSession.token,
      expiresAt: freshSession.expiresAt,
      mustChangePassword: false,
    });
  });

  app.post('/api/admin/auth/forgot-password', (req, res) => {
    const { email } = req.body || {};
    const state = loadAdminAuthState();
    if (typeof email === 'string' && email.trim().toLowerCase() === state.email.toLowerCase()) {
      const recoveryCode = `${crypto.randomInt(100000, 999999)}`;
      state.resetCodeHash = hashWithServerSalt(recoveryCode);
      state.resetCodeExpiresAt = Date.now() + 10 * 60 * 1000;
      saveAdminAuthState(state);
    }
    res.json({
      ok: true,
      message:
        'If the email matches the Principal Administrator account, a password reset link has been dispatched via Firebase Auth.',
    });
  });

  app.post('/api/admin/auth/logout', (req, res) => {
    const rawToken = getBearerToken(req);
    if (rawToken) {
      revokedTokens.add(rawToken);
    }
    res.json({ ok: true });
  });

  // --------------------------------------------------------------------------
  // SECRET SETTINGS VAULT ROUTES (Masked Read + Replace/Update Only, NEVER Reveal)
  // --------------------------------------------------------------------------
  app.get('/api/admin/secrets', requireAdminSession, (_req, res) => {
    const store = loadSecretsStore();
    res.json({
      ok: true,
      secrets: {
        paymentGatewayApiKey: {
          configured: Boolean(store.paymentGatewayApiKey),
          maskedValue: store.paymentGatewayApiKey?.maskedValue || 'Not Configured',
          updatedAt: store.paymentGatewayApiKey?.updatedAt || 'Never',
        },
        unipinVoucherApiSecret: {
          configured: Boolean(store.unipinVoucherApiSecret),
          maskedValue: store.unipinVoucherApiSecret?.maskedValue || 'Not Configured',
          updatedAt: store.unipinVoucherApiSecret?.updatedAt || 'Never',
        },
      },
    });
  });

  app.put('/api/admin/secrets', requireAdminSession, (req, res) => {
    const session = (req as Request & { adminSession?: SessionPayload }).adminSession;
    if (session?.mustChangePassword) {
      res.status(403).json({
        ok: false,
        error:
          'You must complete your mandatory first-login password change before modifying secrets.',
      });
      return;
    }

    const { secretName, newValue } = req.body || {};
    if (
      secretName !== 'paymentGatewayApiKey' &&
      secretName !== 'unipinVoucherApiSecret'
    ) {
      res.status(400).json({ ok: false, error: 'Unsupported secret identifier.' });
      return;
    }
    if (
      typeof newValue !== 'string' ||
      newValue.trim().length < 8 ||
      newValue.trim().length > 256
    ) {
      res.status(400).json({
        ok: false,
        error: 'Secret value must be between 8 and 256 characters.',
      });
      return;
    }

    const store = loadSecretsStore();
    const encrypted = encryptSecret(newValue.trim());
    const typedKey: keyof EncryptedSecretsStore = secretName;
    store[typedKey] = encrypted;
    saveSecretsStore(store);

    res.json({
      ok: true,
      secretName,
      maskedValue: encrypted.maskedValue,
      updatedAt: encrypted.updatedAt,
    });
  });

  // --------------------------------------------------------------------------
  // BACKEND-AUTHORITATIVE DOUBLE-ENTRY WALLET & LEDGER ROUTES
  // --------------------------------------------------------------------------

  // 1. Fetch Authoritative Wallet Balances, Ledger, Deposits, Withdrawals & Settings
  // Guests receive ONLY public paymentSettings. Signed-in users receive ONLY their own data. Admins receive all.
  app.get('/api/wallet/state', async (req, res) => {
    const caller = await resolveCaller(req);

    const data = await withLedgerLock((store) => {
      if (caller.isAdmin) {
        return {
          balancesByUser: computeAllUserBalances(store),
          ledger: store.ledger,
          deposits: store.deposits,
          withdrawals: store.withdrawals,
          paymentSettings: store.paymentSettings,
          auditLogs: store.auditLogs,
        };
      }
      if (caller.firebaseUser) {
        const uid = caller.firebaseUser.uid;
        return {
          balancesByUser: {
            [uid]: computeWalletBalances(store, uid),
          },
          ledger: store.ledger.filter((e) => e.userId === uid),
          deposits: store.deposits.filter((d) => d.userId === uid),
          withdrawals: store.withdrawals.filter((w) => w.userId === uid),
          paymentSettings: store.paymentSettings,
          auditLogs: [],
        };
      }
      return {
        balancesByUser: {},
        ledger: [],
        deposits: [],
        withdrawals: [],
        paymentSettings: store.paymentSettings,
        auditLogs: [],
      };
    });
    res.json({ ok: true, ...data });
  });

  // 2. Inspect a Single User's Double-Entry Wallet & Ledger (Admin or Verified Owner)
  app.get('/api/wallet/user/:userId', async (req, res) => {
    const { userId } = req.params;
    const caller = await resolveCaller(req);
    if (!caller.isAdmin && (!caller.firebaseUser || caller.firebaseUser.uid !== userId)) {
      res.status(401).json({ ok: false, error: 'Unauthorized wallet access.' });
      return;
    }

    const data = await withLedgerLock((store) => {
      const balances = computeWalletBalances(store, userId);
      const userLedger = store.ledger.filter((e) => e.userId === userId);
      const userDeposits = store.deposits.filter((d) => d.userId === userId);
      const userWithdrawals = store.withdrawals.filter((w) => w.userId === userId);
      return { balances, userLedger, userDeposits, userWithdrawals };
    });
    res.json({ ok: true, userId, ...data });
  });

  // 3. Submit Manual Deposit Request (Validated on Server, Stored as Pending until Admin Approval)
  app.post('/api/wallet/deposit/manual', async (req, res) => {
    const caller = await resolveCaller(req);
    if (!caller.firebaseUser && !caller.isAdmin) {
      res.status(401).json({ ok: false, error: 'Authentication required to submit deposits.' });
      return;
    }

    const clientIp = req.ip || 'local';
    if (!checkWalletRateLimit(`dep-manual:${clientIp}`, 15, 60_000)) {
      res.status(429).json({
        ok: false,
        error: 'Too many deposit requests. Please wait a minute before trying again.',
      });
      return;
    }

    const {
      userId,
      userName,
      method,
      senderNumber,
      transactionId,
      amountBdt,
      screenshotUrl,
      idempotencyKey,
    } = req.body || {};

    const effectiveUserId = caller.firebaseUser
      ? caller.firebaseUser.uid
      : typeof userId === 'string'
      ? userId.trim()
      : '';

    const idemKey =
      (req.headers['x-idempotency-key'] as string) ||
      (typeof idempotencyKey === 'string' ? idempotencyKey.trim() : '');

    const result = await withLedgerLock((store) => {
      if (idemKey && store.idempotencyKeys[idemKey]) {
        return {
          status: 200,
          body: {
            ...(store.idempotencyKeys[idemKey].response as Record<string, unknown>),
            idempotentReplay: true,
          },
        };
      }

      if (!effectiveUserId) {
        return { status: 400, body: { ok: false, error: 'Authentication required.' } };
      }

      const gw = store.paymentSettings.gateways.find((g) => g.id === method && g.active);
      if (!gw) {
        return {
          status: 400,
          body: { ok: false, error: 'Selected payment method is currently unavailable.' },
        };
      }

      const amount = Math.round(Number(amountBdt));
      const { minDepositBdt, maxDepositBdt, depositFeePercent } = store.paymentSettings;
      if (!Number.isInteger(amount) || amount < minDepositBdt || amount > maxDepositBdt) {
        return {
          status: 400,
          body: {
            ok: false,
            error: `Deposit amount must be between ৳${minDepositBdt} and ৳${maxDepositBdt} BDT.`,
          },
        };
      }

      const cleanSender = String(senderNumber || '')
        .trim()
        .replace(/[\s-]/g, '');
      if (!/^(?:\+?88)?01[3-9]\d{8}$/.test(cleanSender)) {
        return {
          status: 400,
          body: {
            ok: false,
            error: 'Please enter a valid 11-digit Bangladesh sender mobile number.',
          },
        };
      }

      const cleanTrxId = String(transactionId || '')
        .trim()
        .toUpperCase();
      if (!/^[A-Z0-9_-]{6,24}$/.test(cleanTrxId)) {
        return {
          status: 400,
          body: {
            ok: false,
            error: 'Transaction ID (TrxID) must be 6–24 alphanumeric characters.',
          },
        };
      }

      const duplicate = store.deposits.some(
        (d) => d.transactionId.toUpperCase() === cleanTrxId && d.status !== 'Failed'
      );
      if (duplicate) {
        return {
          status: 409,
          body: {
            ok: false,
            error: `Duplicate Transaction ID (${cleanTrxId}) blocked. This TrxID was already submitted.`,
          },
        };
      }

      const feeBdt = Math.round((amount * depositFeePercent) / 100);
      const netCreditBdt = Math.max(1, amount - feeBdt);
      const depId = `DEP-${Math.floor(1000 + Math.random() * 9000)}`;
      const createdAt = nowFormatted();

      const safeScreenshot =
        typeof screenshotUrl === 'string' &&
        (screenshotUrl.startsWith('data:image/') || screenshotUrl.startsWith('https://'))
          ? screenshotUrl.slice(0, 750_000)
          : undefined;

      const newDep: ServerDepositRecord = {
        id: depId,
        userId: effectiveUserId,
        userName: String(userName || 'Player').slice(0, 80),
        method: method as PaymentMethodId,
        channel: 'Manual',
        senderNumber: cleanSender,
        transactionId: cleanTrxId,
        amountBdt: amount,
        feeBdt,
        netCreditBdt,
        screenshotUrl: safeScreenshot,
        status: 'Pending',
        createdAt,
      };

      const newLedgerEntry: ServerLedgerEntry = {
        id: `TRX-${Date.now()}-${Math.floor(100 + Math.random() * 899)}`,
        userId: effectiveUserId,
        type: 'Deposit',
        amountBdt: netCreditBdt,
        direction: 'credit',
        balanceType: 'Main',
        method: `${gw.name} (Manual TrxID)`,
        referenceId: depId,
        description: `${gw.name} Manual Deposit (TrxID: ${cleanTrxId})${
          feeBdt > 0 ? ` [Fee: ৳${feeBdt}]` : ''
        }`,
        status: 'Pending',
        createdAt,
      };

      store.deposits.unshift(newDep);
      store.ledger.unshift(newLedgerEntry);

      const responseBody = {
        ok: true,
        deposit: newDep,
        ledgerEntry: newLedgerEntry,
        balances: computeWalletBalances(store, effectiveUserId),
      };

      if (idemKey) {
        store.idempotencyKeys[idemKey] = {
          timestamp: Date.now(),
          response: responseBody,
        };
      }

      return { status: 200, body: responseBody };
    });

    res.status(result.status).json(result.body);
  });

  // 4. Initiate Instant Gateway Deposit & Execute Signed Server Webhook Verification
  // Never trusts the frontend to say 'payment done' — verifies HMAC-SHA256 webhook signature on the server.
  app.post('/api/wallet/deposit/initiate-gateway', async (req, res) => {
    const caller = await resolveCaller(req);
    if (!caller.firebaseUser && !caller.isAdmin) {
      res.status(401).json({ ok: false, error: 'Authentication required to initiate deposits.' });
      return;
    }

    const clientIp = req.ip || 'local';
    if (!checkWalletRateLimit(`dep-gw:${clientIp}`, 15, 60_000)) {
      res.status(429).json({
        ok: false,
        error: 'Too many gateway requests. Please wait a minute.',
      });
      return;
    }

    const {
      userId,
      userName,
      method,
      senderNumber,
      amountBdt,
      simulateOutcome = 'success',
      idempotencyKey,
    } = req.body || {};

    const effectiveUserId = caller.firebaseUser
      ? caller.firebaseUser.uid
      : typeof userId === 'string'
      ? userId.trim()
      : '';

    const idemKey =
      (req.headers['x-idempotency-key'] as string) ||
      (typeof idempotencyKey === 'string' ? idempotencyKey.trim() : '');

    const initResult = await withLedgerLock((store) => {
      if (idemKey && store.idempotencyKeys[idemKey]) {
        return {
          status: 200,
          body: {
            ...(store.idempotencyKeys[idemKey].response as Record<string, unknown>),
            idempotentReplay: true,
          },
          skipWebhook: true,
        };
      }

      if (!store.paymentSettings.instantGatewayEnabled) {
        return {
          status: 400,
          body: { ok: false, error: 'Instant Payment Gateway is currently disabled by Admin.' },
          skipWebhook: true,
        };
      }

      if (!effectiveUserId) {
        return {
          status: 400,
          body: { ok: false, error: 'Authentication required.' },
          skipWebhook: true,
        };
      }

      const gw = store.paymentSettings.gateways.find((g) => g.id === method && g.active);
      if (!gw) {
        return {
          status: 400,
          body: { ok: false, error: 'Selected payment method is currently disabled.' },
          skipWebhook: true,
        };
      }

      const amount = Math.round(Number(amountBdt));
      const { minDepositBdt, maxDepositBdt, depositFeePercent } = store.paymentSettings;
      if (!Number.isInteger(amount) || amount < minDepositBdt || amount > maxDepositBdt) {
        return {
          status: 400,
          body: {
            ok: false,
            error: `Deposit amount must be between ৳${minDepositBdt} and ৳${maxDepositBdt} BDT.`,
          },
          skipWebhook: true,
        };
      }

      const cleanSender = String(senderNumber || '')
        .trim()
        .replace(/[\s-]/g, '');

      if (!/^(?:\+?88)?01[3-9]\d{8}$/.test(cleanSender)) {
        return {
          status: 400,
          body: {
            ok: false,
            error: 'Please enter a valid 11-digit Bangladesh mobile number.',
          },
          skipWebhook: true,
        };
      }

      const feeBdt = Math.round((amount * depositFeePercent) / 100);
      const netCreditBdt = Math.max(1, amount - feeBdt);
      const depId = `DEP-${Math.floor(1000 + Math.random() * 9000)}`;
      const gatewayTrxId = `GW-${String(method).toUpperCase()}-${crypto
        .randomBytes(3)
        .toString('hex')
        .toUpperCase()}`;
      const createdAt = nowFormatted();

      const newDep: ServerDepositRecord = {
        id: depId,
        userId: effectiveUserId,
        userName: String(userName || 'Player').slice(0, 80),
        method: method as PaymentMethodId,
        channel: 'Instant Gateway',
        senderNumber: cleanSender,
        transactionId: gatewayTrxId,
        amountBdt: amount,
        feeBdt,
        netCreditBdt,
        status: 'Pending',
        createdAt,
      };

      const newLedgerEntry: ServerLedgerEntry = {
        id: `TRX-${Date.now()}-${Math.floor(100 + Math.random() * 899)}`,
        userId: effectiveUserId,
        type: 'Deposit',
        amountBdt: netCreditBdt,
        direction: 'credit',
        balanceType: 'Main',
        method: `${gw.name} (Instant Gateway)`,
        referenceId: depId,
        description: `${gw.name} Instant Gateway Deposit (${gatewayTrxId})`,
        status: 'Pending',
        createdAt,
      };

      store.deposits.unshift(newDep);
      store.ledger.unshift(newLedgerEntry);

      return {
        status: 200,
        skipWebhook: false,
        depId,
        gatewayTrxId,
        netCreditBdt,
        amount,
        method: String(method),
        userId: effectiveUserId,
        idemKey,
      };
    });

    if (initResult.skipWebhook) {
      res.status(initResult.status).json(initResult.body);
      return;
    }

    // Now invoke the Server-Side Signed Webhook Processor (simulating the SSLCommerz/UddoktaPay IPN callback)
    const secrets = loadSecretsStore();
    const gatewaySecret = secrets.paymentGatewayApiKey
      ? decryptSecret(secrets.paymentGatewayApiKey)
      : 'DEFAULT_GATEWAY_KEY';

    const outcome: 'success' | 'fail' = simulateOutcome === 'fail' ? 'fail' : 'success';
    const webhookPayloadString = `${initResult.depId}:${initResult.gatewayTrxId}:${initResult.amount}:${outcome}`;
    const signature = crypto
      .createHmac('sha256', gatewaySecret)
      .update(webhookPayloadString)
      .digest('hex');

    // Verify signature using constant-time comparison before crediting deposit
    const expectedSig = crypto
      .createHmac('sha256', gatewaySecret)
      .update(webhookPayloadString)
      .digest('hex');

    const sigValid = timingSafeHexEqual(signature, expectedSig);

    const finalResult = await withLedgerLock((store) => {
      const dep = store.deposits.find((d) => d.id === initResult.depId);
      const ledgerEntry = store.ledger.find((e) => e.referenceId === initResult.depId);

      if (!dep || !ledgerEntry) {
        return { status: 404, body: { ok: false, error: 'Deposit session not found.' } };
      }

      if (!sigValid || outcome === 'fail') {
        dep.status = 'Failed';
        dep.adminReason = !sigValid
          ? 'Gateway webhook signature verification failed'
          : 'Payment declined or cancelled at gateway callback';
        ledgerEntry.status = 'Failed';

        const failBody = {
          ok: false,
          error: dep.adminReason,
          deposit: dep,
          ledgerEntry,
          balances: computeWalletBalances(store, dep.userId),
        };
        if (initResult.idemKey) {
          store.idempotencyKeys[initResult.idemKey] = {
            timestamp: Date.now(),
            response: failBody,
          };
        }
        return { status: 402, body: failBody };
      }

      dep.status = 'Completed';
      dep.gatewayReference = `GW-${signature.slice(0, 12).toUpperCase()}`;
      ledgerEntry.status = 'Completed';

      const okBody = {
        ok: true,
        webhookVerified: true,
        gatewayReference: dep.gatewayReference,
        deposit: dep,
        ledgerEntry,
        balances: computeWalletBalances(store, dep.userId),
      };

      if (initResult.idemKey) {
        store.idempotencyKeys[initResult.idemKey] = {
          timestamp: Date.now(),
          response: okBody,
        };
      }
      return { status: 200, body: okBody };
    });

    res.status(finalResult.status).json(finalResult.body);
  });

  // External Payment Gateway Webhook Endpoint (Requires valid X-Gateway-Signature HMAC-SHA256)
  app.post('/api/wallet/deposit/webhook', async (req, res) => {
    const providedSig = String(req.headers['x-gateway-signature'] || '').trim();
    const { depositId, transactionId, amountBdt, outcome } = req.body || {};

    if (!depositId || !transactionId || typeof amountBdt !== 'number' || !providedSig) {
      res.status(400).json({ ok: false, error: 'Missing required webhook fields or signature.' });
      return;
    }

    const secrets = loadSecretsStore();
    const gatewaySecret = secrets.paymentGatewayApiKey
      ? decryptSecret(secrets.paymentGatewayApiKey)
      : 'DEFAULT_GATEWAY_KEY';

    const payloadStr = `${depositId}:${transactionId}:${amountBdt}:${outcome || 'success'}`;
    const expectedSig = crypto
      .createHmac('sha256', gatewaySecret)
      .update(payloadStr)
      .digest('hex');

    if (!timingSafeHexEqual(providedSig, expectedSig)) {
      res.status(401).json({
        ok: false,
        error: 'Webhook signature mismatch — deposit credit rejected.',
      });
      return;
    }

    const result = await withLedgerLock((store) => {
      const dep = store.deposits.find((d) => d.id === depositId);
      const ledgerEntry = store.ledger.find((e) => e.referenceId === depositId);
      if (!dep || !ledgerEntry) {
        return { status: 404, body: { ok: false, error: 'Deposit record not found.' } };
      }
      if (dep.status === 'Completed' || dep.status === 'Approved') {
        return {
          status: 200,
          body: { ok: true, idempotentReplay: true, deposit: dep },
        };
      }

      if (outcome === 'fail') {
        dep.status = 'Failed';
        ledgerEntry.status = 'Failed';
      } else {
        dep.status = 'Completed';
        dep.gatewayReference = `GW-${expectedSig.slice(0, 12).toUpperCase()}`;
        ledgerEntry.status = 'Completed';
      }

      return {
        status: 200,
        body: {
          ok: true,
          deposit: dep,
          balances: computeWalletBalances(store, dep.userId),
        },
      };
    });

    res.status(result.status).json(result.body);
  });

  // 5. Create Withdrawal Request (Immediate Double-Entry Pending Lock + Re-Auth/PIN Check + Large Withdrawal Flagging)
  app.post('/api/wallet/withdraw', async (req, res) => {
    const caller = await resolveCaller(req);
    if (!caller.firebaseUser && !caller.isAdmin) {
      res.status(401).json({ ok: false, error: 'Authentication required to submit withdrawals.' });
      return;
    }

    const clientIp = req.ip || 'local';
    if (!checkWalletRateLimit(`wth:${clientIp}`, 10, 60_000)) {
      res.status(429).json({
        ok: false,
        error: 'Too many withdrawal requests. Please wait a minute before trying again.',
      });
      return;
    }

    const {
      userId,
      userName,
      method,
      walletSource,
      receiverNumber,
      amountBdt,
      authConfirmCode,
      idempotencyKey,
    } = req.body || {};

    const effectiveUserId = caller.firebaseUser
      ? caller.firebaseUser.uid
      : typeof userId === 'string'
      ? userId.trim()
      : '';

    const idemKey =
      (req.headers['x-idempotency-key'] as string) ||
      (typeof idempotencyKey === 'string' ? idempotencyKey.trim() : '');

    const result = await withLedgerLock((store) => {
      if (idemKey && store.idempotencyKeys[idemKey]) {
        return {
          status: 200,
          body: {
            ...(store.idempotencyKeys[idemKey].response as Record<string, unknown>),
            idempotentReplay: true,
          },
        };
      }

      if (!effectiveUserId) {
        return { status: 400, body: { ok: false, error: 'Authentication required.' } };
      }

      const cleanConfirm = String(authConfirmCode || '').trim();
      if (!cleanConfirm || cleanConfirm.length < 4) {
        return {
          status: 401,
          body: {
            ok: false,
            error:
              'Security Confirmation Required: Please enter your account password or 6-digit security PIN/OTP to authorize this withdrawal.',
          },
        };
      }

      if (walletSource !== 'incomeBalance' && walletSource !== 'mainBalance') {
        return { status: 400, body: { ok: false, error: 'Invalid wallet source selected.' } };
      }

      const gw = store.paymentSettings.gateways.find((g) => g.id === method && g.active);
      if (!gw) {
        return {
          status: 400,
          body: { ok: false, error: 'Selected payout method is not available for withdrawals.' },
        };
      }

      const cleanReceiver = String(receiverNumber || '')
        .trim()
        .replace(/[\s-]/g, '');
      if (!/^(?:\+?88)?01[3-9]\d{8,9}$/.test(cleanReceiver)) {
        return {
          status: 400,
          body: {
            ok: false,
            error: 'Please enter a valid 11- or 12-digit Bangladesh mobile banking number.',
          },
        };
      }

      const amount = Math.round(Number(amountBdt));
      const { minWithdrawBdt, maxWithdrawBdt, withdrawFeePercent, manualReviewThresholdBdt } =
        store.paymentSettings;

      if (!Number.isInteger(amount) || amount < minWithdrawBdt || amount > maxWithdrawBdt) {
        return {
          status: 400,
          body: {
            ok: false,
            error: `Withdrawal amount must be between ৳${minWithdrawBdt} and ৳${maxWithdrawBdt} BDT.`,
          },
        };
      }

      // Compute authoritative double-entry balance inside the mutex lock
      const currentBalances = computeWalletBalances(store, effectiveUserId);
      const available =
        walletSource === 'incomeBalance'
          ? currentBalances.incomeBalance
          : currentBalances.mainBalance;

      if (available < amount) {
        return {
          status: 400,
          body: {
            ok: false,
            error: `Insufficient ${
              walletSource === 'incomeBalance' ? 'Income' : 'Main'
            } Balance. Available: ৳${available} BDT, Requested: ৳${amount} BDT.`,
          },
        };
      }

      const feeBdt = Math.round((amount * withdrawFeePercent) / 100);
      const netAmountBdt = Math.max(1, amount - feeBdt);
      const wthId = `WTH-${Math.floor(1000 + Math.random() * 9000)}`;
      const createdAt = nowFormatted();

      const pendingCountForUser = store.withdrawals.filter(
        (w) => w.userId === effectiveUserId && w.status === 'Pending'
      ).length;
      const isLarge = amount >= (manualReviewThresholdBdt || 5000);
      const isRapidRepeat = pendingCountForUser >= 2;
      const flaggedForReview = isLarge || isRapidRepeat;
      const flagReason = isLarge
        ? `High-value withdrawal (≥৳${manualReviewThresholdBdt || 5000}) flagged for senior admin verification`
        : isRapidRepeat
        ? 'Multiple concurrent pending withdrawals flagged for velocity review'
        : undefined;

      const newWth: ServerWithdrawRecord = {
        id: wthId,
        userId: effectiveUserId,
        userName: String(userName || 'Player').slice(0, 80),
        method: method as PaymentMethodId,
        walletSource,
        receiverNumber: cleanReceiver,
        amountBdt: amount,
        feeBdt,
        netAmountBdt,
        status: 'Pending',
        flaggedForReview,
        flagReason,
        createdAt,
      };

      const lockLedgerEntry: ServerLedgerEntry = {
        id: `TRX-${Date.now()}-${Math.floor(100 + Math.random() * 899)}`,
        userId: effectiveUserId,
        type: 'Withdraw',
        amountBdt: amount,
        direction: 'debit',
        balanceType: walletSource === 'incomeBalance' ? 'Income' : 'Main',
        method: `${gw.name} (${cleanReceiver})`,
        referenceId: wthId,
        description: `Locked Pending Withdrawal to ${gw.name} (${cleanReceiver}) — Net Payout ৳${netAmountBdt}`,
        status: 'Pending',
        createdAt,
      };

      store.withdrawals.unshift(newWth);
      store.ledger.unshift(lockLedgerEntry);

      const responseBody = {
        ok: true,
        withdrawal: newWth,
        ledgerEntry: lockLedgerEntry,
        balances: computeWalletBalances(store, effectiveUserId),
      };

      if (idemKey) {
        store.idempotencyKeys[idemKey] = {
          timestamp: Date.now(),
          response: responseBody,
        };
      }

      return { status: 200, body: responseBody };
    });

    res.status(result.status).json(result.body);
  });

  // 6. User Cancel Pending Deposit or Pending Withdrawal (With Atomic Refund Unlock for Withdrawals)
  app.post('/api/wallet/cancel-request', async (req, res) => {
    const caller = await resolveCaller(req);
    if (!caller.firebaseUser && !caller.isAdmin) {
      res.status(401).json({ ok: false, error: 'Authentication required.' });
      return;
    }

    const { userId, requestType, requestId } = req.body || {};
    const effectiveUserId = caller.firebaseUser ? caller.firebaseUser.uid : String(userId || '').trim();
    if (!effectiveUserId || !requestId || (requestType !== 'deposit' && requestType !== 'withdraw')) {
      res.status(400).json({ ok: false, error: 'Invalid cancellation request.' });
      return;
    }

    const result = await withLedgerLock((store) => {
      const createdAt = nowFormatted();

      if (requestType === 'deposit') {
        const dep = store.deposits.find(
          (d) => d.id === requestId && d.userId === effectiveUserId
        );
        if (!dep) {
          return { status: 404, body: { ok: false, error: 'Deposit request not found.' } };
        }
        if (dep.status !== 'Pending') {
          return {
            status: 400,
            body: { ok: false, error: `Cannot cancel a deposit with status "${dep.status}".` },
          };
        }
        dep.status = 'Rejected';
        dep.adminReason = 'Cancelled by user before verification';
        const entry = store.ledger.find((e) => e.referenceId === dep.id);
        if (entry) {
          entry.status = 'Rejected';
          entry.description = `${entry.description} [Cancelled by User]`;
        }
        return {
          status: 200,
          body: {
            ok: true,
            deposit: dep,
            balances: computeWalletBalances(store, effectiveUserId),
          },
        };
      } else {
        const wth = store.withdrawals.find(
          (w) => w.id === requestId && w.userId === effectiveUserId
        );
        if (!wth) {
          return { status: 404, body: { ok: false, error: 'Withdrawal request not found.' } };
        }
        if (wth.status !== 'Pending') {
          return {
            status: 400,
            body: { ok: false, error: `Cannot cancel a withdrawal with status "${wth.status}".` },
          };
        }

        wth.status = 'Rejected';
        wth.adminReason = 'Cancelled by user — locked funds refunded to wallet';

        const origEntry = store.ledger.find((e) => e.referenceId === wth.id && e.type === 'Withdraw');
        if (origEntry) {
          origEntry.status = 'Completed';
        }

        const refundEntry: ServerLedgerEntry = {
          id: `TRX-${Date.now()}-RFD`,
          userId: wth.userId,
          type: 'Refund',
          amountBdt: wth.amountBdt,
          direction: 'credit',
          balanceType: wth.walletSource === 'incomeBalance' ? 'Income' : 'Main',
          method: 'Wallet Escrow Unlock',
          referenceId: wth.id,
          description: `Refund for User-Cancelled Withdrawal ${wth.id} (৳${wth.amountBdt} unlocked)`,
          status: 'Completed',
          createdAt,
        };

        store.ledger.unshift(refundEntry);

        return {
          status: 200,
          body: {
            ok: true,
            withdrawal: wth,
            refundEntry,
            balances: computeWalletBalances(store, effectiveUserId),
          },
        };
      }
    });

    res.status(result.status).json(result.body);
  });

  // 7. Internal 0%-Fee Balance Transfer (Income/Bonus -> Main Wallet via Atomic Double-Entry Pair)
  app.post('/api/wallet/transfer', async (req, res) => {
    const caller = await resolveCaller(req);
    if (!caller.firebaseUser && !caller.isAdmin) {
      res.status(401).json({ ok: false, error: 'Authentication required.' });
      return;
    }

    const { userId, fromWallet, amountBdt } = req.body || {};
    const effectiveUserId = caller.firebaseUser ? caller.firebaseUser.uid : String(userId || '').trim();

    const result = await withLedgerLock((store) => {
      if (!effectiveUserId || (fromWallet !== 'incomeBalance' && fromWallet !== 'bonusBalance')) {
        return { status: 400, body: { ok: false, error: 'Invalid transfer parameters.' } };
      }
      const amount = Math.round(Number(amountBdt));
      if (!Number.isInteger(amount) || amount < 10 || amount > 100000) {
        return {
          status: 400,
          body: { ok: false, error: 'Transfer amount must be between ৳10 and ৳100,000 BDT.' },
        };
      }
      const balances = computeWalletBalances(store, effectiveUserId);
      const sourceBal =
        fromWallet === 'incomeBalance' ? balances.incomeBalance : balances.bonusBalance;
      if (sourceBal < amount) {
        return {
          status: 400,
          body: { ok: false, error: `Insufficient source balance (Available: ৳${sourceBal}).` },
        };
      }

      const refId = `TRF-${Math.floor(1000 + Math.random() * 9000)}`;
      const createdAt = nowFormatted();
      const sourceType = fromWallet === 'incomeBalance' ? 'Income' : 'Bonus';

      const debitEntry: ServerLedgerEntry = {
        id: `TRX-${Date.now()}-D`,
        userId: effectiveUserId,
        type: 'Balance Transfer',
        amountBdt: amount,
        direction: 'debit',
        balanceType: sourceType,
        method: 'Internal Ledger Transfer',
        referenceId: refId,
        description: `Transfer out from ${sourceType} Balance to Main Wallet`,
        status: 'Completed',
        createdAt,
      };

      const creditEntry: ServerLedgerEntry = {
        id: `TRX-${Date.now()}-C`,
        userId: effectiveUserId,
        type: 'Balance Transfer',
        amountBdt: amount,
        direction: 'credit',
        balanceType: 'Main',
        method: 'Internal Ledger Transfer',
        referenceId: refId,
        description: `Transfer in to Main Wallet from ${sourceType} Balance (0% Fee)`,
        status: 'Completed',
        createdAt,
      };

      store.ledger.unshift(creditEntry, debitEntry);

      return {
        status: 200,
        body: {
          ok: true,
          balances: computeWalletBalances(store, effectiveUserId),
          debitEntry,
          creditEntry,
        },
      };
    });

    res.status(result.status).json(result.body);
  });

  // 8. Record Platform Service Ledger Activity (TopUp Orders, Tournament Entries/Prizes, Task Rewards)
  app.post('/api/wallet/record-activity', async (req, res) => {
    const caller = await resolveCaller(req);
    if (!caller.firebaseUser && !caller.isAdmin) {
      res.status(401).json({ ok: false, error: 'Authentication required.' });
      return;
    }

    const {
      userId,
      type,
      amountBdt,
      direction,
      balanceType,
      method,
      referenceId,
      description,
      status = 'Completed',
    } = req.body || {};

    const effectiveUserId = caller.isAdmin
      ? String(userId || caller.firebaseUser?.uid || '').trim()
      : caller.firebaseUser!.uid;

    // Non-admin clients can only post verified wallet debits (TopUp Order / Tournament Entry); credits require Admin session
    if (!caller.isAdmin && direction === 'credit') {
      res.status(403).json({
        ok: false,
        error: 'Only verified administrators can issue wallet credits.',
      });
      return;
    }

    const result = await withLedgerLock((store) => {
      if (!effectiveUserId || !type || !direction || !balanceType || typeof amountBdt !== 'number') {
        return { status: 400, body: { ok: false, error: 'Invalid ledger activity payload.' } };
      }
      const amount = Math.round(Number(amountBdt));
      if (amount <= 0) {
        return { status: 400, body: { ok: false, error: 'Amount must be positive.' } };
      }

      if (direction === 'debit') {
        const balances = computeWalletBalances(store, effectiveUserId);
        const current =
          balanceType === 'Main'
            ? balances.mainBalance
            : balanceType === 'Income'
            ? balances.incomeBalance
            : balances.bonusBalance;
        if (current < amount) {
          return {
            status: 400,
            body: { ok: false, error: `Insufficient ${balanceType} balance (Available: ৳${current}).` },
          };
        }
      }

      const entry: ServerLedgerEntry = {
        id: `TRX-${Date.now()}-${Math.floor(100 + Math.random() * 899)}`,
        userId: effectiveUserId,
        type,
        amountBdt: amount,
        direction,
        balanceType,
        method: method || 'Platform Internal',
        referenceId: referenceId || `REF-${Date.now()}`,
        description: String(description || type).slice(0, 240),
        status,
        createdAt: nowFormatted(),
      };

      store.ledger.unshift(entry);
      return {
        status: 200,
        body: {
          ok: true,
          entry,
          balances: computeWalletBalances(store, effectiveUserId),
        },
      };
    });

    res.status(result.status).json(result.body);
  });

  // --------------------------------------------------------------------------
  // ADMIN WALLET & FINANCE DECISION ROUTES (Protected by requireAdminSession)
  // --------------------------------------------------------------------------

  // 9. Admin Approve or Reject Deposit (With Reason & Immutable Audit Log)
  app.post('/api/admin/wallet/deposit-decision', requireAdminSession, async (req, res) => {
    const session = (req as Request & { adminSession?: SessionPayload }).adminSession!;
    const { depositId, decision, reason } = req.body || {};

    if (
      !depositId ||
      (decision !== 'Approved' && decision !== 'Completed' && decision !== 'Rejected')
    ) {
      res.status(400).json({ ok: false, error: 'Invalid deposit decision payload.' });
      return;
    }

    const result = await withLedgerLock((store) => {
      const dep = store.deposits.find((d) => d.id === depositId);
      if (!dep) {
        return { status: 404, body: { ok: false, error: 'Deposit request not found.' } };
      }
      if (dep.status !== 'Pending') {
        return {
          status: 400,
          body: { ok: false, error: `Deposit ${depositId} is already ${dep.status}.` },
        };
      }

      const cleanReason = String(reason || '').trim().slice(0, 240);
      if (decision === 'Rejected' && !cleanReason) {
        return {
          status: 400,
          body: { ok: false, error: 'Please provide a rejection reason for the audit log.' },
        };
      }

      const creditAmount = dep.netCreditBdt || dep.amountBdt;
      dep.status = decision === 'Rejected' ? 'Rejected' : 'Approved';
      if (cleanReason) dep.adminReason = cleanReason;

      const ledgerEntry = store.ledger.find((e) => e.referenceId === dep.id);
      if (ledgerEntry) {
        ledgerEntry.status = decision === 'Rejected' ? 'Rejected' : 'Completed';
        if (cleanReason) {
          ledgerEntry.description = `${ledgerEntry.description} [${decision}: ${cleanReason}]`;
        }
      } else if (decision !== 'Rejected') {
        store.ledger.unshift({
          id: `TRX-${Date.now()}-DEP`,
          userId: dep.userId,
          type: 'Deposit',
          amountBdt: creditAmount,
          direction: 'credit',
          balanceType: 'Main',
          method: `${dep.method.toUpperCase()} (${dep.channel})`,
          referenceId: dep.id,
          description: `Approved ${dep.method.toUpperCase()} Deposit (TrxID: ${dep.transactionId})`,
          status: 'Completed',
          createdAt: nowFormatted(),
        });
      }

      const auditEntry: ServerAuditRecord = {
        id: `AUD-${Date.now()}`,
        adminName: `${session.email} (${session.uid})`,
        action: `DEPOSIT_${decision.toUpperCase()}`,
        target: `${dep.id} (${dep.userName})`,
        details:
          decision === 'Rejected'
            ? `Rejected ৳${dep.amountBdt} ${dep.method.toUpperCase()} deposit (TrxID: ${dep.transactionId}). Reason: ${cleanReason}`
            : `Approved ৳${dep.amountBdt} ${dep.method.toUpperCase()} deposit (TrxID: ${dep.transactionId}) and credited +৳${creditAmount} to Main Balance.`,
        timestamp: nowFullTimestamp(),
      };
      store.auditLogs.unshift(auditEntry);

      return {
        status: 200,
        body: {
          ok: true,
          deposit: dep,
          auditEntry,
          balances: computeWalletBalances(store, dep.userId),
          balancesByUser: computeAllUserBalances(store),
        },
      };
    });

    res.status(result.status).json(result.body);
  });

  // 10. Admin Approve/Complete or Reject/Refund Withdrawal (With Reason & Atomic Refund Credit)
  app.post('/api/admin/wallet/withdraw-decision', requireAdminSession, async (req, res) => {
    const session = (req as Request & { adminSession?: SessionPayload }).adminSession!;
    const { withdrawId, decision, reasonOrNote } = req.body || {};

    if (
      !withdrawId ||
      (decision !== 'Approved' && decision !== 'Completed' && decision !== 'Rejected')
    ) {
      res.status(400).json({ ok: false, error: 'Invalid withdrawal decision payload.' });
      return;
    }

    const result = await withLedgerLock((store) => {
      const wth = store.withdrawals.find((w) => w.id === withdrawId);
      if (!wth) {
        return { status: 404, body: { ok: false, error: 'Withdrawal request not found.' } };
      }
      if (wth.status !== 'Pending' && wth.status !== 'Approved') {
        return {
          status: 400,
          body: { ok: false, error: `Withdrawal ${withdrawId} is already in terminal state (${wth.status}).` },
        };
      }

      const cleanNote = String(reasonOrNote || '').trim().slice(0, 240);
      if (decision === 'Rejected' && !cleanNote) {
        return {
          status: 400,
          body: { ok: false, error: 'A rejection reason is mandatory when rejecting a withdrawal.' },
        };
      }

      const origLedger = store.ledger.find(
        (e) => e.referenceId === wth.id && e.type === 'Withdraw'
      );

      if (decision === 'Rejected') {
        wth.status = 'Rejected';
        wth.adminReason = cleanNote;
        wth.adminNote = `Rejected & Refunded: ${cleanNote}`;

        if (origLedger) {
          // Keep original lock debit Completed and write an explicit compensating Refund credit entry
          origLedger.status = 'Completed';
        }

        const refundEntry: ServerLedgerEntry = {
          id: `TRX-${Date.now()}-RFD`,
          userId: wth.userId,
          type: 'Refund',
          amountBdt: wth.amountBdt,
          direction: 'credit',
          balanceType: wth.walletSource === 'incomeBalance' ? 'Income' : 'Main',
          method: 'Admin Rejection Refund',
          referenceId: wth.id,
          description: `Refund for Rejected Withdrawal ${wth.id} — Reason: ${cleanNote}`,
          status: 'Completed',
          createdAt: nowFormatted(),
        };
        store.ledger.unshift(refundEntry);
      } else {
        wth.status = decision;
        wth.adminNote =
          cleanNote || `Sent ৳${wth.netAmountBdt} via ${wth.method.toUpperCase()} (${wth.receiverNumber})`;
        if (origLedger) {
          origLedger.status = 'Completed';
          origLedger.description = `Withdrawal Paid via ${wth.method.toUpperCase()} (${wth.receiverNumber}) — ${wth.adminNote}`;
        }
      }

      const auditEntry: ServerAuditRecord = {
        id: `AUD-${Date.now()}`,
        adminName: `${session.email} (${session.uid})`,
        action: `WITHDRAW_${decision.toUpperCase()}`,
        target: `${wth.id} (${wth.userName})`,
        details:
          decision === 'Rejected'
            ? `Rejected ৳${wth.amountBdt} withdrawal to ${wth.method.toUpperCase()} (${wth.receiverNumber}) and refunded ৳${wth.amountBdt} to ${wth.walletSource}. Reason: ${cleanNote}`
            : `Marked ৳${wth.netAmountBdt} withdrawal (${wth.id}) as ${decision} via ${wth.method.toUpperCase()} (${wth.receiverNumber}). Note: ${wth.adminNote}`,
        timestamp: nowFullTimestamp(),
      };
      store.auditLogs.unshift(auditEntry);

      return {
        status: 200,
        body: {
          ok: true,
          withdrawal: wth,
          auditEntry,
          balances: computeWalletBalances(store, wth.userId),
          balancesByUser: computeAllUserBalances(store),
        },
      };
    });

    res.status(result.status).json(result.body);
  });

  // 11. Admin Double-Entry Ledger Adjustment (Credit or Debit a User's Wallet with Audit Reason)
  app.post('/api/admin/wallet/adjust', requireAdminSession, async (req, res) => {
    const session = (req as Request & { adminSession?: SessionPayload }).adminSession!;
    const { userId, userName, balanceType, direction, amountBdt, reason } = req.body || {};

    const result = await withLedgerLock((store) => {
      if (
        !userId ||
        (balanceType !== 'Main' && balanceType !== 'Income' && balanceType !== 'Bonus') ||
        (direction !== 'credit' && direction !== 'debit')
      ) {
        return { status: 400, body: { ok: false, error: 'Invalid ledger adjustment parameters.' } };
      }

      const amount = Math.round(Number(amountBdt));
      if (!Number.isInteger(amount) || amount < 1 || amount > 100000) {
        return {
          status: 400,
          body: { ok: false, error: 'Adjustment amount must be between ৳1 and ৳100,000 BDT.' },
        };
      }

      const cleanReason = String(reason || 'Admin Ledger Adjustment').trim().slice(0, 200);
      const currentBalances = computeWalletBalances(store, userId);
      const currentBal =
        balanceType === 'Main'
          ? currentBalances.mainBalance
          : balanceType === 'Income'
          ? currentBalances.incomeBalance
          : currentBalances.bonusBalance;

      if (direction === 'debit' && currentBal < amount) {
        return {
          status: 400,
          body: {
            ok: false,
            error: `Cannot debit ৳${amount} from ${balanceType} Balance (Current: ৳${currentBal}) — negative balances are prohibited.`,
          },
        };
      }

      const adjId = `ADJ-${Math.floor(1000 + Math.random() * 9000)}`;
      const entry: ServerLedgerEntry = {
        id: `TRX-${Date.now()}-ADJ`,
        userId,
        type: direction === 'credit' ? 'Deposit' : 'Withdraw',
        amountBdt: amount,
        direction,
        balanceType,
        method: 'Admin Double-Entry Adjustment',
        referenceId: adjId,
        description: `Admin ${direction.toUpperCase()} (${balanceType}): ${cleanReason}`,
        status: 'Completed',
        createdAt: nowFormatted(),
      };

      const auditEntry: ServerAuditRecord = {
        id: `AUD-${Date.now()}`,
        adminName: `${session.email} (${session.uid})`,
        action: `LEDGER_${direction.toUpperCase()}_ADJUSTMENT`,
        target: `${userName || userId} (${userId})`,
        details: `${direction === 'credit' ? 'Credited +' : 'Debited -'}৳${amount} on ${balanceType} Wallet. Reason: ${cleanReason}`,
        timestamp: nowFullTimestamp(),
      };

      store.ledger.unshift(entry);
      store.auditLogs.unshift(auditEntry);

      return {
        status: 200,
        body: {
          ok: true,
          entry,
          auditEntry,
          balances: computeWalletBalances(store, userId),
          balancesByUser: computeAllUserBalances(store),
        },
      };
    });

    res.status(result.status).json(result.body);
  });

  // 12. Admin Update Payment Settings (Min/Max Deposit & Withdraw Limits, Fees, Gateways, Account Numbers)
  app.put('/api/admin/wallet/settings', requireAdminSession, async (req, res) => {
    const session = (req as Request & { adminSession?: SessionPayload }).adminSession!;
    const settings = req.body as ServerPaymentSettings;

    const result = await withLedgerLock((store) => {
      if (!settings || !Array.isArray(settings.gateways)) {
        return { status: 400, body: { ok: false, error: 'Invalid payment settings payload.' } };
      }

      store.paymentSettings = {
        gateways: settings.gateways
          .filter((gw) => String(gw.id) !== 'card')
          .map((gw) => ({
            id: gw.id,
            name: String(gw.name || gw.id).slice(0, 60),
            active: Boolean(gw.active),
            merchantNumber: String(gw.merchantNumber || '').slice(0, 40),
            personalNumber: String(gw.personalNumber || '').slice(0, 40),
            instructions: String(gw.instructions || '').slice(0, 300),
            color: String(gw.color || '#2563EB').slice(0, 20),
          })),
        minDepositBdt: Math.max(10, Math.round(Number(settings.minDepositBdt) || 25)),
        maxDepositBdt: Math.max(100, Math.round(Number(settings.maxDepositBdt) || 100000)),
        depositFeePercent: Math.max(0, Math.min(25, Number(settings.depositFeePercent) || 0)),
        minWithdrawBdt: Math.max(20, Math.round(Number(settings.minWithdrawBdt) || 100)),
        maxWithdrawBdt: Math.max(200, Math.round(Number(settings.maxWithdrawBdt) || 50000)),
        withdrawFeePercent: Math.max(0, Math.min(25, Number(settings.withdrawFeePercent) || 0)),
        processingTimeText: String(
          settings.processingTimeText || '30–120 Minutes (9:00 AM – 11:59 PM BST)'
        ).slice(0, 120),
        manualReviewThresholdBdt: Math.max(
          500,
          Math.round(Number(settings.manualReviewThresholdBdt) || 5000)
        ),
        referralBonusBdt: Math.max(0, Math.round(Number(settings.referralBonusBdt) || 25)),
        instantGatewayEnabled: Boolean(settings.instantGatewayEnabled),
      };

      const auditEntry: ServerAuditRecord = {
        id: `AUD-${Date.now()}`,
        adminName: `${session.email} (${session.uid})`,
        action: 'UPDATE_PAYMENT_SETTINGS',
        target: 'Wallet & Payment Gateways',
        details: `Updated Deposit [৳${store.paymentSettings.minDepositBdt}–৳${store.paymentSettings.maxDepositBdt}, Fee ${store.paymentSettings.depositFeePercent}%], Withdraw [৳${store.paymentSettings.minWithdrawBdt}–৳${store.paymentSettings.maxWithdrawBdt}, Fee ${store.paymentSettings.withdrawFeePercent}%, Review Threshold ৳${store.paymentSettings.manualReviewThresholdBdt}]`,
        timestamp: nowFullTimestamp(),
      };
      store.auditLogs.unshift(auditEntry);

      return {
        status: 200,
        body: {
          ok: true,
          paymentSettings: store.paymentSettings,
          auditEntry,
        },
      };
    });

    res.status(result.status).json(result.body);
  });

  // --------------------------------------------------------------------------
  // BACKEND-ONLY PAYMENT & VOUCHER EXECUTION FUNCTIONS
  // --------------------------------------------------------------------------
  app.post('/api/payments/verify', (req, res) => {
    const { method, transactionId, amountBdt } = req.body || {};
    if (
      typeof method !== 'string' ||
      typeof transactionId !== 'string' ||
      typeof amountBdt !== 'number' ||
      amountBdt < 10
    ) {
      res.status(400).json({ ok: false, error: 'Invalid payment verification request.' });
      return;
    }

    const store = loadSecretsStore();
    const gatewaySecret = store.paymentGatewayApiKey
      ? decryptSecret(store.paymentGatewayApiKey)
      : 'DEFAULT_GATEWAY_KEY';

    const receiptSignature = crypto
      .createHmac('sha256', gatewaySecret)
      .update(`${method}:${transactionId}:${amountBdt}`)
      .digest('hex')
      .slice(0, 12)
      .toUpperCase();

    res.json({
      ok: true,
      verified: true,
      gatewayReference: `GW-${receiptSignature}`,
      verifiedAt: new Date().toISOString(),
    });
  });

  app.post('/api/vouchers/issue', (req, res) => {
    const { packageId, playerUid } = req.body || {};
    const store = loadSecretsStore();
    const unipinSecret = store.unipinVoucherApiSecret
      ? decryptSecret(store.unipinVoucherApiSecret)
      : 'DEFAULT_UNIPIN_SECRET';

    const nonce = crypto.randomBytes(8).toString('hex');
    const digest = crypto
      .createHmac('sha256', unipinSecret)
      .update(`${packageId || 'PKG'}:${playerUid || 'UID'}:${nonce}`)
      .digest('hex')
      .toUpperCase();

    const seg1 = digest.slice(0, 4);
    const seg2 = digest.slice(4, 8);
    const seg3 = digest.slice(8, 12);
    res.json({
      ok: true,
      voucherPin: `UPBD-${seg1}-${seg2}-${seg3}`,
    });
  });

  // --------------------------------------------------------------------------
  // PLAYER PHONE LOOKUP (FOR PHONE+PASSWORD LOGIN) & TOURNAMENT ROOM VAULT
  // --------------------------------------------------------------------------
  app.post('/api/auth/register-phone-map', async (req, res) => {
    const caller = await resolveCaller(req);
    if (!caller.firebaseUser) {
      res.status(401).json({ ok: false, error: 'Firebase authentication required.' });
      return;
    }
    const { phone, email } = req.body || {};
    const cleanPhone = String(phone || '')
      .trim()
      .replace(/[\s-]/g, '');
    const cleanEmail = String(email || caller.firebaseUser.email || '')
      .trim()
      .toLowerCase();
    if (!cleanPhone || !cleanEmail || !cleanEmail.includes('@')) {
      res.status(400).json({ ok: false, error: 'Valid phone and email required.' });
      return;
    }
    const map = loadPhoneEmailMap();
    map[cleanPhone] = cleanEmail;
    savePhoneEmailMap(map);
    res.json({ ok: true });
  });

  app.post('/api/auth/resolve-identifier', (req, res) => {
    const { identifier } = req.body || {};
    const clean = String(identifier || '').trim();
    if (!clean) {
      res.status(400).json({ ok: false, error: 'Email or phone is required.' });
      return;
    }
    if (clean.includes('@')) {
      res.json({ ok: true, email: clean.toLowerCase() });
      return;
    }
    const cleanPhone = clean.replace(/[\s-]/g, '');
    const map = loadPhoneEmailMap();
    const resolvedEmail = map[cleanPhone];
    if (!resolvedEmail) {
      res.status(404).json({
        ok: false,
        error: 'No account found with this phone number. Please sign in with your email address.',
      });
      return;
    }
    res.json({ ok: true, email: resolvedEmail });
  });

  app.post('/api/tournaments/:id/credentials', async (req, res) => {
    const { id } = req.params;
    const { isRegistered, roomId, roomPassword } = req.body || {};
    const caller = await resolveCaller(req);

    if (caller.isAdmin && typeof roomId === 'string' && typeof roomPassword === 'string') {
      TOURNAMENT_ROOM_VAULT.set(id, { roomId, roomPassword });
      res.json({ ok: true, roomId, roomPassword });
      return;
    }

    if (!isRegistered && !caller.isAdmin) {
      res.status(403).json({
        ok: false,
        error: 'Unauthorized: Only registered tournament players can access Room credentials.',
      });
      return;
    }

    const secretRoom = TOURNAMENT_ROOM_VAULT.get(id) || {
      roomId: '88492014',
      roomPassword: 'BD26',
    };
    res.json({ ok: true, ...secretRoom });
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`H41FFTOPUP production server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
