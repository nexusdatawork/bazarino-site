export type Achado = {
  id: string;
  title: string;
  price: number;
  store: string;
  href: string;
  category: string;   // slug da categoria
  createdAt: string;  // YYYY-MM-DD
  highlight?: boolean;
};

export const achadosMock: Achado[] = [
  {
    id: "2025-12-18-eletronicos-01",
    title: "Headset Bluetooth XYZ",
    price: 199.9,
    store: "Loja Exemplo",
    href: "#",
    category: "eletronicos",
    createdAt: "2025-12-18",
    highlight: true,
  },
  {
    id: "2025-12-18-casa-01",
    title: "Air Fryer Compacta 4L",
    price: 299.9,
    store: "Loja Exemplo",
    href: "#",
    category: "casa-e-cozinha",
    createdAt: "2025-12-18",
  },
  {
    id: "2025-12-17-moda-01",
    title: "Camiseta básica premium",
    price: 59.9,
    store: "Loja Exemplo",
    href: "#",
    category: "moda",
    createdAt: "2025-12-17",
  },
  {
    id: "2025-12-17-games-01",
    title: "Gift Card 100 (exemplo)",
    price: 89.9,
    store: "Loja Exemplo",
    href: "#",
    category: "games",
    createdAt: "2025-12-17",
  },
];

export function getLatestAchados(limit = 12) {
  return [...achadosMock]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit);
}

export function getAchadosByCategory(category: string) {
  return achadosMock
    .filter((a) => a.category === category)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}
