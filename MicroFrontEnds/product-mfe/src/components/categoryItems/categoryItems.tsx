import React, { useEffect, useMemo, useState } from "react";
import "../../../../shared-mfe/src/styles/global.css";
import "./categoryItems.css";
import { products as fallbackProductData } from "../data/products";

const BFF_BASE_URL = "http://localhost:3000";

type CategoryProduct = {
  id: number;
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
  inStock: boolean;
};

type BackendProduct = {
  productId?: number | string;
  productName?: string;
  productDescription?: string;
  productUrl?: string;
  categoryName?: string;
  categoryId?: number | string;
  price?: number | string;
  productQuantity?: number | string;
};

type BackendCartItem = {
  cartItemId?: number;
  productId?: number;
  quantity?: number;
};

type BackendCart = {
  cartId?: number;
  items?: BackendCartItem[];
};

interface CategoryItemsPageProps {
  category?: string;
  onBackToHome?: () => void;
}

const CategoryItemsPage: React.FC<CategoryItemsPageProps> = ({
  category = "Vegetables",
  onBackToHome,
}) => {
  const [sortBy, setSortBy] = useState<"relevance" | "price-low" | "price-high">("relevance");
  const [currentPage, setCurrentPage] = useState(1);
  const [cart, setCart] = useState<{ [key: number]: number }>({});
  const [cartItemIds, setCartItemIds] = useState<{ [key: number]: number }>({});
  const [activeCartId, setActiveCartId] = useState<number | null>(null);
  const [isUpdatingCart, setIsUpdatingCart] = useState(false);
  const [cartError, setCartError] = useState<string | null>(null);
  const [products, setProducts] = useState<CategoryProduct[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [productsError, setProductsError] = useState<string | null>(null);
  const ITEMS_PER_PAGE = 9;

  const parseJwtPayload = (token: string | null): Record<string, unknown> | null => {
    if (!token) return null;
    try {
      const parts = token.split(".");
      if (parts.length < 2) return null;
      const payload = parts[1].replace(/-/g, "+").replace(/_/g, "/");
      const padded = payload.padEnd(Math.ceil(payload.length / 4) * 4, "=");
      return JSON.parse(window.atob(padded));
    } catch {
      return null;
    }
  };

  const readUserIdFromToken = (): number | null => {
    const accessPayload = parseJwtPayload(window.localStorage.getItem("accessToken"));
    const idPayload =
      parseJwtPayload(window.localStorage.getItem("idToken")) ||
      parseJwtPayload(window.localStorage.getItem("id_token"));

    const candidate = accessPayload?.userId ?? accessPayload?.id ?? idPayload?.userId ?? idPayload?.id;
    const numeric = Number(candidate);
    return Number.isFinite(numeric) && numeric > 0 ? numeric : null;
  };

  const unwrapPayload = (payload: unknown): unknown => {
    if (payload && typeof payload === "object" && "data" in payload) {
      const obj = payload as { data?: unknown };
      return obj.data;
    }
    return payload;
  };

  const normalizeCartList = (payload: unknown): BackendCart[] => {
    const level1 = unwrapPayload(payload);
    const level2 = unwrapPayload(level1);
    if (Array.isArray(level2)) return level2 as BackendCart[];
    return [];
  };

  const normalizeCartObject = (payload: unknown): BackendCart | null => {
    const level1 = unwrapPayload(payload);
    const level2 = unwrapPayload(level1);
    if (level2 && typeof level2 === "object" && !Array.isArray(level2)) {
      return level2 as BackendCart;
    }
    return null;
  };

  const applyCartState = (payload: unknown, fallbackCartId?: number) => {
    const cartObj = normalizeCartObject(payload);
    const nextCartId = Number(cartObj?.cartId || fallbackCartId || 0);
    if (nextCartId > 0) {
      setActiveCartId(nextCartId);
      window.localStorage.setItem("activeCartId", String(nextCartId));
    }

    const nextQtyMap: { [key: number]: number } = {};
    const nextItemIdMap: { [key: number]: number } = {};

    if (Array.isArray(cartObj?.items)) {
      cartObj.items.forEach((item: BackendCartItem) => {
        const productId = Number(item.productId || 0);
        const quantity = Number(item.quantity || 0);
        const cartItemId = Number(item.cartItemId || 0);
        if (productId > 0 && quantity > 0) {
          nextQtyMap[productId] = quantity;
          if (cartItemId > 0) {
            nextItemIdMap[productId] = cartItemId;
          }
        }
      });
    }

    setCart(nextQtyMap);
    setCartItemIds(nextItemIdMap);
  };

  const getOrCreateActiveCart = (accessToken: string, userId: number): Promise<number> => {
    return fetch(`${BFF_BASE_URL}/api/v1/carts?userId=${encodeURIComponent(String(userId))}&status=ACTIVE`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
      .then((response) =>
        response
          .json()
          .catch(() => ({}))
          .then((body) => ({ response, body }))
      )
      .then(({ response, body }) => {
        if (!response.ok) throw new Error(body?.message || "Failed to load active cart");

        const carts = normalizeCartList(body);
        const existingCartId = Number(carts[0]?.cartId || 0);
        if (existingCartId > 0) {
          setActiveCartId(existingCartId);
          window.localStorage.setItem("activeCartId", String(existingCartId));
          return existingCartId;
        }

        return fetch(`${BFF_BASE_URL}/api/v1/carts`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ userId }),
        })
          .then((createResponse) =>
            createResponse
              .json()
              .catch(() => ({}))
              .then((createBody) => ({ createResponse, createBody }))
          )
          .then(({ createResponse, createBody }) => {
            if (!createResponse.ok) {
              throw new Error(createBody?.message || "Failed to create cart");
            }
            const created = normalizeCartObject(createBody);
            const createdCartId = Number(created?.cartId || 0);
            if (createdCartId <= 0) throw new Error("Cart created but cartId is missing");
            setActiveCartId(createdCartId);
            window.localStorage.setItem("activeCartId", String(createdCartId));
            return createdCartId;
          });
      });
  };

  useEffect(() => {
    setIsLoadingProducts(true);
    setProductsError(null);

    const accessToken = window.localStorage.getItem("accessToken");
    if (!accessToken) {
      const normalizedCategory = category.trim().toLowerCase();
      const fallbackMapped: CategoryProduct[] = fallbackProductData
        .filter((item) => String(item.category || "").trim().toLowerCase() === normalizedCategory)
        .map((item) => ({
          id: Number(item.id),
          name: String(item.name || "Unnamed product"),
          price: Number(item.price) || 0,
          description: String(item.description || "No description available."),
          image: String(item.image || ""),
          category: String(item.category || category),
          inStock: Boolean(item.inStock),
        }));

      setProductsError("No authentication token found. Showing fallback products.");
      setProducts(fallbackMapped);
      setIsLoadingProducts(false);
      return;
    }

    fetch(`${BFF_BASE_URL}/api/v1/products`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((response) =>
        response
          .json()
          .catch(() => [])
          .then((body) => ({ response, body }))
      )
      .then(({ response, body }) => {
        if (!response.ok) {
          throw new Error(body?.message || "Failed to load products.");
        }

        const list: BackendProduct[] = Array.isArray(body) ? body : [];
        const normalizedCategory = category.trim().toLowerCase();

        const mapped = list
          .filter((item) => String(item.categoryName || "").trim().toLowerCase() === normalizedCategory)
          .map((item, index) => {
            const numericId = Number(item.productId);
            const parsedPrice = Number(item.price);
            const quantity = Number(item.productQuantity || 0);

            return {
              id: Number.isFinite(numericId) && numericId > 0 ? numericId : index + 1,
              name: item.productName || "Unnamed product",
              price: Number.isFinite(parsedPrice) ? parsedPrice : 0,
              description: item.productDescription || "No description available.",
              image: item.productUrl || "",
              category: item.categoryName || category,
              inStock: quantity > 0,
            };
          });

        setProducts(mapped);
      })
      .catch((error) => {
        const normalizedCategory = category.trim().toLowerCase();
        const fallbackMapped: CategoryProduct[] = fallbackProductData
          .filter((item) => String(item.category || "").trim().toLowerCase() === normalizedCategory)
          .map((item) => ({
            id: Number(item.id),
            name: String(item.name || "Unnamed product"),
            price: Number(item.price) || 0,
            description: String(item.description || "No description available."),
            image: String(item.image || ""),
            category: String(item.category || category),
            inStock: Boolean(item.inStock),
          }));

        setProductsError(error instanceof Error ? `${error.message} Showing fallback products.` : "Failed to load products. Showing fallback products.");
        setProducts(fallbackMapped);
      })
      .finally(() => {
        setIsLoadingProducts(false);
      });
  }, [category]);

  useEffect(() => {
    const accessToken = window.localStorage.getItem("accessToken");
    const userId = readUserIdFromToken();

    if (!accessToken || !userId) {
      setCart({});
      setCartItemIds({});
      setActiveCartId(null);
      return;
    }

    fetch(`${BFF_BASE_URL}/api/v1/carts?userId=${encodeURIComponent(String(userId))}&status=ACTIVE`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
      .then((response) =>
        response
          .json()
          .catch(() => ({}))
          .then((body) => ({ response, body }))
      )
      .then(({ response, body }) => {
        if (!response.ok) throw new Error(body?.message || "Failed to load active cart");
        const carts = normalizeCartList(body);
        const existingCartId = Number(carts[0]?.cartId || 0);
        if (existingCartId <= 0) {
          setCart({});
          setCartItemIds({});
          setActiveCartId(null);
          return null;
        }

        return fetch(`${BFF_BASE_URL}/api/v1/carts/${existingCartId}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        })
          .then((cartResponse) =>
            cartResponse
              .json()
              .catch(() => ({}))
              .then((cartBody) => ({ cartResponse, cartBody, existingCartId }))
          )
          .then(({ cartResponse, cartBody, existingCartId: cartId }) => {
            if (!cartResponse.ok) throw new Error(cartBody?.message || "Failed to load cart details");
            applyCartState(cartBody, cartId);
            return null;
          });
      })
      .catch(() => {
        // Keep product browsing functional even when cart sync fails.
      });
  }, []);

  const allProducts = useMemo(() => products, [products]);

  const filteredProducts = useMemo(() => {
    let filtered = [...allProducts];
    switch (sortBy) {
      case "price-low": filtered.sort((a, b) => a.price - b.price); break;
      case "price-high": filtered.sort((a, b) => b.price - a.price); break;
    }
    return filtered;
  }, [allProducts, sortBy]);

  useEffect(() => {
    setCurrentPage(1);
  }, [category, sortBy, allProducts.length]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIdx = startIdx + ITEMS_PER_PAGE;
  const paginatedProducts = filteredProducts.slice(startIdx, endIdx);

  const handleAddToCart = (id: number) => {
    const accessToken = window.localStorage.getItem("accessToken");
    const userId = readUserIdFromToken();
    if (!accessToken || !userId) {
      setCartError("Please sign in to add items to cart.");
      return;
    }

    setIsUpdatingCart(true);
    setCartError(null);

    getOrCreateActiveCart(accessToken, userId)
      .then((cartId) => {
        const existingQty = cart[id] || 0;
        const cartItemId = cartItemIds[id] || 0;

        if (existingQty > 0 && cartItemId > 0) {
          return fetch(`${BFF_BASE_URL}/api/v1/carts/${cartId}/items/${cartItemId}`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({ quantity: existingQty + 1 }),
          })
            .then((response) =>
              response
                .json()
                .catch(() => ({}))
                .then((body) => ({ response, body, cartId }))
            )
            .then(({ response, body, cartId: currentCartId }) => {
              if (!response.ok) throw new Error(body?.message || "Failed to update cart item");
              applyCartState(body, currentCartId);
              return null;
            });
        }

        return fetch(`${BFF_BASE_URL}/api/v1/carts/${cartId}/items`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ productId: id, quantity: 1 }),
        })
          .then((response) =>
            response
              .json()
              .catch(() => ({}))
              .then((body) => ({ response, body, cartId }))
          )
          .then(({ response, body, cartId: currentCartId }) => {
            if (!response.ok) throw new Error(body?.message || "Failed to add item to cart");
            applyCartState(body, currentCartId);
            return null;
          });
      })
      .catch((error) => {
        setCartError(error instanceof Error ? error.message : "Failed to update cart");
      })
      .finally(() => {
        setIsUpdatingCart(false);
      });
  };

  const handleRemoveFromCart = (id: number) => {
    const accessToken = window.localStorage.getItem("accessToken");
    const currentCartId = activeCartId;
    const currentQty = cart[id] || 0;
    const cartItemId = cartItemIds[id] || 0;

    if (!accessToken || !currentCartId || !cartItemId || currentQty <= 0) {
      setCartError("Unable to update cart item.");
      return;
    }

    setIsUpdatingCart(true);
    setCartError(null);

    const request =
      currentQty <= 1
        ? fetch(`${BFF_BASE_URL}/api/v1/carts/${currentCartId}/items/${cartItemId}`, {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          })
        : fetch(`${BFF_BASE_URL}/api/v1/carts/${currentCartId}/items/${cartItemId}`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({ quantity: currentQty - 1 }),
          });

    request
      .then((response) =>
        response
          .json()
          .catch(() => ({}))
          .then((body) => ({ response, body }))
      )
      .then(({ response, body }) => {
        if (!response.ok) throw new Error(body?.message || "Failed to update cart item");
        applyCartState(body, currentCartId);
      })
      .catch((error) => {
        setCartError(error instanceof Error ? error.message : "Failed to update cart");
      })
      .finally(() => {
        setIsUpdatingCart(false);
      });
  };

  const handleViewDetails = (productId: number) => {
    window.location.hash = `product/${productId}`;
  };

  return (
    <div className="category-items-page">
      {/* Header */}
      <div className="category-header">
        <div className="header-content">
          <div className="header-text">
            <h1>{category}</h1>
            <p className="category-subtitle">Fresh {category.toLowerCase()} delivered</p>
          </div>
          {onBackToHome && (
            <button className="back-button" onClick={onBackToHome}>
              <i className="bx bx-arrow-back"></i>
              Home
            </button>
          )}
        </div>
      </div>

      <div className="category-container">
        {/* Products */}
        <div className="products-section">
          <div className="sort-bar">
            <span className="sort-bar-left">{filteredProducts.length} results</span>
            <div className="sort-bar-right">
              <span className="sort-label">Sort</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="sort-select"
              >
                <option value="relevance">Relevance</option>
                <option value="price-low">Price: Low → High</option>
                <option value="price-high">Price: High → Low</option>
              </select>
            </div>
          </div>

          {cartError ? (
            <div className="no-products">
              <p>{cartError}</p>
            </div>
          ) : null}

          <div className="products-grid">
            {paginatedProducts.map((product) => (
              <div key={product.id} className="product-card">
                <div className="product-image-wrapper">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="product-image"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src =
                        "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=900&q=80";
                    }}
                  />

                  <div className="stock-badge">{product.inStock ? "In Stock" : "Low Stock"}</div>
                </div>

                <div className="product-info">
                  <h3 className="product-name">{product.name}</h3>
                  <p className="product-description">{product.description}</p>
                  <div className="product-price">
                    <span className="current-price">${product.price.toFixed(2)}</span>
                  </div>
                  <div className="product-actions">
                    <button className="view-details-icon-btn" onClick={() => handleViewDetails(product.id)} title="View Details">
                      <i className="bx bx-show"></i>
                    </button>
                    {cart[product.id] ? (
                      <div className="quantity-control">
                        <button className="qty-btn" disabled={isUpdatingCart} onClick={() => handleRemoveFromCart(product.id)}>−</button>
                        <span className="qty-display">{cart[product.id]}</span>
                        <button className="qty-btn" disabled={isUpdatingCart} onClick={() => handleAddToCart(product.id)}>+</button>
                      </div>
                    ) : (
                      <button className="add-to-cart-btn" disabled={isUpdatingCart} onClick={() => handleAddToCart(product.id)}>
                        <i className="bx bx-cart-add"></i> Add to Cart
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {!isLoadingProducts && !productsError && paginatedProducts.length === 0 && (
              <div className="no-products">
                <p>No products match your filters.</p>
              </div>
            )}

            {isLoadingProducts && (
              <div className="no-products">
                <p>Loading products...</p>
              </div>
            )}

            {productsError && (
              <div className="no-products">
                <p>{productsError}</p>
              </div>
            )}
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              <button
                className="page-btn prev-btn"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                <i className="bx bx-chevron-left"></i>
              </button>
              <div className="page-numbers">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    className={`page-num ${currentPage === page ? "active" : ""}`}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </button>
                ))}
              </div>
              <button
                className="page-btn next-btn"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                <i className="bx bx-chevron-right"></i>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryItemsPage;