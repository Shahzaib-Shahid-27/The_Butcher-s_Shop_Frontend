
import { useNavigate } from "react-router-dom";
import { CheckCircle2, ShoppingBag, ShieldCheck } from "lucide-react";

export default function ThankYou() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen bg-white font-sans text-neutral-900 flex flex-col items-center justify-center px-4 py-12 selection:bg-neutral-900 selection:text-white">
      
      {/* Top Banner */}
      <div className="absolute top-0 inset-x-0 bg-neutral-900 text-white text-[11px] py-2 px-4 text-center font-medium tracking-wide">
        Order Confirmation — The Butcher's Shop
      </div>

      <div className="w-full max-w-lg rounded-2xl border border-neutral-200 bg-white p-8 shadow-xl shadow-neutral-100 text-center mt-6">
        
        {/* Success Icon */}
        <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 shadow-sm">
          <CheckCircle2 size={28} />
        </div>

        <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
          Success
        </span>
        <h1 className="text-3xl font-black tracking-tight text-neutral-900 mt-1">
          Thank You!
        </h1>
        
        <p className="mt-2 text-xs font-semibold text-neutral-800">
          Your order has been placed successfully.
        </p>
        <p className="mt-1 text-xs text-neutral-500 leading-relaxed max-w-sm mx-auto">
          The shop owner will receive your order details by email shortly.
        </p>

        {/* Action Buttons */}
        <div className="mt-8 space-y-3">
          <button
            onClick={() => navigate("/products")}
            className="w-full rounded-xl bg-neutral-900 py-3.5 px-4 text-xs font-bold uppercase tracking-wider text-white shadow-md transition hover:bg-neutral-800 active:scale-[0.99] inline-flex items-center justify-center gap-2"
          >
            <ShoppingBag size={15} /> Continue Shopping
          </button>

          {localStorage.getItem("role") === "ADMIN" && (
            <button
              onClick={() => navigate("/admin")}
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50 py-3.5 px-4 text-xs font-bold uppercase tracking-wider text-neutral-800 transition hover:bg-neutral-100 hover:border-neutral-900 inline-flex items-center justify-center gap-2 shadow-sm"
            >
              <ShieldCheck size={15} /> Go to Admin Dashboard
            </button>
          )}
        </div>
      </div>

      <p className="mt-6 text-[11px] text-neutral-400">
        Secure checkout completed via The Butcher's Shop Portal.
      </p>
    </div>
  );
}