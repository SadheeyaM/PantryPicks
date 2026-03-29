import React, { useMemo, useState } from "react";
import "../../../../shared-mfe/src/styles/global.css";
import "./cartPage.css";

type SampleCartItem = {
  id: number;
  name: string;
  description: string;
  image: string;
  price: number;
  quantity: number;
};

const initialItems: SampleCartItem[] = [
  {
    id: 1,
    name: "Fresh Tomatoes",
    description: "Ripe, juicy tomatoes perfect for salads and cooking",
    image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=900&q=80",
    price: 4.99,
    quantity: 2,
  },
  {
    id: 2,
    name: "Organic Carrots",
    description: "Sweet organic carrots, great raw or cooked",
    image: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&w=900&q=80",
    price: 5.99,
    quantity: 1,
  },
  {
    id: 3,
    name: "Spinach Organic",
    description: "Leafy organic spinach loaded with iron and nutrients",
    image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=900&q=80",
    price: 4.99,
    quantity: 2,
  },
];

const CartPage: React.FC = () => {
  const [items, setItems] = useState<SampleCartItem[]>(initialItems);

  const cartItems = useMemo(
    () =>
      items.map((item) => ({
        ...item,
        lineTotal: item.price * item.quantity,
      })),
    [items]
  );

  const subtotal = cartItems.reduce((sum, item) => sum + item.lineTotal, 0);
  const deliveryFee = cartItems.length > 0 ? 4.99 : 0;
  const total = subtotal + deliveryFee;

  const updateQty = (id: number, nextQty: number) => {
    if (nextQty <= 0) {
      setItems((prev) => prev.filter((item) => item.id !== id));
      return;
    }
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity: nextQty } : item))
    );
  };

  const removeItem = (id: number) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
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

        {cartItems.length === 0 ? (
          <div className="cart-empty">
            <h2>Your cart is empty</h2>
            <p>Add a few items to get started.</p>
            <button className="cart-primary-btn" onClick={() => (window.location.href = "/products") }>
              Browse Products
            </button>
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
                      <button onClick={() => updateQty(item.id, item.quantity - 1)}>−</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQty(item.id, item.quantity + 1)}>+</button>
                    </div>

                    <span className="cart-line-total">${item.lineTotal.toFixed(2)}</span>

                    <button className="cart-remove-btn" onClick={() => removeItem(item.id)}>
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

              <div className="cart-summary-row total">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>

              <button className="cart-primary-btn">Proceed to Checkout</button>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
