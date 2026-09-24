// Single mapping from a real admin product row to what product cards display.
export interface CardProduct {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  image: string;
  brand?: string;
  discount?: string;
  isFlash?: boolean;
  stock?: number;
  colors?: Array<{ name: string; hex_code: string }>;
}

export const toCardProduct = (p: any): CardProduct => ({
  id: p.id,
  name: p.name,
  price: Number(p.price),
  originalPrice: p.original_price && Number(p.original_price) > Number(p.price) ? Number(p.original_price) : undefined,
  rating: Number(p.rating || 0),
  reviews: Number(p.reviews || 0),
  image: p.image,
  brand: p.brand || undefined,
  discount: p.discount_percentage > 0 ? `${p.discount_percentage}% OFF` : undefined,
  isFlash: !!p.is_flash_sale,
  stock: typeof p.stock === 'number' ? p.stock : undefined,
  colors: Array.isArray(p.colors) ? p.colors : undefined,
});
