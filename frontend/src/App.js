import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Investments from "./pages/Investments";
import Referrals from "./pages/Referrals";
import Wallet from "./pages/Wallet";
import Deposit from "./pages/Deposit";
import Withdraw from "./pages/Withdraw";
import ReferralIncome from "./pages/ReferralIncome";
import Profile from "./pages/Profile";
import ForgotPassword from "./pages/ForgotPassword";
import AdminPanel from "./pages/AdminPanel";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/investments" element={<Investments />} />
        <Route path="/referrals" element={<Referrals />} />
        <Route path="/wallet" element={<Wallet />} />
        <Route path="/deposit" element={<Deposit />} />
        <Route path="/withdraw" element={<Withdraw />} />
        <Route path="/referral-income" element={<ReferralIncome />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;