const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { sendOtpEmail } = require("../services/emailService");

/* ================= HELPERS ================= */
const generateAuthResponse = (user) => {
  const token = jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  return {
    success: true,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      mobile: user.mobile,
    },
  };
};

/* ================= SEND OTP (LOGIN) ================= */
exports.sendOTP = async (req, res) => {
  try {
    console.log("[SEND OTP] Request received", req.body);

    const { email } = req.body;
    if (!email) {
      console.error("[SEND OTP] Email is missing");
      return res.status(400).json({ success: false, message: "Email is required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      console.error(`[SEND OTP] Email not registered: ${email}`);
      return res.status(400).json({ success: false, message: "Email not registered" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log(`[SEND OTP] Generated OTP: ${otp}`);

    const otpToken = jwt.sign(
      { email, otp, type: "login" },
      process.env.JWT_SECRET,
      { expiresIn: "10m" } // ⬅️ increased for mobile delay
    );
    console.log(`[SEND OTP] Generated OTP Token: ${otpToken}`);

    const result = await sendOtpEmail(email, otp);
    if (!result.success) {
      console.error(`[SEND OTP] Failed to send OTP to ${email}`);
      return res.status(500).json({ success: false, message: "Failed to send OTP" });
    }

    console.log(`[SEND OTP] OTP sent successfully to ${email}`);
    res.json({
      success: true,
      message: "OTP sent successfully",
      otpToken,
    });
  } catch (error) {
    console.error("[SEND OTP] Server error", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/* ================= VERIFY OTP ================= */
exports.verifyOTP = async (req, res) => {
  try {
    console.log("[DEBUG] verifyOTP method called");
    console.log("[DEBUG] Request body:", req.body);

    const { otpToken, otp } = req.body;
    if (!otpToken || !otp) {
      console.error("[DEBUG] Missing otpToken or otp");
      return res.status(400).json({ success: false, message: "OTP required" });
    }

    console.log("[DEBUG] Decoding token...");
    const decoded = jwt.verify(otpToken, process.env.JWT_SECRET);
    console.log("[DEBUG] Token decoded:", decoded);

    if (decoded.type !== "login" || String(decoded.otp) !== String(otp)) {
      console.error("[DEBUG] Invalid OTP", { decodedOtp: decoded.otp, providedOtp: otp });
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    console.log("[DEBUG] Looking up user...");
    const user = await User.findOne({ email: decoded.email });
    if (!user) {
      console.error(`[DEBUG] User not found: ${decoded.email}`);
      return res.status(404).json({ success: false, message: "User not found" });
    }

    console.log("[DEBUG] OTP verified successfully");
    res.json(generateAuthResponse(user));
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      console.error("[DEBUG] OTP expired", error);
      return res.status(400).json({ success: false, message: "OTP expired" });
    }
    console.error("[DEBUG] Server error", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/* ================= SIGNUP ================= */
exports.signup = async (req, res) => {
  try {
    const { name, email, mobile, password } = req.body;

    if (!name || !email || !mobile || !password) {
      return res.status(400).json({ success: false, message: "All fields required" });
    }

    const existingUser = await User.findOne({
      $or: [{ email }, { mobile }],
    });

    if (existingUser) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      mobile,
      password: hashedPassword,
    });

    res.status(201).json({
      success: true,
      message: "Signup successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("SIGNUP ERROR 👉", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/* ================= LOGIN (PASSWORD) ================= */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email & password required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: "Email not registered" });
    }

    console.log("[LOGIN DEBUG] Entered password:", password);
    console.log("[LOGIN DEBUG] Stored hash:", user.password);

    const isMatch = await bcrypt.compare(password, user.password);
    console.log("[LOGIN] Password comparison result:", isMatch);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Invalid password" });
    }

    res.json(generateAuthResponse(user));
  } catch (error) {
    console.error("LOGIN ERROR 👉", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


/* ================= FORGOT PASSWORD ================= */
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: "Email not registered" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const otpToken = jwt.sign(
      { email, otp, type: "reset" },
      process.env.JWT_SECRET,
      { expiresIn: "5m" }
    );

    const result = await sendOtpEmail(email, otp);
    if (!result.success) {
      return res.status(500).json({ success: false, message: "Failed to send OTP" });
    }

    res.json({
      success: true,
      message: "Password reset OTP sent",
      otpToken,
    });
  } catch (error) {
    console.error("FORGOT PASSWORD ERROR 👉", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


/* ================= VERIFY RESET OTP ================= */
exports.verifyResetOTP = async (req, res) => {
  try {
    const { otpToken, otp } = req.body;
    if (!otpToken || !otp) {
      return res.status(400).json({ success: false, message: "OTP required" });
    }

    const decoded = jwt.verify(otpToken, process.env.JWT_SECRET);

    if (decoded.type !== "reset" || String(decoded.otp) !== String(otp)) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }
    res.json({
      success: true,
      message: "OTP verified successfully",
    });
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(400).json({ success: false, message: "OTP expired" });
    }
    console.error("VERIFY RESET OTP ERROR 👉", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


/* ================= RESET PASSWORD ================= */
exports.resetPassword = async (req, res) => {
  try {
    const { otpToken, otp, newPassword, confirmPassword } = req.body;

    // Validate required fields
    if (!otpToken || !otp || !newPassword || !confirmPassword) {
      return res.status(400).json({ success: false, message: "OTP token, OTP, and passwords are required" });
    }

    // Check if passwords match
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ success: false, message: "Passwords do not match" });
    }

    // Verify the OTP token
    const decoded = jwt.verify(otpToken, process.env.JWT_SECRET);
    if (decoded.otp !== otp) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    // Proceed with password reset logic (e.g., update the user's password in the database)
    const user = await User.findOne({ email: decoded.email });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.status(200).json({ success: true, message: "Password reset successfully" });
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(400).json({ success: false, message: "OTP expired" });
    }
    console.error("RESET PASSWORD ERROR 👉", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};



/* ================= PROFILE ================= */
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      user: {
        id: user._id,   // ✅ normalize here
        name: user.name,
        email: user.email,
        mobile: user.mobile,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};


/* ================= VERIFY RESET PASSWORD ================= */
exports.verifyResetPassword = async (req, res) => {
  try {
    const { otpToken } = req.body;

    console.log("[VERIFY RESET PASSWORD] Request body:", req.body);

    if (!otpToken) {
      return res.status(400).json({ success: false, message: "OTP token is required" });
    }

    // Verify the OTP token
    const decoded = jwt.verify(otpToken, process.env.JWT_SECRET);
    // Removed email validation as it is extracted from otpToken

    res.status(200).json({ success: true, message: "OTP token verified successfully" });
  } catch (error) {
    console.error("[VERIFY RESET PASSWORD] Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

