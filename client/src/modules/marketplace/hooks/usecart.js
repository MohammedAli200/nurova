import { useState, useEffect, useCallback } from "react";
import {
  getStoredCart,
  saveCart,
  calculateCartTotals,
  placeOrder,
  PROMO_COUPONS,
} from "../services/cartservice";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5001";

/*
 * Your backend currently requires a userId.
 *
 * Since your project does not currently have a User model/authentication
 * connected to the marketplace, we create and remember a valid MongoDB
 * ObjectId-shaped guest ID in localStorage.
 */
const getOrCreateUserId = () => {
  const STORAGE_KEY = "nurova_user_id";

  try {
    const existingUserId = localStorage.getItem(STORAGE_KEY);

    // MongoDB ObjectId = exactly 24 hexadecimal characters
    if (/^[a-fA-F0-9]{24}$/.test(existingUserId || "")) {
      return existingUserId;
    }

    let newUserId;

    if (
      typeof crypto !== "undefined" &&
      typeof crypto.randomUUID === "function"
    ) {
      newUserId = crypto.randomUUID().replace(/-/g, "").substring(0, 24);
    } else {
      newUserId = Array.from({ length: 24 }, () =>
        Math.floor(Math.random() * 16).toString(16)
      ).join("");
    }

    localStorage.setItem(STORAGE_KEY, newUserId);

    return newUserId;
  } catch (error) {
    console.error("Could not create guest user ID:", error);

    // Fallback valid MongoDB ObjectId-shaped string
    return Array.from({ length: 24 }, () =>
      Math.floor(Math.random() * 16).toString(16)
    ).join("");
  }
};

/*
 * Extract the MongoDB product ID from a frontend product.
 *
 * Depending on your productservice.js, your product may use:
 *   product.id
 *   product._id
 *   product.productId
 */
const getProductId = (product) => {
  return product?._id || product?.id || product?.productId || null;
};

