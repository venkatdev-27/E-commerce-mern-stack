const nodemailer = require("nodemailer");

const APP_NAME = "LuxeMarket";

// Safety checks
if (!process.env.GMAIL_USER) {
  console.error("❌ GMAIL_USER is missing");
}
if (!process.env.GMAIL_APP_PASSWORD) {
  console.error("❌ GMAIL_APP_PASSWORD is missing");
}

// Create reusable transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

const sendOtpEmail = async (email, otp, expiresIn = "2 minutes") => {
  try {
    const msg = {
      from: `"${APP_NAME}" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: `Your OTP for ${APP_NAME}`,
      text: `Your OTP is ${otp}. It is valid for ${expiresIn}.`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <p>Hello,</p>

          <p>You requested a one-time password (OTP) to continue on <b>${APP_NAME}</b>.</p>

          <p><b>Your OTP:</b></p>
          <h2 style="letter-spacing:3px;">${otp}</h2>

          <p>This code is valid for <b>${expiresIn}</b>.</p>

          <p>If you did not request this, please ignore this email.</p>

          <p>Thanks,<br/>${APP_NAME} Team</p>
        </div>
      `,
    };

    await transporter.sendMail(msg);
    console.log("✅ OTP sent via Nodemailer (Gmail)");

    return { success: true };
  } catch (error) {
    console.error("❌ Nodemailer Error:", error.message);
    return { success: false };
  }
};

module.exports = { sendOtpEmail, transporter };
