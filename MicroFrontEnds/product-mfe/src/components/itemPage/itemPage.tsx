import React, { useEffect, useState } from "react";
import "../../../../shared-mfe/src/styles/global.css";
import "./itemPage.css";
import { products as fallbackProducts } from "../data/products";

const BFF_BASE_URL = "http://localhost:3000";

type ProductDetail = {
  id: number;
  name: string;
  price: number;
  category: string;
  description: string;
  image: string;
  inStock: boolean;
};

type BackendProduct = {
  productId?: number | string;
  productName?: string;
  productDescription?: string;
  productUrl?: string;
  categoryName?: string;
  price?: number | string;
  productQuantity?: number | string;
};

type CartItem = {
  cartItemId?: number;
  productId?: number;
  quantity?: number;
};

type BackendCart = {
  cartId?: number;
  userId?: number;
  status?: "ACTIVE" | "CHECKED_OUT" | string;
  items?: CartItem[];
};

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

  const rawCandidate = accessPayload?.userId ?? accessPayload?.id ?? idPayload?.userId ?? idPayload?.id;
  const numeric = Number(rawCandidate);
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
  if (Array.isArray(level2)) {
    return level2 as BackendCart[];
  }
  return [];
};

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
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedQty, setSelectedQty] = useState(1);
  const [cartQty, setCartQty] = useState(0);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [cartError, setCartError] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);
    setError(null);
    setProduct(null);

    const accessToken = window.localStorage.getItem("accessToken");
    
    if (!accessToken) {
      // Fallback to local data
      const fallback = fallbackProducts.find((item) => item.id === productId) || null;
      if (fallback) {
        setProduct({
          id: fallback.id,
          name: fallback.name,
          price: fallback.price,
          category: fallback.category,
          description: fallback.description,
          image: fallback.image,
          inStock: true,
        });
      } else {
        setError("Product not found");
      }
      setIsLoading(false);
      return;
    }

    fetch(`${BFF_BASE_URL}/api/v1/products/${productId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((response) =>
        response
          .json()
          .catch(() => ({}))
          .then((body) => ({ response, body }))
      )
      .then(({ response, body }) => {
        if (!response.ok) {
          throw new Error(body?.message || "Failed to load product details");
        }

        const backendProduct: BackendProduct = body;
        const numericId = Number(backendProduct.productId);
        const parsedPrice = Number(backendProduct.price);
        const quantity = Number(backendProduct.productQuantity || 0);

        const mapped: ProductDetail = {
          id: Number.isFinite(numericId) && numericId > 0 ? numericId : productId,
          name: String(backendProduct.productName || "Unnamed product"),
          price: Number.isFinite(parsedPrice) ? parsedPrice : 0,
          category: String(backendProduct.categoryName || "Uncategorized"),
          description: String(backendProduct.productDescription || "No description available."),
          image: String(backendProduct.productUrl || ""),
          inStock: quantity > 0,
        };

        setProduct(mapped);
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : "Failed to load product");
        // Fallback to local data on error
        const fallback = fallbackProducts.find((item) => item.id === productId) || null;
        if (fallback) {
          setProduct({
            id: fallback.id,
            name: fallback.name,
            price: fallback.price,
            category: fallback.category,
            description: fallback.description,
            image: fallback.image,
            inStock: true,
          });
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [productId]);

  const getOrCreateActiveCartId = async (accessToken: string, userId: number): Promise<number> => {
    const activeCartResponse = await fetch(
      `${BFF_BASE_URL}/api/v1/carts?userId=${encodeURIComponent(String(userId))}&status=ACTIVE`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const activeCartBody = await activeCartResponse.json().catch(() => ({}));
    if (!activeCartResponse.ok) {
      throw new Error(activeCartBody?.message || "Failed to fetch active cart");
    }

    const activeCarts = normalizeCartList(activeCartBody);
    const existingCartId = Number(activeCarts[0]?.cartId || 0);
    if (Number.isFinite(existingCartId) && existingCartId > 0) {
      return existingCartId;
    }

    const createResponse = await fetch(`${BFF_BASE_URL}/api/v1/carts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ userId }),
    });

    const createBody = await createResponse.json().catch(() => ({}));
    if (!createResponse.ok) {
      throw new Error(createBody?.message || "Failed to create cart");
    }

    const created = unwrapPayload(createBody) as BackendCart | undefined;
    const createdCartId = Number(created?.cartId || 0);
    if (!Number.isFinite(createdCartId) || createdCartId <= 0) {
      throw new Error("Cart created but cartId is missing in response");
    }

    return createdCartId;
  };

  const handleAddToCart = async () => {
    if (!product) {
      setCartError("Product is not available.");
      return;
    }

    const accessToken = window.localStorage.getItem("accessToken");
    const userId = readUserIdFromToken();

    if (!accessToken || !userId) {
      setCartError("Please sign in to add items to cart.");
      return;
    }

    setIsAddingToCart(true);
    setCartError(null);

    try {
      const cartId = await getOrCreateActiveCartId(accessToken, userId);
      const addItemResponse = await fetch(`${BFF_BASE_URL}/api/v1/carts/${cartId}/items`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          productId: product.id,
          quantity: selectedQty,
        }),
      });

      const addItemBody = await addItemResponse.json().catch(() => ({}));
      if (!addItemResponse.ok) {
        throw new Error(addItemBody?.message || "Failed to add item to cart");
      }

      setCartQty((qty) => qty + selectedQty);
      window.localStorage.setItem("activeCartId", String(cartId));
    } catch (err) {
      setCartError(err instanceof Error ? err.message : "Failed to add item to cart");
    } finally {
      setIsAddingToCart(false);
    }
  };

  if (isLoading) {
    return (
      <div className="item-page item-page-empty">
        <div className="item-empty-card">
          <h2>Loading...</h2>
          <p>Please wait while we fetch product details.</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="item-page item-page-empty">
        <div className="item-empty-card">
          <h2>Item not found</h2>
          <p>{error || "We could not find this product."}</p>
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
                onClick={handleAddToCart}
                disabled={isAddingToCart}
              >
                <i className="bx bx-cart-add"></i>
                {isAddingToCart ? "Adding..." : "Add to Cart"}
              </button>
            </div>

            {cartQty > 0 && (
              <p className="item-added-text">{cartQty} item(s) added to cart</p>
            )}

            {cartError ? <p className="item-added-text">{cartError}</p> : null}

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
