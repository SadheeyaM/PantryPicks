import React from "react";

type OrdersPageProps = {
  orders: Array<{ id: string; customer: string; items: number; status: string }>;
  isLoadingOrders: boolean;
  ordersError: string | null;
  onOpenOrder: (id: string) => void;
};

export default function OrdersPage({ orders, isLoadingOrders, ordersError, onOpenOrder }: OrdersPageProps) {
  return (
    <section className="supplier-list-layout" aria-label="Supplier orders">
      <article className="supplier-orders-panel">
        <div className="supplier-panel-head">
          <h2>All Orders</h2>
          <span className="supplier-count-pill">{orders.length} active</span>
        </div>

        {isLoadingOrders ? <p className="supplier-list-sub">Loading orders...</p> : null}
        {ordersError ? <p className="supplier-list-sub">{ordersError}</p> : null}

        {!isLoadingOrders && !ordersError && orders.length === 0 ? <p className="supplier-list-sub">No orders found.</p> : null}

        <div className="supplier-products-list" role="list">
          {orders.map((order) => (
            <button
              key={order.id}
              type="button"
              className="supplier-product-row"
              onClick={() => {
                onOpenOrder(order.id);
              }}
            >
              <div>
                <p className="supplier-list-title">#{order.id}</p>
                <p className="supplier-list-sub">{order.customer} • {order.items} items</p>
              </div>
              <div className="supplier-row-right">
                <span className="supplier-badge info">{order.status}</span>
                <i className="bx bx-chevron-right" aria-hidden="true" />
              </div>
            </button>
          ))}
        </div>
      </article>
    </section>
  );
}
