import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  ExternalLink,
  Play,
  Eye,
  Filter,
  Zap,
  Target,
  Layers,
  Clock,
  Star,
  Users,
  MessageCircle,
  ArrowRight,
  CheckCircle,
  Loader,
  X,
  Instagram,
  Linkedin,
  Facebook,
  Twitter,
  Youtube,
} from "lucide-react";
import "./Portfolio.css";
import "./double-click-styles.css"; // Import the new CSS file

const Portfolio = () => {
  const [activeFilter, setActiveFilter] = useState("All");
  const [isVisible, setIsVisible] = useState(false);
  const [portfolioItems, setPortfolioItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const filterSectionRef = useRef(null);

  const URL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    fetchPortfolioItems();
  }, [activeFilter, URL]);

  const fetchPortfolioItems = async () => {
    try {
      setLoading(true);
      const url =
        activeFilter === "All"
          ? `${URL}/api/portfolio`
          : `${URL}/api/portfolio?category=${activeFilter}`;

      console.log("Fetching portfolio from:", url);
      const response = await axios.get(url);

      if (!response.data || !response.data.data) {
        throw new Error("Invalid response format from server");
      }

      console.log(`Fetched ${response.data.data.length} portfolio items`);
      setPortfolioItems(response.data.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching portfolio items:", err);
      setError("Failed to load portfolio items. Please try again later.");
      setLoading(false);
    }
  };

  const openMediaModal = (item) => {
    setSelectedMedia(item);
    setShowModal(true);
  };

  const closeMediaModal = () => {
    setSelectedMedia(null);
    setShowModal(false);
  };

  const openWebsite = (url) => {
    if (url) {
      window.open(url, "_blank");
    }
  };

  const getSocialIcon = (platform) => {
    switch (platform) {
      case "instagram":
        return Instagram;
      case "linkedin":
        return Linkedin;
      case "facebook":
        return Facebook;
      case "twitter":
        return Twitter;
      case "youtube":
        return Youtube;
      default:
        return ExternalLink;
    }
  };

  const MediaModal = ({ item, onClose }) => {
    if (!item) return null;

    const getImageUrl = (path) => {
      if (!path) return "";
      return path.startsWith("/uploads") ? `${URL}${path}` : path;
    };

    return (
      <div className="media-modal-overlay" onClick={onClose}>
        <div className="media-modal" onClick={(e) => e.stopPropagation()}>
          <button className="modal-close" onClick={onClose}>
            <X size={24} />
          </button>

          <div className="media-container">
            {item.mediaType === "video" ? (
              <video
                src={getImageUrl(item.image)}
                controls
                className="modal-video"
                autoPlay
                playsInline
                onError={(e) => {
                  console.error("Video error:", e);
                  e.target.outerHTML =
                    '<div class="error-message">Video could not be loaded</div>';
                }}
              />
            ) : (
              <img
                src={getImageUrl(item.image)}
                alt={item.title}
                className="modal-image"
                onError={(e) => {
                  console.error("Image error:", e);
                  e.target.src =
                    "https://via.placeholder.com/800x600?text=Image+Not+Found";
                }}
              />
            )}
          </div>

          <div className="modal-info">
            <h3>{item.title}</h3>
            <p className="modal-description">{item.description}</p>

            {item.websiteUrl && (
              <div className="modal-website">
                <button
                  onClick={() => openWebsite(item.websiteUrl)}
                  className="website-link-btn"
                >
                  <ExternalLink size={16} />
                  Visit Website
                </button>
              </div>
            )}

            {item.socialLinks &&
              Object.keys(item.socialLinks).some(
                (key) => item.socialLinks[key]
              ) && (
                <div className="modal-social">
                  <h4>Social Links:</h4>
                  <div className="social-links">
                    {Object.entries(item.socialLinks).map(([platform, url]) => {
                      if (!url) return null;
                      const IconComponent = getSocialIcon(platform);
                      return (
                        <a
                          key={platform}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="social-link"
                          title={platform}
                        >
                          <IconComponent size={20} />
                        </a>
                      );
                    })}
                  </div>
                </div>
              )}

            <div className="modal-tags">
              {item.tags.map((tag) => (
                <span key={tag} className="modal-tag">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const filters = ["All", "Web", "Design", "Video", "Social"];

  const getIcon = (type) => {
    switch (type) {
      case "video":
        return <Play className="portfolio-action-icon" />;
      case "website":
      case "app":
        return <ExternalLink className="portfolio-action-icon" />;
      default:
        return <Eye className="portfolio-action-icon" />;
    }
  };

  const stats = [
    {
      number: "20+",
      label: "Projects Completed",
      color: "from-blue-500 to-blue-600",
    },
    {
      number: "85%",
      label: "Client Satisfaction",
      color: "from-green-500 to-green-600",
    },
    {
      number: "15+",
      label: "Happy Clients",
      color: "from-purple-500 to-purple-600",
    },
    {
      number: "24/7",
      label: "Support Available",
      color: "from-orange-500 to-orange-600",
    },
  ];

  const processSteps = [
    {
      step: "01",
      title: "Discovery",
      description:
        "Understanding your vision, goals, and requirements through detailed consultation",
      icon: Target,
      color: "from-blue-500 to-cyan-500",
    },
    {
      step: "02",
      title: "Strategy",
      description:
        "Creating a detailed plan and roadmap for success with clear milestones",
      icon: Layers,
      color: "from-purple-500 to-pink-500",
    },
    {
      step: "03",
      title: "Design",
      description:
        "Crafting beautiful, functional designs that convert visitors into customers",
      icon: Zap,
      color: "from-green-500 to-emerald-500",
    },
    {
      step: "04",
      title: "Launch",
      description:
        "Delivering your project on time and ensuring perfect results with ongoing support",
      icon: Clock,
      color: "from-orange-500 to-red-500",
    },
  ];

  return (
    <div className="portfolio-page">
      {/* Hero Section */}
      <section className="portfolio-hero">
        <div className="portfolio-hero-background"></div>
        <div className="container">
          <div
            className={`portfolio-hero-content ${
              isVisible ? "animate-in" : ""
            }`}
          >
            <div className="portfolio-hero-badge">
              <Zap className="badge-icon" />
              <span>Our Amazing Work</span>
            </div>
            <h1 className="portfolio-hero-title">
              Our <span className="gradient-text">Portfolio</span>
              <br />
              of Success Stories
            </h1>
            <p className="portfolio-hero-description">
              Explore our latest work and see how we've helped businesses
              transform their digital presence with innovative solutions
            </p>
          </div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="portfolio-filter-section">
        <div className="container">
          <div className="portfolio-filter-wrapper">
            <div className="filter-header">
              <Filter className="filter-icon" />
              <span className="filter-label">Filter by:</span>
            </div>
            <div className="filter-buttons">
              {filters.map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`filter-button ${
                    activeFilter === filter ? "active" : ""
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio Grid */}
      <section className="portfolio-grid-section">
        <div className="container">
          {loading ? (
            <div className="portfolio-loading">
              <Loader className="loading-icon" />
              <p>Loading projects...</p>
            </div>
          ) : error ? (
            <div className="portfolio-error">
              <p>{error}</p>
              <button onClick={fetchPortfolioItems} className="retry-button">
                Try Again
              </button>
            </div>
          ) : portfolioItems.length === 0 ? (
            <div className="portfolio-empty">
              <p>No projects found in this category.</p>
            </div>
          ) : (
            <div className="portfolio-grid">
              {portfolioItems.map((item) => (
                <div
                  key={item._id}
                  className="portfolio-card"
                  onDoubleClick={() => openMediaModal(item)}
                >
                  <div className="portfolio-card-image">
                    {item.mediaType === "video" ? (
                      <div className="video-thumbnail">
                        <video
                          src={
                            item.image.startsWith("/uploads")
                              ? `${URL}${item.image}`
                              : item.image
                          }
                          muted
                          playsInline
                          onError={(e) => {
                            console.error("Video thumbnail error:", e);
                            e.target.style.display = "none";
                            e.target.parentNode.style.backgroundColor = "#000";
                          }}
                        />
                        <div className="video-overlay">
                          <Play size={40} />
                        </div>
                      </div>
                    ) : (
                      <img
                        src={
                          item.image.startsWith("http")
                            ? item.image
                            : `${URL}${item.image.startsWith("/") ? item.image : `/${item.image}`}`
                        }
                        alt={item.title}
                        className="card-image"
                        onError={(e) => {
                          console.error("Image error:", e);
                          e.target.src =
                            "https://via.placeholder.com/400x300?text=Image+Not+Found";
                        }}
                      />
                    )}
                    <div className="card-overlay">
                      <div className="overlay-content">
                        <div className="overlay-tags">
                          {item.tags.slice(0, 2).map((tag) => (
                            <span key={tag} className="overlay-tag">
                              {tag}
                            </span>
                          ))}
                        </div>
                        <div className="overlay-actions">
                          <button
                            className="overlay-action preview"
                            onClick={() => openMediaModal(item)}
                            title="Preview"
                          >
                            <Eye size={20} />
                          </button>
                          {item.websiteUrl && (
                            <button
                              className="overlay-action website"
                              onClick={() => openWebsite(item.websiteUrl)}
                              title="Visit Website"
                            >
                              <ExternalLink size={20} />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="card-category">
                      <span className="category-badge">{item.category}</span>
                    </div>
                  </div>
                  <div
                    className="portfolio-card-content"
                    onDoubleClick={() => openMediaModal(item)}
                  >
                    <h3 className="card-title">{item.title}</h3>
                    <p className="card-description">{item.description}</p>
                    <div className="card-client-info">
                      <div className="client-detail">
                        <span className="client-label">Client:</span>
                        <span className="client-name">{item.client}</span>
                      </div>
                      <div className="result-detail">
                        <CheckCircle className="result-icon" />
                        <span className="result-text">{item.result}</span>
                      </div>
                    </div>

                    {item.socialLinks &&
                      Object.keys(item.socialLinks).some(
                        (key) => item.socialLinks[key]
                      ) && (
                        <div className="card-social">
                          <span className="social-label">Connect:</span>
                          <div className="card-social-links">
                            {Object.entries(item.socialLinks).map(
                              ([platform, url]) => {
                                if (!url) return null;
                                const IconComponent = getSocialIcon(platform);
                                return (
                                  <a
                                    key={platform}
                                    href={url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="card-social-link"
                                    title={platform}
                                  >
                                    <IconComponent size={16} />
                                  </a>
                                );
                              }
                            )}
                          </div>
                        </div>
                      )}

                    <div className="card-tags">
                      {item.tags.map((tag) => (
                        <span key={tag} className="card-tag">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Stats Section */}
      <section className="portfolio-stats-section">
        <div className="container">
          <div className="stats-header">
            <h2 className="stats-title">Our Impact in Numbers</h2>
            <p className="stats-description">
              These numbers represent our commitment to delivering exceptional
              results for every client
            </p>
          </div>
          <div className="stats-grid">
            {stats.map((stat, index) => (
              <div key={index} className="stat-card">
                <div className={`stat-number bg-gradient-to-r ${stat.color}`}>
                  {stat.number}
                </div>
                <p className="stat-label">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="portfolio-process-section">
        <div className="container">
          <div className="process-header">
            <h2 className="process-title">How We Create Amazing Work</h2>
            <p className="process-description">
              Our proven process ensures every project meets the highest
              standards and delivers real results
            </p>
          </div>
          <div className="process-grid">
            {processSteps.map((process, index) => (
              <div key={index} className="process-step">
                <div className={`step-icon bg-gradient-to-r ${process.color}`}>
                  <process.icon className="step-icon-svg" />
                </div>
                <div className="step-number">{process.step}</div>
                <h3 className="step-title">{process.title}</h3>
                <p className="step-description">{process.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* CTA Section */}
      <section className="contact-page-root__cta-section">
        <div className="contact-page-root__cta-container">
          <p>
            Let's discuss your project needs and create a custom solution that
            fits your budget and goals.
          </p>
          <a
            href="https://wa.me/+918919825034"
            target="_blank"
            rel="noopener noreferrer"
            className="contact-page-root__cta-btn"
          >
            <MessageCircle />
            <span>Chat on WhatsApp</span>
          </a>
        </div>
      </section>

      {/* Media Modal */}
      {showModal && (
        <MediaModal item={selectedMedia} onClose={closeMediaModal} />
      )}
    </div>
  );
};

export default Portfolio;
