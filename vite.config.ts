import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

// ============================================================================
// VITE CONFIGURATION — cPanel Static Hosting & GitHub Actions Ready
// ============================================================================
// - Default base path is '/' for deploying to a domain root (public_html/).
// - To deploy inside a subfolder (e.g. https://yourdomain.com/subfolder/),
//   set VITE_BASE_PATH=/subfolder/ in your environment or GitHub Actions
//   Variables before running `npm run build`.
// ============================================================================
export default defineConfig(() => {
  const basePath = process.env.VITE_BASE_PATH || '/';

  return {
    base: basePath.endsWith('/') ? basePath : `${basePath}/`,
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      emptyOutDir: true,
      sourcemap: false,
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});

