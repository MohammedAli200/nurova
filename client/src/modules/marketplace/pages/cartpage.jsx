import React, { useState } from "react";
import CartItem from "../components/cartitem";
import CartSummary from "../components/cartsummary";
import CheckoutModal from "../components/CheckoutModal";
import ProductCard from "../components/productcard";
import { productsData } from "../services/productservice";

export default function CartPage({
  cartHook,
  wishlistHook,
  onNavigateToShop
}) {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    clearCart,
    appliedCoupon,
    applyCouponCode,
    removeCoupon,
    ecoPackaging,
    toggleEcoPackaging,
    totals,
    isCheckingOut,
    checkoutOrder,
    isInCart
  } = cartHook;

  const { isWishlisted, toggleWishlist } = wishlistHook;
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);

  // Recommendations: products not yet in cart
  const recommendedProducts = productsData
    .filter((p) => !cartItems.some((item) => item.id === p.id))
    .slice(0, 3);

  if (cartItems.length === 0) {
    return (
      <main className="clay-cart-page">
        <div className="clay-empty-box">
          <div className="clay-empty-icon">🛒</div>
          <h3>Your Wellness Cart is Empty</h3>
          <p>
            Your apothecary basket has no remedies yet. Discover handcrafted
            Ayurvedic supplements, nourishing herbal oils, and organic wellness teas.
          </p>
          <button
            type="button"
            className="clay-action-btn primary-cart-btn"
            onClick={onNavigateToShop}
            style={{ padding: "0.85rem 2rem" }}
          >
            🌿 Browse Ayurvedic Remedies
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="clay-cart-page">
      {/* Header */}
      <div className="clay-cart-header">
        <h2>
          <span>🛒</span> Shopping Cart & Apothecary ({totals.totalCount} {totals.totalCount === 1 ? "Item" : "Items"})
        </h2>
        <button
          type="button"
          className="clay-action-btn"
          onClick={clearCart}
          style={{ fontSize: "0.85rem", color: "var(--status-danger)" }}
        >
          🗑️ Clear Cart
        </button>
      </div>

      {/* Main 2-column layout */}
      <div className="clay-cart-layout">
        {/* Left: Cart Items */}
        <div className="clay-cart-items-column">
          {cartItems.map((item, index) => (
  <CartItem
    key={item.id || item._id || `cart-item-${index}`}
              item={item}
              onUpdateQuantity={updateQuantity}
              onRemove={removeFromCart}
            />
          ))}

          {/* Upsell / Paired Remedies */}
          {recommendedProducts.length > 0 && (
            <div style={{ marginTop: "2rem" }}>
              <h3 style={{ fontSize: "1.2rem", fontWeight: 800, color: "var(--forest-dark)", marginBottom: "1rem" }}>
                ✨ Frequently Paired Ayurvedic Remedies
              </h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "1.2rem" }}>
                {recommendedProducts.map((p) => (
                  <ProductCard
                    key={p.id}
                    product={p}
                    onAddToCart={cartHook.addToCart}
                    isInCart={isInCart(p.id)}
                    isWishlisted={isWishlisted(p.id)}
                    onToggleWishlist={toggleWishlist}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: Summary */}
        <div>
          <CartSummary
            totals={totals}
            appliedCoupon={appliedCoupon}
            onApplyCoupon={applyCouponCode}
            onRemoveCoupon={removeCoupon}
            ecoPackaging={ecoPackaging}
            onToggleEcoPackaging={toggleEcoPackaging}
            onProceedToCheckout={() => setIsCheckoutModalOpen(true)}
            isCheckingOut={isCheckingOut}
          />
        </div>
      </div>

      {/* Multi-Step Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutModalOpen}
        onClose={() => setIsCheckoutModalOpen(false)}
        cartItems={cartItems}
        totals={totals}
        onConfirmOrder={checkoutOrder}
        isCheckingOut={isCheckingOut}
      />
    </main>
  );
}
