import React, { useEffect, useMemo, useState } from "react";
import logoImage from "../../../shared-mfe/src/assets/Logo.jpg";
import "./supplier-dashboard.css";

type SupplierView = "overview" | "products" | "add-product" | "orders" | "profile";
type DetailModal = { kind: "product" | "order"; id: string } | null;

const summaryCards = [
  { label: "Total Products", value: "128", icon: "bx-package" },
  { label: "Pending Approvals", value: "14", icon: "bx-time" },
  { label: "Live Orders", value: "36", icon: "bx-receipt" },
  { label: "Low Stock Alerts", value: "9", icon: "bx-error-circle" },
];

const latestProducts = [
  { name: "Cherry Tomatoes", productId: "VEG-2041", price: "$5.99", stock: "In Stock" },
  { name: "Whole Wheat Bread", productId: "BRD-1180", price: "$3.25", stock: "Low Stock" },
  { name: "Greek Yogurt", productId: "DRY-3312", price: "$4.75", stock: "In Stock" },
];

const latestOrders = [
  { orderId: "#ORD-9152", customer: "Brookside Mart", status: "Processing" },
  { orderId: "#ORD-9148", customer: "City Fresh", status: "Packed" },
  { orderId: "#ORD-9142", customer: "Green Basket", status: "Shipped" },
];

const initialProducts = [
  {
    id: "VEG-2041",
    name: "Cherry Tomatoes",
    category: "Vegetables",
    price: "$5.99",
    stock: "In Stock",
    updatedAt: "2 hours ago",
    description: "Sweet, ripe cherry tomatoes packed in 500g punnets for retail and wholesale.",
  },
  {
    id: "BRD-1180",
    name: "Whole Wheat Bread",
    category: "Bakery",
    price: "$3.25",
    stock: "Low Stock",
    updatedAt: "5 hours ago",
    description: "Freshly baked whole wheat loaves with soft texture and clean-label ingredients.",
  },
  {
    id: "DRY-3312",
    name: "Greek Yogurt",
    category: "Dairy",
    price: "$4.75",
    stock: "In Stock",
    updatedAt: "Yesterday",
    description: "High-protein strained yogurt in 750g tubs, ideal for breakfast and meal prep.",
  },
  {
    id: "OIL-9004",
    name: "Sunflower Oil",
    category: "Oils",
    price: "$10.40",
    stock: "In Stock",
    updatedAt: "Yesterday",
    description: "Refined sunflower cooking oil in 2L bottles with long shelf stability.",
  },
];

const initialOrders = [
  {
    id: "ORD-9152",
    customer: "Brookside Mart",
    items: 12,
    total: "$284.70",
    status: "Processing",
    deliveryDate: "Mar 27, 2026",
    notes: "Cold-chain items included. Priority dispatch requested.",
  },
  {
    id: "ORD-9148",
    customer: "City Fresh",
    items: 8,
    total: "$162.25",
    status: "Packed",
    deliveryDate: "Mar 26, 2026",
    notes: "Packed and ready for courier pickup.",
  },
  {
    id: "ORD-9142",
    customer: "Green Basket",
    items: 16,
    total: "$413.00",
    status: "Shipped",
    deliveryDate: "Mar 25, 2026",
    notes: "Shipment dispatched via refrigerated transport.",
  },
];

const supplierProfile = {
  company: "FreshFields Foods",
  supplierId: "SUP-0921",
  contact: "Riya Patel",
  email: "riya.patel@freshfields.com",
  phone: "+1 (312) 555-0142",
  location: "Chicago, IL",
  joined: "Jan 2024",
};

