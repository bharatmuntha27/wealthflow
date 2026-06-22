import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Investments from "./pages/Investments";
import Referrals from "./pages/Referrals";
import Wallet from "./pages/Wallet";
import Profile from "./pages/Profile";
import Deposit from "./pages/Deposit";
// import Withdraw from "./pages/Withdraw";
import ReferralIncome from "./pages/ReferralIncome";
import ForgotPassword from "./pages/ForgotPassword";

function App() {
  const token = localStorage.getItem("token");

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to={token ? "/dashboard" : "/login"} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/investments" element={<Investments />} />
        <Route path="/referrals" element={<Referrals />} />
        <Route path="/wallet" element={<Wallet />} />
        <Route path="/deposit" element={<Deposit />} />
         {/* <Route path="/withdraw" element={<Withdraw />} /> */}
          <Route path="/referral-income" element={<ReferralIncome />} />
        <Route path="/profile" element={<Profile />} />
        <Route  path="/forgot-password"  element={<ForgotPassword />}/>
       
      </Routes>
    </BrowserRouter>
  );
}

export default App;