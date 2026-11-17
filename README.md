# H41FFTOPUP — Instant Free Fire Top Up, Esports & Rewards Platform

Production-ready multi-page web application for **H41FFTOPUP** (Free Fire UID & UniPin Diamond Top Up, Weekly & Monthly VIP Memberships, Moderated Esports Tournaments, Verified Task Rewards, BDT Wallet Ledger, and Admin Console).

---

## 1. Tech Stack & Build Detection

| Property | Value |
| :--- | :--- |
| **Framework** | Vite 8 + React 19 + TypeScript + React Router v7 + Tailwind CSS v4 |
| **Database & Auth** | Firebase Authentication + Cloud Firestore |
| **Install Command** | `npm install` |
| **Typecheck / Lint** | `npm run lint` (`tsc --noEmit`) |
| **Production Build Command** | `npm run build` (`vite build`) |
| **Static Output Folder** | `dist/` (100% static files ready for cPanel `public_html`) |

---

## 2. Local Development Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/<your-username>/<your-repo>.git
   cd <your-repo>
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` if you want to customize optional public URLs or local development settings. Never commit `.env` to Git.

4. **Start the development server (port 3000):**
   ```bash
   npm run dev
   ```

5. **Test the production static build locally:**
   ```bash
   npm run build
   npm run preview
   ```
   The compiled static site is generated inside the `dist/` folder, including `dist/index.html`, `dist/assets/*`, `dist/.htaccess`, and `dist/.cpanel.yml`.

---

## 3. Domain Root vs. Subfolder Deployment (`VITE_BASE_PATH`)

- **Domain Root (`https://yourdomain.com/`) — Default:**
  - Leave `VITE_BASE_PATH` unset (or set to `/`).
  - `public/.htaccess` uses `RewriteBase /`.
- **Subfolder (`https://yourdomain.com/subfolder/`):**
  1. Set `VITE_BASE_PATH=/subfolder/` in GitHub Actions **Settings → Secrets and variables → Actions → Variables** (or in `.env` when building locally).
  2. In `public/.htaccess`, change `RewriteBase /` to `RewriteBase /subfolder/`.

---

## 4. Three Switchable cPanel Deployment Options

The GitHub Actions workflow (`.github/workflows/deploy.yml`) runs automatically on every push to `main` and supports three cleanly separated deployment methods:

### Option A — Build Artifact ZIP (Enabled by default)
- After every push to `main`, GitHub Actions compiles `dist/` and packages its contents (including `.htaccess`) into `cpanel-public_html-build.zip`.
- Download the artifact from **GitHub → Actions → Latest Workflow Run → Artifacts (`cpanel-public_html-build`)**, upload it to cPanel **File Manager → `public_html/`**, and click **Extract**.
- *Switch on/off*: Controlled by repo variable `ENABLE_ARTIFACT_UPLOAD` (defaults to `true`; set to `false` to disable).

### Option B — `deploy` Branch + cPanel Git™ Version Control (Enabled by default)
- After every build, GitHub Actions force-pushes **only** the built contents of `dist/` (including `.htaccess` and `.cpanel.yml`) to the `deploy` branch.
- In **cPanel → Git™ Version Control**, clone your repository with the checked-out branch set to `deploy`. Whenever you click **Update from Remote** and **Deploy HEAD Commit** (or use a cPanel webhook), `.cpanel.yml` automatically copies all built files and `.htaccess` into `/home/$USER/public_html/`.
- *Switch on/off*: Controlled by repo variable `ENABLE_DEPLOY_BRANCH` (defaults to `true`; set to `false` to disable).

### Option C — Automatic FTPS Push to cPanel (Disabled by default)
- Automatically uploads the built `dist/` directory to your cPanel server over encrypted FTPS on every push to `main`.
- *How to enable*:
  1. Go to **GitHub → Settings → Secrets and variables → Actions → Secrets** and add:
     - `FTP_SERVER` (e.g. `ftp.yourdomain.com`)
     - `FTP_USERNAME` (e.g. `deployer@yourdomain.com`)
     - `FTP_PASSWORD` (your FTP account password)
     - `FTP_DIR` (e.g. `/public_html/` or `/` if the FTP user is already rooted at `public_html`)
  2. Go to **Variables** tab and add `ENABLE_FTPS_DEPLOY` = `true`.

---

## 5. Security Architecture

- **Zero Client Secrets**: No payment gateway secret, UniPin secret, or private key is ever placed in frontend code or `VITE_*` variables.
- **Apache Hardening (`public/.htaccess`)**: Enforces HTTPS 301 redirect, SPA routing fallback (`index.html`), Gzip/Deflate compression, 1-year immutable caching for hashed `/assets/*`, `no-cache` revalidation for `index.html`, dotfile blocking, and strict security headers (`X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`, `Strict-Transport-Security`).
- **Firestore Security Rules (`firestore.rules`)**: Enforces role-based admin access (`/admins/{uid}`) and schema validation directly at the database layer.
