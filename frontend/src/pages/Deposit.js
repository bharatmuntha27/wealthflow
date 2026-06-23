import React, { useState } from "react";
import Layout from "../components/Layout/Layout";

import {
  FaWallet,
  FaMoneyBillWave,
  // FaShieldAlt,
  FaUniversity,
  FaCreditCard,
  // FaBolt,
} from "react-icons/fa";

import "./Deposit.css";

function Deposit() {
  const [amount, setAmount] = useState("");
const [paymentMethod, setPaymentMethod] = useState("UPI");
const [utrNumber, setUtrNumber] = useState("");
const [paymentProof, setPaymentProof] = useState(null);
const [loading, setLoading] = useState(false);
const [currentStep, setCurrentStep] = useState(1);
const [selectedBank, setSelectedBank] = useState("");

  const walletBalance = 25000;

  const quickAmounts = [
    500,
    1000,
    5000,
    10000,
    25000,
  ];

 const handleDeposit = async () => {

  if (!amount || Number(amount) < 500) {
    alert("Minimum deposit amount is ₹500");
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

    const formData = new FormData();

    formData.append("amount", amount);
    formData.append("utrNumber", utrNumber);
    formData.append("paymentMethod", paymentMethod);
    formData.append("proof", paymentProof);

    // API Call

    alert(
      "Deposit request submitted successfully"
    );

  } catch (error) {

    alert(
      error.response?.data?.message ||
      "Deposit Failed"
    );

  } finally {
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

    <div
      className={`step ${
        currentStep >= 1
          ? "active"
          : ""
      }`}
    >
      1
    </div>

    <div
      className={`step ${
        currentStep >= 2
          ? "active"
          : ""
      }`}
    >
      2
    </div>

    <div
      className={`step ${
        currentStep >= 3
          ? "active"
          : ""
      }`}
    >
      3
    </div>

  </div>

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

            {/* WALLET BALANCE */}

            <div className="balance-card">

              <div className="balance-top">
                <FaMoneyBillWave />
                <span>Available Balance</span>
              </div>

              <h2>
                ₹{walletBalance.toLocaleString()}
              </h2>

              <p>
                Last updated just now
              </p>

            </div>

            {/* RULES */}

            <div className="deposit-rules">

              <div className="rule-box">
                <label>Minimum Deposit</label>
                <strong>₹500</strong>
              </div>

              <div className="rule-box">
                <label>Maximum Deposit</label>
                <strong>₹5,00,000</strong>
              </div>

            </div>

            {/* AMOUNT */}

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

            {/* QUICK BUTTONS */}

            <div className="quick-amounts">

              {quickAmounts.map((amt) => (

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
                  ₹{amt.toLocaleString()}
                </button>

              ))}

            </div>

            {/* PAYMENT METHODS */}

<div className="payment-methods">

  <h3>Select Payment Method</h3>

  <div className="method-list">

    <div
      className={`method-card ${
        paymentMethod === "UPI"
          ? "selected"
          : ""
      }`}
      onClick={() => {
        setPaymentMethod("UPI");
        setCurrentStep(2);
      }}
    >
      <FaCreditCard />
      <span>UPI Payment</span>
    </div>

    <div
      className={`method-card ${
        paymentMethod === "BANK"
          ? "selected"
          : ""
      }`}
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

{currentStep === 2 &&
 paymentMethod === "UPI" && (

<div className="payment-details-card">

  <h3>Scan & Pay</h3>

  <img
    src="/qr-code.png"
    alt="QR Code"
    className="qr-image"
  />

  <div className="upi-details">

    <p>
      <strong>UPI ID</strong>
    </p>

    <h4>wealthflow@upi</h4>

  </div>

  <button
    className="next-btn"
    onClick={() =>
      setCurrentStep(3)
    }
  >
    I Have Paid
  </button>

</div>

)}


{currentStep === 2 &&
 paymentMethod === "BANK" && (

<div className="payment-details-card">

  <h3>Select Your Bank</h3>

  <div className="bank-grid">

    {[
      "HDFC",
      "ICICI",
      "SBI",
      "Axis",
      "Kotak",
      "Canara"
    ].map((bank) => (

      <button
        key={bank}
        className={`bank-btn ${
          selectedBank === bank
            ? "active"
            : ""
        }`}
        onClick={() =>
          setSelectedBank(bank)
        }
      >
        {bank}
      </button>

    ))}

  </div>

  {selectedBank && (

    <div className="bank-details">

      <p>
        <strong>Bank:</strong>
        {" "}
        {selectedBank}
      </p>

      <p>
        <strong>Account Name:</strong>
        WealthFlow Pvt Ltd
      </p>

      <p>
        <strong>Account No:</strong>
        123456789012
      </p>

      <p>
        <strong>IFSC:</strong>
        HDFC0001234
      </p>

      <button
        className="next-btn"
        onClick={() =>
          setCurrentStep(3)
        }
      >
        I Have Transferred
      </button>

    </div>

  )}

</div>

)}
.
{currentStep === 3 && (

<div className="payment-proof-card">

  <h3>Payment Verification</h3>

  <div className="form-group">

    <label>
      UTR Number
    </label>

    <input
      type="text"
      placeholder="Enter UTR Number"
      value={utrNumber}
      onChange={(e) =>
        setUtrNumber(
          e.target.value
        )
      }
    />

  </div>

  <div className="form-group">

    <label>
      Upload Payment Proof
    </label>

    <input
      type="file"
      accept="image/*"
      onChange={(e) =>
        setPaymentProof(
          e.target.files[0]
        )
      }
    />

  </div>

  <button
    className="deposit-submit-btn"
    onClick={handleDeposit}
    disabled={loading}
  >
    {loading
      ? "Processing..."
      : `Deposit ₹${amount || 0}`}
  </button>

</div>

)}

            {/* SUBMIT BUTTON */}

            {/* <button
              className="deposit-submit-btn"
              onClick={handleDeposit}
            >
              Deposit ₹{amount || 0}
            </button> */}

          </div>



        </div>

      </div>
    </Layout>
  );
}

export default Deposit;