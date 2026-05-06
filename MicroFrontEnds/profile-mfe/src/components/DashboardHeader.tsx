import React from "react";
import logoImage from "../../../shared-mfe/src/assets/Logo.jpg";
import "./dashboard-header.css";

type DashboardHeaderProps = {
  role: "supplier" | "datasteward";
  currentUser?: {
    userEmail?: string;
    userFistName?: string;
    userLastName?: string;
    userStatus?: string;
  } | null;
  profileLoading?: boolean;
  profileError?: string | null;
};

export default function DashboardHeader({ role, currentUser, profileLoading, profileError }: DashboardHeaderProps) {
  const roleLabel = role === "datasteward" ? "Data Steward" : "Supplier";
  const displayName = [currentUser?.userFistName, currentUser?.userLastName].filter(Boolean).join(" ") || currentUser?.userEmail || "Account";

  const handleSignOut = () => {
    window.localStorage.removeItem("accessToken");
    window.localStorage.removeItem("refreshToken");
    window.location.href = "/products";
  };

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
          <div className="dashboard-profile-pill">
            <span className="dashboard-profile-name">{displayName}</span>
            <span className="dashboard-profile-role">{roleLabel}</span>
          </div>
          <button type="button" className="dashboard-link-btn" onClick={handleSignOut}>Sign Out</button>
        </div>
      </div>
    </header>
  );
}
