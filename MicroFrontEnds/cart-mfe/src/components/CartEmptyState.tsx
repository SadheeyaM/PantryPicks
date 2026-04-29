import React from 'react';

interface CartEmptyStateProps {
  onBrowseProducts: () => void;
  orderId?: number | null;
}

export const CartEmptyState: React.FC<CartEmptyStateProps> = ({ onBrowseProducts, orderId }) => (
  <div className="cart-empty">
    {orderId ? (
      <>
        <h2>Order placed successfully</h2>
        <p>Your order #{orderId} has been created.</p>
        <button className="cart-primary-btn" onClick={onBrowseProducts}>
          Continue Shopping
        </button>
      </>
    ) : (
      <>
        <h2>Your cart is empty</h2>
        <p>Add a few items to get started.</p>
        <button className="cart-primary-btn" onClick={onBrowseProducts}>
          Browse Products
        </button>
      </>
    )}
  </div>
);
