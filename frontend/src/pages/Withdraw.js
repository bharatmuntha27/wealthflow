import React, { useState, useEffect } from "react";
import api from "../api/axios";
import Layout from "../components/Layout/Layout";
import {
  FaWallet,
  FaMoneyBillWave,
  FaUniversity,
  FaUser,
  FaCalendarAlt,
  FaHistory
} from "react-icons/fa";
import "./Withdraw.css";

function Withdraw() {
  const [amount, setAmount] = useState("");
  const [accountName, setAccountName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [ifscCode, setIfscCode] = useState("");
  
  const [walletBalance, setWalletBalance] = useState(0);
  const [minWithdrawal, setMinWithdrawal] = useState(100);
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadData = async () => {
    try {
      setFetching(true);
      await Promise.all([
        fetchWalletAndLimits(),
        fetchWithdrawals()
      ]);
    } catch (error) {
      console.error(error);
    } finally {
      setFetching(false);
    }
  };

  const fetchWalletAndLimits = async () => {
    try {
      const res = await api.get("/wallet");
      setWalletBalance(res.data.data.walletBalance);

      // Load settings to fetch minimum withdrawal limit
      const settingsRes = await api.get("/admin/settings"); // Note: users may not access /admin/settings directly, let's fallback to 100 if it errors
      if (settingsRes.data?.settings) {
        setMinWithdrawal(settingsRes.data.settings.minWithdrawal);
      }
    } catch (error) {
      // In case /admin/settings is blocked, keep default minWithdrawal of 100
      console.log("Could not load dynamic withdrawal settings, using default limit.");
    }
  };

  const fetchWithdrawals = async () => {
    try {
      const res = await api.get("/withdraw/my");
      setWithdrawals(res.data.withdrawals || []);
    } catch (error) {
      console.error(error);
    }
  };

  const handleWithdraw = async (e) => {
    e.preventDefault();

    if (!amount || Number(amount) <= 0) {
      alert("Please enter a valid withdrawal amount");
      return;
    }

    if (Number(amount) < minWithdrawal) {
      alert(`Minimum withdrawal amount is ₹${minWithdrawal}`);
      return;
    }

    if (Number(amount) > walletBalance) {
      alert("Insufficient wallet balance");
      return;
    }

    if (!accountName || !accountNumber || !ifscCode) {
      alert("Please enter all bank account details");
      return;
    }

    try {
      setLoading(true);
      const res = await api.post("/withdraw/request", {
        amount: Number(amount),
        accountName,
        accountNumber,
        ifscCode
      });

      alert(res.data.message || "Withdrawal request submitted successfully!");
      setAmount("");
      
      // Reload page data
      await loadData();
    } catch (error) {
      alert(error.response?.data?.message || "Withdrawal request failed");
    } finally {
      setLoading(false);
    }
  };

  const quickAmounts = [500, 1000, 2000, 5000, 10000];

  if (fetching) {
    return (
      <Layout>
        <div className="withdraw-loader">
          <h2>Loading Withdrawal Portal...</h2>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="withdraw-page">
        <div className="withdraw-container">
          
          {/* LEFT: FORM */}
          <div className="withdraw-form-card">
            <div className="withdraw-header">
              <div className="withdraw-icon">
                <FaWallet />
              </div>
              <div>
                <h1>Withdraw Funds</h1>
                <p>Transfer earnings to your bank account</p>
              </div>
            </div>

            {/* BALANCE DISPLAY */}
            <div className="balance-card-withdraw">
              <div className="balance-top">
                <FaMoneyBillWave />
                <span>Available Wallet Balance</span>
              </div>
              <h2>₹{walletBalance.toLocaleString("en-IN")}</h2>
              <p>Minimum withdrawal limit: ₹{minWithdrawal}</p>
            </div>

            <form onSubmit={handleWithdraw} className="withdraw-form">
              <div className="form-group">
                <label>Withdrawal Amount (₹)</label>
                <input
                  type="number"
                  placeholder={`Min ₹${minWithdrawal}`}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
              </div>

              {/* QUICK BUTTONS */}
              <div className="quick-amounts">
                {quickAmounts.map((amt) => (
                  <button
                    type="button"
                    key={amt}
                    className={`amount-btn ${Number(amount) === amt ? "active" : ""}`}
                    onClick={() => setAmount(amt)}
                  >
                    ₹{amt.toLocaleString()}
                  </button>
                ))}
              </div>

              <h3 className="bank-section-title"><FaUniversity /> Bank Account Details</h3>

              <div className="form-group">
                <label>Account Holder Name</label>
                <div className="input-with-icon">
                  <FaUser className="field-icon" />
                  <input
                    type="text"
                    placeholder="Enter Full Name"
                    value={accountName}
                    onChange={(e) => setAccountName(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Account Number</label>
                <div className="input-with-icon">
                  <FaUniversity className="field-icon" />
                  <input
                    type="text"
                    placeholder="Enter Account Number"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>IFSC Code</label>
                <div className="input-with-icon">
                  <FaUniversity className="field-icon" />
                  <input
                    type="text"
                    placeholder="Enter IFSC (e.g. HDFC0001234)"
                    value={ifscCode}
                    onChange={(e) => setIfscCode(e.target.value.toUpperCase())}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="withdraw-submit-btn"
                disabled={loading}
              >
                {loading ? "Submitting..." : `Withdraw ₹${Number(amount || 0).toLocaleString()}`}
              </button>
            </form>
          </div>

          {/* RIGHT: HISTORY */}
          <div className="withdraw-history-card">
            <div className="history-header">
              <h2><FaHistory /> Withdrawal History</h2>
            </div>
            
            <div className="history-table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Amount</th>
                    <th>Bank Details</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {withdrawals.length > 0 ? (
                    withdrawals.map((item) => (
                      <tr key={item._id}>
                        <td>
                          <div className="date-cell">
                            <FaCalendarAlt />
                            <span>{new Date(item.createdAt).toLocaleDateString("en-IN")}</span>
                          </div>
                        </td>
                        <td className="amount-cell">₹{item.amount.toLocaleString()}</td>
                        <td>
                          <div className="bank-info-cell">
                            <strong>{item.accountName}</strong>
                            <span>A/C: {item.accountNumber}</span>
                            <span>IFSC: {item.ifscCode}</span>
                          </div>
                        </td>
                        <td>
                          <span className={`status-badge ${item.status.toLowerCase()}`}>
                            {item.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="no-data">
                        No withdrawal requests found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </Layout>
  );
}

export default Withdraw;
