import React from "react";

export default function MarketplaceHeader({
  activeView,
  onSelectView,
  cartCount,
  wishlistCount,
}) {
  return (
    <header className="clay-header">

      {/* ======================================================
          TOP ANNOUNCEMENT BAR
      ====================================================== */}

      <div className="clay-announcement-bar">
        <div className="clay-announcement-content">

          <span>🌿 100% Certified Ayurvedic</span>

          <span className="announcement-sep">•</span>

          <span>
            <strong className="badge-highlight">AYUR20</strong>{" "}
            20% Off Orders
          </span>

          <span className="announcement-sep">•</span>

          <span>🚚 Free Express Shipping Over ₹999</span>

        </div>
      </div>

      {/* ======================================================
          MAIN HEADER
      ====================================================== */}

      <div className="clay-header-container">

        {/* BRAND */}

        <div
          className="clay-brand"
          onClick={() => onSelectView("catalogue")}
          role="button"
          tabIndex={0}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              onSelectView("catalogue");
            }
          }}
        >
          <div className="clay-brand-logo">
            🍃
          </div>

          <div className="clay-brand-info">
            <h1>NUROVA</h1>
            <span>Ayurveda Marketplace</span>
          </div>
        </div>

        {/* ==================================================
            DESKTOP NAVIGATION
        ================================================== */}

        <nav
          className="clay-nav-tabs desktop-only"
          aria-label="Marketplace Navigation"
        >

          {/* SHOP */}

          <button
            type="button"
            className={`clay-tab-btn ${
              activeView === "catalogue" ? "active" : ""
            }`}
            onClick={() => onSelectView("catalogue")}
          >
            <span>🌿</span>
            <span>Remedies & Shop</span>
          </button>

          {/* WISHLIST */}

          <button
            type="button"
            className={`clay-tab-btn ${
              activeView === "wishlist" ? "active" : ""
            }`}
            onClick={() => onSelectView("wishlist")}
          >
            <span>❤️</span>
            <span>Wishlist</span>

            {wishlistCount > 0 && (
              <span className="clay-badge-counter">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* CART */}

          <button
            type="button"
            className={`clay-tab-btn ${
              activeView === "cart" ? "active" : ""
            }`}
            onClick={() => onSelectView("cart")}
          >
            <span>🛒</span>
            <span>My Cart</span>

            {cartCount > 0 && (
              <span className="clay-badge-counter">
                {cartCount}
              </span>
            )}
          </button>

          {/* MY ORDERS */}

          <button
            type="button"
            className={`clay-tab-btn ${
              activeView === "orders" ? "active" : ""
            }`}
            onClick={() => onSelectView("orders")}
          >
            <span>📦</span>
            <span>My Orders</span>
          </button>

        </nav>

        {/* ==================================================
            RIGHT-SIDE ACTION BUTTONS REMOVED
           
            Previously contained:
            - Saved
            - Orders
            - Cart

            These are already available in the main
            navigation above, so they are intentionally removed.
        ================================================== */}

      </div>

      {/* ======================================================
          MOBILE TAB BAR
      ====================================================== */}

      <div className="clay-mobile-tab-bar mobile-only">

        {/* SHOP */}

        <button
          type="button"
          className={`clay-mobile-tab-btn ${
            activeView === "catalogue" ? "active" : ""
          }`}
          onClick={() => onSelectView("catalogue")}
        >
          <span>🌿 Shop</span>
        </button>

        {/* WISHLIST */}

        <button
          type="button"
          className={`clay-mobile-tab-btn ${
            activeView === "wishlist" ? "active" : ""
          }`}
          onClick={() => onSelectView("wishlist")}
        >
          <span>
            ❤️ Wishlist{" "}
            {wishlistCount > 0 ? `(${wishlistCount})` : ""}
          </span>
        </button>

        {/* CART */}

        <button
          type="button"
          className={`clay-mobile-tab-btn ${
            activeView === "cart" ? "active" : ""
          }`}
          onClick={() => onSelectView("cart")}
        >
          <span>
            🛒 Cart{" "}
            {cartCount > 0 ? `(${cartCount})` : ""}
          </span>
        </button>

        {/* ORDERS */}

        <button
          type="button"
          className={`clay-mobile-tab-btn ${
            activeView === "orders" ? "active" : ""
          }`}
          onClick={() => onSelectView("orders")}
        >
          <span>📦 Orders</span>
        </button>

      </div>
    </header>
  );
}