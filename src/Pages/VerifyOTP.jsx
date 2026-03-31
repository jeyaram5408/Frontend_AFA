import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import API from "../api/apiClient";

function VerifyOTP() {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [popup, setPopup] = useState({ show: false, message: "" });

  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email || localStorage.getItem("verifyEmail");

  const handleVerify = async () => {
    if (!email) {
      setError("Email not found. Please register again.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await API.post("/authentication/verify-otp", { email, otp });
      localStorage.removeItem("verifyEmail");
      navigate("/login");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.response?.data?.detail ||
          "Invalid OTP"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      await API.post("/authentication/resend-otp", null, {
        params: { email },
      });

      setPopup({
        show: true,
        message: "OTP resent to your email",
      });
    } catch {
      setPopup({
        show: true,
        message: "Failed to resend OTP",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-100 to-blue-300">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-88 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Verify OTP</h2>
        <p className="text-sm text-gray-500 mb-6">
          Enter the 6-digit code sent to your email
        </p>

        <input
          type="text"
          maxLength={6}
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="••••••"
          className="w-full text-center text-xl tracking-widest border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

        <button
          onClick={handleVerify}
          disabled={loading}
          className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition duration-200"
        >
          {loading ? "Verifying..." : "Verify"}
        </button>

        <p className="text-sm text-gray-500 mt-4">
          Didn’t receive code?{" "}
          <span
            onClick={handleResend}
            className="text-blue-600 cursor-pointer hover:underline"
          >
            Resend
          </span>
        </p>
      </div>

      {popup.show && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-80 text-center">
            <h3 className="text-lg font-semibold mb-4">Notification</h3>
            <p className="text-gray-600 mb-6">{popup.message}</p>
            <button
              onClick={() => setPopup({ show: false, message: "" })}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default VerifyOTP;
