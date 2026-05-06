import React from 'react';
import { CategoryCard } from './CategoryCard';
import "../components/itemPage/itemPage.css";

interface CategoryListProps {
  categories: any[];
  onCategoryClick?: (categoryName: string) => void;
}

export const CategoryList: React.FC<CategoryListProps> = ({ categories, onCategoryClick }) => (
  <div className="category-list">
    {categories.map(category => (
      <CategoryCard
        key={category.categoryName || category.title}
        category={category}
        onClick={onCategoryClick}
      />
    ))}
  </div>
);
