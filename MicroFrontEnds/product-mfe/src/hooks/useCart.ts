import { useState, useCallback } from 'react';
import { fetchCart, addToCart, updateCartItem, removeCartItem } from '../services/cartService';
import { readUserIdFromToken } from '../utils/jwt';

export function useCart() {
  const [cart, setCart] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadCart = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const accessToken = window.localStorage.getItem('accessToken') || '';
      const userId = readUserIdFromToken();
      if (!accessToken || !userId) throw new Error('Not signed in');
      const raw = await fetchCart(userId, accessToken);
      setCart(Array.isArray(raw) ? raw[0] : raw);
    } catch (e: any) {
      setError(e?.message || 'Failed to load cart');
      setCart(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const add = useCallback(async (cartId: number, productId: number, quantity: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const accessToken = window.localStorage.getItem('accessToken') || '';
      await addToCart(cartId, productId, quantity, accessToken);
      await loadCart();
    } catch (e: any) {
      setError(e?.message || 'Failed to add to cart');
    } finally {
      setIsLoading(false);
    }
  }, [loadCart]);

  const update = useCallback(async (cartId: number, cartItemId: number, quantity: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const accessToken = window.localStorage.getItem('accessToken') || '';
      await updateCartItem(cartId, cartItemId, quantity, accessToken);
      await loadCart();
    } catch (e: any) {
      setError(e?.message || 'Failed to update cart');
    } finally {
      setIsLoading(false);
    }
  }, [loadCart]);

  const remove = useCallback(async (cartId: number, cartItemId: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const accessToken = window.localStorage.getItem('accessToken') || '';
      await removeCartItem(cartId, cartItemId, accessToken);
      await loadCart();
    } catch (e: any) {
      setError(e?.message || 'Failed to remove from cart');
    } finally {
      setIsLoading(false);
    }
  }, [loadCart]);

  return { cart, isLoading, error, reload: loadCart, add, update, remove };
}
