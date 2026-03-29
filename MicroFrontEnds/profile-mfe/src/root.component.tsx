import React, { useEffect, useState } from "react";
import Footer from "../../shared-mfe/src/components/Footer";
import "../../shared-mfe/src/styles/global.css";
import SupplierDashboardHome from "./components/SupplierDashboardHome";
import DataStewardDashboardHome from "./components/DataStewardDashboardHome";
import DashboardHeader from "./components/DashboardHeader";

type ProfileRole = "supplier" | "datasteward";

function getRoleFromPath(): ProfileRole {
  const path = window.location.pathname.toLowerCase();
  return path.includes("/profile/datasteward") ? "datasteward" : "supplier";
}

export default function Root(props) {
  const [role, setRole] = useState<ProfileRole>(() => getRoleFromPath());

  useEffect(() => {
    const syncRoleFromPath = () => {
      const path = window.location.pathname.toLowerCase();
      if (path === "/profile" || path === "/profile/") {
        window.history.replaceState({}, "", "/profile/supplier");
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
      <DashboardHeader role={role} />
      {role === "supplier" ? <SupplierDashboardHome /> : <DataStewardDashboardHome />}
      <Footer />
    </>
  );
}
