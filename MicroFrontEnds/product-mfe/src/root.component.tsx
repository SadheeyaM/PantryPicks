import React, { useEffect, useState } from "react";
import "../../shared-mfe/src/styles/global.css";
import HomePage from "./components/homePage/homepage";
import CategoryItemsPage from "./components/categoryItems/categoryItems";
import ItemPage from "./components/itemPage/itemPage";

const Header = require("../../shared-mfe/src/components/Header").default;
const Footer = require("../../shared-mfe/src/components/Footer").default;

export default function Root(_props: unknown) {
  const [currentPage, setCurrentPage] = useState<"home" | "category" | "item">("home");
  const [selectedCategory, setSelectedCategory] = useState("Vegetables");
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);

  useEffect(() => {
    const syncPageWithHash = () => {
      const hash = window.location.hash.replace("#", "").trim();

      if (hash.startsWith("category/")) {
        const categoryFromHash = decodeURIComponent(hash.split("/")[1] || "Vegetables");
        setSelectedCategory(categoryFromHash);
        setCurrentPage("category");
        return;
      }

      if (hash.startsWith("product/")) {
        const productId = Number(hash.split("/")[1]);
        if (!Number.isNaN(productId) && productId > 0) {
          setSelectedProductId(productId);
          setCurrentPage("item");
          return;
        }
      }

      setCurrentPage("home");
    };

    syncPageWithHash();
    window.addEventListener("hashchange", syncPageWithHash);

    return () => {
      window.removeEventListener("hashchange", syncPageWithHash);
    };
  }, []);

  const handleCategoryClick = (categoryName: string) => {
    setSelectedCategory(categoryName);
    setCurrentPage("category");
    window.location.hash = `category/${encodeURIComponent(categoryName)}`;
    window.scrollTo(0, 0);
  };

  const handleBackToHome = () => {
    setCurrentPage("home");
    window.location.hash = "home";
    window.scrollTo(0, 0);
  };

  const handleBackToCategory = () => {
    setCurrentPage("category");
    window.location.hash = `category/${encodeURIComponent(selectedCategory)}`;
    window.scrollTo(0, 0);
  };

  const handleGoToCart = () => {
    window.location.href = "/cart";
    window.scrollTo(0, 0);
  };

  return (
    <>
      <Header />
      {currentPage === "home" ? (
        <HomePage
          onCategoryClick={handleCategoryClick}
          onBrowseCategories={() => handleCategoryClick("Vegetables")}
        />
      ) : currentPage === "category" ? (
        <CategoryItemsPage category={selectedCategory} onBackToHome={handleBackToHome} />
      ) : currentPage === "item" ? (
        <ItemPage
          productId={selectedProductId || 1}
          onBackToCategory={handleBackToCategory}
          onGoToCart={handleGoToCart}
        />
      ) : (
        <HomePage
          onCategoryClick={handleCategoryClick}
          onBrowseCategories={() => handleCategoryClick("Vegetables")}
        />
      )}
      <Footer />
    </>
  );
}
