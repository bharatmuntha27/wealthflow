import React, { useState } from "react";
import Layout from "../components/Layout/Layout";

import {
  FaWallet,
  FaUniversity,
  FaMoneyBillWave,
  FaShieldAlt,
  FaBolt,
  FaArrowCircleDown,
  FaCreditCard,
} from "react-icons/fa";

import "./Withdraw.css";

function Withdraw() {
  const [amount, setAmount] = useState("");
  const [withdrawMethod, setWithdrawMethod] =
    useState("BANK");
  const [loading, setLoading] = useState(false);

  const walletBalance = 25000;

  const quickAmounts = [
    500,
    1000,
    5000,
    10000,
    20000,
  ];

  const handleWithdraw = async () => {
    if (!amount) {
      return alert(
        "Please enter withdrawal amount"
      );
    }

    if (Number(amount) < 500) {
      return alert(
        "Minimum withdrawal is ₹500"
      );
    }

    if (Number(amount) > walletBalance) {
      return alert(
        "Insufficient wallet balance"
      );
    }

    try {
      setLoading(true);

      // API Call Here

      setTimeout(() => {
        alert(
          "Withdrawal request submitted successfully"
        );
      }, 1000);

    } catch (error) {
      alert(
        error.response?.data?.message ||
        "Withdrawal Failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>

      <div className="withdraw-page">

        <div className="withdraw-container">

          {/* LEFT */}

          <div className="withdraw-card">

            <div className="withdraw-header">

              <div className="withdraw-icon">
                <FaArrowCircleDown />
              </div>

              <div>
                <h1>Withdraw Funds</h1>
                <p>
                  Transfer money securely
                  to your bank account
                </p>
              </div>

            </div>

            {/* Balance */}

            <div className="balance-card">

              <div className="balance-top">
                <FaWallet />
                <span>
                  Available Balance
                </span>
              </div>

              <h2>
                ₹
                {walletBalance.toLocaleString()}
              </h2>

              <p>
                Ready for withdrawal
              </p>

            </div>

            {/* Rules */}

            <div className="withdraw-rules">

              <div className="rule-box">
                <label>
                  Minimum
                </label>
                <strong>₹500</strong>
              </div>

              <div className="rule-box">
                <label>
                  Processing
                </label>
                <strong>
                  Instant
                </strong>
              </div>

            </div>

            {/* Amount */}

            <div className="form-group">

              <label>
                Withdrawal Amount
              </label>

              <input
                type="number"
                placeholder="Enter Amount"
                value={amount}
                onChange={(e) =>
                  setAmount(
                    e.target.value
                  )
                }
              />

            </div>

            {/* Quick Amount */}

            <div className="quick-amounts">

              {quickAmounts.map(
                (amt) => (

                  <button
                    key={amt}
                    className={`amount-btn ${
                      Number(amount) === amt
                        ? "active"
                        : ""
                    }`}
                    onClick={() =>
                      setAmount(amt)
                    }
                  >
                    ₹
                    {amt.toLocaleString()}
                  </button>

                )
              )}

            </div>

            {/* Method */}

            <div className="withdraw-methods">

              <h3>
                Withdrawal Method
              </h3>

              <div className="method-list">

                <div
                  className={`method-card ${
                    withdrawMethod ===
                    "BANK"
                      ? "selected"
                      : ""
                  }`}
                  onClick={() =>
                    setWithdrawMethod(
                      "BANK"
                    )
                  }
                >
                  <FaUniversity />
                  <span>
                    Bank Account
                  </span>
                </div>

                <div
                  className={`method-card ${
                    withdrawMethod ===
                    "UPI"
                      ? "selected"
                      : ""
                  }`}
                  onClick={() =>
                    setWithdrawMethod(
                      "UPI"
                    )
                  }
                >
                  <FaCreditCard />
                  <span>
                    UPI Transfer
                  </span>
                </div>

              </div>

            </div>

            {/* Bank Details */}

            <div className="account-card">

              <h4>
                Withdrawal Account
              </h4>

              <p>
                <strong>
                  Account Holder:
                </strong>
                {" "}
                Jeevitha
              </p>

              <p>
                <strong>
                  Bank:
                </strong>
                {" "}
                HDFC Bank
              </p>

              <p>
                <strong>
                  Account:
                </strong>
                {" "}
                ****5678
              </p>

            </div>

            <button
              className="withdraw-btn"
              onClick={
                handleWithdraw
              }
              disabled={loading}
            >
              {loading
                ? "Processing..."
                : `Withdraw ₹${amount || 0}`}
            </button>

          </div>

          {/* RIGHT */}

          <div className="withdraw-info">

            <div className="info-card">

              <FaShieldAlt />

              <h3>
                Secure Withdrawals
              </h3>

              <p>
                Protected by
                multi-layer security.
              </p>

            </div>

            <div className="info-card">

              <FaBolt />

              <h3>
                Fast Processing
              </h3>

              <p>
                Withdrawals processed
                within 24 hours.
              </p>

            </div>

            <div className="summary-card">

              <h3>
                Withdrawal Summary
              </h3>

              <div className="summary-row">
                <span>
                  Amount
                </span>
                <strong>
                  ₹{amount || 0}
                </strong>
              </div>

              <div className="summary-row">
                <span>
                  Fee
                </span>
                <strong>
                  ₹0
                </strong>
              </div>

              <div className="summary-row">
                <span>
                  Method
                </span>
                <strong>
                  {withdrawMethod}
                </strong>
              </div>

              <div className="summary-row total">
                <span>
                  Total
                </span>
                <strong>
                  ₹{amount || 0}
                </strong>
              </div>

            </div>

          </div>

        </div>

      </div>

    </Layout>
  );
}

export default Withdraw;