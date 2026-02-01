const sgMail = require("@sendgrid/mail");

// Load API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendOtpEmail = async (email, otp) => {
  try {
    const msg = {
      to: email,
      from: process.env.SENDGRID_FROM_EMAIL, // must be verified in SendGrid
      subject: "Your OTP for LuxeMarket",
      text: `Your OTP is ${otp}. It is valid for 5 minutes.`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
         <p>Hello,</p>

<p>You requested a one-time password (OTP) to sign in to <b>LuxeMarket</b>.</p>

<p><b>Your OTP:</b></p>
<h2 style="letter-spacing:3px;">${otp}</h2>

<p>This code is valid for <b>1 minute</b>.</p>

<p>If you did not request this, please ignore this email.</p>

<p>Thanks,<br/>LuxeMarket Team</p>

        </div>
      `
    };

    await sgMail.send(msg);
    console.log("✅ OTP sent via SendGrid");

    return { success: true };
  } catch (error) {
    console.error( "❌ SendGrid Error:",error.response?.body || error.message);
    return { success: false };
  }
};

module.exports = { sendOtpEmail };
