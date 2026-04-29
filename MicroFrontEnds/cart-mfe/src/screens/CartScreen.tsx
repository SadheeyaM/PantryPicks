import React from 'react';
import { useCart } from '../hooks/useCart';
import { useCheckout } from '../hooks/useCheckout';
import { CartItemCard } from '../components/CartItemCard';
import { CartSummary } from '../components/CartSummary';
import { CartEmptyState } from '../components/CartEmptyState';
import { CartErrorState } from '../components/CartErrorState';
import "../components/cartPage/cartPage.css";

export const CartScreen: React.FC = () => {
  const {
    items,
    activeCartId,
    isLoadingCart,
    cartLoadError,
    isMutatingCart,
    updateQty,
    removeItem,
    reload,
  } = useCart();
  const {
    isConfirmingCheckout,
    checkoutError,
    checkoutSuccessOrderId,
    showCheckoutConfirm,
    checkoutIdempotencyKey,
    startCheckout,
    cancelCheckout,
    doCheckout,
    setCheckoutSuccessOrderId,
  } = useCheckout();

  // Pricing logic (same as before)
  const cartItems = items.map(item => ({ ...item, lineTotal: item.price * item.quantity }));
  const subtotal = cartItems.reduce((sum, item) => sum + item.lineTotal, 0);
  const deliveryFee = cartItems.length > 0 ? 4.99 : 0;
  const discount = 0;
  const total = subtotal + deliveryFee - discount;

  // UI event handlers
  const handleBrowseProducts = () => {
    window.location.href = '/products';
  };

  const handleCheckout = async () => {
    const accessToken = window.localStorage.getItem('accessToken') || '';
    const orderId = await doCheckout(activeCartId, accessToken);
    if (orderId) {
      setCheckoutSuccessOrderId(orderId);
      // Optionally, reload cart after checkout
      reload();
      window.location.href = `/profile?tab=orders&orderId=${orderId}`;
    }
  };

  // Render
  return (
    <div className="cart-page">
      <div className="cart-shell">
        <div className="cart-header">
          <h1>Your Cart</h1>
          <button className="cart-back-btn" onClick={handleBrowseProducts}>
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
          <CartErrorState error={cartLoadError} onRetry={reload} />
        ) : cartItems.length === 0 ? (
          <CartEmptyState onBrowseProducts={handleBrowseProducts} orderId={checkoutSuccessOrderId} />
        ) : (
          <div className="cart-layout">
            <div className="cart-list">
              {cartItems.map(item => (
                <CartItemCard
                  key={item.id}
                  item={item}
                  isMutating={isMutatingCart}
                  onQtyChange={updateQty}
                  onRemove={removeItem}
                />
              ))}
            </div>
            <CartSummary
              subtotal={subtotal}
              deliveryFee={deliveryFee}
              discount={discount}
              total={total}
              isMutating={isMutatingCart}
              isConfirmingCheckout={isConfirmingCheckout}
              onCheckout={startCheckout}
            />
          </div>
        )}
        {/* Checkout Modal */}
        {showCheckoutConfirm && (
          <div className="cart-checkout-overlay" role="presentation">
            <div className="cart-checkout-modal" role="dialog" aria-modal="true" aria-label="Confirm checkout">
              <h3>Confirm Checkout</h3>
              <p>
                You are about to place an order for <strong>{cartItems.length}</strong> item{cartItems.length > 1 ? 's' : ''}
                with total <strong>${total.toFixed(2)}</strong>.
              </p>
              {checkoutError ? <p className="cart-checkout-error">{checkoutError}</p> : null}
              <div className="cart-checkout-actions">
                <button
                  type="button"
                  className="cart-secondary-btn"
                  disabled={isConfirmingCheckout}
                  onClick={cancelCheckout}
                >
                  Continue Shopping
                </button>
                <button
                  type="button"
                  className="cart-primary-btn"
                  disabled={isConfirmingCheckout}
                  onClick={handleCheckout}
                >
                  {isConfirmingCheckout ? 'Confirming...' : 'Confirm Checkout'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
