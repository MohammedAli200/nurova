import React, { useEffect, useState } from "react";

export default function CheckoutModal({
  isOpen,
  onClose,
  cartItems,
  totals,
  onConfirmOrder,
  isCheckingOut,
}) {
 const [shippingInfo, setShippingInfo] = useState({
  fullName: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  postalCode: "",
  practitionerNote: "",
});
const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [orderReceipt, setOrderReceipt] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  /*
   * Reset checkout when modal opens.
   * This prevents an old Receipt/Payment step from appearing
   * when the user opens checkout again.
   */
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setOrderReceipt(null);
      setErrorMessage("");
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setShippingInfo((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errorMessage) {
      setErrorMessage("");
    }
  };

  const validateShippingInfo = () => {
    if (!shippingInfo.fullName.trim()) {
      return "Please enter your full name.";
    }

    if (!shippingInfo.phone.trim()) {
      return "Please enter your phone number.";
    }

    if (!shippingInfo.address.trim()) {
      return "Please enter your street address.";
    }

    if (!shippingInfo.city.trim()) {
      return "Please enter your city.";
    }

    if (!shippingInfo.postalCode.trim()) {
      return "Please enter your PIN / postal code.";
    }

    if (shippingInfo.phone.trim().length < 10) {
      return "Please enter a valid phone number.";
    }

    if (shippingInfo.postalCode.trim().length < 5) {
      return "Please enter a valid postal code.";
    }

    return null;
  };

  const handleGoToPayment = (e) => {
    e.preventDefault();

    const validationError = validateShippingInfo();

    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    if (!cartItems || cartItems.length === 0) {
      setErrorMessage("Your cart is empty. Please add a product before checkout.");
      return;
    }

    setErrorMessage("");
    setStep(2);
  };

  const handleFinalizeOrder = async () => {
    if (isCheckingOut) {
      return;
    }

    if (!cartItems || cartItems.length === 0) {
      setErrorMessage("Your cart is empty. Unable to place this order.");
      return;
    }

    if (!paymentMethod) {
      setErrorMessage("Please select a payment method.");
      return;
    }

    setErrorMessage("");

    try {
      /*
       * IMPORTANT:
       *
       * We now send the complete checkout information:
       * - shippingInfo
       * - paymentMethod
       * - cartItems
       * - totals
       *
       * Your useCart.js should accept these values and send
       * the appropriate order payload to:
       *
       * POST http://localhost:5001/api/orders
       */
      const receipt = await onConfirmOrder(
        shippingInfo,
        paymentMethod,
        cartItems,
        totals
      );

      if (!receipt) {
        throw new Error("Order was not created.");
      }

      setOrderReceipt(receipt);
      setStep(3);
    } catch (error) {
      console.error("Checkout failed:", error);

      setErrorMessage(
        error?.message ||
          "Unable to place your order. Please try again."
      );
    }
  };

  const handleCloseAndReset = () => {
    if (isCheckingOut) {
      return;
    }

    setStep(1);
    setOrderReceipt(null);
    setErrorMessage("");
    onClose();
  };

  const handleBackdropClick = () => {
    if (step === 3) {
      handleCloseAndReset();
      return;
    }

    if (!isCheckingOut) {
      onClose();
    }
  };

  const formatMoney = (amount) => {
    return Number(amount || 0).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  return (
    <div
      className="clay-modal-backdrop"
      onClick={handleBackdropClick}
    >
      <div
        className="clay-modal-window checkout-flow"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="checkout-title"
      >
        {/* CLOSE BUTTON */}
        <button
          type="button"
          className="clay-modal-close-btn"
          onClick={handleCloseAndReset}
          disabled={isCheckingOut}
          aria-label="Close checkout"
        >
          ✕
        </button>

        <div className="clay-checkout-modal-body">

          {/* =========================================================
              CHECKOUT STEPPER
          ========================================================= */}

          <div className="clay-checkout-stepper">

            {/* STEP 1 */}
            <div
              className={`clay-step-node ${
                step >= 1 ? "active" : ""
              } ${step > 1 ? "completed" : ""}`}
            >
              <div className="clay-step-circle">
                {step > 1 ? "✓" : "1"}
              </div>

              <span className="clay-step-title">
                Delivery
              </span>
            </div>

            <div
              style={{
                flex: 1,
                height: "3px",
                background:
                  step > 1
                    ? "var(--forest-primary)"
                    : "var(--warm-beige-dark)",
                margin: "0 10px",
              }}
            />

            {/* STEP 2 */}
            <div
              className={`clay-step-node ${
                step >= 2 ? "active" : ""
              } ${step > 2 ? "completed" : ""}`}
            >
              <div className="clay-step-circle">
                {step > 2 ? "✓" : "2"}
              </div>

              <span className="clay-step-title">
                Payment
              </span>
            </div>

            <div
              style={{
                flex: 1,
                height: "3px",
                background:
                  step > 2
                    ? "var(--forest-primary)"
                    : "var(--warm-beige-dark)",
                margin: "0 10px",
              }}
            />

            {/* STEP 3 */}
            <div
              className={`clay-step-node ${
                step === 3 ? "active completed" : ""
              }`}
            >
              <div className="clay-step-circle">
                {step === 3 ? "✓" : "3"}
              </div>

              <span className="clay-step-title">
                Receipt
              </span>
            </div>
          </div>

          {/* ERROR MESSAGE */}

          {errorMessage && (
            <div
              role="alert"
              style={{
                marginBottom: "1rem",
                padding: "0.85rem 1rem",
                borderRadius: "12px",
                background: "#fff0ed",
                border: "1px solid #e4a08a",
                color: "#a13b20",
                fontWeight: 700,
              }}
            >
              ⚠️ {errorMessage}
            </div>
          )}

          {/* =========================================================
              STEP 1 — DELIVERY
          ========================================================= */}

          {step === 1 && (
            <form onSubmit={handleGoToPayment}>

              <h3
                id="checkout-title"
                style={{
                  fontSize: "1.4rem",
                  color: "var(--forest-dark)",
                  marginBottom: "1.2rem",
                }}
              >
                🌿 Ayurvedic Delivery Details
              </h3>

              {/* NAME + PHONE */}

              <div className="clay-form-grid">

                <div className="clay-form-group">
                  <label htmlFor="fullName">
                    Full Name *
                  </label>

                  <input
                    id="fullName"
                    type="text"
                    name="fullName"
                    required
                    className="clay-form-input"
                    value={shippingInfo.fullName}
                    onChange={handleInputChange}
                    autoComplete="name"
                  />
                </div>

                <div className="clay-form-group">
                  <label htmlFor="phone">
                    Phone Number *
                  </label>

                  <input
                    id="phone"
                    type="tel"
                    name="phone"
                    required
                    className="clay-form-input"
                    value={shippingInfo.phone}
                    onChange={handleInputChange}
                    autoComplete="tel"
                  />
                </div>

              </div>

              {/* EMAIL */}

              <div className="clay-form-group">
                <label htmlFor="email">
                  Email Address
                </label>

                <input
                  id="email"
                  type="email"
                  name="email"
                  className="clay-form-input"
                  value={shippingInfo.email}
                  onChange={handleInputChange}
                  autoComplete="email"
                />
              </div>

              {/* ADDRESS */}

              <div className="clay-form-group">
                <label htmlFor="address">
                  Street Address *
                </label>

                <input
                  id="address"
                  type="text"
                  name="address"
                  required
                  className="clay-form-input"
                  value={shippingInfo.address}
                  onChange={handleInputChange}
                  autoComplete="street-address"
                />
              </div>

              {/* CITY + PIN */}

              <div className="clay-form-grid">

                <div className="clay-form-group">
                  <label htmlFor="city">
                    City *
                  </label>

                  <input
                    id="city"
                    type="text"
                    name="city"
                    required
                    className="clay-form-input"
                    value={shippingInfo.city}
                    onChange={handleInputChange}
                    autoComplete="address-level2"
                  />
                </div>

                <div className="clay-form-group">
                  <label htmlFor="postalCode">
                    PIN / Postal Code *
                  </label>

                  <input
                    id="postalCode"
                    type="text"
                    name="postalCode"
                    required
                    className="clay-form-input"
                    value={shippingInfo.postalCode}
                    onChange={handleInputChange}
                    autoComplete="postal-code"
                  />
                </div>

              </div>

              {/* STATE */}

              <div className="clay-form-group">
                <label htmlFor="state">
                  State
                </label>

                <input
                  id="state"
                  type="text"
                  name="state"
                  className="clay-form-input"
                  value={shippingInfo.state}
                  onChange={handleInputChange}
                  autoComplete="address-level1"
                />
              </div>

              {/* PRACTITIONER NOTE */}

              <div className="clay-form-group">
                <label htmlFor="practitionerNote">
                  Practitioner Note / Health Instructions (Optional)
                </label>

                <textarea
                  id="practitionerNote"
                  name="practitionerNote"
                  rows="2"
                  className="clay-form-textarea"
                  value={shippingInfo.practitionerNote}
                  onChange={handleInputChange}
                />
              </div>

              {/* TOTAL + CONTINUE */}

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "1rem",
                  marginTop: "1.5rem",
                  flexWrap: "wrap",
                }}
              >
                <span
                  style={{
                    fontSize: "1.1rem",
                    fontWeight: 800,
                    color: "var(--forest-dark)",
                  }}
                >
                  Order Total: ₹{formatMoney(totals.grandTotal)}
                </span>

                <button
                  type="submit"
                  className="clay-checkout-cta-btn"
                  style={{
                    width: "auto",
                    padding: "0.85rem 2rem",
                  }}
                >
                  Continue to Payment →
                </button>
              </div>
            </form>
          )}

          {/* =========================================================
              STEP 2 — PAYMENT
          ========================================================= */}

          {step === 2 && (
            <div>

              <h3
                style={{
                  fontSize: "1.4rem",
                  color: "var(--forest-dark)",
                  marginBottom: "1.2rem",
                }}
              >
                💳 Choose Payment Method
              </h3>

              {/* PAYMENT OPTIONS */}

              <div className="clay-payment-options">

                <button
                  type="button"
                  className={`clay-payment-card ${
                    paymentMethod === "upi"
                      ? "selected"
                      : ""
                  }`}
                  onClick={() => setPaymentMethod("upi")}
                  disabled={isCheckingOut}
                >
                  <span className="pay-icon">
                    📱
                  </span>

                  <div>
                    <h5>Instant UPI / QR</h5>
                    <p>GPay, PhonePe, Paytm, BHIM</p>
                  </div>
                </button>

                <button
                  type="button"
                  className={`clay-payment-card ${
                    paymentMethod === "card"
                      ? "selected"
                      : ""
                  }`}
                  onClick={() => setPaymentMethod("card")}
                  disabled={isCheckingOut}
                >
                  <span className="pay-icon">
                    💳
                  </span>

                  <div>
                    <h5>Credit / Debit Card</h5>
                    <p>Visa, MasterCard, RuPay</p>
                  </div>
                </button>

                <button
                  type="button"
                  className={`clay-payment-card ${
                    paymentMethod === "netbanking"
                      ? "selected"
                      : ""
                  }`}
                  onClick={() => setPaymentMethod("netbanking")}
                  disabled={isCheckingOut}
                >
                  <span className="pay-icon">
                    🏛️
                  </span>

                  <div>
                    <h5>Net Banking</h5>
                    <p>SBI, HDFC, ICICI, Axis & more</p>
                  </div>
                </button>

                <button
                  type="button"
                  className={`clay-payment-card ${
                    paymentMethod === "cod"
                      ? "selected"
                      : ""
                  }`}
                  onClick={() => setPaymentMethod("cod")}
                  disabled={isCheckingOut}
                >
                  <span className="pay-icon">
                    📦
                  </span>

                  <div>
                    <h5>Cash on Delivery</h5>
                    <p>Pay upon doorstep arrival</p>
                  </div>
                </button>

              </div>

              {/* ORDER BREAKDOWN */}

              <div className="clay-receipt-box">

                <div className="clay-receipt-row">
                  <span>Ship To:</span>

                  <strong>
                    {shippingInfo.fullName},{" "}
                    {shippingInfo.city}
                  </strong>
                </div>

                <div className="clay-receipt-row">
                  <span>Items:</span>

                  <strong>
                    {cartItems.length}{" "}
                    {cartItems.length === 1
                      ? "Product"
                      : "Products"}{" "}
                    ({totals.totalCount}{" "}
                    {totals.totalCount === 1
                      ? "item"
                      : "items"})
                  </strong>
                </div>

                <div className="clay-receipt-row">
                  <span>Total Amount Due:</span>

                  <strong
                    style={{
                      color: "var(--forest-dark)",
                      fontSize: "1.1rem",
                    }}
                  >
                    ₹{formatMoney(totals.grandTotal)}
                  </strong>
                </div>

              </div>

              {/* BUTTONS */}

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "1rem",
                  marginTop: "1.5rem",
                  flexWrap: "wrap",
                }}
              >

                <button
                  type="button"
                  className="clay-action-btn"
                  onClick={() => setStep(1)}
                  disabled={isCheckingOut}
                >
                  ← Back to Address
                </button>

                <button
                  type="button"
                  className="clay-checkout-cta-btn"
                  style={{
                    width: "auto",
                    padding: "0.85rem 2rem",
                  }}
                  onClick={handleFinalizeOrder}
                  disabled={isCheckingOut}
                >
                  <span>
                    {isCheckingOut ? "⏳" : "🔒"}
                  </span>

                  <span>
                    {isCheckingOut
                      ? "Placing Order..."
                      : `Pay ₹${formatMoney(
                          totals.grandTotal
                        )}`}
                  </span>
                </button>

              </div>
            </div>
          )}

          {/* =========================================================
              STEP 3 — SUCCESS RECEIPT
          ========================================================= */}

          {step === 3 && orderReceipt && (
            <div className="clay-success-receipt">

              <div className="clay-success-icon">
                🪷
              </div>

              <h3
                style={{
                  fontSize: "1.8rem",
                  color: "var(--forest-dark)",
                  marginBottom: "0.4rem",
                }}
              >
                Order Confirmed!
              </h3>

              <p
                style={{
                  color: "var(--text-muted)",
                  fontSize: "0.95rem",
                }}
              >
                Thank you for choosing authentic holistic
                wellness. Your remedies are being freshly
                prepared.
              </p>

              <div className="clay-receipt-box">

                <div className="clay-receipt-row">
                  <span>Order Number:</span>

                  <strong>
                    {orderReceipt.orderId ||
                      orderReceipt._id ||
                      "Processing"}
                  </strong>
                </div>

                {orderReceipt.trackingCode && (
                  <div className="clay-receipt-row">
                    <span>Tracking Code:</span>

                    <strong>
                      {orderReceipt.trackingCode}
                    </strong>
                  </div>
                )}

                {orderReceipt.deliveryEstimate && (
                  <div className="clay-receipt-row">
                    <span>Estimated Delivery:</span>

                    <strong
                      style={{
                        color:
                          "var(--forest-primary)",
                      }}
                    >
                      {orderReceipt.deliveryEstimate}
                    </strong>
                  </div>
                )}

                <div className="clay-receipt-row">
                  <span>Status:</span>

                  <strong>
                    {orderReceipt.status ||
                      "Order Confirmed"}
                  </strong>
                </div>

                <div
                  className="clay-receipt-row"
                  style={{
                    borderTop:
                      "1px dashed #ccc",
                    paddingTop: "0.6rem",
                    marginTop: "0.4rem",
                  }}
                >
                  <span>
                    Total Paid (
                    {paymentMethod.toUpperCase()}
                    ):
                  </span>

                  <strong
                    style={{
                      fontSize: "1.15rem",
                      color: "var(--forest-dark)",
                    }}
                  >
                    ₹
                    {formatMoney(
                      orderReceipt?.totals?.grandTotal ??
                        totals.grandTotal
                    )}
                  </strong>
                </div>

              </div>

              <div
                style={{
                  display: "flex",
                  gap: "1rem",
                  justifyContent: "center",
                  flexWrap: "wrap",
                }}
              >

                <button
                  type="button"
                  className="clay-action-btn primary-cart-btn"
                  onClick={handleCloseAndReset}
                >
                  🌿 Continue Browsing Remedies
                </button>

                <button
                  type="button"
                  className="clay-action-btn"
                  onClick={() =>
                    window.print()
                  }
                >
                  📥 Print Ayurvedic Receipt
                </button>

              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}