import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
	loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string(),
			pubDate: z.coerce.date(),
			updatedDate: z.coerce.date().optional(),
			heroImage: z.optional(image()),
			// alt text for heroImage; omit (or leave empty) for decorative images
			heroImageAlt: z.string().optional(),
			category: z.enum(['tech', 'travel', 'essay', 'event']).default('tech'),
		}),
});

const projects = defineCollection({
	loader: glob({ base: './src/content/projects', pattern: '**/*.{md,mdx}' }),
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string(),
			startDate: z.coerce.date(),
			endDate: z.coerce.date().optional(),
			status: z.enum(['active', 'archived', 'experiment']).default('active'),
			repo: z.string().url().optional(),
			url: z.string().url().optional(),
			tags: z.array(z.string()).default([]),
			heroImage: z.optional(image()),
		}),
});

export const collections = { blog, projects };
