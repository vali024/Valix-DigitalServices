import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  ExternalLink,
  Play,
  Eye,
  Filter,
  Zap,
  Target,
  Layers,
  Clock,
  MessageCircle,
  CheckCircle,
  X,
  Github,
} from "lucide-react";
import "./Portfolio.css";
import "./double-click-styles.css";
import tecnho from "../../assets/DigitalM.png";
import cont from "../../assets/Content.png";


// Example portfolio data
const examplePortfolio = [
  {
    id: "1",
    title: "Restaurant Landing Page",
    description: "A modern, responsive landing page for a high-end restaurant featuring smooth animations and online booking.",
    category: "Web",
    technologies: ["React", "Tailwind CSS", "Framer Motion"],
    image: tecnho,
    video: "/portfolio/Restostatic-siteV.mp4",
    websiteUrl: "https://restaurant-demo.com",
    githubUrl: "https://github.com/example/restaurant-landing",
    featured: true,
    completionDate: "2023",
    client: "Fine Dining Co.",
    details: [
      "Interactive menu showcase",
      "Table reservation system",
      "Custom animations",
      "Mobile-first design",
      "Performance optimization"
    ]
  },
  {
    id: "2",
    title: "E-commerce Mobile App",
    description: "Full-featured e-commerce mobile application with real-time inventory and payment processing.",
    category: "Design",
    technologies: ["React Native", "Firebase", "Stripe"],
    image: cont,
    websiteUrl: "https://ecommerce-app-demo.com",
    featured: true,
    completionDate: "2023",
    client: "ShopMax",
    details: [
      "User authentication",
      "Payment integration",
      "Push notifications",
      "Order tracking",
      "Wishlist feature"
    ]
  },
  {
    id: "3",
    title: "Corporate Brand Video",
    description: "Cinematic brand video showcasing company culture and values.",
    category: "Video",
    technologies: ["After Effects", "Premier Pro", "Cinema 4D"],
    image: "/portfolio/brand-video-thumbnail.jpg",
    video: "/portfolio/corporate-brand.mp4",
    websiteUrl: "https://vimeo.com/example",
    featured: false,
    completionDate: "2023",
    client: "TechCorp Inc.",
    details: [
      "3D animations",
      "Custom motion graphics",
      "Professional voiceover",
      "Original soundtrack",
      "4K resolution"
    ]
  },
  {
    id: "4",
    title: "Social Media Campaign",
    description: "Comprehensive social media campaign including animated posts and stories.",
    category: "Social",
    technologies: ["Photoshop", "Illustrator", "After Effects"],
    image: "/portfolio/social-campaign.jpg",
    video: "/portfolio/social-ads-reel.mp4",
    websiteUrl: "https://instagram.com/example",
    featured: true,
    completionDate: "2023",
    client: "Fashion Brand X",
    details: [
      "Instagram Stories",
      "Facebook Ads",
      "Animated posts",
      "Engagement strategy",
      "Analytics reporting"
    ]
  },
  {
    id: "5",
    title: "Product 3D Visualization",
    description: "Photorealistic 3D product renders and animations for marketing.",
    category: "Design",
    technologies: ["Blender", "Corona Renderer", "Photoshop"],
    image: "/portfolio/3d-product-renders.jpg",
    video: "/portfolio/product-animation.mp4",
    websiteUrl: "https://behance.net/example",
    featured: true,
    completionDate: "2023",
    client: "GadgetPro",
    details: [
      "Photorealistic rendering",
      "Product animation",
      "Lighting setup",
      "Material design",
      "Scene composition"
    ]
  },
  {
    id: "6",
    title: "Educational Platform UI/UX",
    description: "Complete UI/UX design for an online learning platform.",
    category: "Design",
    technologies: ["Figma", "Principle", "Protopie"],
    image: "/portfolio/edu-platform-design.jpg",
    websiteUrl: "https://figma.com/example",
    featured: false,
    completionDate: "2023",
    client: "EduLearn",
    details: [
      "User research",
      "Wireframing",
      "Interactive prototypes",
      "Design system",
      "Usability testing"
    ]
  }
];

