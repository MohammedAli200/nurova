import React, { useState } from "react";
import ProductCard from "./productcard";

export default function ProductGrid({
  products,
  onAddToCart,
  isInCart,
  isWishlisted,
  onToggleWishlist,
  onQuickView,
  onResetFilters
}) {
  const [visibleCount, setVisibleCount] = useState(16);

  if (!products || products.length === 0) {
    return (
      <div className="clay-empty-box">
        <div className="clay-empty-icon">🍃</div>

        <h3>No Ayurvedic Remedies Found</h3>

        <p>
          We couldn't find any products matching your specific combination of
          filters or search query. Try adjusting your selections.
        </p>

        {onResetFilters && (
          <button
            type="button"
            className="clay-action-btn primary-cart-btn"
            onClick={onResetFilters}
          >
            Clear All Filters
          </button>
        )}
      </div>
    );
  }

  const displayedProducts = products.slice(0, visibleCount);
  const remainingCount = products.length - displayedProducts.length;

  return (
    <div>
      <div className="clay-products-grid">
        {displayedProducts.map((product) => {
          // MongoDB uses _id
          const productId = product._id;

          return (
            <ProductCard
              key={productId}
              product={product}
              onAddToCart={onAddToCart}
              isInCart={isInCart(productId)}
              isWishlisted={isWishlisted(productId)}
              onToggleWishlist={onToggleWishlist}
              onQuickView={onQuickView}
            />
          );
        })}
      </div>

      {remainingCount > 0 && (
        <div
          style={{
            textAlign: "center",
            margin: "2.5rem 0 1rem"
          }}
        >
          <button
            type="button"
            className="clay-action-btn primary-cart-btn"
            onClick={() => setVisibleCount((prev) => prev + 16)}
            style={{
              padding: "0.9rem 2.2rem",
              fontSize: "1rem"
            }}
          >
            🌿 Load More Remedies ({remainingCount} more)
          </button>

          <p
            style={{
              marginTop: "0.6rem",
              fontSize: "0.82rem",
              color: "var(--text-muted)",
              fontWeight: 600
            }}
          >
            Showing {displayedProducts.length} of {products.length} Authentic
            Ayurvedic Formulations
          </p>
        </div>
      )}
    </div>
  );
}