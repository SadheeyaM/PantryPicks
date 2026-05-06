import React from "react";

type StewardProductItem = {
  id: string;
  name: string;
  category: string;
  supplier: string;
  status: string;
  price?: string;
  imageUrl?: string;
};

type ProductsPageProps = {
  products: StewardProductItem[];
  onOpenProduct: (id: string) => void;
  onUpdateProductStatus: (id: string, action: "approve" | "reject") => void;
};

const ITEMS_PER_PAGE = 8;

export default function ProductsPage({ products, onOpenProduct, onUpdateProductStatus }: ProductsPageProps) {
  const [filterCategory, setFilterCategory] = React.useState<string>("all");
  const [currentPage, setCurrentPage] = React.useState(1);

  const categories = React.useMemo(() => {
    const unique = new Set(products.map((item) => item.category).filter(Boolean));
    return Array.from(unique).sort((a, b) => a.localeCompare(b));
  }, [products]);

  const filteredProducts = React.useMemo(() => {
    if (filterCategory === "all") return products;
    return products.filter((item) => item.category === filterCategory);
  }, [products, filterCategory]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = React.useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [filterCategory]);

  const badgeClassForStatus = (statusRaw: string) => {
    const status = statusRaw.toUpperCase();
    if (status.includes("APPROVED")) return "ok";
    if (status.includes("REJECTED")) return "reject";
    return "warn";
  };

  const statusLabel = (statusRaw: string) => {
    const status = statusRaw.toUpperCase();
    if (status.includes("APPROVED")) return "Approved";
    if (status.includes("REJECTED")) return "Rejected";
    return "Pending Approval";
  };

  const isPendingStatus = (statusRaw: string) => {
    const status = statusRaw.toUpperCase();
    return status.includes("PENDING");
  };

  return (
    <section className="steward-products-section" aria-label="Product list">
      <article className="steward-products-container">
        <div className="steward-panel-head">
          <h2>All Products</h2>
          <span>{filteredProducts.length} items</span>
        </div>

        <div className="steward-filters-row">
          <div className="steward-filter-item">
            <label className="steward-filter-label" htmlFor="steward-product-category-filter">Category</label>
            <select
              id="steward-product-category-filter"
              className="steward-filter-dropdown"
              value={filterCategory}
              onChange={(event) => setFilterCategory(event.target.value)}
            >
              <option value="all">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="steward-empty">No products found for the selected category.</div>
        ) : (
          <>
            <div className="steward-products-table-wrapper">
              <table className="steward-products-table">
                <thead>
                  <tr>
                    <th>Product Name</th>
                    <th>Category</th>
                    <th>Supplier</th>
                    <th>Unit Price</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedProducts.map((product) => (
                    <tr key={product.id} className="steward-table-row">
                      <td className="steward-table-product-cell">
                        <button
                          type="button"
                          className="steward-table-product-button"
                          onClick={() => onOpenProduct(product.id)}
                        >
                          <div className="steward-table-image-wrap" aria-hidden="true">
                            {product.imageUrl ? (
                              <img src={product.imageUrl} alt={product.name} className="steward-table-image" />
                            ) : (
                              <div className="steward-table-image-placeholder" />
                            )}
                          </div>
                          <div className="steward-table-product-info">
                            <p className="steward-table-product-name">{product.name}</p>
                            <p className="steward-table-product-sku">SKU: {product.id}</p>
                          </div>
                        </button>
                      </td>
                      <td className="steward-table-category">{product.category}</td>
                      <td className="steward-table-supplier">{product.supplier}</td>
                      <td className="steward-table-price">{product.price || "$0.00"}</td>
                      <td className="steward-table-status">
                        {isPendingStatus(product.status) ? (
                          <div className="steward-status-actions">
                            <button
                              type="button"
                              className="steward-status-icon-btn approve"
                              aria-label={`Approve ${product.name}`}
                              title="Approve"
                              onClick={() => onUpdateProductStatus(product.id, "approve")}
                            >
                              <i className="bx bx-check" aria-hidden="true" />
                            </button>
                            <button
                              type="button"
                              className="steward-status-icon-btn reject"
                              aria-label={`Reject ${product.name}`}
                              title="Reject"
                              onClick={() => onUpdateProductStatus(product.id, "reject")}
                            >
                              <i className="bx bx-x" aria-hidden="true" />
                            </button>
                          </div>
                        ) : (
                          <span className={`steward-badge ${badgeClassForStatus(product.status)}`}>{statusLabel(product.status)}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="steward-table-pagination">
                <button
                  type="button"
                  className="steward-pagination-arrow"
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  ‹
                </button>

                <div className="steward-pagination-numbers">
                  {Array.from({ length: totalPages }, (_, index) => {
                    const page = index + 1;
                    return (
                      <button
                        key={page}
                        type="button"
                        className={`steward-pagination-number ${currentPage === page ? "active" : ""}`}
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </button>
                    );
                  })}
                </div>

                <button
                  type="button"
                  className="steward-pagination-arrow"
                  onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
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
