import React, { useState } from "react";
import Layout from "../components/Layout";

import {
  FaWallet,
  FaMoneyBillWave,
  FaShieldAlt,
  FaUniversity,
  FaCreditCard,
  FaBolt
} from "react-icons/fa";

import "./Deposit.css";

function Deposit() {

  const [amount, setAmount] = useState("");

  const quickAmounts = [
    500,
    1000,
    5000,
    10000,
    25000
  ];

  const handleDeposit = () => {

    if (!amount || Number(amount) < 500) {
      alert("Minimum deposit amount is ₹500");
      return;
    }

    alert(`Proceeding with ₹${amount}`);

  };

  return (

    <Layout>

      <div className="deposit-page">

        <div className="deposit-container">

          {/* Left Side */}

          <div className="deposit-card">

            <div className="deposit-header">

              <div className="deposit-icon">
                <FaWallet />
              </div>

              <div>
                <h1>Deposit Funds</h1>

                <p>
                  Securely add money to your wallet
                </p>
              </div>

            </div>

            <div className="wallet-balance">

              <FaMoneyBillWave />

              <div>

                <span>Current Wallet Balance</span>

                <h2>₹0.00</h2>

              </div>

            </div>

            <div className="deposit-rules">

              <div>
                <label>Minimum Deposit</label>
                <strong>₹500</strong>
              </div>

              <div>
                <label>Maximum Deposit</label>
                <strong>₹5,00,000</strong>
              </div>

            </div>

            <div className="form-group">

              <label>Deposit Amount</label>

              <input
                type="number"
                placeholder="Enter Deposit Amount"
                value={amount}
                onChange={(e) =>
                  setAmount(e.target.value)
                }
              />

            </div>

            <div className="quick-amounts">

              {quickAmounts.map((amt) => (

                <button
                  key={amt}
                  onClick={() =>
                    setAmount(amt)
                  }
                >
                  ₹{amt}
                </button>

              ))}

            </div>

            <div className="payment-methods">

              <h3>Select Payment Method</h3>

              <div className="method-list">

                <div className="method-card">
                  <FaUniversity />
                  <span>Bank Transfer</span>
                </div>

                <div className="method-card">
                  <FaCreditCard />
                  <span>UPI / Card</span>
                </div>

              </div>

            </div>

            <button
              className="deposit-submit-btn"
              onClick={handleDeposit}
            >
              Continue Payment
            </button>

          </div>

          {/* Right Side */}

          <div className="deposit-info">

            <div className="info-card">

              <FaShieldAlt />

              <h3>100% Secure</h3>

              <p>
                Bank grade encrypted transactions.
              </p>

            </div>

            <div className="info-card">

              <FaBolt />

              <h3>Instant Processing</h3>

              <p>
                Deposits reflect instantly.
              </p>

            </div>

            <div className="summary-card">

              <h3>Deposit Summary</h3>

              <div className="summary-row">
                <span>Deposit Amount</span>
                <strong>
                  ₹{amount || 0}
                </strong>
              </div>

              <div className="summary-row">
                <span>Processing Fee</span>
                <strong>₹0</strong>
              </div>

              <div className="summary-row total">
                <span>Total</span>
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

export default Deposit;