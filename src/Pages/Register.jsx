import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import PageWrapper from "../PageWrapper";
import { useNavigate } from "react-router-dom";
import API from "../api/apiClient";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [popup, setPopup] = useState({ show: false, message: "" });

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const passwordRegex = {
    upper: /[A-Z]/,
    number: /\d/,
    special: /[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/,
    length: /.{5,}/,
  };

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let newErrors = {};

    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!emailRegex.test(form.email)) newErrors.email = "Invalid email format";

    if (!passwordRegex.length.test(form.password)) {
      newErrors.password = "Password must be at least 5 characters";
    } else if (!passwordRegex.upper.test(form.password)) {
      newErrors.password = "Password must contain at least one uppercase letter";
    } else if (!passwordRegex.number.test(form.password)) {
      newErrors.password = "Password must contain at least one digit";
    } else if (!passwordRegex.special.test(form.password)) {
      newErrors.password = "Password must contain at least one special character";
    }

    if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setErrors({});
      setLoading(true);

      await API.post("/authentication/register", {
        name: form.name,
        email: form.email,
        password: form.password,
      });

      localStorage.setItem("verifyEmail", form.email);

      setPopup({
        show: true,
        message: "Check your email to verify account",
      });
    } catch (err) {
      const apiErrors = err.response?.data?.errors;

      if (apiErrors && Array.isArray(apiErrors)) {
        const formattedErrors = {};
        apiErrors.forEach((e) => {
          const field = e.loc[e.loc.length - 1];
          formattedErrors[field] = e.msg;
        });
        setErrors(formattedErrors);
      } else {
        setErrors({
          general:
            err.response?.data?.message ||
            err.response?.data?.detail ||
            "Registration failed",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper>
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-green-500 to-blue-500 px-4">
        <form
          onSubmit={handleSubmit}
          className="bg-white/90 backdrop-blur-lg p-8 rounded-2xl shadow-2xl w-full max-w-md space-y-5"
        >
          <h2 className="text-2xl font-bold text-center">Create Account</h2>

          <input
            type="text"
            name="name"
            placeholder="Full Name"
            className="w-full border p-2 rounded"
            value={form.name}
            onChange={handleChange}
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}

          <input
            type="text"
            name="email"
            placeholder="Email"
            className="w-full border p-2 rounded"
            value={form.email}
            onChange={handleChange}
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              className="w-full border p-2 rounded pr-10"
              value={form.password}
              onChange={handleChange}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-gray-600"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}

          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm Password"
              className="w-full border p-2 rounded pr-10"
              value={form.confirmPassword}
              onChange={handleChange}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-3 text-gray-600"
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
          )}

          <button
            disabled={loading}
            className={`w-full py-2 rounded transition cursor-pointer text-white ${
              loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? (
              <div className="flex justify-center items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Registering...
              </div>
            ) : (
              "Register"
            )}
          </button>

          {errors.general && (
            <p className="text-red-500 text-sm text-center">{errors.general}</p>
          )}
        </form>
      </div>

      {popup.show && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-80 text-center">
            <h3 className="text-lg font-semibold mb-4">Notification</h3>
            <p className="text-gray-600 mb-6">{popup.message}</p>
            <button
              onClick={() => {
                setPopup({ show: false, message: "" });
                navigate("/verify-otp", { state: { email: form.email } });
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </PageWrapper>
  );
}

export default Register;
