import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav>
      <Link to="/dashboard">Dashboard</Link> |{" "}
      <Link to="/investments">Investments</Link> |{" "}
      <Link to="/referrals">Referrals</Link> |{" "}
      <Link to="/wallet">Wallet</Link> |{" "}
      <Link to="/profile">Profile</Link> |{" "}
      <button onClick={logout}>Logout</button>
    </nav>
  );
};

export default Navbar;