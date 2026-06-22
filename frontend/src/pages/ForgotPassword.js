import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./ForgotPassword.css";

function ForgotPassword() {

  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      setLoading(true);

      const res = await axios.post(
        "http://localhost:5000/api/auth/forgot-password",
        { email }
      );

      setMessage(res.data.message);

    } catch (error) {

      setMessage(
        error.response?.data?.message ||
        "Something went wrong"
      );

    } finally {

      setLoading(false);

    }

  };

  return (
    <div className="forgot-container">

      <div className="forgot-card">

        <h2>Forgot Password</h2>

        <p>
          Enter your registered email address.
        </p>

        <form onSubmit={handleSubmit}>

          <input
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            required
          />

          <button
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Sending..."
              : "Send Reset Link"}
          </button>

        </form>

        {message && (
          <p className="message">
            {message}
          </p>
        )}

       <div className="back-login-wrapper">

  <Link
    to="/login"
    className="back-login-link"
  >
    ← Back to Login
  </Link>

</div>

      </div>

    </div>
  );
}

export default ForgotPassword;