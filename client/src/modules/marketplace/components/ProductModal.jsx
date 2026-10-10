import React, { useState } from "react";

export default function ProductModal({
  product,
  onClose,
  onAddToCart,
  isInCart,
  isWishlisted,
  onToggleWishlist
}) {
  const [quantity, setQuantity] = useState(1);
  const [imgError, setImgError] = useState(false);

  if (!product) return null;

  const {
    id,
    name,
    categoryLabel,
    price,
    originalPrice,
    rating,
    reviewCount,
    doshaLabel,
    dosha,
    description,
    ingredients,
    dosage,
    benefits,
    certifications,
    icon,
    image,
    inStock
  } = product;

  return (
    <div className="clay-modal-backdrop" onClick={onClose}>
      <div
        className="clay-modal-window quick-view"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <button
          type="button"
          className="clay-modal-close-btn"
          onClick={onClose}
          aria-label="Close modal"
        >
          ✕
        </button>

        <div className="clay-quickview-layout">
          {/* Left Column: Visual & Badges */}
          <div className="clay-quickview-visual">
            <div className="clay-modal-img-container">
              {image && !imgError ? (
                <img
                  src={image}
                  alt={name}
                  className="clay-modal-product-img"
                  onError={() => setImgError(true)}
                />
              ) : (
                <span className="big-icon">{icon || "🌿"}</span>
              )}
            </div>

            <span
              className={`clay-dosha-badge ${dosha || "tridoshic"}`}
              style={{ margin: "1rem 0 0.8rem" }}
            >
              {doshaLabel}
            </span>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", justifyContent: "center" }}>
              {certifications &&
                certifications.map((cert) => (
                  <span
                    key={cert}
                    className="clay-ingredient-tag"
                    style={{ background: "var(--warm-beige-pill)" }}
                  >
                    ✓ {cert}
                  </span>
                ))}
            </div>
          </div>

          {/* Right Column: Full Details */}
          <div className="clay-quickview-details">
            <span className="clay-product-category">{categoryLabel}</span>
            <h2>{name}</h2>

            <div className="clay-product-rating" style={{ marginBottom: "1rem" }}>
              <span className="clay-stars">★ {rating.toFixed(1)}</span>
              <span className="clay-rating-count">({reviewCount} customer reviews)</span>
            </div>

            <div style={{ display: "flex", alignItems: "baseline", gap: "0.8rem", marginBottom: "1.2rem" }}>
              <span className="clay-current-price" style={{ fontSize: "1.8rem" }}>
                ₹{price.toLocaleString('en-IN')}
              </span>
              {originalPrice && (
                <span className="clay-original-price" style={{ fontSize: "1rem" }}>
                  ₹{originalPrice.toLocaleString('en-IN')}
                </span>
              )}
              <span
                style={{
                  fontSize: "0.78rem",
                  color: inStock ? "var(--forest-primary)" : "var(--status-danger)",
                  fontWeight: 700
                }}
              >
                {inStock ? "● In Stock & Ready to Dispatch" : "○ Out of Stock"}
              </span>
            </div>

            <p style={{ color: "var(--text-muted)", fontSize: "0.92rem", lineHeight: "1.5", marginBottom: "1.2rem" }}>
              {description}
            </p>

            {/* Ayurvedic Benefits */}
            {benefits && benefits.length > 0 && (
              <div className="clay-benefits-box">
                <h4>🌿 Primary Holistic Health Benefits:</h4>
                <ul>
                  {benefits.map((b) => (
                    <li key={b}>✦ {b}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Key Ingredients */}
            {ingredients && ingredients.length > 0 && (
              <div style={{ marginBottom: "1.2rem" }}>
                <span className="clay-filter-label" style={{ display: "block", marginBottom: "0.4rem" }}>
                  Active Botanical Ingredients:
                </span>
                <div className="clay-ingredients-list">
                  {ingredients.map((ing) => (
                    <span key={ing} className="clay-ingredient-tag">
                      {ing}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Dosage */}
            {dosage && (
              <div style={{ marginBottom: "1.5rem", fontSize: "0.85rem", color: "var(--text-muted)" }}>
                <strong>Vaidya Recommended Usage: </strong>
                {dosage}
              </div>
            )}

            {/* Actions & Quantity */}
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <div className="clay-qty-stepper">
                <button
                  type="button"
                  className="clay-stepper-btn"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                >
                  −
                </button>
                <span className="clay-stepper-value">{quantity}</span>
                <button
                  type="button"
                  className="clay-stepper-btn"
                  onClick={() => setQuantity((q) => q + 1)}
                >
                  +
                </button>
              </div>

              <button
                type="button"
                className="clay-action-btn primary-cart-btn"
                style={{ flex: 1, padding: "0.85rem" }}
                onClick={() => {
                  onAddToCart(product, quantity);
                  onClose();
                }}
                disabled={!inStock}
              >
                🛒 Add {quantity} to Cart • ₹{(price * quantity).toLocaleString('en-IN')}
              </button>

              <button
                type="button"
                className={`clay-action-btn ${isWishlisted ? "active" : ""}`}
                onClick={() => onToggleWishlist(product)}
                title={isWishlisted ? "In Wishlist" : "Add to Wishlist"}
              >
                {isWishlisted ? "❤️ Saved" : "🤍 Wishlist"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
