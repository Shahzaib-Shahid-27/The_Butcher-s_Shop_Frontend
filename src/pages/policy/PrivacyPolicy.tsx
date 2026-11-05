
import { Link } from "react-router-dom";
import {
  Shield,
  Eye,
  Database,
  Cookie,
  ArrowLeft,
  Lock,
  Mail,
} from "lucide-react";

export default function PrivacyPolicy() {
  const scrollToTop = () =>
    window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <div className="relative min-h-screen bg-[#FBF8F3] px-4 py-12 font-sans text-[#351D1D] selection:bg-[#8B2635] selection:text-white sm:px-6 lg:px-8">
      {/* Top Banner */}
      <div className="absolute inset-x-0 top-0 bg-[#351D1D] px-4 py-2 text-center text-[11px] font-medium tracking-wide text-white">
        Legal Governance — Butcher Shop Privacy Policy
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
            <Shield size={13} />
            Data Protection & Governance
          </div>

          <h1 className="text-3xl font-black leading-tight tracking-tight text-[#351D1D] sm:text-4xl">
            PRIVACY <span className="text-[#8B2635]">POLICY.</span>
          </h1>

          <p className="mt-3 text-xs font-medium leading-relaxed text-[#927D70]">
            Last updated: November 2026 • Your privacy and personal data
            security are important to us.
          </p>
        </div>

        {/* Policy Body */}
        <div className="space-y-8 rounded-2xl border border-[#E8DED3] bg-white p-6 text-xs leading-relaxed text-[#6D5B52] shadow-xl shadow-[#351D1D]/5 sm:p-10">
          {/* Section 1 */}
          <section>
            <h2 className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-[#351D1D]">
              <Database className="text-[#8B2635]" size={17} />
              1. Information We Collect
            </h2>

            <p>
              We collect information you provide directly when interacting
              with Butcher Shop, such as when creating an account, adding
              products to your cart, or placing an order.
            </p>

            <ul className="mt-3 list-disc space-y-2 pl-5 text-[#927D70]">
              <li>
                <strong className="font-semibold text-[#351D1D]">
                  Account Data:
                </strong>{" "}
                Name, email address, password credentials, and profile
                information.
              </li>

              <li>
                <strong className="font-semibold text-[#351D1D]">
                  Shopping Data:
                </strong>{" "}
                Cart contents, selected products, delivery details, and
                purchase-related information.
              </li>

              <li>
                <strong className="font-semibold text-[#351D1D]">
                  Usage Data:
                </strong>{" "}
                Technical logs, device information, and interaction
                analytics.
              </li>
            </ul>
          </section>

          <div className="border-t border-[#E8DED3]" />

          {/* Section 2 */}
          <section>
            <h2 className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-[#351D1D]">
              <Eye className="text-[#8B2635]" size={17} />
              2. How We Use Your Data
            </h2>

            <p>
              Your information helps us provide, maintain, and improve
              your online shopping experience on Butcher Shop.
            </p>

            <ul className="mt-3 list-disc space-y-2 pl-5 text-[#927D70]">
              <li>
                To manage authentication sessions and secure account access.
              </li>
              <li>
                To organize cart items and support order-related activities.
              </li>
              <li>
                To improve website functionality and the shopping experience.
              </li>
              <li>
                To maintain system integrity and prevent unauthorized
                platform activity.
              </li>
            </ul>
          </section>

          <div className="border-t border-[#E8DED3]" />

          {/* Section 3 */}
          <section>
            <h2 className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-[#351D1D]">
              <Lock className="text-[#8B2635]" size={17} />
              3. Security & Storage
            </h2>

            <p>
              We use security measures such as JWT authentication and
              password hashing to help protect account information against
              unauthorized access. However, no online system can guarantee
              absolute security.
            </p>
          </section>

          <div className="border-t border-[#E8DED3]" />

          {/* Section 4 */}
          <section>
            <h2 className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-[#351D1D]">
              <Cookie className="text-[#8B2635]" size={17} />
              4. Local Storage & Sessions
            </h2>

            <p>
              Butcher Shop uses browser local storage (
              <code className="rounded bg-[#F4EEE6] px-1.5 py-0.5 font-mono text-[11px] text-[#8B2635]">
                localStorage
              </code>
              ) to retain certain authentication information across page
              reloads. You can clear this data by logging out of your
              account. Authentication tokens and cookies are handled
              according to the application's session configuration.
            </p>
          </section>

          {/* Contact Box */}
          <div className="mt-8 space-y-2 rounded-xl border border-[#E8DED3] bg-[#F4EEE6] p-5">
            <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#351D1D]">
              <Mail size={15} className="text-[#8B2635]" />
              Data Access & Removal Requests
            </h3>

            <p className="text-xs leading-relaxed text-[#927D70]">
              If you wish to request access to or deletion of your account
              information, please contact our support team through the
              contact details provided by Butcher Shop.
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
