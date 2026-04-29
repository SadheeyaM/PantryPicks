import React, { useEffect, useMemo, useState } from "react";
import "../../../../shared-mfe/src/styles/global.css";
import "./cartPage.css";

const BFF_BASE_URL = "http://localhost:3000";
const DEFAULT_PRODUCT_IMAGE = "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=900&q=80";

type SampleCartItem = {
  id: number;
  cartItemId: number;
  name: string;
  description: string;
  image: string;
  price: number;
  quantity: number;
};

type BackendCartItem = {
  cartItemId?: number;
  productId?: number;
  quantity?: number;
  productName?: string;
  productDescription?: string;
  productUrl?: string;
  price?: number | string;
};

type BackendCart = {
  cartId?: number;
  userId?: number;
  status?: string;
  items?: BackendCartItem[];
  subTotal?: number;
  shippingCost?: number;
  discount?: number;
};

type CheckoutResponse = {
  message?: string;
  order?: {
    orderId?: number;
  };
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
  if (Array.isArray(level2)) {
    return level2 as BackendCart[];
  }
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

const CartPage: React.FC = () => {
  const [items, setItems] = useState<SampleCartItem[]>([]);
  const [activeCartId, setActiveCartId] = useState<number | null>(null);
  const [isLoadingCart, setIsLoadingCart] = useState(true);
  const [cartLoadError, setCartLoadError] = useState<string | null>(null);
  const [isMutatingCart, setIsMutatingCart] = useState(false);
  const [showCheckoutConfirm, setShowCheckoutConfirm] = useState(false);
  const [isConfirmingCheckout, setIsConfirmingCheckout] = useState(false);
  const [checkoutSuccessOrderId, setCheckoutSuccessOrderId] = useState<number | null>(null);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [checkoutIdempotencyKey, setCheckoutIdempotencyKey] = useState("");

  useEffect(() => {
    setIsLoadingCart(true);
    setCartLoadError(null);

    const accessToken = window.localStorage.getItem("accessToken");
    const userId = readUserIdFromToken();

    if (!accessToken || !userId) {
      setItems([]);
      setCartLoadError("Please sign in to view your cart.");
      setIsLoadingCart(false);
      return;
    }

    const fetchCartById = (cartId: number) => {
      return fetch(`${BFF_BASE_URL}/api/v1/carts/${cartId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
        .then((cartResponse) =>
          cartResponse
            .json()
            .catch(() => ({}))
            .then((cartBody) => ({ cartResponse, cartBody }))
        )
        .then(({ cartResponse, cartBody }) => {
          if (!cartResponse.ok) {
            throw new Error(cartBody?.message || "Failed to load cart details");
          }

          const cart = normalizeCartObject(cartBody);
          const mappedItems: SampleCartItem[] = Array.isArray(cart?.items)
            ? cart.items
                .map((item: BackendCartItem) => ({
                  id: Number(item.productId || 0),
                  cartItemId: Number(item.cartItemId || 0),
                  name: String(item.productName || "Unknown product"),
                  description: String(item.productDescription || "No description available."),
                  image: String(item.productUrl || DEFAULT_PRODUCT_IMAGE),
                  price: Number(item.price) || 0,
                  quantity: Number(item.quantity) || 0,
                }))
                .filter((item) => item.id > 0 && item.quantity > 0 && item.cartItemId > 0)
            : [];

          setItems(mappedItems);
          setActiveCartId(cartId);
          window.localStorage.setItem("activeCartId", String(cartId));
          return null;
        });
    };

    fetch(
      `${BFF_BASE_URL}/api/v1/carts?userId=${encodeURIComponent(String(userId))}&status=ACTIVE`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    )
      .then((response) =>
        response
          .json()
          .catch(() => ({}))
          .then((body) => ({ response, body }))
      )
      .then(({ response, body }) => {
        if (!response.ok) {
          throw new Error(body?.message || "Failed to load cart list");
        }

        const activeCarts = normalizeCartList(body);
        const activeCartId = Number(activeCarts[0]?.cartId || 0);

        if (!Number.isFinite(activeCartId) || activeCartId <= 0) {
          setItems([]);
          setActiveCartId(null);
          return null;
        }

        return fetchCartById(activeCartId);
      })
      .catch((error) => {
        setItems([]);
        setActiveCartId(null);
        setCartLoadError(error instanceof Error ? error.message : "Failed to load cart");
      })
      .finally(() => {
        setIsLoadingCart(false);
      });
  }, []);

  const cartItems = useMemo(
    () =>
      items.map((item) => ({
        ...item,
        lineTotal: item.price * item.quantity,
      })),
    [items]
  );

  const backendCartTotals = useMemo(() => {
    if (!activeCartId) {
      return { subtotal: 0, deliveryFee: 0, discount: 0, total: 0 };
    }

    const currentCart = normalizeCartObject(items.length > 0 ? { items } : null);
    void currentCart;

    return { subtotal: 0, deliveryFee: 0, discount: 0, total: 0 };
  }, [activeCartId, items]);

  const subtotal = cartItems.reduce((sum, item) => sum + item.lineTotal, 0);
  const deliveryFee = cartItems.length > 0 ? 4.99 : 0;
  const discount = 0;
  const total = subtotal + deliveryFee - discount;

  const reloadCartById = (cartId: number, accessToken: string) => {
    return fetch(`${BFF_BASE_URL}/api/v1/carts/${cartId}`, {
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
          throw new Error(body?.message || "Failed to refresh cart");
        }

        const cart = normalizeCartObject(body);
        const mappedItems: SampleCartItem[] = Array.isArray(cart?.items)
          ? cart.items
              .map((item: BackendCartItem) => ({
                id: Number(item.productId || 0),
                cartItemId: Number(item.cartItemId || 0),
                name: String(item.productName || "Unknown product"),
                description: String(item.productDescription || "No description available."),
                image: String(item.productUrl || DEFAULT_PRODUCT_IMAGE),
                price: Number(item.price) || 0,
                quantity: Number(item.quantity) || 0,
              }))
              .filter((item) => item.id > 0 && item.quantity > 0 && item.cartItemId > 0)
          : [];

        setItems(mappedItems);
      });
  };

  const updateQty = (item: SampleCartItem, nextQty: number) => {
    if (!activeCartId) {
      setCartLoadError("Active cart not found.");
      return;
    }

    const accessToken = window.localStorage.getItem("accessToken");
    if (!accessToken) {
      setCartLoadError("Please sign in to update cart.");
      return;
    }

    setIsMutatingCart(true);
    setCartLoadError(null);

    const requestPromise =
      nextQty <= 0
        ? fetch(`${BFF_BASE_URL}/api/v1/carts/${activeCartId}/items/${item.cartItemId}`, {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          })
        : fetch(`${BFF_BASE_URL}/api/v1/carts/${activeCartId}/items/${item.cartItemId}`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({ quantity: nextQty }),
          });

    requestPromise
      .then((response) =>
        response
          .json()
          .catch(() => ({}))
          .then((body) => ({ response, body }))
      )
      .then(({ response, body }) => {
        if (!response.ok) {
          throw new Error(body?.message || "Failed to update cart item");
        }

        return reloadCartById(activeCartId, accessToken);
      })
      .catch((error) => {
        setCartLoadError(error instanceof Error ? error.message : "Failed to update cart item");
      })
      .finally(() => {
        setIsMutatingCart(false);
      });
  };

  const removeItem = (item: SampleCartItem) => {
    updateQty(item, 0);
  };

  const confirmCheckout = () => {
    if (!activeCartId) {
      setCheckoutError("No active cart found for checkout.");
      return;
    }

    const accessToken = window.localStorage.getItem("accessToken");
    if (!accessToken) {
      setCheckoutError("Please sign in to continue checkout.");
      return;
    }

    setIsConfirmingCheckout(true);
    setCheckoutError(null);

    fetch(`${BFF_BASE_URL}/api/v1/orders/checkout/confirm`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        "Idempotency-Key": checkoutIdempotencyKey,
      },
      body: JSON.stringify({ cartId: activeCartId }),
    })
      .then((response) =>
        response
          .json()
          .catch(() => ({}))
          .then((body) => ({ response, body }))
      )
      .then(({ response, body }: { response: Response; body: CheckoutResponse & { message?: string } }) => {
        if (!response.ok) {
          throw new Error(body?.message || "Checkout failed. Please try again.");
        }

        const orderId = Number(body?.order?.orderId || 0);
        setCheckoutSuccessOrderId(Number.isFinite(orderId) && orderId > 0 ? orderId : null);
        setShowCheckoutConfirm(false);
        setCheckoutIdempotencyKey("");
        setItems([]);
        setActiveCartId(null);
        window.location.href = orderId > 0 ? `/profile?tab=orders&orderId=${orderId}` : "/profile?tab=orders";
      })
      .catch((error) => {
        setCheckoutError(error instanceof Error ? error.message : "Checkout failed. Please try again.");
      })
      .finally(() => {
        setIsConfirmingCheckout(false);
      });
  };

  return (
    <div className="cart-page">
      <div className="cart-shell">
        <div className="cart-header">
          <h1>Your Cart</h1>
          <button className="cart-back-btn" onClick={() => (window.location.href = "/products") }>
            <i className="bx bx-arrow-back"></i>
            Continue Shopping
          </button>
        </div>

        {isLoadingCart ? (
          <div className="cart-empty">
            <h2>Loading your cart...</h2>
            <p>Please wait while we fetch your items.</p>
          </div>
        ) : cartLoadError ? (
          <div className="cart-empty">
            <h2>Unable to load cart</h2>
            <p>{cartLoadError}</p>
            <button className="cart-primary-btn" onClick={() => window.location.reload()}>
              Retry
            </button>
          </div>
        ) : cartItems.length === 0 ? (
          <div className="cart-empty">
            {checkoutSuccessOrderId ? (
              <>
                <h2>Order placed successfully</h2>
                <p>Your order #{checkoutSuccessOrderId} has been created.</p>
                <button className="cart-primary-btn" onClick={() => (window.location.href = "/products") }>
                  Continue Shopping
                </button>
              </>
            ) : (
              <>
                <h2>Your cart is empty</h2>
                <p>Add a few items to get started.</p>
                <button className="cart-primary-btn" onClick={() => (window.location.href = "/products") }>
                  Browse Products
                </button>
              </>
            )}
          </div>
        ) : (
          <div className="cart-layout">
            <div className="cart-list">
              {cartItems.map((item) => (
                <article key={item.id} className="cart-item">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="cart-item-image"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src =
                        "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=900&q=80";
                    }}
                  />

                  <div className="cart-item-main">
                    <h3>{item.name}</h3>
                    <p>{item.description}</p>
                    <span className="cart-unit-price">${item.price.toFixed(2)} each</span>
                  </div>

                  <div className="cart-item-actions">
                    <div className="cart-qty">
                      <button disabled={isMutatingCart} onClick={() => updateQty(item, item.quantity - 1)}>−</button>
                      <span>{item.quantity}</span>
                      <button disabled={isMutatingCart} onClick={() => updateQty(item, item.quantity + 1)}>+</button>
                    </div>

                    <span className="cart-line-total">${item.lineTotal.toFixed(2)}</span>

                    <button className="cart-remove-btn" disabled={isMutatingCart} onClick={() => removeItem(item)}>
                      Remove
                    </button>
                  </div>
                </article>
              ))}
            </div>

            <aside className="cart-summary">
              <h2>Order Summary</h2>

              <div className="cart-summary-row">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>

              <div className="cart-summary-row">
                <span>Delivery</span>
                <span>${deliveryFee.toFixed(2)}</span>
              </div>

              <div className="cart-summary-row">
                <span>Discount</span>
                <span>-${discount.toFixed(2)}</span>
              </div>

              <div className="cart-summary-row total">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>

              <button
                className="cart-primary-btn"
                disabled={isMutatingCart || isConfirmingCheckout}
                onClick={() => {
                  setCheckoutError(null);
                  setCheckoutIdempotencyKey(
                    window.crypto?.randomUUID ? window.crypto.randomUUID() : `checkout-${Date.now()}-${Math.random()}`
                  );
                  setShowCheckoutConfirm(true);
                }}
              >
                Proceed to Checkout
              </button>
            </aside>
          </div>
        )}

        {showCheckoutConfirm && (
          <div className="cart-checkout-overlay" role="presentation">
            <div className="cart-checkout-modal" role="dialog" aria-modal="true" aria-label="Confirm checkout">
              <h3>Confirm Checkout</h3>
              <p>
                You are about to place an order for <strong>{cartItems.length}</strong> item{cartItems.length > 1 ? "s" : ""}
                with total <strong>${total.toFixed(2)}</strong>.
              </p>

              {checkoutError ? <p className="cart-checkout-error">{checkoutError}</p> : null}

              <div className="cart-checkout-actions">
                <button
                  type="button"
                  className="cart-secondary-btn"
                  disabled={isConfirmingCheckout}
                  onClick={() => {
                    setShowCheckoutConfirm(false);
                    setCheckoutIdempotencyKey("");
                  }}
                >
                  Continue Shopping
                </button>
                <button
                  type="button"
                  className="cart-primary-btn"
                  disabled={isConfirmingCheckout}
                  onClick={confirmCheckout}
                >
                  {isConfirmingCheckout ? "Confirming..." : "Confirm Checkout"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
