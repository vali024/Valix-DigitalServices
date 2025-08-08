import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import {
  FaEdit,
  FaTrash,
  FaEye,
  FaStar,
  FaRegStar,
  FaLink,
  FaTimes,
  FaPlay,
  FaPause,
  FaVolumeMute,
  FaVolumeUp,
} from "react-icons/fa";
import { BsFilterLeft, BsArrowsFullscreen } from "react-icons/bs";
import "./Portfolio.css";

const Portfolio = () => {
  const [portfolioItems, setPortfolioItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [sortBy, setSortBy] = useState("newest");
  const [fullscreenItem, setFullscreenItem] = useState(null);
  const [fullscreenType, setFullscreenType] = useState(null); // 'image' or 'video'

  const apiUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
  const apiBaseUrl = `${apiUrl}/api`;  
  const adminAuth = JSON.parse(localStorage.getItem("adminAuth"));
  const adminEmail = adminAuth?.email;

  useEffect(() => {
    fetchPortfolioItems();
  }, [categoryFilter, sortBy]);

  useEffect(() => {
    // Initialize videos once they're loaded
    const videos = document.querySelectorAll(
      '.portfolio-image[src*=".mp4"], .portfolio-image[src*=".webm"]'
    );
    videos.forEach((video) => {
      video.addEventListener("loadeddata", () => {
        // Video is ready to play
        console.log("Video loaded successfully");
      });

      video.addEventListener("error", (e) => {
        console.error("Video load error:", e);
      });
    });

    return () => {
      // Cleanup event listeners
      videos.forEach((video) => {
        video.removeEventListener("loadeddata", () => {});
        video.removeEventListener("error", () => {});
      });
    };
  }, [portfolioItems]);

  const fetchPortfolioItems = async () => {
    try {
      setLoading(true);
      setError(null);

      let url = `${apiBaseUrl}/portfolio`;
      if (categoryFilter !== "All") {
        url += `?category=${categoryFilter}`;
      }

      console.log("Fetching portfolio from:", url);
      const response = await axios.get(url);

      if (!response.data || !response.data.data) {
        throw new Error("Invalid response format from server");
      }

      let items = response.data.data;
      console.log(`Fetched ${items.length} portfolio items`);

      // Sort items
      if (sortBy === "newest") {
        items = items.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
      } else if (sortBy === "oldest") {
        items = items.sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        );
      } else if (sortBy === "alphabetical") {
        items = items.sort((a, b) => a.title.localeCompare(b.title));
      } else if (sortBy === "featured") {
        items = items.sort(
          (a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0)
        );
      }

      setPortfolioItems(items);
      setLoading(false);
    } catch (error) {
      console.error("Portfolio fetch error:", error);
      setError(
        error.response?.data?.message || "Failed to fetch portfolio items"
      );
      setLoading(false);
      toast.error("Failed to fetch portfolio items");
    }
  };

  const handleDelete = async (id) => {
    setItemToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`${apiBaseUrl}/portfolio/${itemToDelete}`, {
        headers: { "admin-email": adminEmail },
      });
      toast.success("Portfolio item deleted successfully");
      fetchPortfolioItems();
      setShowDeleteModal(false);
      setItemToDelete(null);
    } catch (error) {
      console.error("Delete error:", error.response?.data || error.message);
      toast.error(
        error.response?.data?.message || "Failed to delete portfolio item"
      );
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setItemToDelete(null);
  };

  const toggleFeatured = async (id, currentStatus) => {
    try {
      await axios.put(
        `${apiBaseUrl}/portfolio/${id}`,
        { featured: !currentStatus },
        { headers: { "admin-email": adminEmail } }
      );
      toast.success(
        `Project ${!currentStatus ? "featured" : "unfeatured"} successfully`
      );
      fetchPortfolioItems();
    } catch (error) {
      toast.error("Failed to update featured status");
    }
  };

  // Get current portfolio items
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = portfolioItems.slice(indexOfFirstItem, indexOfLastItem);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Handle sorting change
  const handleSortChange = (newSortBy) => {
    setSortBy(newSortBy);
    setCurrentPage(1);
  };

  const handleCategoryChange = (category) => {
    setCategoryFilter(category);
    setCurrentPage(1);
  };

  // Handle fullscreen view
  const openFullscreen = (item, type) => {
    setFullscreenItem(item);
    setFullscreenType(type);
    document.body.style.overflow = "hidden"; // Prevent body scroll
  };

  const closeFullscreen = () => {
    setFullscreenItem(null);
    setFullscreenType(null);
    document.body.style.overflow = "auto"; // Restore body scroll
  };

  // Close fullscreen on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && fullscreenItem) {
        closeFullscreen();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "auto"; // Cleanup on unmount
    };
  }, [fullscreenItem]);

  if (loading)
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading projects...</p>
        <small>Please wait while we fetch your portfolio items</small>
      </div>
    );

  if (error)
    return (
      <div className="error-container">
        <div className="error-icon">❌</div>
        <p>{error}</p>
        <small>Check your network connection and server status</small>
        <button onClick={fetchPortfolioItems} className="retry-btn">
          Try Again
        </button>
      </div>
    );

  return (
    <div className="portfolio-admin">
      <div className="portfolio-header">
        <h2>Portfolio Management</h2>
        <Link to="/add-portfolio" className="add-btn">
          Add New Project
        </Link>
      </div>

      <div className="portfolio-filters">
        <div className="filter-group">
          <label>
            <BsFilterLeft /> Category:
          </label>
          <select
            value={categoryFilter}
            onChange={(e) => handleCategoryChange(e.target.value)}
            className="filter-select"
          >
            <option value="All">All Categories</option>
            <option value="Web">Web</option>
            <option value="Design">Design</option>
            <option value="Video">Video</option>
            <option value="Social">Social</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Sort by:</label>
          <select
            value={sortBy}
            onChange={(e) => handleSortChange(e.target.value)}
            className="filter-select"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="alphabetical">A-Z</option>
            <option value="featured">Featured</option>
          </select>
        </div>
      </div>

      {portfolioItems.length === 0 ? (
        <div className="no-items">
          <div className="no-items-icon">📁</div>
          <h3>No portfolio items found</h3>
          <p>Start showcasing your work by adding your first project!</p>
          <Link to="/add-portfolio" className="add-btn-empty">
            Add Your First Project
          </Link>
        </div>
      ) : (
        <>
          <div className="portfolio-grid">
            {currentItems.map((item) => (
              <div key={item._id} className="portfolio-card">
                <div className="portfolio-card-image-container">
                  {item.mediaType === "video" ? (
                    <>
                      <video
                        src={
                          item.image.startsWith("/uploads")
                            ? `${apiUrl}${item.image}`
                            : item.image
                        }
                        className="portfolio-image"
                        muted
                        playsInline
                        loop
                        onMouseOver={(e) => e.target.play()}
                        onMouseOut={(e) => e.target.pause()}
                        onClick={(e) => {
                          e.stopPropagation();
                          openFullscreen(item, "video");
                        }}
                        onError={(e) => {
                          console.error("Video load error:", e);
                          e.target.src =
                            "https://via.placeholder.com/300x200?text=Video+Not+Available";
                        }}
                      />
                      <div className="video-overlay">
                        <span className="play-icon">▶</span>
                      </div>
                    </>
                  ) : (
                    <img
                      src={
                        item.image.startsWith("/uploads")
                          ? `${apiUrl}${item.image}`
                          : item.image
                      }
                      alt={item.title}
                      className="portfolio-image"
                      onClick={(e) => {
                        e.stopPropagation();
                        openFullscreen(item, "image");
                      }}
                      onLoad={(e) => {
                        e.target.style.opacity = "1";
                      }}
                      onError={(e) => {
                        console.error("Image load error:", e);
                        e.target.src =
                          "https://via.placeholder.com/400x300/f0f0f0/666?text=Image+Not+Available";
                        e.target.style.opacity = "0.7";
                      }}
                      style={{ opacity: 0, transition: "opacity 0.3s ease" }}
                    />
                  )}
                  <div className="portfolio-card-overlay">
                    <button
                      className="feature-btn"
                      onClick={() => toggleFeatured(item._id, item.featured)}
                      title={
                        item.featured
                          ? "Unmark as featured"
                          : "Mark as featured"
                      }
                    >
                      {item.featured ? <FaStar /> : <FaRegStar />}
                    </button>
                    <a
                      href={item.websiteUrl || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="view-btn"
                      title="View live project"
                    >
                      <FaEye />
                    </a>
                  </div>
                </div>{" "}
                <div className="portfolio-card-content">
                  <div className="portfolio-card-header">
                    <h3 className="portfolio-title" title={item.title}>
                      {item.title.length > 25
                        ? `${item.title.substring(0, 25)}...`
                        : item.title}
                    </h3>
                    <span className="portfolio-category">{item.category}</span>
                  </div>
                  <p className="portfolio-client" title={`Client: ${item.client}`}>
                    Client:{" "}
                    {item.client.length > 20
                      ? `${item.client.substring(0, 20)}...`
                      : item.client}
                  </p>
                  <div className="portfolio-tags">
                    {item.tags.slice(0, 2).map((tag, index) => (
                      <span key={index} className="portfolio-tag">
                        {tag}
                      </span>
                    ))}
                    {item.tags.length > 2 && (
                      <span
                        className="portfolio-tag-more"
                        title={item.tags.slice(2).join(", ")}
                      >
                        +{item.tags.length - 2}
                      </span>
                    )}
                  </div>
                  <div className="portfolio-card-actions">
                    <Link
                      to={`/edit-portfolio/${item._id}`}
                      className="edit-btn"
                      title="Edit Project"
                    >
                      <FaEdit /> <span>Edit</span>
                    </Link>
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="delete-btn"
                      title="Delete Project"
                    >
                      <FaTrash /> <span>Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {portfolioItems.length > itemsPerPage && (
            <div className="pagination">
              <button
                onClick={() => paginate(currentPage > 1 ? currentPage - 1 : 1)}
                disabled={currentPage === 1}
                className="pagination-btn prev"
              >
                Previous
              </button>

              {Array.from({
                length: Math.ceil(portfolioItems.length / itemsPerPage),
              }).map((_, index) => {
                // Show limited page numbers with ellipsis
                if (
                  index === 0 || // First page
                  index ===
                    Math.ceil(portfolioItems.length / itemsPerPage) - 1 || // Last page
                  (index >= currentPage - 2 && index <= currentPage + 2) // Pages around current
                ) {
                  return (
                    <button
                      key={index}
                      onClick={() => paginate(index + 1)}
                      className={
                        currentPage === index + 1
                          ? "pagination-btn active"
                          : "pagination-btn"
                      }
                    >
                      {index + 1}
                    </button>
                  );
                } else if (
                  index === currentPage - 3 ||
                  index === currentPage + 3
                ) {
                  return (
                    <span key={index} className="pagination-ellipsis">
                      ...
                    </span>
                  );
                }
                return null;
              })}

              <button
                onClick={() =>
                  paginate(
                    currentPage <
                      Math.ceil(portfolioItems.length / itemsPerPage)
                      ? currentPage + 1
                      : currentPage
                  )
                }
                disabled={
                  currentPage ===
                  Math.ceil(portfolioItems.length / itemsPerPage)
                }
                className="pagination-btn next"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Delete Confirmation</h3>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to delete this portfolio item?</p>
              <p className="modal-warning">This action cannot be undone.</p>
            </div>
            <div className="modal-footer">
              <button onClick={cancelDelete} className="modal-cancel-btn">
                Cancel
              </button>
              <button onClick={confirmDelete} className="modal-delete-btn">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Fullscreen Modal */}
      {fullscreenItem && (
        <div
          className={`fullscreen-modal ${fullscreenItem ? "active" : ""}`}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              closeFullscreen();
            }
          }}
        >
          <div className="fullscreen-content">
            <button className="fullscreen-close" onClick={closeFullscreen}>
              <FaTimes />
            </button>

            {fullscreenType === "video" ? (
              <video
                src={
                  fullscreenItem.image.startsWith("/uploads")
                    ? `${apiUrl}${fullscreenItem.image}`
                    : fullscreenItem.image
                }
                className="fullscreen-video"
                controls
                playsInline
                autoPlay
                onError={(e) => {
                  console.error("Fullscreen video error:", e);
                  e.target.outerHTML =
                    '<div class="error-message" style="color: white; text-align: center; padding: 20px; font-size: 18px;">Video could not be loaded</div>';
                }}
              />
            ) : (
              <img
                src={
                  fullscreenItem.image.startsWith("/uploads")
                    ? `${apiUrl}${fullscreenItem.image}`
                    : fullscreenItem.image
                }
                alt={fullscreenItem.title}
                className="fullscreen-image"
                onError={(e) => {
                  console.error("Fullscreen image load error:", e);
                  e.target.src =
                    "https://via.placeholder.com/800x600/f0f0f0/666?text=Image+Not+Available";
                }}
              />
            )}

            <div className="fullscreen-caption">
              <div className="fullscreen-header">
                <h3>{fullscreenItem.title}</h3>
                <span className="fullscreen-category">
                  {fullscreenItem.category}
                </span>
              </div>
              <p className="fullscreen-client">
                Client: {fullscreenItem.client}
              </p>
              <p className="fullscreen-description">
                {fullscreenItem.description}
              </p>

              <div className="fullscreen-actions">
                {fullscreenItem.websiteUrl && (
                  <a
                    href={fullscreenItem.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="website-link"
                  >
                    <FaLink /> Visit Live Project
                  </a>
                )}

                {fullscreenItem.tags && fullscreenItem.tags.length > 0 && (
                  <div className="fullscreen-tags">
                    {fullscreenItem.tags.map((tag, index) => (
                      <span key={index} className="fullscreen-tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Portfolio;
