import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Lock, Eye, EyeOff, ShoppingBag } from "lucide-react";
import { registerUser } from "../services/authService";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage("");
    setSuccess(false);

    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      await registerUser({
        name: name.trim(),
        email: email.trim(),
        password,
      });

      setSuccess(true);
      setMessage("Account created successfully! Redirecting to login...");

      setTimeout(() => navigate("/login"), 1200);
    } catch (error: unknown) {
      const err = error as {
        response?: { data?: { message?: string } };
        message?: string;
      };

      setMessage(
        err.response?.data?.message ??
          err.message ??
          "Registration failed. Please try again."
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
      </div>

      <div className="relative w-full max-w-5xl">
        {/* Brand Header */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-tr from-blue-600 to-cyan-400 shadow-lg shadow-cyan-500/20">
              <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <span className="text-xl font-bold tracking-tight text-white">The Butcher's Shop</span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-center">
          {/* Left Hero Section */}
          <div className="flex flex-col justify-between rounded-3xl border border-slate-800/80 bg-[#0a1128]/80 p-8 backdrop-blur-xl lg:col-span-5 lg:p-10">
            <div>
              <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-500/30 bg-linear-to-tr from-blue-500/20 to-cyan-500/20 text-cyan-400 shadow-inner">
                <ShoppingBag size={32} />
              </div>

              <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                Create <span className="bg-linear-to-tr from-blue-400 to-cyan-400 bg-clip-text text-transparent">Account</span>
              </h1>

              <p className="mt-3 text-sm leading-relaxed text-slate-400">
                Join The Butcher's Shop and start your shopping journey today.
              </p>
            </div>

            <div className="mt-10 rounded-2xl border border-blue-900/40 bg-[#060b19]/60 p-5">
              <p className="text-xs text-slate-400">Already have an account?</p>
              <Link to="/login" className="mt-1 inline-block text-xs font-bold text-cyan-400 transition hover:text-cyan-300">
                Login to your account →
              </Link>
            </div>
          </div>

          {/* Right Form Container */}
          <div className="rounded-3xl border border-slate-800/80 bg-[#0a1128]/90 p-6 shadow-2xl shadow-black/50 backdrop-blur-xl sm:p-8 lg:col-span-7">
            <div className="mb-6 border-b border-slate-800/60 pb-5">
              <h2 className="text-xl font-bold text-white">Register</h2>
              <p className="mt-1 text-xs text-slate-400">Fill in your details to create an account</p>
            </div>

            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label htmlFor="register-name" className="mb-1.5 block text-xs font-medium text-slate-300">
                  Full Name <span className="text-cyan-400">*</span>
                </label>

                <div className={inputContainerStyle}>
                  <User size={17} className="shrink-0 text-slate-500" />
                  <input
                    id="register-name"
                    type="text"
                    placeholder="Full Name"
                    autoComplete="name"
                    required
                    minLength={2}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full border-none bg-transparent py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:ring-0"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="register-email" className="mb-1.5 block text-xs font-medium text-slate-300">
                  Email <span className="text-cyan-400">*</span>
                </label>

                <div className={inputContainerStyle}>
                  <Mail size={17} className="shrink-0 text-slate-500" />
                  <input
                    id="register-email"
                    type="email"
                    placeholder="Email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border-none bg-transparent py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:ring-0"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="register-password" className="mb-1.5 block text-xs font-medium text-slate-300">
                  Password <span className="text-cyan-400">*</span>
                </label>

                <div className={inputContainerStyle}>
                  <Lock size={17} className="shrink-0 text-slate-500" />
                  <input
                    id="register-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    autoComplete="new-password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full border-none bg-transparent py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:ring-0"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="text-slate-500 hover:text-cyan-400"
                  >
                    {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="confirm-password" className="mb-1.5 block text-xs font-medium text-slate-300">
                  Confirm Password <span className="text-cyan-400">*</span>
                </label>

                <div className={inputContainerStyle}>
                  <Lock size={17} className="shrink-0 text-slate-500" />
                  <input
                    id="confirm-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Confirm Password"
                    autoComplete="new-password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full border-none bg-transparent py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:ring-0"
                  />
                </div>
              </div>

              {message && (
                <div
                  role="status"
                  className={`rounded-xl border px-4 py-3 text-xs font-medium ${
                    success
                      ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                      : "border-rose-500/30 bg-rose-500/10 text-rose-400"
                  }`}
                >
                  {message}
                </div>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-linear-to-tr from-blue-600 to-cyan-400 py-3.5 text-sm font-bold text-white shadow-lg shadow-cyan-500/25 transition duration-200 hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? "Creating account..." : "Register →"}
                </button>
              </div>
            </form>

            <p className="mt-6 text-center text-xs text-slate-400">
              Already have an account?{" "}
              <Link to="/login" className="font-semibold text-cyan-400 hover:text-cyan-300">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}