import { Link } from "react-router-dom";
import { ShieldCheck } from "lucide-react";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative border-t border-neutral-200 bg-white font-sans text-neutral-900">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        
        {/* Brand Logo & Tagline */}
        <div className="flex items-center gap-3">
          <Link
            to="/home"
            onClick={scrollToTop}
            className="flex items-center gap-2.5"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-900 text-white shadow-sm">
              <span className="font-black tracking-tighter text-sm">BS</span>
            </div>
            <span className="text-lg font-black tracking-tighter uppercase">
              The Butcher's Shop
            </span>
          </Link>
          <span className="hidden text-xs text-neutral-300 sm:inline">|</span>
          <p className="text-xs text-neutral-500 font-medium">
            Discover fresh quality products. Shop with confidence.
          </p>
        </div>

        {/* Navigation Links */}
        <div className="flex flex-wrap items-center gap-5 text-xs font-semibold text-neutral-600">
          <Link onClick={scrollToTop} className="transition hover:text-neutral-900" to="/product">
            Products
          </Link>
          <Link onClick={scrollToTop} className="transition hover:text-neutral-900" to="/categories">
            Categories
          </Link>
          <Link onClick={scrollToTop} className="transition hover:text-neutral-900" to="/cart">
            Cart
          </Link>
          <span className="text-neutral-300">•</span>
          <Link onClick={scrollToTop} className="transition hover:text-neutral-900" to="/terms">
            Terms of Service
          </Link>
          <Link onClick={scrollToTop} className="transition hover:text-neutral-900" to="/privacy">
            Privacy Policy
          </Link>

          {/* Admin Footer Link */}
          {localStorage.getItem("role") === "ADMIN" && (
            <>
              <span className="text-neutral-300">•</span>
              <Link
                onClick={scrollToTop}
                className="transition text-neutral-900 font-bold inline-flex items-center gap-1"
                to="/admin"
              >
                <ShieldCheck size={14} /> Admin Portal
              </Link>
            </>
          )}
        </div>
      </div>

      <div className="border-t border-neutral-100 py-4 text-center text-[11px] text-neutral-400">
        © {new Date().getFullYear()} The Butcher's Shop. All rights reserved.
      </div>
    </footer>
  );
}