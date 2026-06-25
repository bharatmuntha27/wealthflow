import React, { useState } from "react";
import api from "../api/axios";
import { Link, useNavigate } from "react-router-dom";
import {
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";

import "./Login.css";

const Login = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    setError("");

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      return setError("Please fill all fields");
    }

    try {
      setLoading(true);

const response = await api.post(
  "/auth/login",
  formData
);

      localStorage.setItem("token", response.data.token);
      localStorage.setItem(
        "user",
        JSON.stringify(response.data.user)
      );

      navigate("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Invalid email or password"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">

      {/* LEFT SIDE */}
      <div className="login-left">
        <div className="brand-section">
          <img
            src="/WealthFlow.png"
            alt="WealthFlow Logo"
            className="logo"
          />

          <h1>
            Wealth<span>Flow</span>
          </h1>

          <h2>Smart Investment Platform</h2>

          <p>
            Track investments, monitor ROI, manage referrals,
            and grow your wealth through a secure dashboard.
          </p>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="login-right">

        <div className="login-card">

          <div className="card-header">
            <h2>Welcome Back 👋</h2>
            <p>Sign in to your account</p>
          </div>

          {error && (
            <div className="error-box">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin}>

            <div className="input-group">
              <FaEnvelope className="input-icon" />

              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>

            <div className="input-group">
              <FaLock className="input-icon" />

              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
              />

              <span
                className="eye-icon"
                onClick={() =>
                  setShowPassword(
                    !showPassword
                  )
                }
              >
                {showPassword ? (
                  <FaEyeSlash />
                ) : (
                  <FaEye />
                )}
              </span>
            </div>

            <div className="login-options">

              <label>
                <input type="checkbox" />
                Remember Me
              </label>

              <Link
                to="/forgot-password"
                className="forgot-link"
              >
                Forgot Password?
              </Link>

            </div>

            <button
              className="login-btn"
              type="submit"
              disabled={loading}
            >
              {loading
                ? "Signing In..."
                : "Login"}
            </button>

          </form>

          <div className="divider">
            <span>OR</span>
          </div>

          <p className="register-link">
            Don't have an account?{" "}
            <Link to="/register">
              Create Account
            </Link>
          </p>

        </div>

      </div>
    </div>
  );
};

export default Login;