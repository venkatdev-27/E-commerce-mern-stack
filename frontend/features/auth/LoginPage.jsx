import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Eye, EyeOff } from "lucide-react";
import axiosInstance from "../../src/api/axiosInstance";
import { login as loginAction } from "../../store/authSlice";

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

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

  /* ================= TIMER ================= */
  useEffect(() => {
    if (!timer) return;
    const id = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(id);
  }, [timer]);

  /* ================= EMAIL LOGIN ================= */
  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await axiosInstance.post("/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.token);

      const profile = await axiosInstance.get("/auth/profile");

      dispatch(
        loginAction({
          id: profile._id,
          name: profile.name,
          email: profile.email,
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
            profile.name
          )}&background=random`,
        })
      );

      navigate("/");
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  /* ================= SEND OTP ================= */
  const sendOtp = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await axiosInstance.post("/auth/send-otp", {
        email: otpEmail,
      });

      setOtpToken(res.otpToken);
      setStep(2);
      setTimer(60);
    } catch (err) {
      setError(err.message || "Failed to send OTP");
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
      const res = await axiosInstance.post("/auth/verify-otp", {
        otpToken,
        otp,
      });

      localStorage.setItem("token", res.token);

      const profile = await axiosInstance.get("/auth/profile");

      dispatch(
        loginAction({
          id: profile._id,
          name: profile.name,
          email: profile.email,
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
            profile.name
          )}&background=random`,
        })
      );

      navigate("/");
    } catch (err) {
      setError(err.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const resetOtpFlow = () => {
    setStep(1);
    setOtp("");
    setOtpToken("");
    setTimer(0);
    setError("");
  };

  /* ================= UI ================= */
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-3xl font-bold text-center mb-2">Welcome Back</h2>

        {loginMethod === "email" && (
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border rounded-lg"
              required
            />

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 pr-10 border rounded-lg"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-400"
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>

            {error && <p className="text-red-600 text-sm">{error}</p>}

            <button className="w-full bg-blue-600 text-white py-3 rounded-lg">
              {loading ? "Signing in..." : "Sign In"}
            </button>

            <button
              type="button"
              onClick={() => setLoginMethod("otp")}
              className="w-full text-blue-600"
            >
              Login with OTP
            </button>
          </form>
        )}

        {loginMethod === "otp" && step === 1 && (
          <div className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              value={otpEmail}
              onChange={(e) => setOtpEmail(e.target.value)}
              className="w-full p-3 border rounded-lg"
              required
            />

            {error && <p className="text-red-600 text-sm">{error}</p>}

            <button
              onClick={sendOtp}
              className="w-full bg-blue-600 text-white py-3 rounded-lg"
            >
              {loading ? "Sending..." : "Send OTP"}
            </button>

            <button
              onClick={() => setLoginMethod("email")}
              className="w-full text-blue-600"
            >
              Login with Password
            </button>
          </div>
        )}

        {loginMethod === "otp" && step === 2 && (
          <form onSubmit={handleOtpSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) =>
                setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
              }
              className="w-full p-3 border rounded-lg text-center"
              required
            />

            {error && <p className="text-red-600 text-sm">{error}</p>}

            <button className="w-full bg-green-600 text-white py-3 rounded-lg">
              Verify OTP
            </button>

            <button
              type="button"
              disabled={timer > 0}
              onClick={sendOtp}
              className="w-full text-blue-600"
            >
              {timer > 0 ? `Resend in ${timer}s` : "Resend OTP"}
            </button>

            <button onClick={resetOtpFlow} className="w-full text-blue-600">
              Change Email
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default Login;
