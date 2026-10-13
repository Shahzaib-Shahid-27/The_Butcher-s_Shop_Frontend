import { useEffect, useState, useRef } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../api/api";

interface LoggedInUser {
  id: string;
  name?: string;
  email?: string;
}

interface Category {
  id: string;
  name: string;
}

export default function Header() {
  const navigate = useNavigate();
  const [user, setUser] = useState<LoggedInUser | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadUser = () => {
      try {
        const saved = localStorage.getItem("user");
        setUser(saved ? JSON.parse(saved) : null);
      } catch {
        setUser(null);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await api.get("/categories/");
        setCategories(response.data.data || response.data);
      } catch (error) {
        console.error("Failed to fetch header categories:", error);
      }
    };

    loadUser();
    void fetchCategories();

    window.addEventListener("storage", loadUser);
    window.addEventListener("auth-changed", loadUser);

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setCategoryDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("storage", loadUser);
      window.removeEventListener("auth-changed", loadUser);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    setUser(null);
    setMenuOpen(false);
    setCategoryDropdownOpen(false);
    window.dispatchEvent(new Event("auth-changed"));
    window.scrollTo({ top: 0, behavior: "smooth" });
    navigate("/login");
  };

  const handleNavClick = () => {
    setMenuOpen(false);
    setCategoryDropdownOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCategorySelect = (categoryId: string) => {
    setCategoryDropdownOpen(false);
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
    navigate(`/categories/${categoryId}/products`);
  };

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `rounded-xl px-3.5 py-2 text-xs font-semibold transition ${
      isActive
        ? "bg-blue-500/15 text-cyan-400 border border-blue-500/30"
        : "text-slate-300 hover:bg-[#0a1128] hover:text-white"
    }`;

  const navLinks = (
    <>
      <NavLink to="/home" className={linkClass} onClick={handleNavClick}>
        Home
      </NavLink>

      {/* Categories Dropdown */}
      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setCategoryDropdownOpen((prev) => !prev)}
          className="flex items-center gap-1 rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-300 transition hover:bg-[#0a1128] hover:text-white"
        >
          Categories
          <span className={`text-[10px] transition-transform duration-200 ${categoryDropdownOpen ? "rotate-180" : ""}`}>
            ▼
          </span>
        </button>

        {categoryDropdownOpen && (
          <div className="absolute left-0 mt-2 w-56 rounded-2xl border border-slate-800 bg-[#070b19] p-2 shadow-2xl backdrop-blur-xl z-50">
            <NavLink
              to="/categories"
              onClick={handleNavClick}
              className="block rounded-xl px-3 py-2 text-xs font-bold text-cyan-400 hover:bg-blue-500/10 transition"
            >
              View All Categories →
            </NavLink>
            <div className="my-1 border-t border-slate-800" />
            <div className="max-h-60 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
              {categories.length === 0 ? (
                <div className="px-3 py-2 text-xs text-slate-500">No categories found</div>
              ) : (
                categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => handleCategorySelect(cat.id)}
                    className="w-full text-left rounded-xl px-3 py-2 text-xs font-medium text-slate-300 hover:bg-slate-800/60 hover:text-white transition truncate"
                  >
                    {cat.name}
                  </button>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      <NavLink to="/product" className={linkClass} onClick={handleNavClick}>
        Products
      </NavLink>
      {user && (
        <NavLink to="/cart" className={linkClass} onClick={handleNavClick}>
          Cart
        </NavLink>
      )}
    </>
  );

  return (
    <motion.header
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky top-0 z-40 border-b border-slate-800/80 bg-[#030712]/90 font-sans shadow-xl backdrop-blur-xl"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link
          to="/home"
          onClick={handleNavClick}
          className="flex items-center gap-2.5 text-lg font-extrabold tracking-tight text-white"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-tr from-blue-600 to-cyan-400 shadow-md shadow-cyan-500/20">
            <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <span>The Butcher's Shop</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1.5 md:flex">{navLinks}</nav>

        {/* User / Auth Buttons */}
        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <>
              <span className="max-w-36 truncate text-xs font-medium text-slate-300">
                Hi, {user.name || user.email || "User"}
              </span>
              <button
                onClick={handleLogout}
                className="rounded-xl border border-rose-900/40 bg-rose-950/20 px-3.5 py-1.5 text-xs font-semibold text-rose-400 transition hover:border-rose-500/50 hover:bg-rose-500/20"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                onClick={handleNavClick}
                className="rounded-xl border border-blue-900/40 bg-[#060b19] px-4 py-2 text-xs font-semibold text-cyan-400 transition hover:border-cyan-400/50 hover:bg-cyan-500/10"
              >
                Login
              </Link>
              <Link
                to="/register"
                onClick={handleNavClick}
                className="rounded-xl bg-linear-to-r from-blue-600 to-cyan-400 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-cyan-500/20 transition hover:brightness-110"
              >
                Register
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          className="rounded-xl border border-slate-800 bg-[#0a1128] p-2 text-slate-300 md:hidden hover:text-white"
          aria-label="Toggle navigation"
          aria-expanded={menuOpen}
        >
          <span className="text-base">{menuOpen ? "✕" : "☰"}</span>
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {menuOpen && (
        <nav className="flex flex-col gap-1.5 border-t border-slate-800/80 bg-[#0a1128] p-4 md:hidden">
          {navLinks}
          <div className="mt-2 flex gap-2 border-t border-slate-800/60 pt-3">
            {user ? (
              <button
                onClick={handleLogout}
                className="w-full rounded-xl border border-rose-900/40 bg-rose-950/20 py-2.5 text-xs font-semibold text-rose-400"
              >
                Logout
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={handleNavClick}
                  className="flex-1 rounded-xl border border-blue-900/40 bg-[#060b19] py-2.5 text-center text-xs font-semibold text-cyan-400"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={handleNavClick}
                  className="flex-1 rounded-xl bg-linear-to-r from-blue-600 to-cyan-400 py-2.5 text-center text-xs font-bold text-white shadow-lg shadow-cyan-500/20"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </nav>
      )}
    </motion.header>
  );
}