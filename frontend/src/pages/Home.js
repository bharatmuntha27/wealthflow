import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
} from "react-icons/fa";

import "./Home.css";
import logo from "../assets/WealthFlow.png";

function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  /* =========================================================
     NAVIGATION DATA
     ========================================================= */

  const navigationItems = [
    { label: "Home", href: "#home" },
    { label: "About", href: "#about" },
    { label: "Services", href: "#services" },
    { label: "Contact", href: "#contact" },
  ];

  /* =========================================================
     SERVICES DATA
     ========================================================= */

  const services = [
    {
      icon: "💰",
      title: "Investment Plans",
      description:
        "Choose flexible investment plans designed to generate stable daily returns.",
    },
    {
      icon: "📈",
      title: "Daily ROI",
      description:
        "Earn consistent daily ROI directly into your wallet with complete transparency.",
    },
    {
      icon: "🤝",
      title: "Referral Rewards",
      description:
        "Invite friends and earn attractive referral income through our reward system.",
    },
    {
      icon: "⚡",
      title: "Instant Withdrawals",
      description:
        "Withdraw your earnings quickly through a secure and reliable process.",
    },
  ];

  /* =========================================================
     WHY CHOOSE US DATA
     ========================================================= */

  const whyChooseUs = [
    {
      icon: "🔒",
      title: "Secure Platform",
      description:
        "Enterprise-level security keeps your investments safe at all times.",
    },
    {
      icon: "📊",
      title: "Live Dashboard",
      description:
        "Track your investments, ROI and referral income in real time.",
    },
    {
      icon: "💹",
      title: "Daily Growth",
      description:
        "Watch your wealth grow every day through our investment plans.",
    },
  ];

  /* =========================================================
     FOOTER DATA
     ========================================================= */

  const footerQuickLinks = [
    { label: "Home", href: "#home" },
    { label: "About", href: "#about" },
    { label: "Services", href: "#services" },
    { label: "Contact", href: "#contact" },
  ];

  const footerServices = [
    "Investment Plans",
    "Daily ROI",
    "Referral Rewards",
    "Fast Withdrawals",
    "Portfolio Tracking",
  ];

  const socialLinks = [
    {
      label: "Facebook",
      href: "https://facebook.com",
      icon: <FaFacebookF />,
    },
    {
      label: "Instagram",
      href: "https://instagram.com",
      icon: <FaInstagram />,
    },
    {
      label: "LinkedIn",
      href: "https://linkedin.com",
      icon: <FaLinkedinIn />,
    },
    {
      label: "YouTube",
      href: "https://youtube.com",
      icon: <FaYoutube />,
    },
  ];

  /* =========================================================
     HANDLERS
     ========================================================= */

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen((previousState) => !previousState);
  };

  const handleContactSubmit = (event) => {
    event.preventDefault();

    // Connect your backend/API here later.
    console.log("Contact form submitted");
  };

  return (
    <div className="home">

      {/* =====================================================
          NAVBAR
          ===================================================== */}

      <header className="navbar">
        <div className="container navbar-container">

          {/* Brand */}
          <Link
            to="/"
            className="logo"
            onClick={closeMobileMenu}
            aria-label="WealthFlow Home"
          >
            <img src={logo} alt="WealthFlow logo" />

            <h2>
              Wealth<span>Flow</span>
            </h2>
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            className="home-menu-toggle"
            onClick={toggleMobileMenu}
            aria-label={
              mobileMenuOpen
                ? "Close navigation menu"
                : "Open navigation menu"
            }
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? "✕" : "☰"}
          </button>

          {/* Navigation */}
          <nav
            className={`menu ${mobileMenuOpen ? "open" : ""}`}
            aria-label="Primary navigation"
          >
            {navigationItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={closeMobileMenu}
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Action Buttons */}
          <div
            className={`buttons ${mobileMenuOpen ? "open" : ""}`}
          >
            <Link
              to="/login"
              className="login"
              onClick={closeMobileMenu}
            >
              Login
            </Link>

            <Link
              to="/register"
              className="register"
              onClick={closeMobileMenu}
            >
              Get Started
            </Link>
          </div>

        </div>
      </header>

      {/* =====================================================
          HERO SECTION
          ===================================================== */}

      <main>

        <section className="hero" id="home">

          <div className="hero-left">

            <span className="tag">
              SMART INVESTMENT PLATFORM
            </span>

            <h1>
              Grow Your Wealth
              <br />
              With Smart
              <br />
              Investments
            </h1>

            <p>
              WealthFlow helps you invest smarter with secure plans,
              daily ROI, transparent earnings, and a powerful
              dashboard to monitor your financial growth.
            </p>

            <div className="hero-buttons">

              <Link
                to="/register"
                className="start-btn"
              >
                Start Investing
              </Link>

              <a
                href="#about"
                className="learn-btn"
              >
                Learn More
              </a>

            </div>

          </div>

          <div className="hero-right">

            <div className="dashboard-card">
              <span>Total Portfolio</span>
              <h2>₹2,48,500</h2>
              <p>+12.45% This Month</p>
            </div>

            <div className="mini-card">
              <h4>Daily ROI</h4>
              <h3>₹1,250</h3>
            </div>

            <div className="mini-card">
              <h4>Total Investments</h4>
              <h3>₹5,00,000</h3>
            </div>

          </div>

        </section>

        {/* ===================================================
            ABOUT SECTION
            =================================================== */}

        <section
          className="about-section"
          id="about"
        >

          <div className="about-image">

            <div className="investment-card">

              <div className="circle"></div>

              <h3>
                Why WealthFlow?
              </h3>

              <p>
                Secure, transparent and growth-focused
                investment solutions for everyone.
              </p>

              <div className="progress-box">

                <div className="progress-header">
                  <span>Investment Growth</span>
                  <span>95%</span>
                </div>

                <div className="progress-bar">
                  <div className="progress-fill"></div>
                </div>

              </div>

            </div>

          </div>

          <div className="about-content">

            <span className="section-tag">
              ABOUT WEALTHFLOW
            </span>

            <h2>
              Building Financial
              <br />
              Freedom For Everyone
            </h2>

            <p>
              WealthFlow is a modern investment platform built
              for individuals who want secure investments,
              consistent returns and complete transparency.
            </p>

            <div className="about-grid">

              <div className="about-box">
                <h3>100%</h3>
                <span>Secure Platform</span>
              </div>

              <div className="about-box">
                <h3>24×7</h3>
                <span>Customer Support</span>
              </div>

              <div className="about-box">
                <h3>Daily</h3>
                <span>ROI Earnings</span>
              </div>

              <div className="about-box">
                <h3>Fast</h3>
                <span>Withdrawals</span>
              </div>

            </div>

            <Link
              to="/register"
              className="start-btn"
            >
              Join WealthFlow
            </Link>

          </div>

        </section>

        {/* ===================================================
            SERVICES SECTION
            =================================================== */}

        <section
          className="services-section"
          id="services"
        >

          <div className="section-title">

            <span className="section-tag">
              OUR SERVICES
            </span>

            <h2>
              Smart Investment Solutions
            </h2>

            <p>
              Everything you need to invest, earn and grow
              your wealth from one powerful platform.
            </p>

          </div>

          <div className="services-grid">

            {services.map((service) => (
              <article
                className="service-card"
                key={service.title}
              >
                <div className="service-icon">
                  {service.icon}
                </div>

                <h3>
                  {service.title}
                </h3>

                <p>
                  {service.description}
                </p>
              </article>
            ))}

          </div>

        </section>

        {/* ===================================================
            WHY CHOOSE US
            =================================================== */}

        <section className="why-section">

          <div className="section-title">

            <span className="section-tag">
              WHY WEALTHFLOW
            </span>

            <h2>
              Why Investors Choose Us
            </h2>

          </div>

          <div className="why-grid">

            {whyChooseUs.map((item) => (
              <article
                className="why-card"
                key={item.title}
              >

                <h3>
                  {item.icon} {item.title}
                </h3>

                <p>
                  {item.description}
                </p>

              </article>
            ))}

          </div>

        </section>

        {/* ===================================================
            CONTACT SECTION
            =================================================== */}

        <section
          className="contact-section"
          id="contact"
        >

          <div className="section-title">

            <span className="section-tag">
              CONTACT US
            </span>

            <h2>
              Let's Grow Together
            </h2>

            <p>
              Have questions? Our team is always ready to help you.
            </p>

          </div>

          <div className="contact-container">

            <div className="contact-info">

              <h3>
                Contact Information
              </h3>

              <p>
                <strong>Email:</strong>{" "}
                support@wealthflow.com
              </p>

              <p>
                <strong>Phone:</strong>{" "}
                +91 98765 43210
              </p>

              <p>
                <strong>Location:</strong>{" "}
                Hyderabad, India
              </p>

            </div>

            <form
              className="contact-form"
              onSubmit={handleContactSubmit}
            >

              <input
                type="text"
                name="name"
                placeholder="Full Name"
                aria-label="Full Name"
                required
              />

              <input
                type="email"
                name="email"
                placeholder="Email Address"
                aria-label="Email Address"
                required
              />

              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                aria-label="Phone Number"
              />

              <textarea
                name="message"
                rows="5"
                placeholder="Your Message"
                aria-label="Your Message"
                required
              />

              <button
                type="submit"
                className="start-btn"
              >
                Send Message
              </button>

            </form>

          </div>

        </section>

      </main>

      {/* =====================================================
          FOOTER
          ===================================================== */}

      <footer className="footer">

        <div className="footer-container">

          {/* Company */}
          <div className="footer-col">

            <div className="footer-logo">

              <img
                src={logo}
                alt="WealthFlow logo"
              />

              <h2>
                WealthFlow
              </h2>

            </div>

            <p className="footer-text">
              WealthFlow is a secure investment platform
              helping investors build wealth through smart
              investment plans, daily ROI, referral rewards
              and transparent financial solutions.
            </p>

            <div className="social-icons">

              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                >
                  {social.icon}
                </a>
              ))}

            </div>

          </div>

          {/* Quick Links */}
          <div className="footer-col">

            <h3>
              Quick Links
            </h3>

            <ul>

              {footerQuickLinks.map((link) => (
                <li key={link.label}>
                  <a href={link.href}>
                    {link.label}
                  </a>
                </li>
              ))}

              <li>
                <Link to="/login">
                  Login
                </Link>
              </li>

            </ul>

          </div>

          {/* Services */}
          <div className="footer-col">

            <h3>
              Our Services
            </h3>

            <ul>

              {footerServices.map((service) => (
                <li key={service}>
                  {service}
                </li>
              ))}

            </ul>

          </div>

          {/* Contact */}
          <div className="footer-col">

            <h3>
              Contact Info
            </h3>

            <p>
              📧 support@wealthflow.com
            </p>

            <p>
              📞 +91 98765 43210
            </p>

            <p>
              📍 Hyderabad, Telangana
            </p>

            <p>
              🕒 Mon - Sat : 9:00 AM - 6:00 PM
            </p>

          </div>

        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">

          <p>
            © 2026 WealthFlow. All Rights Reserved.
          </p>

          <div className="footer-bottom-links">

            <a href="/">
              Privacy Policy
            </a>

            <a href="/">
              Terms & Conditions
            </a>

            <a href="/">
              Support
            </a>

          </div>

        </div>

      </footer>

    </div>
  );
}

export default Home;