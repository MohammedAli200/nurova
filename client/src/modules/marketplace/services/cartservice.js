// ==========================================================================
// NUROVA - CART & CHECKOUT SERVICE
// Connected to Express + MongoDB backend
// ==========================================================================

const CART_STORAGE_KEY = "nurova_ayurveda_cart";
const ORDER_HISTORY_KEY = "nurova_order_history";
const GUEST_USER_ID_KEY = "nurova_guest_user_id";

const API_BASE_URL = "http://localhost:5001/api";

// ==========================================================================
// PROMO COUPONS
// ==========================================================================

export const PROMO_COUPONS = {
  AYUR20: {
    type: "percent",
    value: 20,
    desc: "20% off your entire Ayurvedic order",
  },

  HERBAL100: {
    type: "flat",
    value: 100,
    desc: "₹100 off on your Ayurvedic order",
  },

  HERBAL10: {
    type: "flat",
    value: 100,
    desc: "₹100 flat discount applied",
  },

  FREESHIP: {
    type: "shipping",
    value: 0,
    desc: "Free Express Ayurvedic Delivery",
  },
};


// ==========================================================================
// CART CONSTANTS
// ==========================================================================

export const FREE_SHIPPING_THRESHOLD = 999.0;
export const STANDARD_SHIPPING_FEE = 79.0;
export const ESTIMATED_TAX_RATE = 0.05;


// ==========================================================================
// CART STORAGE
// ==========================================================================

