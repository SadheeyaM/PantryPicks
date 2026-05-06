import React from 'react';
import { ProductCard } from './ProductCard';
import "../components/itemPage/itemPage.css";

interface ProductListProps {
  products: any[];
  onProductClick?: (productId: number) => void;
  onAddToCart?: (productId: number) => void;
}

export const ProductList: React.FC<ProductListProps> = ({ products, onProductClick, onAddToCart }) => (
  <div className="product-list">
    {products.map(product => (
      <ProductCard
        key={product.id}
        product={product}
        onClick={onProductClick}
        onAddToCart={onAddToCart}
      />
    ))}
  </div>
);
