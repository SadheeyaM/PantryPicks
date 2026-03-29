import React, { useEffect, useState } from "react";
import Header from "../../shared-mfe/src/components/Header";
import Footer from "../../shared-mfe/src/components/Footer";
import "../../shared-mfe/src/styles/global.css";
import HomePage from "./components/homePage/homepage";
import CategoryItemsPage from "./components/categoryItems/categoryItems";
import ItemPage from "./components/itemPage/itemPage";

export default function Root(props) {
  const [currentPage, setCurrentPage] = useState<"home" | "category" | "item">("home");
  const [selectedCategory, setSelectedCategory] = useState("Vegetables");
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);

  useEffect(() => {
    const categoryIdMap: Record<string, string> = {
      "1": "Vegetables",
      "2": "Fruits",
      "3": "Dairy",
      "4": "Oils",
      "5": "Pulses",
      "6": "Bread",
    };

    const syncPageWithLocation = () => {
      const pathname = window.location.pathname.toLowerCase();
      const hash = window.location.hash.replace("#", "").trim();

      // Support sample URL endpoints such as /homepage and /category/1.
      if (pathname === "/homepage") {
        setCurrentPage("home");
        return;
      }

      if (pathname.startsWith("/category/")) {
        const categoryId = pathname.split("/")[2] || "1";
        setSelectedCategory(categoryIdMap[categoryId] || "Vegetables");
        setCurrentPage("category");
        return;
      }

      if (pathname.startsWith("/product/")) {
        const productId = Number(pathname.split("/")[2]);
        if (!Number.isNaN(productId) && productId > 0) {
          setSelectedProductId(productId);
          setCurrentPage("item");
          return;
        }
      }

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

    syncPageWithLocation();
    window.addEventListener("hashchange", syncPageWithLocation);
    window.addEventListener("popstate", syncPageWithLocation);

    return () => {
      window.removeEventListener("hashchange", syncPageWithLocation);
      window.removeEventListener("popstate", syncPageWithLocation);
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
