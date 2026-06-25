import React from "react";
import { Link } from "react-router-dom";
import "./Home.css";
import logo from "../assets/WealthFlow.png";
import {  FaFacebookF,  FaInstagram,  FaLinkedinIn,  FaYoutube,} from "react-icons/fa";

function Home() {
  return (
    <div className="home">
      {/* ================= NAVBAR ================= */}
      <header className="navbar">
        <div className="container">
          <div className="logo">
            <img src={logo} alt="WealthFlow" />
           <h2>    Wealth<span>Flow</span></h2>
          </div>
          <ul className="menu">
            <li><a href="#home">Home</a></li>
            <li><a href="#about">About</a></li>
            <li><a href="#services">Services</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
          <div className="buttons">
            <Link to="/login" className="login">Login</Link>
            <Link to="/register" className="register">Get Started</Link>
          </div>
        </div>
      </header>
      {/* ================= HERO ================= */}
      <section className="hero" id="home">
        <div className="hero-left">
          <span className="tag">SMART INVESTMENT PLATFORM</span>
          <h1>
            Grow Your Wealth
            <br />
            With Smart
            <br />
            Investments
          </h1>
          <p>
            WealthFlow helps you invest smarter with secure plans,
            daily ROI, transparent earnings, and a powerful dashboard
            to monitor your financial growth.
          </p>
          <div className="hero-buttons">
            <Link to="/register" className="start-btn">
              Start Investing
            </Link>
            <a href="#about" className="learn-btn">
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
      {/* ================= ABOUT ================= */}
      <section className="about-section" id="about">
        <div className="about-image">
          <div className="investment-card">
            <div className="circle"></div>
            <h3>Why WealthFlow?</h3>
            <p>
              Secure, transparent and growth-focused investment
              solutions for everyone.
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
            WealthFlow is a modern investment platform built for
           individuals who want secure investments, consistent
            returns and complete transparency.
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
          <Link to="/register" className="start-btn">
            Join WealthFlow
          </Link>
        </div>
      </section>
      {/* ================= SERVICES ================= */}
      <section className="services-section" id="services">
        <div className="section-title">
          <span className="section-tag">
            OUR SERVICES
          </span>
          <h2>
            Smart Investment Solutions
          </h2>
          <p>
            Everything you need to invest, earn and grow your wealth from one powerful platform.
          </p>
        </div>
        <div className="services-grid">
          <div className="service-card">
            <div className="service-icon">💰</div>
            <h3>Investment Plans</h3>
            <p>
              Choose flexible investment plans designed to generate stable daily returns.
            </p>
          </div>
          <div className="service-card">
            <div className="service-icon">📈</div>
            <h3>Daily ROI</h3>
            <p>
              Earn consistent daily ROI directly into your wallet with complete transparency.
            </p>
          </div>
          <div className="service-card">
            <div className="service-icon">🤝</div>
            <h3>Referral Rewards</h3>
            <p>
              Invite friends and earn attractive referral income through our reward system.
            </p>
          </div>
          <div className="service-card">
            <div className="service-icon">⚡</div>
            <h3>Instant Withdrawals</h3>
            <p>
              Withdraw your earnings quickly through a secure and reliable process.
            </p>
          </div>
        </div>
      </section>
      {/* ================= WHY CHOOSE US ================= */}
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
          <div className="why-card">
            <h3>🔒 Secure Platform</h3>
            <p>
              Enterprise-level security keeps your investments safe at all times.
            </p>
          </div>
          <div className="why-card">
            <h3>📊 Live Dashboard</h3>
            <p>
              Track your investments, ROI and referral income in real time.
            </p>
          </div>
          <div className="why-card">
            <h3>💹 Daily Growth</h3>
            <p>
              Watch your wealth grow every day through our investment plans.
            </p>
          </div>
        </div>
      </section>
      {/* ================= CONTACT ================= */}
      <section className="contact-section" id="contact">
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
            <h3>Contact Information</h3>
            <p><strong>Email:</strong> support@wealthflow.com</p>
            <p><strong>Phone:</strong> +91 98765 43210</p>
            <p><strong>Location:</strong> Hyderabad, India</p>
          </div>
          <form className="contact-form">
            <input
              type="text"
              placeholder="Full Name"
            />
            <input
              type="email"
              placeholder="Email Address"
            />
            <input
              type="text"
              placeholder="Phone Number"
            />
            <textarea
              rows="5"
              placeholder="Your Message"
            ></textarea>
            <button type="submit" className="start-btn">
              Send Message
            </button>
          </form>
        </div>
      </section>
      {/* ================= FOOTER ================= */}

<footer className="footer">

  <div className="footer-container">

    {/* Company */}

    <div className="footer-col">

      <div className="footer-logo">

        <img src={logo} alt="WealthFlow" />
        <h2>WealthFlow</h2>
      </div>
      <p className="footer-text">
        WealthFlow is a secure investment platform helping investors
        build wealth through smart investment plans, daily ROI,
        referral rewards and transparent financial solutions.
      </p>
      <div className="social-icons">
  <a href="https://facebook.com" target="_blank" rel="noreferrer">
    <FaFacebookF />
  </a>
  <a href="https://instagram.com" target="_blank" rel="noreferrer">
    <FaInstagram />
  </a>
  <a href="https://linkedin.com" target="_blank" rel="noreferrer">
    <FaLinkedinIn />
  </a>
  <a href="https://youtube.com" target="_blank" rel="noreferrer">
    <FaYoutube />
  </a>
</div>
    </div>
    {/* Quick Links */}
   <div className="footer-col">
      <h3>Quick Links</h3>
      <ul>
        <li><a href="#home">Home</a></li>
        <li><a href="#about">About</a></li>
        <li><a href="#services">Services</a></li>
        <li><a href="#contact">Contact</a></li>
        <li><Link to="/login">Login</Link></li>
      </ul>
    </div>
    {/* Services */}
    <div className="footer-col">
      <h3>Our Services</h3>
      <ul>
        <li>Investment Plans</li>
        <li>Daily ROI</li>
        <li>Referral Rewards</li>
        <li>Fast Withdrawals</li>
        <li>Portfolio Tracking</li>
      </ul>
    </div>
    {/* Contact */}
    <div className="footer-col">
      <h3>Contact Info</h3>
      <p>📧 support@wealthflow.com</p>
      <p>📞 +91 98765 43210</p>
      <p>📍 Hyderabad, Telangana</p>
      <p>🕒 Mon - Sat : 9:00 AM - 6:00 PM</p>
    </div>
  </div>
  <div className="footer-bottom">
    <p>
      © 2026 WealthFlow. All Rights Reserved.
    </p>
    <div className="footer-bottom-links">
      <a href="/">Privacy Policy</a>
      <a href="/">Terms & Conditions</a>
      <a href="/">Support</a>
    </div>
  </div>
</footer>  
    </div>
  );
}
export default Home;