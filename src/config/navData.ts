export {};

export type NavItem = { label: string; href: string };

export const mainNav: readonly NavItem[] = [
  { label: "Achados", href: "/achados" },
  { label: "Blog", href: "/blog" },
  { label: "Como funciona", href: "/como-funciona" },
  { label: "Sobre", href: "/sobre" },
  { label: "Contato", href: "/contato" },
];
