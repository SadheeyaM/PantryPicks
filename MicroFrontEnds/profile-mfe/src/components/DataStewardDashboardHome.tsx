import React, { useMemo, useState } from "react";
import logoImage from "../../../shared-mfe/src/assets/Logo.jpg";
import "./data-steward-dashboard.css";

type StewardView = "overview" | "products" | "approvals" | "profile";
type StewardModal = { kind: "product" | "approval"; id: string } | null;

const stewardProducts = [
  {
    id: "PROD-2401",
    name: "Cherry Tomatoes",
    category: "Vegetables",
    supplier: "FreshFields Foods",
    status: "Approved",
    price: "$5.99",
    updatedAt: "Today",
    notes: "Category and pricing validated.",
  },
  {
    id: "PROD-2402",
    name: "Greek Yogurt",
    category: "Dairy",
    supplier: "North Dairy Co",
    status: "Approved",
    price: "$4.75",
    updatedAt: "Today",
    notes: "Nutrition metadata and image quality passed checks.",
  },
  {
    id: "PROD-2403",
    name: "Sunflower Oil",
    category: "Oils",
    supplier: "Harvest Mills",
    status: "Approved",
    price: "$10.40",
    updatedAt: "Yesterday",
    notes: "Packaging dimensions synced with catalog template.",
  },
];

const initialApprovals = [
  {
    id: "PROD-2501",
    name: "Organic Spinach",
    category: "Vegetables",
    supplier: "Green Basket Farms",
    submittedAt: "2 hours ago",
    price: "$3.85",
    notes: "New seasonal listing with updated certificate attached.",
  },
  {
    id: "PROD-2502",
    name: "Multigrain Bread",
    category: "Bread",
    supplier: "Daily Bake House",
    submittedAt: "4 hours ago",
    price: "$3.45",
    notes: "Revised ingredients and allergen information included.",
  },
];

const stewardProfile = {
  name: "Ananya Rao",
  role: "Data Steward",
  email: "ananya.rao@pantrypicks.com",
  team: "Catalog Quality",
  region: "North America",
  joined: "Aug 2023",
};

