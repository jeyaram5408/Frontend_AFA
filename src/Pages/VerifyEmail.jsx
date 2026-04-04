import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import API from "../api/apiClient";
import { toast } from "react-toastify";

function VerifyEmail() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = params.get("token");

    if (token) {
      API.get(`/authentication/verify-email?token=${token}`)
        .then(() => {
          toast.success("Email verified successfully 🎉");

          setTimeout(() => {
            navigate("/login");
          }, 1500);
        })
        .catch(() => {
          toast.error("Invalid or expired link ❌");

          setTimeout(() => {
            navigate("/register");
          }, 1500);
        });
    }
  }, []);

  return (
    <h2 className="text-center mt-10 text-lg font-semibold">
      Verifying your email...
    </h2>
  );
}

export default VerifyEmail;