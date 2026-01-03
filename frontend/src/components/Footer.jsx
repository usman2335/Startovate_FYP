import React from "react";
import { NavLink } from "react-router-dom";
import "../CSS/Footer.css";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import EmailIcon from "@mui/icons-material/Email";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        {/* Company Info Section */}
        <div className="footer-section">
          <h2 className="footer-logo">Startovate</h2>
          <p className="footer-description">
            Streamline your startup journey with Lean Canvas. Create, manage, and
            refine your business plan with guided templates, AI assistance, and
            seamless document export.
          </p>
          <div className="social-links">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon"
              aria-label="Facebook"
            >
              <FacebookIcon />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon"
              aria-label="Twitter"
            >
              <TwitterIcon />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon"
              aria-label="LinkedIn"
            >
              <LinkedInIcon />
            </a>
            <a
              href="mailto:support@startovate.com"
              className="social-icon"
              aria-label="Email"
            >
              <EmailIcon />
            </a>
          </div>
        </div>

        {/* Quick Links Section */}
        <div className="footer-section">
          <h3 className="footer-heading">Quick Links</h3>
          <ul className="footer-links">
            <li>
              <NavLink to="/" className="footer-link">
                Home
              </NavLink>
            </li>
            <li>
              <NavLink to="/Canvas" className="footer-link">
                Canvas
              </NavLink>
            </li>
            <li>
              <NavLink to="/Dashboard" className="footer-link">
                Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink to="/chat" className="footer-link">
                LCI Assistant
              </NavLink>
            </li>
          </ul>
        </div>

        {/* Features Section */}
        <div className="footer-section">
          <h3 className="footer-heading">Features</h3>
          <ul className="footer-links">
            <li>
              <a href="#templates" className="footer-link">
                Templates & Checklists
              </a>
            </li>
            <li>
              <a href="#ai-assistant" className="footer-link">
                AI-Powered Assistant
              </a>
            </li>
            <li>
              <a href="#lms" className="footer-link">
                Learning Management
              </a>
            </li>
            <li>
              <a href="#export" className="footer-link">
                Document Export
              </a>
            </li>
          </ul>
        </div>

        {/* Contact Section */}
        <div className="footer-section">
          <h3 className="footer-heading">Contact Us</h3>
          <ul className="footer-links">
            <li>
              <EmailIcon className="contact-icon" />
              <a href="mailto:support@startovate.com" className="footer-link">
                support@startovate.com
              </a>
            </li>
            <li>
              <p className="footer-text">
                Have questions? We're here to help you succeed.
              </p>
            </li>
          </ul>
        </div>
      </div>

      {/* Copyright Section */}
      <div className="footer-bottom">
        <p className="copyright">
          © {new Date().getFullYear()} Startovate. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;

