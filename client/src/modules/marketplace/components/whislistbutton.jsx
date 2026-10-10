import React from "react";

export default function WishlistButton({
  isWishlisted,
  onToggle,
  ariaLabel = "Toggle wishlist"
}) {
  return (
    <button
      type="button"
      className={`clay-wishlist-toggle ${isWishlisted ? "wishlisted" : ""}`}
      onClick={(e) => {
        e.stopPropagation();
        onToggle();
      }}
      aria-label={ariaLabel}
      title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
    >
      {isWishlisted ? "❤️" : "🤍"}
    </button>
  );
}
