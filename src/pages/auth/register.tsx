
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import { registerUser } from "../../services/authService";
import GoogleButton from "../../components/button/GoogleButton";

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
    "flex items-center gap-3 rounded-xl border border-[#E8DED3] bg-[#FBF8F3] px-4 transition focus-within:border-[#8B2635] focus-within:bg-white focus-within:ring-1 focus-within:ring-[#8B2635]";

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-[#FBF8F3] px-4 py-12 font-sans text-[#351D1D] selection:bg-[#8B2635] selection:text-white">
      <div className="absolute inset-x-0 top-0 bg-[#8B2635] px-4 py-2 text-center text-[11px] font-medium tracking-wide text-white">
        Join today and discover quality you can taste.
        <Link to="/login" className="ml-1 font-bold underline">
          Sign In
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
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-center">
          <div className="flex flex-col justify-between rounded-2xl border border-[#E8DED3] bg-[#F4EEE6] p-8 lg:col-span-5 lg:p-10">
            <div>
              <span className="mb-6 inline-block rounded-full bg-[#8B2635]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[#8B2635]">
                New Membership
              </span>

              <h1 className="text-3xl font-black leading-tight tracking-tight text-[#351D1D] sm:text-4xl">
                START YOUR
                <br />
                <span className="text-[#8B2635]">SHOPPING</span>
                <br />
                JOURNEY TODAY.
              </h1>

              <p className="mt-4 text-xs leading-relaxed text-[#6D5B52]">
                Create an account with Butcher Shop to explore products,
                manage your account, track orders, and enjoy a smooth online
                shopping experience.
              </p>
            </div>

            <div className="mt-12 rounded-xl border border-[#E8DED3] bg-white p-5 shadow-sm">
              <p className="text-xs text-[#927D70]">
                Already have an account?
              </p>
              <Link
                to="/login"
                className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold text-[#8B2635] transition hover:text-[#70202C]"
              >
                Sign in to your account <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          <div className="rounded-2xl border border-[#E8DED3] bg-white p-6 shadow-xl shadow-[#351D1D]/5 sm:p-8 lg:col-span-7">
            <div className="mb-6">
              <h2 className="text-2xl font-bold tracking-tight text-[#351D1D]">
                Create Account
              </h2>
              <p className="mt-1 text-xs text-[#927D70]">
                Fill in your details below to get started.
              </p>
            </div>

            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label htmlFor="register-name" className="mb-1.5 block text-xs font-semibold text-[#6D5B52]">
                  Full Name <span className="text-[#8B2635]">*</span>
                </label>
                <div className={inputContainerStyle}>
                  <User size={16} className="shrink-0 text-[#927D70]" />
                  <input
                    id="register-name"
                    type="text"
                    placeholder="John Doe"
                    autoComplete="name"
                    required
                    minLength={2}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full border-none bg-transparent py-3 text-xs text-[#351D1D] outline-none placeholder:text-[#B5A69B] focus:ring-0"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="register-email" className="mb-1.5 block text-xs font-semibold text-[#6D5B52]">
                  Email Address <span className="text-[#8B2635]">*</span>
                </label>
                <div className={inputContainerStyle}>
                  <Mail size={16} className="shrink-0 text-[#927D70]" />
                  <input
                    id="register-email"
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
                <label htmlFor="register-password" className="mb-1.5 block text-xs font-semibold text-[#6D5B52]">
                  Password <span className="text-[#8B2635]">*</span>
                </label>
                <div className={inputContainerStyle}>
                  <Lock size={16} className="shrink-0 text-[#927D70]" />
                  <input
                    id="register-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="At least 6 characters"
                    autoComplete="new-password"
                    required
                    minLength={6}
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

              <div>
                <label htmlFor="confirm-password" className="mb-1.5 block text-xs font-semibold text-[#6D5B52]">
                  Confirm Password <span className="text-[#8B2635]">*</span>
                </label>
                <div className={inputContainerStyle}>
                  <Lock size={16} className="shrink-0 text-[#927D70]" />
                  <input
                    id="confirm-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Re-enter password"
                    autoComplete="new-password"
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
                  {loading ? "Creating account..." : "Register Account"}
                  <ArrowRight size={15} className="transition group-hover:translate-x-1" />
                </button>
              </div>
            </form>

            <p className="mt-6 text-center text-xs text-[#927D70]">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-bold text-[#8B2635] underline underline-offset-4 hover:text-[#70202C]"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
