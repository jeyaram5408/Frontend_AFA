import { useState } from "react";
import API from "../api/apiClient";
import { useNavigate } from "react-router-dom";

function ResetPassword() {
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const email = localStorage.getItem("resetEmail");

  const handleReset = async () => {
    setError("");
    setMessage("");

    if (!email) {
      setError("Reset email missing. Please try forgot password again.");
      return;
    }

    try {
      await API.post("/authentication/reset-password", {
        email,
        otp,
        new_password: password,
      });

      setMessage("Password reset successful");
      localStorage.removeItem("resetEmail");

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.response?.data?.detail ||
          "Reset failed"
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-100">
      <div className="bg-white p-6 rounded-xl shadow-md w-80">
        <h2 className="text-xl font-bold mb-4 text-center">Reset Password</h2>

        <input
          type="text"
          placeholder="Enter OTP"
          className="w-full border p-2 rounded mb-2"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />

        <input
          type="password"
          placeholder="New Password"
          className="w-full border p-2 rounded mb-3"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p className="text-red-500 text-sm">{error}</p>}
        {message && <p className="text-green-600 text-sm">{message}</p>}

        <button
          onClick={handleReset}
          className="w-full bg-green-600 text-white py-2 rounded"
        >
          Reset Password
        </button>
      </div>
    </div>
  );
}

export default ResetPassword;
