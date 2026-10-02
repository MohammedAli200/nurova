import React from "react";
import ProductCard from "../components/productcard";

export default function WishlistPage({
  wishlistHook,
  cartHook,
  onNavigateToShop
}) {
  const { wishlist, toggleWishlist, clearWishlist, isWishlisted } = wishlistHook;
  const { addToCart, isInCart } = cartHook;

  const handleAddAllToCart = () => {
    wishlist.forEach((item) => {
      addToCart(item, 1);
    });
  };

  if (!wishlist || wishlist.length === 0) {
    return (
      <main className="clay-wishlist-page">
        <div className="clay-empty-box">
          <div className="clay-empty-icon">❤️</div>
          <h3>Your Wishlist is Empty</h3>
          <p>
            You haven't saved any herbal remedies yet. Click the heart icon on
            any Ayurvedic product to save it to your sacred wellness collection.
          </p>
          <button
            type="button"
            className="clay-action-btn primary-cart-btn"
            onClick={onNavigateToShop}
            style={{ padding: "0.85rem 2rem" }}
          >
            🌿 Explore Ayurvedic Catalogue
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="clay-wishlist-page">
      <div className="clay-wishlist-header">
        <h2>
          <span>❤️</span> My Saved Ayurvedic Remedies ({wishlist.length})
        </h2>

        <div style={{ display: "flex", gap: "0.8rem" }}>
          <button
            type="button"
            className="clay-action-btn primary-cart-btn"
            onClick={handleAddAllToCart}
          >
            🛒 Add All to Cart
          </button>
          <button
            type="button"
            className="clay-action-btn"
            onClick={clearWishlist}
            style={{ color: "var(--status-danger)" }}
          >
            Clear Wishlist
          </button>
        </div>
      </div>

      <div className="clay-products-grid">
        {wishlist.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={addToCart}
            isInCart={isInCart(product.id)}
            isWishlisted={isWishlisted(product.id)}
            onToggleWishlist={toggleWishlist}
          />
        ))}
      </div>
    </main>
  );
}