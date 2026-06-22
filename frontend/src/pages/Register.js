import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

import {  FaUser,  FaEnvelope,  FaMobileAlt,  FaLock,  FaGift,  FaEye,  FaEyeSlash,} from "react-icons/fa";

import "./Register.css";


function Register() {

  const navigate = useNavigate();

  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    mobileNumber: "",
    password: "",
    referralCode: "",
  });

  useEffect(() => {

    const params =
      new URLSearchParams(
        window.location.search
      );

    const ref =
      params.get("ref");

    if (ref) {
      setForm((prev) => ({
        ...prev,
        referralCode: ref,
      }));
    }

  }, []);

  const handleChange = (e) => {

    setError("");

    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

  };

  const validateForm = () => {

    if (form.fullName.trim().length < 3) {
      return "Full Name must be at least 3 characters";
    }

    if (!/\S+@\S+\.\S+/.test(form.email)) {
      return "Enter a valid email address";
    }

    if (!/^[0-9]{10}$/.test(form.mobileNumber)) {
      return "Enter valid 10 digit mobile number";
    }

    if (form.password.length < 6) {
      return "Password must be at least 6 characters";
    }

    return null;
  };

  const handleRegister = async (e) => {

    e.preventDefault();

    const validationError =
      validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    try {

      setLoading(true);

      setError("");
      setSuccess("");

      const response =
        await axios.post(
          "http://localhost:5000/api/auth/register",
          form
        );

      setSuccess(
        response.data.message ||
          "Registration Successful"
      );

      setTimeout(() => {
        navigate("/login");
      }, 2000);

    } catch (error) {

      setError(
        error.response?.data?.message ||
          "Registration Failed"
      );

    } finally {

      setLoading(false);

    }

  };

  return (

    <div className="register-container">

      {/* LEFT SIDE */}

      <div className="register-left">

        <div className="brand-content">
<img
  src="/WealthFlow.png"
  alt="WealthFlow"
  className="brand-logo"
/>
          <h1>
            Wealth<span>Flow</span>
          </h1>

          <h2>
            Build Your Financial Future
          </h2>

          <p>
            Join thousands of investors
            earning passive income,
            referral rewards and ROI
            through WealthFlow.
          </p>

        </div>

      </div>

      {/* RIGHT SIDE */}

      <div className="register-right">

        <div className="register-card">

          <div className="card-header">

            <h2>Create Account</h2>

            <p>
              Start your investment journey
            </p>

          </div>

          {error && (
            <div className="error-box">
              {error}
            </div>
          )}

          {success && (
            <div className="success-box">
              {success}
            </div>
          )}

          <form onSubmit={handleRegister}>

            <div className="input-group">

              <FaUser className="input-icon" />

              <input
                type="text"
                name="fullName"
                placeholder="Full Name"
                value={form.fullName}
                onChange={handleChange}
                required
              />

            </div>

            <div className="input-group">

              <FaEnvelope className="input-icon" />

              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={form.email}
                onChange={handleChange}
                required
              />

            </div>

            <div className="input-group">

              <FaMobileAlt className="input-icon" />

              <input
                type="text"
                name="mobileNumber"
                placeholder="Mobile Number"
                value={form.mobileNumber}
                onChange={handleChange}
                required
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
                placeholder="Create Password"
                value={form.password}
                onChange={handleChange}
                required
              />

              <span
                className="eye-icon"
                onClick={() =>
                  setShowPassword(
                    !showPassword
                  )
                }
              >
                {showPassword
                  ? <FaEyeSlash />
                  : <FaEye />}
              </span>

            </div>

            <div className="input-group">

              <FaGift className="input-icon" />

              <input
                type="text"
                name="referralCode"
                placeholder="Referral Code (Optional)"
                value={form.referralCode}
                onChange={handleChange}
              />

            </div>

            <button
              type="submit"
              className="register-btn"
              disabled={loading}
            >
              {loading
                ? "Creating Account..."
                : "Create Account"}
            </button>

          </form>

          <div className="login-link">

            Already have an account?

            <Link to="/login">
              Login
            </Link>

          </div>

        </div>

      </div>

    </div>

  );
}

export default Register;