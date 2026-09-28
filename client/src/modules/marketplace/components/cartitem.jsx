import React, { useState } from "react";

export default function CartItem({
  item,
  onUpdateQuantity,
  onRemove,
}) {
  const [imgError, setImgError] = useState(false);

  if (!item) {
    return null;
  }

  // Support both frontend id and MongoDB _id
  const productId = item.id || item._id;

  const {
    name = "Ayurvedic Product",
    price = 0,
    quantity = 1,
    icon = "🌿",
    image = "",
    doshaLabel = "",
    categoryLabel = "",
  } = item;

  const numericPrice = Number(price) || 0;
  const numericQuantity = Number(quantity) || 1;

  const itemTotal = (
    numericPrice * numericQuantity
  ).toLocaleString("en-IN");

  const handleDecrease = () => {
    if (onUpdateQuantity && productId) {
      onUpdateQuantity(productId, numericQuantity - 1);
    }
  };

  const handleIncrease = () => {
    if (onUpdateQuantity && productId) {
      onUpdateQuantity(productId, numericQuantity + 1);
    }
  };

  const handleRemove = () => {
    if (onRemove && productId) {
      onRemove(productId);
    }
  };

  return (
    <div className="clay-cart-item-card">
      {/* Product Image */}
      <div className="clay-cart-item-img">
        {image && !imgError ? (
          <img
            src={image}
            alt={name}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              borderRadius: "inherit",
            }}
            onError={() => setImgError(true)}
          />
        ) : (
          <span>{icon}</span>
        )}
      </div>

      {/* Product Details */}
      <div className="clay-cart-item-info">
        <h4>{name}</h4>

        <p>
          {categoryLabel || "Ayurvedic"}{" "}
          •{" "}
          {doshaLabel || "Ayurvedic"}
        </p>

        <span className="item-unit-price">
          ₹{numericPrice.toLocaleString("en-IN")} each
        </span>
      </div>

      {/* Quantity Stepper */}
      <div className="clay-qty-stepper">
        <button
          type="button"
          className="clay-stepper-btn"
          onClick={handleDecrease}
          aria-label={`Decrease quantity of ${name}`}
        >
          −
        </button>

        <span className="clay-stepper-value">
          {numericQuantity}
        </span>

        <button
          type="button"
          className="clay-stepper-btn"
          onClick={handleIncrease}
          aria-label={`Increase quantity of ${name}`}
        >
          +
        </button>
      </div>

      {/* Subtotal & Remove */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "1rem",
        }}
      >
        <span className="clay-cart-item-total">
          ₹{itemTotal}
        </span>

        <button
          type="button"
          className="clay-item-remove-btn"
          onClick={handleRemove}
          title={`Remove ${name} from Cart`}
          aria-label={`Remove ${name} from Cart`}
        >
          🗑️
        </button>
      </div>
    </div>
  );
}