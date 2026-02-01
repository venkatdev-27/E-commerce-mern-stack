const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { sendOtpEmail } = require("../services/emailService");
exports.sendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    console.log("SEND OTP BODY 👉", req.body);

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Email not registered" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Create JWT token containing email and OTP (expires in 1 minute)
    const otpToken = jwt.sign(
      { email, otp, type: 'login' },
      process.env.JWT_SECRET,
      { expiresIn: '1m' }
    );

    const result = await sendOtpEmail(email, otp);
    if (!result.success) {
      return res.status(500).json({ message: "Failed to send OTP" });
    }

    res.json({ message: "OTP sent successfully", otpToken });
  } catch (error) {
    console.error("SEND OTP ERROR 👉", error);
    res.status(500).json({ message: error.message });
  }
};

/* ================= VERIFY OTP ================= */
exports.verifyOTP = async (req, res) => {
  try {
    const { otpToken, otp } = req.body;

    if (!otpToken || !otp) {
      return res.status(400).json({ message: "OTP token and OTP are required" });
    }

    // Verify and decode JWT token
    const decoded = jwt.verify(otpToken, process.env.JWT_SECRET);

    if (decoded.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (decoded.type !== 'login') {
      return res.status(400).json({ message: "Invalid token type" });
    }

    const user = await User.findOne({ email: decoded.email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token });
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(400).json({ message: "OTP expired" });
    }
    console.error("VERIFY OTP ERROR 👉", error);
    res.status(500).json({ message: error.message });
  }
};


/* ================= SIGNUP ================= */
exports.signup = async (req, res) => {
  try {
    const { name, email, mobile, password } = req.body;

    if (!name || !email || !mobile || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({
      $or: [{ email }, { mobile }]
    });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email,
      mobile,
      password: hashedPassword
    });

    res.status(201).json({ message: "Signup successful" });
  } catch (error) {
    console.error("SIGNUP ERROR 👉", error);
    res.status(500).json({ message: error.message });
  }
};

/* ================= LOGIN (PASSWORD) ================= */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token });
  } catch (error) {
    console.error("LOGIN ERROR 👉", error);
    res.status(500).json({ message: error.message });
  }
};

/* ================= FORGOT PASSWORD (SEND OTP) ================= */
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Email not registered" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Create JWT token containing email and OTP (expires in 1 minute)
    const otpToken = jwt.sign(
      { email, otp, type: 'reset' },
      process.env.JWT_SECRET,
      { expiresIn: '1m' }
    );

    const result = await sendOtpEmail(email, otp);
    if (!result.success) {
      return res.status(500).json({ message: "Failed to send OTP" });
    }

    res.json({ message: "Password reset OTP sent successfully", otpToken });
  } catch (error) {
    console.error("FORGOT PASSWORD ERROR 👉", error);
    res.status(500).json({ message: error.message });
  }
};

/* ================= VERIFY RESET OTP ================= */
exports.verifyResetOTP = async (req, res) => {
  try {
    const { otpToken, otp } = req.body;

    if (!otpToken || !otp) {
      return res.status(400).json({ message: "OTP token and OTP are required" });
    }

    // Verify and decode JWT token
    const decoded = jwt.verify(otpToken, process.env.JWT_SECRET);

    if (decoded.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (decoded.type !== 'reset') {
      return res.status(400).json({ message: "Invalid token type" });
    }

    const user = await User.findOne({ email: decoded.email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "OTP verified successfully" });
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(400).json({ message: "OTP expired" });
    }
    console.error("VERIFY RESET OTP ERROR 👉", error);
    res.status(500).json({ message: error.message });
  }
};

/* ================= RESET PASSWORD ================= */
exports.resetPassword = async (req, res) => {
  try {
    const { otpToken, otp, newPassword, confirmPassword } = req.body;

    if (!otpToken || !otp || !newPassword || !confirmPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    // Verify and decode JWT token
    const decoded = jwt.verify(otpToken, process.env.JWT_SECRET);

    if (decoded.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (decoded.type !== 'reset') {
      return res.status(400).json({ message: "Invalid token type" });
    }

    const user = await User.findOne({ email: decoded.email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    await user.save();

    res.json({ message: "Password reset successfully" });
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(400).json({ message: "OTP expired" });
    }
    console.error("RESET PASSWORD ERROR 👉", error);
    res.status(500).json({ message: error.message });
  }
};

/* ================= PROFILE ================= */
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
