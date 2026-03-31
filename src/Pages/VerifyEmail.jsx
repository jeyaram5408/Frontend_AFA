import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import API from "../api/apiClient";

function VerifyEmail() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = params.get("token");

    if (token) {
      API.get(`/authentication/verify-email?token=${token}`)
        .then(() => {
          alert("Email verified successfully");
          navigate("/login"); // ✅ redirect
        })
        .catch(() => {
          alert("Invalid or expired link");
          navigate("/register");
        });
    }
  }, []);

  return <h2 className="text-center mt-10">Verifying your email...</h2>;
}

export default VerifyEmail;