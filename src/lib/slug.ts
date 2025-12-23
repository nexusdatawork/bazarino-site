// src/lib/slug.ts
export function titleFromSlug(slug?: string | null): string {
  if (!slug) return "";
  return slug
    .split("-")
    .map((s) => (s ? s[0].toUpperCase() + s.slice(1) : s))
    .join(" ");
}
