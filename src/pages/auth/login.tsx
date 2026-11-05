
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { loginUser, getProfile } from "../../services/authService";
import GoogleButton from "../../components/button/GoogleButton";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const result = await loginUser({ email, password });

      const accessToken =
        result?.data?.tokens?.accessToken ??
        result?.data?.accessToken ??
        result?.tokens?.accessToken;

      if (!accessToken) {
        throw new Error("Access token not found.");
      }

      localStorage.setItem("accessToken", accessToken);

      const profileResult = await getProfile(accessToken);

      const user =
        profileResult?.data?.user ??
        profileResult?.data?.data?.user ??
        profileResult?.data?.data ??
        profileResult?.user ??
        profileResult?.data;

      if (!user?.id) {
        localStorage.removeItem("accessToken");
        throw new Error("User ID was not returned by the profile API.");
      }

      const role = user.role;

      if (!role) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
        localStorage.removeItem("role");

        throw new Error(
          "User role was not returned by the profile API. Check your backend."
        );
      }

      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("role", role);

      window.dispatchEvent(new Event("auth-changed"));

      if (role === "ADMIN") {
        navigate("/admin", { replace: true });
      } else {
        navigate("/home", { replace: true });
      }
    } catch (error: unknown) {
      console.error("Login failed:", error);

      const err = error as {
        response?: { data?: { message?: string } };
        message?: string;
      };

      setMessage(
        err.response?.data?.message ??
          err.message ??
          "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const inputContainerStyle =
    "flex items-center gap-3 rounded-xl border border-[#E8DED3] bg-[#FBF8F3] px-4 transition focus-within:border-[#8B2635] focus-within:bg-white focus-within:ring-1 focus-within:ring-[#8B2635]";

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-[#FBF8F3] px-4 py-12 font-sans text-[#351D1D] selection:bg-[#8B2635] selection:text-white">
      <div className="absolute inset-x-0 top-0 bg-[#8B2635] px-4 py-2 text-center text-[11px] font-medium tracking-wide text-white">
        New to Butcher Shop?
        <Link to="/register" className="ml-1 font-bold underline">
          Sign Up Now
        </Link>
      </div>

      <div className="relative mt-6 w-full max-w-5xl">
        <div className="mb-8 flex items-center justify-between border-b border-[#E8DED3] pb-6">
          <Link to="/" className="group flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#8B2635] text-white shadow-sm transition group-hover:scale-105">
              <span className="text-base font-black tracking-tighter">BS</span>
            </div>
            <div>
              <span className="block text-lg font-black uppercase tracking-tight text-[#351D1D] sm:text-xl">
                Butcher Shop
              </span>
              <span className="text-[10px] font-medium tracking-wider text-[#927D70]">
                Quality You Can Taste
              </span>
            </div>
          </Link>

          <div className="hidden items-center gap-2 text-xs font-semibold text-[#6D5B52] sm:flex">
            <ShieldCheck size={16} className="text-[#8B2635]" />
            Secure Customer Portal
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-center">
          <div className="flex flex-col justify-between rounded-2xl border border-[#E8DED3] bg-[#F4EEE6] p-8 lg:col-span-5 lg:p-10">
            <div>
              <span className="mb-6 inline-block rounded-full bg-[#8B2635]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[#8B2635]">
                Member Access
              </span>

              <h1 className="text-3xl font-black leading-tight tracking-tight text-[#351D1D] sm:text-4xl">
                FIND CUTS
                <br />
                <span className="text-[#8B2635]">THAT MATCH</span>
                <br />
                YOUR TASTE.
              </h1>

              <p className="mt-4 text-xs leading-relaxed text-[#6D5B52]">
                Sign in to explore our online product collection, track your
                orders, and enjoy a smooth checkout experience.
              </p>
            </div>

            <div className="mt-12 rounded-xl border border-[#E8DED3] bg-white p-5 shadow-sm">
              <p className="text-xs text-[#927D70]">
                New to Butcher Shop?
              </p>
              <Link
                to="/register"
                className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold text-[#8B2635] transition hover:text-[#70202C]"
              >
                Create an account <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          <div className="rounded-2xl border border-[#E8DED3] bg-white p-6 shadow-xl shadow-[#351D1D]/5 sm:p-8 lg:col-span-7">
            <div className="mb-6">
              <h2 className="text-2xl font-bold tracking-tight text-[#351D1D]">
                Sign In
              </h2>
              <p className="mt-1 text-xs text-[#927D70]">
                Welcome back! Please enter your details.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label htmlFor="login-email" className="mb-1.5 block text-xs font-semibold text-[#6D5B52]">
                  Email Address <span className="text-[#8B2635]">*</span>
                </label>
                <div className={inputContainerStyle}>
                  <Mail size={16} className="shrink-0 text-[#927D70]" />
                  <input
                    id="login-email"
                    type="email"
                    placeholder="name@example.com"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border-none bg-transparent py-3 text-xs text-[#351D1D] outline-none placeholder:text-[#B5A69B] focus:ring-0"
                  />
                </div>
              </div>

              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <label htmlFor="login-password" className="text-xs font-semibold text-[#6D5B52]">
                    Password <span className="text-[#8B2635]">*</span>
                  </label>
                  <Link
                    to="/verfyemail"
                    className="text-xs font-medium text-[#927D70] transition hover:text-[#8B2635]"
                  >
                    Forgot Password?
                  </Link>
                </div>

                <div className={inputContainerStyle}>
                  <Lock size={16} className="shrink-0 text-[#927D70]" />
                  <input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full border-none bg-transparent py-3 text-xs text-[#351D1D] outline-none placeholder:text-[#B5A69B] focus:ring-0"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="text-[#927D70] transition hover:text-[#8B2635]"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {message && (
                <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-medium text-red-600">
                  {message}
                </div>
              )}

              <div className="my-4 flex items-center gap-3">
                <div className="h-px flex-1 bg-[#E8DED3]" />
                <span className="text-[11px] font-medium uppercase tracking-wider text-[#B5A69B]">
                  or
                </span>
                <div className="h-px flex-1 bg-[#E8DED3]" />
              </div>

              <div className="w-full">
                <GoogleButton label="Continue with Google" />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="group flex w-full items-center justify-center gap-2 rounded-xl bg-[#8B2635] py-3.5 text-xs font-bold uppercase tracking-wider text-white shadow-md transition duration-200 hover:bg-[#70202C] active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-[#8B2635]/30 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? "Signing in..." : "Sign In to Account"}
                  <ArrowRight size={15} className="transition group-hover:translate-x-1" />
                </button>
              </div>
            </form>

            <p className="mt-6 text-center text-xs text-[#927D70]">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="font-bold text-[#8B2635] underline underline-offset-4 hover:text-[#70202C]"
              >
                Register Now
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
