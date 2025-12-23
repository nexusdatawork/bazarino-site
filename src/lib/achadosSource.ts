import type { AchadosEdition } from "@/data/achadosEditions";

/**
 * ✅ Achados Source (v5)
 *
 * Suporta dois formatos ao mesmo tempo:
 * 1) LEGADO: src/data/achados-editions.json (um arquivo grande)
 * 2) NOVO:   src/data/achados/*.json       (um arquivo por dia/edição)  ← recomendado
 *
 * Isso permite migrar sem quebrar rotas antigas e sem depender de "índice".
 */

// LEGADO (mantemos compatível)
import legacyRaw from "@/data/achados-editions.json";

type JsonModule = { default: unknown };

// NOVO (um arquivo por dia/edição)
const dailyModules = import.meta.glob<unknown>("@/data/achados/*.json", { eager: true });

/**
 * Correção/normalização de categoria:
 * - garante slug (minúsculo, hífen)
 * - permite mapear nomes variados do n8n para uma categoria canônica
 *
 * O n8n pode (e deve) tentar classificar "certo" na origem,
 * mas aqui a gente garante consistência no site.
 */
const CATEGORY_ALIASES: Record<string, string> = {
  // exemplos (adicione conforme precisar)
  "casa e cozinha": "casa-e-cozinha",
  "casa/cozinha": "casa-e-cozinha",
  "cozinha": "casa-e-cozinha",
  "eletro": "eletronicos",
  "eletrônicos": "eletronicos",
};

function toSlug(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .replace(/--+/g, "-");
}

function normalizeCategory(cat: unknown): string {
  const raw = typeof cat === "string" ? cat.trim() : "";
  if (!raw) return "";
  const k = raw.toLowerCase().trim();
  const aliased = CATEGORY_ALIASES[k] ?? raw;
  return toSlug(aliased);
}

function asEditions(value: unknown): AchadosEdition[] {
  if (!value) return [];
  const v = (value as JsonModule).default ?? value;
  if (Array.isArray(v)) return v as AchadosEdition[];
  return [v as AchadosEdition];
}

function loadAllEditions(): AchadosEdition[] {
  const legacy = asEditions(legacyRaw);
  const daily = Object.values(dailyModules).flatMap((m) => asEditions(m));

  // normaliza categorias nos itens (e também em e.category quando existir)
  const normalized = [...legacy, ...daily].map((e) => {
    const copy: any = { ...e };
    if (copy.category) copy.category = normalizeCategory(copy.category);
    copy.items = (copy.items ?? []).map((it: any) => ({
      ...it,
      category: normalizeCategory(it.category),
    }));
    return copy as AchadosEdition;
  });

  // merge simples (evita duplicar por chave)
  const map = new Map<string, AchadosEdition>();
  for (const e of normalized) {
    const key = `${e.date}::${e.type}::${(e as any).category ?? ""}`;
    map.set(key, e);
  }
  return [...map.values()];
}

const editions = loadAllEditions();

function sortDescByDate(a: AchadosEdition, b: AchadosEdition) {
  return new Date(b.date).getTime() - new Date(a.date).getTime();
}

export function listDailyEditions(): AchadosEdition[] {
  return editions.filter((e) => e.type === "daily").sort(sortDescByDate);
}

export function listCategoryEditions(category: string): AchadosEdition[] {
  const c = normalizeCategory(category);
  return editions
    .filter((e) => e.type === "category" && normalizeCategory((e as any).category) === c)
    .sort(sortDescByDate);
}

export function getDailyEditionByDate(date: string): AchadosEdition | undefined {
  return editions.find((e) => e.type === "daily" && e.date === date);
}

export function getCategoryEditionByDate(date: string, category: string): AchadosEdition | undefined {
  const c = normalizeCategory(category);
  return editions.find((e) => e.type === "category" && e.date === date && normalizeCategory((e as any).category) === c);
}

/** ✅ Compat: usado por rotas antigas */
export function listAvailableDates(): string[] {
  return listDailyDates();
}

/** Datas com edições diárias */
export function listDailyDates(): string[] {
  const set = new Set<string>();
  for (const e of editions) if (e.type === "daily") set.add(e.date);
  return [...set].sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
}

/** ✅ Compat: sua rota /achados/categoria/[categoria] espera isso */
export function listAllCategories(): string[] {
  const set = new Set<string>();

  for (const ed of editions) {
    // categoria declarada na edição
    if ((ed as any).category) set.add(normalizeCategory((ed as any).category));

    // categorias dentro dos itens
    for (const item of (ed.items ?? []) as any[]) {
      const cat = normalizeCategory(item?.category);
      if (cat) set.add(cat);
    }
  }

  return [...set].filter(Boolean).sort();
}

/** Categorias mais frequentes nos itens */
export function listCategoriesByFrequency(limit = 12): Array<{ slug: string; count: number }> {
  const counts = new Map<string, number>();
  for (const e of editions) {
    for (const item of e.items ?? []) {
      const cat = normalizeCategory((item as any).category);
      if (!cat) continue;
      counts.set(cat, (counts.get(cat) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .map(([slug, count]) => ({ slug, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

/** Rotas reais (data + categoria) existentes */
export function listCategoryDayRoutes(): Array<{ date: string; category: string }> {
  const out: Array<{ date: string; category: string }> = [];
  for (const e of editions) {
    if (e.type === "category" && (e as any).category) {
      out.push({ date: e.date, category: normalizeCategory((e as any).category) });
    }
  }
  return out;
}

/** Categorias publicadas em um dia específico */
export function listCategoriesForDate(date: string): string[] {
  const set = new Set<string>();
  for (const e of editions) {
    if (e.type === "category" && e.date === date && (e as any).category) {
      set.add(normalizeCategory((e as any).category));
    }
  }
  return [...set].filter(Boolean).sort();
}
