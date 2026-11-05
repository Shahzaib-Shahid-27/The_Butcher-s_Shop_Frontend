
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Loader2 } from "lucide-react";

const API_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:4000/api/v1";

export default function GoogleSuccess() {
  const navigate = useNavigate();
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    const finishLogin = async () => {
      try {
        // Step 1: Get access token using refresh cookie
        const refresh = await axios.post(
          `${API_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        const accessToken: string =
          refresh.data.data.accessToken;

        if (!accessToken) {
          throw new Error("Access token not received.");
        }

        localStorage.setItem("accessToken", accessToken);

        // Step 2: Get authenticated user's profile
        const profile = await axios.get(
          `${API_URL}/auth/get-profile`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
            withCredentials: true,
          }
        );

        const user = profile.data.data.user;

        if (!user) {
          throw new Error("User profile not received.");
        }

        // Step 3: Check user role
        const role = user.role;

        if (role !== "ADMIN" && role !== "USER") {
          throw new Error("Invalid or missing user role.");
        }

        // Step 4: Save user information
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("role", role);

        // Step 5: Update Header
        window.dispatchEvent(new Event("auth-changed"));

        // Step 6: Redirect according to role
        if (role === "ADMIN") {
          navigate("/admin", { replace: true });
        } else {
          navigate("/home", { replace: true });
        }

      } catch (error) {
        console.error("Google login failed:", error);

        // Clear invalid authentication data
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
        localStorage.removeItem("role");

        window.dispatchEvent(new Event("auth-changed"));

        navigate("/login", { replace: true });
      }
    };

    finishLogin();
  }, [navigate]);

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-white px-4 py-12 font-sans text-neutral-900 selection:bg-neutral-900 selection:text-white">

      {/* Top Banner */}
      <div className="absolute inset-x-0 top-0 bg-neutral-900 px-4 py-2 text-center text-[11px] font-medium tracking-wide text-white">
        Authentication Portal — The Butcher's Shop
      </div>

      <div className="w-full max-w-md rounded-2xl border border-neutral-200 bg-white p-8 text-center shadow-xl shadow-neutral-100">

        {/* Logo Badge */}
        <div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-neutral-900 text-white shadow-sm">
          <span className="text-lg font-black tracking-tighter">
            BS
          </span>
        </div>

        {/* Loading Spinner */}
        <div className="mb-4 flex justify-center">
          <Loader2
            size={24}
            className="animate-spin text-neutral-900"
          />
        </div>

        <h1 className="text-xl font-bold tracking-tight text-neutral-900">
          Authenticating
        </h1>

        <p className="mt-2 text-xs leading-relaxed text-neutral-500">
          Signing you in securely with Google. Checking your
          account permissions and redirecting you.
        </p>

      </div>

      <p className="mt-6 text-[11px] text-neutral-400">
        Protected by standard encryption and session handling.
      </p>
    </div>
  );
}
