import React, { useMemo, useState } from "react";
import "../../../../shared-mfe/src/styles/global.css";
import "./itemPage.css";
import { products } from "../data/products";

interface ItemPageProps {
  productId: number;
  onBackToCategory?: () => void;
  onGoToCart?: () => void;
}

const ItemPage: React.FC<ItemPageProps> = ({
  productId,
  onBackToCategory,
  onGoToCart,
}) => {
  const product = useMemo(
    () => products.find((item) => item.id === productId) || null,
    [productId]
  );

  const [selectedQty, setSelectedQty] = useState(1);
  const [cartQty, setCartQty] = useState(0);

  if (!product) {
    return (
      <div className="item-page item-page-empty">
        <div className="item-empty-card">
          <h2>Item not found</h2>
          <p>We could not find this product.</p>
          <button className="item-primary-btn" onClick={onBackToCategory}>
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="item-page">
      <div className="item-shell">
        <button className="item-back-btn" onClick={onBackToCategory}>
          <i className="bx bx-arrow-back"></i>
          Back to Products
        </button>

        <div className="item-card">
          <div className="item-media">
            <img
              src={product.image}
              alt={product.name}
              className="item-image"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src =
                  "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=900&q=80";
              }}
            />
          </div>

          <div className="item-content">
            <p className="item-category">{product.category}</p>
            <h1 className="item-title">{product.name}</h1>
            <p className="item-description">{product.description}</p>

            <div className="item-price-row">
              <span className="item-price">${product.price.toFixed(2)}</span>
              <span className="item-stock">In Stock</span>
            </div>

            <div className="item-actions">
              <div className="item-qty">
                <button
                  className="item-qty-btn"
                  onClick={() => setSelectedQty((qty) => Math.max(1, qty - 1))}
                >
                  −
                </button>
                <span className="item-qty-value">{selectedQty}</span>
                <button
                  className="item-qty-btn"
                  onClick={() => setSelectedQty((qty) => qty + 1)}
                >
                  +
                </button>
              </div>

              <button
                className="item-primary-btn"
                onClick={() => setCartQty((qty) => qty + selectedQty)}
              >
                <i className="bx bx-cart-add"></i>
                Add to Cart
              </button>
            </div>

            {cartQty > 0 && (
              <p className="item-added-text">{cartQty} item(s) added to cart</p>
            )}

            <button className="item-secondary-btn" onClick={onGoToCart}>
              <i className="bx bx-cart"></i>
              View Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemPage;
