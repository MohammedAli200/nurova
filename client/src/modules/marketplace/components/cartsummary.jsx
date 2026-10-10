import React, { useState } from "react";

export default function CartSummary({
  totals,
  appliedCoupon,
  onApplyCoupon,
  onRemoveCoupon,
  ecoPackaging,
  onToggleEcoPackaging,
  onProceedToCheckout,
  isCheckingOut
}) {
  const [couponCodeInput, setCouponCodeInput] = useState("");
  const [couponError, setCouponError] = useState("");

  const handleCouponSubmit = (e) => {
    e.preventDefault();
    if (!couponCodeInput.trim()) return;
    const res = onApplyCoupon(couponCodeInput);
    if (res.success) {
      setCouponCodeInput("");
      setCouponError("");
    } else {
      setCouponError(res.message);
    }
  };

  const {
    subtotal,
    discountAmount,
    shippingFee,
    packagingFee,
    tax,
    grandTotal,
    freeShippingProgress,
    amountNeededForFreeShipping
  } = totals;

  return (
    <div className="clay-cart-summary-card">
      <h3>
        <span>📜</span> Order Summary
      </h3>

      {/* Free Shipping Progress Indicator */}
      <div style={{ marginBottom: "1.5rem" }}>
        <div className="clay-shipping-progress-text">
          <span>
            {amountNeededForFreeShipping === 0
              ? "🎉 You qualified for FREE Ayurvedic Shipping!"
              : `Add ₹${amountNeededForFreeShipping.toLocaleString('en-IN')} for FREE Shipping`}
          </span>
          <span>{freeShippingProgress}%</span>
        </div>
        <div className="clay-progress-track">
          <div
            className="clay-progress-bar"
            style={{ width: `${freeShippingProgress}%` }}
          />
        </div>
      </div>

      {/* Coupon Form */}
      {!appliedCoupon ? (
        <form onSubmit={handleCouponSubmit} className="clay-coupon-box">
          <input
            type="text"
            className="clay-coupon-input"
            placeholder="Promo code (AYUR20)"
            value={couponCodeInput}
            onChange={(e) => setCouponCodeInput(e.target.value)}
          />
          <button type="submit" className="clay-coupon-btn">
            Apply
          </button>
        </form>
      ) : (
        <div className="clay-coupon-applied-badge">
          <span>🏷️ Coupon <strong>{appliedCoupon}</strong> Applied</span>
          <button
            type="button"
            className="clay-remove-coupon"
            onClick={onRemoveCoupon}
            title="Remove coupon"
          >
            ✕
          </button>
        </div>
      )}

      {couponError && (
        <p style={{ color: "var(--status-danger)", fontSize: "0.8rem", marginBottom: "0.8rem" }}>
          {couponError}
        </p>
      )}

      {/* Line Items */}
      <div className="clay-summary-rows">
        <div className="clay-summary-row">
          <span>Items Subtotal</span>
          <span>₹{subtotal.toLocaleString('en-IN')}</span>
        </div>

        {discountAmount > 0 && (
          <div className="clay-summary-row discount-row">
            <span>Special Discount</span>
            <span>-₹{discountAmount.toLocaleString('en-IN')}</span>
          </div>
        )}

        <div className="clay-summary-row">
          <span>Ayurvedic Shipping</span>
          <span>{shippingFee === 0 ? "FREE" : `₹${shippingFee.toLocaleString('en-IN')}`}</span>
        </div>

        <div className="clay-summary-row" style={{ alignItems: "center" }}>
          <label style={{ display: "flex", alignItems: "center", gap: "0.4rem", cursor: "pointer", fontSize: "0.9rem" }}>
            <input
              type="checkbox"
              checked={ecoPackaging}
              onChange={onToggleEcoPackaging}
              style={{ accentColor: "var(--forest-primary)" }}
            />
            <span>Eco Sacred Herbs Packaging</span>
          </label>
          <span>₹{packagingFee.toLocaleString('en-IN')}</span>
        </div>

        <div className="clay-summary-row">
          <span>Estimated GST / Tax (5%)</span>
          <span>₹{tax.toLocaleString('en-IN')}</span>
        </div>

        <div className="clay-summary-row total-row">
          <span>Total Order Value</span>
          <span>₹{grandTotal.toLocaleString('en-IN')}</span>
        </div>
      </div>

      {/* Checkout CTA */}
      <button
        type="button"
        className="clay-checkout-cta-btn"
        onClick={onProceedToCheckout}
        disabled={isCheckingOut || subtotal === 0}
      >
        <span>🔒</span>
        <span>{isCheckingOut ? "Processing..." : "Proceed to Secure Checkout"}</span>
      </button>

      {/* Security Perks */}
      <div className="clay-security-perks">
        <span>🛡️ 100% Authentic</span>
        <span>🌿 AYUSH Certified</span>
        <span>✨ 7-Day Guarantee</span>
      </div>
    </div>
  );
}
