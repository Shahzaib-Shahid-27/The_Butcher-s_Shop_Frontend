import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Loader2, ArrowRight } from "lucide-react";

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
    <div className="relative min-h-screen bg-white font-sans text-neutral-900 flex flex-col items-center justify-center px-4 py-12 selection:bg-neutral-900 selection:text-white">
      {/* Top Banner */}
      <div className="absolute top-0 inset-x-0 bg-neutral-900 text-white text-[11px] py-2 px-4 text-center font-medium tracking-wide">
        Authentication Portal — The Butcher's Shop
      </div>

      <div className="w-full max-w-md rounded-2xl border border-neutral-200 bg-white p-8 shadow-xl shadow-neutral-100 text-center">
        {/* Logo Badge */}
        <div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-neutral-900 text-white shadow-sm">
          <span className="font-black tracking-tighter text-lg">BS</span>
        </div>

        {/* Loading Spinner & Status */}
        <div className="flex justify-center mb-4">
          <Loader2 size={24} className="animate-spin text-neutral-900" />
        </div>

        <h1 className="text-xl font-bold tracking-tight text-neutral-900">
          Authenticating
        </h1>
        <p className="mt-1 text-xs text-neutral-500 leading-relaxed">
          Signing you in securely with Google. Please wait a moment while we redirect you.
        </p>

        {/* Optional Admin Manual Navigation Button */}
        {localStorage.getItem("role") === "ADMIN" && (
          <div className="mt-6 pt-6 border-t border-neutral-100">
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50 py-3 px-4 text-xs font-bold uppercase tracking-wider text-neutral-800 transition hover:bg-neutral-100 hover:border-neutral-900 inline-flex items-center justify-center gap-2"
            >
              Return to Login <ArrowRight size={14} />
            </button>
          </div>
        )}
      </div>

      <p className="mt-6 text-[11px] text-neutral-400">
        Protected by standard encryption and session handling.
      </p>
    </div>
  );
}