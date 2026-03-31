import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/apiClient";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSendOTP = async () => {
    setError("");
    setMessage("");

    try {
      await API.post("/authentication/forgot-password", { email });

      localStorage.setItem("resetEmail", email);
      setMessage("OTP sent to your email");

      setTimeout(() => {
        navigate("/reset-password");
      }, 1500);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.response?.data?.detail ||
          "Error sending OTP"
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-100">
      <div className="bg-white p-6 rounded-xl shadow-md w-80">
        <h2 className="text-xl font-bold mb-4 text-center">Forgot Password</h2>

        <input
          type="email"
          placeholder="Enter your email"
          className="w-full border p-2 rounded mb-3"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {error && <p className="text-red-500 text-sm">{error}</p>}
        {message && <p className="text-green-600 text-sm">{message}</p>}

        <button
          onClick={handleSendOTP}
          className="w-full bg-blue-600 text-white py-2 rounded mt-3"
        >
          Send OTP
        </button>
      </div>
    </div>
  );
}

export default ForgotPassword;
