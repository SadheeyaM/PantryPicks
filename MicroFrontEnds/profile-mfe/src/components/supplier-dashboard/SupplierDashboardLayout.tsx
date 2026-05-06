import React from "react";
import logoImage from "../../../../shared-mfe/src/assets/Logo.jpg";

type SupplierView = "overview" | "products" | "add-product" | "orders" | "profile" | "edit-product";

type NavItem = {
  key: SupplierView;
  label: string;
  icon: string;
};

type SupplierDashboardLayoutProps = {
  activeView: SupplierView;
  navItems: NavItem[];
  onNavigate: (view: SupplierView) => void;
  onGoToAddProduct: () => void;
  children: React.ReactNode;
};

export default function SupplierDashboardLayout({
  activeView,
  navItems,
  onNavigate,
  onGoToAddProduct,
  children,
}: SupplierDashboardLayoutProps) {
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
                  onNavigate(item.key);
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
                      : activeView === "edit-product"
                        ? "Edit Product"
                      : activeView === "orders"
                        ? "Orders"
                        : "Profile"}
              </h1>
            </div>
            {(activeView === "overview" || activeView === "products") && (
              <button className="supplier-primary-btn" type="button" onClick={onGoToAddProduct}>
                <i className="bx bx-plus" aria-hidden="true" />
                Add New Product
              </button>
            )}
          </header>

          {children}
        </section>
      </div>
    </main>
  );
}
