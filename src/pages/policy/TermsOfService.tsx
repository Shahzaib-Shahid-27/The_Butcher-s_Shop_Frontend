import { Link } from "react-router-dom";
import { FileText, ShieldCheck, ArrowLeft, Scale, Lock, RefreshCw, Mail } from "lucide-react";

export default function TermsOfService() {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <div className="relative min-h-screen bg-white font-sans text-neutral-900 selection:bg-neutral-900 selection:text-white px-4 py-12 sm:px-6 lg:px-8">
      
      {/* Top Banner */}
      <div className="absolute top-0 inset-x-0 bg-neutral-900 text-white text-[11px] py-2 px-4 text-center font-medium tracking-wide">
        Legal Governance — The Butcher's Shop Terms of Service
      </div>

      <div className="relative mx-auto max-w-4xl mt-6">
        
        {/* Navigation Bar */}
        <div className="mb-8 flex items-center justify-between border-b border-neutral-100 pb-6">
          <Link
            to="/home"
            onClick={scrollToTop}
            className="flex items-center gap-2.5"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-neutral-900 text-white shadow-sm">
              <span className="font-black tracking-tighter text-base">BS</span>
            </div>
            <span className="text-xl font-black tracking-tighter uppercase">
              The Butcher's Shop
            </span>
          </Link>

          <Link
            to="/home"
            className="inline-flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-2 text-xs font-semibold text-neutral-700 transition hover:border-neutral-900 hover:text-neutral-900 shadow-sm"
          >
            <ArrowLeft size={15} /> Back to Home
          </Link>
        </div>

        {/* Hero Header */}
        <div className="mb-8 rounded-2xl border border-neutral-200 bg-neutral-50/50 p-8 sm:p-10">
          <div className="flex items-center gap-2 mb-4">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-neutral-200/60 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-neutral-700">
              <Scale size={12} /> Legal Framework
            </span>
          </div>

          <h1 className="text-3xl font-black tracking-tight text-neutral-900 sm:text-4xl leading-tight">
            TERMS OF <span className="text-neutral-400">SERVICE.</span>
          </h1>

          <p className="mt-2 text-xs text-neutral-500 font-medium">
            Last updated: October 2026 • Please review these terms carefully before using The Butcher's Shop platform.
          </p>
        </div>

        {/* Body Container */}
        <div className="rounded-2xl border border-neutral-200 bg-white p-6 sm:p-10 shadow-xl shadow-neutral-100/50 space-y-8 text-xs leading-relaxed text-neutral-600">
          
          {/* Section 1 */}
          <section>
            <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-neutral-900 flex items-center gap-2">
              <FileText className="text-neutral-900" size={16} /> 1. Acceptance of Terms
            </h2>
            <p className="leading-relaxed">
              By creating an account or accessing The Butcher's Shop platform, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any part of these terms, you are prohibited from accessing or using our services.
            </p>
          </section>

          <div className="border-t border-neutral-100" />

          {/* Section 2 */}
          <section>
            <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-neutral-900 flex items-center gap-2">
              <ShieldCheck className="text-neutral-900" size={16} /> 2. User Accounts & Responsibilities
            </h2>
            <p className="leading-relaxed">
              When registering an account with The Butcher's Shop, you must provide accurate and complete information. You are solely responsible for maintaining the confidentiality of your account credentials and for all activities conducted under your profile.
            </p>
            <ul className="mt-3 list-disc space-y-1.5 pl-5 text-neutral-500">
              <li>You must be at least 18 years old or operating under legal parental supervision.</li>
              <li>Unauthorized access, credential sharing, or account takeover attempts are strictly prohibited.</li>
              <li>Notify us immediately upon detecting any security breach or unauthorized activity on your account.</li>
            </ul>
          </section>

          <div className="border-t border-neutral-100" />

          {/* Section 3 */}
          <section>
            <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-neutral-900 flex items-center gap-2">
              <Lock className="text-neutral-900" size={16} /> 3. Orders, Products & Pricing
            </h2>
            <p className="leading-relaxed">
              The Butcher's Shop reserves the right to refuse or cancel any orders placed for items listed at incorrect prices or with inaccurate specifications. All product categories and store inventory items are subject to live availability.
            </p>
          </section>

          <div className="border-t border-neutral-100" />

          {/* Section 4 */}
          <section>
            <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-neutral-900 flex items-center gap-2">
              <RefreshCw className="text-neutral-900" size={16} /> 4. Modifications to Terms
            </h2>
            <p className="leading-relaxed">
              We reserve the right to revise or update these Terms of Service at any time. Continued usage of The Butcher's Shop platform following any published changes constitutes full acceptance of the updated terms.
            </p>
          </section>

          {/* Legal Contact Box */}
          <div className="mt-8 rounded-xl border border-neutral-200 bg-neutral-50 p-5 space-y-1.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900 flex items-center gap-2">
              <Mail size={14} /> Questions Regarding Our Terms?
            </h3>
            <p className="text-xs text-neutral-500">
              Contact our legal support team at{" "}
              <a 
                href="mailto:support@thebutchersshop.com" 
                className="font-semibold text-neutral-900 underline underline-offset-2 hover:text-neutral-600 transition"
              >
                support@thebutchersshop.com
              </a>.
            </p>
          </div>
        </div>

        {/* Footer Note */}
        <p className="mt-8 text-center text-[11px] text-neutral-400">
          The Butcher's Shop — All terms and conditions reserved.
        </p>
      </div>
    </div>
  );
}