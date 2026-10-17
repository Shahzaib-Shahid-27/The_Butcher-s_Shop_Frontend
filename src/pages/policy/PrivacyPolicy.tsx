import { Link } from "react-router-dom";
import { Shield, Eye, Database, Cookie, ArrowLeft, Lock, Mail } from "lucide-react";

export default function PrivacyPolicy() {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <div className="relative min-h-screen bg-white font-sans text-neutral-900 selection:bg-neutral-900 selection:text-white px-4 py-12 sm:px-6 lg:px-8">
      
      {/* Top Banner */}
      <div className="absolute top-0 inset-x-0 bg-neutral-900 text-white text-[11px] py-2 px-4 text-center font-medium tracking-wide">
        Legal Governance — The Butcher's Shop Privacy Policy
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
              <Shield size={12} /> Data Protection & Governance
            </span>
          </div>

          <h1 className="text-3xl font-black tracking-tight text-neutral-900 sm:text-4xl leading-tight">
            PRIVACY <span className="text-neutral-400">POLICY.</span>
          </h1>

          <p className="mt-2 text-xs text-neutral-500 font-medium">
            Last updated: October 2026 • Your privacy and personal data security are our top priorities.
          </p>
        </div>

        {/* Policy Body Container */}
        <div className="rounded-2xl border border-neutral-200 bg-white p-6 sm:p-10 shadow-xl shadow-neutral-100/50 space-y-8 text-xs leading-relaxed text-neutral-600">
          
          {/* Section 1 */}
          <section>
            <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-neutral-900 flex items-center gap-2">
              <Database className="text-neutral-900" size={16} /> 1. Information We Collect
            </h2>
            <p className="leading-relaxed">
              We collect information you provide directly when interacting with The Butcher's Shop, such as when creating an account, placing an order, or browsing product categories.
            </p>
            <ul className="mt-3 list-disc space-y-1.5 pl-5 text-neutral-500">
              <li>
                <strong className="text-neutral-800 font-semibold">Account Data:</strong> Name, email address, encrypted credentials, and profile options.
              </li>
              <li>
                <strong className="text-neutral-800 font-semibold">Transaction Data:</strong> Cart contents, product selections, delivery addresses, and purchase histories.
              </li>
              <li>
                <strong className="text-neutral-800 font-semibold">Usage Data:</strong> Technical logs, device metrics, and interaction analytics.
              </li>
            </ul>
          </section>

          <div className="border-t border-neutral-100" />

          {/* Section 2 */}
          <section>
            <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-neutral-900 flex items-center gap-2">
              <Eye className="text-neutral-900" size={16} /> 2. How We Use Your Data
            </h2>
            <p className="leading-relaxed">
              Your data is utilized solely to provide, personalize, and improve your shopping experience on The Butcher's Shop.
            </p>
            <ul className="mt-3 list-disc space-y-1.5 pl-5 text-neutral-500">
              <li>To manage active authentication sessions and secure account access.</li>
              <li>To organize your cart items and process shopping orders efficiently.</li>
              <li>To maintain system integrity and prevent fraudulent platform activity.</li>
            </ul>
          </section>

          <div className="border-t border-neutral-100" />

          {/* Section 3 */}
          <section>
            <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-neutral-900 flex items-center gap-2">
              <Lock className="text-neutral-900" size={16} /> 3. Security & Storage
            </h2>
            <p className="leading-relaxed">
              We implement industry-standard JWT authentication and password hashing algorithms to guarantee that your sensitive personal details remain safe from unauthorized access.
            </p>
          </section>

          <div className="border-t border-neutral-100" />

          {/* Section 4 */}
          <section>
            <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-neutral-900 flex items-center gap-2">
              <Cookie className="text-neutral-900" size={16} /> 4. Local Storage & Sessions
            </h2>
            <p className="leading-relaxed">
              The Butcher's Shop uses browser local storage (<code className="rounded bg-neutral-100 px-1.5 py-0.5 text-[11px] font-mono text-neutral-800">localStorage</code>) to keep you securely authenticated across page reloads and browser sessions. You can clear this data at any time by logging out of your account.
            </p>
          </section>

          {/* Contact Box */}
          <div className="mt-8 rounded-xl border border-neutral-200 bg-neutral-50 p-5 space-y-1.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900 flex items-center gap-2">
              <Mail size={14} /> Data Access & Removal Requests
            </h3>
            <p className="text-xs text-neutral-500">
              If you wish to export or request the permanent deletion of your account data, please contact{" "}
              <a 
                href="mailto:privacy@thebutchersshop.com" 
                className="font-semibold text-neutral-900 underline underline-offset-2 hover:text-neutral-600 transition"
              >
                privacy@thebutchersshop.com
              </a>.
            </p>
          </div>
        </div>

        {/* Footer Note */}
        <p className="mt-8 text-center text-[11px] text-neutral-400">
          The Butcher's Shop — All privacy rights reserved.
        </p>
      </div>
    </div>
  );
}