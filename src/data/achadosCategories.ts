export type AchadoCategoria = {
  slug: string;
  title: string;
  description: string;
};

export const achadosCategories: AchadoCategoria[] = [
  {
    slug: "eletronicos",
    title: "Eletrônicos",
    description: "Fones, periféricos, gadgets e custo-benefício.",
  },
  {
    slug: "casa-e-cozinha",
    title: "Casa e Cozinha",
    description: "Utilidades, organização e pequenos eletros.",
  },
  {
    slug: "moda",
    title: "Moda",
    description: "Básicos, promoções boas e peças com preço justo.",
  },
  {
    slug: "games",
    title: "Games",
    description: "Periféricos, gift cards e promoções.",
  },
];
