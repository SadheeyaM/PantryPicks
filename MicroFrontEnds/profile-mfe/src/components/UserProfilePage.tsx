import React, { useEffect, useMemo, useState } from "react";
import "./user-profile-page.css";

type UserProfile = {
  id?: number;
  userId?: number | string;
  userEmail?: string;
  userFistName?: string;
  userLastName?: string;
  userPhoneNumber?: string;
  userRole?: string;
  userStatus?: string;
};

type OrderItem = {
  productId?: number;
  productName?: string;
  quantity?: number;
  price?: number;
};

type OrderRecord = {
  orderId?: number;
  customerId?: number;
  orderDate?: string;
  orderStatus?: string;
  paymentStatus?: string;
  totalAmount?: number;
  shippingAddress?: {
    line1?: string;
    line2?: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
  };
  items?: OrderItem[];
};

type UserProfilePageProps = {
  currentUser: UserProfile | null;
  profileLoading: boolean;
  profileError: string | null;
};

const BFF_BASE_URL = "http://localhost:3000";

const getInitialTab = (): "profile" | "orders" => {
  const params = new URLSearchParams(window.location.search);
  return params.get("tab") === "orders" ? "orders" : "profile";
};

const extractOrderList = (payload: unknown): OrderRecord[] => {
  const firstLevel = payload && typeof payload === "object" && "object" in payload ? (payload as { object?: unknown }).object : payload;
  const secondLevel = firstLevel && typeof firstLevel === "object" && "object" in firstLevel ? (firstLevel as { object?: unknown }).object : firstLevel;

  if (Array.isArray(secondLevel)) {
    return secondLevel as OrderRecord[];
  }

  if (Array.isArray(firstLevel)) {
    return firstLevel as OrderRecord[];
  }

  return [];
};

