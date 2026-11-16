/**
 * Firestore Security Rules Specification Test Suite (Dirty Dozen Verification)
 * Verifies that all 12 adversarial payloads defined in security_spec.md return PERMISSION_DENIED.
 */

export interface DirtyDozenTestCase {
  id: number;
  name: string;
  collectionPath: string;
  operation: 'get' | 'list' | 'create' | 'update' | 'delete';
  auth: { uid: string; email: string; email_verified: boolean } | null;
  payload?: Record<string, unknown>;
  expectedResult: 'PERMISSION_DENIED' | 'ALLOWED';
}

export const DIRTY_DOZEN_TEST_CASES: DirtyDozenTestCase[] = [
  {
    id: 1,
    name: 'Unauthenticated Public Settings Tampering',
    collectionPath: 'settings/public',
    operation: 'update',
    auth: null,
    payload: { siteName: 'Hacked' },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 2,
    name: 'Non-Admin Authenticated Settings Write',
    collectionPath: 'settings/public',
    operation: 'update',
    auth: { uid: 'u1', email: 'player@gmail.com', email_verified: true },
    payload: { siteName: 'Hacked' },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 3,
    name: 'Unverified Admin Email Spoof Attack',
    collectionPath: 'settings/public',
    operation: 'update',
    auth: { uid: 'admin1', email: 'tahsinislammahin15@gmail.com', email_verified: false },
    payload: { siteName: 'Spoofed' },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 4,
    name: 'JavaScript URI Injection in Public Settings',
    collectionPath: 'settings/public',
    operation: 'create',
    auth: { uid: 'admin1', email: 'tahsinislammahin15@gmail.com', email_verified: true },
    payload: { facebookUrl: 'javascript:alert(1)' },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 5,
    name: 'Shadow Field Injection on Public Settings',
    collectionPath: 'settings/public',
    operation: 'create',
    auth: { uid: 'admin1', email: 'tahsinislammahin15@gmail.com', email_verified: true },
    payload: { siteName: 'Free Income BD', ghostAdminField: true },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 6,
    name: 'Client SDK Read of Secret Vault',
    collectionPath: 'vault_secrets/paymentGatewayApiKey',
    operation: 'get',
    auth: { uid: 'admin1', email: 'tahsinislammahin15@gmail.com', email_verified: true },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 7,
    name: 'Client SDK Write to Secret Vault',
    collectionPath: 'vault_secrets/unipinVoucherApiSecret',
    operation: 'create',
    auth: { uid: 'admin1', email: 'tahsinislammahin15@gmail.com', email_verified: true },
    payload: { secretId: 'unipinVoucherApiSecret', ciphertext: 'abc12345678901234' },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 8,
    name: 'Self-Assigned Admin Privilege Escalation',
    collectionPath: 'admins/u1',
    operation: 'create',
    auth: { uid: 'u1', email: 'player@gmail.com', email_verified: true },
    payload: { uid: 'u1', email: 'player@gmail.com', role: 'admin', mustChangePassword: false },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 9,
    name: 'Audit Log Deletion Tampering',
    collectionPath: 'audit_logs/AUD-1001',
    operation: 'delete',
    auth: { uid: 'admin1', email: 'tahsinislammahin15@gmail.com', email_verified: true },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 10,
    name: 'Forged Client Timestamp on Settings Update',
    collectionPath: 'settings/public',
    operation: 'update',
    auth: { uid: 'admin1', email: 'tahsinislammahin15@gmail.com', email_verified: true },
    payload: { updatedAt: '2099-01-01T00:00:00Z' },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 11,
    name: 'Denial-of-Wallet Oversized String Attack',
    collectionPath: 'settings/public',
    operation: 'update',
    auth: { uid: 'admin1', email: 'tahsinislammahin15@gmail.com', email_verified: true },
    payload: { siteName: 'A'.repeat(1000) },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 12,
    name: 'ID Poisoning Attack on Catalog',
    collectionPath: 'catalog/INVALID$ID#WITH!SPECIAL*CHARS',
    operation: 'create',
    auth: { uid: 'admin1', email: 'tahsinislammahin15@gmail.com', email_verified: true },
    payload: { id: 'INVALID$ID#WITH!SPECIAL*CHARS', category: 'topup', title: 'Test', priceOrRewardBdt: 100, active: true },
    expectedResult: 'PERMISSION_DENIED',
  },
];
