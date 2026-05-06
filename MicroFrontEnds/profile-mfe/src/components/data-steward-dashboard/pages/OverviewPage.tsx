import React from "react";

type CategoryBreakdownItem = {
  name: string;
  count: number;
};

type RecentApprovalItem = {
  id: string;
  name: string;
  category: string;
  submittedAt: string;
};

type OverviewPageProps = {
  totalProducts: number;
  pendingApprovals: number;
  approvedToday: number;
  categoriesCount: number;
  topCategories: CategoryBreakdownItem[];
  recentApprovals: RecentApprovalItem[];
};

export default function OverviewPage({
  totalProducts,
  pendingApprovals,
  approvedToday,
  categoriesCount,
  topCategories,
  recentApprovals,
}: OverviewPageProps) {
  return (
    <section className="steward-overview" aria-label="Data steward summary">
      <div className="steward-summary">
        <article className="steward-card steward-kpi-card">
          <div className="steward-kpi-icon shell">
            <i className="bx bx-package" aria-hidden="true" />
          </div>
          <div>
            <p>Total Products</p>
            <h3>{totalProducts}</h3>
          </div>
        </article>

        <article className="steward-card steward-kpi-card">
          <div className="steward-kpi-icon warn">
            <i className="bx bx-time-five" aria-hidden="true" />
          </div>
          <div>
            <p>Pending Approvals</p>
            <h3>{pendingApprovals}</h3>
          </div>
        </article>

        <article className="steward-card steward-kpi-card">
          <div className="steward-kpi-icon shell">
            <i className="bx bx-category-alt" aria-hidden="true" />
          </div>
          <div>
            <p>Active Categories</p>
            <h3>{categoriesCount}</h3>
          </div>
        </article>
      </div>

      <div className="steward-overview-grid">
        <article className="steward-list-shell">
          <div className="steward-panel-head">
            <h2>Top Categories</h2>
            <span>Most active right now</span>
          </div>

          <div className="steward-mini-chart">
            {topCategories.length === 0 ? (
              <div className="steward-empty">Category data will appear after products are loaded.</div>
            ) : (
              topCategories.map((item) => (
                <div key={item.name} className="steward-mini-row steward-simple-row">
                  <p>{item.name}</p>
                  <span className="steward-badge ok">{item.count} products</span>
                </div>
              ))
            )}
          </div>
        </article>

        <article className="steward-list-shell">
          <div className="steward-panel-head">
            <h2>Recent Pending Reviews</h2>
            <span>{pendingApprovals} waiting</span>
          </div>

          <div className="steward-list">
            {recentApprovals.length === 0 ? (
              <div className="steward-empty">No pending approvals right now.</div>
            ) : (
              recentApprovals.map((item) => (
                <div key={item.id} className="steward-row steward-static-row">
                  <div>
                    <p className="steward-row-title">{item.name}</p>
                    <p className="steward-row-sub">{item.id} • {item.category}</p>
                  </div>
                  <div className="steward-row-right">
                    <span className="steward-badge warn">{item.submittedAt}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </article>
      </div>
    </section>
  );
}
