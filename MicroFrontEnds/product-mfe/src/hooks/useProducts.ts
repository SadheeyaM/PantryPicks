import { useState, useEffect, useCallback } from 'react';
import { fetchProducts, fetchProductById } from '../services/productService';
import { normalizeProductList, normalizeProductObject } from '../utils/mappers';

export function useProducts(category?: string) {
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const accessToken = window.localStorage.getItem('accessToken') || undefined;
      const raw = await fetchProducts(category, accessToken);
      setProducts(normalizeProductList(raw));
    } catch (e: any) {
      setError(e?.message || 'Failed to load products');
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  }, [category]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  return { products, isLoading, error, reload: loadProducts };
}

export function useProduct(productId: number | null) {
  const [product, setProduct] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadProduct = useCallback(async () => {
    if (!productId) return;
    setIsLoading(true);
    setError(null);
    try {
      const accessToken = window.localStorage.getItem('accessToken') || undefined;
      const raw = await fetchProductById(productId, accessToken);
      setProduct(normalizeProductObject(raw));
    } catch (e: any) {
      setError(e?.message || 'Failed to load product');
      setProduct(null);
    } finally {
      setIsLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    loadProduct();
  }, [loadProduct]);

  return { product, isLoading, error, reload: loadProduct };
}
