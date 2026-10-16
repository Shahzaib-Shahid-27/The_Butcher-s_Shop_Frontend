import { Link } from "react-router-dom";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative border-t border-slate-800/80 bg-[#060b19] font-sans text-slate-100">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        {/* Brand Logo & Tagline */}
        <div className="flex items-center gap-3">
          <Link
            to="/home"
            onClick={scrollToTop}
            className="flex items-center gap-2 text-xl font-bold tracking-tight text-white"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-tr from-blue-600 to-cyan-400 text-white shadow-md shadow-cyan-500/20">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <span>The Butcher's Shop</span>
          </Link>
          <span className="hidden text-xs text-slate-500 sm:inline">|</span>
          <p className="text-xs text-slate-400">
            Discover products. Shop with confidence.
          </p>
        </div>

        {/* Navigation Links */}
        <div className="flex flex-wrap items-center gap-5 text-xs font-medium text-slate-400">
          <Link onClick={scrollToTop} className="transition hover:text-cyan-400" to="/product">
            Products
          </Link>
          <Link onClick={scrollToTop} className="transition hover:text-cyan-400" to="/categories">
            Categories
          </Link>
          <Link onClick={scrollToTop} className="transition hover:text-cyan-400" to="/cart">
            Cart
          </Link>
          <span className="text-slate-700">•</span>
          <Link onClick={scrollToTop} className="transition hover:text-cyan-400" to="/terms">
            Terms of Service
          </Link>
          <Link onClick={scrollToTop} className="transition hover:text-cyan-400" to="/privacy">
            Privacy Policy
          </Link>
        </div>
      </div>

      <div className="border-t border-slate-800/60 py-4 text-center text-[11px] text-slate-500">
        © {new Date().getFullYear()} The Butcher's Shop. All rights reserved.
      </div>
    </footer>
  );
}