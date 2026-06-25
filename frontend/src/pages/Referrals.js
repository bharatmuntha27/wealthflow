import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import Layout from "../components/Layout/Layout";
import {  FaUsers,  FaUserFriends,  FaMoneyBillWave,  FaCopy,  FaLink} from "react-icons/fa";
import "./Referrals.css";
function Referrals() {
  const [user, setUser] = useState(null);
  const [referrals, setReferrals] = useState([]);
  const [tree, setTree] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
 const fetchProfile = useCallback(async () => {
  try {
    const token = localStorage.getItem("token");
    const { data } = await axios.get(
      "http://localhost:5000/api/users/profile",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    setUser(data.user);
  } catch (error) {
    console.error(error);
  }
}, []);
const fetchReferrals = useCallback(async () => {
  try {
    const token = localStorage.getItem("token");

    const { data } = await axios.get(
      "http://localhost:5000/api/users/referrals/direct",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setReferrals(data.referrals || []);
  } catch (error) {
    console.error(error);
  }
}, []);


const fetchReferralTree = useCallback(async () => {
  try {
    const token = localStorage.getItem("token");

    const { data } = await axios.get(
      "http://localhost:5000/api/users/referrals/tree",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setTree(data.level1 || []);
  } catch (error) {
    console.error(error);
  }
}, []);

  const copyReferralCode = () => {
    navigator.clipboard.writeText(
      user?.referralCode || ""
    );

    alert("Referral Code Copied");
  };

  const copyReferralLink = () => {

    const link =
      `${window.location.origin}/register?ref=${user?.referralCode}`;

    navigator.clipboard.writeText(link);

    alert("Referral Link Copied");
  };

  const filteredReferrals = referrals.filter(
    (member) =>
      member.fullName
        ?.toLowerCase()
        .includes(search.toLowerCase())
  );

  useEffect(() => {
  const loadData = async () => {
    setLoading(true);

    try {
      await Promise.all([
        fetchProfile(),
        fetchReferrals(),
        fetchReferralTree(),
      ]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  loadData();
}, [fetchProfile, fetchReferrals, fetchReferralTree]);

  if (loading) {
    return (
      <Layout>
        <div className="loading-page">
          <h2>Loading Referral Network...</h2>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>

      <div className="referrals-page">

        {/* HEADER */}

        <div className="referral-header-card">

          <div>

            <h4>Your Referral Code</h4>

            <h2>
              {user?.referralCode}
            </h2>

            <p>
              Share your code and earn
              referral commissions.
            </p>

          </div>

          <div className="referral-actions">

            <button
              className="copy-btn"
              onClick={copyReferralCode}
            >
              <FaCopy />
              Copy Code
            </button>

            <button
              className="share-btn"
              onClick={copyReferralLink}
            >
              <FaLink />
              Copy Link
            </button>

          </div>

        </div>

        {/* STATS */}

        <div className="stats-grid">

          <div className="stat-card">

            <FaUsers className="stat-icon" />

            <div>

              <h4>Total Network</h4>

              <h2>{tree.length}</h2>

            </div>

          </div>

          <div className="stat-card">

            <FaUserFriends className="stat-icon" />

            <div>

              <h4>Direct Referrals</h4>

              <h2>{referrals.length}</h2>

            </div>

          </div>

          <div className="stat-card">

            <FaMoneyBillWave className="stat-icon" />

            <div>

              <h4>Total Income</h4>

              <h2>
                ₹{" "}
                {user?.totalLevelIncomeEarned?.toLocaleString() ||
                  0}
              </h2>

            </div>

          </div>

        </div>

        {/* NETWORK */}

        <div className="network-section">

          <div className="section-header">
            <h2>Referral Network</h2>
          </div>

          {tree.length === 0 ? (

            <div className="empty-state">

              <h3>No Referrals Yet</h3>

              <p>
                Share your referral code
                and start growing your network.
              </p>

            </div>

          ) : (

            <div className="network-grid">

              {tree.map((member) => (

                <div
                  key={member._id}
                  className="network-card"
                >

                  <div className="avatar">

                    {member.fullName
                      ?.charAt(0)
                      ?.toUpperCase()}

                  </div>

                  <div>

                    <h4>
                      {member.fullName}
                    </h4>

                    <p>
                      {member.email}
                    </p>

                    <span>
                      Code:
                      {" "}
                      {member.referralCode}
                    </span>

                  </div>

                </div>

              ))}

            </div>

          )}

        </div>

        {/* SEARCH */}

        <div className="table-header">

          <h2>Direct Referrals</h2>

          <input
            type="text"
            placeholder="Search referral..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

        </div>

        {/* TABLE */}

        <div className="table-wrapper">

          <table className="referral-table">

            <thead>

              <tr>

                <th>Name</th>
                <th>Email</th>
                <th>Mobile</th>
                <th>Joined Date</th>

              </tr>

            </thead>

            <tbody>

              {filteredReferrals.length > 0 ? (

                filteredReferrals.map(
                  (member) => (

                    <tr key={member._id}>

                      <td>

                        <div className="user-cell">

                          <div className="small-avatar">

                            {member.fullName
                              ?.charAt(0)
                              ?.toUpperCase()}

                          </div>

                          {member.fullName}

                        </div>

                      </td>

                      <td>
                        {member.email}
                      </td>

                      <td>
                        {member.mobileNumber}
                      </td>

                      <td>

                        {new Date(
                          member.createdAt
                        ).toLocaleDateString(
                          "en-IN"
                        )}

                      </td>

                    </tr>

                  )
                )

              ) : (

                <tr>

                  <td
                    colSpan="4"
                    style={{
                      textAlign:
                        "center",
                      padding: "30px"
                    }}
                  >
                    No Referrals Found
                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>

      </div>

    </Layout>
  );
}

export default Referrals;
