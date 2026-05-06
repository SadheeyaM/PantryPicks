import React from "react";

type CategoryProductItem = {
  id: string;
  name: string;
  category: string;
  supplier: string;
  price: string;
  status: string;
  imageUrl?: string;
};

type CategoryProductsPageProps = {
  categoryName: string;
  products: CategoryProductItem[];
  onBack: () => void;
  onOpenProduct: (id: string) => void;
};

const ITEMS_PER_PAGE = 8;

export default function CategoryProductsPage({ categoryName, products, onBack, onOpenProduct }: CategoryProductsPageProps) {
  const [currentPage, setCurrentPage] = React.useState(1);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [categoryName]);

  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);
  const paginatedProducts = React.useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return products.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [products, currentPage]);

  const badgeClassForStatus = (statusRaw: string) => {
    const status = statusRaw.toUpperCase();
    if (status.includes("APPROVED")) return "ok";
    if (status.includes("REJECTED")) return "reject";
    return "warn";
  };

  return (
    <section className="steward-products-section" aria-label={`${categoryName} products`}>
      <article className="steward-products-container">
        <div className="steward-panel-head">
          <div>
            <h2>{categoryName || "Selected Category"}</h2>
            <span>{products.length} items</span>
          </div>
          <button type="button" className="steward-btn approve" onClick={onBack}>
            Back to Categories
          </button>
        </div>

        {products.length === 0 ? (
          <div className="steward-empty">No products found in this category.</div>
        ) : (
          <>
            <div className="steward-products-table-wrapper">
              <table className="steward-products-table">
                <thead>
                  <tr>
                    <th>Product Name</th>
                    <th>Supplier</th>
                    <th>Price</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedProducts.map((product) => (
                    <tr key={product.id} className="steward-table-row">
                      <td className="steward-table-product-cell">
                        <button type="button" className="steward-table-product-button" onClick={() => onOpenProduct(product.id)}>
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
                      <td className="steward-table-supplier">{product.supplier}</td>
                      <td className="steward-table-price">{product.price}</td>
                      <td className="steward-table-status">
                        <span className={`steward-badge ${badgeClassForStatus(product.status)}`}>{product.status}</span>
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