const Portfolio = () => {
  const [activeFilter, setActiveFilter] = useState("All");
  const [isVisible, setIsVisible] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const filterSectionRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Filter portfolio items based on active filter
  const filteredPortfolioItems = useMemo(() => {
    if (activeFilter === "All") {
      return examplePortfolio;
    }
    return examplePortfolio.filter(item => 
      item.category.toLowerCase().includes(activeFilter.toLowerCase())
    );
  }, [activeFilter]);

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

    return (
      <div className="media-modal-overlay" onClick={onClose}>
        <div className="media-modal" onClick={(e) => e.stopPropagation()}>
          <button className="modal-close" onClick={onClose}>
            <X size={24} />
          </button>

          <div className="media-container">
            <img
              src={item.image || "https://via.placeholder.com/800x600?text=Project+Image"}
              alt={item.title}
              className="modal-image"
              onError={(e) => {
                console.error("Image error:", e);
                e.target.src = "https://via.placeholder.com/800x600?text=Image+Not+Found";
              }}
            />
          </div>

          <div className="modal-info">
            <h3>{item.title}</h3>
            <p className="modal-description">{item.description}</p>

            <div className="modal-actions">
              {item.websiteUrl && (
                <button
                  onClick={() => openWebsite(item.websiteUrl)}
                  className="website-link-btn"
                >
                  <ExternalLink size={16} />
                  View Live Demo
                </button>
              )}
              {item.githubUrl && (
                <button
                  onClick={() => openWebsite(item.githubUrl)}
                  className="github-link-btn"
                >
                  <Github size={16} />
                  View Code
                </button>
              )}
            </div>

            <div className="modal-details">
              <div className="detail-item">
                <h4>Client</h4>
                <p>{item.client}</p>
              </div>
              <div className="detail-item">
                <h4>Completed</h4>
                <p>{item.completionDate}</p>
              </div>
              <div className="detail-item">
                <h4>Technologies</h4>
                <div className="modal-tags">
                  {item.technologies.map((tech) => (
                    <span key={tech} className="modal-tag">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="modal-features">
              <h4>Key Features</h4>
              <ul className="features-list">
                {item.details.map((detail, index) => (
                  <li key={index}>
                    <CheckCircle size={16} className="feature-icon" />
                    {detail}
                  </li>
                ))}
              </ul>
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
          {filteredPortfolioItems.length === 0 ? (
            <div className="portfolio-empty">
              <p>No projects found in this category.</p>
            </div>
          ) : (
            <div className="portfolio-grid">
              {filteredPortfolioItems.map((item) => (
                <div
                  key={item.id}
                  className="portfolio-card"
                  onDoubleClick={() => openMediaModal(item)}
                >
                  <div className="portfolio-card-image">
                    <img
                      src={item.image || "https://via.placeholder.com/400x300?text=Project+Image"}
                      alt={item.title}
                      className="card-image"
                      onError={(e) => {
                        console.error("Image error:", e);
                        e.target.src = "https://via.placeholder.com/400x300?text=Image+Not+Found";
                      }}
                    />
                    <div className="card-overlay">
                      <div className="overlay-content">
                        <div className="overlay-tags">
                          {item.technologies.slice(0, 2).map((tech) => (
                            <span key={tech} className="overlay-tag">
                              {tech}
                            </span>
                          ))}
                        </div>
                        <div className="overlay-actions">
                          <button
                            className="overlay-action preview"
                            onClick={() => openMediaModal(item)}
                            title="View Details"
                          >
                            <Eye size={20} />
                          </button>
                          {item.websiteUrl && (
                            <button
                              className="overlay-action website"
                              onClick={() => openWebsite(item.websiteUrl)}
                              title="Live Demo"
                            >
                              <ExternalLink size={20} />
                            </button>
                          )}
                          {item.githubUrl && (
                            <button
                              className="overlay-action github"
                              onClick={() => openWebsite(item.githubUrl)}
                              title="View Code"
                            >
                              <Github size={20} />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="card-category">
                      <span className="category-badge">{item.category}</span>
                    </div>
                  </div>
                  <div className="portfolio-card-content">
                    <h3 className="card-title">{item.title}</h3>
                    <p className="card-description">{item.description}</p>
                    <div className="card-client-info">
                      <div className="client-detail">
                        <span className="client-label">Client:</span>
                        <span className="client-name">{item.client}</span>
                      </div>
                      <div className="completion-date">
                        <Clock className="date-icon" size={14} />
                        <span className="date-text">{item.completionDate}</span>
                      </div>
                    </div>

                    <div className="card-tags">
                      {item.technologies.map((tech) => (
                        <span key={tech} className="card-tag">
                          {tech}
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
