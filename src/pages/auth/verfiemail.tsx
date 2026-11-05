
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
          err.message ??
          "Email does not exist. Please enter a registered email."
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
        Account Recovery Verification.
        <Link to="/login" className="ml-1 font-bold underline">
          Back to Login
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
            to="/login"
            className="inline-flex items-center gap-2 rounded-xl border border-[#E8DED3] bg-white px-4 py-2 text-xs font-semibold text-[#6D5B52] shadow-sm transition hover:border-[#8B2635] hover:text-[#8B2635]"
          >
            <ArrowLeft size={15} />
            <span className="hidden sm:inline">Back to login</span>
            <span className="sm:hidden">Back</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-center">
          <div className="flex flex-col justify-between rounded-2xl border border-[#E8DED3] bg-[#F4EEE6] p-8 lg:col-span-5 lg:p-10">
            <div>
              <span className="mb-6 inline-block rounded-full bg-[#8B2635]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[#8B2635]">
                Identity Check
              </span>

              <h1 className="text-3xl font-black leading-tight tracking-tight text-[#351D1D] sm:text-4xl">
                VERIFY YOUR
                <br />
                <span className="text-[#8B2635]">REGISTERED</span>
                <br />
                EMAIL.
              </h1>

              <p className="mt-4 text-xs leading-relaxed text-[#6D5B52]">
                Enter your registered email address to verify your account
                status and initiate password recovery.
              </p>
            </div>

            <div className="mt-12 space-y-1 rounded-xl border border-[#E8DED3] bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#8B2635]">
                <ShieldCheck size={16} />
                Security Verification
              </div>
              <p className="text-xs text-[#927D70]">
                We will verify that your email exists in our system records.
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-[#E8DED3] bg-white p-6 shadow-xl shadow-[#351D1D]/5 sm:p-8 lg:col-span-7">
            <div className="mb-6">
              <h2 className="text-2xl font-bold tracking-tight text-[#351D1D]">
                Verify Email
              </h2>
              <p className="mt-1 text-xs text-[#927D70]">
                Provide your account email to proceed.
              </p>
            </div>

            <form onSubmit={handleVerify} className="space-y-4">
              <div>
                <label htmlFor="verify-email" className="mb-1.5 block text-xs font-semibold text-[#6D5B52]">
                  Registered Email <span className="text-[#8B2635]">*</span>
                </label>

                <div className={inputContainerStyle}>
                  <Mail size={16} className="shrink-0 text-[#927D70]" />
                  <input
                    id="verify-email"
                    type="email"
                    placeholder="Enter your registered email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border-none bg-transparent py-3 text-xs text-[#351D1D] outline-none placeholder:text-[#B5A69B] focus:ring-0"
                  />
                </div>
              </div>

              {message && (
                <div
                  role="alert"
                  className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-medium text-red-600"
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
                  {loading ? "Verifying..." : "Send Verification Link"}
                </button>
              </div>

              <div className="mt-4 text-center">
                <Link
                  to="/login"
                  className="text-xs font-semibold text-[#927D70] underline underline-offset-4 transition hover:text-[#8B2635]"
                >
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
