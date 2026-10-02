import React, { useState } from "react";
import WishlistButton from "./whislistbutton";

export default function ProductCard({
  product,
  onAddToCart,
  isInCart = false,
  isWishlisted = false,
  onToggleWishlist,
  onQuickView
}) {
  const [imgError, setImgError] = useState(false);

  const {
    id,
    name,
    categoryLabel,
    price,
    originalPrice,
    rating,
    reviewCount,
    dosha,
    doshaLabel,
    description,
    icon,
    image,
    organic,
    inStock
  } = product;

  return (
    <div className="clay-product-card">
      {/* Header Badges & Wishlist */}
      <div className="clay-card-badges">
        <span className={`clay-dosha-badge ${dosha || "tridoshic"}`}>
          {doshaLabel || "Ayurvedic"}
        </span>
        <WishlistButton
          isWishlisted={isWishlisted}
          onToggle={() => onToggleWishlist(product)}
        />
      </div>

      {/* Product Artwork & Image Box */}
      <div
        className="clay-product-visual"
        onClick={() => onQuickView && onQuickView(product)}
        role="button"
        tabIndex={0}
        aria-label={`View details for ${name}`}
      >
        {image && !imgError ? (
          <img
            src={image}
            alt={name}
            className="clay-product-img"
            loading="lazy"
            onError={() => setImgError(true)}
          />
        ) : (
          <span className="product-icon">{icon || "🌿"}</span>
        )}
        
        {organic && <span className="clay-organic-tag">🌱 100% Organic</span>}
        
        <button
          type="button"
          className="clay-quick-view-btn"
          onClick={(e) => {
            e.stopPropagation();
            if (onQuickView) onQuickView(product);
          }}
        >
          👁️ Quick View
        </button>
      </div>

      {/* Card Body */}
      <div className="clay-card-body">
        <span className="clay-product-category">{categoryLabel}</span>
        <h3
          className="clay-product-title"
          onClick={() => onQuickView && onQuickView(product)}
        >
          {name}
        </h3>
        <p className="clay-product-desc">{description}</p>

        {/* Rating */}
        <div className="clay-product-rating">
          <span className="clay-stars">★ {rating.toFixed(1)}</span>
          <span className="clay-rating-count">({reviewCount} reviews)</span>
        </div>

        {/* Footer: Price & Add to Cart */}
        <div className="clay-card-footer">
          <div className="clay-price-box">
            {originalPrice && (
              <span className="clay-original-price">₹{originalPrice.toLocaleString('en-IN')}</span>
            )}
            <span className="clay-current-price">₹{price.toLocaleString('en-IN')}</span>
          </div>

          <button
            type="button"
            className={`clay-add-cart-btn ${isInCart ? "in-cart" : ""}`}
            onClick={() => onAddToCart(product, 1)}
            disabled={!inStock}
          >
            {isInCart ? "✓ Added (More)" : "🛒 Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  );
}
