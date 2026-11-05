
import { Link } from "react-router-dom";
import {
  FileText,
  ShieldCheck,
  ArrowLeft,
  Scale,
  Lock,
  RefreshCw,
  Mail,
} from "lucide-react";

export default function TermsOfService() {
  const scrollToTop = () =>
    window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <div className="relative min-h-screen bg-[#FBF8F3] px-4 py-12 font-sans text-[#351D1D] selection:bg-[#8B2635] selection:text-white sm:px-6 lg:px-8">
      {/* Top Banner */}
      <div className="absolute inset-x-0 top-0 bg-[#351D1D] px-4 py-2 text-center text-[11px] font-medium tracking-wide text-white">
        Legal Governance — Butcher Shop Terms of Service
      </div>

      <div className="relative mx-auto mt-6 max-w-4xl">
        {/* Navigation Bar */}
        <div className="mb-8 flex flex-col gap-5 border-b border-[#E8DED3] pb-6 sm:flex-row sm:items-center sm:justify-between">
          <Link
            to="/home"
            onClick={scrollToTop}
            className="flex items-center gap-3"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#8B2635] text-white shadow-sm">
              <span className="text-lg font-black tracking-tighter">
                BS
              </span>
            </div>

            <div>
              <span className="block text-xl font-bold tracking-tight text-[#351D1D]">
                Butcher Shop
              </span>
              <span className="text-[10px] font-semibold text-[#927D70]">
                Quality You Can Taste
              </span>
            </div>
          </Link>

          <Link
            to="/home"
            onClick={scrollToTop}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#E8DED3] bg-white px-4 py-2.5 text-xs font-semibold text-[#6D5B52] shadow-sm transition hover:border-[#8B2635] hover:text-[#8B2635]"
          >
            <ArrowLeft size={15} />
            Back to Home
          </Link>
        </div>

        {/* Hero Header */}
        <div className="mb-8 rounded-2xl border border-[#E8DED3] bg-[#F4EEE6] p-8 sm:p-10">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-[#E8D8D0] px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-[#8B2635]">
            <Scale size={13} />
            Legal Framework
          </div>

          <h1 className="text-3xl font-black leading-tight tracking-tight text-[#351D1D] sm:text-4xl">
            TERMS OF <span className="text-[#8B2635]">SERVICE.</span>
          </h1>

          <p className="mt-3 text-xs font-medium leading-relaxed text-[#927D70]">
            Last updated: November 2026 • Please review these terms
            carefully before using the Butcher Shop platform.
          </p>
        </div>

        {/* Terms Body */}
        <div className="space-y-8 rounded-2xl border border-[#E8DED3] bg-white p-6 text-xs leading-relaxed text-[#6D5B52] shadow-xl shadow-[#351D1D]/5 sm:p-10">
          {/* Section 1 */}
          <section>
            <h2 className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-[#351D1D]">
              <FileText className="text-[#8B2635]" size={17} />
              1. Acceptance of Terms
            </h2>

            <p>
              By creating an account or accessing the Butcher Shop
              platform, you agree to these Terms of Service and applicable
              laws and regulations. If you do not agree with these terms,
              you should not access or use the platform.
            </p>
          </section>

          <div className="border-t border-[#E8DED3]" />

          {/* Section 2 */}
          <section>
            <h2 className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-[#351D1D]">
              <ShieldCheck className="text-[#8B2635]" size={17} />
              2. User Accounts & Responsibilities
            </h2>

            <p>
              When registering an account with Butcher Shop, you must
              provide accurate and complete information. You are
              responsible for maintaining the confidentiality of your
              account credentials and for activities conducted through
              your account.
            </p>

            <ul className="mt-3 list-disc space-y-2 pl-5 text-[#927D70]">
              <li>
                You must be at least 18 years old or have appropriate
                parental or guardian supervision where legally required.
              </li>
              <li>
                Unauthorized access, credential sharing, or account
                takeover attempts are prohibited.
              </li>
              <li>
                Notify the platform support team if you notice suspicious
                or unauthorized activity on your account.
              </li>
            </ul>
          </section>

          <div className="border-t border-[#E8DED3]" />

          {/* Section 3 */}
          <section>
            <h2 className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-[#351D1D]">
              <Lock className="text-[#8B2635]" size={17} />
              3. Products, Cart & Pricing
            </h2>

            <p>
              Product descriptions, images, prices, and availability are
              provided to help customers make informed shopping decisions.
              Butcher Shop reserves the right to correct listing errors
              and update product information or prices when necessary.
              Products are subject to availability.
            </p>
          </section>

          <div className="border-t border-[#E8DED3]" />

          {/* Section 4 */}
          <section>
            <h2 className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-[#351D1D]">
              <RefreshCw className="text-[#8B2635]" size={17} />
              4. Modifications to Terms
            </h2>

            <p>
              We may revise or update these Terms of Service from time
              to time. Updated terms will be published on this page.
              Continued use of the platform after changes take effect
              constitutes acceptance of the revised terms, to the extent
              permitted by applicable law.
            </p>
          </section>

          {/* Legal Contact Box */}
          <div className="mt-8 space-y-2 rounded-xl border border-[#E8DED3] bg-[#F4EEE6] p-5">
            <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#351D1D]">
              <Mail size={15} className="text-[#8B2635]" />
              Questions Regarding Our Terms?
            </h3>

            <p className="text-xs leading-relaxed text-[#927D70]">
              For questions about these terms, please contact the
              Butcher Shop support team through the contact details
              provided on the platform.
            </p>
          </div>
        </div>

        {/* Footer Note */}
        <p className="mt-8 text-center text-[11px] text-[#927D70]">
          Butcher Shop — Quality You Can Taste.
        </p>
      </div>
    </div>
  );
}
