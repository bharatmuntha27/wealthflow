import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {  FaWallet, FaChartLine,  FaUsers,  FaArrowDown,  FaArrowUp,  FaSearch} from "react-icons/fa";

import Layout from "../components/Layout";
import "./Wallet.css";

function Wallet() {

  const navigate = useNavigate();

  const [wallet, setWallet] = useState({
    walletBalance: 0,
    totalROIEarned: 0,
    totalLevelIncomeEarned: 0,
  });

  const [transactions, setTransactions] = useState([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

 useEffect(() => {

  const loadData = async () => {
    try {

      setLoading(true);

      await Promise.all([
        fetchWallet(),
        fetchTransactions(),
      ]);

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);

    }
  };

  loadData();

}, []);

  
  const fetchWallet = async () => {

    try {

      const token =
        localStorage.getItem("token");

      const res =
        await axios.get(
          "http://localhost:5000/api/wallet",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

      setWallet(res.data.data);

    } catch (error) {

      console.log(error);

    }

  };

  const fetchTransactions = async () => {

    try {

      const token =
        localStorage.getItem("token");

      const res =
        await axios.get(
          "http://localhost:5000/api/wallet/history",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

      setTransactions(
        res.data.transactions
      );

    } catch (error) {

      console.log(error);

    }

  };

  const filteredTransactions =
    transactions.filter((item) =>
      item.type
        ?.toLowerCase()
        .includes(search.toLowerCase())
    );

  if (loading) {

    return (
      <Layout>
        <div className="wallet-loader">
          <h2>
            Loading Wallet...
          </h2>
        </div>
      </Layout>
    );

  }

  return (

    <Layout>

      <div className="wallet-page">

        {/* HEADER */}

        <div className="wallet-header">

          <div>

            <h1>My Wallet</h1>

            <p>
              Manage earnings,
              deposits and withdrawals.
            </p>

          </div>

        </div>

        {/* WALLET CARDS */}

        <div className="wallet-cards">

          <div className="wallet-card balance">

            <div className="card-top">

              <div className="wallet-icon">
                <FaWallet />
              </div>

              <span className="badge">
                Available
              </span>

            </div>

            <h4>
              Wallet Balance
            </h4>

            <h2>
              ₹{" "}
              {wallet.walletBalance?.toLocaleString()}
            </h2>

          </div>

          <div className="wallet-card roi">

            <div className="card-top">

              <div className="wallet-icon">
                <FaChartLine />
              </div>

              <span className="badge">
                ROI
              </span>

            </div>

            <h4>
              Total ROI Earned
            </h4>

            <h2>
              ₹{" "}
              {wallet.totalROIEarned?.toLocaleString()}
            </h2>

          </div>

          <div className="wallet-card referral">

            <div className="card-top">

              <div className="wallet-icon">
                <FaUsers />
              </div>

              <span className="badge">
                Team
              </span>

            </div>

            <h4>
              Referral Income
            </h4>

            <h2>
              ₹{" "}
              {wallet.totalLevelIncomeEarned?.toLocaleString()}
            </h2>

          </div>

        </div>

        {/* ACTIONS */}

        <div className="wallet-actions">

          <button
            className="deposit-btn"
            onClick={() =>
              navigate("/deposit")
            }
          >
            <FaArrowDown />
            Deposit Funds
          </button>

          <button
            className="withdraw-btn"
            onClick={() =>
              navigate("/withdraw")
            }
          >
            <FaArrowUp />
            Withdraw Funds
          </button>

        </div>

        {/* HISTORY */}

        <div className="wallet-history">

          <div className="history-header">

            <h2>
              Recent Transactions
            </h2>

            <div className="search-box">

              <FaSearch />

              <input
                type="text"
                placeholder="Search transaction..."
                value={search}
                onChange={(e) =>
                  setSearch(
                    e.target.value
                  )
                }
              />

            </div>

          </div>

          <div className="table-wrapper">

            <table>

              <thead>

                <tr>

                  <th>Date</th>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Generated By</th>
                  <th>Status</th>

                </tr>

              </thead>

              <tbody>

                {filteredTransactions.length >
                0 ? (

                  filteredTransactions.map(
                    (
                      transaction,
                      index
                    ) => (

                      <tr key={index}>

                        <td>

                          {new Date(
                            transaction.date
                          ).toLocaleDateString(
                            "en-IN"
                          )}

                        </td>

                        <td>

                          {transaction.type ===
                          "ROI"
                            ? "ROI Credit"
                            : `Referral Level ${transaction.level}`}

                        </td>

                        <td className="amount">

                          ₹
                          {transaction.amount?.toLocaleString()}

                        </td>

                        <td>

                          {transaction.type ===
                          "Referral"
                            ? transaction.generatedByUser?.fullName
                            : "-"}

                        </td>

                        <td>

                          <span
                            className={`status-badge ${
                              transaction.status ===
                              "Credited"
                                ? "success"
                                : "pending"
                            }`}
                          >

                            {transaction.status ||
                              "Credited"}

                          </span>

                        </td>

                      </tr>

                    )
                  )

                ) : (

                  <tr>

                    <td
                      colSpan="5"
                      className="no-data"
                    >
                      No Transactions Found
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

export default Wallet;