import React from "react";
import { Link } from "react-router-dom";
import {
  Zap,
  MessageCircle,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
} from "lucide-react";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer-container">
      <div className="footer-content-wrapper">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="brand-header">
              <div className="brand-icon-container">
                <Zap className="brand-icon" />
              </div>
              <span className="brand-name">Valix Digital</span>
            </div>
            <p className="brand-description">
              Your one-stop agency for everything digital — fast, affordable &
              high quality. We build stunning websites, mobile apps, designs &
              edits.
            </p>
            <div className="social-links">
              <a
                href="https://www.facebook.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="social-link facebook"
              >
                <Facebook className="social-icon" />
              </a>
              <a
                href="https://www.instagram.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="social-link instagram"
              >
                <Instagram className="social-icon" />
              </a>
              <a
                href="https://www.linkedin.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="social-link linkedin"
              >
                <Linkedin className="social-icon" />
              </a>
              <a
                href="https://twitter.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="social-link twitter"
              >
                <Twitter className="social-icon" />
              </a>
            </div>
          </div>

          <div className="footer-links">
            <h3 className="footer-heading">Quick Links</h3>
            <ul className="footer-nav-list">
              {[
                { name: "Home", path: "/" },
                { name: "Services", path: "/services" },
                { name: "Portfolio", path: "/portfolio" },
                { name: "Products", path: "/shop" },
                { name: "Contact", path: "/contact" },
              ].map((item) => (
                <li key={item.name} className="footer-nav-item">
                  <Link to={item.path} className="footer-nav-link">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-services">
            <h3 className="footer-heading">Services</h3>
            <ul className="footer-nav-list">
              {[
                { name: "Web Development", path: "/services#web-development" },
                { name: "Mobile Apps", path: "/services#mobile-apps" },
                { name: "Graphic Design", path: "/services#graphic-design" },
                { name: "Video Editing", path: "/services#video-editing" },
                { name: "Social Media", path: "/services#social-media" },
              ].map((service) => (
                <li key={service.name} className="footer-nav-item">
                  <Link to={service.path} className="footer-nav-link">
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-contact">
            <h3 className="footer-heading">Contact Info</h3>
            <div className="contact-details">
              <div className="contact-item">
                <Phone className="contact-icon" />
                <a href="tel:+918919825034" className="contact-text">
                  +91 8919825034
                </a>
              </div>
              <div className="contact-item">
                <Mail className="contact-icon" />
                <a
                  href="mailto:lovelyboyarun91@gmail.com"
                  className="contact-text"
                >
                  lovelyboyarun91@gmail.com
                </a>
              </div>
              <div className="contact-item">
                <MapPin className="contact-icon" />
                <span className="contact-text"> Bengaluru, India</span>
              </div>
              <a
                href="https://wa.me/+918919825034"
                target="_blank"
                rel="noopener noreferrer"
                className="whatsapp-button"
              >
                <MessageCircle className="whatsapp-icon" />
                <span>WhatsApp Us</span>
              </a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="copyright-text">
            © {new Date().getFullYear()} Valix Digital. All rights reserved.
            Built with passion for digital excellence.
          </p>
          <div className="footer-terms-links">
            <Link to="/terms" className="terms-link">
              Terms of Service
            </Link>
            <span className="terms-separator">|</span>
            <Link to="/privacy" className="terms-link">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
