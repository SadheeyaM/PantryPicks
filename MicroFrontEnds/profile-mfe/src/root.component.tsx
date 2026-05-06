import React, { useEffect, useState } from "react";
import "../../shared-mfe/src/styles/global.css";
import UserProfilePage from "./components/UserProfilePage";
import SupplierDashboardHome from "./components/SupplierDashboardHome";
import DataStewardDashboardHome from "./components/DataStewardDashboardHome";
import DashboardHeader from "./components/DashboardHeader";
import "./components/user-profile-page.css";

const Header = require("../../shared-mfe/src/components/Header").default;
const Footer = require("../../shared-mfe/src/components/Footer").default;

type ProfileRole = "supplier" | "datasteward";

function getRoleFromPath(): ProfileRole {
  const path = window.location.pathname.toLowerCase();
  return path.includes("/profile/datasteward") ? "datasteward" : "supplier";
}

function getRouteKind(): "profile" | "supplier" | "datasteward" {
  const path = window.location.pathname.toLowerCase();

  if (path === "/profile" || path === "/profile/") {
    return "profile";
  }

  if (path.includes("/profile/datasteward")) {
    return "datasteward";
  }

  return "supplier";
}

type CurrentUser = {
  id?: number;
  userId?: number | string;
  userEmail?: string;
  userFistName?: string;
  userLastName?: string;
  userPhoneNumber?: string;
  userRole?: string;
  userStatus?: string;
};

const BFF_BASE_URL = "http://localhost:3000";

export default function Root(_props: unknown) {
  const [routeKind, setRouteKind] = useState<"profile" | "supplier" | "datasteward">(() => getRouteKind());
  const [role, setRole] = useState<ProfileRole>(() => getRoleFromPath());
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);

  // Fetch current user on mount and when routeKind changes
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        setProfileLoading(true);
        setProfileError(null);

        const accessToken = window.localStorage.getItem("accessToken");
        if (!accessToken) {
          setProfileError("No authentication token found");
          setCurrentUser(null);
          return;
        }

        const response = await fetch(`${BFF_BASE_URL}/api/v1/users/me`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            setProfileError("Authentication failed. Please log in again.");
          } else {
            setProfileError("Could not fetch user profile");
          }
          setCurrentUser(null);
          return;
        }

        const data = await response.json();
        setCurrentUser(data.data || data);
      } catch (error) {
        setProfileError(error instanceof Error ? error.message : "Failed to fetch profile");
        setCurrentUser(null);
      } finally {
        setProfileLoading(false);
      }
    };

    fetchCurrentUser();
  }, [routeKind]);

  useEffect(() => {
    const syncRoleFromPath = () => {
      const currentRouteKind = getRouteKind();
      setRouteKind(currentRouteKind);
      if (currentRouteKind === "profile") {
        setRole("supplier");
        return;
      }
      setRole(getRoleFromPath());
    };

    syncRoleFromPath();
    window.addEventListener("popstate", syncRoleFromPath);

    return () => {
      window.removeEventListener("popstate", syncRoleFromPath);
    };
  }, []);

  return (
    <>
      {routeKind === "profile" ? (
        <>
          <Header />
          <div className="profile-page-shell">
            <UserProfilePage currentUser={currentUser} profileLoading={profileLoading} profileError={profileError} />
          </div>
          <Footer />
        </>
      ) : (
        <>
          <DashboardHeader
            role={role}
            currentUser={currentUser}
            profileLoading={profileLoading}
            profileError={profileError}
          />
          {role === "supplier" ? (
            <SupplierDashboardHome currentUser={currentUser} />
          ) : (
            <DataStewardDashboardHome currentUser={currentUser} />
          )}
        </>
      )}
    </>
  );
}
