import React from 'react';
import "../components/itemPage/itemPage.css";

interface CategoryCardProps {
  category: any;
  onClick?: (categoryName: string) => void;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ category, onClick }) => (
  <div className="category-card" onClick={() => onClick?.(category.categoryName || category.title)}>
    {category.image && <img src={category.image} alt={category.categoryName || category.title} className="category-image" />}
    <div className="category-info">
      <h3>{category.categoryName || category.title}</h3>
      <p>{category.categoryDescription || category.desc}</p>
    </div>
  </div>
);
