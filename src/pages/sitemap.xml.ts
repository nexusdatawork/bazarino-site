// src/pages/sitemap.xml.ts
import type { APIRoute } from "astro";
import { getCollection } from "astro:content";

// Ajuste estes imports para bater com os exports reais do seu projeto.
// Pelo seu cenário, isso deve existir no src/lib/achadosSource.ts:
import {
  listDailyEditions,       // deve retornar lista com .date ("YYYY-MM-DD")
  listCategoriesForDate,   // recebe date e retorna string[]
  listAllCategories,       // retorna string[]
} from "../lib/achadosSource";

/**
 * Cria um bloco <url> do sitemap.
 * lastmod é opcional (mas recomendado).
 */
function xmlUrl(loc: string, lastmod?: string): string {
  return `<url><loc>${loc}</loc>${lastmod ? `<lastmod>${lastmod}</lastmod>` : ""}</url>`;
}

/**
 * Converte "YYYY-MM-DD" para partes usadas na rota /achados/[ano]/[mes]/[dia]
 */
function splitDate(date: string): { ano: string; mes: string; dia: string } {
  const [ano, mes, dia] = date.split("-");
  return { ano, mes, dia };
}

export const GET: APIRoute = async ({ site }) => {
  // site vem do astro.config.mjs. Se não existir, sitemap não consegue URLs absolutas.
  if (!site) return new Response("Missing site in astro.config", { status: 500 });

  const urls: string[] = [];

  // -------------------------
  // BLOG
  // -------------------------
  urls.push(xmlUrl(new URL("/blog/", site).toString()));

  const posts = (await getCollection("blog")).filter((p) => !p.data.draft);
  for (const p of posts) {
    const loc = new URL(`/blog/${p.slug}/`, site).toString();
    const lastmod = (p.data.updatedDate ?? p.data.pubDate).toISOString().slice(0, 10);
    urls.push(xmlUrl(loc, lastmod));
  }

  // -------------------------
  // ACHADOS
  // -------------------------
  urls.push(xmlUrl(new URL("/achados/", site).toString()));

  // Aqui NÃO usamos year/month/day do objeto. Usamos `date` ("YYYY-MM-DD") e derivamos.
  const daily = await listDailyEditions();

  for (const ed of daily) {
    // ed.date precisa existir
    const date = (ed as any).date as string;
    if (!date) continue;

    const { ano, mes, dia } = splitDate(date);

    // /achados/YYYY/MM/DD
    urls.push(xmlUrl(new URL(`/achados/${ano}/${mes}/${dia}/`, site).toString(), date));

    // /achados/YYYY/MM/DD/<categoria> (somente as categorias que existem naquele dia)
    const cats = await listCategoriesForDate(date);
    for (const c of cats) {
      urls.push(xmlUrl(new URL(`/achados/${ano}/${mes}/${dia}/${c}/`, site).toString(), date));
    }
  }

  // /achados/categoria/<categoria>
  const allCats = await listAllCategories();
  for (const c of allCats) {
    urls.push(xmlUrl(new URL(`/achados/categoria/${c}/`, site).toString()));
  }

  // Monta XML final
  const body =
    `<?xml version="1.0" encoding="UTF-8"?>` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">` +
    urls.join("") +
    `</urlset>`;

  return new Response(body, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
};
