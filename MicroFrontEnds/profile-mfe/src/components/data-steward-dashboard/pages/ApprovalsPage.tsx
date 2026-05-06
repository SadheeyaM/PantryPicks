import React from "react";

type ApprovalItem = {
  id: string;
  name: string;
  category: string;
  supplier: string;
  submittedAt?: string;
  price?: string;
  status?: string;
};

type ApprovalsPageProps = {
  pendingApprovals: ApprovalItem[];
  approvalsLoading: boolean;
  approvalsError: string | null;
  onOpenApproval: (id: string) => void;
  onUpdateApprovalStatus: (id: string, action: "approve" | "reject") => void;
};

const ITEMS_PER_PAGE = 8;

export default function ApprovalsPage({ pendingApprovals, approvalsLoading, approvalsError, onOpenApproval, onUpdateApprovalStatus }: ApprovalsPageProps) {
  const [currentPage, setCurrentPage] = React.useState(1);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [pendingApprovals.length]);

  const totalPages = Math.ceil(pendingApprovals.length / ITEMS_PER_PAGE);
  const paginatedApprovals = React.useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return pendingApprovals.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [pendingApprovals, currentPage]);

  return (
    <section className="steward-products-section" aria-label="Approval queue">
      <article className="steward-products-container">
        <div className="steward-panel-head">
          <h2>Approval Queue</h2>
          <span>{pendingApprovals.length} pending</span>
        </div>

        {approvalsError ? <p className="steward-inline-error">{approvalsError}</p> : null}

        {approvalsLoading ? (
          <div className="steward-empty">Loading pending approvals...</div>
        ) : pendingApprovals.length === 0 ? (
          <div className="steward-empty">No pending approvals right now.</div>
        ) : (
          <>
            <div className="steward-products-table-wrapper">
              <table className="steward-products-table">
                <thead>
                  <tr>
                    <th>Product Name</th>
                    <th>Category</th>
                    <th>Supplier</th>
                    <th>Submitted</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedApprovals.map((item) => (
                    <tr key={item.id} className="steward-table-row">
                      <td className="steward-table-product-cell">
                        <button
                          type="button"
                          className="steward-table-product-button"
                          onClick={() => onOpenApproval(item.id)}
                        >
                          <div className="steward-table-product-info">
                            <p className="steward-table-product-name">{item.name}</p>
                            <p className="steward-table-product-sku">SKU: {item.id}</p>
                          </div>
                        </button>
                      </td>
                      <td className="steward-table-category">{item.category}</td>
                      <td className="steward-table-supplier">{item.supplier}</td>
                      <td className="steward-table-price">{item.submittedAt || "-"}</td>
                      <td className="steward-table-status">
                        <div className="steward-status-actions">
                          <button
                            type="button"
                            className="steward-status-icon-btn approve"
                            aria-label={`Approve ${item.name}`}
                            title="Approve"
                            onClick={() => onUpdateApprovalStatus(item.id, "approve")}
                          >
                            <i className="bx bx-check" aria-hidden="true" />
                          </button>
                          <button
                            type="button"
                            className="steward-status-icon-btn reject"
                            aria-label={`Reject ${item.name}`}
                            title="Reject"
                            onClick={() => onUpdateApprovalStatus(item.id, "reject")}
                          >
                            <i className="bx bx-x" aria-hidden="true" />
                          </button>
                        </div>
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
