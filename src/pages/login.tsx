import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, ShoppingBag } from "lucide-react";
import { loginUser, getProfile } from "../services/authService";

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

      localStorage.setItem("user", JSON.stringify(user));
      window.dispatchEvent(new Event("auth-changed"));

      navigate("/home");
    } catch (error: unknown) {
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
    "flex items-center gap-3 rounded-xl border border-blue-900/40 bg-[#060b19] px-4 transition focus-within:border-cyan-400 focus-within:ring-1 focus-within:ring-cyan-400/50";

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#030712] px-4 py-12 font-sans text-slate-100 selection:bg-cyan-500 selection:text-white">
      {/* Background glow effects */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-20 top-20 h-72 w-72 rounded-3xl bg-blue-600/10 blur-3xl" />
        <div className="absolute right-10 top-1/3 h-80 w-80 rounded-3xl bg-cyan-500/10 blur-3xl" />
        <div className="absolute -bottom-20 left-1/3 h-96 w-96 rounded-3xl bg-blue-700/10 blur-3xl" />

        <div className="absolute right-[10%] top-[15%] h-16 w-16 rounded-2xl border border-blue-500/10 bg-blue-600/10" />
        <div className="absolute bottom-[20%] left-[5%] h-20 w-20 rounded-2xl border border-cyan-500/10 bg-cyan-500/10" />
      </div>

      <div className="relative w-full max-w-5xl">
        {/* Brand Header */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-400 shadow-lg shadow-cyan-500/20">
              <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <span className="text-xl font-bold tracking-tight text-white">The Butcher's Shop</span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-center">
          {/* Left Hero Graphic Section */}
          <div className="flex flex-col justify-between rounded-3xl border border-slate-800/80 bg-[#0a1128]/80 p-8 backdrop-blur-xl lg:col-span-5 lg:p-10">
            <div>
              <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-500/30 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 text-cyan-400 shadow-inner">
                <ShoppingBag size={32} />
              </div>

              <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                Welcome <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Back</span>
              </h1>

              <p className="mt-3 text-sm leading-relaxed text-slate-400">
                Sign in to your The Butcher's Shop account to continue shopping your favorite products.
              </p>
            </div>

            <div className="mt-10 rounded-2xl border border-blue-900/40 bg-[#060b19]/60 p-5">
              <p className="text-xs text-slate-400">Don't have an account?</p>
              <Link to="/register" className="mt-1 inline-block text-xs font-bold text-cyan-400 transition hover:text-cyan-300">
                Register a new account →
              </Link>
            </div>
          </div>

          {/* Right Form Container */}
          <div className="rounded-3xl border border-slate-800/80 bg-[#0a1128]/90 p-6 shadow-2xl shadow-black/50 backdrop-blur-xl sm:p-8 lg:col-span-7">
            <div className="mb-6 border-b border-slate-800/60 pb-5">
              <h2 className="text-xl font-bold text-white">Login</h2>
              <p className="mt-1 text-xs text-slate-400">Sign in to your The Butcher's Shop account</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label htmlFor="login-email" className="mb-1.5 block text-xs font-medium text-slate-300">
                  Email address <span className="text-cyan-400">*</span>
                </label>

                <div className={inputContainerStyle}>
                  <Mail size={17} className="shrink-0 text-slate-500" />
                  <input
                    id="login-email"
                    type="email"
                    placeholder="Email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border-none bg-transparent py-3.5 text-sm text-white outline-none placeholder:text-slate-600 focus:ring-0"
                  />
                </div>
              </div>

              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <label htmlFor="login-password" className="text-xs font-medium text-slate-300">
                    Password <span className="text-cyan-400">*</span>
                  </label>

                  <Link to="/verfyemail" className="text-xs text-cyan-400 transition hover:text-cyan-300">
                    Forgot Password?
                  </Link>
                </div>

                <div className={inputContainerStyle}>
                  <Lock size={17} className="shrink-0 text-slate-500" />
                  <input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full border-none bg-transparent py-3.5 text-sm text-white outline-none placeholder:text-slate-600 focus:ring-0"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="text-slate-500 transition hover:text-cyan-400"
                  >
                    {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
              </div>

              {message && (
                <div role="alert" className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-xs font-medium text-rose-400">
                  {message}
                </div>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-cyan-400 py-3.5 text-sm font-bold text-white shadow-lg shadow-cyan-500/25 transition duration-200 hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? "Signing in..." : "Login →"}
                </button>
              </div>
            </form>

            <p className="mt-6 text-center text-xs text-slate-400">
              Don't have an account?{" "}
              <Link to="/register" className="font-semibold text-cyan-400 hover:text-cyan-300">
                Register
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}