export function useCart() {
  const [cartItems, setCartItems] = useState(getStoredCart);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [ecoPackaging, setEcoPackaging] = useState(true);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [lastCompletedOrder, setLastCompletedOrder] = useState(null);

  // ------------------------------------------------------------
  // Keep cart synchronized with localStorage
  // ------------------------------------------------------------

  useEffect(() => {
    saveCart(cartItems);
  }, [cartItems]);

  // ------------------------------------------------------------
  // ADD TO CART
  // ------------------------------------------------------------

  const addToCart = useCallback((product, quantity = 1) => {
    setCartItems((prevItems) => {
      const productId = getProductId(product);

      const existingIndex = prevItems.findIndex(
        (item) => getProductId(item) === productId
      );

      if (existingIndex > -1) {
        const updated = [...prevItems];

        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity:
            Number(updated[existingIndex].quantity || 0) +
            Number(quantity || 1),
        };

        return updated;
      }

      return [
        ...prevItems,
        {
          ...product,
          quantity: Number(quantity) || 1,
        },
      ];
    });
  }, []);

  // ------------------------------------------------------------
  // REMOVE FROM CART
  // ------------------------------------------------------------

  const removeFromCart = useCallback((productId) => {
    setCartItems((prev) =>
      prev.filter((item) => getProductId(item) !== productId)
    );
  }, []);

  // ------------------------------------------------------------
  // UPDATE QUANTITY
  // ------------------------------------------------------------

  const updateQuantity = useCallback(
    (productId, newQty) => {
      if (newQty <= 0) {
        removeFromCart(productId);
        return;
      }

      setCartItems((prev) =>
        prev.map((item) =>
          getProductId(item) === productId
            ? {
                ...item,
                quantity: Number(newQty),
              }
            : item
        )
      );
    },
    [removeFromCart]
  );

  // ------------------------------------------------------------
  // CLEAR CART
  // ------------------------------------------------------------

  const clearCart = useCallback(() => {
    setCartItems([]);
    setAppliedCoupon(null);
  }, []);

  // ------------------------------------------------------------
  // APPLY COUPON
  // ------------------------------------------------------------

  const applyCouponCode = useCallback((code) => {
    const cleanCode = String(code || "").trim().toUpperCase();

    if (PROMO_COUPONS[cleanCode]) {
      setAppliedCoupon(cleanCode);

      return {
        success: true,
        message: `Promo code "${cleanCode}" applied: ${PROMO_COUPONS[cleanCode].desc}`,
      };
    }

    return {
      success: false,
      message: `Invalid coupon code "${code}". Try AYUR20 or HERBAL10`,
    };
  }, []);

  // ------------------------------------------------------------
  // REMOVE COUPON
  // ------------------------------------------------------------

  const removeCoupon = useCallback(() => {
    setAppliedCoupon(null);
  }, []);

  // ------------------------------------------------------------
  // ECO PACKAGING
  // ------------------------------------------------------------

  const toggleEcoPackaging = useCallback(() => {
    setEcoPackaging((prev) => !prev);
  }, []);

  // ------------------------------------------------------------
  // CHECKOUT -> MONGODB
  // ------------------------------------------------------------

  const checkoutOrder = useCallback(
    async (shippingInfo, paymentMethod) => {
      if (!cartItems || cartItems.length === 0) {
        throw new Error("Your cart is empty.");
      }

      setIsCheckingOut(true);

      try {
        console.log("====================================");
        console.log("NUROVA CHECKOUT STARTED");
        console.log("====================================");

        const totals = calculateCartTotals(
          cartItems,
          appliedCoupon,
          ecoPackaging
        );

        console.log("Cart items:", cartItems);
        console.log("Cart totals:", totals);
        console.log("Payment method:", paymentMethod);
        console.log("Shipping info:", shippingInfo);

        // Get/create user ID required by your backend
        const userId = getOrCreateUserId();

        console.log("User ID:", userId);

        /*
         * Your backend order schema is:
         *
         * userId
         * productId
         * quantity
         * totalAmount
         *
         * Therefore, if the cart contains 3 products,
         * we create 3 MongoDB orders.
         */

        const mongoOrders = [];

        for (const item of cartItems) {
          const productId = getProductId(item);

          if (!productId) {
            throw new Error(
              `Product "${item.name || "Unknown"}" does not have a valid product ID.`
            );
          }

          /*
           * The backend uses mongoose.Types.ObjectId.isValid(),
           * so productId must be a valid MongoDB ObjectId.
           */
          if (!/^[a-fA-F0-9]{24}$/.test(String(productId))) {
            throw new Error(
              `Invalid MongoDB product ID for "${item.name || "Unknown product"}": ${productId}`
            );
          }

          const quantity = Number(item.quantity) || 1;

          /*
           * Product-level total.
           *
           * Your current backend calculates:
           * product.price * quantity
           */
          const productTotal = Number(item.price || 0) * quantity;

          const orderPayload = {
            userId,
            productId: String(productId),
            quantity,
          };

          console.log("Creating MongoDB order:", orderPayload);

          const response = await fetch(`${API_BASE_URL}/api/orders`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(orderPayload),
          });

          let data;

          try {
            data = await response.json();
          } catch {
            data = null;
          }

          if (!response.ok) {
            console.error("MongoDB order creation failed:", {
              status: response.status,
              response: data,
              payload: orderPayload,
            });

            throw new Error(
              data?.message ||
                `Order creation failed with HTTP ${response.status}`
            );
          }

          if (!data?.success) {
            throw new Error(
              data?.message || "Backend rejected the order."
            );
          }

          console.log("MongoDB order created:", data.data);

          mongoOrders.push({
            ...data.data,
            frontendProduct: item,
            productTotal,
          });
        }

        /*
         * Save the complete frontend receipt locally as well.
         *
         * MongoDB is now the backend source of the order,
         * while localStorage keeps your existing receipt/history UI working.
         */
        const receipt = placeOrder({
          items: cartItems,
          totals,
          shippingInfo,
          paymentMethod,
          appliedCoupon,

          // Backend-created MongoDB orders
          mongoOrders,

          // Useful for displaying/debugging
          userId,

          // Main MongoDB order ID
          mongoOrderIds: mongoOrders
            .map((order) => order?._id)
            .filter(Boolean),

          // Keep frontend receipt ID too
          backendOrderCreated: true,
        });

        console.log("====================================");
        console.log("ORDER COMPLETED SUCCESSFULLY");
        console.log("MongoDB orders:", mongoOrders);
        console.log("Receipt:", receipt);
        console.log("====================================");

        setLastCompletedOrder(receipt);

        // Empty cart only AFTER MongoDB order creation succeeds
        clearCart();

        return receipt;
      } catch (error) {
        console.error("====================================");
        console.error("CHECKOUT FAILED");
        console.error(error);
        console.error("====================================");

        /*
         * Important:
         * Do NOT clear the cart if MongoDB order creation failed.
         * The customer can retry payment/order placement.
         */

        throw error;
      } finally {
        setIsCheckingOut(false);
      }
    },
    [
      cartItems,
      appliedCoupon,
      ecoPackaging,
      clearCart,
    ]
  );

  // ------------------------------------------------------------
  // TOTALS
  // ------------------------------------------------------------

  const totals = calculateCartTotals(
    cartItems,
    appliedCoupon,
    ecoPackaging
  );

  // ------------------------------------------------------------
  // CHECK WHETHER PRODUCT IS IN CART
  // ------------------------------------------------------------

  const isInCart = useCallback(
    (productId) => {
      return cartItems.some(
        (item) => getProductId(item) === productId
      );
    },
    [cartItems]
  );

  // ------------------------------------------------------------
  // RETURN CART API
  // ------------------------------------------------------------

  return {
    cartItems,

    addToCart,
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

    lastCompletedOrder,
    setLastCompletedOrder,

    isInCart,
  };
}

export default useCart;