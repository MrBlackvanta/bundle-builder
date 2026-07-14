export type ReviewCategory = "Cameras" | "Sensors" | "Accessories" | "Plan";

export interface Priced {
  price: number;
  compareAtPrice?: number;
}

export interface Variant {
  id: string;
  label: string;
  swatch: string;
}

export type Product = Priced & {
  id: string;
  stepId: string;
  reviewCategory: ReviewCategory;
  name: string;
  description: string;
  image: string;
  learnMoreUrl?: string;
  badge?: string;
  perMonth?: boolean;
  brandmark?: boolean;
  locked?: boolean;
  variants?: Variant[];
};

export interface Step {
  id: string;
  title: string;
  icon: string;
  selectionMode: "quantity" | "single";
  nextLabel: string | null;
}

export interface CatalogMeta {
  shipping: Priced & { label: string };
  asLowAsRate: number;
  guarantee: { headline: string; body: string };
}

export interface Catalog {
  steps: Step[];
  products: Product[];
  meta: CatalogMeta;
}
