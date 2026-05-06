import React from 'react';
import { useProduct } from '../hooks/useProducts';

interface ProductScreenProps {
  productId: number;
  onBack?: () => void;
  onAddToCart?: (productId: number) => void;
}

export const ProductScreen: React.FC<ProductScreenProps> = ({ productId, onBack, onAddToCart }) => {
  const { product, isLoading, error, reload } = useProduct(productId);

  if (isLoading) return <div>Loading product...</div>;
  if (error) return <div>Error: {error} <button onClick={reload}>Retry</button></div>;
  if (!product) return <div>Product not found.</div>;

  return (
    <div className="product-screen">
      <button onClick={onBack}>Back</button>
      <h2>{product.name}</h2>
      <img src={product.image} alt={product.name} className="product-image" />
      <p>{product.description}</p>
      <div className="product-meta">
        <span className="product-price">${product.price.toFixed(2)}</span>
        {onAddToCart && (
          <button onClick={() => onAddToCart(product.id)}>Add to Cart</button>
        )}
      </div>
    </div>
  );
};
