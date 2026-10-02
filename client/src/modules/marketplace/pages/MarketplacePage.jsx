import React, { useState } from "react";
import "../marketplace.css";

import ProductPage from "./productpage";
import CartPage from "./cartpage";
import WishlistPage from "./whislistpage";
import OrdersPage from "./orderspage";

import MarketplaceHeader from "../components/MarketplaceHeader";

import useProducts from "../hooks/useproducts";
import useCart from "../hooks/usecart";
import useWishlist from "../hooks/usewhislist";
import useOrders from "../hooks/useorders";

export default function MarketplacePage() {
  const [activeView, setActiveView] = useState("catalogue");

  const productsHook = useProducts();
  const cartHook = useCart();
  const wishlistHook = useWishlist();

  const userId = cartHook.cartItems.length
    ? localStorage.getItem("nurova_user_id")
    : localStorage.getItem("nurova_user_id");

  const ordersHook = useOrders(userId);

  const cartCount = cartHook.cartItems.reduce(
    (total, item) => total + (Number(item.quantity) || 0),
    0
  );

  const wishlistCount = wishlistHook.wishlistCount;

  const handleSelectView = (view) => {
    setActiveView(view);
  };

  const handleNavigateToShop = () => {
    setActiveView("catalogue");
  };

  return (
    <>
      <MarketplaceHeader
        activeView={activeView}
        onSelectView={handleSelectView}
        cartCount={cartCount}
        wishlistCount={wishlistCount}
      />

      {activeView === "catalogue" && (
        <ProductPage
          productsHook={productsHook}
          cartHook={cartHook}
          wishlistHook={wishlistHook}
        />
      )}

      {activeView === "cart" && (
        <CartPage
          cartHook={cartHook}
          wishlistHook={wishlistHook}
          onNavigateToShop={handleNavigateToShop}
        />
      )}

      {activeView === "wishlist" && (
        <WishlistPage
          wishlistHook={wishlistHook}
          cartHook={cartHook}
          onNavigateToShop={handleNavigateToShop}
        />
      )}

      {activeView === "orders" && (
        <OrdersPage
          ordersHook={ordersHook}
          onNavigateToShop={handleNavigateToShop}
        />
      )}
    </>
  );
}