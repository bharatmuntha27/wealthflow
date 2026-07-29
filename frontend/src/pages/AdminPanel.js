import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../api/axios";
import Layout from "../components/Layout/Layout";
import {
  FaSearch,
  FaBan,
  FaCheck,
  FaTimes,
  FaPlus,
  FaMinus,
  FaEye
} from "react-icons/fa";
import "./AdminPanel.css";

function AdminPanel() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "dashboard";

  // Global State
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [usersList, setUsersList] = useState([]);
  const [investmentsList, setInvestmentsList] = useState([]);
  const [depositsList, setDepositsList] = useState([]);
  const [withdrawalsList, setWithdrawalsList] = useState([]);
  const [roiList, setRoiList] = useState([]);
  const [referralList, setReferralList] = useState([]);
  const [transactionsList, setTransactionsList] = useState([]);
  const [reportData, setReportData] = useState(null);
  const [settingsData, setSettingsData] = useState({
    minDeposit: 500,
    maxDeposit: 500000,
    minWithdrawal: 100,
    dailyROIPercentage: 1,
    adminUpiId: "",
    adminBankName: "",
    adminBankAccountHolder: "",
    adminBankAccountNumber: "",
    adminBankIfsc: ""
  });

  // UI Helpers
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProof, setSelectedProof] = useState(null); // For Image Modal
  const [balanceModal, setBalanceModal] = useState(null); // For Balance Adjustment: { userId, fullName, type: 'credit'|'debit', amount: '', remarks: '' }
  const [btnLoading, setBtnLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, activeTab]);

  // Authenticate admin
  const adminUser = JSON.parse(localStorage.getItem("user"));
  
  useEffect(() => {
    if (!localStorage.getItem("token") || adminUser?.role !== "admin") {
      localStorage.clear();
      navigate("/login", { replace: true });
    } else {
      loadTabData(activeTab);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  const loadTabData = async (tab) => {
    try {
      setLoading(true);
      setSearchQuery("");
      
      if (tab === "dashboard") {
        const res = await api.get("/admin/dashboard");
        setStats(res.data.stats);
        
        // Also fetch recent deposits and withdrawals for dashboard quick lists
        const depRes = await api.get("/admin/deposits");
        const wdRes = await api.get("/admin/withdrawals");
        setDepositsList(depRes.data.deposits?.slice(0, 5) || []);
        setWithdrawalsList(wdRes.data.withdrawals?.slice(0, 5) || []);
      } 
      else if (tab === "users") {
        const res = await api.get("/admin/users");
        setUsersList(res.data.users || []);
      } 
      else if (tab === "investments") {
        const res = await api.get("/admin/investments");
        setInvestmentsList(res.data.investments || []);
      } 
      else if (tab === "deposits") {
        const res = await api.get("/admin/deposits");
        setDepositsList(res.data.deposits || []);
      } 
      else if (tab === "withdrawals") {
        const res = await api.get("/admin/withdrawals");
        setWithdrawalsList(res.data.withdrawals || []);
      } 
      else if (tab === "roi") {
        const res = await api.get("/admin/roi-history");
        setRoiList(res.data.roiHistory || []);
      } 
      else if (tab === "referral") {
        const res = await api.get("/admin/referral-income");
        setReferralList(res.data.referralIncome || []);
      } 
      else if (tab === "wallet") {
        const res = await api.get("/admin/wallet-transactions");
        setTransactionsList(res.data.transactions || []);
      } 
      else if (tab === "reports") {
        const res = await api.get("/admin/reports");
        setReportData(res.data.report);
      } 
      else if (tab === "settings") {
        const res = await api.get("/admin/settings");
        setSettingsData(res.data.settings);
      }
    } catch (error) {
      console.error(`Error loading ${tab} data:`, error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        localStorage.clear();
        navigate("/login", { replace: true });
      }
    } finally {
      setLoading(false);
    }
  };


  // Status updates
  const handleUserStatusUpdate = async (userId, currentStatus) => {
    const newStatus = currentStatus === "Blocked" ? "Active" : "Blocked";
    const confirm = window.confirm(`Are you sure you want to change user status to ${newStatus}?`);
    if (!confirm) return;

    try {
      await api.put(`/admin/users/${userId}/status`, { status: newStatus });
      alert(`User account status updated successfully to ${newStatus}`);
      loadTabData("users");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update user status");
    }
  };

  const handleBalanceAdjustment = async (e) => {
    e.preventDefault();
    if (!balanceModal.amount || Number(balanceModal.amount) <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    try {
      setBtnLoading(true);
      const factor = balanceModal.type === "credit" ? 1 : -1;
      const adjustAmount = Number(balanceModal.amount) * factor;

      await api.put(`/admin/users/${balanceModal.userId}/balance`, {
        amount: adjustAmount,
        remarks: balanceModal.remarks
      });

      alert("Wallet balance adjusted successfully!");
      setBalanceModal(null);
      loadTabData("users");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to adjust balance");
    } finally {
      setBtnLoading(false);
    }
  };

  const handleDepositAction = async (depositId, actionStatus) => {
    const confirm = window.confirm(`Are you sure you want to ${actionStatus.toLowerCase()} this deposit request?`);
    if (!confirm) return;

    try {
      setBtnLoading(true);
      await api.put(`/admin/deposits/${depositId}/status`, { status: actionStatus });
      alert(`Deposit request ${actionStatus.toLowerCase()} successfully!`);
      loadTabData("deposits");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update deposit request");
    } finally {
      setBtnLoading(false);
    }
  };

  const handleWithdrawalAction = async (withdrawalId, actionStatus) => {
    const confirm = window.confirm(`Are you sure you want to ${actionStatus.toLowerCase()} this withdrawal request?`);
    if (!confirm) return;

    try {
      setBtnLoading(true);
      await api.put(`/admin/withdrawals/${withdrawalId}/status`, { status: actionStatus });
      alert(`Withdrawal request ${actionStatus.toLowerCase()} successfully!`);
      loadTabData("withdrawals");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update withdrawal request");
    } finally {
      setBtnLoading(false);
    }
  };

  const handleSettingsUpdate = async (e) => {
    e.preventDefault();
    try {
      setBtnLoading(true);
      await api.put("/admin/settings", settingsData);
      alert("System settings updated successfully!");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update settings");
    } finally {
      setBtnLoading(false);
    }
  };

  const renderPagination = (totalItems) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    if (totalPages <= 1) return null;

    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);

    const pages = [];
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, currentPage + 2);

    if (currentPage <= 3) {
      endPage = Math.min(totalPages, 5);
    }
    if (currentPage > totalPages - 2) {
      startPage = Math.max(1, totalPages - 4);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return (
      <div className="pagination-container">
        <div className="pagination-info">
          Showing <span>{startItem}</span> to <span>{endItem}</span> of <span>{totalItems}</span> entries
        </div>
        <div className="pagination-buttons">
          <button 
            className="pag-btn prev" 
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          {startPage > 1 && (
            <>
              <button className={`pag-btn ${currentPage === 1 ? "active" : ""}`} onClick={() => setCurrentPage(1)}>1</button>
              {startPage > 2 && <span className="pag-ellipsis">...</span>}
            </>
          )}
          {pages.map(page => (
            <button 
              key={page} 
              className={`pag-btn ${currentPage === page ? "active" : ""}`} 
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </button>
          ))}
          {endPage < totalPages && (
            <>
              {endPage < totalPages - 1 && <span className="pag-ellipsis">...</span>}
              <button className={`pag-btn ${currentPage === totalPages ? "active" : ""}`} onClick={() => setCurrentPage(totalPages)}>{totalPages}</button>
            </>
          )}
          <button 
            className="pag-btn next" 
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    );
  };

  const getTabTitle = (tab) => {
    const titles = {
      dashboard: "Dashboard Overview",
      users: "Users Management",
      investments: "User Investments",
      deposits: "Deposit Requests",
      withdrawals: "Withdrawal Requests",
      roi: "ROI Distributions",
      referral: "Referral Income Commissions",
      wallet: "Wallet Transaction Audit Ledger",
      reports: "Platform Reports & Analytics",
      settings: "System Settings & Financial Limits"
    };
    return titles[tab] || "Admin Control";
  };

  return (
    <Layout>
      <div className="admin-content-wrapper">
        <div style={{ marginBottom: "25px" }}>
          <h1 style={{ fontSize: "24px", fontWeight: "800", color: "#1e293b", margin: 0 }}>{getTabTitle(activeTab)}</h1>
          <p style={{ fontSize: "14px", color: "#64748b", margin: "4px 0 0 0" }}>Control and manage platform operations</p>
        </div>

        {loading ? (
          <div className="admin-loader">
            <h2>Loading {activeTab.toUpperCase()} Data...</h2>
          </div>
        ) : (
            <>
              {/* DASHBOARD TAB */}
              {activeTab === "dashboard" && stats && (
                <div className="tab-dashboard">
                  <div className="admin-stats-grid">
                    <div className="admin-stat-card">
                      <h3>Total Registered Users</h3>
                      <h2>{stats.totalUsers}</h2>
                    </div>
                    <div className="admin-stat-card admin-card-active-users">
                      <h3>Active / Blocked Users</h3>
                      <div className="users-split-stats">
                        <div className="split-item active">
                          <span className="split-val">{stats.activeUsers}</span>
                          <span className="split-lbl">Active</span>
                        </div>
                        <div className="split-divider">/</div>
                        <div className="split-item blocked">
                          <span className="split-val">{stats.blockedUsers}</span>
                          <span className="split-lbl">Blocked</span>
                        </div>
                      </div>
                    </div>
                    <div className="admin-stat-card admin-card-investment">
                      <h3>Total Active Investments</h3>
                      <h2>₹{stats.totalInvestments.toLocaleString("en-IN")}</h2>
                    </div>
                    <div className="admin-stat-card admin-card-deposit">
                      <h3>Total Deposits (Approved)</h3>
                      <h2>₹{stats.totalDeposits.toLocaleString("en-IN")}</h2>
                    </div>
                    <div className="admin-stat-card admin-card-withdrawal">
                      <h3>Total Withdrawals (Approved)</h3>
                      <h2>₹{stats.totalWithdrawals.toLocaleString("en-IN")}</h2>
                    </div>
                    <div className="admin-stat-card admin-card-roi">
                      <h3>Total ROI Distributed</h3>
                      <h2>₹{stats.totalROI.toLocaleString("en-IN")}</h2>
                    </div>
                    <div className="admin-stat-card admin-card-referral">
                      <h3>Total Referral Commissions</h3>
                      <h2>₹{stats.totalReferralIncome.toLocaleString("en-IN")}</h2>
                    </div>
                    <div className="admin-stat-card admin-card-wallet">
                      <h3>Total User Balances</h3>
                      <h2>₹{stats.totalWalletBalance.toLocaleString("en-IN")}</h2>
                    </div>
                  </div>

                  <div className="dashboard-lists">
                    <div className="dash-list-card">
                      <h3>Recent Deposits (Pending/Success)</h3>
                      <div className="admin-table-wrapper">
                        <table className="admin-table">
                          <thead>
                            <tr>
                              <th>User</th>
                              <th>Amount</th>
                              <th>UTR</th>
                              <th>Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {depositsList.length > 0 ? (
                              depositsList.map(dep => (
                                <tr key={dep._id}>
                                  <td>{dep.user?.fullName || "Deleted User"}</td>
                                  <td>₹{dep.amount.toLocaleString()}</td>
                                  <td>{dep.utrNumber}</td>
                                  <td><span className={`status-tag ${dep.status.toLowerCase()}`}>{dep.status}</span></td>
                                </tr>
                              ))
                            ) : (
                              <tr><td colSpan="4">No recent deposits</td></tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <div className="dash-list-card">
                      <h3>Recent Withdrawals (Pending/Success)</h3>
                      <div className="admin-table-wrapper">
                        <table className="admin-table">
                          <thead>
                            <tr>
                              <th>User</th>
                              <th>Amount</th>
                              <th>Bank</th>
                              <th>Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {withdrawalsList.length > 0 ? (
                              withdrawalsList.map(wd => (
                                <tr key={wd._id}>
                                  <td>{wd.user?.fullName || "Deleted User"}</td>
                                  <td>₹{wd.amount.toLocaleString()}</td>
                                  <td>{wd.accountNumber}</td>
                                  <td><span className={`status-tag ${wd.status.toLowerCase()}`}>{wd.status}</span></td>
                                </tr>
                              ))
                            ) : (
                              <tr><td colSpan="4">No recent withdrawals</td></tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* USERS TAB */}
              {activeTab === "users" && (
                <div className="tab-users">
                  <div className="search-bar">
                    <FaSearch />
                    <input
                      type="text"
                      placeholder="Search users by name, email, or mobile..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <div className="admin-table-wrapper">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Date Registered</th>
                          <th>Name</th>
                          <th>Email / Mobile</th>
                          <th>Wallet Balance</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(() => {
                          const filtered = usersList.filter(u => 
                            u.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            u.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            u.mobileNumber?.includes(searchQuery)
                          );
                          const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
                          return (
                            <>
                              {paginated.map(u => (
                                <tr key={u._id}>
                                  <td>{new Date(u.createdAt).toLocaleDateString("en-IN")}</td>
                                  <td>
                                    <strong>{u.fullName}</strong>
                                    <br />
                                    <small style={{color: "#64748b"}}>Code: {u.referralCode}</small>
                                  </td>
                                  <td>
                                    {u.email}
                                    <br />
                                    <span style={{fontSize: "12px", color: "#64748b"}}>{u.mobileNumber}</span>
                                  </td>
                                  <td style={{fontWeight: "700"}}>₹{u.walletBalance.toLocaleString("en-IN")}</td>
                                  <td>
                                    <span className={`status-tag ${u.accountStatus.toLowerCase()}`}>{u.accountStatus}</span>
                                  </td>
                                  <td className="actions-cell">
                                    <button
                                      className={`action-btn block ${u.accountStatus === "Blocked" ? "unblock" : ""}`}
                                      onClick={() => handleUserStatusUpdate(u._id, u.accountStatus)}
                                      title={u.accountStatus === "Blocked" ? "Unblock Account" : "Block Account"}
                                    >
                                      <FaBan />
                                    </button>
                                    <button
                                      className="action-btn credit"
                                      onClick={() => setBalanceModal({ userId: u._id, fullName: u.fullName, type: "credit", amount: "", remarks: "" })}
                                      title="Credit Wallet Balance"
                                    >
                                      <FaPlus />
                                    </button>
                                    <button
                                      className="action-btn debit"
                                      onClick={() => setBalanceModal({ userId: u._id, fullName: u.fullName, type: "debit", amount: "", remarks: "" })}
                                      title="Debit Wallet Balance"
                                    >
                                      <FaMinus />
                                    </button>
                                  </td>
                                </tr>
                              ))}
                              {filtered.length === 0 && (
                                <tr>
                                  <td colSpan="6" style={{ textAlign: "center", padding: "20px" }}>No users found</td>
                                </tr>
                              )}
                            </>
                          );
                        })()}
                      </tbody>
                    </table>
                  </div>
                  {(() => {
                    const filtered = usersList.filter(u => 
                      u.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                      u.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      u.mobileNumber?.includes(searchQuery)
                    );
                    return renderPagination(filtered.length);
                  })()}
                </div>
              )}

              {/* INVESTMENTS TAB */}
              {activeTab === "investments" && (
                <div className="tab-investments">
                  <div className="search-bar">
                    <FaSearch />
                    <input
                      type="text"
                      placeholder="Search investments by user or plan..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <div className="admin-table-wrapper">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>User</th>
                          <th>Plan Name</th>
                          <th>Investment Amount</th>
                          <th>Daily ROI Rate</th>
                          <th>Timeline</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(() => {
                          const filtered = investmentsList.filter(i => 
                            i.user?.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            i.planName?.toLowerCase().includes(searchQuery.toLowerCase())
                          );
                          const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
                          return (
                            <>
                              {paginated.map(i => (
                                <tr key={i._id}>
                                  <td>
                                    <strong>{i.user?.fullName || "Deleted User"}</strong>
                                    <br />
                                    <small style={{color: "#64748b"}}>{i.user?.email}</small>
                                  </td>
                                  <td>{i.planName}</td>
                                  <td style={{fontWeight: "700"}}>₹{i.investmentAmount.toLocaleString()}</td>
                                  <td>{i.dailyROI}%</td>
                                  <td>
                                    <span style={{fontSize: "12px"}}>
                                      Start: {new Date(i.startDate).toLocaleDateString("en-IN")}
                                      <br />
                                      End: {new Date(i.endDate).toLocaleDateString("en-IN")}
                                    </span>
                                  </td>
                                  <td>
                                    <span className={`status-tag ${i.status.toLowerCase()}`}>{i.status}</span>
                                  </td>
                                </tr>
                              ))}
                              {filtered.length === 0 && (
                                <tr>
                                  <td colSpan="6" style={{ textAlign: "center", padding: "20px" }}>No investments found</td>
                                </tr>
                              )}
                            </>
                          );
                        })()}
                      </tbody>
                    </table>
                  </div>
                  {(() => {
                    const filtered = investmentsList.filter(i => 
                      i.user?.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                      i.planName?.toLowerCase().includes(searchQuery.toLowerCase())
                    );
                    return renderPagination(filtered.length);
                  })()}
                </div>
              )}

              {/* DEPOSITS TAB */}
              {activeTab === "deposits" && (
                <div className="tab-deposits">
                  <div className="search-bar">
                    <FaSearch />
                    <input
                      type="text"
                      placeholder="Search deposits by user or UTR..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <div className="admin-table-wrapper">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Date</th>
                          <th>User</th>
                          <th>Amount</th>
                          <th>Method</th>
                          <th>UTR Number</th>
                          <th>Proof</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(() => {
                          const filtered = depositsList.filter(d => 
                            d.user?.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            d.utrNumber?.includes(searchQuery)
                          );
                          const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
                          return (
                            <>
                              {paginated.map(d => (
                                <tr key={d._id}>
                                  <td>{new Date(d.createdAt).toLocaleDateString("en-IN")}</td>
                                  <td>
                                    <strong>{d.user?.fullName || "Deleted User"}</strong>
                                    <br />
                                    <small style={{color: "#64748b"}}>{d.user?.email}</small>
                                  </td>
                                  <td style={{fontWeight: "700"}}>₹{d.amount.toLocaleString()}</td>
                                  <td>{d.paymentMethod}</td>
                                  <td><code>{d.utrNumber}</code></td>
                                  <td>
                                    {d.paymentProof ? (
                                      <button className="proof-btn" onClick={() => setSelectedProof(d.paymentProof)}>
                                        <FaEye /> View Proof
                                      </button>
                                    ) : (
                                      "No Proof"
                                    )}
                                  </td>
                                  <td>
                                    <span className={`status-tag ${d.status.toLowerCase()}`}>{d.status}</span>
                                  </td>
                                  <td className="actions-cell">
                                    {d.status === "Pending" ? (
                                      <>
                                        <button
                                          className="action-btn approve"
                                          onClick={() => handleDepositAction(d._id, "Approved")}
                                          disabled={btnLoading}
                                          title="Approve Deposit"
                                        >
                                          <FaCheck />
                                        </button>
                                        <button
                                          className="action-btn reject"
                                          onClick={() => handleDepositAction(d._id, "Rejected")}
                                          disabled={btnLoading}
                                          title="Reject Deposit"
                                        >
                                          <FaTimes />
                                        </button>
                                      </>
                                    ) : (
                                      <span style={{fontSize: "12px", color: "#64748b"}}>Reviewed</span>
                                    )}
                                  </td>
                                </tr>
                              ))}
                              {filtered.length === 0 && (
                                <tr>
                                  <td colSpan="8" style={{ textAlign: "center", padding: "20px" }}>No deposits found</td>
                                </tr>
                              )}
                            </>
                          );
                        })()}
                      </tbody>
                    </table>
                  </div>
                  {(() => {
                    const filtered = depositsList.filter(d => 
                      d.user?.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                      d.utrNumber?.includes(searchQuery)
                    );
                    return renderPagination(filtered.length);
                  })()}
                </div>
              )}

              {/* WITHDRAWALS TAB */}
              {activeTab === "withdrawals" && (
                <div className="tab-withdrawals">
                  <div className="search-bar">
                    <FaSearch />
                    <input
                      type="text"
                      placeholder="Search withdrawals by user..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <div className="admin-table-wrapper">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Date</th>
                          <th>User</th>
                          <th>Amount</th>
                          <th>Bank Details</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(() => {
                          const filtered = withdrawalsList.filter(w => 
                            w.user?.fullName?.toLowerCase().includes(searchQuery.toLowerCase())
                          );
                          const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
                          return (
                            <>
                              {paginated.map(w => (
                                <tr key={w._id}>
                                  <td>{new Date(w.createdAt).toLocaleDateString("en-IN")}</td>
                                  <td>
                                    <strong>{w.user?.fullName || "Deleted User"}</strong>
                                    <br />
                                    <small style={{color: "#64748b"}}>{w.user?.email}</small>
                                  </td>
                                  <td style={{fontWeight: "700"}}>₹{w.amount.toLocaleString()}</td>
                                  <td>
                                    <div style={{fontSize: "13px", lineHeight: "1.4"}}>
                                      <strong>Holder:</strong> {w.accountName}
                                      <br />
                                      <strong>No:</strong> {w.accountNumber}
                                      <br />
                                      <strong>IFSC:</strong> {w.ifscCode}
                                    </div>
                                  </td>
                                  <td>
                                    <span className={`status-tag ${w.status.toLowerCase()}`}>{w.status}</span>
                                  </td>
                                  <td className="actions-cell">
                                    {w.status === "Pending" ? (
                                      <>
                                        <button
                                          className="action-btn approve"
                                          onClick={() => handleWithdrawalAction(w._id, "Approved")}
                                          disabled={btnLoading}
                                          title="Approve Withdrawal"
                                        >
                                          <FaCheck />
                                        </button>
                                        <button
                                          className="action-btn reject"
                                          onClick={() => handleWithdrawalAction(w._id, "Rejected")}
                                          disabled={btnLoading}
                                          title="Reject Withdrawal"
                                        >
                                          <FaTimes />
                                        </button>
                                      </>
                                    ) : (
                                      <span style={{fontSize: "12px", color: "#64748b"}}>Processed</span>
                                    )}
                                  </td>
                                </tr>
                              ))}
                              {filtered.length === 0 && (
                                <tr>
                                  <td colSpan="6" style={{ textAlign: "center", padding: "20px" }}>No withdrawals found</td>
                                </tr>
                              )}
                            </>
                          );
                        })()}
                      </tbody>
                    </table>
                  </div>
                  {(() => {
                    const filtered = withdrawalsList.filter(w => 
                      w.user?.fullName?.toLowerCase().includes(searchQuery.toLowerCase())
                    );
                    return renderPagination(filtered.length);
                  })()}
                </div>
              )}

              {/* ROI HISTORY TAB */}
              {activeTab === "roi" && (
                <div className="tab-roi">
                  <div className="search-bar">
                    <FaSearch />
                    <input
                      type="text"
                      placeholder="Search ROI records by user..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <div className="admin-table-wrapper">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Date Credited</th>
                          <th>User</th>
                          <th>Investment Source</th>
                          <th>ROI Amount</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(() => {
                          const filtered = roiList.filter(r => 
                            r.user?.fullName?.toLowerCase().includes(searchQuery.toLowerCase())
                          );
                          const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
                          return (
                            <>
                              {paginated.map(r => (
                                <tr key={r._id}>
                                  <td>{new Date(r.roiDate || r.createdAt).toLocaleDateString("en-IN")}</td>
                                  <td>
                                    <strong>{r.user?.fullName || "Deleted User"}</strong>
                                    <br />
                                    <small style={{color: "#64748b"}}>{r.user?.email}</small>
                                  </td>
                                  <td>
                                    {r.investment ? (
                                      <span>{r.investment.planName} (₹{r.investment.investmentAmount.toLocaleString()})</span>
                                    ) : (
                                      "Source Deleted"
                                    )}
                                  </td>
                                  <td style={{fontWeight: "700", color: "#16a34a"}}>+₹{r.roiAmount.toLocaleString()}</td>
                                  <td><span className="status-tag success">{r.status}</span></td>
                                </tr>
                              ))}
                              {filtered.length === 0 && (
                                <tr>
                                  <td colSpan="5" style={{ textAlign: "center", padding: "20px" }}>No ROI records found</td>
                                </tr>
                              )}
                            </>
                          );
                        })()}
                      </tbody>
                    </table>
                  </div>
                  {(() => {
                    const filtered = roiList.filter(r => 
                      r.user?.fullName?.toLowerCase().includes(searchQuery.toLowerCase())
                    );
                    return renderPagination(filtered.length);
                  })()}
                </div>
              )}

              {/* REFERRAL INCOME TAB */}
              {activeTab === "referral" && (
                <div className="tab-referral">
                  <div className="search-bar">
                    <FaSearch />
                    <input
                      type="text"
                      placeholder="Search referral income..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <div className="admin-table-wrapper">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Date Credited</th>
                          <th>Receiver (Upline)</th>
                          <th>Generated By (Downline)</th>
                          <th>Level</th>
                          <th>Commission Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(() => {
                          const filtered = referralList.filter(rf => 
                            rf.receiverUser?.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            rf.generatedByUser?.fullName?.toLowerCase().includes(searchQuery.toLowerCase())
                          );
                          const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
                          return (
                            <>
                              {paginated.map(rf => (
                                <tr key={rf._id}>
                                  <td>{new Date(rf.incomeDate || rf.createdAt).toLocaleDateString("en-IN")}</td>
                                  <td>
                                    <strong>{rf.receiverUser?.fullName || "Deleted User"}</strong>
                                    <br />
                                    <small style={{color: "#64748b"}}>{rf.receiverUser?.email}</small>
                                  </td>
                                  <td>
                                    {rf.generatedByUser?.fullName || "Deleted User"}
                                    <br />
                                    <small style={{color: "#64748b"}}>{rf.generatedByUser?.email}</small>
                                  </td>
                                  <td>Level {rf.level}</td>
                                  <td style={{fontWeight: "700", color: "#16a34a"}}>+₹{rf.incomeAmount.toLocaleString()}</td>
                                </tr>
                              ))}
                              {filtered.length === 0 && (
                                <tr>
                                  <td colSpan="5" style={{ textAlign: "center", padding: "20px" }}>No referral income records found</td>
                                </tr>
                              )}
                            </>
                          );
                        })()}
                      </tbody>
                    </table>
                  </div>
                  {(() => {
                    const filtered = referralList.filter(rf => 
                      rf.receiverUser?.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      rf.generatedByUser?.fullName?.toLowerCase().includes(searchQuery.toLowerCase())
                    );
                    return renderPagination(filtered.length);
                  })()}
                </div>
              )}

              {/* WALLET TRANSACTIONS TAB */}
              {activeTab === "wallet" && (
                <div className="tab-wallet">
                  <div className="search-bar">
                    <FaSearch />
                    <input
                      type="text"
                      placeholder="Search transactions by user or type..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <div className="admin-table-wrapper">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Date</th>
                          <th>User</th>
                          <th>Type</th>
                          <th>Amount</th>
                          <th>Status</th>
                          <th>Remarks / Details</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(() => {
                          const filtered = transactionsList.filter(t => 
                            t.user?.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            t.type?.toLowerCase().includes(searchQuery.toLowerCase())
                          );
                          const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
                          return (
                            <>
                              {paginated.map(t => (
                                <tr key={t._id}>
                                  <td>{new Date(t.createdAt).toLocaleDateString("en-IN")}</td>
                                  <td>
                                    <strong>{t.user?.fullName || "Deleted User"}</strong>
                                    <br />
                                    <small style={{color: "#64748b"}}>{t.user?.email}</small>
                                  </td>
                                  <td><strong>{t.type}</strong></td>
                                  <td style={{fontWeight: "700", color: ["Deposit", "ROI", "Referral Income"].includes(t.type) ? "#16a34a" : "#dc2626"}}>
                                    {["Deposit", "ROI", "Referral Income"].includes(t.type) ? "+" : "-"}₹{t.amount.toLocaleString()}
                                  </td>
                                  <td>
                                    <span className={`status-tag ${t.status?.toLowerCase() || "success"}`}>{t.status || "Success"}</span>
                                  </td>
                                  <td>{t.remarks || "-"}</td>
                                </tr>
                              ))}
                              {filtered.length === 0 && (
                                <tr>
                                  <td colSpan="6" style={{ textAlign: "center", padding: "20px" }}>No transactions found</td>
                                </tr>
                              )}
                            </>
                          );
                        })()}
                      </tbody>
                    </table>
                  </div>
                  {(() => {
                    const filtered = transactionsList.filter(t => 
                      t.user?.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      t.type?.toLowerCase().includes(searchQuery.toLowerCase())
                    );
                    return renderPagination(filtered.length);
                  })()}
                </div>
              )}

              {/* REPORTS TAB */}
              {activeTab === "reports" && reportData && (
                <div className="tab-reports">
                  <div className="report-summary-box">
                    <h2>Platform Business Report Summary</h2>
                    <p>Calculated across all validated transactions</p>
                  </div>
                  
                  <div className="reports-grid">
                    <div className="report-item">
                      <h4>Total Registered Base</h4>
                      <h3>{reportData.totalUsers} Members</h3>
                    </div>
                    <div className="report-item inflow">
                      <h4>Total Inflow (Deposits)</h4>
                      <h3>₹{reportData.deposits.totalAmount.toLocaleString()}</h3>
                      <p>{reportData.deposits.count} Approved Transactions</p>
                    </div>
                    <div className="report-item outflow">
                      <h4>Total Outflow (Withdrawals)</h4>
                      <h3>₹{reportData.withdrawals.totalAmount.toLocaleString()}</h3>
                      <p>{reportData.withdrawals.count} Approved Transactions</p>
                    </div>
                    <div className="report-item net">
                      <h4>Net Platform Reserve (Flow)</h4>
                      <h3 style={{color: reportData.netSystemFlow >= 0 ? "#16a34a" : "#dc2626"}}>
                        ₹{reportData.netSystemFlow.toLocaleString()}
                      </h3>
                      <p>Deposits minus Withdrawals</p>
                    </div>
                    <div className="report-item secondary">
                      <h4>Total ROI Distributed</h4>
                      <h3>₹{reportData.roiPaid.totalAmount.toLocaleString()}</h3>
                      <p>{reportData.roiPaid.count} Credited Records</p>
                    </div>
                    <div className="report-item secondary">
                      <h4>Total Referral Commissions Paid</h4>
                      <h3>₹{reportData.referralPaid.totalAmount.toLocaleString()}</h3>
                      <p>{reportData.referralPaid.count} Level Payouts</p>
                    </div>
                  </div>
                </div>
              )}

              {/* SETTINGS TAB */}
              {activeTab === "settings" && (
                <div className="tab-settings">
                  <form onSubmit={handleSettingsUpdate} className="settings-form">
                    <div className="settings-section">
                      <h3>Financial Limits</h3>
                      <div className="form-row">
                        <div className="form-group">
                          <label>Minimum Deposit Amount (₹)</label>
                          <input
                            type="number"
                            value={settingsData.minDeposit}
                            onChange={(e) => setSettingsData({ ...settingsData, minDeposit: e.target.value })}
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label>Maximum Deposit Amount (₹)</label>
                          <input
                            type="number"
                            value={settingsData.maxDeposit}
                            onChange={(e) => setSettingsData({ ...settingsData, maxDeposit: e.target.value })}
                            required
                          />
                        </div>
                      </div>
                      <div className="form-row">
                        <div className="form-group">
                          <label>Minimum Withdrawal Amount (₹)</label>
                          <input
                            type="number"
                            value={settingsData.minWithdrawal}
                            onChange={(e) => setSettingsData({ ...settingsData, minWithdrawal: e.target.value })}
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label>Daily ROI Standard Percentage (%)</label>
                          <input
                            type="number"
                            step="0.01"
                            value={settingsData.dailyROIPercentage}
                            onChange={(e) => setSettingsData({ ...settingsData, dailyROIPercentage: e.target.value })}
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <div className="settings-section">
                      <h3>Admin Deposit Options (Scan & Pay Details)</h3>
                      <div className="form-group">
                        <label>Admin UPI ID</label>
                        <input
                          type="text"
                          value={settingsData.adminUpiId}
                          onChange={(e) => setSettingsData({ ...settingsData, adminUpiId: e.target.value })}
                          required
                          placeholder="e.g. wealthflow@upi"
                        />
                      </div>
                      <div className="form-row">
                        <div className="form-group">
                          <label>Bank Name</label>
                          <input
                            type="text"
                            value={settingsData.adminBankName}
                            onChange={(e) => setSettingsData({ ...settingsData, adminBankName: e.target.value })}
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label>Account Holder Name</label>
                          <input
                            type="text"
                            value={settingsData.adminBankAccountHolder}
                            onChange={(e) => setSettingsData({ ...settingsData, adminBankAccountHolder: e.target.value })}
                            required
                          />
                        </div>
                      </div>
                      <div className="form-row">
                        <div className="form-group">
                          <label>Account Number</label>
                          <input
                            type="text"
                            value={settingsData.adminBankAccountNumber}
                            onChange={(e) => setSettingsData({ ...settingsData, adminBankAccountNumber: e.target.value })}
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label>IFSC Code</label>
                          <input
                            type="text"
                            value={settingsData.adminBankIfsc}
                            onChange={(e) => setSettingsData({ ...settingsData, adminBankIfsc: e.target.value.toUpperCase() })}
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <button type="submit" className="save-btn" disabled={btnLoading}>
                      {btnLoading ? "Saving Changes..." : "Save System Settings"}
                    </button>
                  </form>
                </div>
              )}
            </>
          )}
      {/* Image Modal for paymentProof screenshot */}
      {selectedProof && (
        <div className="modal-overlay" onClick={() => setSelectedProof(null)}>
          <div className="image-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal-btn" onClick={() => setSelectedProof(null)}><FaTimes /></button>
            <img src={selectedProof} alt="Payment Proof" className="large-proof-img" />
          </div>
        </div>
      )}

      {/* Balance Adjustment Modal */}
      {balanceModal && (
        <div className="modal-overlay" onClick={() => setBalanceModal(null)}>
          <div className="balance-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{balanceModal.type === "credit" ? "Credit" : "Debit"} Wallet</h2>
              <button className="close-btn" onClick={() => setBalanceModal(null)}><FaTimes /></button>
            </div>
            <form onSubmit={handleBalanceAdjustment} className="modal-form">
              <p>User: <strong>{balanceModal.fullName}</strong></p>
              <div className="form-group">
                <label>Amount (₹)</label>
                <input
                  type="number"
                  placeholder="Enter Amount"
                  value={balanceModal.amount}
                  onChange={(e) => setBalanceModal({ ...balanceModal, amount: e.target.value })}
                  required
                  min="1"
                />
              </div>
              <div className="form-group">
                <label>Remarks / Notes</label>
                <input
                  type="text"
                  placeholder="Enter Adjustment Reason"
                  value={balanceModal.remarks}
                  onChange={(e) => setBalanceModal({ ...balanceModal, remarks: e.target.value })}
                  required
                />
              </div>
              <button type="submit" className="adjust-submit-btn" disabled={btnLoading}>
                {btnLoading ? "Processing..." : `${balanceModal.type === "credit" ? "Credit" : "Debit"} Balance`}
              </button>
            </form>
          </div>
        </div>
      )}
      </div>
    </Layout>
  );
}

export default AdminPanel;
