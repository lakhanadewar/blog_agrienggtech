// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// Static site: Vercel detects Astro and serves dist/ with no adapter needed.
export default defineConfig({
	site: 'https://blog.agriengg.tech',
	integrations: [mdx(), sitemap()],
	vite: {
		plugins: [tailwindcss()],
	},
});
