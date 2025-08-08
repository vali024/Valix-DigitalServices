import { useState } from "react";
import "./Add.css";
import axios from "axios";
import { toast } from "react-toastify";

const Add = () => {
  const [data, setData] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    marketPrice: "",
    status: "in-stock",
    rating: 0,
    reviewCount: 0,
  });

  // Categories for products
  const categories = [
    "Fashion Accessories",
    "Office Accessories",
    "Kitchen Accessories",
    "Kids Toys",
  ];
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imageError, setImageError] = useState("");
  const [dragOver, setDragOver] = useState(false);

  const inputHandler = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setData((prev) => ({ ...prev, [name]: checked }));
    } else if (type === "number") {
      setData((prev) => ({ ...prev, [name]: value ? Number(value) : "" }));
    } else {
      setData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const validateImage = (file) => {
    setImageError("");

    if (!file) {
      setImageError("Please select an image");
      return false;
    }

    if (!file.type.startsWith("image/")) {
      setImageError("Please upload a valid image file");
      return false;
    }

    if (file.size > 5 * 1024 * 1024) {
      setImageError("Image size should be less than 5MB");
      return false;
    }

    return true;
  };

  const handleImageDrop = (e) => {
    e.preventDefault();
    setDragOver(false);

    const file = e.dataTransfer.files[0];
    if (validateImage(file)) {
      setImage(file);
      setImageError(""); // Clear any previous errors
    }
  };

  const imageHandler = (e) => {
    const file = e.target.files[0];
    if (validateImage(file)) {
      setImage(file);
      setImageError(""); // Clear any previous errors
    }
  };

  const handleRatingClick = (rating) => {
    setData((prev) => ({ ...prev, rating }));
  };

  const validateForm = () => {
    // Reset any previous errors
    setImageError("");

    if (!image) {
      setImageError("Please upload a product image");
      return false;
    }

    if (!data.name.trim()) {
      toast.error("Please enter a product name");
      return false;
    }

    if (!data.description.trim()) {
      toast.error("Please enter a product description");
      return false;
    }

    if (!data.category) {
      toast.error("Please select a category");
      return false;
    }

    // Validate price
    if (!data.price || data.price <= 0) {
      toast.error("Please enter a valid price");
      return false;
    }

    return true;
  };

  const addProduct = async () => {
    if (!validateForm()) return;

    setLoading(true);
    const formData = new FormData();
    formData.append("image", image);
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("category", data.category);

    // Format price data to match backend expectations
    const prices = {
      g250: data.price, // Set the price for 250g as the main price
    };
    const marketPrices = {
      g250: data.marketPrice || data.price,
    };
    const quantityOptions = {
      g250: true, // Enable 250g option by default
    };

    formData.append("prices", JSON.stringify(prices));
    formData.append("marketPrices", JSON.stringify(marketPrices));
    formData.append("quantityOptions", JSON.stringify(quantityOptions));
    formData.append("status", data.status);
    formData.append("rating", data.rating);
    formData.append("reviewCount", data.reviewCount);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/food/add`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        toast.success("Product Added Successfully");
        // Reset form
        setData({
          name: "",
          description: "",
          category: "",
          price: "",
          marketPrice: "",
          status: "in-stock",
          rating: 0,
          reviewCount: 0,
        });
        setImage(null);
      } else {
        toast.error(response.data.message || "Failed to add product");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error adding product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-product">
      <div className="form-header">
        <h1>Add New Product</h1>
        <p>Fill in the details below to add a new product to your inventory</p>
      </div>

      <div className="form-container">
        {/* Image Upload */}
        <div className="addproduct-itemfield">
          <p>
            Product Image <span className="required">*</span>
          </p>
          <label
            htmlFor="file-input"
            className={`image-upload ${dragOver ? "drag-over" : ""} ${
              imageError ? "error" : ""
            }`}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={(e) => {
              e.preventDefault();
              setDragOver(false);
            }}
            onDrop={handleImageDrop}
          >
            <img
              src={image ? URL.createObjectURL(image) : ""}
              className="addproduct-thumbnail-img"
              alt={image ? "Product preview" : "Upload area"}
            />
            {!image && (
              <div className="upload-overlay">
                <i className="fas fa-cloud-upload-alt"></i>
                <p>Drag and drop an image here or click to browse</p>
                <small>Maximum file size: 5MB</small>
              </div>
            )}
            {imageError && <div className="error-message">{imageError}</div>}
          </label>
          <input
            onChange={imageHandler}
            type="file"
            name="image"
            id="file-input"
            accept="image/*"
            hidden
          />
        </div>

        {/* Basic Information */}
        <div className="addproduct-itemfield">
          <p>
            Product Name <span className="required">*</span>
          </p>
          <input
            value={data.name}
            onChange={inputHandler}
            type="text"
            name="name"
            placeholder="Enter product name"
            className="enhanced-input"
          />
        </div>

        <div className="addproduct-itemfield">
          <p>
            Description <span className="required">*</span>
          </p>
          <textarea
            value={data.description}
            onChange={inputHandler}
            name="description"
            placeholder="Enter detailed product description"
            rows="4"
            className="enhanced-textarea"
          />
        </div>

        <div className="addproduct-itemfield">
          <p>
            Product Category <span className="required">*</span>
          </p>
          <select
            value={data.category}
            onChange={inputHandler}
            name="category"
            className="enhanced-select"
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Rating and Review Section */}
        <div className="rating-section">
          <div className="addproduct-itemfield">
            <p>Product Rating</p>
            <div className="star-rating">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={`star ${star <= data.rating ? "active" : ""}`}
                  onClick={() => handleRatingClick(star)}
                >
                  ★
                </span>
              ))}
              <span className="rating-text">
                {data.rating > 0 ? `${data.rating}.0 out of 5` : "No rating"}
              </span>
            </div>
          </div>

          <div className="addproduct-itemfield">
            <p>Number of Reviews</p>
            <input
              type="number"
              name="reviewCount"
              value={data.reviewCount}
              onChange={inputHandler}
              placeholder="Enter number of reviews"
              min="0"
              className="enhanced-input"
            />
          </div>
        </div>

        {/* Pricing Section */}
        <div className="pricing-section">
          <div className="price-inputs-container">
            <div className="price-input-field">
              <p>
                Price (₹) <span className="required">*</span>
              </p>
              <input
                type="number"
                name="price"
                value={data.price}
                onChange={inputHandler}
                placeholder="Enter selling price"
                min="0"
                step="0.01"
                className="enhanced-input"
              />
            </div>
            <div className="price-input-field">
              <p>Market Price (₹)</p>
              <input
                type="number"
                name="marketPrice"
                value={data.marketPrice}
                onChange={inputHandler}
                placeholder="Enter market price (optional)"
                min="0"
                step="0.01"
                className="enhanced-input"
              />
            </div>
          </div>
        </div>

        {/* Product Status */}
        <div className="addproduct-itemfield">
          <p>Status</p>
          <select
            value={data.status}
            onChange={inputHandler}
            name="status"
            className="enhanced-select"
          >
            <option value="in-stock">In Stock</option>
            <option value="out-of-stock">Out of Stock</option>
            <option value="coming-soon">Coming Soon</option>
          </select>
        </div>

        {/* Submit Button */}
        <div className="form-actions">
          <button
            className="addproduct-btn"
            onClick={addProduct}
            disabled={loading}
          >
            {loading ? (
              <>
                <i className="fas fa-spinner fa-spin"></i>
                <span>ADDING PRODUCT...</span>
              </>
            ) : (
              <>
                <i className="fas fa-plus"></i>
                <span>ADD PRODUCT</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Add;
