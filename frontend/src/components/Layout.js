import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./Layout.css";

function Layout({ children }) {
  const navigate = useNavigate();

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="app-layout">

      <aside className="app-sidebar">

        <div className="app-brand">

          <img
            src="/WealthFlow.png"
            alt="WealthFlow"
          />

          <h2>
            Wealth<span>Flow</span>
          </h2>

        </div>

        <nav className="sidebar-nav">
<NavLink to="/dashboard">
  🏠 Dashboard
</NavLink>

          <NavLink to="/investments">
            📈 Investments
          </NavLink>

          <NavLink to="/referrals">
            👥 Referrals
          </NavLink>

          <NavLink to="/referral-income">
            💰 Referral Income
          </NavLink>

          <NavLink to="/wallet">
            💼 Wallet
          </NavLink>

          <NavLink to="/profile">
            👤 Profile
          </NavLink>

          <button
            className="logout-btn"
            onClick={logout}
          >
            🚪 Logout
          </button>

        </nav>

      </aside>

      <main className="app-main">

        <header className="app-topbar">

          <div className="app-user">

            <div className="app-avatar">

              {user?.fullName
                ? user.fullName.charAt(0).toUpperCase()
                : "U"}

            </div>

            <div>

              <h4>
                {user?.fullName || "User"}
              </h4>

              <p>Active Member</p>

            </div>

          </div>

        </header>

        <section className="app-content">
          {children}
        </section>

      </main>

    </div>
  );
}

export default Layout;