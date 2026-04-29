import { useState, useEffect, useCallback } from 'react';
import { fetchCartList, fetchCartById, updateCartItemQty } from '../services/cartService';
import { readUserIdFromToken } from '../utils/jwt';
import { normalizeCartList, normalizeCartObject } from '../utils/cartMappers';

export function useCart() {
  const [items, setItems] = useState<any[]>([]);
  const [activeCartId, setActiveCartId] = useState<number | null>(null);
  const [isLoadingCart, setIsLoadingCart] = useState(true);
  const [cartLoadError, setCartLoadError] = useState<string | null>(null);
  const [isMutatingCart, setIsMutatingCart] = useState(false);

  const loadCart = useCallback(async () => {
    setIsLoadingCart(true);
    setCartLoadError(null);
    const accessToken = window.localStorage.getItem('accessToken');
    const userId = readUserIdFromToken();
    if (!accessToken || !userId) {
      setItems([]);
      setCartLoadError('Please sign in to view your cart.');
      setIsLoadingCart(false);
      return;
    }
    try {
      const cartListRaw = await fetchCartList(userId, accessToken);
      const activeCarts = normalizeCartList(cartListRaw);
      const cartId = Number(activeCarts[0]?.cartId || 0);
      if (!Number.isFinite(cartId) || cartId <= 0) {
        setItems([]);
        setActiveCartId(null);
        setIsLoadingCart(false);
        return;
      }
      const cartRaw = await fetchCartById(cartId, accessToken);
      const cart = normalizeCartObject(cartRaw);
      const mappedItems = Array.isArray(cart?.items)
        ? cart.items.map((item: any) => ({
            id: Number(item.productId || 0),
            cartItemId: Number(item.cartItemId || 0),
            name: String(item.productName || 'Unknown product'),
            description: String(item.productDescription || 'No description available.'),
            image: String(item.productUrl || ''),
            price: Number(item.price) || 0,
            quantity: Number(item.quantity) || 0,
          })).filter((item: any) => item.id > 0 && item.quantity > 0 && item.cartItemId > 0)
        : [];
      setItems(mappedItems);
      setActiveCartId(cartId);
      window.localStorage.setItem('activeCartId', String(cartId));
    } catch (error: any) {
      setItems([]);
      setActiveCartId(null);
      setCartLoadError(error?.message || 'Failed to load cart');
    } finally {
      setIsLoadingCart(false);
    }
  }, []);

  const updateQty = useCallback(async (item: any, nextQty: number) => {
    if (!activeCartId) {
      setCartLoadError('Active cart not found.');
      return;
    }
    const accessToken = window.localStorage.getItem('accessToken');
    if (!accessToken) {
      setCartLoadError('Please sign in to update cart.');
      return;
    }
    setIsMutatingCart(true);
    setCartLoadError(null);
    try {
      await updateCartItemQty(activeCartId, item.cartItemId, nextQty, accessToken);
      await loadCart();
    } catch (error: any) {
      setCartLoadError(error?.message || 'Failed to update cart item');
    } finally {
      setIsMutatingCart(false);
    }
  }, [activeCartId, loadCart]);

  const removeItem = useCallback((item: any) => {
    updateQty(item, 0);
  }, [updateQty]);

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  return {
    items,
    activeCartId,
    isLoadingCart,
    cartLoadError,
    isMutatingCart,
    updateQty,
    removeItem,
    reload: loadCart,
  };
}