export default function UserProfilePage({ currentUser, profileLoading, profileError }: UserProfilePageProps) {
  const [activeTab, setActiveTab] = useState<"profile" | "orders">(getInitialTab);
  const [profileForm, setProfileForm] = useState({
    userFistName: "",
    userLastName: "",
    userPhoneNumber: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState<string | null>(null);
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [productNamesById, setProductNamesById] = useState<Record<number, string>>({});

  useEffect(() => {
    if (currentUser) {
      setProfileForm({
        userFistName: currentUser.userFistName || "",
        userLastName: currentUser.userLastName || "",
        userPhoneNumber: currentUser.userPhoneNumber || "",
      });
    }
  }, [currentUser]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const requestedTab = params.get("tab") === "orders" ? "orders" : "profile";
    setActiveTab(requestedTab);
  }, []);

  useEffect(() => {
    const syncFromLocation = () => {
      const params = new URLSearchParams(window.location.search);
      const requestedTab = params.get("tab") === "orders" ? "orders" : "profile";
      setActiveTab(requestedTab);

      const requestedOrderId = Number(params.get("orderId") || 0);
      setSelectedOrderId(Number.isFinite(requestedOrderId) && requestedOrderId > 0 ? requestedOrderId : null);
    };

    window.addEventListener("popstate", syncFromLocation);

    return () => {
      window.removeEventListener("popstate", syncFromLocation);
    };
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const requestedOrderId = Number(params.get("orderId") || 0);
    if (Number.isFinite(requestedOrderId) && requestedOrderId > 0) {
      setSelectedOrderId(requestedOrderId);
    }
  }, []);

  useEffect(() => {
    if (activeTab !== "orders") {
      return;
    }

    const loadOrders = async () => {
      try {
        setOrdersLoading(true);
        setOrdersError(null);

        const accessToken = window.localStorage.getItem("accessToken");
        if (!accessToken) {
          throw new Error("No authentication token found");
        }

        const response = await fetch(`${BFF_BASE_URL}/api/v1/orders/me`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (!response.ok) {
          const failure = await response.json().catch(() => ({}));
          throw new Error(failure.message || "Could not load your orders");
        }

        const payload = await response.json();
        const records = extractOrderList(payload);
        setOrders(records);
      } catch (error) {
        setOrdersError(error instanceof Error ? error.message : "Could not load your orders");
      } finally {
        setOrdersLoading(false);
      }
    };

    loadOrders();
  }, [activeTab]);

  const fullName = useMemo(
    () => [profileForm.userFistName, profileForm.userLastName].filter(Boolean).join(" ") || currentUser?.userEmail || "My account",
    [profileForm.userFistName, profileForm.userLastName, currentUser?.userEmail]
  );

  const profileState = currentUser?.userStatus || "Profile incomplete";
  const isOrdersDetailView = activeTab === "orders" && selectedOrderId !== null;
  const selectedOrder = isOrdersDetailView ? orders.find((order) => order.orderId === selectedOrderId) || null : null;
  const totalSpent = orders.reduce((sum, order) => sum + Number(order.totalAmount || 0), 0);
  const latestOrder = orders[0] || null;

  useEffect(() => {
    if (!isOrdersDetailView || !selectedOrder || !Array.isArray(selectedOrder.items) || selectedOrder.items.length === 0) {
      return;
    }

    const productIds = Array.from(
      new Set(
        selectedOrder.items
          .map((item) => Number(item.productId || 0))
          .filter((id) => Number.isFinite(id) && id > 0)
      )
    );

    if (productIds.length === 0) {
      return;
    }

    const loadProductNames = async () => {
      try {
        const accessToken = window.localStorage.getItem("accessToken");
        if (!accessToken) {
          return;
        }

        const response = await fetch(`${BFF_BASE_URL}/api/v1/products`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (!response.ok) {
          return;
        }

        const payload = await response.json();
        const list = Array.isArray(payload) ? payload : Array.isArray(payload?.data) ? payload.data : [];

        const names = productIds.reduce<Record<number, string>>((acc, id) => {
          const product = list.find((item: { productId?: number | string; productName?: string }) => Number(item?.productId || 0) === id);
          if (product?.productName) {
            acc[id] = String(product.productName);
          }
          return acc;
        }, {});

        if (Object.keys(names).length > 0) {
          setProductNamesById((prev) => ({ ...prev, ...names }));
        }
      } catch {
        // Keep UI usable even if product-name lookup fails.
      }
    };

    loadProductNames();
  }, [isOrdersDetailView, selectedOrder]);

  const resolveItemName = (item: OrderItem): string => {
    if (item.productName) {
      return item.productName;
    }

    const productId = Number(item.productId || 0);
    if (Number.isFinite(productId) && productId > 0 && productNamesById[productId]) {
      return productNamesById[productId];
    }

    return "Product name unavailable";
  };

  if (profileLoading) {
    return (
      <main className="user-profile-page">
        <div className="user-profile-loading">Loading profile...</div>
      </main>
    );
  }

  const updateTab = (tab: "profile" | "orders") => {
    setActiveTab(tab);
    const params = new URLSearchParams(window.location.search);
    params.set("tab", tab);
    params.delete("orderId");
    setSelectedOrderId(null);
    const query = params.toString();
    const nextUrl = `${window.location.pathname}${query ? `?${query}` : ""}`;
    window.history.pushState({}, "", nextUrl);
  };

  const openOrderDetail = (orderId: number) => {
    setActiveTab("orders");
    setSelectedOrderId(orderId);

    const params = new URLSearchParams(window.location.search);
    params.set("tab", "orders");
    params.set("orderId", String(orderId));
    window.history.pushState({}, "", `${window.location.pathname}?${params.toString()}`);
  };

  const backToOrderList = () => {
    setSelectedOrderId(null);

    const params = new URLSearchParams(window.location.search);
    params.set("tab", "orders");
    params.delete("orderId");
    window.history.pushState({}, "", `${window.location.pathname}?${params.toString()}`);
  };

  const renderProfileTab = () => (
    <article className="user-profile-panel">
      <div className="user-profile-card-head">
        <div>
          <p className="user-profile-kicker">Account Profile</p>
          <h2>{fullName}</h2>
        </div>
        <span className="user-profile-badge">{profileState}</span>
      </div>

      {profileError ? <p className="user-profile-error">{profileError}</p> : null}
      {saveError ? <p className="user-profile-error">{saveError}</p> : null}
      {saveMessage ? <p className="user-profile-success">{saveMessage}</p> : null}

      <div className="user-profile-form">
        <label>
          <span>First name</span>
          <input
            type="text"
            value={profileForm.userFistName}
            onChange={(event) => setProfileForm((prev) => ({ ...prev, userFistName: event.target.value }))}
            placeholder="Enter first name"
            disabled={!isEditing}
          />
        </label>

        <label>
          <span>Last name</span>
          <input
            type="text"
            value={profileForm.userLastName}
            onChange={(event) => setProfileForm((prev) => ({ ...prev, userLastName: event.target.value }))}
            placeholder="Enter last name"
            disabled={!isEditing}
          />
        </label>

        <label>
          <span>Email</span>
          <input type="email" value={currentUser?.userEmail || ""} disabled />
        </label>

        <label>
          <span>Phone number</span>
          <input
            type="text"
            value={profileForm.userPhoneNumber}
            onChange={(event) => setProfileForm((prev) => ({ ...prev, userPhoneNumber: event.target.value }))}
            placeholder="+1234567890"
            disabled={!isEditing}
          />
        </label>
      </div>

      <div className="user-profile-actions user-profile-details-actions">
        {!isEditing ? (
          <button
            type="button"
            className="user-profile-primary"
            onClick={() => {
              setSaveMessage(null);
              setSaveError(null);
              setIsEditing(true);
            }}
          >
            Edit Profile
          </button>
        ) : (
          <>
            <button
              type="button"
              className="user-profile-secondary"
              onClick={() => {
                setProfileForm({
                  userFistName: currentUser?.userFistName || "",
                  userLastName: currentUser?.userLastName || "",
                  userPhoneNumber: currentUser?.userPhoneNumber || "",
                });
                setSaveMessage(null);
                setSaveError(null);
                setIsEditing(false);
              }}
              disabled={isSaving}
            >
              Cancel
            </button>
            <button
              type="button"
              className="user-profile-primary"
              onClick={async () => {
                setIsSaving(true);
                setSaveMessage(null);
                setSaveError(null);

                try {
                  const accessToken = window.localStorage.getItem("accessToken");
                  if (!accessToken) {
                    throw new Error("No authentication token found");
                  }

                  const response = await fetch(`${BFF_BASE_URL}/api/v1/users/me`, {
                    method: "PATCH",
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${accessToken}`,
                    },
                    body: JSON.stringify(profileForm),
                  });

                  if (!response.ok) {
                    const failure = await response.json();
                    throw new Error(failure.message || "Could not save profile");
                  }

                  setSaveMessage("Profile saved successfully.");
                  setIsEditing(false);
                } catch (error) {
                  setSaveError(error instanceof Error ? error.message : "Could not save profile");
                } finally {
                  setIsSaving(false);
                }
              }}
              disabled={isSaving || profileLoading}
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </>
        )}
      </div>

      <div className="user-profile-summary-grid user-profile-profile-summary">
        <div>
          <p className="user-profile-label">Role</p>
          <p className="user-profile-value">{currentUser?.userRole || "USER"}</p>
        </div>
        <div>
          <p className="user-profile-label">Status</p>
          <p className="user-profile-value">{currentUser?.userStatus || "ACTIVE"}</p>
        </div>
        <div>
          <p className="user-profile-label">Completion</p>
          <p className="user-profile-value">
            {profileForm.userFistName && profileForm.userLastName && profileForm.userPhoneNumber ? "Complete" : "Needs details"}
          </p>
        </div>
      </div>
    </article>
  );

  const renderOrdersListTab = () => (
    <div className="user-orders-layout">
      <section className="user-profile-panel user-orders-list-panel">
        <div className="user-profile-card-head">
          <div>
            <p className="user-profile-kicker">Orders</p>
            <h2>Your Orders</h2>
            {/* <p className="user-profile-muted">A clean list of everything you have placed.</p> */}
          </div>
          <span className="user-profile-badge">Latest first</span>
        </div>

        <div className="user-orders-summary-strip">
          <div>
            <p className="user-orders-summary-title">Orders</p>
            <p className="user-orders-summary-value">{orders.length}</p>
          </div>
          <div>
            <p className="user-orders-summary-title">Total Spent</p>
            <p className="user-orders-summary-value">${totalSpent.toFixed(2)}</p>
          </div>
          <div>
            <p className="user-orders-summary-title">Most Recent</p>
            <p className="user-orders-summary-value">{latestOrder ? `#${latestOrder.orderId}` : "-"}</p>
          </div>
        </div>

        {ordersLoading ? <p className="user-profile-muted">Loading orders...</p> : null}
        {ordersError ? <p className="user-profile-error">{ordersError}</p> : null}

        {!ordersLoading && !ordersError && orders.length === 0 ? (
          <div className="user-orders-empty">
            <h3>No orders yet</h3>
            <p>Once you place an order, it will appear here with a clean summary and full details.</p>
          </div>
        ) : null}

        <div className="user-orders-list">
          {orders.map((order) => {
            const isActive = order.orderId === selectedOrderId;
            const itemCount = Array.isArray(order.items) ? order.items.reduce((total, item) => total + Number(item.quantity || 0), 0) : 0;
            const orderDateLabel = new Date(order.orderDate || "").toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
              year: "numeric",
            });

            return (
              <button
                key={order.orderId}
                type="button"
                className={`user-order-row ${isActive ? "is-active" : ""}`}
                onClick={() => openOrderDetail(Number(order.orderId || 0))}
              >
                <div className="user-order-row-main">
                  <p className="user-order-id">Order #{order.orderId}</p>
                  <p className="user-order-meta">Placed {orderDateLabel}</p>
                </div>
                <div className="user-order-row-right">
                  <span className={`user-order-badge status-${String(order.orderStatus || "unknown").toLowerCase()}`}>{order.orderStatus || "UNKNOWN"}</span>
                  <span className="user-order-count">{itemCount} item{itemCount === 1 ? "" : "s"}</span>
                  <span className="user-order-total">${Number(order.totalAmount || 0).toFixed(2)}</span>
                  <i className="bx bx-chevron-right user-order-chevron" aria-hidden="true" />
                </div>
              </button>
            );
          })}
        </div>
      </section>

    </div>
  );

  const renderOrderDetailPage = () => {
    if (ordersLoading) {
      return <div className="user-profile-loading user-order-detail-page">Loading order details...</div>;
    }

    if (ordersError) {
      return (
        <section className="user-profile-panel user-order-detail-page">
          <div className="user-profile-card-head">
            <div>
              <p className="user-profile-kicker">Orders</p>
              <h2>Order details</h2>
            </div>
          </div>
          <p className="user-profile-error">{ordersError}</p>
          <button type="button" className="user-profile-primary" onClick={backToOrderList}>
            Back to Orders
          </button>
        </section>
      );
    }

    if (!selectedOrder) {
      return (
        <section className="user-profile-panel user-order-detail-page">
          <div className="user-profile-card-head">
            <div>
              <p className="user-profile-kicker">Orders</p>
              <h2>Order not found</h2>
            </div>
          </div>
          <div className="user-orders-empty user-orders-empty-detail">
            <h3>That order is not available</h3>
            <p>Return to the list to open another order.</p>
          </div>
          <button type="button" className="user-profile-primary" onClick={backToOrderList}>
            Back to Orders
          </button>
        </section>
      );
    }

    return (
      <section className="user-profile-panel user-order-detail-page">
        <div className="user-profile-card-head">
          <div>
            <p className="user-profile-kicker">Order details</p>
            <h2>Order #{selectedOrder.orderId}</h2>
            <p className="user-profile-muted">Placed {new Date(selectedOrder.orderDate || "").toLocaleString()}</p>
          </div>
          <button type="button" className="user-profile-secondary user-order-back-btn" onClick={backToOrderList}>
            Back to Orders
          </button>
        </div>

        <div className="user-order-detail-summary compact full">
          <div>
            <p className="user-profile-label">Status</p>
            <p className="user-profile-value">{selectedOrder.orderStatus || "UNKNOWN"}</p>
          </div>
          <div>
            <p className="user-profile-label">Payment</p>
            <p className="user-profile-value">{selectedOrder.paymentStatus || "PENDING"}</p>
          </div>
          <div>
            <p className="user-profile-label">Total</p>
            <p className="user-profile-value">${Number(selectedOrder.totalAmount || 0).toFixed(2)}</p>
          </div>
        </div>

        <div className="user-order-simple-section">
          <p className="user-profile-label">Shipping</p>
          <p className="user-profile-value">
            {selectedOrder.shippingAddress?.line1 || "-"}
            {selectedOrder.shippingAddress?.line2 ? `, ${selectedOrder.shippingAddress.line2}` : ""}
          </p>
          <p className="user-profile-muted">
            {[selectedOrder.shippingAddress?.city, selectedOrder.shippingAddress?.state, selectedOrder.shippingAddress?.postalCode, selectedOrder.shippingAddress?.country]
              .filter(Boolean)
              .join(" • ")}
          </p>
        </div>

        <div className="user-order-simple-section">
          <p className="user-profile-label">Items</p>
          <div className="user-order-items-list compact">
            {(selectedOrder.items || []).map((item, index) => (
              <div key={`${item.productId || "item"}-${index}`} className="user-order-item-row compact">
                <div>
                  <p className="user-profile-value">{resolveItemName(item)}</p>
                  <p className="user-profile-muted">Qty {item.quantity || 0}</p>
                </div>
                <p className="user-profile-value">${Number(item.price || 0).toFixed(2)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  };

  return (
    <main className="user-profile-page user-profile-shell">
      <aside className="user-profile-sidebar">
        <div>
          <p className="user-profile-kicker">User Profile</p>
          {/* <h1>{fullName}</h1> */}
          {/* <p className="user-profile-subtitle">Profile and order history in one place.</p> */}
        </div>

        <nav className="user-profile-tabs" aria-label="Customer profile tabs">
          <button type="button" className={activeTab === "profile" ? "is-active" : ""} onClick={() => updateTab("profile")}>
            Profile
          </button>
          <button type="button" className={activeTab === "orders" ? "is-active" : ""} onClick={() => updateTab("orders")}>
            Orders
          </button>
        </nav>

        {/* <div className="user-profile-sidebar-card">
          <p className="user-profile-label">Email</p>
          <p className="user-profile-value">{currentUser?.userEmail || "-"}</p>
          <p className="user-profile-label">Account status</p>
          <p className="user-profile-value">{currentUser?.userStatus || "ACTIVE"}</p>
        </div> */}
      </aside>

      <section className="user-profile-content">{activeTab === "profile" ? renderProfileTab() : isOrdersDetailView ? renderOrderDetailPage() : renderOrdersListTab()}</section>
    </main>
  );
}