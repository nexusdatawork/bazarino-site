// src/pages/robots.txt.ts
import type { APIRoute } from "astro";

/**
 * Robots padrão: permite indexação e aponta o sitemap.
 */
export const GET: APIRoute = async ({ site }) => {
  const sitemapUrl = site ? new URL("/sitemap.xml", site).toString() : "/sitemap.xml";

  return new Response(
    `User-agent: *\nAllow: /\n\nSitemap: ${sitemapUrl}\n`,
    {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    }
  );
};
