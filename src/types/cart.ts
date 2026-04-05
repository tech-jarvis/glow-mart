export type CartLine = {
  productId: string;
  quantity: number;
  name: string;
  slug: string;
  priceCents: number;
  imageUrl: string | null;
  stock: number;
};
