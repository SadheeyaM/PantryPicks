import React from "react";

type ProfilePageProps = {
  currentUser: any;
  supplierProfile: { company: string; supplierId: string; email: string };
  profileForm: { userFistName: string; userLastName: string; userPhoneNumber: string };
  setProfileForm: React.Dispatch<React.SetStateAction<{ userFistName: string; userLastName: string; userPhoneNumber: string }>>;
  isSavingProfile: boolean;
  profileSaved: boolean;
  onSaveProfile: (event: React.FormEvent<HTMLFormElement>) => Promise<void>;
  summaryStats: { totalProducts: string; pendingApprovals: string; lowStockAlerts: string };
};

export default function ProfilePage({
  currentUser,
  supplierProfile,
  profileForm,
  setProfileForm,
  isSavingProfile,
  profileSaved,
  onSaveProfile,
  summaryStats,
}: ProfilePageProps) {
  const displayName = [profileForm.userFistName, profileForm.userLastName].filter(Boolean).join(" ") || currentUser?.userEmail || "Account";
  const profileCompleted = Boolean(profileForm.userFistName && profileForm.userLastName && profileForm.userPhoneNumber);

  return (
    <section className="supplier-profile-layout" aria-label="Supplier profile">
      <article className="supplier-profile-card">
        <div className="supplier-panel-head">
          <h2>Company Profile</h2>
          <span className="supplier-profile-state">{profileCompleted ? "Profile complete" : "Finish your profile"}</span>
        </div>

        <form className="supplier-detail-grid" onSubmit={onSaveProfile}>
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
            <input
              className="supplier-profile-input"
              value={profileForm.userFistName}
              onChange={(event) => setProfileForm((prev) => ({ ...prev, userFistName: event.target.value }))}
              placeholder="First name"
            />
          </div>
          <div>
            <p className="supplier-detail-label">Email</p>
            <p className="supplier-detail-value">{currentUser?.userEmail || supplierProfile.email}</p>
          </div>
          <div>
            <p className="supplier-detail-label">Phone</p>
            <input
              className="supplier-profile-input"
              value={profileForm.userPhoneNumber}
              onChange={(event) => setProfileForm((prev) => ({ ...prev, userPhoneNumber: event.target.value }))}
              placeholder="Phone number"
            />
          </div>
          <div>
            <p className="supplier-detail-label">Last Name</p>
            <input
              className="supplier-profile-input"
              value={profileForm.userLastName}
              onChange={(event) => setProfileForm((prev) => ({ ...prev, userLastName: event.target.value }))}
              placeholder="Last name"
            />
          </div>
          <div>
            <p className="supplier-detail-label">Name Preview</p>
            <p className="supplier-detail-value">{displayName}</p>
          </div>
          <div>
            <p className="supplier-detail-label">Status</p>
            <p className="supplier-detail-value">{currentUser?.userStatus || "Pending completion"}</p>
          </div>
          <div className="supplier-field-full supplier-form-actions">
            <button className="supplier-primary-btn" type="submit" disabled={isSavingProfile}>
              {isSavingProfile ? "Saving..." : "Save Profile"}
            </button>
            {profileSaved ? <p className="supplier-success-text">Profile saved.</p> : null}
          </div>
        </form>
      </article>

      <article className="supplier-profile-card">
        <div className="supplier-panel-head">
          <h2>Access Summary</h2>
        </div>
        <div className="supplier-summary-grid compact">
          {[
            { label: "Total Products", value: summaryStats.totalProducts, icon: "bx-package" },
            { label: "Pending Approvals", value: summaryStats.pendingApprovals, icon: "bx-time" },
            { label: "Live Orders", value: "36", icon: "bx-receipt" },
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
        </div>
      </article>
    </section>
  );
}
