import React, { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../components/Layout";
import "./Investments.css";

function Investments() {
  const [investments, setInvestments] = useState([]);

  useEffect(() => {
    getInvestments();
  }, []);

  const getInvestments = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get("http://localhost:5000/api/investments/my", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setInvestments(res.data.investments);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to fetch investments");
    }
  };

  return (
    <Layout>
      <div className="investments-page">
        <h1>My Investments</h1>

        <div className="investment-table-card">
          <table>
            <thead>
              <tr>
                <th>Plan Name</th>
                <th>Amount</th>
                <th>Daily ROI</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {investments.map((item) => (
                <tr key={item._id}>
                  <td>{item.planName}</td>
                  <td>₹{item.investmentAmount}</td>
                  <td>{item.dailyROI}%</td>
                  <td>{new Date(item.startDate).toLocaleDateString()}</td>
                  <td>{new Date(item.endDate).toLocaleDateString()}</td>
                  <td>
                    <span className={`status ${item.status.toLowerCase()}`}>
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {investments.length === 0 && (
            <p className="empty-text">No investments found</p>
          )}
        </div>
      </div>
    </Layout>
  );
}

export default Investments;