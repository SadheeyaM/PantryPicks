import React from 'react';
import "../components/itemPage/itemPage.css";

interface ProductCardProps {
  product: any;
  onClick?: (productId: number) => void;
  onAddToCart?: (productId: number) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onClick, onAddToCart }) => (
  <div className="product-card">
    <img src={product.image} alt={product.name} className="product-image" />
    <div className="product-info">
      <h3>{product.name}</h3>
      <p>{product.description}</p>
      <div className="product-meta">
        <span className="product-price">${product.price.toFixed(2)}</span>
        <button onClick={() => onClick?.(product.id)}>View</button>
        {onAddToCart && (
          <button onClick={() => onAddToCart(product.id)}>Add to Cart</button>
        )}
      </div>
    </div>
  </div>
);
