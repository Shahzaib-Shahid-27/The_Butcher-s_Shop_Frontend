import { useEffect, useState, useRef } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../../api/api";
import { ShoppingBag, ShieldCheck, User, LogOut, LogIn, UserPlus, Menu, X, ChevronDown } from "lucide-react";

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
        ? "bg-neutral-900 text-white shadow-sm"
        : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
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
          className="flex items-center gap-1 rounded-xl px-3.5 py-2 text-xs font-semibold text-neutral-600 transition hover:bg-neutral-100 hover:text-neutral-900"
        >
          Categories
          <ChevronDown size={14} className={`transition-transform duration-200 ${categoryDropdownOpen ? "rotate-180" : ""}`} />
        </button>

        {categoryDropdownOpen && (
          <div className="absolute left-0 mt-2 w-56 rounded-2xl border border-neutral-200 bg-white p-2 shadow-xl z-50">
            <NavLink
              to="/categories"
              onClick={handleNavClick}
              className="block rounded-xl px-3 py-2 text-xs font-bold text-neutral-900 hover:bg-neutral-50 transition"
            >
              View All Categories →
            </NavLink>
            <div className="my-1 border-t border-neutral-100" />
            <div className="max-h-60 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
              {categories.length === 0 ? (
                <div className="px-3 py-2 text-xs text-neutral-400">No categories found</div>
              ) : (
                categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => handleCategorySelect(cat.id)}
                    className="w-full text-left rounded-xl px-3 py-2 text-xs font-medium text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 transition truncate"
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

      {/* Admin Panel Nav Link */}
      {localStorage.getItem("role") === "ADMIN" && (
        <NavLink to="/admin" className={linkClass} onClick={handleNavClick}>
          <ShieldCheck size={14} className="inline mr-1" /> Admin Dashboard
        </NavLink>
      )}
    </>
  );

  return (
    <motion.header
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky top-0 z-40 border-b border-neutral-200 bg-white/90 font-sans shadow-sm backdrop-blur-xl"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6 lg:px-8">
        
        {/* Brand Logo */}
        <Link
          to="/home"
          onClick={handleNavClick}
          className="flex items-center gap-2.5 text-lg font-black tracking-tight text-neutral-900 uppercase"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-neutral-900 text-white shadow-sm">
            <span className="font-black tracking-tighter text-base">BS</span>
          </div>
          <span>The Butcher's Shop</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1.5 md:flex">{navLinks}</nav>

        {/* User / Auth Buttons */}
        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <>
              <span className="max-w-36 truncate text-xs font-semibold text-neutral-700 flex items-center gap-1">
                <User size={13} /> Hi, {user.name || user.email || "User"}
              </span>
              <button
                onClick={handleLogout}
                className="rounded-xl border border-red-200 bg-white px-3.5 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50 shadow-sm inline-flex items-center gap-1.5"
              >
                <LogOut size={13} /> Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                onClick={handleNavClick}
                className="rounded-xl border border-neutral-200 bg-white px-4 py-2 text-xs font-semibold text-neutral-800 transition hover:border-neutral-900 shadow-sm inline-flex items-center gap-1.5"
              >
                <LogIn size={13} /> Login
              </Link>
              <Link
                to="/register"
                onClick={handleNavClick}
                className="rounded-xl bg-neutral-900 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white shadow-md transition hover:bg-neutral-800 inline-flex items-center gap-1.5"
              >
                <UserPlus size={13} /> Register
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          className="rounded-xl border border-neutral-200 bg-white p-2 text-neutral-800 md:hidden hover:border-neutral-900 shadow-sm"
          aria-label="Toggle navigation"
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {menuOpen && (
        <nav className="flex flex-col gap-1.5 border-t border-neutral-200 bg-white p-4 md:hidden shadow-lg">
          {navLinks}
          <div className="mt-2 flex gap-2 border-t border-neutral-100 pt-3">
            {user ? (
              <button
                onClick={handleLogout}
                className="w-full rounded-xl border border-red-200 bg-red-50 py-2.5 text-xs font-semibold text-red-600 inline-flex items-center justify-center gap-1.5"
              >
                <LogOut size={13} /> Logout
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={handleNavClick}
                  className="flex-1 rounded-xl border border-neutral-200 bg-white py-2.5 text-center text-xs font-semibold text-neutral-800 shadow-sm"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={handleNavClick}
                  className="flex-1 rounded-xl bg-neutral-900 py-2.5 text-center text-xs font-bold uppercase tracking-wider text-white shadow-md"
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