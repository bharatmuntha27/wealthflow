import React, { useState, useEffect } from "react";
import api from "../api/axios";
import Layout from "../components/Layout/Layout";

import {
  FaWallet,
  FaMoneyBillWave,
  FaUniversity,
  FaCreditCard,
} from "react-icons/fa";

import "./Deposit.css";

function Deposit() {
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("UPI");
  const [utrNumber, setUtrNumber] = useState("");
  const [paymentProof, setPaymentProof] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const [walletBalance, setWalletBalance] = useState(0);
  const [settings, setSettings] = useState({
    minDeposit: 500,
    maxDeposit: 500000,
    adminUpiId: "wealthflow@upi",
    adminBankName: "HDFC Bank",
    adminBankAccountHolder: "WealthFlow Pvt Ltd",
    adminBankAccountNumber: "123456789012",
    adminBankIfsc: "HDFC0001234",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const walletRes = await api.get("/wallet");
      setWalletBalance(walletRes.data.data.walletBalance);

      const settingsRes = await api.get("/deposits/settings");
      if (settingsRes.data?.settings) {
        setSettings(settingsRes.data.settings);
      }
    } catch (error) {
      console.error("Could not fetch deposit settings:", error);
    }
  };

  const quickAmounts = [500, 1000, 5000, 10000, 25000];

  const handleDeposit = async () => {
    const numAmount = Number(amount);
    if (!amount || numAmount < settings.minDeposit) {
      alert(`Minimum deposit amount is ₹${settings.minDeposit}`);
      return;
    }

    if (numAmount > settings.maxDeposit) {
      alert(`Maximum deposit amount is ₹${settings.maxDeposit}`);
      return;
    }

    if (!utrNumber) {
      alert("Please enter UTR Number");
      return;
    }

    if (!paymentProof) {
      alert("Please upload payment proof");
      return;
    }

    try {
      setLoading(true);

      // Convert file to base64
      const reader = new FileReader();
      reader.readAsDataURL(paymentProof);
      reader.onloadend = async () => {
        const base64Proof = reader.result;

        try {
          const response = await api.post("/deposits/request", {
            amount: numAmount,
            utrNumber,
            paymentMethod,
            paymentProof: base64Proof,
          });

          alert(response.data.message || "Deposit request submitted successfully!");
          
          // Reset form
          setAmount("");
          setUtrNumber("");
          setPaymentProof(null);
          setCurrentStep(1);
          
          // Refresh wallet
          fetchData();
        } catch (err) {
          alert(err.response?.data?.message || "Deposit request failed");
        } finally {
          setLoading(false);
        }
      };
    } catch (error) {
      alert("Error reading payment proof file");
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="deposit-page">
        <div className="deposit-container">
          {/* LEFT SIDE */}
          <div className="deposit-card">
            {/* Progress Bar */}
            <div className="stepper">
              <div className={`step ${currentStep >= 1 ? "active" : ""}`}>1</div>
              <div className={`step ${currentStep >= 2 ? "active" : ""}`}>2</div>
              <div className={`step ${currentStep >= 3 ? "active" : ""}`}>3</div>
            </div>

            <div className="deposit-header">
              <div className="deposit-icon">
                <FaWallet />
              </div>
              <div>
                <h1>Deposit Funds</h1>
                <p>Securely add money to your wallet</p>
              </div>
            </div>

            {/* WALLET BALANCE */}
            <div className="balance-card">
              <div className="balance-top">
                <FaMoneyBillWave />
                <span>Available Balance</span>
              </div>
              <h2>₹{walletBalance.toLocaleString("en-IN")}</h2>
              <p>Last updated just now</p>
            </div>

            {/* RULES */}
            <div className="deposit-rules">
              <div className="rule-box">
                <label>Minimum Deposit</label>
                <strong>₹{settings.minDeposit.toLocaleString()}</strong>
              </div>
              <div className="rule-box">
                <label>Maximum Deposit</label>
                <strong>₹{settings.maxDeposit.toLocaleString()}</strong>
              </div>
            </div>

            {/* AMOUNT */}
            <div className="form-group">
              <label>Deposit Amount (₹)</label>
              <input
                type="number"
                placeholder="Enter Deposit Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>

            {/* QUICK BUTTONS */}
            <div className="quick-amounts">
              {quickAmounts.map((amt) => (
                <button
                  key={amt}
                  className={`amount-btn ${Number(amount) === amt ? "active" : ""}`}
                  onClick={() => setAmount(amt)}
                >
                  ₹{amt.toLocaleString()}
                </button>
              ))}
            </div>

            {/* PAYMENT METHODS */}
            <div className="payment-methods">
              <h3>Select Payment Method</h3>
              <div className="method-list">
                <div
                  className={`method-card ${paymentMethod === "UPI" ? "selected" : ""}`}
                  onClick={() => {
                    setPaymentMethod("UPI");
                    setCurrentStep(2);
                  }}
                >
                  <FaCreditCard />
                  <span>UPI Payment</span>
                </div>

                <div
                  className={`method-card ${paymentMethod === "BANK" ? "selected" : ""}`}
                  onClick={() => {
                    setPaymentMethod("BANK");
                    setCurrentStep(2);
                  }}
                >
                  <FaUniversity />
                  <span>Net Banking</span>
                </div>
              </div>
            </div>

            {currentStep === 2 && paymentMethod === "UPI" && (
              <div className="payment-details-card">
                <h3>Scan & Pay</h3>
                <img
                  src="/qr-code.png"
                  alt="QR Code"
                  className="qr-image"
                  onError={(e) => {
                    // Fallback if qr-code image doesn't exist
                    e.target.style.display = 'none';
                  }}
                />
                <div className="upi-details">
                  <p><strong>UPI ID</strong></p>
                  <h4>{settings.adminUpiId}</h4>
                </div>
                <button className="next-btn" onClick={() => setCurrentStep(3)}>
                  I Have Paid
                </button>
              </div>
            )}

            {currentStep === 2 && paymentMethod === "BANK" && (
              <div className="payment-details-card">
                <h3>Bank Transfer Details</h3>
                <div className="bank-details" style={{ marginTop: "15px" }}>
                  <p><strong>Bank:</strong> {settings.adminBankName}</p>
                  <p><strong>Account Name:</strong> {settings.adminBankAccountHolder}</p>
                  <p><strong>Account No:</strong> {settings.adminBankAccountNumber}</p>
                  <p><strong>IFSC:</strong> {settings.adminBankIfsc}</p>
                  <button
                    className="next-btn"
                    onClick={() => setCurrentStep(3)}
                    style={{ marginTop: "15px", width: "100%" }}
                  >
                    I Have Transferred
                  </button>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="payment-proof-card">
                <h3>Payment Verification</h3>
                <div className="form-group">
                  <label>UTR Number / Transaction ID</label>
                  <input
                    type="text"
                    placeholder="Enter 12-digit UTR Number"
                    value={utrNumber}
                    onChange={(e) => setUtrNumber(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>Upload Payment Proof (Screenshot)</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setPaymentProof(e.target.files[0])}
                  />
                </div>

                <button
                  className="deposit-submit-btn"
                  onClick={handleDeposit}
                  disabled={loading}
                  style={{ width: "100%", marginTop: "15px" }}
                >
                  {loading ? "Processing..." : `Submit Deposit of ₹${Number(amount || 0).toLocaleString()}`}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Deposit;