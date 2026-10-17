import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, ArrowRight, ShieldCheck } from "lucide-react";
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
    "flex items-center gap-3 rounded-xl border border-neutral-200 bg-neutral-50 px-4 transition focus-within:border-neutral-900 focus-within:bg-white focus-within:ring-1 focus-within:ring-neutral-900";

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-white px-4 py-12 font-sans text-neutral-900 selection:bg-neutral-900 selection:text-white">
      
      {/* Top Banner Notice matching modern e-commerce storefronts */}
      <div className="absolute top-0 inset-x-0 bg-neutral-900 text-white text-[11px] py-2 px-4 text-center font-medium tracking-wide">
        <Link to="/register" className="underline font-bold ml-1">Sign Up Now</Link>
      </div>

      <div className="relative w-full max-w-5xl mt-6">
        {/* Brand Header */}
        <div className="mb-8 flex items-center justify-between border-b border-neutral-100 pb-6">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-neutral-900 text-white shadow-sm transition group-hover:scale-105">
              <span className="font-black tracking-tighter text-base">BS</span>
            </div>
            <span className="text-xl font-black tracking-tighter uppercase">The Butcher's Shop</span>
          </Link>
          <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-neutral-500">
            <ShieldCheck size={16} className="text-emerald-600" /> Secure Customer Portal
          </div>
        </div>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">
          
          {/* Left Hero / Brand Statement Section */}
          <div className="flex flex-col justify-between rounded-2xl border border-neutral-200 bg-neutral-50/50 p-8 lg:col-span-5 lg:p-10">
            <div>
              <span className="inline-block px-3 py-1 mb-6 rounded-full bg-neutral-200/60 text-[10px] font-bold tracking-widest uppercase text-neutral-700">
                Member Access
              </span>

              <h1 className="text-3xl font-black tracking-tight text-neutral-900 sm:text-4xl leading-tight">
                FIND CUTS <br />
                <span className="text-neutral-400">THAT MATCHES</span> <br />
                YOUR TASTE.
              </h1>

              <p className="mt-4 text-xs leading-relaxed text-neutral-600">
                Sign in to your account to explore premium organic cuts, track orders, and experience fast checkout.
              </p>
            </div>

            <div className="mt-12 rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
              <p className="text-xs text-neutral-500">New to The Butcher's Shop?</p>
              <Link to="/register" className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold text-neutral-900 transition hover:text-neutral-600">
                Create an account <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          {/* Right Form Container */}
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-xl shadow-neutral-100 sm:p-8 lg:col-span-7">
            <div className="mb-6">
              <h2 className="text-2xl font-bold tracking-tight text-neutral-900">Sign In</h2>
              <p className="mt-1 text-xs text-neutral-500">Welcome back! Please enter your details.</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label htmlFor="login-email" className="mb-1.5 block text-xs font-semibold text-neutral-700">
                  Email Address <span className="text-red-500">*</span>
                </label>

                <div className={inputContainerStyle}>
                  <Mail size={16} className="shrink-0 text-neutral-400" />
                  <input
                    id="login-email"
                    type="email"
                    placeholder="name@example.com"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border-none bg-transparent py-3 text-xs text-neutral-900 outline-none placeholder:text-neutral-400 focus:ring-0"
                  />
                </div>
              </div>

              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <label htmlFor="login-password" className="text-xs font-semibold text-neutral-700">
                    Password <span className="text-red-500">*</span>
                  </label>

                  <Link to="/verfyemail" className="text-xs font-medium text-neutral-500 transition hover:text-neutral-900">
                    Forgot Password?
                  </Link>
                </div>

                <div className={inputContainerStyle}>
                  <Lock size={16} className="shrink-0 text-neutral-400" />
                  <input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full border-none bg-transparent py-3 text-xs text-neutral-900 outline-none placeholder:text-neutral-400 focus:ring-0"
                  />
                  
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="text-neutral-400 transition hover:text-neutral-900"
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
                <div className="h-px flex-1 bg-neutral-200" />
                <span className="text-[11px] font-medium uppercase tracking-wider text-neutral-400">or</span>
                <div className="h-px flex-1 bg-neutral-200" />
              </div>

              <div className="w-full">
                <GoogleButton label="Continue with Google" /> 
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="group relative flex w-full items-center justify-center gap-2 rounded-xl bg-neutral-900 py-3.5 text-xs font-bold uppercase tracking-wider text-white shadow-md transition duration-200 hover:bg-neutral-800 active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-neutral-900/20 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? "Signing in..." : "Sign In to Account"} <ArrowRight size={15} className="transition group-hover:translate-x-1" />
                </button>
              </div>
            </form>

            <p className="mt-6 text-center text-xs text-neutral-500">
              Don't have an account?{" "}
              <Link to="/register" className="font-bold text-neutral-900 underline underline-offset-4 hover:text-neutral-700">
                Register Now
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}