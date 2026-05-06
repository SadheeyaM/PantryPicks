import React from "react";

type SupplierProductRecord = {
  id: string;
  name: string;
  price: string;
};

type OverviewPageProps = {
  summaryStats: {
    totalProducts: string;
    pendingApprovals: string;
    liveOrders: string;
    lowStockAlerts: string;
  };
  recentProducts: SupplierProductRecord[];
  latestOrders: Array<{ orderId: string; customer: string; status: string }>;
  onGoProducts: () => void;
  onGoOrders: () => void;
};

export default function OverviewPage({ summaryStats, recentProducts, latestOrders, onGoProducts, onGoOrders }: OverviewPageProps) {
  return (
    <div>
      <section className="supplier-summary-grid" aria-label="Supplier summary">
        {[
          { label: "Total Products", value: summaryStats.totalProducts, icon: "bx-package" },
          { label: "Pending Approvals", value: summaryStats.pendingApprovals, icon: "bx-time" },
          { label: "Live Orders", value: summaryStats.liveOrders, icon: "bx-receipt" },
          { label: "Low Stock Alerts", value: summaryStats.lowStockAlerts, icon: "bx-error-circle" },
        ].map((card) => (
          <article key={card.label} className="supplier-summary-card">
            <div className="supplier-card-icon-wrap">
              <i className={`bx ${card.icon}`} aria-hidden="true" />
            </div>
            <div>
              <p className="supplier-card-label">{card.label}</p>
              <p className="supplier-card-value">{card.value}</p>
            </div>
          </article>
        ))}
      </section>

      <section className="supplier-panels">
        <article className="supplier-panel">
          <div className="supplier-panel-head">
            <h2>Recent Products</h2>
            <button type="button" onClick={onGoProducts}>View all</button>
          </div>
          <div className="supplier-list" role="list">
            {recentProducts.map((product) => (
              <div key={product.id} className="supplier-list-row" role="listitem">
                <div>
                  <p className="supplier-list-title">{product.name}</p>
                  <p className="supplier-list-sub">{product.id}</p>
                </div>
                <p className="supplier-list-price">{product.price}</p>
                <span className="supplier-badge info">{"Status visible in Products tab"}</span>
              </div>
            ))}
            {recentProducts.length === 0 ? <p className="supplier-list-sub">No products yet. Create your first product.</p> : null}
          </div>
        </article>

        <article className="supplier-panel">
          <div className="supplier-panel-head">
            <h2>Recent Orders</h2>
            <button type="button" onClick={onGoOrders}>View all</button>
          </div>
          <div className="supplier-list" role="list">
            {latestOrders.map((order) => (
              <div key={order.orderId} className="supplier-list-row" role="listitem">
                <div>
                  <p className="supplier-list-title">{order.orderId}</p>
                  <p className="supplier-list-sub">{order.customer}</p>
                </div>
                <span className="supplier-badge info">{order.status}</span>
              </div>
            ))}
          </div>
        </article>
      </section>
    </div>
  );
}
