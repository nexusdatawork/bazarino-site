export const categoryMeta: Record<string, { title: string; description?: string }> = {
  "casa-e-cozinha": { title: "Casa e Cozinha", description: "Organização, utilidades, eletroportáteis e praticidade." },
  "eletronicos": { title: "Eletrônicos", description: "Fones, periféricos, gadgets e custo-benefício." }
};

export function titleFromSlug(slug: string) {
  return slug
    .split("-")
    .map(s => s.charAt(0).toUpperCase() + s.slice(1))
    .join(" ");
}
