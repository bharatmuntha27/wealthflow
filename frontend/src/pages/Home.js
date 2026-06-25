import React from "react";
import { Link } from "react-router-dom";
import "./Home.css";

import logo from "../assets/WealthFlow.png";

function Home() {
  return (
    <div className="home">

      {/* Navbar */}
  <header className="navbar">

    <div className="container">

        <div className="logo">

            <img src={logo} alt="WealthFlow" />

            <span>WealthFlow</span>

        </div>

        <ul className="menu">

            <li><a href="/">Home</a></li>

            <li><a href="/about">About</a></li>

            <li><a href="/services">Services</a></li>

            <li><a href="/contact">Contact</a></li>

        </ul>

        <div className="buttons">

            <Link to="/login" className="login">
                Login
            </Link>

            <Link to="/register" className="register">
                Get Started
            </Link>

        </div>

    </div>

</header>

      {/* Hero Section */}

      <section className="hero" id="home">

        <div className="hero-left">

          <span className="tag">
            SMART INVESTMENT PLATFORM
          </span>

          <h1>
            Grow Your Wealth
            <br />
            With Smart Investments
          </h1>

          <p>
            Invest securely, monitor your portfolio,
            earn daily ROI and grow your financial future
            with WealthFlow.
          </p>

          <div className="hero-buttons">

            <Link to="/register" className="start-btn">
              Start Investing
            </Link>

            <Link to="/about" className="learn-btn">
              Learn More
            </Link>

          </div>

        </div>

        <div className="hero-right">

          <div className="dashboard-card">

            <h3>Total Balance</h3>

            <h1>₹2,48,500</h1>

            <p>+12.45% This Month</p>

          </div>

          <div className="small-card">

            <h4>Daily ROI</h4>

            <h2>₹1,250</h2>

          </div>

          <div className="small-card">

            <h4>Total Investments</h4>

            <h2>₹5,00,000</h2>

          </div>

        </div>

      </section>

    </div>
  );
}

export default Home;