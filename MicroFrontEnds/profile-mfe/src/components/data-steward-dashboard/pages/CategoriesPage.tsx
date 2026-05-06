import React from "react";

type CategoryItem = {
  categoryId?: number;
  categoryName?: string;
  categoryImage?: string;
};

type CategoryProductItem = {
  id: string;
  name: string;
  category: string;
  supplier: string;
  price: string;
  status: string;
  imageUrl?: string;
};

type CategorySummaryItem = CategoryItem & {
  productCount: number;
};

type CategoriesPageProps = {
  categories: CategoryItem[];
  products: CategoryProductItem[];
  categoriesLoading: boolean;
  categoriesError: string | null;
  showCreateCategoryForm: boolean;
  onToggleCreateForm: () => void;
  onStartEditCategory: (category: CategoryItem) => void;
  onOpenCategory: (categoryName: string) => void;
  children?: React.ReactNode;
};

export default function CategoriesPage({
  categories,
  products,
  categoriesLoading,
  categoriesError,
  showCreateCategoryForm,
  onToggleCreateForm,
  onStartEditCategory,
  onOpenCategory,
  children,
}: CategoriesPageProps) {
  const categorySummaries = React.useMemo<CategorySummaryItem[]>(() => {
    return categories.map((category) => {
      const categoryName = category.categoryName || "Unknown";
      const matchedProducts = products.filter((product) => product.category === categoryName);

      return {
        ...category,
        productCount: matchedProducts.length,
      };
    });
  }, [categories, products]);

  return (
    <section className="steward-products-section" aria-label="Category management">
      <article className="steward-profile-card">
        <div className="steward-panel-head steward-panel-head-wrap">
          <div>
            <h2>All Categories</h2>
            <span>{categorySummaries.length} total</span>
          </div>
          <button
            type="button"
            className="steward-btn approve steward-create-toggle"
            onClick={onToggleCreateForm}
          >
            {showCreateCategoryForm ? "Close Form" : "Create New Category"}
          </button>
        </div>

        {categoriesLoading ? (
          <div className="steward-empty">Loading categories...</div>
        ) : categoriesError ? (
          <p className="steward-inline-error">{categoriesError}</p>
        ) : categorySummaries.length === 0 ? (
          <div className="steward-empty">No categories found yet.</div>
        ) : (
          <div className="steward-products-table-wrapper">
            <table className="steward-products-table steward-category-table">
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Products</th>
                  <th>Image</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {categorySummaries.map((category) => (
                  <tr key={String(category.categoryId || category.categoryName)} className="steward-table-row">
                    <td className="steward-table-product-cell">
                      <button
                        type="button"
                        className="steward-table-product-button steward-category-button"
                        onClick={() => onOpenCategory(category.categoryName || "")}
                      >
                        <div className="steward-table-product-info">
                          <p className="steward-table-product-name">{category.categoryName}</p>
                          <p className="steward-table-product-sku">ID: {category.categoryId || "N/A"}</p>
                        </div>
                      </button>
                    </td>
                    <td className="steward-table-price">{category.productCount}</td>
                    <td className="steward-table-status">
                      {category.categoryImage ? (
                        <div className="steward-table-image-wrap" aria-hidden="true">
                          <img src={category.categoryImage} alt={category.categoryName || "Category"} className="steward-table-image" />
                        </div>
                      ) : (
                        <div className="steward-table-image-wrap" aria-hidden="true">
                          <div className="steward-table-image-placeholder" />
                        </div>
                      )}
                    </td>
                    <td className="steward-row-actions">
                      <button
                        type="button"
                        className="steward-btn edit"
                        onClick={() => onStartEditCategory(category)}
                        disabled={!category.categoryId}
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </article>

      {children}
    </section>
  );
}
