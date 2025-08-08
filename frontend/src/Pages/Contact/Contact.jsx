import React, { useState, useEffect } from "react";
import {
  Send,
  MessageCircle,
  Mail,
  Phone,
  MapPin,
  Upload,
  Check,
  Clock,
  Headphones,
  Award,
  Info,
  Zap,
  X,
  Eye,
  Download,
  AlertCircle,
  CheckCircle,
  XCircle,
  Play,
  FileText,
  Image as ImageIcon,
  Video,
  File,
} from "lucide-react";
import "./Contact.css";

// Toast Component
const Toast = ({ message, type, isVisible, onClose }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  const getToastIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircle className="toast-icon" />;
      case "error":
        return <XCircle className="toast-icon" />;
      case "warning":
        return <AlertCircle className="toast-icon" />;
      default:
        return <Info className="toast-icon" />;
    }
  };

  return (
    <div className={`toast toast-${type} ${isVisible ? "toast-show" : ""}`}>
      {getToastIcon()}
      <span className="toast-message">{message}</span>
      <button className="toast-close" onClick={onClose}>
        <X size={16} />
      </button>
    </div>
  );
};

// File Preview Component
const FilePreview = ({ file, onRemove, index }) => {
  const [preview, setPreview] = useState(null);
  const isImage = file.type.startsWith("image/");
  const isVideo = file.type.startsWith("video/");
  const isPDF = file.type === "application/pdf";

  useEffect(() => {
    if (isImage || isVideo) {
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [file, isImage, isVideo]);

  const getFileIcon = () => {
    if (isImage) return <ImageIcon className="file-icon" />;
    if (isVideo) return <Video className="file-icon" />;
    if (isPDF) return <FileText className="file-icon" />;
    return <File className="file-icon" />;
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="file-preview-item">
      <div className="file-preview-content">
        {isImage && preview && (
          <div className="file-preview-thumbnail">
            <img src={preview} alt={file.name} />
          </div>
        )}
        {isVideo && preview && (
          <div className="file-preview-thumbnail video-thumbnail">
            <video src={preview} />
            <div className="video-play-overlay">
              <Play size={20} />
            </div>
          </div>
        )}
        <div className="file-preview-info">
          {getFileIcon()}
          <div className="file-details">
            <span className="file-name">{file.name}</span>
            <span className="file-size">{formatFileSize(file.size)}</span>
          </div>
        </div>
      </div>
      <div className="file-preview-actions">
        {(isImage || isVideo) && preview && (
          <button
            type="button"
            className="file-action-btn preview-btn"
            onClick={() => window.open(preview, "_blank")}
          >
            <Eye size={16} />
          </button>
        )}
        <button
          type="button"
          className="file-action-btn remove-btn"
          onClick={() => onRemove(index)}
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    budget: "",
    message: "",
    files: [],
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedServicePricing, setSelectedServicePricing] = useState(null);
  const [errors, setErrors] = useState({});
  const [isDragOver, setIsDragOver] = useState(false);
  const [toast, setToast] = useState({
    isVisible: false,
    message: "",
    type: "",
  });
  const [isAnimating, setIsAnimating] = useState(false);

  // Service configuration with pricing
  const servicesConfig = {
    "Web Development": {
      name: "Web Development",
      options: [
        {
          type: "Static Website",
          price: "₹3,000 - ₹8,000",
          description: "3-5 pages, no backend",
        },
        {
          type: "Dynamic Website",
          price: "₹8,000 - ₹25,000",
          description: "Admin panel, forms, dashboard",
        },
        {
          type: "E-commerce Site",
          price: "₹10,000 - ₹35,000",
          description: "Shopify or WordPress WooCommerce",
        },
      ],
    },
    "Mobile App Development": {
      name: "Mobile App Development",
      options: [
        {
          type: "Basic Hybrid App",
          price: "₹25,000 - ₹1,00,000",
          description: "Flutter/React Native",
        },
        {
          type: "Advanced Mobile App",
          price: "₹1,00,000 - ₹3,00,000",
          description: "Custom features, API integration",
        },
      ],
    },
    "Graphic Design": {
      name: "Graphic Design",
      options: [
        {
          type: "Poster/Flyer",
          price: "₹200 - ₹500",
          description: "Per design, quality & delivery speed dependent",
        },
        {
          type: "Wedding Invitation",
          price: "₹300 - ₹2,000",
          description: "Static ₹300-₹800, Animated ₹800-₹2,000",
        },
        {
          type: "Business Card Design",
          price: "₹200 - ₹500",
          description: "Print-ready designs",
        },
        {
          type: "Animated Social Post/GIF",
          price: "₹300 - ₹1,200",
          description: "Trend-based, boosts sales",
        },
      ],
    },
    "Video Editing": {
      name: "Video Editing",
      options: [
        {
          type: "Reels/Shorts Edit",
          price: "₹300 - ₹800",
          description: "Music sync, effects, transitions",
        },
        {
          type: "Wedding Video Highlights",
          price: "₹2,000 - ₹8,000",
          description: "Cinematic, transitions, storytelling",
        },
        {
          type: "YouTube Full Edit",
          price: "₹800 - ₹2,000",
          description: "Sometimes includes thumbnail",
        },
      ],
    },
    "Social Media Management": {
      name: "Social Media Management",
      options: [
        {
          type: "Basic Handling",
          price: "₹2,000 - ₹4,000/month",
          description: "3 posts/week, 1 platform",
        },
        {
          type: "Premium Handling",
          price: "₹7,000 - ₹15,000/month",
          description: "Daily posts, multi-platform, design + engagement",
        },
        {
          type: "WhatsApp Catalog Setup",
          price: "₹500 - ₹2,000",
          description: "Product links, descriptions, images",
        },
      ],
    },
    "Complete Package": {
      name: "Complete Package",
      options: [
        {
          type: "Start-up Launch Pack",
          price: "₹8,500 - ₹9,000",
          description: "Website + 5 Posters + Insta Handling",
        },
        {
          type: "Wedding Digital Pack",
          price: "₹2,500 - ₹3,000",
          description: "Animated Invite + Photo Edits + Video Reel",
        },
        {
          type: "Instagram Creator Pack",
          price: "₹8,000 - ₹9,500",
          description: "5 Reels + 10 Posters + Monthly Handling",
        },
      ],
    },
  };

  const services = Object.keys(servicesConfig).concat(["Other"]);

  // Dynamic budget ranges based on selected service
  const getDynamicBudgetRanges = (selectedService) => {
    if (!selectedService || selectedService === "Other") {
      return [
        "Under ₹5,000",
        "₹5,000 - ₹15,000",
        "₹15,000 - ₹50,000",
        "₹50,000 - ₹1,00,000",
        "₹1,00,000+",
        "Let's Discuss",
      ];
    }

    const serviceConfig = servicesConfig[selectedService];
    if (!serviceConfig) return [];

    // Extract price ranges from service options
    const ranges = serviceConfig.options.map((option) => option.price);
    return [...new Set(ranges)].concat(["Let's Discuss"]);
  };

  const budgetRanges = getDynamicBudgetRanges(formData.service);

  // Update pricing info when service changes
  useEffect(() => {
    if (formData.service && servicesConfig[formData.service]) {
      setSelectedServicePricing(servicesConfig[formData.service]);
    } else {
      setSelectedServicePricing(null);
    }
    // Reset budget when service changes
    if (formData.service) {
      setFormData((prev) => ({ ...prev, budget: "" }));
    }
  }, [formData.service]);

  // Toast helper functions
  const showToast = (message, type = "info") => {
    setToast({ isVisible: true, message, type });
  };

  const hideToast = () => {
    setToast({ isVisible: false, message: "", type: "" });
  };

  // Form validation
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Full name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (formData.phone && formData.phone.length < 10) {
      newErrors.phone = "Phone number must be at least 10 digits";
    }

    if (!formData.service) {
      newErrors.service = "Please select a service";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Project description is required";
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Description must be at least 10 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Enhanced file handling with drag and drop
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    processFiles(files);
  };

  const processFiles = (files) => {
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "video/mp4",
      "video/avi",
      "video/mov",
      "video/wmv",
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    const maxSize = 50 * 1024 * 1024; // 50MB for videos, 10MB for others
    const maxFiles = 5;

    const validFiles = [];
    const errors = [];

    if (formData.files.length + files.length > maxFiles) {
      showToast(`Maximum ${maxFiles} files allowed`, "warning");
      return;
    }

    files.forEach((file) => {
      if (!allowedTypes.includes(file.type)) {
        errors.push(`${file.name}: File type not supported`);
        return;
      }

      const sizeLimit = file.type.startsWith("video/")
        ? maxSize
        : 10 * 1024 * 1024;
      if (file.size > sizeLimit) {
        const limit = file.type.startsWith("video/") ? "50MB" : "10MB";
        errors.push(`${file.name}: File size exceeds ${limit} limit`);
        return;
      }

      validFiles.push(file);
    });

    if (errors.length > 0) {
      showToast(errors.join(", "), "error");
    }

    if (validFiles.length > 0) {
      setFormData((prev) => ({
        ...prev,
        files: [...prev.files, ...validFiles],
      }));
      showToast(`${validFiles.length} file(s) added successfully`, "success");
    }
  };

  const removeFile = (index) => {
    setFormData((prev) => ({
      ...prev,
      files: prev.files.filter((_, i) => i !== index),
    }));
    showToast("File removed", "info");
  };

  // Drag and drop handlers
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    processFiles(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      showToast("Please fill in all required fields correctly", "error");
      return;
    }

    setIsLoading(true);
    setIsAnimating(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("phone", formData.phone);
      formDataToSend.append("service", formData.service);
      formDataToSend.append("budget", formData.budget);
      formDataToSend.append("message", formData.message);

      if (formData.files && formData.files.length > 0) {
        formData.files.forEach((file) => {
          formDataToSend.append("files", file);
        });
      }

      const response = await fetch("http://localhost:4000/api/contact/submit", {
        method: "POST",
        body: formDataToSend,
      });

      const result = await response.json();

      if (response.ok) {
        showToast(
          "Project request sent successfully! We'll get back to you within 24 hours.",
          "success"
        );
        setIsSubmitted(true);

        // Reset form after 5 seconds
        setTimeout(() => {
          setIsSubmitted(false);
          setFormData({
            name: "",
            email: "",
            phone: "",
            service: "",
            budget: "",
            message: "",
            files: [],
          });
          setErrors({});
        }, 5000);
      } else {
        console.error("Server response error:", result);
        showToast(
          result.message || "Failed to submit form. Please try again.",
          "error"
        );
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      showToast(
        `Network error: ${error.message}. Please check your connection and try again.`,
        "error"
      );
    } finally {
      setIsLoading(false);
      setIsAnimating(false);
    }
  };

  const contactMethods = [
    {
      icon: MessageCircle,
      title: "WhatsApp",
      description: "Get instant response on WhatsApp",
      value: "+91 8919825034",
      action: "Chat Now",
      color: "from-green-500 to-green-600",
      href: "https://wa.me/+918919825034",
    },
    {
      icon: Mail,
      title: "Email",
      description: "Send us a detailed message",
      value: "lovelyboyarun91@gmail.com",
      action: "Send Email",
      color: "from-blue-500 to-blue-600",
      href: "mailto:lovelyboyarun91@gmail.com",
    },
    {
      icon: Phone,
      title: "Phone",
      description: "Speak directly with our team",
      value: "+91 8919825034",
      action: "Call Now",
      color: "from-purple-500 to-purple-600",
      href: "tel:+918919825034",
    },
  ];

  const benefits = [
    {
      icon: Clock,
      title: "Quick Response",
      description: "We respond within 2 hours during business hours",
    },
    {
      icon: Award,
      title: "Expert Team",
      description: "Work with experienced professionals",
    },
    {
      icon: Headphones,
      title: "Dedicated Support",
      description: "24/7 support throughout your project",
    },
  ];

  return (
    <div className="contact-page-root">
      {/* Toast Notification */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />

      {/* Hero Section with Project Details Form */}
      <section className="contact-page-root__hero-section">
        <div className="contact-page-root__container">
          <div className="contact-page-root__hero-content">
            <div className="contact-page-root__hero-badge">
              <Zap className="badge-icon" />
              <span>Get In Touch Today</span>
            </div>
            <h1 className="contact-page-root__hero-title">
              Give your <span className="gradient-text">Project Details</span>
            </h1>
            <p className="contact-page-root__hero-description">
              Transform your business with our expert digital solutions. Fill
              out the form below and we'll get back to you with a customized
              proposal within 24 hours.
            </p>
          </div>

          {/* Main Contact Form */}
          <div
            className={`contact-page-root__form-container ${
              isAnimating ? "form-animating" : ""
            }`}
          >
            {isSubmitted ? (
              <div className="contact-page-root__success-message animate-in">
                <div className="contact-page-root__success-icon">
                  <Check />
                </div>
                <h3>Thank You!</h3>
                <p>
                  Your project request has been sent successfully. Our team will
                  review your requirements and get back to you within 24 hours
                  with a detailed proposal.
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="contact-page-root__contact-form"
              >
                <div className="contact-page-root__form-row">
                  <div className="contact-page-root__form-group">
                    <label htmlFor="name">Full Name *</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={errors.name ? "error" : ""}
                      required
                      placeholder="Enter your full name"
                    />
                    {errors.name && (
                      <span className="error-message">{errors.name}</span>
                    )}
                  </div>
                  <div className="contact-page-root__form-group">
                    <label htmlFor="email">Email Address *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={errors.email ? "error" : ""}
                      required
                      placeholder="Enter your email address"
                    />
                    {errors.email && (
                      <span className="error-message">{errors.email}</span>
                    )}
                  </div>
                </div>

                <div className="contact-page-root__form-group">
                  <label htmlFor="phone">Phone Number (Optional)</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={errors.phone ? "error" : ""}
                    placeholder="Enter your phone number"
                  />
                  {errors.phone && (
                    <span className="error-message">{errors.phone}</span>
                  )}
                </div>

                <div className="contact-page-root__form-row">
                  <div className="contact-page-root__form-group">
                    <label htmlFor="service">Service Needed *</label>
                    <select
                      id="service"
                      name="service"
                      value={formData.service}
                      onChange={handleInputChange}
                      className={errors.service ? "error" : ""}
                      required
                    >
                      <option value="">Select a service</option>
                      {services.map((service) => (
                        <option key={service} value={service}>
                          {service}
                        </option>
                      ))}
                    </select>
                    {errors.service && (
                      <span className="error-message">{errors.service}</span>
                    )}
                  </div>
                  <div className="contact-page-root__form-group">
                    <label htmlFor="budget">Budget Range</label>
                    <select
                      id="budget"
                      name="budget"
                      value={formData.budget}
                      onChange={handleInputChange}
                    >
                      <option value="">Select budget range</option>
                      {budgetRanges.map((range) => (
                        <option key={range} value={range}>
                          {range}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Service Pricing Information */}
                {selectedServicePricing && (
                  <div className="contact-page-root__pricing-info animate-in">
                    <div className="contact-page-root__pricing-header">
                      <Info className="contact-page-root__pricing-icon" />
                      <h4>Pricing for {selectedServicePricing.name}</h4>
                    </div>
                    <div className="contact-page-root__pricing-options">
                      {selectedServicePricing.options.map((option, index) => (
                        <div
                          key={index}
                          className="contact-page-root__pricing-option"
                        >
                          <div className="contact-page-root__option-header">
                            <span className="contact-page-root__option-type">
                              {option.type}
                            </span>
                            <span className="contact-page-root__option-price">
                              {option.price}
                            </span>
                          </div>
                          <p className="contact-page-root__option-description">
                            {option.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="contact-page-root__form-group">
                  <label htmlFor="message">Project Description *</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    className={errors.message ? "error" : ""}
                    required
                    rows={6}
                    placeholder="Tell us about your project goals, target audience, specific requirements, timeline, and any other details that would help us understand your vision..."
                  />
                  {errors.message && (
                    <span className="error-message">{errors.message}</span>
                  )}
                </div>

                {/* Enhanced File Upload with Drag & Drop */}
                <div className="contact-page-root__form-group">
                  <label htmlFor="files">Upload Files (Optional)</label>
                  <div
                    className={`contact-page-root__file-upload ${
                      isDragOver ? "drag-over" : ""
                    }`}
                    onDragEnter={handleDragEnter}
                    onDragLeave={handleDragLeave}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                  >
                    <Upload className="contact-page-root__upload-icon" />
                    <input
                      type="file"
                      id="files"
                      multiple
                      onChange={handleFileChange}
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif,.mp4,.avi,.mov,.wmv"
                    />
                    <label
                      htmlFor="files"
                      className="contact-page-root__file-label"
                    >
                      <span className="contact-page-root__upload-text">
                        Click to upload or drag and drop
                      </span>
                      <p className="contact-page-root__file-info">
                        Images (JPG, PNG, GIF), Videos (MP4, AVI, MOV),
                        Documents (PDF, DOC)
                        <br />
                        Max 10MB for images/docs, 50MB for videos, 5 files total
                      </p>
                    </label>
                  </div>

                  {/* File Previews */}
                  {formData.files && formData.files.length > 0 && (
                    <div className="contact-page-root__file-previews">
                      <h4>Uploaded Files ({formData.files.length}/5)</h4>
                      <div className="file-preview-grid">
                        {formData.files.map((file, index) => (
                          <FilePreview
                            key={index}
                            file={file}
                            index={index}
                            onRemove={removeFile}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className={`contact-page-root__submit-btn ${
                    isLoading ? "loading" : ""
                  }`}
                >
                  {isLoading ? (
                    <>
                      <div className="contact-page-root__loading-spinner"></div>
                      <span>Sending Request...</span>
                    </>
                  ) : (
                    <>
                      <Send />
                      <span>Send Project Request</span>
                    </>
                  )}
                </button>

                <p className="contact-page-root__form-disclaimer">
                  By submitting this form, you agree to our privacy policy and
                  terms of service. We'll never share your information with
                  third parties.
                </p>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Get in Touch Section */}
      <section className="contact-page-root__contact-section">
        <div className="contact-page-root__container">
          <div className="contact-page-root__section-header">
            <h2>Get in Touch</h2>
            <p>
              Prefer to contact us directly? Choose your preferred method below.
            </p>
          </div>

          <div className="contact-page-root__contact-grid">
            {/* Contact Methods */}
            <div className="contact-page-root__contact-methods">
              {contactMethods.map((method, index) => (
                <div key={index} className="contact-page-root__contact-method">
                  <a
                    href={method.href}
                    target={method.title === "WhatsApp" ? "_blank" : undefined}
                    rel={
                      method.title === "WhatsApp"
                        ? "noopener noreferrer"
                        : undefined
                    }
                    className="contact-page-root__method-link"
                  >
                    <div
                      className={`contact-page-root__method-icon ${method.title.toLowerCase()}`}
                    >
                      <method.icon />
                    </div>
                    <div className="contact-page-root__method-content">
                      <h3>{method.title}</h3>
                      <p className="contact-page-root__method-description">
                        {method.description}
                      </p>
                      <p className="contact-page-root__method-value">
                        {method.value}
                      </p>
                    </div>
                    <div className="contact-page-root__method-action">
                      <span>{method.action}</span>
                    </div>
                  </a>
                </div>
              ))}
            </div>

            {/* Office Information */}
            <div className="contact-page-root__office-info">
              <div className="contact-page-root__office-header">
                <MapPin />
                <h3>Our Office</h3>
              </div>
              <p className="contact-page-root__office-address">
                264, 2nd Cross Rd, Neeladri Nagar, Electronic City Phase I,
                Electronic City, Bengaluru,
                <br />
                Karnataka 560100, India
              </p>
              <div className="contact-page-root__office-hours">
                <p>
                  <span className="contact-page-root__hours-label">
                    Business Hours:
                  </span>
                  <br />
                  Monday - Friday: 9:00 AM - 6:00 PM IST
                  <br />
                  Saturday: 10:00 AM - 4:00 PM IST
                  <br />
                  Sunday: Closed
                </p>
                <p className="contact-page-root__emergency-support">
                  Emergency support available 24/7 for ongoing projects
                </p>
              </div>
            </div>
          </div>

          {/* Benefits Grid */}
          <div className="contact-page-root__benefits-grid">
            {benefits.map((benefit, index) => (
              <div key={index} className="contact-page-root__benefit-item">
                <benefit.icon className="contact-page-root__benefit-icon" />
                <div className="contact-page-root__benefit-content">
                  <h4>{benefit.title}</h4>
                  <p>{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="contact-page-root__cta-section">
        <div className="contact-page-root__cta-container">
          <h2>Ready to Transform Your Business?</h2>
          <p>
            Join hundreds of successful businesses that chose Valix Digital for
            their digital transformation journey.
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

export default Contact;
