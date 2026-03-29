import React from "react";
import "./footer.css";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-inner">
        
        <div className="footer-top">
          <div className="footer-brand-block">
            <div className="footer-brand">PantryPicks</div>
            <p className="footer-subtitle">
              Fresh groceries delivered with care.
            </p>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-meta">
            © {year} PantryPicks. All rights reserved.
          </div>
        </div>

      </div>
    </footer>
  );
}