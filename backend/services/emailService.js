const nodemailer = require("nodemailer");

const sendOtpEmail = async (email, otp) => {
  // If SMTP is not fully configured, fallback to console log
  if (
    !process.env.EMAIL_HOST ||
    !process.env.EMAIL_USER ||
    !process.env.EMAIL_PASS
  ) {
    console.log("=========================================");
    console.log(`[DEVELOPMENT EMAIL FALLBACK]`);
    console.log(`To: ${email}`);
    console.log(`Subject: WealthFlow Password Reset OTP`);
    console.log(`Your OTP is: ${otp}`);
    console.log("=========================================");
    return true;
  }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT) || 587,
      secure: parseInt(process.env.EMAIL_PORT) === 465, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_FROM || `"WealthFlow" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "WealthFlow - Password Reset OTP",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #dbe5dc; border-radius: 10px;">
          <h2 style="color: #0A7A16; text-align: center;">WealthFlow Password Reset</h2>
          <p>Hello,</p>
          <p>You requested a password reset. Please use the following One-Time Password (OTP) to reset your password:</p>
          <div style="text-align: center; margin: 30px 0;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #0A7A16; background-color: #f8fff7; padding: 10px 20px; border: 1px dashed #2FAE1A; border-radius: 5px;">
              ${otp}
            </span>
          </div>
          <p>This OTP is valid for 15 minutes. If you did not request a password reset, please ignore this email.</p>
          <hr style="border: none; border-top: 1px solid #dbe5dc;" />
          <p style="font-size: 12px; color: #64748b; text-align: center;">&copy; ${new Date().getFullYear()} WealthFlow. All rights reserved.</p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent successfully: ${info.messageId}`);
    return true;
  } catch (error) {
    console.error("Failed to send OTP email:", error);
    // Even if it fails, log the OTP in the console so developers don't get blocked
    console.log("=========================================");
    console.log(`[FALLBACK DUE TO ERROR]`);
    console.log(`To: ${email}`);
    console.log(`Your OTP is: ${otp}`);
    console.log("=========================================");
    throw new Error(`Email delivery failed: ${error.message}`);
  }
};

module.exports = {
  sendOtpEmail,
};
