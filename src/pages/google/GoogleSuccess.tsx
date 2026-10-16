import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api/v1";

export default function GoogleSuccess() {
  const navigate = useNavigate();
  const ran = useRef(false); // stops the StrictMode double call

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    const finishLogin = async () => {
      try {
        const refresh = await axios.post(
          `${API_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );
        const accessToken: string = refresh.data.data.accessToken;
        localStorage.setItem("accessToken", accessToken);

        const profile = await axios.get(`${API_URL}/auth/get-profile`, {
          headers: { Authorization: `Bearer ${accessToken}` },
          withCredentials: true,
        });

        localStorage.setItem("user", JSON.stringify(profile.data.data.user));
        window.dispatchEvent(new Event("auth-changed"));
        navigate("/home", { replace: true });
      } catch {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
        navigate("/login", { replace: true });
      }
    };

    finishLogin();
  }, [navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#030712] text-slate-300">
      Signing you in with Google...
    </div>
  );
}