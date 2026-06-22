import React, { useState } from "react";
import axios from "axios";

function Withdraw() {

  const [amount, setAmount] = useState("");

  const handleWithdraw = async () => {

    try {

      const token =
        localStorage.getItem("token");

      const res =
        await axios.post(

          "http://localhost:5000/api/withdraw/request",

          {
            amount,
          },

          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }

        );

      alert(res.data.message);

      setAmount("");

    } catch (error) {

      alert(
        error.response?.data?.message
      );

    }

  };

  return (

    <div>

      <h2>Withdraw Funds</h2>

      <input
        type="number"
        placeholder="Enter Amount"
        value={amount}
        onChange={(e) =>
          setAmount(e.target.value)
        }
      />

      <button
        onClick={handleWithdraw}
      >
        Withdraw
      </button>

    </div>

  );

}

export default Withdraw;