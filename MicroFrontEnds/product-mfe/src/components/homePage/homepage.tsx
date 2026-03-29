import homeBanner from "../../assets/HomeBannerNew.png";
import "./homepage.css";

interface HomePageProps {
  onCategoryClick?: (categoryName: string) => void;
  onBrowseCategories?: () => void;
}

export default function HomePage({ onCategoryClick, onBrowseCategories }: HomePageProps) {
  const categories = [
    { title: "Vegetables", icon: "bx-leaf", desc: "Farm-fresh greens" },
    { title: "Fruits", icon: "bx-apple", desc: "Sweet and seasonal" },
    { title: "Dairy", icon: "bx-coffee", desc: "Milk, curd and cheese" },
    { title: "Oils", icon: "bx-droplet", desc: "Daily cooking oils" },
    { title: "Pulses", icon: "bx-bowl-rice", desc: "Protein-rich staples" },
    { title: "Bread", icon: "bx-food-menu", desc: "Freshly baked loaves" },
  ];

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
                <i className={`bx ${item.icon} category-icon`} />
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