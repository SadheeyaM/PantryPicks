import React from "react";

type SupplierProductRecord = {
  id: string;
  name: string;
  category: string;
  imageUrl?: string;
  price?: string;
  status?: string;
};

type ProductsPageProps = {
  products: SupplierProductRecord[];
  isLoadingProducts: boolean;
  productsError: string | null;
  onOpenProduct: (id: string) => void;
};

const ITEMS_PER_PAGE = 8;

export default function ProductsPage({ 
  products, 
  isLoadingProducts, 
  productsError, 
  onOpenProduct
}: ProductsPageProps) {
  const [filterCategory, setFilterCategory] = React.useState<string>("all");
  const [filterPrice, setFilterPrice] = React.useState<string>("all");
  const [currentPage, setCurrentPage] = React.useState(1);

  // Get unique categories
  const categories = React.useMemo(() => {
    const cats = new Set(products.map((p) => p.category));
    return Array.from(cats).sort();
  }, [products]);

  // Filter products
  const filteredProducts = React.useMemo(() => {
    return products.filter((product) => {
      const categoryMatch = filterCategory === "all" || product.category === filterCategory;
      return categoryMatch;
    });
  }, [products, filterCategory, filterPrice]);

  // Paginate
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = React.useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [filterCategory, filterPrice]);

  return (
    <section className="supplier-products-section">
      <article className="supplier-products-container">
        {/* Header */}
        <div className="supplier-panel-head">
          <h2>All Products</h2>
          <span className="supplier-count-pill">{filteredProducts.length} items</span>
        </div>

        {/* Filters Row */}
        <div className="supplier-filters-row">
          <div className="supplier-filter-item">
            <label className="supplier-filter-label">Category</label>
            <select
              className="supplier-filter-dropdown"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="supplier-filter-item">
            <label className="supplier-filter-label">Price</label>
            <select
              className="supplier-filter-dropdown"
              value={filterPrice}
              onChange={(e) => setFilterPrice(e.target.value)}
            >
              <option value="all">All Prices</option>
            </select>
          </div>
        </div>

        {/* Loading & Error States */}
        {isLoadingProducts ? (
          <p className="supplier-list-sub" style={{ padding: "20px" }}>Loading products...</p>
        ) : null}
        {productsError ? (
          <p className="supplier-error-text" style={{ padding: "20px" }}>{productsError}</p>
        ) : null}
        {!isLoadingProducts && !productsError && filteredProducts.length === 0 ? (
          <p className="supplier-list-sub" style={{ padding: "20px" }}>No products found.</p>
        ) : null}

        {/* Products Table */}
        {!isLoadingProducts && !productsError && paginatedProducts.length > 0 && (
          <>
            <div className="supplier-products-table-wrapper">
              <table className="supplier-products-table">
                <thead>
                  <tr>
                    <th>Product Name</th>
                    <th>Category</th>
                    <th>Unit Price</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedProducts.map((product) => (
                    <tr key={product.id} className="supplier-table-row">
                      <td className="supplier-table-product-cell">
                        <button
                          type="button"
                          className="supplier-table-product-button"
                          onClick={() => onOpenProduct(product.id)}
                        >
                          <div className="supplier-table-image-wrap">
                            {product.imageUrl ? (
                              <img src={product.imageUrl} alt={product.name} className="supplier-table-image" />
                            ) : (
                              <div className="supplier-table-image-placeholder" />
                            )}
                          </div>
                          <div className="supplier-table-product-info">
                            <p className="supplier-table-product-name">{product.name}</p>
                            <p className="supplier-table-product-sku">SKU: {product.id}</p>
                          </div>
                        </button>
                      </td>
                      <td className="supplier-table-category">{product.category}</td>
                      <td className="supplier-table-price">{product.price}</td>
                      <td className="supplier-table-status">
                        <span className="supplier-badge info">{product.status || "PENDING_APPROVAL"}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="supplier-table-pagination">
                <button
                  className="supplier-pagination-arrow"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  ‹
                </button>

                <div className="supplier-pagination-numbers">
                  {Array.from({ length: Math.min(totalPages, 10) }, (_, i) => {
                    const page = i + 1;
                    return (
                      <button
                        key={page}
                        className={`supplier-pagination-number ${currentPage === page ? "active" : ""}`}
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </button>
                    );
                  })}
                  {totalPages > 10 && <span className="supplier-pagination-dots">...</span>}
                  {totalPages > 10 && (
                    <button
                      className={`supplier-pagination-number ${currentPage === totalPages ? "active" : ""}`}
                      onClick={() => setCurrentPage(totalPages)}
                    >
                      {totalPages}
                    </button>
                  )}
                </div>

                <button
                  className="supplier-pagination-arrow"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  ›
                </button>
              </div>
            )}
          </>
        )}
      </article>
    </section>
  );
}
