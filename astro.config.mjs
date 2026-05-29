// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  // User/org GitHub Pages site -> served from the domain root, no base path.
  site: 'https://rileymccuen.github.io',
  vite: {
    plugins: [tailwindcss()]
  },
  integrations: [sitemap()]
});
