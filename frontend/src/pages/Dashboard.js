import React, { useEffect, useState } from "react";
import api from "../api/axios";
import "./Dashboard.css";
import Layout from "../components/Layout/Layout";

import {
  FaPiggyBank,
  FaWallet,
  FaChartLine,
  FaUsers
} from "react-icons/fa";

function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    getDashboard();
  }, []);

  const getDashboard = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await api.get( "/dashboard",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setData(res.data.data);
    } catch (error) {
      console.log(error);

      alert(
        error.response?.data?.message ||
        "Unable to load dashboard"
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="dashboard-page">
          <h2>Loading Dashboard...</h2>
        </div>
      </Layout>
    );
  }
      
  return (
    <Layout>
      <div className="dashboard-page">

        <div className="dashboard-header">
          <div>
            <h1>Dashboard Overview</h1>

            <p className="welcome">
              Welcome back, {user?.fullName || "User"} 👋
            </p>
          </div>

         
        </div>

        <div className="cards">

          <div className="card investment-card">
            <div className="icon blue">
              <FaPiggyBank />
            </div>

            <div>
              <p>Total Investments</p>

              <h2>
                ₹
                {Number(
                  data?.totalInvestments || 0
                ).toLocaleString()}
              </h2>

              <span>Total amount invested</span>
            </div>
          </div>

          <div className="card wallet-card">
            <div className="icon green">
              <FaWallet />
            </div>

            <div>
              <p>Wallet Balance</p>

              <h2>
                ₹
                {Number(
                  data?.walletBalance || 0
                ).toLocaleString()}
              </h2>

              <span>Available balance</span>
            </div>
          </div>

          <div className="card roi-card">
            <div className="icon orange">
              <FaChartLine />
            </div>

            <div>
              <p>Total ROI Earned</p>

              <h2>
                ₹
                {Number(
                  data?.totalROIEarned || 0
                ).toLocaleString()}
              </h2>

              <span>Total ROI earnings</span>
            </div>
          </div>

          <div className="card referral-card">
            <div className="icon purple">
              <FaUsers />
            </div>

            <div>
              <p>Total Referral Income</p>

              <h2>
                ₹
                {Number(
                  data?.totalLevelIncomeEarned || 0
                ).toLocaleString()}
              </h2>

              <span>Total referral income</span>
            </div>
          </div>

        </div>

        <div className="tables">

          <div className="panel">

            <h3>Recent Investments</h3>

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

                      <td>{item.planName}</td>

                      <td>
                        ₹
                        {Number(
                          item.investmentAmount
                        ).toLocaleString()}
                      </td>

                      <td>
                        {item.dailyROI}%
                      </td>

                      <td>
                        <span className="badge">
                          {item.status}
                        </span>
                      </td>

                    </tr>

                  ))

                ) : (

                  <tr>
                    <td
                      colSpan="4"
                      style={{
                        textAlign: "center",
                        padding: "25px"
                      }}
                    >
                      No Investments Found
                    </td>
                  </tr>

                )}

              </tbody>

            </table>

          </div>

        </div>

      </div>
    </Layout>
  );
}

export default Dashboard;
