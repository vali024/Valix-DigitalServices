import { useContext, useState, memo } from "react";
import PropTypes from "prop-types";
import "./FoodItem.css";
import { StoreContext } from "../../Context/StoreContext";

const FoodItemComponent = ({
  id,
  name,
  prices,
  marketPrices,
  description,
  image,
  quantityOptions,
  status,
  rating,
  reviewCount,
  isExpanded,
  onExpand,
}) => {
  const { cartItems, addToCart, removeFromCart, url } =
    useContext(StoreContext);
  
  // Find the default quantity option (first available)
  const defaultQuantity = Object.entries(quantityOptions || {})
    .find(([, isEnabled]) => isEnabled)?.[0] || "g250";
  
  const cartKey = `${id}_${defaultQuantity}`;
  const cartItem = cartItems[cartKey];

  const currentPrice = prices?.[defaultQuantity] || 0;
  const currentMarketPrice = marketPrices?.[defaultQuantity] || currentPrice;

  const handleAddToCart = () => {
    if (status !== "in-stock") return;
    addToCart(id, defaultQuantity);
  };

  const handleQuantityChange = (action) => {
    if (action === "increase") {
      addToCart(id, defaultQuantity);
    } else {
      removeFromCart(id, defaultQuantity);
    }
  };

  const getStatusDisplay = () => {
    switch (status) {
      case "out-of-stock":
        return "Out of Stock";
      case "coming-soon":
        return "Coming Soon...";
      default:
        return null;
    }
  };

  return (
    <div
      className={`food-item ${status !== "in-stock" ? "disabled" : ""} ${
        isExpanded ? "expanded" : ""
      }`}
    >
      <div className="food-item-img-container">
        <img
          className={`food-item-image ${
            status !== "in-stock" ? "grayscale" : ""
          }`}
          src={`${url}/images/${image}`}
          alt={name}
          loading="lazy"
        />
        {status !== "in-stock" && (
          <div className="status-badge">{getStatusDisplay()}</div>
        )}
      </div>

      <div className="product-details">
        <div className="product-header">
          <h3>{name}</h3>
          {description && (
            <button
              className="expand-button"
              onClick={(e) => {
                e.stopPropagation();
                onExpand();
              }}
              aria-label={isExpanded ? "Collapse details" : "Expand details"}
            >
              <i className={`fas fa-chevron-${isExpanded ? "up" : "down"}`}></i>
            </button>
          )}
        </div>

        {isExpanded && description && (
          <p className="product-description">{description}</p>
        )}

        <div className="price-section">
          <div className="price-header">
            <span className="label">Price</span>
            <span className="label rating-label">Rating</span>
          </div>
          <div className="price-content">
            <div className="price-info">
              {currentMarketPrice > currentPrice && (
                <span className="market-price">₹{currentMarketPrice}</span>
              )}
              <p className="our-price">₹{currentPrice}</p>
              {currentMarketPrice > currentPrice && (
                <span className="discount">
                  {Math.round(
                    ((currentMarketPrice - currentPrice) / currentMarketPrice) *
                      100
                  )}
                  % OFF
                </span>
              )}
            </div>

            <div className="product-rating">
              <div className="stars">
                {[...Array(5)].map((_, i) => (
                  <i 
                    key={i} 
                    className={`fas fa-star ${i < Math.floor(rating || 0) ? "filled" : ""}`}
                  ></i>
                ))}
              </div>
              <span className="rating-count">({rating ? rating.toFixed(1) : '0.0'}) • {reviewCount || 0} reviews</span>
            </div>
          </div>
        </div>

        <div className="cart-actions">
          {!cartItem ? (
            <button
              className="add-to-cart-btn"
              onClick={handleAddToCart}
              disabled={status !== "in-stock"}
            >
              <i className="fas fa-shopping-cart"></i>
              {status === "in-stock" ? "Add to Cart" : getStatusDisplay()}
            </button>
          ) : (
            <div className="quantity-controls">
              <button
                className="quantity-btn decrease"
                onClick={() => handleQuantityChange("decrease")}
              >
                <i className="fas fa-minus"></i>
              </button>
              <span className="quantity-display">{cartItem.quantity}</span>
              <button
                className="quantity-btn increase"
                onClick={() => handleQuantityChange("increase")}
              >
                <i className="fas fa-plus"></i>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

FoodItemComponent.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  prices: PropTypes.object.isRequired,
  marketPrices: PropTypes.object,
  description: PropTypes.string,
  image: PropTypes.string.isRequired,
  quantityOptions: PropTypes.object,
  status: PropTypes.string,
  rating: PropTypes.number,
  reviewCount: PropTypes.number,
  isExpanded: PropTypes.bool,
  onExpand: PropTypes.func,
};

FoodItemComponent.defaultProps = {
  status: "in-stock",
  quantityOptions: { g250: true },
  prices: { g250: 0 },
  marketPrices: { g250: 0 },
  rating: 0,
  reviewCount: 0,
  isExpanded: false,
  onExpand: () => {},
};

const FoodItem = memo(FoodItemComponent);
export default FoodItem;
