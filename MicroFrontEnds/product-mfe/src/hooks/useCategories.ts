import { useState, useEffect, useCallback } from 'react';
import { fetchCategories } from '../services/categoryService';

export function useCategories() {
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadCategories = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const accessToken = window.localStorage.getItem('accessToken') || undefined;
      const raw = await fetchCategories(accessToken);
      setCategories(Array.isArray(raw) ? raw : []);
    } catch (e: any) {
      setError(e?.message || 'Failed to load categories');
      setCategories([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  return { categories, isLoading, error, reload: loadCategories };
}
