import React from "react";
import logoImage from "../../../shared-mfe/src/assets/Logo.jpg";
import "./dashboard-header.css";

type DashboardHeaderProps = {
  role: "supplier" | "datasteward";
};

export default function DashboardHeader({ role }: DashboardHeaderProps) {
  const roleLabel = role === "datasteward" ? "Data Steward" : "Supplier";

  return (
    <header className="dashboard-header" role="banner">
      <div className="dashboard-header-inner">
        <button
          type="button"
          className="dashboard-logo-btn"
          onClick={() => {
            window.location.href = "/products";
          }}
          aria-label="Go to products"
        >
          <img src={logoImage} alt="Sysco logo" className="dashboard-logo" />
          <div className="dashboard-brand-copy">
            <p className="dashboard-brand-title">PantryPicks Portal</p>
            <p className="dashboard-brand-subtitle">{roleLabel} Workspace</p>
          </div>
        </button>

        <div className="dashboard-header-actions">
          {/* <button
            type="button"
            className="dashboard-link-btn"
            onClick={() => {
              window.location.href = "/products";
            }}
          >
            Storefront
          </button>
          <button
            type="button"
            className="dashboard-link-btn"
            onClick={() => {
              window.location.href = "/cart";
            }}
          >
            Cart
          </button> */}
        </div>
      </div>
    </header>
  );
}