export default function SupplierDashboardHome() {
  const [activeView, setActiveView] = useState<SupplierView>("overview");
  const [detailModal, setDetailModal] = useState<DetailModal>(null);
  const [products, setProducts] = useState(initialProducts);
  const [orders, setOrders] = useState(initialOrders);
  const [isEditingProduct, setIsEditingProduct] = useState(false);
  const [isEditingOrder, setIsEditingOrder] = useState(false);
  const [productDraft, setProductDraft] = useState({
    id: "",
    name: "",
    category: "",
    price: "",
    stock: "In Stock",
    updatedAt: "",
    description: "",
  });
  const [orderDraft, setOrderDraft] = useState({
    id: "",
    customer: "",
    items: 0,
    total: "",
    status: "Processing",
    deliveryDate: "",
    notes: "",
  });
  const [productForm, setProductForm] = useState({
    name: "",
    productId: "",
    category: "Vegetables",
    price: "",
    stock: "In Stock",
    description: "",
  });
  const [productSaved, setProductSaved] = useState(false);

  const selectedProduct = useMemo(() => {
    if (!detailModal || detailModal.kind !== "product") return null;
    return products.find((product) => product.id === detailModal.id) ?? null;
  }, [detailModal, products]);

  const selectedOrder = useMemo(() => {
    if (!detailModal || detailModal.kind !== "order") return null;
    return orders.find((order) => order.id === detailModal.id) ?? null;
  }, [detailModal, orders]);

  useEffect(() => {
    if (selectedProduct) {
      setProductDraft(selectedProduct);
    }
  }, [selectedProduct]);

  useEffect(() => {
    if (selectedOrder) {
      setOrderDraft(selectedOrder);
    }
  }, [selectedOrder]);

  const navItems: Array<{ key: SupplierView; label: string; icon: string }> = [
    { key: "overview", label: "Overview", icon: "bx-home-alt-2" },
    { key: "products", label: "Products", icon: "bx-package" },
    { key: "add-product", label: "Add Product", icon: "bx-plus-circle" },
    { key: "orders", label: "Orders", icon: "bx-receipt" },
    { key: "profile", label: "Profile", icon: "bx-user-circle" },
  ];

  const renderView = () => {
    if (activeView === "products") {
      return (
        <section className="supplier-list-layout" aria-label="Supplier products">
          <article className="supplier-products-panel">
            <div className="supplier-panel-head">
              <h2>All Products</h2>
              <span className="supplier-count-pill">{products.length} items</span>
            </div>

            <div className="supplier-products-list" role="list">
              {products.map((product) => (
                <button
                  key={product.id}
                  type="button"
                  className="supplier-product-row"
                  onClick={() => {
                    setDetailModal({ kind: "product", id: product.id });
                  }}
                >
                  <div>
                    <p className="supplier-list-title">{product.name}</p>
                    <p className="supplier-list-sub">{product.id} • {product.category}</p>
                  </div>
                  <div className="supplier-row-right">
                    <span className={`supplier-badge ${product.stock === "Low Stock" ? "warn" : "ok"}`}>
                      {product.stock}
                    </span>
                    <i className="bx bx-chevron-right" aria-hidden="true" />
                  </div>
                </button>
              ))}
            </div>
          </article>
        </section>
      );
    }

    if (activeView === "add-product") {
      return (
        <section className="supplier-form-shell" aria-label="Add product form">
          <article className="supplier-form-card">
            <div className="supplier-panel-head">
              <h2>Add New Product</h2>
            </div>

            <form
              className="supplier-form-grid"
              onSubmit={(event) => {
                event.preventDefault();
                setProductSaved(true);
              }}
            >
              <label className="supplier-field">
                <span>Product Name</span>
                <input
                  type="text"
                  value={productForm.name}
                  onChange={(event) => {
                    setProductSaved(false);
                    setProductForm((prev) => ({ ...prev, name: event.target.value }));
                  }}
                  placeholder="Enter product name"
                  required
                />
              </label>

              <label className="supplier-field">
                <span>Product ID</span>
                <input
                  type="text"
                  value={productForm.productId}
                  onChange={(event) => {
                    setProductSaved(false);
                    setProductForm((prev) => ({
                      ...prev,
                      productId: event.target.value.toUpperCase(),
                    }));
                  }}
                  placeholder="e.g. PROD-2401"
                  required
                />
              </label>

              <label className="supplier-field">
                <span>Category</span>
                <select
                  value={productForm.category}
                  onChange={(event) => {
                    setProductSaved(false);
                    setProductForm((prev) => ({ ...prev, category: event.target.value }));
                  }}
                >
                  <option>Vegetables</option>
                  <option>Fruits</option>
                  <option>Dairy</option>
                  <option>Oils</option>
                  <option>Pulses</option>
                  <option>Bread</option>
                </select>
              </label>

              <label className="supplier-field">
                <span>Price</span>
                <input
                  type="text"
                  value={productForm.price}
                  onChange={(event) => {
                    setProductSaved(false);
                    setProductForm((prev) => ({ ...prev, price: event.target.value }));
                  }}
                  placeholder="e.g. 5.99"
                  required
                />
              </label>

              <label className="supplier-field">
                <span>Stock Status</span>
                <select
                  value={productForm.stock}
                  onChange={(event) => {
                    setProductSaved(false);
                    setProductForm((prev) => ({ ...prev, stock: event.target.value }));
                  }}
                >
                  <option>In Stock</option>
                  <option>Low Stock</option>
                </select>
              </label>

              <label className="supplier-field supplier-field-full">
                <span>Description</span>
                <textarea
                  value={productForm.description}
                  onChange={(event) => {
                    setProductSaved(false);
                    setProductForm((prev) => ({ ...prev, description: event.target.value }));
                  }}
                  placeholder="Add a short product description"
                  rows={4}
                  required
                />
              </label>

              <div className="supplier-form-actions supplier-field-full">
                <button className="supplier-primary-btn" type="submit">
                  <i className="bx bx-check" aria-hidden="true" />
                  Save Product
                </button>
              </div>
            </form>

            {productSaved && (
              <p className="supplier-success-text">Product saved. Ready for data steward review.</p>
            )}
          </article>
        </section>
      );
    }

    if (activeView === "orders") {
      return (
        <section className="supplier-list-layout" aria-label="Supplier orders">
          <article className="supplier-orders-panel">
            <div className="supplier-panel-head">
              <h2>All Orders</h2>
              <span className="supplier-count-pill">{orders.length} active</span>
            </div>

            <div className="supplier-products-list" role="list">
              {orders.map((order) => (
                <button
                  key={order.id}
                  type="button"
                  className="supplier-product-row"
                  onClick={() => {
                    setDetailModal({ kind: "order", id: order.id });
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

    if (activeView === "profile") {
      return (
        <section className="supplier-profile-layout" aria-label="Supplier profile">
          <article className="supplier-profile-card">
            <div className="supplier-panel-head">
              <h2>Company Profile</h2>
              <button type="button">Edit</button>
            </div>

            <div className="supplier-detail-grid">
              <div>
                <p className="supplier-detail-label">Company</p>
                <p className="supplier-detail-value">{supplierProfile.company}</p>
              </div>
              <div>
                <p className="supplier-detail-label">Supplier ID</p>
                <p className="supplier-detail-value">{supplierProfile.supplierId}</p>
              </div>
              <div>
                <p className="supplier-detail-label">Contact Person</p>
                <p className="supplier-detail-value">{supplierProfile.contact}</p>
              </div>
              <div>
                <p className="supplier-detail-label">Email</p>
                <p className="supplier-detail-value">{supplierProfile.email}</p>
              </div>
              <div>
                <p className="supplier-detail-label">Phone</p>
                <p className="supplier-detail-value">{supplierProfile.phone}</p>
              </div>
              <div>
                <p className="supplier-detail-label">Location</p>
                <p className="supplier-detail-value">{supplierProfile.location}</p>
              </div>
              <div>
                <p className="supplier-detail-label">Onboarded</p>
                <p className="supplier-detail-value">{supplierProfile.joined}</p>
              </div>
            </div>
          </article>

          <article className="supplier-profile-card">
            <div className="supplier-panel-head">
              <h2>Access Summary</h2>
            </div>
            <div className="supplier-summary-grid compact">
              {summaryCards.map((card) => (
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
            </div>
          </article>
        </section>
      );
    }

    return (
      <>
        <section className="supplier-summary-grid" aria-label="Supplier summary">
          {summaryCards.map((card) => (
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
              <button
                type="button"
                onClick={() => {
                  setActiveView("products");
                }}
              >
                View all
              </button>
            </div>
            <div className="supplier-list" role="list">
              {latestProducts.map((product) => (
                <div key={product.productId} className="supplier-list-row" role="listitem">
                  <div>
                    <p className="supplier-list-title">{product.name}</p>
                    <p className="supplier-list-sub">{product.productId}</p>
                  </div>
                  <p className="supplier-list-price">{product.price}</p>
                  <span className={`supplier-badge ${product.stock === "Low Stock" ? "warn" : "ok"}`}>
                    {product.stock}
                  </span>
                </div>
              ))}
            </div>
          </article>

          <article className="supplier-panel">
            <div className="supplier-panel-head">
              <h2>Recent Orders</h2>
              <button
                type="button"
                onClick={() => {
                  setActiveView("orders");
                }}
              >
                View all
              </button>
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
      </>
    );
  };

  return (
    <main className="supplier-dashboard-page">
      <div className="supplier-layout">
        <aside className="supplier-sidebar" aria-label="Supplier navigation">
          <div className="supplier-brand">
            <img src={logoImage} alt="Sysco logo" className="supplier-brand-logo" />
            <div>
              <p className="supplier-brand-title">Supplier Hub</p>
              <p className="supplier-brand-subtitle">PantryPicks</p>
            </div>
          </div>

          <nav className="supplier-nav">
            {navItems.map((item) => (
              <button
                key={item.key}
                className={`supplier-nav-item ${activeView === item.key ? "active" : ""}`}
                type="button"
                onClick={() => {
                  setActiveView(item.key);
                }}
              >
                <i className={`bx ${item.icon}`} aria-hidden="true" />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </aside>

        <section className="supplier-main">
          <header className="supplier-topbar">
            <div>
              <p className="supplier-kicker">Supplier Dashboard</p>
              <h1>
                {activeView === "overview"
                  ? "Welcome back, FreshFields Foods"
                  : activeView === "products"
                    ? "Products"
                    : activeView === "add-product"
                      ? "Add Product"
                      : activeView === "orders"
                        ? "Orders"
                        : "Profile"}
              </h1>
            </div>
            {(activeView === "overview" || activeView === "products") && (
              <button
                className="supplier-primary-btn"
                type="button"
                onClick={() => {
                  setActiveView("add-product");
                }}
              >
                <i className="bx bx-plus" aria-hidden="true" />
                Add New Product
              </button>
            )}
          </header>

          {renderView()}
        </section>
      </div>

      {detailModal && (
        <div
          className="supplier-modal-backdrop"
          role="presentation"
          onClick={() => {
            setDetailModal(null);
          }}
        >
          <article
            className="supplier-modal"
            role="dialog"
            aria-modal="true"
            aria-label={detailModal.kind === "product" ? "Product details" : "Order details"}
            onClick={(event) => {
              event.stopPropagation();
            }}
          >
            <div className="supplier-modal-head">
              <h2>{detailModal.kind === "product" ? "Product Details" : "Order Details"}</h2>
              <div className="supplier-modal-actions">
                {detailModal.kind === "product" && selectedProduct && (
                  isEditingProduct ? (
                    <>
                      <button
                        type="button"
                        className="supplier-secondary-btn"
                        onClick={() => {
                          setIsEditingProduct(false);
                          setProductDraft(selectedProduct);
                        }}
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        className="supplier-primary-btn"
                        onClick={() => {
                          setProducts((prev) =>
                            prev.map((product) =>
                              product.id === selectedProduct.id
                                ? { ...productDraft, updatedAt: "Just now" }
                                : product
                            )
                          );
                          setIsEditingProduct(false);
                        }}
                      >
                        Save
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      className="supplier-secondary-btn"
                      onClick={() => {
                        setIsEditingProduct(true);
                      }}
                    >
                      Edit
                    </button>
                  )
                )}

                {detailModal.kind === "order" && selectedOrder && (
                  isEditingOrder ? (
                    <>
                      <button
                        type="button"
                        className="supplier-secondary-btn"
                        onClick={() => {
                          setIsEditingOrder(false);
                          setOrderDraft(selectedOrder);
                        }}
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        className="supplier-primary-btn"
                        onClick={() => {
                          setOrders((prev) =>
                            prev.map((order) =>
                              order.id === selectedOrder.id ? orderDraft : order
                            )
                          );
                          setIsEditingOrder(false);
                        }}
                      >
                        Save
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      className="supplier-secondary-btn"
                      onClick={() => {
                        setIsEditingOrder(true);
                      }}
                    >
                      Edit
                    </button>
                  )
                )}

                <button
                  type="button"
                  className="supplier-close-btn"
                  onClick={() => {
                    setDetailModal(null);
                    setIsEditingProduct(false);
                    setIsEditingOrder(false);
                  }}
                  aria-label="Close details"
                >
                  <i className="bx bx-x" aria-hidden="true" />
                </button>
              </div>
            </div>

            {detailModal.kind === "product" && selectedProduct && (
              <div className="supplier-modal-body">
                <div className={`supplier-detail-grid ${isEditingProduct ? "is-editing" : ""}`}>
                  <div>
                    <p className="supplier-detail-label">Name</p>
                    {isEditingProduct ? (
                      <input
                        className="supplier-modal-input"
                        type="text"
                        value={productDraft.name}
                        onChange={(event) => {
                          setProductDraft((prev) => ({ ...prev, name: event.target.value }));
                        }}
                      />
                    ) : (
                      <p className="supplier-detail-value">{selectedProduct.name}</p>
                    )}
                  </div>
                  <div>
                    <p className="supplier-detail-label">Product ID</p>
                    {isEditingProduct ? (
                      <input
                        className="supplier-modal-input"
                        type="text"
                        value={productDraft.id}
                        onChange={(event) => {
                          setProductDraft((prev) => ({ ...prev, id: event.target.value.toUpperCase() }));
                        }}
                      />
                    ) : (
                      <p className="supplier-detail-value">{selectedProduct.id}</p>
                    )}
                  </div>
                  <div>
                    <p className="supplier-detail-label">Category</p>
                    {isEditingProduct ? (
                      <input
                        className="supplier-modal-input"
                        type="text"
                        value={productDraft.category}
                        onChange={(event) => {
                          setProductDraft((prev) => ({ ...prev, category: event.target.value }));
                        }}
                      />
                    ) : (
                      <p className="supplier-detail-value">{selectedProduct.category}</p>
                    )}
                  </div>
                  <div>
                    <p className="supplier-detail-label">Price</p>
                    {isEditingProduct ? (
                      <input
                        className="supplier-modal-input"
                        type="text"
                        value={productDraft.price}
                        onChange={(event) => {
                          setProductDraft((prev) => ({ ...prev, price: event.target.value }));
                        }}
                      />
                    ) : (
                      <p className="supplier-detail-value">{selectedProduct.price}</p>
                    )}
                  </div>
                  <div>
                    <p className="supplier-detail-label">Stock Status</p>
                    {isEditingProduct ? (
                      <select
                        className="supplier-modal-input"
                        value={productDraft.stock}
                        onChange={(event) => {
                          setProductDraft((prev) => ({ ...prev, stock: event.target.value }));
                        }}
                      >
                        <option>In Stock</option>
                        <option>Low Stock</option>
                      </select>
                    ) : (
                      <p className="supplier-detail-value">{selectedProduct.stock}</p>
                    )}
                  </div>
                  <div>
                    <p className="supplier-detail-label">Last Updated</p>
                    <p className="supplier-detail-value">{selectedProduct.updatedAt}</p>
                  </div>
                </div>

                <div className={`supplier-detail-block ${isEditingProduct ? "is-editing" : ""}`}>
                  <p className="supplier-detail-label">Description</p>
                  {isEditingProduct ? (
                    <textarea
                      className="supplier-modal-textarea"
                      value={productDraft.description}
                      onChange={(event) => {
                        setProductDraft((prev) => ({ ...prev, description: event.target.value }));
                      }}
                      rows={4}
                    />
                  ) : (
                    <p className="supplier-detail-text">{selectedProduct.description}</p>
                  )}
                </div>
              </div>
            )}

            {detailModal.kind === "order" && selectedOrder && (
              <div className="supplier-modal-body">
                <div className={`supplier-detail-grid ${isEditingOrder ? "is-editing" : ""}`}>
                  <div>
                    <p className="supplier-detail-label">Order ID</p>
                    {isEditingOrder ? (
                      <input
                        className="supplier-modal-input"
                        type="text"
                        value={orderDraft.id}
                        onChange={(event) => {
                          setOrderDraft((prev) => ({ ...prev, id: event.target.value.toUpperCase() }));
                        }}
                      />
                    ) : (
                      <p className="supplier-detail-value">#{selectedOrder.id}</p>
                    )}
                  </div>
                  <div>
                    <p className="supplier-detail-label">Customer</p>
                    {isEditingOrder ? (
                      <input
                        className="supplier-modal-input"
                        type="text"
                        value={orderDraft.customer}
                        onChange={(event) => {
                          setOrderDraft((prev) => ({ ...prev, customer: event.target.value }));
                        }}
                      />
                    ) : (
                      <p className="supplier-detail-value">{selectedOrder.customer}</p>
                    )}
                  </div>
                  <div>
                    <p className="supplier-detail-label">Total Items</p>
                    {isEditingOrder ? (
                      <input
                        className="supplier-modal-input"
                        type="number"
                        min={1}
                        value={orderDraft.items}
                        onChange={(event) => {
                          setOrderDraft((prev) => ({
                            ...prev,
                            items: Number(event.target.value) || 0,
                          }));
                        }}
                      />
                    ) : (
                      <p className="supplier-detail-value">{selectedOrder.items}</p>
                    )}
                  </div>
                  <div>
                    <p className="supplier-detail-label">Order Total</p>
                    {isEditingOrder ? (
                      <input
                        className="supplier-modal-input"
                        type="text"
                        value={orderDraft.total}
                        onChange={(event) => {
                          setOrderDraft((prev) => ({ ...prev, total: event.target.value }));
                        }}
                      />
                    ) : (
                      <p className="supplier-detail-value">{selectedOrder.total}</p>
                    )}
                  </div>
                  <div>
                    <p className="supplier-detail-label">Status</p>
                    {isEditingOrder ? (
                      <select
                        className="supplier-modal-input"
                        value={orderDraft.status}
                        onChange={(event) => {
                          setOrderDraft((prev) => ({ ...prev, status: event.target.value }));
                        }}
                      >
                        <option>Processing</option>
                        <option>Packed</option>
                        <option>Shipped</option>
                        <option>Delivered</option>
                      </select>
                    ) : (
                      <p className="supplier-detail-value">{selectedOrder.status}</p>
                    )}
                  </div>
                  <div>
                    <p className="supplier-detail-label">Expected Delivery</p>
                    {isEditingOrder ? (
                      <input
                        className="supplier-modal-input"
                        type="text"
                        value={orderDraft.deliveryDate}
                        onChange={(event) => {
                          setOrderDraft((prev) => ({ ...prev, deliveryDate: event.target.value }));
                        }}
                      />
                    ) : (
                      <p className="supplier-detail-value">{selectedOrder.deliveryDate}</p>
                    )}
                  </div>
                </div>

                <div className={`supplier-detail-block ${isEditingOrder ? "is-editing" : ""}`}>
                  <p className="supplier-detail-label">Notes</p>
                  {isEditingOrder ? (
                    <textarea
                      className="supplier-modal-textarea"
                      value={orderDraft.notes}
                      onChange={(event) => {
                        setOrderDraft((prev) => ({ ...prev, notes: event.target.value }));
                      }}
                      rows={4}
                    />
                  ) : (
                    <p className="supplier-detail-text">{selectedOrder.notes}</p>
                  )}
                </div>
              </div>
            )}
          </article>
        </div>
      )}
    </main>
  );
}
