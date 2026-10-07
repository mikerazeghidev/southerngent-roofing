// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import seoDashboard from './integrations/seo-dashboard.mjs';

// https://astro.build/config
export default defineConfig({
  site: 'https://www.southerngentroofing.com',
  // "file" keeps clean URLs: /roof-repair -> dist/roof-repair.html (Cloudflare serves it at /roof-repair).
  build: { format: 'file' },
  trailingSlash: 'never',
  compressHTML: false,
  integrations: [
    sitemap({ filter: (page) => !/\/(seo|404)$/.test(page) && !/\/lp\//.test(page) }),
    seoDashboard(),
  ],
});
