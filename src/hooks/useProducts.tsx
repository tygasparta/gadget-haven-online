
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Product {
  id: number;
  name: string;
  price: number;
  original_price?: number;
  description?: string;
  image: string;
  category?: string;
  brand?: string;
  rating?: number;
  reviews?: number;
  discount_percentage?: number;
  is_flash_sale?: boolean;
  is_featured?: boolean;
  stock_quantity?: number;
  tags?: string[];
  specifications?: Array<{ key: string; value: string }>;
  colors?: Array<{ name: string; hex_code: string }>;
  whats_in_box?: string[];
  gallery?: string[];
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
  is_trashed: boolean;
}

export const useProducts = (includeDeleted: boolean = false) => {
  return useQuery({
    queryKey: ['products', includeDeleted],
    queryFn: async () => {
      console.log('Fetching products..., includeDeleted:', includeDeleted);
      
      let query = supabase.from('products').select(`
        id,
        name,
        price,
        original_price,
        description,
        image,
        category,
        brand,
        rating,
        reviews,
        discount_percentage,
        is_flash_sale,
        is_featured,
        stock_quantity,
        tags,
        specifications,
        colors,
        whats_in_box,
        gallery,
        created_at,
        updated_at,
        deleted_at
      `);

      if (!includeDeleted) {
        query = query.is('deleted_at', null);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching products:', error);
        throw error;
      }

      const products: Product[] = data?.map(product => ({
        ...product,
        specifications: Array.isArray(product.specifications) 
          ? product.specifications as Array<{ key: string; value: string }>
          : [],
        colors: Array.isArray(product.colors) 
          ? product.colors as Array<{ name: string; hex_code: string }>
          : [],
        tags: Array.isArray(product.tags) ? product.tags : [],
        whats_in_box: Array.isArray(product.whats_in_box) ? product.whats_in_box : [],
        is_trashed: !!product.deleted_at
      })) || [];

      console.log('Products fetched:', products.length);
      return products;
    },
  });
};

export const useProduct = (id: string | number) => {
  return useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select(`
          id,
          name,
          price,
          original_price,
          description,
          image,
          category,
          brand,
          rating,
          reviews,
          discount_percentage,
          is_flash_sale,
          is_featured,
          stock_quantity,
          tags,
          specifications,
          colors,
          whats_in_box,
          gallery,
          created_at,
          updated_at,
          deleted_at
        `)
        .eq('id', Number(id))
        .single();

      if (error) {
        console.error('Error fetching product:', error);
        throw error;
      }

      return {
        ...data,
        specifications: Array.isArray(data.specifications) 
          ? data.specifications as Array<{ key: string; value: string }>
          : [],
        colors: Array.isArray(data.colors) 
          ? data.colors as Array<{ name: string; hex_code: string }>
          : [],
        tags: Array.isArray(data.tags) ? data.tags : [],
        whats_in_box: Array.isArray(data.whats_in_box) ? data.whats_in_box : [],
        is_trashed: !!data.deleted_at
      } as Product;
    },
    enabled: !!id,
  });
};

export const useFlashSaleProducts = () => {
  return useQuery({
    queryKey: ['flashSaleProducts'],
    queryFn: async () => {
      console.log('Fetching flash sale products...');
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_flash_sale', true)
        .is('deleted_at', null)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching flash sale products:', error);
        throw error;
      }

      const products: Product[] = data?.map(product => ({
        ...product,
        specifications: Array.isArray(product.specifications) 
          ? product.specifications as Array<{ key: string; value: string }>
          : [],
        colors: Array.isArray(product.colors) 
          ? product.colors as Array<{ name: string; hex_code: string }>
          : [],
        tags: Array.isArray(product.tags) ? product.tags : [],
        whats_in_box: Array.isArray(product.whats_in_box) ? product.whats_in_box : [],
        is_trashed: !!product.deleted_at
      })) || [];

      console.log('Flash sale products fetched:', products.length);
      return products;
    },
  });
};

export const useFeaturedProducts = () => {
  return useQuery({
    queryKey: ['featuredProducts'],
    queryFn: async () => {
      console.log('Fetching featured products...');
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_featured', true)
        .is('deleted_at', null)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching featured products:', error);
        throw error;
      }

      const products: Product[] = data?.map(product => ({
        ...product,
        specifications: Array.isArray(product.specifications) 
          ? product.specifications as Array<{ key: string; value: string }>
          : [],
        colors: Array.isArray(product.colors) 
          ? product.colors as Array<{ name: string; hex_code: string }>
          : [],
        tags: Array.isArray(product.tags) ? product.tags : [],
        whats_in_box: Array.isArray(product.whats_in_box) ? product.whats_in_box : [],
        is_trashed: !!product.deleted_at
      })) || [];

      console.log('Featured products fetched:', products.length);
      return products;
    },
  });
};
