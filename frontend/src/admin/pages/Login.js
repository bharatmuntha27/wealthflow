import React, { useState } from "react";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import "../css/Login.css";

function Login() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setError("");

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      return setError("Please enter Email & Password.");
    }

    try {
      setLoading(true);

      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        formData
      );

      if (res.data.user.role !== "admin") {
        return setError("Only Admin can login.");
      }

      localStorage.setItem("adminToken", res.data.token);
      localStorage.setItem("admin", JSON.stringify(res.data.user));

      navigate("/admin/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Login Failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login">

      <div className="login-box">

        <img
          src="/WealthFlow.png"
          alt="logo"
          className="logo"
        />

        <h2>Admin Login</h2>

        <p>Welcome to WealthFlow Admin Panel</p>

        {error && (
          <div className="error">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>

          <div className="input-box">

            <FaEnvelope />

            <input
              type="email"
              name="email"
              placeholder="Admin Email"
              value={formData.email}
              onChange={handleChange}
            />

          </div>

          <div className="input-box">

            <FaLock />

            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
            />

            <span
              onClick={() =>
                setShowPassword(!showPassword)
              }
            >
              {showPassword ? (
                <FaEyeSlash />
              ) : (
                <FaEye />
              )}
            </span>

          </div>

          <button type="submit">

            {loading
              ? "Signing In..."
              : "Login"}

          </button>

        </form>

      </div>

    </div>
  );
}

export default Login;