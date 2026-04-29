import React from 'react';

interface CartItemCardProps {
  item: any;
  isMutating: boolean;
  onQtyChange: (item: any, nextQty: number) => void;
  onRemove: (item: any) => void;
}

export const CartItemCard: React.FC<CartItemCardProps> = ({ item, isMutating, onQtyChange, onRemove }) => (
  <article className="cart-item">
    <img
      src={item.image}
      alt={item.name}
      className="cart-item-image"
      onError={e => {
        e.currentTarget.onerror = null;
        e.currentTarget.src =
          'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=900&q=80';
      }}
    />
    <div className="cart-item-main">
      <h3>{item.name}</h3>
      <p>{item.description}</p>
      <span className="cart-unit-price">${item.price.toFixed(2)} each</span>
    </div>
    <div className="cart-item-actions">
      <div className="cart-qty">
        <button disabled={isMutating} onClick={() => onQtyChange(item, item.quantity - 1)}>−</button>
        <span>{item.quantity}</span>
        <button disabled={isMutating} onClick={() => onQtyChange(item, item.quantity + 1)}>+</button>
      </div>
      <span className="cart-line-total">${(item.price * item.quantity).toFixed(2)}</span>
      <button className="cart-remove-btn" disabled={isMutating} onClick={() => onRemove(item)}>
        Remove
      </button>
    </div>
  </article>
);
