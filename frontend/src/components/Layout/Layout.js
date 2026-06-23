import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

import {
  FaTachometerAlt,
  FaChartLine,
  FaUsers,
  FaWallet,
  FaUserCircle,
  FaSignOutAlt,
  FaMoneyBillWave,
  FaBars,
  FaTimes,
    FaArrowDown,
  FaArrowUp,
} from "react-icons/fa";

import "./Layout.css";

function Layout({ children }) {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  let user = {};

  try {
    user =
      JSON.parse(localStorage.getItem("user")) ||
      {};
  } catch {
    user = {};
  }

  const handleLogout = () => {
    localStorage.clear();

    navigate("/login", {
      replace: true,
    });
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const menuItems = [
    {
      path: "/dashboard",
      name: "Dashboard",
      icon: <FaTachometerAlt />,
    },
    {
      path: "/investments",
      name: "Investments",
      icon: <FaChartLine />,
    },
    {
      path: "/deposit",
      name: "Deposit",
      icon: <FaArrowDown />,
    },
    {
      path: "/withdraw",
      name: "Withdraw",
      icon: <FaArrowUp />,
    },
    {
      path: "/wallet",
      name: "Wallet",
      icon: <FaWallet />,
    },
    {
      path: "/referrals",
      name: "Referrals",
      icon: <FaUsers />,
    },
    {
      path: "/referral-income",
      name: "Referral Income",
      icon: <FaMoneyBillWave />,
    },
       {
      path: "/profile",
      name: "Profile",
      icon: <FaUserCircle />,
    },
      ];

  return (
    <div className="layout-container">

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={closeSidebar}
        />
      )}

      {/* Mobile Toggle */}
      <button
        className="mobile-menu-btn"
        onClick={() =>
          setSidebarOpen(!sidebarOpen)
        }
      >
        {sidebarOpen ? (
          <FaTimes />
        ) : (
          <FaBars />
        )}
      </button>

      {/* Sidebar */}
      <aside
        className={`sidebar ${
          sidebarOpen ? "open" : ""
        }`}
      >
        <div className="sidebar-top">

          <div className="brand-section">
            <img
              src="/WealthFlow.png"
              alt="WealthFlow"
              className="brand-logo"
            />

            <h2>
              Wealth<span>Flow</span>
            </h2>
          </div>

          <nav className="nav-links">
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={closeSidebar}
              >
                {item.icon}
                <span>{item.name}</span>
              </NavLink>
            ))}
          </nav>

        </div>

        {/* Footer */}
        <div className="sidebar-footer">
          <button
            className="logout-btn"
            onClick={handleLogout}
          >
            <FaSignOutAlt />
            Logout
          </button>
        </div>

      </aside>

      {/* Main Area */}
      <main className="main-content">

        <header className="topbar">

                 <div className="topbar-right">

            <div className="user-profile">

              <div className="avatar">
                {user?.fullName
                  ?.charAt(0)
                  ?.toUpperCase() || "U"}
              </div>

              <div>
                <h4>
                  {user?.fullName ||
                    "User"}
                </h4>

                <p>
                  Active Member
                </p>
              </div>

            </div>

          </div>

        </header>

        <section className="page-content">
          {children}
        </section>

      </main>

    </div>
  );
}

export default Layout;