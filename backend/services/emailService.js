const sgMail = require("@sendgrid/mail");

const APP_NAME = "LuxeMarket";

// Safety check
if (!process.env.SENDGRID_API_KEY) {
  console.error("❌ SENDGRID_API_KEY is missing");
}

if (!process.env.SENDGRID_FROM_EMAIL) {
  console.error("❌ SENDGRID_FROM_EMAIL is missing");
}

// Load API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendOtpEmail = async (email, otp, expiresIn = "2 minutes") => {
  try {
    const msg = {
      to: email,
      from: process.env.SENDGRID_FROM_EMAIL, // must be verified
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

    await sgMail.send(msg);
    console.log("✅ OTP sent via SendGrid");

    return { success: true };
  } catch (error) {
    console.error(
      "❌ SendGrid Error:",
      error.response?.body || error.message
    );
    return { success: false };
  }
};

module.exports = { sendOtpEmail };
