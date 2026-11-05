
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Lock, Eye, EyeOff, ArrowLeft, Mail, ShieldCheck } from "lucide-react";
import { resetPassword } from "../../services/authService";

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
    "flex items-center gap-3 rounded-xl border border-[#E8DED3] bg-[#FBF8F3] px-4 transition focus-within:border-[#8B2635] focus-within:bg-white focus-within:ring-1 focus-within:ring-[#8B2635]";

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-[#FBF8F3] px-4 py-12 font-sans text-[#351D1D] selection:bg-[#8B2635] selection:text-white">
      <div className="absolute inset-x-0 top-0 bg-[#8B2635] px-4 py-2 text-center text-[11px] font-medium tracking-wide text-white">
        Secure Password Recovery Portal.
        <Link to="/login" className="ml-1 font-bold underline">
          Return to Login
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

          <Link
            to="/verfyemail"
            className="inline-flex items-center gap-2 rounded-xl border border-[#E8DED3] bg-white px-4 py-2 text-xs font-semibold text-[#6D5B52] shadow-sm transition hover:border-[#8B2635] hover:text-[#8B2635]"
          >
            <ArrowLeft size={15} />
            <span className="hidden sm:inline">Back to verification</span>
            <span className="sm:hidden">Back</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-center">
          <div className="flex flex-col justify-between rounded-2xl border border-[#E8DED3] bg-[#F4EEE6] p-8 lg:col-span-5 lg:p-10">
            <div>
              <span className="mb-6 inline-block rounded-full bg-[#8B2635]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[#8B2635]">
                Security Center
              </span>

              <h1 className="text-3xl font-black leading-tight tracking-tight text-[#351D1D] sm:text-4xl">
                RESET
                <br />
                <span className="text-[#8B2635]">YOUR</span>
                <br />
                PASSWORD.
              </h1>

              <p className="mt-4 text-xs leading-relaxed text-[#6D5B52]">
                Choose a strong new password to regain immediate and secure
                access to your account.
              </p>
            </div>

            <div className="mt-12 space-y-2 rounded-xl border border-[#E8DED3] bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#8B2635]">
                <ShieldCheck size={16} />
                Account Security Enabled
              </div>
              <p className="text-xs text-[#927D70]">
                Your new password will be encrypted immediately upon update.
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-[#E8DED3] bg-white p-6 shadow-xl shadow-[#351D1D]/5 sm:p-8 lg:col-span-7">
            <div className="mb-6">
              <h2 className="text-2xl font-bold tracking-tight text-[#351D1D]">
                Choose New Password
              </h2>
              <p className="mt-1 text-xs text-[#927D70]">
                Enter your email and define a new secure password.
              </p>
            </div>

            <form onSubmit={handleReset} className="space-y-4">
              <div>
                <label htmlFor="reset-email" className="mb-1.5 block text-xs font-semibold text-[#6D5B52]">
                  Registered Email <span className="text-[#8B2635]">*</span>
                </label>
                <div className={inputContainerStyle}>
                  <Mail size={16} className="shrink-0 text-[#927D70]" />
                  <input
                    id="reset-email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full border-none bg-transparent py-3 text-xs text-[#351D1D] outline-none placeholder:text-[#B5A69B] focus:ring-0"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="new-password" className="mb-1.5 block text-xs font-semibold text-[#6D5B52]">
                  New Password <span className="text-[#8B2635]">*</span>
                </label>
                <div className={inputContainerStyle}>
                  <Lock size={16} className="shrink-0 text-[#927D70]" />
                  <input
                    id="new-password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="At least 6 characters"
                    required
                    minLength={6}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
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

              <div>
                <label htmlFor="confirm-new-password" className="mb-1.5 block text-xs font-semibold text-[#6D5B52]">
                  Confirm New Password <span className="text-[#8B2635]">*</span>
                </label>
                <div className={inputContainerStyle}>
                  <Lock size={16} className="shrink-0 text-[#927D70]" />
                  <input
                    id="confirm-new-password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="Re-enter new password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full border-none bg-transparent py-3 text-xs text-[#351D1D] outline-none placeholder:text-[#B5A69B] focus:ring-0"
                  />
                </div>
              </div>

              {message && (
                <div
                  role="status"
                  className={`rounded-xl border px-4 py-3 text-xs font-medium ${
                    success
                      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                      : "border-red-200 bg-red-50 text-red-600"
                  }`}
                >
                  {message}
                </div>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#8B2635] py-3.5 text-xs font-bold uppercase tracking-wider text-white shadow-md transition duration-200 hover:bg-[#70202C] active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-[#8B2635]/30 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? "Resetting password..." : "Reset Password"}
                </button>
              </div>

              <div className="mt-4 text-center">
                <Link to="/login" className="text-xs font-semibold text-[#927D70] underline underline-offset-4 transition hover:text-[#8B2635]">
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
