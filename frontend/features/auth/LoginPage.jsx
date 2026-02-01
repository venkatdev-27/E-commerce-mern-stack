import { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../../store/authSlice.js";
import { Eye, EyeOff } from "lucide-react";

function Login() {
  const [loginMethod, setLoginMethod] = useState("email");
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [otpEmail, setOtpEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpToken, setOtpToken] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(0);



  const navigate = useNavigate();
  const dispatch = useDispatch();

  /* ================= TIMER ================= */
  useEffect(() => {
    if (timer === 0) return;
    const interval = setInterval(() => {
      setTimer((t) => t - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);



  /* ================= EMAIL LOGIN ================= */
  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {email,password });

      localStorage.setItem("token", res.data.token);

      const profileRes = await axios.get(
        "http://localhost:5000/api/auth/profile",
        { headers: { Authorization: `Bearer ${res.data.token}` } }
      );

      dispatch(
        login({
          id: profileRes.data._id,
          name: profileRes.data.name,
          email: profileRes.data.email,
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
            profileRes.data.name
          )}&background=random`
        })
      );

      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  /* ================= SEND OTP ================= */
  const handleEmailOtpSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await axios.post("http://localhost:5000/api/auth/send-otp", {
        email: otpEmail
      });
      setOtpToken(res.data.otpToken);
      setStep(2);
      setTimer(60);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  /* ================= VERIFY OTP ================= */
  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/verify-otp",
        { otpToken, otp }
      );

      localStorage.setItem("token", res.data.token);

      const profileRes = await axios.get(
        "http://localhost:5000/api/auth/profile",
        { headers: { Authorization: `Bearer ${res.data.token}` } }
      );

      dispatch(
        login({
          id: profileRes.data._id,
          name: profileRes.data.name,
          email: profileRes.data.email,
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
            profileRes.data.name
          )}&background=random`
        })
      );

      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setStep(1);
    setOtp("");
    setOtpToken("");
    setError("");
    setTimer(0);
  };



  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white shadow-xl rounded-2xl p-8">
        <h2 className="text-3xl font-bold text-center mb-2">Welcome Back</h2>
        <p className="text-gray-600 text-center mb-6">
          Sign in to your account
        </p>

        {/* ================= EMAIL LOGIN ================= */}
        {loginMethod === "email" && (
          <form className="space-y-5" onSubmit={handleEmailLogin}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-3 border rounded-lg"
            />

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full p-3 pr-10 border rounded-lg"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {error && <p className="text-red-600 text-sm">{error}</p>}

            <button
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>

            <div className="flex justify-between items-center">
              <Link
                to="/forgot-password"
                className="text-blue-600 text-sm hover:underline"
              >
                Forgot Password?
              </Link>
              <button
                type="button"
                onClick={() => setLoginMethod("otp")}
                className="text-blue-600 text-sm hover:underline"
              >
                Login with OTP
              </button>
            </div>
          </form>
        )}

        {/* ================= SEND OTP ================= */}
        {loginMethod === "otp" && step === 1 && (
          <form className="space-y-5" onSubmit={handleEmailOtpSubmit}>
            <input
              type="email"
              placeholder="Email"
              value={otpEmail}
              onChange={(e) => setOtpEmail(e.target.value)}
              required
              className="w-full p-3 border rounded-lg"
            />

            {error && <p className="text-red-600 text-sm">{error}</p>}

            <button
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg"
            >
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>

            <button
              type="button"
              onClick={() => setLoginMethod("email")}
              className="w-full text-blue-600"
            >
              Login with Password
            </button>
          </form>
        )}

        {/* ================= VERIFY OTP ================= */}
        {loginMethod === "otp" && step === 2 && (
          <form className="space-y-5" onSubmit={handleOtpSubmit}>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) =>
                setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
              }
              required
              className="w-full p-3 border rounded-lg text-center tracking-widest"
            />

            {error && <p className="text-red-600 text-sm">{error}</p>}

            <button
              disabled={loading}
              className="w-full bg-green-600 text-white py-3 rounded-lg"
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>

            <button
              type="button"
              disabled={timer > 0}
              onClick={handleEmailOtpSubmit}
              className="w-full text-blue-600"
            >
              {timer > 0 ? `Resend OTP in ${timer}s` : "Resend OTP"}
            </button>

            <button
              type="button"
              onClick={handleBack}
              className="w-full text-blue-600"
            >
              Change Email
            </button>
          </form>
        )}

        <p className="text-center mt-6">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-blue-600 font-semibold">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
