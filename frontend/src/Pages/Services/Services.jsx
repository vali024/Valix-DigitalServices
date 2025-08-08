import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Code,
  Palette,
  Video,
  Share2,
  ArrowRight,
  CheckCircle,
  Globe,
  Smartphone,
  ShoppingCart,
  Database,
  FileImage,
  Gift,
  Play,
  TrendingUp,
  Zap,
  Target,
  Clock,
  Star,
  Users,
  Layers,
  MessageCircle,
} from "lucide-react";
import "./Services.css";

const Services = () => {
  const [activeService, setActiveService] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const services = [
    {
      icon: Code,
      title: "Web & Mobile Development",
      shortTitle: "Development",
      description:
        "Custom websites and mobile applications built with cutting-edge technologies to drive your business forward.",
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-50",
      services: [
        {
          icon: Globe,
          name: "Static Websites",
          description:
            "Lightning-fast, SEO-optimized websites perfect for businesses, portfolios, and landing pages",
          features: [
            "Responsive Design",
            "SEO Optimization",
            "Fast Loading (< 2s)",
            "Cross-browser Compatible",
            "Mobile-first Approach",
          ],
          price: "Starting at ₹9,999",
          deliveryTime: "3-5 days",
        },
        {
          icon: Database,
          name: "Dynamic Websites",
          description:
            "Interactive websites with admin panels, user management, and database integration",
          features: [
            "Admin Dashboard",
            "User Management",
            "Content Management System",
            "Database Integration",
            "API Development",
          ],
          price: "Starting at ₹19,999",
          deliveryTime: "7-14 days",
        },
        {
          icon: ShoppingCart,
          name: "E-commerce Solutions",
          description:
            "Complete online stores with payment gateways, inventory management, and analytics",
          features: [
            "Payment Integration",
            "Inventory Management",
            "Order Tracking",
            "Customer Portal",
            "Analytics Dashboard",
          ],
          price: "Starting at ₹29,999",
          deliveryTime: "14-21 days",
        },
        {
          icon: Smartphone,
          name: "Mobile Applications",
          description:
            "Native iOS and Android apps with modern UI/UX design and cloud integration",
          features: [
            "iOS & Android",
            "Push Notifications",
            "Offline Support",
            "App Store Deployment",
            "Cloud Integration",
          ],
          price: "Starting at ₹49,999",
          deliveryTime: "21-30 days",
        },
      ],
      cta: "Get Development Quote",
      stats: { projects: "20+", clients: "15+", rating: "4.7" },
    },
    {
      icon: Palette,
      title: "Graphic Design",
      shortTitle: "Design",
      description:
        "Creative designs that make your brand stand out and communicate your message effectively across all platforms.",
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-50",
      services: [
        {
          icon: FileImage,
          name: "Event Posters & Banners",
          description:
            "Eye-catching posters and banners for events, promotions, and marketing campaigns",
          features: [
            "Print & Digital Ready",
            "Multiple Formats",
            "Unlimited Revisions",
            "Source Files Included",
            "Brand Guidelines",
          ],
          price: "Starting at ₹499",
          deliveryTime: "24-48 hours",
        },
        {
          icon: Target,
          name: "Business Branding",
          description:
            "Complete brand identity including logos, business cards, and letterheads",
          features: [
            "Logo Design",
            "Business Cards",
            "Letterheads",
            "Brand Guidelines",
            "Social Media Kit",
          ],
          price: "Starting at ₹2,999",
          deliveryTime: "3-5 days",
        },
        {
          icon: Gift,
          name: "Wedding Designs",
          description:
            "Beautiful wedding invitations, save-the-dates, and celebration graphics",
          features: [
            "Custom Illustrations",
            "Animation Options",
            "Print & Digital",
            "RSVP Integration",
            "Multiple Concepts",
          ],
          price: "Starting at ₹1,999",
          deliveryTime: "2-4 days",
        },
        {
          icon: Play,
          name: "Digital Advertisements",
          description:
            "Engaging animated graphics and static ads for social media and web advertising",
          features: [
            "Social Media Optimized",
            "Web Banners",
            "Logo Animations",
            "Interactive Elements",
            "A/B Test Variants",
          ],
          price: "Starting at ₹799",
          deliveryTime: "1-2 days",
        },
      ],
      cta: "View Design Portfolio",
      stats: { projects: "50+", clients: "30+", rating: "4.5" },
    },
    {
      icon: Video,
      title: "Video Editing",
      shortTitle: "Video",
      description:
        "Professional video editing services for all your content creation needs, from social media to cinematic productions.",
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-green-50",
      services: [
        {
          icon: Play,
          name: "Social Media Content",
          description:
            "Engaging short-form content optimized for Instagram, YouTube Shorts, and TikTok",
          features: [
            "Trend-based Editing",
            "Music Sync",
            "Text Animations",
            "Platform Optimization",
            "Viral Elements",
          ],
          price: "Starting at ₹299",
          deliveryTime: "24 hours",
        },
        {
          icon: Gift,
          name: "Wedding Cinematography",
          description:
            "Cinematic wedding videos that capture your special moments with artistic flair",
          features: [
            "Highlight Reels",
            "Full Ceremonies",
            "Drone Footage Edit",
            "Color Grading",
            "Music Licensing",
          ],
          price: "Starting at ₹4,999",
          deliveryTime: "5-7 days",
        },
        {
          icon: TrendingUp,
          name: "YouTube Content",
          description:
            "Professional editing for YouTube creators with engaging cuts and custom graphics",
          features: [
            "Intro/Outro Creation",
            "Thumbnail Design",
            "SEO Optimization",
            "Engaging Cuts",
            "Brand Integration",
          ],
          price: "Starting at ₹999",
          deliveryTime: "2-3 days",
        },
        {
          icon: Video,
          name: "Corporate Videos",
          description:
            "Professional corporate videos, testimonials, and promotional content",
          features: [
            "Script Writing",
            "Professional Editing",
            "Motion Graphics",
            "Voice-over Integration",
            "Brand Alignment",
          ],
          price: "Starting at ₹2,999",
          deliveryTime: "3-5 days",
        },
      ],
      cta: "Send Your Footage",
      stats: { projects: "100+", clients: "40+", rating: "4.8" },
    },
    {
      icon: Share2,
      title: "Social Media Management",
      shortTitle: "Social Media",
      description:
        "Complete social media management to grow your online presence, engagement, and convert followers into customers.",
      color: "from-orange-500 to-red-500",
      bgColor: "bg-orange-50",
      services: [
        {
          icon: Share2,
          name: "Multi-Platform Management",
          description:
            "Instagram, Facebook, LinkedIn, and WhatsApp Business management with unified strategy",
          features: [
            "Content Calendar",
            "Platform Optimization",
            "Cross-posting Strategy",
            "Audience Analysis",
            "Competitor Tracking",
          ],
          price: "Starting at ₹9,999/month",
          deliveryTime: "Ongoing",
        },
        {
          icon: FileImage,
          name: "Content Creation",
          description:
            "Original content creation including graphics, videos, reels, and engaging copywriting",
          features: [
            "Visual Content",
            "Copywriting",
            "Hashtag Strategy",
            "Brand Consistency",
            "Trend Integration",
          ],
          price: "Starting at ₹4,999/month",
          deliveryTime: "Daily posts",
        },
        {
          icon: TrendingUp,
          name: "Growth Strategy",
          description:
            "Data-driven strategies to increase followers, engagement, and conversion rates",
          features: [
            "Competitor Analysis",
            "Audience Insights",
            "Growth Hacking",
            "Influencer Outreach",
            "Paid Ads Management",
          ],
          price: "Starting at ₹14,999/month",
          deliveryTime: "Monthly strategy",
        },
        {
          icon: Database,
          name: "Analytics & Reporting",
          description:
            "Detailed monthly reports with insights, ROI tracking, and strategy recommendations",
          features: [
            "Performance Metrics",
            "ROI Tracking",
            "Growth Analysis",
            "Strategy Adjustments",
            "Competitor Benchmarking",
          ],
          price: "Included in packages",
          deliveryTime: "Monthly reports",
        },
      ],
      cta: "Book Strategy Call",
      stats: { accounts: "10+", growth: "30%", clients: "8+" },
    },
  ];

  const whyChooseUs = [
    {
      icon: Target,
      title: "India-Focused Solutions",
      description:
        "We understand the Indian market, customer behavior, and pricing expectations.",
    },
    {
      icon: Clock,
      title: "Quick Turnaround",
      description:
        "Fast delivery without compromising on quality. Most projects completed within a week.",
    },
    {
      icon: Users,
      title: "Dedicated Support",
      description:
        "24/7 support in Hindi and English. We're always here to help you succeed.",
    },
    {
      icon: Star,
      title: "Proven Results",
      description:
        "Over 1000+ successful projects with 4.8+ average rating from satisfied clients.",
    },
  ];

  return (
    <div className="services-page">
      {/* Hero Section */}
      <section className="shero-section">
        <div className="shero-background"></div>
        <div className="container">
          <div className={`shero-content ${isVisible ? "animate-in" : ""}`}>
            <div className="shero-badge">
              <Zap className="badge-icon" />
              <span>Complete Digital Solutions</span>
            </div>
            <h1 className="shero-title">
              <span className="gradient-text">Digital Services</span>
              <br />
              for Indian Businesses
            </h1>
            <p className="shero-description">
              From stunning websites to viral social media content - we provide
              everything your business needs to thrive online at affordable
              prices.
            </p>
            <div className="shero-stats">
              <div className="stat">
                <span className="stat-number">100+</span>
                <span className="stat-label">Projects Completed</span>
              </div>
              <div className="stat">
                <span className="stat-number">50+</span>
                <span className="stat-label">Happy Clients</span>
              </div>
              <div className="stat">
                <span className="stat-number">4.4</span>
                <span className="stat-label">Average Rating</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Navigation */}
      <section className="services-nav">
        <div className="container">
          <div className="nav-buttons">
            {services.map((service, index) => (
              <button
                key={index}
                onClick={() => setActiveService(index)}
                className={`nav-button ${
                  activeService === index ? "active" : ""
                }`}
              >
                <service.icon className="nav-icon" />
                <span className="nav-text">{service.shortTitle}</span>
                <span className="nav-full-text">{service.title}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Active Service Details */}
      <section className="service-details">
        <div className="container">
          {services.map(
            (service, index) =>
              activeService === index && (
                <div key={index} className="service-content">
                  {/* Service Header */}
                  <div className="service-header">
                    <div className={`service-icon-wrapper ${service.bgColor}`}>
                      <service.icon className="service-main-icon" />
                    </div>
                    <h2 className="service-title1">{service.title}</h2>
                    <p className="service-description1">
                      {service.description}
                    </p>

                    {/* Service Stats */}
                    <div className="service-stats">
                      {Object.entries(service.stats).map(([key, value]) => (
                        <div key={key} className="service-stat">
                          <span className="stat-value">{value}</span>
                          <span className="stat-key">{key}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="service-cards">
                    {service.services.map((subService, subIndex) => (
                      <div key={subIndex} className="service-card">
                        <div className="card-header">
                          <div
                            className={`card-icon bg-gradient-to-r ${service.color}`}
                          >
                            <subService.icon className="card-icon-svg" />
                          </div>
                          <div className="card-title-section">
                            <h3 className="card-title">{subService.name}</h3>
                          </div>
                        </div>

                        <p className="card-description">
                          {subService.description}
                        </p>

                        <div className="card-features">
                          {subService.features.map((feature, featureIndex) => (
                            <div key={featureIndex} className="feature-item">
                              <CheckCircle className="feature-check" />
                              <span className="feature-text">{feature}</span>
                            </div>
                          ))}
                        </div>

                        <Link to="/contact" className="card-cta">
                          Get Quote
                          <ArrowRight className="cta-arrow" />
                        </Link>
                      </div>
                    ))}
                  </div>

                  {/* Service CTA */}
                  <div className="service-cta">
                    <Link
                      to="/contact"
                      className={`cta-button bg-gradient-to-r ${service.color}`}
                    >
                      <span>{service.cta}</span>
                      <ArrowRight className="cta-icon" />
                    </Link>
                  </div>
                </div>
              )
          )}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="why-choose-us">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Why Choose Valix?</h2>
            <p className="section-description">
              We're not just another digital agency. We're your growth partners
              who understand the Indian market.
            </p>
          </div>

          <div className="features-grid">
            {whyChooseUs.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">
                  <feature.icon className="feature-icon-svg" />
                </div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="process-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Our Simple Process</h2>
            <p className="section-description">
              From consultation to delivery - we make it easy for you
            </p>
          </div>

          <div className="process-steps">
            {[
              {
                step: "01",
                title: "Free Consultation",
                description:
                  "We discuss your needs, goals, and budget in detail",
                icon: MessageCircle,
              },
              {
                step: "02",
                title: "Custom Planning",
                description:
                  "We create a tailored strategy and timeline for your project",
                icon: Layers, // Changed from Target to Layers
              },
              {
                step: "03",
                title: "Expert Creation",
                description:
                  "Our team brings your vision to life with regular updates",
                icon: Zap, // Changed from Layers to Zap for more energy
              },
              {
                step: "04",
                title: "Delivery & Support",
                description: "We deliver on time and provide ongoing support",
                icon: CheckCircle, // Changed from Clock to CheckCircle
              },
            ].map((process, index) => (
              <div key={index} className="process-step">
                <div className="step-number">{process.step}</div>
                <div className="step-icon">
                  <process.icon className="step-icon-svg" />
                </div>
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
          <h2>Ready to Get Started?</h2>
          <p>
            Let's discuss your project and create something amazing together.
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
    </div>
  );
};

export default Services;
