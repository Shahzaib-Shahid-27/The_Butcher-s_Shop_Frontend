import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Lock, Eye, EyeOff, ArrowLeft, ShieldCheck, Mail } from "lucide-react";
import { resetPassword } from "../services/authService";

export default function ForgotPassword() {
  const location = useLocation();
  const navigate = useNavigate();

  const verifiedEmail = location.state?.email ?? "";

  const [email, setEmail] = useState(verifiedEmail);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleReset = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage("");
    setSuccess(false);

    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      await resetPassword({
        email: email.trim(),
        newPassword,
      });

      setSuccess(true);
      setMessage("Password reset successfully! Redirecting to login...");

      setTimeout(() => navigate("/login"), 1500);
    } catch (error: unknown) {
      const err = error as {
        response?: { data?: { message?: string } };
        message?: string;
      };

      setMessage(
        err.response?.data?.message ??
          err.message ??
          "Password reset failed. Please try again."
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

        <div className="absolute right-[12%] top-[10%] h-16 w-16 rounded-2xl border border-blue-500/10 bg-blue-600/10" />
        <div className="absolute bottom-[15%] left-[8%] h-20 w-20 rounded-2xl border border-cyan-500/10 bg-cyan-500/10" />
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

          <Link
            to="/verfyemail"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-800 bg-[#0a1128]/60 px-4 py-2 text-xs font-medium text-slate-300 transition hover:border-slate-700 hover:text-white"
          >
            <ArrowLeft size={15} />
            Back to verification
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-center">
          {/* Left Hero Graphic Section */}
          <div className="flex flex-col justify-between rounded-3xl border border-slate-800/80 bg-[#0a1128]/80 p-8 backdrop-blur-xl lg:col-span-5 lg:p-10">
            <div>
              <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-500/30 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 text-cyan-400 shadow-inner">
                <ShieldCheck size={32} />
              </div>

              <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                Reset <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Password</span>
              </h1>

              <p className="mt-3 text-sm leading-relaxed text-slate-400">
                Enter your registered email and choose a strong new password to regain access to your The Butcher's Shop account.
              </p>
            </div>

            <div className="mt-10 rounded-2xl border border-blue-900/40 bg-[#060b19]/60 p-5">
              <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-wider text-cyan-400">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-500" />
                </span>
                Account Security Enabled
              </div>
              <p className="mt-2 text-xs text-slate-400">
                Your new password will be encrypted immediately upon update.
              </p>
            </div>
          </div>

          {/* Right Form Container */}
          <div className="rounded-3xl border border-slate-800/80 bg-[#0a1128]/90 p-6 shadow-2xl shadow-black/50 backdrop-blur-xl sm:p-8 lg:col-span-7">
            <div className="mb-6 border-b border-slate-800/60 pb-5">
              <h2 className="text-xl font-bold text-white">Choose New Password</h2>
              <p className="mt-1 text-xs text-slate-400">We'll help you get back in. Enter your details below.</p>
            </div>

            <form onSubmit={handleReset} className="space-y-4">
              <div>
                <label htmlFor="reset-email" className="mb-1.5 block text-xs font-medium text-slate-300">
                  Registered email <span className="text-cyan-400">*</span>
                </label>

                <div className={inputContainerStyle}>
                  <Mail size={17} className="shrink-0 text-slate-500" />
                  <input
                    id="reset-email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full border-none bg-transparent py-3.5 text-sm text-white outline-none placeholder:text-slate-600 focus:ring-0"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="new-password" className="mb-1.5 block text-xs font-medium text-slate-300">
                  New password <span className="text-cyan-400">*</span>
                </label>

                <div className={inputContainerStyle}>
                  <Lock size={17} className="shrink-0 text-slate-500" />
                  <input
                    id="new-password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="At least 6 characters"
                    required
                    minLength={6}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
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

              <div>
                <label htmlFor="confirm-new-password" className="mb-1.5 block text-xs font-medium text-slate-300">
                  Confirm new password <span className="text-cyan-400">*</span>
                </label>

                <div className={inputContainerStyle}>
                  <Lock size={17} className="shrink-0 text-slate-500" />
                  <input
                    id="confirm-new-password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="Enter new password again"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full border-none bg-transparent py-3.5 text-sm text-white outline-none placeholder:text-slate-600 focus:ring-0"
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
                  className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-cyan-400 py-3.5 text-sm font-bold text-white shadow-lg shadow-cyan-500/25 transition duration-200 hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? "Resetting password..." : "Reset Password →"}
                </button>
              </div>

              <div className="mt-4 text-center">
                <Link to="/login" className="text-xs text-slate-400 transition hover:text-cyan-400">
                  ← Back to Login
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}