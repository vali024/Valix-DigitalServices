import { useContext, useState, memo, useMemo, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import "./Shop.css";
import { StoreContext } from "../../Context/StoreContext";
import FoodItem from "../../Components/FoodItem/FoodItem";
import { NavContext } from "../../Context/NavContext";
import { Zap, ShoppingBag } from "lucide-react";
const ShopComponent = () => {
  const { food_list, loading } = useContext(StoreContext);
  const { setActiveNav } = useContext(NavContext);
  const [searchParams] = useSearchParams();
  const [expandedItem, setExpandedItem] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [currentPage, setCurrentPage] = useState(1);
  const [isVisible, setIsVisible] = useState(false);
  const heroRef = useRef(null);
  const itemsPerPage = 21;

  // Intersection Observer for animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.2 }
    );

    if (heroRef.current) {
      observer.observe(heroRef.current);
    }

    return () => {
      if (heroRef.current) {
        observer.unobserve(heroRef.current);
      }
    };
  }, []);

  // Set active nav to 'shop' when component mounts
  useEffect(() => {
    setActiveNav("shop");
  }, [setActiveNav]);

  // Handle category from URL parameters
  useEffect(() => {
    const categoryFromUrl = searchParams.get("category");
    if (categoryFromUrl) {
      // Convert URL category to match exact category names
      const formattedCategory =
        categoryFromUrl === "all"
          ? "all"
          : categoryFromUrl
              .split("-")
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(" ");
      setSelectedCategory(formattedCategory);
    }
  }, [searchParams]);

  const categories = [
    "all",
    ...new Set(food_list.map((item) => item.category)),
  ];

  const getLowestAvailablePrice = (item) => {
    if (!item.quantityOptions) return item.prices?.g250 || 0;

    // Find the first available quantity and its price
    const availableQuantity = Object.entries(item.quantityOptions).find(
      ([, isEnabled]) => isEnabled
    );

    if (!availableQuantity) return item.prices?.g250 || 0;
    return item.prices?.[availableQuantity[0]] || 0;
  };

  const filteredAndSortedItems = useMemo(() => {
    let items =
      selectedCategory === "all"
        ? food_list
        : food_list.filter(
            (item) =>
              item.category.toLowerCase() === selectedCategory.toLowerCase()
          );

    // Apply search filter
    if (searchQuery) {
      items = items.filter(
        (item) =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply sorting
    return items.sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return getLowestAvailablePrice(a) - getLowestAvailablePrice(b);
        case "price-high":
          return getLowestAvailablePrice(b) - getLowestAvailablePrice(a);
        case "name":
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });
  }, [food_list, selectedCategory, searchQuery, sortBy]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredAndSortedItems.length / itemsPerPage);
  const paginatedItems = filteredAndSortedItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Function to scroll to top
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Reset to first page when filters change (do NOT scroll to top)
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchQuery, sortBy]);

  // Handle page change with smooth scroll
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    setTimeout(scrollToTop, 100);
  };

  // Don't render anything while initial data is loading
  if (loading) return null;

  return (
    <div className="shop">
      {/* Banner Section */}
      <section className="shop-hero-section" ref={heroRef}>
        <div className="shop-background"></div>
        <div className="container">
          <div className={`shop-hero-content ${isVisible ? "animate-in" : ""}`}>
            <div className="shop-hero-badge">
              <ShoppingBag className="badge-icon" />
              <span>Accessories & Toys</span>
            </div>
            <h1 className="shop-hero-title">
              <span className="gradient-text">Accessories & Toys</span>
              <br />
              and More
            </h1>
            <p className="shop-hero-description">
              Explore our exclusive range of Accessories & Toys, including
              Fashion Accessories, Office Accessories, Kitchen Accessories, and
              Kids Toys.
            </p>
            <div className="shop-hero-stats">
              {[
                "Fashion Accessories",
                "Office Accessories",
                "Kitchen Accessories",
                "Kids Toys",
              ].map((category, idx) => (
                <div key={idx} className="stat">
                  <span className="stat-label">{category}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="shop-container">
        {/* Left Sidebar */}
        <div className="categories-sidebar">
          <h2>Select from Categories below</h2>
          <div className="categories-list">
            {categories.map((category, index) => (
              <div
                key={index}
                className={`category-item ${
                  selectedCategory === category ? "active" : ""
                }`}
                onClick={() => setSelectedCategory(category)}
              >
                <span>{category}</span>
                <span className="category-count">
                  {
                    food_list.filter((item) =>
                      category === "all" ? true : item.category === category
                    ).length
                  }
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="shop-content">
          <div className="shop-controls">
            <p className="products-count">
              Showing {paginatedItems.length} of {filteredAndSortedItems.length}{" "}
              products
            </p>
            <div className="controls-right">
              <div className="search-bar">
                <i className="fas fa-search"></i>
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <select
                className="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="name">Sort by Name</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>

          <div className="food-display-list">
            {paginatedItems.map((item) => (
              <FoodItem
                key={item._id}
                id={item._id}
                {...item}
                isExpanded={expandedItem === item._id}
                onExpand={() => {
                  // Close any open item before expanding the new one
                  if (expandedItem === item._id) {
                    setExpandedItem(null);
                  } else {
                    setExpandedItem(item._id);
                  }
                }}
              />
            ))}
            {paginatedItems.length === 0 && (
              <div className="no-results">
                <i className="fas fa-search"></i>
                <p>No products found</p>
                <p>Try adjusting your search or filters</p>
              </div>
            )}
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="pagination-btn"
              >
                <i className="fas fa-chevron-left"></i>
              </button>

              <div className="page-numbers">
                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index + 1}
                    onClick={() => handlePageChange(index + 1)}
                    className={`page-number ${
                      currentPage === index + 1 ? "active" : ""
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="pagination-btn"
              >
                <i className="fas fa-chevron-right"></i>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const Shop = memo(ShopComponent);
export default Shop;
