
import { Link } from "react-router-dom";
import { ShieldCheck } from "lucide-react";

export default function Footer() {
  const isAdmin = localStorage.getItem("role") === "ADMIN";

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative border-t border-[#E8DED3] bg-[#FBF8F3] font-sans text-[#351D1D]">

      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-10 sm:px-6 lg:px-8">

        {/* Brand Logo & Tagline */}
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

          <div className="flex items-center gap-3">
            <Link
              to="/home"
              onClick={scrollToTop}
              className="flex shrink-0 items-center gap-3"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#8B2635] text-white shadow-sm">
                <span className="text-lg font-black tracking-tighter">
                  BS
                </span>
              </div>

              <div>
                <span className="block text-lg font-bold tracking-tight text-[#351D1D]">
                  The Butcher's Shop
                </span>
               
              </div>
            </Link>
          </div>

          
        </div>

        {/* Divider */}
        <div className="h-px w-full bg-[#E8DED3]" />

        {/* Navigation Links */}
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

          <div className="flex flex-wrap items-center gap-x-6 gap-y-4 text-sm font-medium text-[#6D5B52]">

            <Link
              onClick={scrollToTop}
              className="transition-colors hover:text-[#8B2635]"
              to="/product"
            >
              Products
            </Link>

            <Link
              onClick={scrollToTop}
              className="transition-colors hover:text-[#8B2635]"
              to="/categories"
            >
              Categories
            </Link>

            <Link
              onClick={scrollToTop}
              className="transition-colors hover:text-[#8B2635]"
              to="/cart"
            >
              Cart
            </Link>


            {/* Admin Footer Link */}
            {isAdmin && (
              <Link
                onClick={scrollToTop}
                className="inline-flex items-center gap-2 font-bold text-[#8B2635] transition-colors hover:text-[#6F1D2A]"
                to="/admin"
              >
                <ShieldCheck size={16} />
                Admin Portal
              </Link>
            )}
          </div>

          <p className="text-xs font-medium text-[#927D70]">
            Freshness Delivered to Your Doorstep
          </p>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-[#E8DED3] bg-[#F4EEE6] px-4 py-5 flex justify-between text-center text-xs text-[#927D70]">
            <Link
              onClick={scrollToTop}
              className="transition-colors hover:text-[#8B2635]"
              to="/terms"
            >
              Terms of Service
            </Link>

              © {new Date().getFullYear()} The Butcher's Shop. All rights reserved.

            <Link
              onClick={scrollToTop}
              className="transition-colors hover:text-[#8B2635]"
              to="/privacy"
            >
              Privacy Policy
            </Link>
        

      </div>

    </footer>
  );
}
