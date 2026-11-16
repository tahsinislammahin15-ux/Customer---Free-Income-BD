# Zero-Trust Security Specification (`security_spec.md`)

## 1. Data Invariants
1. **Default Deny**: Every path not explicitly matched under `/databases/{database}/documents` is unconditionally denied (`allow read, write: if false`).
2. **Server-Only Secret Isolation**: `/vault_secrets/{secretId}` is strictly denied (`allow read, write: if false`) for all client SDK connections, including authenticated users and admins. Secret writes/reads happen exclusively on the server side (`server.ts`) via AES-256-GCM encryption.
3. **Database-Enforced Admin RBAC**: Admin privileges (`isAdmin()`) require an authenticated session with `request.auth.token.email_verified == true` AND either:
   - Bootstrapped Principal Admin email (`tahsinislammahin15@gmail.com`), OR
   - Existence of a verified admin record at `/databases/$(database)/documents/admins/$(request.auth.uid)`.
4. **Validated Public URLs**: `/settings/public` is publicly readable (`get`), but writes (`create`, `update`) require `isAdmin()`, strict key allowlisting (`hasOnly`), string length bounds, `^https?://.+` regex checks on all 5 URLs (`siteUrl`, `mapEmbedUrl`, `facebookUrl`, `telegramUrl`, `whatsappUrl`), and server timestamp integrity (`updatedAt == request.time`).
5. **Immutable Audit Logs**: `/audit_logs/{logId}` allows `create` and `read` only by `isAdmin()`, and strictly forbids `update` and `delete` (`allow update, delete: if false`) so audit history can never be tampered with.

---

## 2. The "Dirty Dozen" Adversarial Payloads
1. **Payload 1 (Unauthenticated Public Settings Tampering)**: Anonymous user attempts to overwrite `/settings/public` with a phishing `siteUrl`. -> `PERMISSION_DENIED`.
2. **Payload 2 (Non-Admin Authenticated Settings Write)**: Standard verified user (`user@example.com`) attempts to update `/settings/public`. -> `PERMISSION_DENIED`.
3. **Payload 3 (Unverified Email Spoof Attack)**: Attacker registers `tahsinislammahin15@gmail.com` with `email_verified: false` and attempts to write to `/settings/public`. -> `PERMISSION_DENIED`.
4. **Payload 4 (JavaScript URI Injection in Public Settings)**: Admin attempts to save `facebookUrl: "javascript:alert(1)"` in `/settings/public`. -> `PERMISSION_DENIED` (fails `^https?://.+` regex).
5. **Payload 5 (Shadow Field Injection on Public Settings)**: Admin attempts to write `{ ...validSettings, "secretApiKey": "leak" }` to `/settings/public`. -> `PERMISSION_DENIED` (fails `hasOnly()`).
6. **Payload 6 (Client SDK Read of Secret Vault)**: Admin attempts `getDoc(doc(db, 'vault_secrets', 'paymentGatewayApiKey'))` from the browser. -> `PERMISSION_DENIED`.
7. **Payload 7 (Client SDK Write to Secret Vault)**: Admin attempts `setDoc(doc(db, 'vault_secrets', 'unipinVoucherApiSecret'), ...)` from the browser. -> `PERMISSION_DENIED`.
8. **Payload 8 (Self-Assigned Admin Privilege Escalation)**: Normal user attempts to create `/admins/{theirUid}` with `role: "admin"`. -> `PERMISSION_DENIED`.
9. **Payload 9 (Audit Log Deletion / Tampering)**: Admin attempts to `deleteDoc` or `updateDoc` an entry in `/audit_logs/{logId}`. -> `PERMISSION_DENIED`.
10. **Payload 10 (Forged Client Timestamp on Settings Update)**: Admin sends `updatedAt` set to a past or future timestamp instead of `serverTimestamp()` (`request.time`). -> `PERMISSION_DENIED`.
11. **Payload 11 (Denial-of-Wallet Oversized String Attack)**: Admin sends a 10,000-character string in `siteName` (max 80 chars). -> `PERMISSION_DENIED`.
12. **Payload 12 (ID Poisoning Attack on Catalog)**: Admin attempts to create a catalog item with a 300-character document ID containing special characters. -> `PERMISSION_DENIED` (fails `isValidId()`).
