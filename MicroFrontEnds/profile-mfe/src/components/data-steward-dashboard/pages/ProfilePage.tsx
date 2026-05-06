import React from "react";

type CurrentUser = {
  userEmail?: string;
  userFistName?: string;
  userLastName?: string;
  userStatus?: string;
} | null;

type StewardProfile = {
  name: string;
  role: string;
  email: string;
  team: string;
  region: string;
};

type ProfilePageProps = {
  currentUser?: CurrentUser;
  stewardProfile: StewardProfile;
};

export default function ProfilePage({ currentUser, stewardProfile }: ProfilePageProps) {
  return (
    <section className="steward-profile" aria-label="Data steward profile">
      <article className="steward-profile-card">
        <div className="steward-panel-head">
          <h2>Profile Details</h2>
        </div>
        <div className="steward-grid">
          <div><label>Name</label><p>{[currentUser?.userFistName, currentUser?.userLastName].filter(Boolean).join(" ") || stewardProfile.name}</p></div>
          <div><label>Role</label><p>{stewardProfile.role}</p></div>
          <div><label>Email</label><p>{currentUser?.userEmail || stewardProfile.email}</p></div>
          <div><label>Team</label><p>{stewardProfile.team}</p></div>
          <div><label>Region</label><p>{stewardProfile.region}</p></div>
          <div><label>Status</label><p>{currentUser?.userStatus || "Profile ready"}</p></div>
        </div>
      </article>
    </section>
  );
}
