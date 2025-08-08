import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Code,
  Palette,
  Video,
  Share2,
  Clock,
  Headphones,
  DollarSign,
  Users,
  Star,
  CheckCircle,
  Sparkles,
  Zap,
  Globe,
  Layers,
  Heart,
  Target,
  ExternalLink,
  Eye,
} from "lucide-react";
import axios from "axios";
import "./Header.css";
import "./ServiceSection.css";
import "./WhyChooseUs.css";
import headerImage from "../../assets/header.jpg";
import main from "../../assets/main.png";
import WebD from "../../assets/WebD.png";
import AppDevelopment from "../../assets/AppDevelopment.png";
import DigitalM from "../../assets/DigitalM.png";
import GraphicD from "../../assets/GraphicD.png";
import Videoedit from "../../assets/Videoedit.png";
import Content from "../../assets/Content.png";
import valix from "../../assets/valix.png";

const Header = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [currentMiddleWord, setCurrentMiddleWord] = useState(0);
  const [portfolioItems, setPortfolioItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const headerRef = useRef(null);

  const API_URL = `${import.meta.env.VITE_BACKEND_URL}/api`;
  const BASE_URL = import.meta.env.VITE_BACKEND_URL;
  

  const middleWords = [
    "Interactive",
    "Impactful",
    "Stunning",
    "Future-Ready",
    "Brand-Centric",
  ];

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMiddleWord((prev) => (prev + 1) % middleWords.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [middleWords.length]);

  // Fetch portfolio items when the component mounts or category changes
  useEffect(() => {
    const fetchPortfolioItems = async () => {
      try {
        setLoading(true);
        const url =
          selectedCategory === "All"
            ? `${API_URL}/portfolio`
            : `${API_URL}/portfolio?category=${selectedCategory}`;

        console.log("Fetching portfolio from:", url);
        const response = await axios.get(url);

        if (!response.data || !response.data.data) {
          throw new Error("Invalid response format from server");
        }

        console.log("Portfolio items received:", response.data.data);
        console.log("First item image path:", response.data.data[0]?.image);
        setPortfolioItems(response.data.data.slice(0, 5)); // Only show first 5 items
        setLoading(false);
      } catch (err) {
        console.error("Error fetching portfolio items:", err);
        setError("Failed to load portfolio items");
        setLoading(false);
      }
    };

    fetchPortfolioItems();
  }, [selectedCategory, API_URL]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("step-visible");
          }
        });
      },
      { threshold: 0.3 }
    );

    document.querySelectorAll(".step, .cta-box").forEach((element) => {
      observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  const services = [
    {
      icon: Globe,
      title: "Web Design & Development",
      description:
        "Custom responsive websites tailored to your brand with modern UI/UX principles for maximum engagement.",
      features: [
        "Responsive Design",
        "E-commerce Solutions",
        "CMS Integration",
        "SEO Optimization",
      ],
      colorClass: "web-design-bg",
      path: "/services",
      image: WebD,
    },
    {
      icon: Layers,
      title: "App Development",
      description:
        "Native and cross-platform mobile applications that deliver seamless user experiences across all devices.",
      features: [
        "iOS & Android Apps",
        "Cross-platform Solutions",
        "UI/UX Design",
        "App Maintenance",
      ],
      colorClass: "app-development-bg",
      path: "/services",
      image: AppDevelopment,
    },
    {
      icon: Palette,
      title: "Graphic Design",
      description:
        "Eye-catching visual designs that communicate your brand message and captivate your target audience.",
      features: [
        "Brand Identity",
        "Print Materials",
        "Social Media Graphics",
        "Packaging Design",
      ],
      colorClass: "graphic-design-bg",
      path: "/services",
      image: GraphicD,
    },
    {
      icon: Target,
      title: "Digital Marketing",
      description:
        "Strategic digital marketing services to increase your online visibility and drive measurable results.",
      features: [
        "SEO & SEM",
        "Social Media Marketing",
        "Email Campaigns",
        "Content Strategy",
      ],
      colorClass: "digital-marketing-bg",
      path: "/services",
      image: DigitalM,
    },
    {
      icon: Video,
      title: "Video Production",
      description:
        "Professional video content creation from concept to final edit for all your marketing and branding needs.",
      features: [
        "Commercial Videos",
        "Product Showcases",
        "Event Coverage",
        "Motion Graphics",
      ],
      colorClass: "video-editing-bg",
      path: "/services",
      image: Videoedit,
    },
    {
      icon: Share2,
      title: "Content Creation",
      description:
        "Compelling content that tells your brand story, engages your audience, and drives conversions.",
      features: [
        "Blog Writing",
        "Copywriting",
        "Social Media Content",
        "Email Newsletters",
      ],
      colorClass: "content-writing-bg",
      path: "/services",
      image: Content,
    },
  ];

  const benefits = [
    {
      icon: Clock,
      title: "Fast Turnaround",
      description: "Quick delivery without compromising quality",
    },
    {
      icon: Headphones,
      title: "24/7 Support",
      description: "Always here when you need us most",
    },
    {
      icon: DollarSign,
      title: "Affordable Pricing",
      description: "Premium quality at competitive rates",
    },
    {
      icon: Users,
      title: "Multi-skilled Team",
      description: "Expert professionals in every field",
    },
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "CEO, TechStart",
      content:
        "DigitalCraft transformed our vision into a stunning website. Their attention to detail and professionalism exceeded our expectations.",
      rating: 5,
      image:
        "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    {
      name: "Michael Chen",
      role: "Marketing Director",
      content:
        "The social media management service boosted our engagement by 300%. Incredible results and fantastic communication throughout.",
      rating: 5,
      image:
        "https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    {
      name: "Emily Rodriguez",
      role: "Small Business Owner",
      content:
        "From logo design to website development, they handled everything perfectly. Our brand looks amazing and professional now.",
      rating: 5,
      image:
        "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
  ];

  return (
    <div className="header-container" ref={headerRef}>
      {/* Animated Background Elements */}
      <div className="floating-elements">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className={`floating-element floating-element-${i + 1}`}
            style={{
              "--mouse-x": `${mousePosition.x}px`,
              "--mouse-y": `${mousePosition.y}px`,
            }}
          />
        ))}
      </div>

      {/* Hero Section */}
      <section
        className="hero-section"
        style={{
          backgroundImage: `url(${headerImage})`,
        }}
      >
        <div className="hero-gradient-overlay"></div>
        <div className="container">
          <div className="hero-content">
            <div className={`hero-text ${isVisible ? "animate-in" : ""}`}>
              <div className="hero-badge">
                <Zap className="sparkle-icon" />
                <span>Premium Digital Agency</span>
              </div>
              <h1 className="hero-title">
                <span className="title-line-1">We Build</span>
                <span className="title-line-2">
                  <span
                    key={currentMiddleWord}
                    className="gradient-text animated-word"
                  >
                    {middleWords[currentMiddleWord]}
                  </span>
                </span>
                <span className="title-line-3">
                  <span className="typing-text">Experiences</span>
                </span>
              </h1>
              <p className="hero-description">
                Transform your vision into stunning digital reality with our
                cutting-edge solutions. We craft websites, apps, designs, and
                marketing strategies that captivate and convert.
              </p>
              <div className="hero-buttons">
                <Link to="/shop" className="btn-primary">
                  <span>Explore Products</span>
                  <ArrowRight className="btn-icon" />
                  <div className="btn-glow"></div>
                </Link>
                <Link to="/contact" className="btn-secondary">
                  <Zap className="btn-icon-left" />
                  <span>Get Free Quote</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="about-section">
        <div className="container">
          <div className="about-content">
            <div className="about-info">
              <h1>
                About <span className="gradient-text">Valix</span>
              </h1>
              <h2>
                Affordable Websites, Designs, Edits & Social Media Services
              </h2>
              <p>
                At Valix, we believe every idea deserves a powerful digital
                presence. Our mission is to help individuals, creators,
                startups, and small businesses across India thrive online — with
                professional websites, stunning designs, sharp video edits, and
                full social media support, all at affordable prices.
              </p>

              <div className="feature-quotes">
                <div className="feature-quote">
                  <div className="quote-icon-circle">
                    <Star className="quote-icon" />
                  </div>
                  <span className="quote-text">Premium Quality</span>
                </div>
                <div className="feature-quote">
                  <div className="quote-icon-circle">
                    <Sparkles className="quote-icon" />
                  </div>
                  <span className="quote-text">Creative Solutions</span>
                </div>
                <div className="feature-quote">
                  <div className="quote-icon-circle">
                    <Globe className="quote-icon" />
                  </div>
                  <span className="quote-text">India-Focused</span>
                </div>
                <div className="feature-quote">
                  <div className="quote-icon-circle">
                    <CheckCircle className="quote-icon" />
                  </div>
                  <span className="quote-text">Client-First</span>
                </div>
              </div>

              <Link to="/contact" className="call-now-btn">
                <Zap className="btn-icon-left" />
                <span>Connect</span>
              </Link>
            </div>
            <div className="about-image">
              <img src={main} alt="Valix Digital Services" />
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="explore-menu" id="explore-menu" ref={headerRef}>
        <div className="container">
          <div className="explore-menu-header">
            <h1>Our Professional Services</h1>
            <p>
              Solutions That <strong>Elevate</strong> Your Business
            </p>
          </div>

          <div className="categories-grid">
            {services.map((service, index) => (
              <div
                key={index}
                className="category-card"
                style={{
                  animationDelay: `${index * 0.1}s`,
                  "--index": index,
                }}
              >
                <div
                  className="category-image"
                  style={{
                    background: `linear-gradient(135deg, rgba(0,0,0,0.05), rgba(0,0,0,0.1))`,
                  }}
                >
                  <img src={service.image} alt={service.title} />
                  <div
                    className="image-overlay"
                    style={{
                      position: "absolute",
                      inset: 0,
                      background:
                        "linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.4))",
                      zIndex: 1,
                    }}
                  ></div>
                  <div className={`category-overlay ${service.colorClass}`}>
                    <service.icon className="category-icon" />
                  </div>
                  <div className="service-pattern"></div>
                </div>
                <div className="category-content">
                  <h2>{service.title}</h2>
                  <p>{service.description}</p>
                  <div className="feature-list">
                    {service.features.map((feature, i) => (
                      <div className="feature-item" key={i}>
                        <CheckCircle size={14} /> {feature}
                      </div>
                    ))}
                  </div>
                  <Link to={service.path} className="category-button">
                    <span>Explore Service</span>
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Valix Section */}
      <section className="why-choose-us" id="why-choose-us">
        <div className="container">
          <div className="section-header">
            <h1>Why Choose Valix</h1>
            <h2>What Sets Us Apart</h2>
          </div>

          <div className="steps-container">
            <div className="steps-left">
              <div className="step" style={{ animationDelay: "0.1s" }}>
                <div className="step-number">01</div>
                <div className="step-content">
                  <div className="step-title">Fast Turnaround</div>
                </div>
              </div>
              <div className="step" style={{ animationDelay: "0.2s" }}>
                <div className="step-number">02</div>
                <div className="step-content">
                  <div className="step-title">24/7 Support</div>
                </div>
              </div>
              <div className="step" style={{ animationDelay: "0.3s" }}>
                <div className="step-number">03</div>
                <div className="step-content">
                  <div className="step-title">Affordable Pricing</div>
                </div>
              </div>
            </div>

            <div className="why-choose-image">
              <img src={valix} alt="Why choose Valix" />
            </div>

            <div className="steps-right">
              <div className="step" style={{ animationDelay: "0.4s" }}>
                <div className="step-number">04</div>
                <div className="step-content">
                  <div className="step-title">Multi-skilled Team</div>
                </div>
              </div>
              <div className="step" style={{ animationDelay: "0.5s" }}>
                <div className="step-number">05</div>
                <div className="step-content">
                  <div className="step-title">Customized Solutions</div>
                </div>
              </div>
              <div className="step" style={{ animationDelay: "0.6s" }}>
                <div className="step-number">06</div>
                <div className="step-content">
                  <div className="step-title">Proven Results</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio Display Section */}
      <section className="portfolio-display" id="portfolio-display">
        <div className="container">
          <div className="portfolio-display-header">
            <h2>Our Creative Portfolio</h2>
            <div className="portfolio-category-tabs">
              {["All", "Web", "Design", "Video", "Social"].map((category) => (
                <button
                  key={category}
                  className={`portfolio-category-tab ${
                    selectedCategory === category ? "active" : ""
                  }`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="portfolio-loading">
              <div className="portfolio-loading-icon">
                <Zap size={30} />
              </div>
              <p>Loading amazing projects...</p>
            </div>
          ) : error ? (
            <div className="no-portfolio-items">
              <p>{error}</p>
            </div>
          ) : portfolioItems.length === 0 ? (
            <div className="no-portfolio-items">
              <p>No portfolio items found in this category.</p>
            </div>
          ) : (
            <div className="portfolio-display-grid">
              {portfolioItems.map((item) => (
                <div key={item._id} className="portfolio-display-card">
                  <div className="portfolio-display-category">
                    {item.category}
                  </div>
                  <div className="portfolio-display-image">
                    {item.mediaType === "video" ? (
                      <video
                        src={
                          item.image.startsWith("http")
                            ? item.image
                            : `${BASE_URL}${item.image}`
                        }
                        alt={item.title}
                        controls
                        onError={(e) => {
                          console.error(
                            "Video load error for:",
                            item.title,
                            "URL:",
                            e.target.src
                          );
                          // Create a placeholder div for failed videos
                          const placeholder = document.createElement("div");
                          placeholder.className = "media-placeholder";
                          placeholder.innerHTML = `<div style="display: flex; align-items: center; justify-content: center; height: 100%; background: #f1f5f9; color: #64748b;">Video not available</div>`;
                          e.target.parentNode.replaceChild(
                            placeholder,
                            e.target
                          );
                        }}
                      />
                    ) : (
                      <img
                        src={
                          item.image.startsWith("http")
                            ? item.image
                            : `${BASE_URL}${item.image}`
                        }
                        alt={item.title}
                        onError={(e) => {
                          console.error(
                            "Image load error for:",
                            item.title,
                            "URL:",
                            e.target.src
                          );
                          // Try alternative URL formats
                          const originalSrc = e.target.src;
                          if (!originalSrc.includes("/images/")) {
                            // Try with /images/ prefix (alternative static route)
                            const imagePath = item.image.replace(
                              "/uploads/",
                              ""
                            );
                            e.target.src = `${BASE_URL}/images/${imagePath}`;
                          } else {
                            // Final fallback to placeholder
                            e.target.src =
                              "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIyMCIgdmlld0JveD0iMCAwIDQwMCAyMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMjIwIiBmaWxsPSIjRjFGNUY5Ii8+Cjx0ZXh0IHg9IjIwMCIgeT0iMTEwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjNjQ3NDhCIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTYiPkltYWdlIE5vdCBGb3VuZDwvdGV4dD4KPC9zdmc+";
                          }
                        }}
                        onLoad={() => {
                          console.log(
                            "Image loaded successfully for:",
                            item.title
                          );
                        }}
                      />
                    )}
                    <div className="portfolio-display-overlay">
                      <div className="portfolio-display-actions">
                        {item.websiteUrl && (
                          <button
                            className="portfolio-display-action"
                            onClick={() =>
                              window.open(item.websiteUrl, "_blank")
                            }
                          >
                            <ExternalLink size={16} />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="portfolio-display-content">
                    <h3 className="portfolio-display-title">{item.title}</h3>
                    <p className="portfolio-display-description">
                      {item.description}
                    </p>
                    <div className="portfolio-display-tags">
                      {item.tags.slice(0, 3).map((tag, index) => (
                        <span key={index} className="portfolio-display-tag">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="portfolio-display-client">
                      <span className="portfolio-display-client-label">
                        Client:
                      </span>{" "}
                      {item.client}
                    </div>
                  </div>
                </div>
              ))}

              <div
                className="portfolio-display-view-all"
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: "smooth" });
                  navigate("/portfolio");
                }}
              >
                <div className="portfolio-display-view-all-content">
                  <ArrowRight size={24} />
                  <h3>View All Projects</h3>
                  <p>Explore our complete portfolio</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Header;
