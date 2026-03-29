import React, { useState, useMemo } from "react";
import "../../../../shared-mfe/src/styles/global.css";
import "./categoryItems.css";
import { products } from "../data/products";

interface CategoryItemsPageProps {
  category?: string;
  onBackToHome?: () => void;
}

const CategoryItemsPage: React.FC<CategoryItemsPageProps> = ({
  category = "Vegetables",
  onBackToHome,
}) => {
  const allProducts = useMemo(
    () => products.filter((product) => product.category === category),
    [category]
  );

  const [sortBy, setSortBy] = useState<"relevance" | "price-low" | "price-high">("relevance");
  const [currentPage, setCurrentPage] = useState(1);
  const [cart, setCart] = useState<{ [key: number]: number }>({});
  const ITEMS_PER_PAGE = 9;

  const filteredProducts = useMemo(() => {
    let filtered = [...allProducts];
    switch (sortBy) {
      case "price-low": filtered.sort((a, b) => a.price - b.price); break;
      case "price-high": filtered.sort((a, b) => b.price - a.price); break;
    }
    return filtered;
  }, [sortBy]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIdx = startIdx + ITEMS_PER_PAGE;
  const paginatedProducts = filteredProducts.slice(startIdx, endIdx);

  const handleAddToCart = (id: number) =>
    setCart((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));

  const handleRemoveFromCart = (id: number) =>
    setCart((prev) => {
      const next = { ...prev };
      if (next[id] > 1) next[id]--;
      else delete next[id];
      return next;
    });

  const handleViewDetails = (productId: number) => {
    window.location.hash = `product/${productId}`;
  };

  return (
    <div className="category-items-page">
      {/* Header */}
      <div className="category-header">
        <div className="header-content">
          <div className="header-text">
            <h1>{category}</h1>
            <p className="category-subtitle">Fresh {category.toLowerCase()} delivered</p>
          </div>
          {onBackToHome && (
            <button className="back-button" onClick={onBackToHome}>
              <i className="bx bx-arrow-back"></i>
              Home
            </button>
          )}
        </div>
      </div>

      <div className="category-container">
        {/* Products */}
        <div className="products-section">
          <div className="sort-bar">
            <span className="sort-bar-left">{filteredProducts.length} results</span>
            <div className="sort-bar-right">
              <span className="sort-label">Sort</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="sort-select"
              >
                <option value="relevance">Relevance</option>
                <option value="price-low">Price: Low → High</option>
                <option value="price-high">Price: High → Low</option>
              </select>
            </div>
          </div>

          <div className="products-grid">
            {paginatedProducts.map((product) => (
              <div key={product.id} className="product-card">
                <div className="product-image-wrapper">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="product-image"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src =
                        "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=900&q=80";
                    }}
                  />

                  <div className="stock-badge">In Stock</div>
                </div>

                <div className="product-info">
                  <h3 className="product-name">{product.name}</h3>
                  <p className="product-description">{product.description}</p>
                  <div className="product-price">
                    <span className="current-price">${product.price.toFixed(2)}</span>
                  </div>
                  <div className="product-actions">
                    <button className="view-details-icon-btn" onClick={() => handleViewDetails(product.id)} title="View Details">
                      <i className="bx bx-show"></i>
                    </button>
                    {cart[product.id] ? (
                      <div className="quantity-control">
                        <button className="qty-btn" onClick={() => handleRemoveFromCart(product.id)}>−</button>
                        <span className="qty-display">{cart[product.id]}</span>
                        <button className="qty-btn" onClick={() => handleAddToCart(product.id)}>+</button>
                      </div>
                    ) : (
                      <button className="add-to-cart-btn" onClick={() => handleAddToCart(product.id)}>
                        <i className="bx bx-cart-add"></i> Add to Cart
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {paginatedProducts.length === 0 && (
              <div className="no-products">
                <p>No products match your filters.</p>
              </div>
            )}
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              <button
                className="page-btn prev-btn"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                <i className="bx bx-chevron-left"></i>
              </button>
              <div className="page-numbers">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    className={`page-num ${currentPage === page ? "active" : ""}`}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </button>
                ))}
              </div>
              <button
                className="page-btn next-btn"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                <i className="bx bx-chevron-right"></i>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryItemsPage;