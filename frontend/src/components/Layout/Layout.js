import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

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
  FaHistory,
  FaFileAlt,
  FaCog
} from "react-icons/fa";

import "./Layout.css";

function Layout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
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

  const isAdmin = user?.role === "admin";

  const menuItems = isAdmin
    ? [
        {
          path: "/admin?tab=dashboard",
          name: "Dashboard",
          icon: <FaTachometerAlt />,
        },
        {
          path: "/admin?tab=users",
          name: "Users",
          icon: <FaUsers />,
        },
        {
          path: "/admin?tab=investments",
          name: "Investments",
          icon: <FaChartLine />,
        },
        {
          path: "/admin?tab=deposits",
          name: "Deposits",
          icon: <FaArrowDown />,
        },
        {
          path: "/admin?tab=withdrawals",
          name: "Withdrawals",
          icon: <FaArrowUp />,
        },
        {
          path: "/admin?tab=roi",
          name: "ROI History",
          icon: <FaHistory />,
        },
        {
          path: "/admin?tab=referral",
          name: "Referral Income",
          icon: <FaMoneyBillWave />,
        },
        {
          path: "/admin?tab=wallet",
          name: "Wallet Transactions",
          icon: <FaHistory />,
        },
        {
          path: "/admin?tab=reports",
          name: "Reports",
          icon: <FaFileAlt />,
        },
        {
          path: "/admin?tab=settings",
          name: "Settings",
          icon: <FaCog />,
        },
      ]
    : [
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
            {isAdmin && (
              <div style={{ marginTop: "6px" }}>
                <span className="admin-badge" style={{ display: "inline-block", fontSize: "10px", padding: "3px 8px", backgroundColor: "#dc2626", color: "white", borderRadius: "4px", textTransform: "uppercase", fontWeight: "700", letterSpacing: "1px" }}>Admin Control</span>
              </div>
            )}
          </div>

          <nav className="nav-links">
            {menuItems.map((item) => {
              const currentPath = location.pathname + location.search;
              const isActive = (item.path === "/admin?tab=dashboard" && (currentPath === "/admin" || currentPath === "/admin?tab=dashboard")) || 
                               (item.path === currentPath);

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={isActive ? "active" : ""}
                  onClick={closeSidebar}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </Link>
              );
            })}
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