
import React, { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../components/Layout/Layout";
import "./Profile.css";
import { FaWallet,  FaChartLine,  FaCoins,  FaUsers} from "react-icons/fa";
function Profile() {

const [user, setUser] = useState(null);   

const [showEditModal, setShowEditModal] = useState(false);

const [editForm, setEditForm] = useState({
  fullName: "",
  email: "",
  mobileNumber: "",
});
const [showBankModal, setShowBankModal] = useState(false);

const [bankForm, setBankForm] = useState({
  bankName: "",
  accountHolderName: "",
  accountNumber: "",
  ifscCode: "",
  upiId: "",
});
const [showPasswordModal, setShowPasswordModal] = useState(false);
const [passwordForm, setPasswordForm] = useState({
  oldPassword: "",
  newPassword: "",
  confirmPassword: "",
});
const [showPassword, setShowPassword] = useState(false);


const handleChange = (e) => {
  setPasswordForm({
    ...passwordForm,
    [e.target.name]: e.target.value,
  });
};
const fetchProfile = async () => {
  try {
    const token = localStorage.getItem("token");
    const res = await axios.get(
      "http://localhost:5000/api/users/profile",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    setUser(res.data.user);
  } catch (error) {
    console.log(error);
  }
};
useEffect(() => {
    fetchProfile();
  }, []);


const openEditModal = () => {

  if (!user) return;

  setEditForm({
    fullName: user?.fullName || "",
    email: user?.email || "",
    mobileNumber: user?.mobileNumber || "",
  });

  setShowEditModal(true);

};

const openBankModal = () => {

  setBankForm({
    bankName: user.bankName || "",
    accountHolderName: user.accountHolderName || "",
    accountNumber: user.accountNumber || "",
    ifscCode: user.ifscCode || "",
    upiId: user.upiId || "",
  });

  setShowBankModal(true);

};
const saveProfile = async () => {
  try {

    const token = localStorage.getItem("token");

    const res = await axios.put(
      "http://localhost:5000/api/users/profile",
      editForm,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    alert(res.data.message);

    setUser(res.data.user);

    setShowEditModal(false);

  } catch (error) {

    console.log(error);

    alert("Unable to update profile.");

  }
};

const saveBankDetails = async () => {

  try {

    const token = localStorage.getItem("token");

    const res = await axios.put(
      "http://localhost:5000/api/users/bank-details",
      bankForm,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    alert(res.data.message);

    setUser(res.data.user);

    setShowBankModal(false);

  } catch (error) {

    alert("Unable to update bank details");

  }

};

const updatePassword = async () => {

  if (passwordForm.newPassword !== passwordForm.confirmPassword) {
    alert("New Password and Confirm Password do not match.");
    return;
  }

  try {

    const token = localStorage.getItem("token");

    const res = await axios.put(

      "http://localhost:5000/api/users/change-password",

      {
        oldPassword: passwordForm.oldPassword,
        newPassword: passwordForm.newPassword,
      },

      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }

    );

    alert(res.data.message);

    setPasswordForm({
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    });

    setShowPasswordModal(false);

  } catch (error) {

    alert(
      error.response?.data?.message ||
      "Unable to change password."
    );

  }

};
const verifyEmail = async () => {

  try {

    const token = localStorage.getItem("token");

    const res = await axios.put(
      "http://localhost:5000/api/users/verify-email",
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    alert(res.data.message);

    fetchProfile();

  } catch (error) {

    alert("Unable to verify email");

  }

};
const verifyMobile = async () => {

  try {

    const token = localStorage.getItem("token");

    const res = await axios.put(
      "http://localhost:5000/api/users/verify-mobile",
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    alert(res.data.message);

    fetchProfile();

  } catch (error) {

    alert("Unable to verify mobile");

  }

};
const toggleTwoFactor = async () => {

  try {

    const token = localStorage.getItem("token");

    const res = await axios.put(
      "http://localhost:5000/api/users/two-factor",
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    alert(res.data.message);

    fetchProfile();

  } catch (error) {

    alert("Unable to update Two-Factor Authentication");

  }

};
  if (!user) {
    return (
      <Layout>
        <div className="profile-page">
          <h2>Loading Profile...</h2>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="profile-page">
        <div className="profile-header">
          <div className="profile-left">
            <div className="profile-image">
              <img src="/WealthFlow.png" alt="Profile" />
            </div>
            <div>
              <h1>{user.fullName}</h1>
              <p>
  {user.email}
  {user.emailVerified && " ✅"}
</p>
              <span className="status">
                🟢 {user.accountStatus} Member
              </span>
            </div>
          </div>
       <button className="edit-btn" onClick={openEditModal}>Edit Profile</button>
        </div>
        <div className="profile-card">
          <div className="card-title">
            <h2>Personal Information</h2>
          </div>
          <div className="profile-grid">
            <div className="profile-item">
              <label>Full Name</label>
              <p>{user.fullName}</p>
            </div>
            <div className="profile-item">
              <label>Email Address</label>
              <p>
  {user.email}
  {user.emailVerified && " ✅"}
</p>
            </div>
            <div className="profile-item">
              <label>Mobile Number</label>
              <p>
  {user.mobileNumber}
  {user.mobileVerified && " ✅"}
</p>
            </div>
            <div className="profile-item">
              <label>Referral Code</label>
              <p>{user.referralCode}</p>
            </div>
            <div className="profile-item">
              <label>Member Since</label>
              <p>
                {new Date(user.createdAt).toLocaleDateString("en-IN")}
              </p>
            </div>
            <div className="profile-item">
              <label>Account Status</label>
              <p className="active-status">
                {user.accountStatus}
              </p>
            </div>

          </div>

        </div>

        <div className="profile-card">

  <div className="card-title">
    <h2>Investment Summary</h2>
    <span>Financial Overview</span>
  </div>

  <div className="summary-grid">

    <div className="summary-card wallet">

      <div className="card-top">
        <div className="summary-icon">
          <FaWallet />
        </div>

        <div className="growth positive">
          +12.5%
        </div>
      </div>

      <p>Wallet Balance</p>

      <h2>
        ₹ {user.walletBalance?.toLocaleString() || 0}
      </h2>

    </div>

    <div className="summary-card investment">

      <div className="card-top">
        <div className="summary-icon">
          <FaChartLine />
        </div>

        <div className="growth positive">
          Active
        </div>
      </div>

      <p>Total Investment</p>

      <h2>
        ₹ {user.totalInvestment?.toLocaleString() || 0}
      </h2>

    </div>

    <div className="summary-card roi">

      <div className="card-top">
        <div className="summary-icon">
          <FaCoins />
        </div>

        <div className="growth positive">
          ROI
        </div>
      </div>

      <p>Total ROI Earned</p>

      <h2>
        ₹ {user.totalROIEarned?.toLocaleString() || 0}
      </h2>

    </div>

    <div className="summary-card referral">

      <div className="card-top">
        <div className="summary-icon">
          <FaUsers />
        </div>

        <div className="growth positive">
          Team
        </div>
      </div>

      <p>Referral Income</p>

      <h2>
        ₹ {user.totalLevelIncomeEarned?.toLocaleString() || 0}
      </h2>

    </div>

  </div>

</div>

        <div className="profile-card">

          <div className="card-title">
            <h2>Bank Details</h2>
          </div>

          <div className="profile-grid">

            <div className="profile-item">
              <label>Bank Name</label>
              <p>{user.bankName || "Not Added"}</p>
            </div>

            <div className="profile-item">
              <label>Account Holder</label>
              <p>{user.accountHolderName || "Not Added"}</p>
            </div>

            <div className="profile-item">
              <label>Account Number</label>
              <p>{user.accountNumber || "Not Added"}</p>
            </div>

            <div className="profile-item">
              <label>IFSC Code</label>
              <p>{user.ifscCode || "Not Added"}</p>
            </div>

            <div className="profile-item">
              <label>UPI ID</label>
              <p>{user.upiId || "Not Added"}</p>
            </div>
<button className="edit-btn" onClick={openBankModal}> Edit Bank Details</button>
          </div>

        </div>

        <div className="profile-card">

          <div className="card-title">
            <h2>Security Settings</h2>
          </div>

          <div className="security-grid">

           
<button
  className="security-btn"
  onClick={() => setShowPasswordModal(true)}
>
  🔒 Change Password
</button>


            <button
  className="security-btn"
  onClick={verifyEmail}
>
  {user.emailVerified
    ? "✅ Email Verified"
    : "📧 Verify Email"}
</button>

            <button
  className="security-btn"
  onClick={verifyMobile}
>
  {user.mobileVerified
    ? "✅ Mobile Verified"
    : "📱 Verify Mobile"}
</button>

           <button
  className="security-btn"
  onClick={toggleTwoFactor}
>
  {user.twoFactorEnabled
    ? "🛡 2FA Enabled"
    : "🛡 Enable Two-Factor Authentication"}
</button>
          </div>
        </div>
          </div>

{showPasswordModal && (

<div className="modal-overlay">
  <div className="modal-box">
    <h2>Change Password</h2>
    <div className="form-group">
      <label>Current Password</label>
    <input
  type={showPassword ? "text" : "password"}  name="oldPassword"  value={passwordForm.oldPassword}  onChange={handleChange}
  placeholder="Enter Current Password"
/>   </div>
    <div className="form-group">
      <label>New Password</label>
     <input
  type={showPassword ? "text" : "password"}
  name="newPassword"
  value={passwordForm.newPassword}
  onChange={handleChange}
  placeholder="Enter New Password"
/>
    </div>
    <div className="form-group">
     <label>Confirm New Password</label>
   <input
  type={showPassword ? "text" : "password"}
  name="confirmPassword"
  value={passwordForm.confirmPassword}
  onChange={handleChange}
  placeholder="Confirm New Password"
/>
    </div>
    <div className="show-password-container">
  <input
    type="checkbox"
    checked={showPassword}
    onChange={() => setShowPassword(!showPassword)}
  />
  <label>Show Password</label>
</div>
    <div className="modal-buttons">
      <button  className="save-btn"  onClick={updatePassword}> Update Password</button>
      <button className="cancel-btn" onClick={() => setShowPasswordModal(false)}>
        Cancel
      </button>
    </div>
  </div>
</div>
)}
{showEditModal && (

<div className="modal-overlay">

  <div className="modal-box">

    <h2>Edit Profile</h2>

    <div className="form-group">

      <label>Full Name</label>

      <input
        type="text"
        value={editForm.fullName}
        onChange={(e) =>
          setEditForm({
            ...editForm,
            fullName: e.target.value,
          })
        }
      />

    </div>

    <div className="form-group">

      <label>Email</label>

      <input
        type="email"
        value={editForm.email}
        onChange={(e) =>
          setEditForm({
            ...editForm,
            email: e.target.value,
          })
        }
      />

    </div>

    <div className="form-group">

      <label>Mobile Number</label>

      <input
        type="text"
        value={editForm.mobileNumber}
        onChange={(e) =>
          setEditForm({
            ...editForm,
            mobileNumber: e.target.value,
          })
        }
      />

    </div>

    <div className="modal-buttons">

      <button
        className="save-btn"
        onClick={saveProfile}
      >
        Save Changes
      </button>

      <button
        className="cancel-btn"
        onClick={() => setShowEditModal(false)}
      >
        Cancel
      </button>

    </div>


  </div>

</div>


)}

{showBankModal && (

<div className="modal-overlay">

  <div className="modal-box">

    <h2>Bank Details</h2>

    <div className="form-group">
      <label>Bank Name</label>
      <input
        type="text"
        value={bankForm.bankName}
        onChange={(e) =>
          setBankForm({
            ...bankForm,
            bankName: e.target.value,
          })
        }
      />
    </div>

    <div className="form-group">
      <label>Account Holder Name</label>
      <input
        type="text"
        value={bankForm.accountHolderName}
        onChange={(e) =>
          setBankForm({
            ...bankForm,
            accountHolderName: e.target.value,
          })
        }
      />
    </div>

    <div className="form-group">
      <label>Account Number</label>
      <input
        type="text"
        value={bankForm.accountNumber}
        onChange={(e) =>
          setBankForm({
            ...bankForm,
            accountNumber: e.target.value,
          })
        }
      />
    </div>

    <div className="form-group">
      <label>IFSC Code</label>
      <input
        type="text"
        value={bankForm.ifscCode}
        onChange={(e) =>
          setBankForm({
            ...bankForm,
            ifscCode: e.target.value,
          })
        }
      />
    </div>

    <div className="form-group">
      <label>UPI ID</label>
      <input
        type="text"
        value={bankForm.upiId}
        onChange={(e) =>
          setBankForm({
            ...bankForm,
            upiId: e.target.value,
          })
        }
      />
    </div>

    <div className="modal-buttons">

      <button
        className="save-btn"
        onClick={saveBankDetails}
      >
        Save Details
      </button>

      <button
        className="cancel-btn"
        onClick={() => setShowBankModal(false)}
      >
        Cancel
      </button>

    </div>

  </div>

</div>

)}
    </Layout>
  );
}

export default Profile;

