
// Payment module is temporarily disabled.
// We will enable Razorpay integration later.

const createOrder = async (req, res) => {

  res.status(503).json({
    success: false,
    message: "Payment module is under development.",
  });

};

module.exports = {
  createOrder,
};

