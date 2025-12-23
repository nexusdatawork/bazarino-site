export type AchadoItem = {
  id: string;
  name: string;
  category: string;
  vendor: string;
  price: number;
  oldPrice?: number;
  image?: string;
  affiliateUrl: string;
  score: number;
};

export type AchadosEdition = {
  date: string;
  type: "daily" | "category";
  title: string;

  category?: string;
  categoryTitle?: string;

  kicker?: string;
  intro?: string;
  outro?: string;

  methodologyTitle?: string;
  methodology?: string[] | string;


  ctaText?: string;
  ctaLink?: string;

  items: AchadoItem[];
};
