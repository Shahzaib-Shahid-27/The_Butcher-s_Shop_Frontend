
import { useNavigate } from "react-router-dom";
import {
  CheckCircle2,
  ShoppingBag,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";

export default function ThankYou() {
  const navigate = useNavigate();

  const isAdmin = localStorage.getItem("role") === "ADMIN";

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-[#FBF8F3] px-4 py-12 font-sans text-[#351D1D] selection:bg-[#8B2635] selection:text-white">

      {/* Top Banner */}
      <div className="absolute inset-x-0 top-0 bg-[#351D1D] px-4 py-2 text-center text-[11px] font-medium tracking-wide text-white">
        Order Confirmation — The Butcher's Shop
      </div>

      {/* Confirmation Card */}
      <div className="mt-6 w-full max-w-lg rounded-2xl border border-[#E8DED3] bg-white p-8 text-center shadow-xl shadow-[#351D1D]/5 sm:p-10">

        {/* Logo */}
        <div className="mx-auto mb-7 flex h-12 w-12 items-center justify-center rounded-full bg-[#8B2635] text-white shadow-sm">
          <span className="text-lg font-black tracking-tighter">
            BS
          </span>
        </div>

        {/* Success Icon */}
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-[#D9E8D9] bg-[#F0F6ED] text-[#477A45] shadow-sm">
          <CheckCircle2 size={32} />
        </div>

        <span className="rounded-full bg-[#F4EEE6] px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-[#8B2635]">
          Order Successful
        </span>

        <h1 className="mt-5 text-3xl font-black tracking-tight text-[#351D1D] sm:text-4xl">
          Thank You!
        </h1>

        <p className="mt-3 text-sm font-semibold text-[#6D5B52]">
          Your order has been placed successfully.
        </p>

        <p className="mx-auto mt-2 max-w-sm text-xs leading-relaxed text-[#927D70]">
          Thank you for shopping with The Butcher's Shop. We'll
          process your order and keep you updated.
        </p>

        {/* Divider */}
        <div className="my-8 border-t border-[#E8DED3]" />

        {/* Action Buttons */}
        <div className="space-y-3">

          <button
            type="button"
            onClick={() => navigate("/product")}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#8B2635] px-4 py-3.5 text-xs font-bold uppercase tracking-wider text-white shadow-md transition hover:bg-[#6F1D2A] active:scale-[0.99]"
          >
            <ShoppingBag size={16} />
            Continue Shopping
            <ArrowRight size={15} />
          </button>

          {isAdmin && (
            <button
              type="button"
              onClick={() => navigate("/admin")}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[#E8DED3] bg-[#F4EEE6] px-4 py-3.5 text-xs font-bold uppercase tracking-wider text-[#351D1D] transition hover:border-[#8B2635] hover:text-[#8B2635]"
            >
              <ShieldCheck size={16} />
              Go to Admin Dashboard
            </button>
          )}

          <button
            type="button"
            onClick={() => navigate("/home")}
            className="w-full rounded-xl px-4 py-3 text-xs font-semibold text-[#927D70] transition hover:text-[#8B2635]"
          >
            Back to Home
          </button>
        </div>
      </div>

      {/* Footer Note */}
      <p className="mt-6 text-center text-[11px] text-[#927D70]">
        Fresh Quality. Trusted Service. Thank you for choosing us.
      </p>
    </div>
  );
}
