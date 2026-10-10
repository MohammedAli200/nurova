import React from "react";

export default function OrdersPage({
  ordersHook,
  onNavigateToShop,
}) {
  const {
    orders = [],
    isLoading,
    error,
    refreshOrders,
    cancelOrder,
  } = ordersHook;

  const handleCancel = async (orderId) => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this order?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await cancelOrder(orderId);
      alert("Order cancelled successfully.");
    } catch (err) {
      console.error("Cancel order error:", err);
      alert(err.message || "Failed to cancel order.");
    }
  };

  // Loading
  if (isLoading) {
    return (
      <main className="clay-cart-page">
        <div className="clay-empty-box">
          <div className="clay-empty-icon">📦</div>

          <h3>Loading Your Orders...</h3>

          <p>
            Fetching your Ayurvedic orders from MongoDB.
          </p>
        </div>
      </main>
    );
  }

  // Error
  if (error) {
    return (
      <main className="clay-cart-page">
        <div className="clay-empty-box">
          <div className="clay-empty-icon">⚠️</div>

          <h3>Unable to Load Orders</h3>

          <p>{error}</p>

          <button
            type="button"
            className="clay-action-btn primary-cart-btn"
            onClick={refreshOrders}
          >
            🔄 Try Again
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="clay-cart-page">
      {/* Page Header */}
      <div className="clay-cart-header">
        <h2>
          <span>📦</span> My Ayurvedic Orders
        </h2>

        <button
          type="button"
          className="clay-action-btn"
          onClick={refreshOrders}
        >
          🔄 Refresh
        </button>
      </div>

      {/* No orders */}
      {orders.length === 0 ? (
        <div className="clay-empty-box">
          <div className="clay-empty-icon">📦</div>

          <h3>No Orders Yet</h3>

          <p>
            Your completed Ayurvedic purchases will
            appear here.
          </p>

          <button
            type="button"
            className="clay-action-btn primary-cart-btn"
            onClick={onNavigateToShop}
          >
            🌿 Browse Ayurvedic Remedies
          </button>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gap: "1.25rem",
          }}
        >
          {orders.map((order) => {
            const product = order.productId;

            return (
              <div
                key={order._id}
                className="clay-cart-item-card"
                style={{
                  display: "block",
                  padding: "1.5rem",
                }}
              >
                {/* Order information */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: "1rem",
                    flexWrap: "wrap",
                  }}
                >
                  <div>
                    <h3
                      style={{
                        margin: 0,
                        color: "var(--forest-dark)",
                      }}
                    >
                      📦 Order #{order._id}
                    </h3>

                    <p
                      style={{
                        margin: "0.4rem 0 0",
                      }}
                    >
                      {order.orderDate
                        ? new Date(
                            order.orderDate
                          ).toLocaleString("en-IN")
                        : "Date unavailable"}
                    </p>
                  </div>

                  <span
                    className="clay-badge-counter"
                    style={{
                      padding: "0.5rem 0.8rem",
                    }}
                  >
                    {order.status}
                  </span>
                </div>

                {/* Product information */}
                <div
                  style={{
                    marginTop: "1.25rem",
                    paddingTop: "1.25rem",
                    borderTop:
                      "1px solid rgba(0, 0, 0, 0.08)",
                  }}
                >
                  <h4
                    style={{
                      margin: "0 0 0.4rem",
                    }}
                  >
                    {product?.name || "Ayurvedic Product"}
                  </h4>

                  <p
                    style={{
                      margin: "0 0 0.5rem",
                    }}
                  >
                    {product?.category || "Ayurveda"}
                  </p>

                  <p style={{ margin: 0 }}>
                    Quantity:{" "}
                    <strong>{order.quantity}</strong>
                  </p>

                  <p
                    style={{
                      margin: "0.4rem 0 0",
                    }}
                  >
                    Unit Price: ₹
                    {product?.price
                      ? product.price.toLocaleString(
                          "en-IN"
                        )
                      : "0"}
                  </p>
                </div>

                {/* Order total and actions */}
                <div
                  style={{
                    marginTop: "1.25rem",
                    paddingTop: "1.25rem",
                    borderTop:
                      "1px solid rgba(0, 0, 0, 0.08)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: "1rem",
                    flexWrap: "wrap",
                  }}
                >
                  <strong
                    style={{
                      fontSize: "1.15rem",
                    }}
                  >
                    Total: ₹
                    {Number(
                      order.totalAmount || 0
                    ).toLocaleString("en-IN")}
                  </strong>

                  {order.status !== "cancelled" &&
                    order.status !== "delivered" && (
                      <button
                        type="button"
                        className="clay-action-btn"
                        onClick={() =>
                          handleCancel(order._id)
                        }
                      >
                        Cancel Order
                      </button>
                    )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}