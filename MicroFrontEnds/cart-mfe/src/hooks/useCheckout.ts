import { useState, useCallback } from 'react';
import { confirmCheckout } from '../services/orderService';

export function useCheckout() {
  const [isConfirmingCheckout, setIsConfirmingCheckout] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [checkoutSuccessOrderId, setCheckoutSuccessOrderId] = useState<number | null>(null);
  const [showCheckoutConfirm, setShowCheckoutConfirm] = useState(false);
  const [checkoutIdempotencyKey, setCheckoutIdempotencyKey] = useState('');

  const startCheckout = useCallback(() => {
    setCheckoutError(null);
    setCheckoutIdempotencyKey(
      window.crypto?.randomUUID ? window.crypto.randomUUID() : `checkout-${Date.now()}-${Math.random()}`
    );
    setShowCheckoutConfirm(true);
  }, []);

  const cancelCheckout = useCallback(() => {
    setShowCheckoutConfirm(false);
    setCheckoutIdempotencyKey('');
  }, []);

  const doCheckout = useCallback(async (activeCartId: number | null, accessToken: string) => {
    if (!activeCartId) {
      setCheckoutError('No active cart found for checkout.');
      return;
    }
    if (!accessToken) {
      setCheckoutError('Please sign in to continue checkout.');
      return;
    }
    setIsConfirmingCheckout(true);
    setCheckoutError(null);
    try {
      const body = await confirmCheckout(activeCartId, accessToken, checkoutIdempotencyKey);
      if (!body || !body.order || !body.order.orderId) {
        throw new Error(body?.message || 'Checkout failed. Please try again.');
      }
      const orderId = Number(body.order.orderId);
      setCheckoutSuccessOrderId(Number.isFinite(orderId) && orderId > 0 ? orderId : null);
      setShowCheckoutConfirm(false);
      setCheckoutIdempotencyKey('');
      return orderId;
    } catch (error: any) {
      setCheckoutError(error?.message || 'Checkout failed. Please try again.');
    } finally {
      setIsConfirmingCheckout(false);
    }
  }, [checkoutIdempotencyKey]);

  return {
    isConfirmingCheckout,
    checkoutError,
    checkoutSuccessOrderId,
    showCheckoutConfirm,
    checkoutIdempotencyKey,
    startCheckout,
    cancelCheckout,
    doCheckout,
    setCheckoutSuccessOrderId,
  };
}
