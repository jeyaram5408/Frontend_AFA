import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import PageWrapper from "../PageWrapper";
import Loader from "../Loader";
import { GoogleLogin } from "@react-oauth/google";
import API from "../api/apiClient";
import { loginUser } from "../api/jwt";
import { toast } from "react-toastify";

const parseJwt = (token) => {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    return null;
  }
};

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const handleRedirectByRole = (accessToken) => {
    const payload = parseJwt(accessToken);
    const role = payload?.role?.toLowerCase?.().trim?.();

    if (role === "admin") {
      navigate("/admin");
    } else {
      navigate("/dashboard");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let newErrors = {};

    if (!emailRegex.test(email)) {
      newErrors.email = "Invalid email format";
    }

    if (!password) {
      newErrors.password = "Password required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      const res = await loginUser({ email, password });

      localStorage.setItem("access_token", res.data.access_token);
      localStorage.setItem("refresh_token", res.data.refresh_token);

      toast.success("Login successful 🎉");

      setTimeout(() => {
        handleRedirectByRole(res.data.access_token);
      }, 1000);
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.detail ||
        "Login failed";

      setErrors({ general: message }); // optional
      toast.error(message); // ✅ correct place
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async (credentialResponse) => {
    try {
      const token = credentialResponse.credential;
      const res = await API.post("/authentication/google", { token });

      localStorage.setItem("access_token", res.data.access_token);
      localStorage.setItem("refresh_token", res.data.refresh_token);

      toast.success("Google login successful 🚀");

      setTimeout(() => {
        handleRedirectByRole(res.data.access_token);
      }, 1000);
    } catch (err) {
      console.error("Google Login Error", err);

      const message =
        err.response?.data?.message ||
        err.response?.data?.detail ||
        "Google login failed";

      toast.error(message); // ✅ correct

      // optional (remove if not needed)
      setErrors({ general: message });
    }
  };

  return (
    <PageWrapper>
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-indigo-500/90 to-blue-400/90 backdrop-blur px-4">
        <div className="bg-white/90 shadow-2xl rounded-2xl p-8 sm:p-10 max-w-md w-full">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 text-center">
            AI-Powered Finance Advisor
          </h1>

          <p className="text-center text-gray-500 mt-2 mb-8">
            Manage smarter. Save better.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-gray-700 mb-2 font-medium">
                Email
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-gray-700 mb-2 font-medium">
                Password
              </label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition pr-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-600"
                  disabled={loading}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>

              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            <div className="flex justify-end text-sm">
              <button
                type="button"
                onClick={() => navigate("/forgot-password")}
                className="text-indigo-600 hover:underline cursor-pointer"
                disabled={loading}
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2.5 rounded-lg font-semibold transition duration-300 flex items-center justify-center ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-linear-to-r from-indigo-600 to-blue-500 hover:opacity-90 cursor-pointer"
              } text-white`}
            >
              {loading ? <Loader /> : "Login"}
            </button>

            {errors.general && (
              <p className="text-red-500 text-sm text-center mt-2">
                {errors.general}
              </p>
            )}

            <div className="text-center text-gray-500 my-4">OR</div>

            <div className="flex justify-center">
              <GoogleLogin
                onSuccess={handleGoogleLogin}
                onError={() => setErrors({ general: "Google login failed" })}
              />
            </div>
          </form>

          <p className="text-center text-sm text-gray-600 mt-6">
            Don’t have an account?{" "}
            <span
              onClick={() => !loading && navigate("/register")}
              className="text-indigo-600 font-semibold cursor-pointer hover:underline"
            >
              Register
            </span>
          </p>
        </div>
      </div>
    </PageWrapper>
  );
}

export default Login;
