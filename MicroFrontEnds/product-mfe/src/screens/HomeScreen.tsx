import React from 'react';
import { useCategories } from '../hooks/useCategories';
import { CategoryList } from '../components/CategoryList';

interface HomeScreenProps {
  onCategoryClick?: (categoryName: string) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ onCategoryClick }) => {
  const { categories, isLoading, error, reload } = useCategories();

  if (isLoading) return <div>Loading categories...</div>;
  if (error) return <div>Error: {error} <button onClick={reload}>Retry</button></div>;

  return (
    <div className="home-screen">
      <h2>Browse Categories</h2>
      <CategoryList categories={categories} onCategoryClick={onCategoryClick} />
    </div>
  );
};
