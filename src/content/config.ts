// src/content/config.ts
import { defineCollection, z } from "astro:content";

/**
 * Collection do Blog.
 * Serve para validar o frontmatter dos .md gerados pelo n8n
 * e impedir builds quebrados por campos faltando/formato errado.
 */
const blog = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    author: z.string().default("O Bazarino"),
    image: z.string().optional(), // URL de imagem (OG)
    canonical: z.string().url().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };
