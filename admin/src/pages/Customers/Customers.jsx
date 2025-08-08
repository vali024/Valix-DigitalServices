import "./Customers.css";
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import {
  FaSearch,
  FaSortAmountDown,
  FaSortAmountUp,
  FaWhatsapp,
  FaEnvelope,
} from "react-icons/fa";
const Customers = () => {
  const navigate = useNavigate();
  const url = import.meta.env.VITE_BACKEND_URL;
  const [customers, setCustomers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("");
  const [uniqueLocations, setUniqueLocations] = useState([]);
  const fetchCustomers = useCallback(async () => {
    try {
      const adminAuth = JSON.parse(localStorage.getItem("adminAuth"));
      if (!adminAuth || !adminAuth.email) {
        throw new Error("Admin authentication required");
      }

      const response = await axios.get(url + "/api/order/customers", {
        headers: {
          "admin-email": adminAuth.email,
        },
      });

      if (response.data.success) {
        const customersData = response.data.data;
        setCustomers(customersData);

        // Extract unique locations (zipcodes)
        const locations = customersData
          .map((customer) => customer.address.zipcode)
          .filter(
            (value, index, self) => self.indexOf(value) === index && value
          );

        setUniqueLocations(locations);
      } else {
        throw new Error(response.data.message || "Error fetching customers");
      }
    } catch (error) {
      console.error("Error fetching customers:", error);
      if (error.message === "Admin authentication required") {
        toast.error("Please login as admin");
        navigate("/login");
      } else {
        toast.error(error.message || "Failed to load customers");
      }
    }
  }, [navigate]);

  const openWhatsApp = (phone, name) => {
    const text = `Hello ${name}, Thank you for choosing Chanvi Farms!`;
    const whatsappUrl = `https://wa.me/${phone.replace(
      /[^0-9]/g,
      ""
    )}?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, "_blank");
  };

  const filteredCustomers = () => {
    let filtered = [...customers];

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (customer) =>
          customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          customer.phone.includes(searchQuery) ||
          customer.address.zipcode.includes(searchQuery)
      );
    }

    // Apply order count filter
    if (selectedFilter !== "all") {
      switch (selectedFilter) {
        case "single":
          filtered = filtered.filter((customer) => customer.orderCount === 1);
          break;
        case "repeat":
          filtered = filtered.filter((customer) => customer.orderCount > 1);
          break;
        case "frequent":
          filtered = filtered.filter((customer) => customer.orderCount >= 5);
          break;
        default:
          break;
      }
    }

    // Apply location filter
    if (locationFilter) {
      filtered = filtered.filter(
        (customer) => customer.address.zipcode === locationFilter
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      if (sortOrder === "newest") {
        return new Date(b.lastOrderDate) - new Date(a.lastOrderDate);
      } else if (sortOrder === "oldest") {
        return new Date(a.lastOrderDate) - new Date(b.lastOrderDate);
      } else if (sortOrder === "most-orders") {
        return b.orderCount - a.orderCount;
      }
      return 0;
    });

    return filtered;
  };

  const toggleSortOrder = () => {
    if (sortOrder === "newest") {
      setSortOrder("oldest");
    } else if (sortOrder === "oldest") {
      setSortOrder("most-orders");
    } else {
      setSortOrder("newest");
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  return (
    <div className="customers-container">
      <div className="customers-header">
        <div className="header-main">
          <div className="header-left">
            <h2>Customer List</h2>
            <div className="search-bar">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search by name, email, phone or pincode..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="header-right">
            <div className="total-customers">
              <span className="customer-count-label">Total Customers</span>
              <span className="customer-count-number">
                {filteredCustomers().length}
              </span>
              <span className="customer-count-total">/ {customers.length}</span>
            </div>
          </div>
        </div>

        <div className="filters-section">
          <div className="filters-row">
            <div className="filters-left">
              <div className="customer-filter-chips">
                <button
                  className={`filter-chip ${
                    selectedFilter === "all" ? "active" : ""
                  }`}
                  onClick={() => setSelectedFilter("all")}
                >
                  All Customers
                </button>
                <button
                  className={`filter-chip ${
                    selectedFilter === "single" ? "active" : ""
                  }`}
                  onClick={() => setSelectedFilter("single")}
                >
                  Single Order
                </button>
                <button
                  className={`filter-chip ${
                    selectedFilter === "repeat" ? "active" : ""
                  }`}
                  onClick={() => setSelectedFilter("repeat")}
                >
                  Repeat Customers
                </button>
                <button
                  className={`filter-chip ${
                    selectedFilter === "frequent" ? "active" : ""
                  }`}
                  onClick={() => setSelectedFilter("frequent")}
                >
                  Frequent Customers (5+ orders)
                </button>
              </div>
            </div>
            <div className="filters-right">
              <div className="location-filter">
                <select
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                  className="location-select"
                >
                  <option value="">All Locations</option>
                  {uniqueLocations.map((location) => (
                    <option key={location} value={location}>
                      {location}
                    </option>
                  ))}
                </select>
              </div>
              <div className="sort-filter">
                <button
                  className="sort-button"
                  onClick={toggleSortOrder}
                  title={
                    sortOrder === "newest"
                      ? "Newest first"
                      : sortOrder === "oldest"
                      ? "Oldest first"
                      : "Most orders first"
                  }
                >
                  {sortOrder === "newest" ? (
                    <>
                      <FaSortAmountDown /> Newest
                    </>
                  ) : sortOrder === "oldest" ? (
                    <>
                      <FaSortAmountUp /> Oldest
                    </>
                  ) : (
                    <>
                      <FaSortAmountDown /> Most Orders
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="customers-list-container">
        <div className="customers-list">
          <div className="customers-table">
            <div className="table-header">
              <div className="header-cell">Name</div>
              <div className="header-cell">Contact Information</div>
              <div className="header-cell">Location</div>
              <div className="header-cell">Orders</div>
              <div className="header-cell">Actions</div>
            </div>

            {filteredCustomers().length === 0 ? (
              <div className="no-customers">No customers found</div>
            ) : (
              filteredCustomers().map((customer, index) => (
                <div key={index} className="customer-row">
                  <div className="customer-cell customer-name">
                    <div className="name-initial">
                      {customer.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="name-details">
                      <div className="full-name">{customer.name}</div>
                      <div className="customer-since">
                        Customer since{" "}
                        {new Date(customer.firstOrderDate).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  <div className="customer-cell contact-info">
                    <div className="email">{customer.email}</div>
                    <div className="phone">{customer.phone}</div>
                  </div>

                  <div className="customer-cell location-info">
                    <div className="city">{customer.address.city}</div>
                    <div className="zipcode">{customer.address.zipcode}</div>
                  </div>

                  <div className="customer-cell order-info">
                    <div className="order-count">
                      <span className="count-number">
                        {customer.orderCount}
                      </span>
                      <span className="count-label">orders</span>
                    </div>
                    <div className="last-order">
                      Last order:{" "}
                      {new Date(customer.lastOrderDate).toLocaleDateString()}
                    </div>
                  </div>

                  <div className="customer-cell action-buttons">
                    <button
                      className="action-btn whatsapp"
                      onClick={() =>
                        openWhatsApp(customer.phone, customer.name)
                      }
                    >
                      <FaWhatsapp />
                    </button>
                    <a
                      href={`mailto:${customer.email}`}
                      className="action-btn email"
                    >
                      <FaEnvelope />
                    </a>
                    <a
                      href={`tel:${customer.phone}`}
                      className="action-btn call"
                    >
                      <i className="fas fa-phone"></i>
                    </a>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Customers;
