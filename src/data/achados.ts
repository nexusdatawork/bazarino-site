// src/data/achados.ts
import legacy from "./achados-editions.json";
import type { AchadosEdition } from "./achadosEditions";

type JsonModule = { default: unknown };

// NOVO: src/data/achados/*.json (um arquivo por dia/edição)
const dailyModules = import.meta.glob<unknown>("./achados/*.json", { eager: true });

function asEditions(value: unknown): AchadosEdition[] {
  if (!value) return [];
  const v = (value as JsonModule).default ?? value;
  if (Array.isArray(v)) return v as AchadosEdition[];
  return [v as AchadosEdition];
}

const editions: AchadosEdition[] = [
  ...asEditions(legacy),
  ...Object.values(dailyModules).flatMap((m) => asEditions(m)),
];

export type Achado = {
  id: string;
  title: string;
  category: string;
  store: string;
  price: number;
  oldPrice?: number | null;
  image?: string | null;
  href: string;
  score?: number | null;
  date?: string | null;
  reason?: string | null;
};

function extractItems(): Achado[] {
  const result: Achado[] = [];

  for (const edition of editions) {
    const date = edition.date;

    for (const item of edition.items ?? []) {
      const it: any = item;
      result.push({
        id: it.id,
        title: it.name,
        category: it.category,
        store: it.vendor,
        price: it.price,
        oldPrice: it.oldPrice ?? null,
        image: it.image ?? null,
        href: it.affiliateUrl,
        score: it.score ?? null,
        date,
        reason: it.reason ?? null,
      });
    }
  }

  return result;
}

export const achados: Achado[] = extractItems();

export function getLatestAchados(limit = 6): Achado[] {
  return [...achados]
    .sort((a, b) => (b.date ? new Date(b.date).getTime() : 0) - (a.date ? new Date(a.date).getTime() : 0))
    .slice(0, limit);
}

export function getAchadosByCategory(category: string, limit?: number): Achado[] {
  const filtered = achados.filter((a) => a.category === category);
  return typeof limit === "number" ? filtered.slice(0, limit) : filtered;
}
