import React from 'react';

interface CartSummaryProps {
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  isMutating: boolean;
  isConfirmingCheckout: boolean;
  onCheckout: () => void;
}

export const CartSummary: React.FC<CartSummaryProps> = ({
  subtotal,
  deliveryFee,
  discount,
  total,
  isMutating,
  isConfirmingCheckout,
  onCheckout,
}) => (
  <aside className="cart-summary">
    <h2>Order Summary</h2>
    <div className="cart-summary-row">
      <span>Subtotal</span>
      <span>${subtotal.toFixed(2)}</span>
    </div>
    <div className="cart-summary-row">
      <span>Delivery</span>
      <span>${deliveryFee.toFixed(2)}</span>
    </div>
    <div className="cart-summary-row">
      <span>Discount</span>
      <span>-${discount.toFixed(2)}</span>
    </div>
    <div className="cart-summary-row total">
      <span>Total</span>
      <span>${total.toFixed(2)}</span>
    </div>
    <button
      className="cart-primary-btn"
      disabled={isMutating || isConfirmingCheckout}
      onClick={onCheckout}
    >
      Proceed to Checkout
    </button>
  </aside>
);
