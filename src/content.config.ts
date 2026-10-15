import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const posts = defineCollection({
	loader: glob({ base: './src/content/posts', pattern: '**/*.{md,mdx}' }),
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string(),
			pubDate: z.coerce.date(),
			updatedDate: z.coerce.date().optional(),
			author: z.string().default('agriengg.tech'),
			category: z.string().default('Article'),
			tags: z.array(z.string()).default([]),
			// Local image (./cover.jpg next to the post) or a remote URL.
			heroImage: z.union([image(), z.string().url()]).optional(),
			heroAlt: z.string().default(''),
			// For posts first published elsewhere (Medium): search engines are told the original is canonical.
			canonicalURL: z.string().url().optional(),
			originalURL: z.string().url().optional(),
			draft: z.boolean().default(false),
		}),
});

export const collections = { posts };
