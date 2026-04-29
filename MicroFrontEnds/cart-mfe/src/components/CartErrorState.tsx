import React from 'react';

interface CartErrorStateProps {
  error: string;
  onRetry: () => void;
}

export const CartErrorState: React.FC<CartErrorStateProps> = ({ error, onRetry }) => (
  <div className="cart-empty">
    <h2>Unable to load cart</h2>
    <p>{error}</p>
    <button className="cart-primary-btn" onClick={onRetry}>
      Retry
    </button>
  </div>
);