export const getStoredCart = () => {
  try {
    const saved = localStorage.getItem(CART_STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error("Failed to read cart from localStorage:", error);
    return [];
  }
};


export const saveCart = (items) => {
  try {
    localStorage.setItem(
      CART_STORAGE_KEY,
      JSON.stringify(items)
    );
  } catch (error) {
    console.error(
      "Failed to save cart to localStorage:",
      error
    );
  }
};


// ==========================================================================
// GUEST USER ID
// ==========================================================================
//
// Your current backend requires userId.
// Since authentication is not yet connected, we create one valid MongoDB
// ObjectId and keep it in localStorage.
//
// Later, when authentication is merged, replace this with the logged-in
// user's real ID.
//

const getGuestUserId = () => {
  try {
    let guestUserId = localStorage.getItem(
      GUEST_USER_ID_KEY
    );

    if (guestUserId) {
      return guestUserId;
    }

    // Generate a valid 24-character MongoDB ObjectId-style value.
    guestUserId = Array.from(
      crypto.getRandomValues(new Uint8Array(12))
    )
      .map((byte) =>
        byte.toString(16).padStart(2, "0")
      )
      .join("");

    localStorage.setItem(
      GUEST_USER_ID_KEY,
      guestUserId
    );

    return guestUserId;
  } catch (error) {
    console.error(
      "Failed to create guest user ID:",
      error
    );

    // Safe fallback 24-character MongoDB ObjectId.
    return "000000000000000000000001";
  }
};


// ==========================================================================
// CART TOTAL CALCULATION
// ==========================================================================

export const calculateCartTotals = (
  items,
  appliedCoupon = null,
  ecoPackaging = true
) => {
  const subtotal = items.reduce(
    (acc, item) =>
      acc + Number(item.price || 0) * Number(item.quantity || 0),
    0
  );


  // ------------------------------------------------------------------------
  // Discount
  // ------------------------------------------------------------------------

  let discountAmount = 0;

  if (
    appliedCoupon &&
    PROMO_COUPONS[appliedCoupon]
  ) {
    const coupon = PROMO_COUPONS[appliedCoupon];

    if (coupon.type === "percent") {
      discountAmount =
        (subtotal * coupon.value) / 100;
    }

    if (coupon.type === "flat") {
      discountAmount = Math.min(
        coupon.value,
        subtotal
      );
    }
  }


  // ------------------------------------------------------------------------
  // Shipping
  // ------------------------------------------------------------------------

  const shippingFee =
    subtotal >= FREE_SHIPPING_THRESHOLD ||
    appliedCoupon === "FREESHIP" ||
    subtotal === 0
      ? 0
      : STANDARD_SHIPPING_FEE;


  // ------------------------------------------------------------------------
  // Eco Packaging
  // ------------------------------------------------------------------------

  const packagingFee =
    ecoPackaging && subtotal > 0
      ? 49.0
      : 0;


  // ------------------------------------------------------------------------
  // Tax
  // ------------------------------------------------------------------------

  const taxableAmount = Math.max(
    0,
    subtotal - discountAmount
  );

  const tax =
    taxableAmount * ESTIMATED_TAX_RATE;


  // ------------------------------------------------------------------------
  // Grand Total
  // ------------------------------------------------------------------------

  const grandTotal = Math.max(
    0,
    taxableAmount +
      shippingFee +
      packagingFee +
      tax
  );


  // ------------------------------------------------------------------------
  // Free Shipping Progress
  // ------------------------------------------------------------------------

  const freeShippingProgress = Math.min(
    100,
    (subtotal / FREE_SHIPPING_THRESHOLD) * 100
  );

  const amountNeededForFreeShipping = Math.max(
    0,
    FREE_SHIPPING_THRESHOLD - subtotal
  );


  return {
    subtotal: Number(
      subtotal.toFixed(2)
    ),

    discountAmount: Number(
      discountAmount.toFixed(2)
    ),

    shippingFee: Number(
      shippingFee.toFixed(2)
    ),

    packagingFee: Number(
      packagingFee.toFixed(2)
    ),

    tax: Number(
      tax.toFixed(2)
    ),

    grandTotal: Number(
      grandTotal.toFixed(2)
    ),

    freeShippingProgress:
      Math.round(freeShippingProgress),

    amountNeededForFreeShipping: Number(
      amountNeededForFreeShipping.toFixed(2)
    ),

    totalCount: items.reduce(
      (acc, item) =>
        acc + Number(item.quantity || 0),
      0
    ),
  };
};


// ==========================================================================
// CREATE ORDER THROUGH BACKEND
// ==========================================================================
//
// IMPORTANT:
// Current backend Order model supports ONE product per order.
// Therefore each cart item is sent as a separate order.
//
// Example:
//
// Cart:
//   Product A x 2
//   Product B x 1
//
// Backend:
//   Order #1 -> Product A x 2
//   Order #2 -> Product B x 1
//
// ==========================================================================
export const placeOrder = (orderData) => {
  const orderId =
    "NUR-" + Math.floor(100000 + Math.random() * 900000);

  const orderReceipt = {
    orderId,

    timestamp: new Date().toISOString(),

    formattedDate: new Date().toLocaleDateString("en-IN", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }),

    trackingCode:
      "TRK-AYUR-" +
      Math.random()
        .toString(36)
        .substring(2, 9)
        .toUpperCase(),

    status: "Confirmed & Prepared by Ayurvedic Vaidya",

    deliveryEstimate: "2 - 4 Business Days Across India",

    ...orderData,
  };

  try {
    const history = JSON.parse(
      localStorage.getItem(ORDER_HISTORY_KEY) || "[]"
    );

    history.unshift(orderReceipt);

    localStorage.setItem(
      ORDER_HISTORY_KEY,
      JSON.stringify(history)
    );

    localStorage.removeItem(CART_STORAGE_KEY);
  } catch (error) {
    console.error("Order persistence error:", error);
  }

  return orderReceipt;
};


// ==========================================================================
// OPTIONAL: GET LOCAL ORDER HISTORY
// ==========================================================================

export const getOrderHistory = () => {
  try {
    return JSON.parse(
      localStorage.getItem(
        ORDER_HISTORY_KEY
      ) || "[]"
    );
  } catch {
    return [];
  }
};


// ==========================================================================
// OPTIONAL: CLEAR ORDER HISTORY
// ==========================================================================

export const clearOrderHistory = () => {
  try {
    localStorage.removeItem(
      ORDER_HISTORY_KEY
    );
  } catch (error) {
    console.error(
      "Failed to clear order history:",
      error
    );
  }
};