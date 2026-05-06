import React, { useEffect, useState } from "react";
import homeBanner from "../../assets/HomeBannerNew.png";
import "./homepage.css";

const BFF_BASE_URL = "http://localhost:3000";

type BackendCategory = {
  categoryId?: number | string;
  categoryName?: string;
  categoryDescription?: string;
  categoryImage?: string;
};

type HomeCategoryCard = {
  title: string;
  icon: string;
  desc: string;
  image?: string;
};

interface HomePageProps {
  onCategoryClick?: (categoryName: string) => void;
  onBrowseCategories?: () => void;
}

export default function HomePage({ onCategoryClick, onBrowseCategories }: HomePageProps) {
  const fallbackCategories: HomeCategoryCard[] = [
    { title: "Vegetables", icon: "bx-leaf", desc: "Farm-fresh greens", image: "" },
    { title: "Fruits", icon: "bx-apple", desc: "Sweet and seasonal", image: "" },
    { title: "Dairy", icon: "bx-coffee", desc: "Milk, curd and cheese", image: "" },
    { title: "Oils", icon: "bx-droplet", desc: "Daily cooking oils", image: "" },
    { title: "Pulses", icon: "bx-bowl-rice", desc: "Protein-rich staples", image: "" },
    { title: "Bread", icon: "bx-food-menu", desc: "Freshly baked loaves", image: "" },
  ];

  const [categories, setCategories] = useState<HomeCategoryCard[]>(fallbackCategories);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);

  useEffect(() => {
    setIsLoadingCategories(true);
    setCategoriesError(null);

    const accessToken = window.localStorage.getItem("accessToken");
    const headers: Record<string, string> = {};
    if (accessToken) {
      headers.Authorization = `Bearer ${accessToken}`;
    }

    fetch(`${BFF_BASE_URL}/api/v1/categories`, { headers })
      .then((response) =>
        response
          .json()
          .catch(() => [])
          .then((body) => ({ response, body }))
      )
      .then(({ response, body }) => {
        if (!response.ok) {
          throw new Error(body?.message || "Failed to load categories.");
        }

        const list: BackendCategory[] = Array.isArray(body)
          ? body
          : Array.isArray(body?.data)
            ? body.data
            : [];

        const mapped = list
          .filter((item) => item.categoryName)
          .map((item, index) => {
            const categoryName = String(item.categoryName || "");
            const iconMap: Record<string, string> = {
              Vegetables: "bx-leaf",
              Fruits: "bx-apple",
              Dairy: "bx-coffee",
              Oils: "bx-droplet",
              Pulses: "bx-bowl-rice",
              Bread: "bx-food-menu",
            };

            return {
              title: categoryName,
              icon: iconMap[categoryName] || ["bx-package", "bx-store", "bx-dish"][index % 3],
              desc: item.categoryDescription || `Browse ${categoryName.toLowerCase()} products`,
              image: String(item.categoryImage || ""),
            };
          });

        setCategories(mapped.length > 0 ? mapped : fallbackCategories);
      })
      .catch((error) => {
        const message = error instanceof Error ? error.message : "Failed to load categories.";
        const lowerMessage = String(message).toLowerCase();

        // Category endpoint is auth-protected in BFF, so avoid noisy auth errors on public homepage.
        const isAuthError =
          lowerMessage.includes("no token") ||
          lowerMessage.includes("unauthorized") ||
          lowerMessage.includes("forbidden") ||
          lowerMessage.includes("token");

        setCategoriesError(isAuthError ? null : message);
        setCategories(fallbackCategories);
      })
      .finally(() => {
        setIsLoadingCategories(false);
      });
  }, []);

  const highlights = [
    { text: "Same-day delivery", icon: "bx-time-five" },
    { text: "Quality-checked groceries", icon: "bx-badge-check" },
    { text: "Easy repeat orders", icon: "bx-refresh" },
  ];

  return (
    <main className="home-page">
      <section className="hero-banner-section">
        <div className="hero-image-wrap">
          <img
            src={homeBanner}
            alt="Fresh grocery essentials arranged in a pantry"
            className="hero-banner-image"
          />
          <div className="hero-overlay" />
          <div className="hero-copy">
            <div className="hero-copy-inner">
              <p className="eyebrow">PantryPicks Grocery</p>
              <h1>Fresh groceries for every kitchen, delivered with care.</h1>
              <p className="hero-subtext">
                Shop produce, pantry staples, dairy, and bakery picks in one place.
                Fast checkout. Reliable delivery windows. No hassle.
              </p>
              <div className="hero-actions">
                {/* <button
                  className="btn btn-primary"
                  type="button"
                  onClick={() => onCategoryClick?.("Vegetables")}
                >
                  Shop Now
                </button> */}
                {/* <button className="btn btn-secondary" type="button" onClick={onBrowseCategories}>
                  Browse Categories
                </button> */}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-head">
          <h2>Shop by Category</h2>
          <a
            href="#"
            className="section-link"
            onClick={(e) => {
              e.preventDefault();
              onBrowseCategories?.();
            }}
          >
            View all
          </a>
        </div>
        {isLoadingCategories ? (
          <p className="category-load-state">Loading categories...</p>
        ) : null}
        {categoriesError ? <p className="category-load-state error">{categoriesError}</p> : null}
        <div className="category-scroll" role="list" aria-label="Product categories">
          {categories.map((item) => (
            <article
              key={item.title}
              className="category-card"
              role="listitem"
              onClick={() => onCategoryClick?.(item.title)}
              style={{ cursor: onCategoryClick ? "pointer" : "default" }}
            >
              <div className="category-icon-wrap" aria-hidden="true">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={`${item.title} category`}
                    className="category-card-image"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                ) : (
                  <i className={`bx ${item.icon} category-icon`} />
                )}
              </div>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section promo">
        <h2>Why PantryPicks</h2>
        <ul>
          {highlights.map((item) => (
            <li key={item.text}>
              <i className={`bx ${item.icon} promo-item-icon`} aria-hidden="true" />
              <span>{item.text}</span>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}