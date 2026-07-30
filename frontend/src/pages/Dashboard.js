import React, { useCallback, useEffect, useState } from "react";
import api from "../api/axios";
import "./Dashboard.css";
import Layout from "../components/Layout/Layout";

import {
  FaPiggyBank,
  FaWallet,
  FaChartLine,
  FaUsers,
  FaArrowUp,
} from "react-icons/fa";

function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const user = JSON.parse(localStorage.getItem("user") || "null");

  /* =========================================================
     FORMAT CURRENCY
     ========================================================= */

  const formatCurrency = (value) => {
    const amount = Number(value) || 0;

    return `₹${amount.toLocaleString("en-IN")}`;
  };

  /* =========================================================
     GET DASHBOARD DATA
     ========================================================= */

  const getDashboard = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Authentication token not found.");
      }

      const response = await api.get("/dashboard", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setData(response.data?.data || {});
    } catch (err) {
      console.error("Dashboard loading error:", err);

      const message =
        err.response?.data?.message ||
        err.message ||
        "Unable to load dashboard.";

      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getDashboard();
  }, [getDashboard]);

  /* =========================================================
     LOADING STATE
     ========================================================= */

  if (loading) {
    return (
      <Layout>
        <div className="dashboard-page">
          <div className="dashboard-loading">
            <div className="loading-spinner"></div>
            <h2>Loading Dashboard...</h2>
            <p>Please wait while we fetch your latest information.</p>
          </div>
        </div>
      </Layout>
    );
  }

  /* =========================================================
     ERROR STATE
     ========================================================= */

  if (error) {
    return (
      <Layout>
        <div className="dashboard-page">
          <div className="dashboard-error">
            <h2>Unable to Load Dashboard</h2>

            <p>{error}</p>

            <button
              type="button"
              className="retry-btn"
              onClick={getDashboard}
            >
              Try Again
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  /* =========================================================
     DASHBOARD CARDS
     ========================================================= */

  const dashboardCards = [
    {
      key: "investments",
      title: "Total Investments",
      value: data?.totalInvestments,
      description: "Total amount invested",
      icon: <FaPiggyBank />,
      className: "investment-card",
    },
    {
      key: "wallet",
      title: "Wallet Balance",
      value: data?.walletBalance,
      description: "Available balance",
      icon: <FaWallet />,
      className: "wallet-card",
    },
    {
      key: "roi",
      title: "Total ROI Earned",
      value: data?.totalROIEarned,
      description: "Total ROI earnings",
      icon: <FaChartLine />,
      className: "roi-card",
    },
    {
      key: "referral",
      title: "Total Referral Income",
      value: data?.totalLevelIncomeEarned,
      description: "Total referral income",
      icon: <FaUsers />,
      className: "referral-card",
    },
  ];

  return (
    <Layout>
      <div className="dashboard-page">

        {/* =====================================================
            DASHBOARD HEADER
            ===================================================== */}

        <header className="dashboard-header">

          <div className="dashboard-heading">

            <span className="dashboard-label">
              WEALTHFLOW
            </span>

            <h1>
              Dashboard Overview
            </h1>

            <p className="welcome">
              Welcome back,{" "}
              <strong>
                {user?.fullName || "User"}
              </strong>{" "}
              👋
            </p>

          </div>

        </header>


        {/* =====================================================
            STAT CARDS
            ===================================================== */}

        <section
          className="cards"
          aria-label="Dashboard statistics"
        >

          {dashboardCards.map((card) => (
            <article
              key={card.key}
              className={`card ${card.className}`}
            >

              {/* Icon */}
              <div className="icon-wrapper">
                <div className="icon">
                  {card.icon}
                </div>
              </div>


              {/* Card Content */}
              <div className="card-content">

                <p className="card-title">
                  {card.title}
                </p>

                <h2 className="card-value">
                  {formatCurrency(card.value)}
                </h2>

                <span className="card-description">
                  {card.description}
                </span>

              </div>

            </article>
          ))}

        </section>


        {/* =====================================================
            RECENT INVESTMENTS
            ===================================================== */}

        <section className="tables">

          <div className="panel">

            <div className="panel-header">

              <div>
                <span className="panel-label">
                  PORTFOLIO
                </span>

                <h3>
                  Recent Investments
                </h3>
              </div>

            </div>


            <div className="table-wrapper">

              <table>

                <thead>
                  <tr>
                    <th>Plan Name</th>
                    <th>Amount</th>
                    <th>Daily ROI</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>

                  {data?.recentInvestments?.length > 0 ? (

                    data.recentInvestments.map((item) => (

                      <tr key={item._id}>

                        <td>
                          <span className="plan-name">
                            {item.planName}
                          </span>
                        </td>

                        <td>
                          <strong>
                            {formatCurrency(
                              item.investmentAmount
                            )}
                          </strong>
                        </td>

                        <td>
                          <span className="roi-value">
                            <FaArrowUp />
                            {item.dailyROI}%
                          </span>
                        </td>

                        <td>
                          <span
                            className={`badge ${String(
                              item.status || ""
                            ).toLowerCase()}`}
                          >
                            {item.status}
                          </span>
                        </td>

                      </tr>

                    ))

                  ) : (

                    <tr>

                      <td
                        colSpan="4"
                        className="empty-state"
                      >
                        <div>
                          <h4>
                            No Investments Found
                          </h4>

                          <p>
                            Your recent investments will
                            appear here.
                          </p>
                        </div>
                      </td>

                    </tr>

                  )}

                </tbody>

              </table>

            </div>

          </div>

        </section>

      </div>
    </Layout>
  );
}

export default Dashboard;