export default function DataStewardDashboardHome() {
  const [activeView, setActiveView] = useState<StewardView>("overview");
  const [modal, setModal] = useState<StewardModal>(null);
  const [pendingApprovals, setPendingApprovals] = useState(initialApprovals);
  const [approvedToday, setApprovedToday] = useState(6);

  const selectedProduct = useMemo(() => {
    if (!modal || modal.kind !== "product") return null;
    return stewardProducts.find((item) => item.id === modal.id) ?? null;
  }, [modal]);

  const selectedApproval = useMemo(() => {
    if (!modal || modal.kind !== "approval") return null;
    return pendingApprovals.find((item) => item.id === modal.id) ?? null;
  }, [modal, pendingApprovals]);

  const navItems: Array<{ key: StewardView; label: string; icon: string }> = [
    { key: "overview", label: "Overview", icon: "bx-home-alt-2" },
    { key: "products", label: "Products", icon: "bx-package" },
    { key: "approvals", label: "Approvals", icon: "bx-check-shield" },
    { key: "profile", label: "Profile", icon: "bx-user-circle" },
  ];

  const handleApprovalAction = (action: "approve" | "reject") => {
    if (!selectedApproval) return;
    setPendingApprovals((prev) => prev.filter((item) => item.id !== selectedApproval.id));
    if (action === "approve") {
      setApprovedToday((prev) => prev + 1);
    }
    setModal(null);
  };

  return (
    <main className="steward-page">
      <div className="steward-layout">
        <aside className="steward-sidebar" aria-label="Data steward navigation">
          <div className="steward-brand">
            <img src={logoImage} alt="Sysco logo" className="steward-brand-logo" />
            <div>
              <p className="steward-brand-title">Data Steward Hub</p>
              <p className="steward-brand-subtitle">PantryPicks</p>
            </div>
          </div>

          <nav className="steward-nav">
            {navItems.map((item) => (
              <button
                key={item.key}
                type="button"
                className={`steward-nav-item ${activeView === item.key ? "active" : ""}`}
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

        <section className="steward-main">
          <header className="steward-topbar">
            <div>
              <p className="steward-kicker">Data Steward Dashboard</p>
              <h1>
                {activeView === "overview"
                  ? "Catalog quality and approvals"
                  : activeView === "products"
                    ? "Product Catalog"
                    : activeView === "approvals"
                      ? "Pending Approvals"
                      : "Profile"}
              </h1>
            </div>
          </header>

          {activeView === "overview" && (
            <section className="steward-summary" aria-label="Data steward summary">
              <article className="steward-card">
                <p>Total Products</p>
                <h3>{stewardProducts.length}</h3>
              </article>
              <article className="steward-card">
                <p>Pending Approvals</p>
                <h3>{pendingApprovals.length}</h3>
              </article>
              <article className="steward-card">
                <p>Approved Today</p>
                <h3>{approvedToday}</h3>
              </article>
            </section>
          )}

          {activeView === "products" && (
            <section className="steward-list-shell" aria-label="Product list">
              <div className="steward-panel-head">
                <h2>All Products</h2>
                <span>{stewardProducts.length} items</span>
              </div>
              <div className="steward-list">
                {stewardProducts.map((product) => (
                  <button
                    key={product.id}
                    type="button"
                    className="steward-row"
                    onClick={() => {
                      setModal({ kind: "product", id: product.id });
                    }}
                  >
                    <div>
                      <p className="steward-row-title">{product.name}</p>
                      <p className="steward-row-sub">{product.id} • {product.category} • {product.supplier}</p>
                    </div>
                    <div className="steward-row-right">
                      <span className="steward-badge ok">{product.status}</span>
                      <i className="bx bx-chevron-right" aria-hidden="true" />
                    </div>
                  </button>
                ))}
              </div>
            </section>
          )}

          {activeView === "approvals" && (
            <section className="steward-list-shell" aria-label="Approval queue">
              <div className="steward-panel-head">
                <h2>Approval Queue</h2>
                <span>{pendingApprovals.length} pending</span>
              </div>
              <div className="steward-list">
                {pendingApprovals.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className="steward-row"
                    onClick={() => {
                      setModal({ kind: "approval", id: item.id });
                    }}
                  >
                    <div>
                      <p className="steward-row-title">{item.name}</p>
                      <p className="steward-row-sub">{item.id} • {item.category} • {item.supplier}</p>
                    </div>
                    <div className="steward-row-right">
                      <span className="steward-badge warn">Review Needed</span>
                      <i className="bx bx-chevron-right" aria-hidden="true" />
                    </div>
                  </button>
                ))}
                {pendingApprovals.length === 0 && (
                  <div className="steward-empty">No pending approvals right now.</div>
                )}
              </div>
            </section>
          )}

          {activeView === "profile" && (
            <section className="steward-profile" aria-label="Data steward profile">
              <article className="steward-profile-card">
                <div className="steward-panel-head">
                  <h2>Profile Details</h2>
                </div>
                <div className="steward-grid">
                  <div><label>Name</label><p>{stewardProfile.name}</p></div>
                  <div><label>Role</label><p>{stewardProfile.role}</p></div>
                  <div><label>Email</label><p>{stewardProfile.email}</p></div>
                  <div><label>Team</label><p>{stewardProfile.team}</p></div>
                  <div><label>Region</label><p>{stewardProfile.region}</p></div>
                  <div><label>Joined</label><p>{stewardProfile.joined}</p></div>
                </div>
              </article>
            </section>
          )}
        </section>
      </div>

      {modal && (
        <div
          className="steward-modal-backdrop"
          role="presentation"
          onClick={() => {
            setModal(null);
          }}
        >
          <article
            className="steward-modal"
            role="dialog"
            aria-modal="true"
            onClick={(event) => {
              event.stopPropagation();
            }}
          >
            <div className="steward-panel-head">
              <h2>{modal.kind === "product" ? "Product Details" : "Approval Details"}</h2>
              <button className="steward-close" type="button" onClick={() => setModal(null)}>
                <i className="bx bx-x" aria-hidden="true" />
              </button>
            </div>

            {modal.kind === "product" && selectedProduct && (
              <div className="steward-grid">
                <div><label>Product ID</label><p>{selectedProduct.id}</p></div>
                <div><label>Name</label><p>{selectedProduct.name}</p></div>
                <div><label>Category</label><p>{selectedProduct.category}</p></div>
                <div><label>Supplier</label><p>{selectedProduct.supplier}</p></div>
                <div><label>Price</label><p>{selectedProduct.price}</p></div>
                <div><label>Status</label><p>{selectedProduct.status}</p></div>
                <div><label>Last Updated</label><p>{selectedProduct.updatedAt}</p></div>
                <div className="full"><label>Notes</label><p>{selectedProduct.notes}</p></div>
              </div>
            )}

            {modal.kind === "approval" && selectedApproval && (
              <>
                <div className="steward-grid">
                  <div><label>Product ID</label><p>{selectedApproval.id}</p></div>
                  <div><label>Name</label><p>{selectedApproval.name}</p></div>
                  <div><label>Category</label><p>{selectedApproval.category}</p></div>
                  <div><label>Supplier</label><p>{selectedApproval.supplier}</p></div>
                  <div><label>Price</label><p>{selectedApproval.price}</p></div>
                  <div><label>Submitted</label><p>{selectedApproval.submittedAt}</p></div>
                  <div className="full"><label>Notes</label><p>{selectedApproval.notes}</p></div>
                </div>
                <div className="steward-actions">
                  <button type="button" className="steward-btn reject" onClick={() => handleApprovalAction("reject")}>
                    Reject
                  </button>
                  <button type="button" className="steward-btn approve" onClick={() => handleApprovalAction("approve")}>
                    Approve
                  </button>
                </div>
              </>
            )}
          </article>
        </div>
      )}
    </main>
  );
}
