import React from 'react';
import { useProducts } from '../hooks/useProducts';
import { ProductList } from '../components/ProductList';

interface CategoryScreenProps {
  category: string;
  onProductClick?: (productId: number) => void;
  onBack?: () => void;
}

export const CategoryScreen: React.FC<CategoryScreenProps> = ({ category, onProductClick, onBack }) => {
  const { products, isLoading, error, reload } = useProducts(category);

  if (isLoading) return <div>Loading products...</div>;
  if (error) return <div>Error: {error} <button onClick={reload}>Retry</button></div>;

  return (
    <div className="category-screen">
      <button onClick={onBack}>Back</button>
      <h2>{category}</h2>
      <ProductList products={products} onProductClick={onProductClick} />
    </div>
  );
};
