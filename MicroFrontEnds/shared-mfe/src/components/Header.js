import React, { useState, useRef, useEffect } from "react";
import "./header.css";
import logoImage from "../assets/Logo.jpg";


export default function Header() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);

  const parseJwt = (token) => {
    try {
      const payload = token.split(".")[1];
      if (!payload) return null;
      const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
      const json = decodeURIComponent(
        atob(normalized)
          .split("")
          .map((char) => `%${(`00${char.charCodeAt(0).toString(16)}`).slice(-2)}`)
          .join("")
      );
      return JSON.parse(json);
    } catch (_error) {
      return null;
    }
  };

  const accessToken = window.localStorage.getItem("accessToken");
  const tokenPayload = accessToken ? parseJwt(accessToken) : null;
  const normalizedRole = String(tokenPayload?.role || "").toUpperCase();
  const isAuthenticated = Boolean(accessToken);
  const isSupplier = normalizedRole === "SUPPLIER";
  const isDataSteward = normalizedRole === "DATA_STEWARD" || normalizedRole === "DATASTEWARD";

  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    }

    if (isProfileOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isProfileOpen]);

  return (
    <header className="header">
      <div className="header-left">
        <button
          type="button"
          className="logo-button"
          onClick={() => {
            window.location.href = "/products";
          }}
          aria-label="Go to products"
        >
          <img src={logoImage} alt="Sysco logo" className="logo-image" />
        </button>
      </div>

      <div className="header-center">
        <input
          type="text"
          placeholder="Search products..."
          className="search-input"
        />
        <i className="bx bx-search search-icon"></i>
      </div>

      <div className="header-right">
        <div className="profile-menu" ref={profileRef}>
          <button
            type="button"
            className="profile-button"
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            aria-label="Toggle profile menu"
          >
            <i className="bx bx-user icon"></i>
          </button>

          {isProfileOpen && (
            <div className="profile-dropdown">
              {!isAuthenticated ? (
                <>
                  <button
                    type="button"
                    className="dropdown-item"
                    onClick={() => {
                      window.location.href = "/auth";
                      setIsProfileOpen(false);
                    }}
                  >
                    <i className="bx bx-log-in"></i>
                    Login
                  </button>
                  <button
                    type="button"
                    className="dropdown-item"
                    onClick={() => {
                      window.location.href = "/auth?mode=signup";
                      setIsProfileOpen(false);
                    }}
                  >
                    <i className="bx bx-user-plus"></i>
                    Sign Up
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    className="dropdown-item"
                    onClick={() => {
                      if (isSupplier) {
                        window.location.href = "/profile/supplier";
                      } else if (isDataSteward) {
                        window.location.href = "/profile/datasteward";
                      } else {
                        window.location.href = "/profile";
                      }
                      setIsProfileOpen(false);
                    }}
                  >
                    <i className="bx bx-user-circle"></i>
                    {isSupplier || isDataSteward ? "View Dashboard" : "View Profile"}
                  </button>
                  <button
                    type="button"
                    className="dropdown-item"
                    onClick={() => {
                      window.localStorage.removeItem("accessToken");
                      window.location.href = "/auth";
                      setIsProfileOpen(false);
                    }}
                  >
                    <i className="bx bx-log-out"></i>
                    Sign Out
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        <button
          type="button"
          className="cart-button"
          onClick={() => {
            window.location.href = "/cart";
          }}
          aria-label="Go to cart"
        >
          <div className="cart-wrapper">
            <i className="bx bx-cart icon"></i>
            <span className="cart-count">2</span>
          </div>
        </button>
      </div>
    </header>
  );
}