import { Link } from "react-router-dom";
import { Shield, Eye, Database, Cookie, ArrowLeft, Lock } from "lucide-react";

export default function PrivacyPolicy() {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#030712] font-sans text-slate-100 selection:bg-cyan-500 selection:text-white">
      {/* Background glow effects */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-20 top-20 h-72 w-72 rounded-3xl bg-blue-600/10 blur-3xl" />
        <div className="absolute right-10 top-1/3 h-80 w-80 rounded-3xl bg-cyan-500/10 blur-3xl" />
        <div className="absolute -bottom-20 left-1/3 h-96 w-96 rounded-3xl bg-blue-700/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Navigation Bar */}
        <div className="mb-8 flex items-center justify-between">
          <Link
            to="/home"
            onClick={scrollToTop}
            className="flex items-center gap-2.5 text-lg font-extrabold tracking-tight text-white"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-400 shadow-md shadow-cyan-500/20">
              <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <span>The Butcher's Shop</span>
          </Link>

          <Link
            to="/home"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-800 bg-[#0a1128]/60 px-4 py-2 text-xs font-medium text-slate-300 transition hover:border-slate-700 hover:text-white"
          >
            <ArrowLeft size={15} />
            Back to Home
          </Link>
        </div>

        {/* Hero Banner */}
        <div className="mb-8 rounded-3xl border border-slate-800/80 bg-[#0a1128]/80 p-6 backdrop-blur-xl sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-900/40 bg-[#060b19] px-3 py-1 text-xs font-semibold text-cyan-400">
                <Shield size={14} />
                Data Protection
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                Privacy <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Policy</span>
              </h1>
              <p className="mt-2 text-xs text-slate-400">
                Last updated: October 2026 • Your privacy and data security are our top priorities.
              </p>
            </div>
          </div>
        </div>

        {/* Policy Body */}
        <div className="space-y-6 rounded-3xl border border-slate-800/80 bg-[#0a1128]/90 p-6 shadow-2xl backdrop-blur-xl sm:p-10 text-sm leading-relaxed text-slate-300">
          <section>
            <h2 className="mb-3 text-lg font-bold text-white flex items-center gap-2">
              <Database className="text-cyan-400" size={18} /> 1. Information We Collect
            </h2>
            <p>
              We collect information you provide directly when interacting with The Butcher's Shop, such as when creating an account, placing an order, or managing product categories.
            </p>
            <ul className="mt-3 list-disc space-y-1.5 pl-5 text-xs text-slate-400">
              <li><strong>Account Data:</strong> Name, email address, encrypted credentials, and profile options.</li>
              <li><strong>Transaction Data:</strong> Cart contents, product selections, and purchase histories.</li>
              <li><strong>Usage Data:</strong> Technical logs, device metrics, and interaction analytics.</li>
            </ul>
          </section>

          <div className="border-t border-slate-800/60" />

          <section>
            <h2 className="mb-3 text-lg font-bold text-white flex items-center gap-2">
              <Eye className="text-cyan-400" size={18} /> 2. How We Use Your Data
            </h2>
            <p>
              Your data is utilized solely to provide, personalize, and improve your shopping experience on The Butcher's Shop.
            </p>
            <ul className="mt-3 list-disc space-y-1.5 pl-5 text-xs text-slate-400">
              <li>To manage active authentication sessions and secure account access.</li>
              <li>To organize your cart items and process shopping orders efficiently.</li>
              <li>To maintain system integrity and prevent fraudulent platform activity.</li>
            </ul>
          </section>

          <div className="border-t border-slate-800/60" />

          <section>
            <h2 className="mb-3 text-lg font-bold text-white flex items-center gap-2">
              <Lock className="text-cyan-400" size={18} /> 3. Security & Storage
            </h2>
            <p>
              We implement industry-standard JWT authentication and password hashing algorithms to guarantee that your sensitive personal details remain safe from unauthorized access.
            </p>
          </section>

          <div className="border-t border-slate-800/60" />

          <section>
            <h2 className="mb-3 text-lg font-bold text-white flex items-center gap-2">
              <Cookie className="text-cyan-400" size={18} /> 4. Local Storage & Sessions
            </h2>
            <p>
              The Butcher's Shop uses browser local storage (`localStorage`) to keep you securely authenticated across page reloads and browser sessions. You can clear this data at any time by logging out of your account.
            </p>
          </section>

          <div className="mt-8 rounded-2xl border border-blue-900/40 bg-[#060b19] p-5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400">Data Access & Removal Requests</h3>
            <p className="mt-1 text-xs text-slate-400">
              If you wish to export or request the permanent deletion of your account data, please contact <span className="text-slate-200">privacy@The Butcher's Shop.com</span>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}