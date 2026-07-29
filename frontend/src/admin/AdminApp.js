import React from "react";
import { Routes, Route } from "react-router-dom";

function AdminApp() {
  return (
    <Routes>
      <Route path="/login" element={<h1>Admin Login</h1>} />
    </Routes>
  );
}

export default AdminApp;