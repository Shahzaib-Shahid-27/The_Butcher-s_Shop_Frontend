import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, ArrowLeft, ShieldCheck } from "lucide-react";
import { forgotPassword } from "../../services/authService";

export default function VerifyEmail() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleVerify = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      await forgotPassword({ email: email.trim() });

      navigate("/forgetpass", {
        state: { email: email.trim() },
      });
    } catch (error: unknown) {
      const err = error as {
        response?: { data?: { message?: string } };
        message?: string;
      };

      setMessage(
        err.response?.data?.message ??
          "Email does not exist. Please enter a registered email."
      );
    } finally {
      setLoading(false);
    }
  };

  const inputContainerStyle =
    "flex items-center gap-3 rounded-xl border border-neutral-200 bg-neutral-50 px-4 transition focus-within:border-neutral-900 focus-within:bg-white focus-within:ring-1 focus-within:ring-neutral-900";

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-white px-4 py-12 font-sans text-neutral-900 selection:bg-neutral-900 selection:text-white">
      
      {/* Top Banner Notice */}
      <div className="absolute top-0 inset-x-0 bg-neutral-900 text-white text-[11px] py-2 px-4 text-center font-medium tracking-wide">
        Account Recovery Verification. <Link to="/login" className="underline font-bold ml-1">Back to Login</Link>
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

          <Link
            to="/login"
            className="inline-flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-2 text-xs font-semibold text-neutral-700 transition hover:border-neutral-900 hover:text-neutral-900 shadow-sm"
          >
            <ArrowLeft size={15} />
            Back to login
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">
          {/* Left Hero Section */}
          <div className="flex flex-col justify-between rounded-2xl border border-neutral-200 bg-neutral-50/50 p-8 lg:col-span-5 lg:p-10">
            <div>
              <span className="inline-block px-3 py-1 mb-6 rounded-full bg-neutral-200/60 text-[10px] font-bold tracking-widest uppercase text-neutral-700">
                Identity Check
              </span>

              <h1 className="text-3xl font-black tracking-tight text-neutral-900 sm:text-4xl leading-tight">
                VERIFY YOUR <br />
                <span className="text-neutral-400">REGISTERED</span> <br />
                EMAIL.
              </h1>

              <p className="mt-4 text-xs leading-relaxed text-neutral-600">
                Enter your registered email address to verify your account status and initiate password recovery.
              </p>
            </div>

            <div className="mt-12 rounded-xl border border-neutral-200 bg-white p-5 shadow-sm space-y-1">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-900">
                <ShieldCheck size={16} className="text-emerald-600" /> Security Verification
              </div>
              <p className="text-xs text-neutral-500">We will verify that your email exists in our system records.</p>
            </div>
          </div>

          {/* Right Form Container */}
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-xl shadow-neutral-100 sm:p-8 lg:col-span-7">
            <div className="mb-6">
              <h2 className="text-2xl font-bold tracking-tight text-neutral-900">Verify Email</h2>
              <p className="mt-1 text-xs text-neutral-500">Provide your account email to proceed.</p>
            </div>

            <form onSubmit={handleVerify} className="space-y-4">
              <div>
                <label htmlFor="verify-email" className="mb-1.5 block text-xs font-semibold text-neutral-700">
                  Registered Email <span className="text-red-500">*</span>
                </label>

                <div className={inputContainerStyle}>
                  <Mail size={16} className="shrink-0 text-neutral-400" />
                  <input
                    id="verify-email"
                    type="email"
                    placeholder="Enter your registered email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border-none bg-transparent py-3 text-xs text-neutral-900 outline-none placeholder:text-neutral-400 focus:ring-0"
                  />
                </div>
              </div>

              {message && (
                <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-medium text-red-600">
                  {message}
                </div>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="group relative flex w-full items-center justify-center gap-2 rounded-xl bg-neutral-900 py-3.5 text-xs font-bold uppercase tracking-wider text-white shadow-md transition duration-200 hover:bg-neutral-800 active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-neutral-900/20 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? "Verifying..." : "Send Verification Link"}
                </button>
              </div>

              <div className="mt-4 text-center">
                <Link to="/login" className="text-xs font-semibold text-neutral-500 transition hover:text-neutral-900 underline underline-offset-4">
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