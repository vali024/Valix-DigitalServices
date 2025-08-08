import "./Orders.css";
import "./export-button.css";
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {
  FaWhatsapp,
  FaCopy,
  FaMapMarkerAlt,
  FaSearch,
  FaChevronDown,
  FaSortAmountDown,
  FaSortAmountUp,
  FaFileDownload,
  FaTrashAlt,
  FaExclamationTriangle,
} from "react-icons/fa";

const Orders = () => {
  const url = import.meta.env.VITE_BACKEND_URL;
  const [orders, setOrders] = useState([]);
  const [copiedOrderId, setCopiedOrderId] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("all");
  const [sortOrder, setSortOrder] = useState("newest");
  const [isExporting, setIsExporting] = useState(false);
  const [deleteModal, setDeleteModal] = useState({
    show: false,
    orderId: null,
  });
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchAllOrders = async () => {
    const response = await axios.get(url + "/api/order/list");
    if (response.data.success) {
      setOrders(response.data.data);
    } else {
      toast.error("Error");
    }
  };

  const statusHandler = async (event, orderId) => {
    const response = await axios.post(url + "/api/order/status", {
      orderId,
      status: event.target.value,
    });
    if (response.data.success) {
      await fetchAllOrders();
    }
  };

  const deleteOrder = async (orderId) => {
    try {
      setIsDeleting(true);
      const response = await axios.delete(`${url}/api/order/${orderId}`);
      if (response.data.success) {
        await fetchAllOrders();
        toast.success("Order deleted successfully");
        setDeleteModal({ show: false, orderId: null });
      } else {
        toast.error("Failed to delete order");
      }
    } catch (error) {
      console.error("Error deleting order:", error);
      toast.error("Failed to delete order");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteClick = (orderId, status) => {
    if (status.toLowerCase() !== "delivered") {
      toast.error("Only delivered orders can be deleted");
      return;
    }
    setDeleteModal({ show: true, orderId });
  };

  const handleDeleteConfirm = () => {
    if (deleteModal.orderId) {
      deleteOrder(deleteModal.orderId);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModal({ show: false, orderId: null });
  };

  const formatItems = (items) => {
    return items
      .map((item, index) => {
        const itemText = `${item.name} (${item.size}) × ${item.quantity}`;
        return index === items.length - 1 ? itemText : itemText + ", ";
      })
      .join("");
  };

  const copyAddress = (address, orderId) => {
    const mapLink = address.location?.latitude
      ? `📍 Google Maps: https://www.google.com/maps?q=${address.location.latitude},${address.location.longitude}`
      : "";

    const fullAddress = `${address.firstName} ${address.lastName}
${address.street},
${address.city}, ${address.state}, ${address.country}, ${address.zipcode}
📞 ${address.phone}
${address.location?.address ? `📍 Location: ${address.location.address}` : ""}
${mapLink}`;

    navigator.clipboard.writeText(fullAddress);
    setCopiedOrderId(orderId);
    setTimeout(() => setCopiedOrderId(null), 2000);
    toast.success("Address copied to clipboard");
  };

  const openLocation = (location) => {
    if (location?.latitude && location?.longitude) {
      const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${location.latitude},${location.longitude}`;
      window.open(mapsUrl, "_blank");
    } else {
      toast.error("No location coordinates available");
    }
  };

  const openWhatsApp = (phone, address) => {
    const text = `Hello ${address.firstName} ${address.lastName}, Thank you for your order from Chanvi Farms!`;
    const whatsappUrl = `https://wa.me/${phone.replace(
      /[^0-9]/g,
      ""
    )}?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, "_blank");
  };

  const filteredOrders = () => {
    let filtered = [...orders];

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (order) =>
          order.address.firstName
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          order.address.lastName
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          order._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          order.items.some((item) =>
            item.name.toLowerCase().includes(searchQuery.toLowerCase())
          )
      );
    }

    // Apply date filter
    if (startDate && endDate) {
      filtered = filtered.filter((order) => {
        const orderDate = new Date(order.createdAt);
        return (
          orderDate >= new Date(startDate) && orderDate <= new Date(endDate)
        );
      });
    }

    // Apply status filter
    if (selectedStatus !== "all") {
      filtered = filtered.filter(
        (order) => order.status.toLowerCase() === selectedStatus
      );
    }

    // Apply payment method filter
    if (selectedPaymentMethod !== "all") {
      filtered = filtered.filter(
        (order) =>
          order.payment?.method?.toLowerCase() ===
          selectedPaymentMethod.toLowerCase()
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });

    return filtered;
  };

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "newest" ? "oldest" : "newest");
  };

  const statusOptions = [
    { value: "all", label: "All Orders" },
    { value: "pending", label: "Pending" },
    { value: "confirmed", label: "Confirmed" },
    { value: "packing", label: "Packing" },
    { value: "out-for-delivery", label: "Out for Delivery" },
    { value: "delivered", label: "Delivered" },
    { value: "cancelled", label: "Cancelled" },
  ];

  // Function to download orders as CSV
  const downloadOrdersCSV = () => {
    setIsExporting(true);
    try {
      const ordersToExport = filteredOrders();

      // Define CSV headers
      const headers = [
        "Order ID",
        "Customer Name",
        "Phone",
        "Email",
        "Items",
        "Item Prices",
        "SGST (2.5%)",
        "CGST (2.5%)",
        "Order Total",
        "Payment Method",
        "Order Date",
      ];

      // Create CSV content
      let csvContent = headers.join(",") + "\n";

      ordersToExport.forEach((order) => {
        // Calculate GST (2.5% SGST and 2.5% CGST) excluding delivery charges
        const orderAmountWithoutDelivery = order.amount - 18; // Subtract delivery charge
        const sgst = orderAmountWithoutDelivery * 0.025;
        const cgst = orderAmountWithoutDelivery * 0.025;

        // Format items and their prices
        const itemsList = order.items
          .map((item) => `${item.name} (${item.size}) x${item.quantity}`)
          .join("; ");
        const itemPrices = order.items
          .map((item) => `₹${item.price} x ${item.quantity}`)
          .join("; ");

        // Format customer name
        const customerName = `${order.address.firstName} ${order.address.lastName}`;

        // Format order date
        const orderDate = new Date(order.createdAt).toLocaleDateString();

        // Create row data
        const rowData = [
          `"${order._id}"`,
          `"${customerName}"`,
          `"${order.address.phone}"`,
          `"${order.address.email || ""}"`,
          `"${itemsList}"`,
          `"${itemPrices}"`,
          `"₹${sgst.toFixed(2)}"`,
          `"₹${cgst.toFixed(2)}"`,
          `"₹${order.amount.toFixed(2)}"`,
          `"${order.payment?.method || "N/A"}"`,
          `"${orderDate}"`,
        ];

        csvContent += rowData.join(",") + "\n";
      });

      // Create download link
      const encodedUri = encodeURI("data:text/csv;charset=utf-8," + csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute(
        "download",
        `chanvi-farms-orders-${new Date().toISOString().split("T")[0]}.csv`
      );
      document.body.appendChild(link);

      // Trigger download
      link.click();
      document.body.removeChild(link);

      toast.success("Orders exported successfully!");
    } catch (error) {
      console.error("Error exporting orders:", error);
      toast.error("Failed to export orders");
    } finally {
      setIsExporting(false);
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, []);

  return (
    <div className="orders-container">
      <div className="orders-header">
        <div className="header-main">
          <div className="header-left">
            <h2>Order List</h2>
            <div className="search-bar">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search orders by name, ID or items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="header-right">
            <button
              className="export-csv-btn"
              onClick={downloadOrdersCSV}
              disabled={isExporting}
            >
              <FaFileDownload />
              {isExporting ? "Exporting..." : "Download CSV"}
            </button>
            <div className="total-orders">
              <span className="order-count-label">Total Orders</span>
              <span className="order-count-number">
                {filteredOrders().length}
              </span>
              <span className="order-count-total">/ {orders.length}</span>
            </div>
          </div>
        </div>

        <div className="filters-section">
          <div className="filters-row">
            <div className="filters-left">
              <div className="status-filter-chips">
                {statusOptions.map((status) => (
                  <button
                    key={status.value}
                    className={`status-chip ${
                      selectedStatus === status.value ? "active" : ""
                    } ${status.value}`}
                    onClick={() => setSelectedStatus(status.value)}
                  >
                    {status.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="filters-right">
              <div className="date-filter">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  placeholder="Start Date"
                />
                <span>to</span>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  placeholder="End Date"
                />
              </div>
              <div className="payment-filter">
                <select
                  value={selectedPaymentMethod}
                  onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                  className="payment-select"
                >
                  <option value="all">All Payments</option>
                  <option value="cod">COD</option>
                  <option value="online">Online</option>
                </select>
              </div>
              <div className="sort-filter">
                <button
                  className="sort-button"
                  onClick={toggleSortOrder}
                  title={
                    sortOrder === "newest" ? "Newest first" : "Oldest first"
                  }
                >
                  {sortOrder === "newest" ? (
                    <>
                      <FaSortAmountDown /> Newest
                    </>
                  ) : (
                    <>
                      <FaSortAmountUp /> Oldest
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="orders-list-container">
        <div className="orders-list">
          {filteredOrders().map((order, index) => (
            <div key={index} className="order-card">
              <div className="order-status-section">
                <div className="order-id">Order #{order._id.slice(-6)}</div>
                <div className="status-select-wrapper">
                  <select
                    onChange={(event) => statusHandler(event, order._id)}
                    value={order.status}
                    className={`status-select status-${order.status.toLowerCase()}`}
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="packing">Packing</option>
                    <option value="out-for-delivery">Out for Delivery</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                  <FaChevronDown className="select-arrow" />
                </div>
              </div>

              <div className="order-content">
                <div className="order-images-section">
                  <div className="order-items-grid">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="item-card">
                        <div className="item-image-container">
                          <img
                            src={`${url}/images/${item.image}`}
                            alt={item.name}
                            className="product-image"
                          />
                          <div className="item-quantity">×{item.quantity}</div>
                        </div>
                        <div className="item-name">{item.name}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="order-details-section">
                  <div className="customer-info">
                    <h3 className="customer-name">
                      {order.address.firstName} {order.address.lastName}
                    </h3>
                    <div className="address-details">
                      <p>{order.address.street}</p>
                      <p>
                        {order.address.city}, {order.address.state}
                      </p>
                      <p>
                        {order.address.country} - {order.address.zipcode}
                      </p>
                    </div>

                    {order.address.location?.address && (
                      <div className="location-info">
                        <FaMapMarkerAlt />
                        <span>{order.address.location.address}</span>
                        <button
                          className="map-button"
                          onClick={() => openLocation(order.address.location)}
                        >
                          View on Maps
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="contact-info">
                    <div className="phone-number">
                      <i className="fas fa-phone"></i> {order.address.phone}
                    </div>
                    <div className="contact-buttons">
                      <button
                        className="contact-btn copy"
                        onClick={() => copyAddress(order.address, order._id)}
                      >
                        <FaCopy />{" "}
                        {copiedOrderId === order._id
                          ? "Copied!"
                          : "Copy Address"}
                      </button>
                      <a
                        href={`tel:${order.address.phone}`}
                        className="contact-btn call"
                      >
                        <i className="fas fa-phone"></i> Call
                      </a>
                      <button
                        className="contact-btn whatsapp"
                        onClick={() =>
                          openWhatsApp(order.address.phone, order.address)
                        }
                      >
                        <FaWhatsapp /> WhatsApp
                      </button>
                      <button
                        className={`contact-btn delete ${
                          order.status.toLowerCase() === "delivered"
                            ? ""
                            : "disabled-delete"
                        }`}
                        onClick={() =>
                          handleDeleteClick(order._id, order.status)
                        }
                        title={
                          order.status.toLowerCase() === "delivered"
                            ? "Delete this order"
                            : "Only delivered orders can be deleted"
                        }
                      >
                        <FaTrashAlt />{" "}
                        {order.status.toLowerCase() === "delivered"
                          ? "Delete"
                          : "Cannot Delete"}
                      </button>
                    </div>
                  </div>

                  <div className="order-summary">
                    <div className="items-summary">
                      {formatItems(order.items)}
                    </div>
                    {order.payment?.method && (
                      <div className="payment-details">
                        <div className="payment-method">
                          <span
                            className={`payment-badge ${order.payment.method.toLowerCase()}`}
                          >
                            {order.payment.method}
                          </span>
                          <span className="order-date">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="total-amount">
                          <span>Total:</span>
                          <span className="amount">
                            ₹{order.amount.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModal.show && (
        <div className="modal-overlay" onClick={handleDeleteCancel}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <FaExclamationTriangle className="warning-icon" />
              <h3>Delete Order</h3>
            </div>
            <div className="modal-body">
              <p>
                Are you sure you want to delete this order? This action cannot
                be undone.
              </p>
              <div className="modal-actions">
                <button
                  className="modal-btn cancel"
                  onClick={handleDeleteCancel}
                  disabled={isDeleting}
                >
                  Cancel
                </button>
                <button
                  className="modal-btn confirm"
                  onClick={handleDeleteConfirm}
                  disabled={isDeleting}
                >
                  {isDeleting ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
