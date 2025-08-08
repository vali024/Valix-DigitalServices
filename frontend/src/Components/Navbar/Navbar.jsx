import React, { useState, useContext, useEffect, useRef } from "react";
import "./Navbar.css";
import { Link, useLocation } from "react-router-dom";
import { StoreContext } from "../../Context/StoreContext";
import { NavContext } from "../../Context/NavContext";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import {
  Menu,
  X,
  Zap,
  MessageCircle,
  ShoppingCart,
  User,
  LogOut,
  Package,
} from "lucide-react";

const Navbar = ({ setShowLogin }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { activeNav, setActiveNav } = useContext(NavContext);
  const { getTotalCartAmount, token, setToken } = useContext(StoreContext);
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const prevScrollY = useRef(0);

  // Scroll to top when route changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  // Update active nav based on location
  useEffect(() => {
    const path = location.pathname.substring(1) || "home";
    setActiveNav(path);
  }, [location, setActiveNav]);

  // Handle scroll effect for navbar background
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const isScrolled = currentScrollY > 10;

      // Show/hide navbar based on scroll direction
      if (currentScrollY < 50) {
        setIsVisible(true); // Always show navbar at the top
      } else if (prevScrollY.current < currentScrollY) {
        setIsVisible(false); // Scrolling down - hide navbar
      } else {
        setIsVisible(true); // Scrolling up - show navbar
      }

      setScrolled(isScrolled);
      prevScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Navigation items
  const navItems = [
    { name: "Home", path: "/", key: "home" },
    { name: "Services", path: "/services", key: "services" },
    { name: "Portfolio", path: "/portfolio", key: "portfolio" },
    { name: "Products", path: "/shop", key: "shop" },
    { name: "Contact", path: "/contact", key: "contact" },
  ];

  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    navigate("/");
    setIsProfileOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsOpen(!isOpen);
  };

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isProfileOpen && !event.target.closest(".navbar-profile")) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isProfileOpen]);

  return (
    <nav
      className={`navbar ${scrolled ? "scrolled" : ""} ${
        isVisible ? "visible" : "hidden"
      }`}
    >
      <div className="navbar-container">
        <div className="navbar-content">
          {/* Logo */}
          <Link to="/" className="navbar-logo">
            <div className="logo-icon">
              <Zap className="logo-zap" />
            </div>
            <div className="logo-text">
              <span className="logo-main">VALIX</span>
              <span className="logo-sub">DIGITAL SERVICES</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="navbar-menu-desktop">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setActiveNav(item.key)}
                className={`nav-link ${activeNav === item.key ? "active" : ""}`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Desktop Right Side */}
          <div className="navbar-right-desktop">
            {/* Cart */}
            <Link to="/cart" className="cart-link">
              <ShoppingCart className="cart-icon" />
              {getTotalCartAmount() > 0 && <div className="cart-dot"></div>}
            </Link>

            {/* WhatsApp */}
            <a
              href="https://wa.me/+918919825034"
              target="_blank"
              rel="noopener noreferrer"
              className="whatsapp-btn"
            >
              <MessageCircle className="whatsapp-icon" />
              <span>WhatsApp</span>
            </a>

            {/* Auth Section */}
            {!token ? (
              <button
                onClick={() => setShowLogin(true)}
                className="get-quote-btn"
              >
                Login
              </button>
            ) : (
              <div className="navbar-profile" onClick={toggleProfile}>
                <User className="profile-icon" />
                <div
                  className={`profile-dropdown ${isProfileOpen ? "show" : ""}`}
                >
                  <div
                    className="dropdown-item"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate("/myorders");
                      setIsProfileOpen(false);
                    }}
                  >
                    <Package className="dropdown-icon" />
                    <span>My Orders</span>
                  </div>
                  <div
                    className="dropdown-item"
                    onClick={(e) => {
                      e.stopPropagation();
                      logout();
                    }}
                  >
                    <LogOut className="dropdown-icon" />
                    <span>Logout</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button onClick={toggleMobileMenu} className="mobile-menu-btn">
            {isOpen ? (
              <X className="menu-icon" />
            ) : (
              <Menu className="menu-icon" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="mobile-menu">
          <div className="mobile-menu-content">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => {
                  setActiveNav(item.key);
                  setIsOpen(false);
                }}
                className={`mobile-nav-link ${
                  activeNav === item.key ? "active" : ""
                }`}
              >
                {item.name}
              </Link>
            ))}

            <div className="mobile-menu-actions">
              <Link
                to="/cart"
                className="mobile-cart-link"
                onClick={() => setIsOpen(false)}
              >
                <ShoppingCart className="mobile-cart-icon" />
                <span>Cart</span>
                {getTotalCartAmount() > 0 && (
                  <div className="mobile-cart-dot"></div>
                )}
              </Link>

              <a
                href="https://wa.me/1234567890"
                target="_blank"
                rel="noopener noreferrer"
                className="mobile-whatsapp-btn"
              >
                <MessageCircle className="mobile-whatsapp-icon" />
                <span>WhatsApp</span>
              </a>

              {!token ? (
                <button
                  onClick={() => {
                    setShowLogin(true);
                    setIsOpen(false);
                  }}
                  className="mobile-get-quote-btn"
                >
                  Login
                </button>
              ) : (
                <div className="mobile-auth-section">
                  <button
                    onClick={() => {
                      navigate("/myorders");
                      setIsOpen(false);
                    }}
                    className="mobile-auth-btn"
                  >
                    <Package className="mobile-auth-icon" />
                    <span>My Orders</span>
                  </button>
                  <button
                    onClick={() => {
                      logout();
                      setIsOpen(false);
                    }}
                    className="mobile-auth-btn"
                  >
                    <LogOut className="mobile-auth-icon" />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

Navbar.propTypes = {
  setShowLogin: PropTypes.func.isRequired,
};

export default Navbar;
