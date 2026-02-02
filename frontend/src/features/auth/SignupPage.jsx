import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Eye, EyeOff } from "lucide-react";
import axiosInstance from "@/api/axiosInstance";
import { login } from "@/store/authSlice";
import { useToast } from "@/context/ToastContext";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { addToast } = useToast();

 const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    /* ================= SIGNUP ================= */
    await axiosInstance.post("/auth/signup", {
      name,
      email,
      mobile,
      password,
    });

    /* ================= AUTO LOGIN ================= */
    const loginRes = await axiosInstance.post("/auth/login", {
      email,
      password,
    });

    const token = loginRes.token;
    const rawUser = loginRes.user;

    if (!token || !rawUser) {
      throw new Error("Invalid login response");
    }

    /* ================= NORMALIZE USER ================= */
    const user = {
      id: rawUser.id || rawUser._id,
      name: rawUser.name,
      email: rawUser.email,
      mobile: rawUser.mobile,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
        rawUser.name
      )}&background=random`,
    };

    /* ================= SAVE TOKEN ================= */
    localStorage.setItem("token", token);

    /* ================= REDUX LOGIN ================= */
    dispatch(
      login({
        user,
        token,
      })
    );

    /* ================= SUCCESS ================= */
    addToast("Account created successfully 🎉", "success");
    navigate("/");
  } catch (error) {
    console.error(error);
    addToast(error.message || "Signup failed. Try again.", "error");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white shadow-xl rounded-2xl p-8 border">
        <h2 className="text-3xl font-bold text-center mb-2">Create Account</h2>
        <p className="text-gray-600 text-center mb-6">
          Join us today and start shopping
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={loading}
            className="w-full p-3 border rounded-lg"
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
            className="w-full p-3 border rounded-lg"
          />

          <input
            type="tel"
            placeholder="Mobile Number"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            required
            disabled={loading}
            className="w-full p-3 border rounded-lg"
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              className="w-full p-3 pr-10 border rounded-lg"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-gray-400"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg disabled:opacity-50"
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p className="text-center mt-6 text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-indigo-600 font-semibold">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
