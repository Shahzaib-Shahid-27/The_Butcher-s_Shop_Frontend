
import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Menu, X, ShoppingCart, ChevronDown, User, LogOut, LayoutDashboard } from "lucide-react";
import  api  from "../../api/api";

interface Category {
  id: string;
  name: string;
}

interface UserData {
  name?: string;
  email?: string;
}

const Header = () => {
  const navigate = useNavigate();

  const [categories, setCategories] = useState<Category[]>([]);
  const [user, setUser] = useState<UserData | null>(null);
  const [role, setRole] = useState<string | null>(
    localStorage.getItem("role")
  );

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoryMenuOpen, setCategoryMenuOpen] = useState(false);

  const isAdmin = user !== null && role === "ADMIN";
  const isUser = user !== null && role === "USER";

  // Load user and role from localStorage
  const loadUser = () => {
    const savedUser = localStorage.getItem("user");
    const savedRole = localStorage.getItem("role");

    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        setUser(null);
      }
    } else {
      setUser(null);
    }

    setRole(savedRole);
  };

  // Fetch categories
  const loadCategories = async () => {
    try {
      const response = await api.get("/categories/");

      const result = response.data?.data || response.data;

      if (Array.isArray(result)) {
        setCategories(result);
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  useEffect(() => {
    loadUser();
    loadCategories();

    const handleAuthChange = () => {
      loadUser();
    };

    window.addEventListener("storage", handleAuthChange);
    window.addEventListener("auth-changed", handleAuthChange);

    return () => {
      window.removeEventListener("storage", handleAuthChange);
      window.removeEventListener("auth-changed", handleAuthChange);
    };
  }, []);

  // Logout
  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("role");

      setUser(null);
      setRole(null);
      setMobileMenuOpen(false);

      window.dispatchEvent(new Event("auth-changed"));
      navigate("/login");
    }
  };

  const closeMenus = () => {
    setMobileMenuOpen(false);
    setCategoryMenuOpen(false);
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `transition-colors duration-200 ${
      isActive
        ? "text-[#8B2635] font-semibold"
        : "text-[#332B28] hover:text-[#8B2635]"
    }`;

  const navigation = (
    <>
      <NavLink to="/home" className={navLinkClass} onClick={closeMenus}>
        Home
      </NavLink>

      <div className="relative">
        <button
          type="button"
          onClick={() => setCategoryMenuOpen(!categoryMenuOpen)}
          className="flex items-center gap-1 text-[#332B28] transition-colors hover:text-[#8B2635]"
        >
          Categories
          <ChevronDown
            size={16}
            className={`transition-transform ${
              categoryMenuOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {categoryMenuOpen && (
          <div className="absolute left-0 top-full z-50 mt-3 w-56 rounded-xl border border-[#E8DED3] bg-white p-2 shadow-xl">
            <Link
              to="/categories"
              onClick={closeMenus}
              className="block rounded-lg px-4 py-2 text-sm font-semibold text-[#8B2635] hover:bg-[#F8F1EA]"
            >
              All Categories
            </Link>

            {categories.map((category) => (
              <Link
                key={category.id}
                to={`/categories/${category.id}/products`}
                onClick={closeMenus}
                className="block rounded-lg px-4 py-2 text-sm text-[#332B28] hover:bg-[#F8F1EA]"
              >
                {category.name}
              </Link>
            ))}
          </div>
        )}
      </div>

      <NavLink to="/product" className={navLinkClass} onClick={closeMenus}>
        Products
      </NavLink>

      {isAdmin && (
        <NavLink
          to="/admin"
          className={navLinkClass}
          onClick={closeMenus}
        >
          <span className="flex items-center gap-2">
            <LayoutDashboard size={17} />
            Admin Dashboard
          </span>
        </NavLink>
      )}

      {user && (
        <NavLink to="/cart" className={navLinkClass} onClick={closeMenus}>
          <span className="flex items-center gap-2">
            <ShoppingCart size={17} />
            Cart
          </span>
        </NavLink>
      )}
    </>
  );

  return (
    <header className="relative z-50 w-full bg-[#FBF8F3]">
      {/* Announcement bar */}
      <div className="bg-[#351D1D] px-4 py-2 text-center text-xs tracking-wide text-white sm:text-sm">
        Fresh quality meat delivered to your doorstep
      </div>

      {/* Main header */}
      <div className="border-b border-[#E8DED3]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link
            to={user ? "/home" : "/"}
            className="flex items-center gap-3"
            onClick={closeMenus}
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#8B2635] text-lg font-bold text-white">
              BS
            </div>

            <div>
              <h1 className="text-xl font-bold tracking-tight text-[#351D1D] sm:text-2xl">
                The Butcher's Shop
              </h1>
            </div>
          </Link>

          {/* Desktop navigation */}
          <nav className="hidden items-center gap-7 text-sm font-medium lg:flex">
            {navigation}
          </nav>

          {/* Desktop account section */}
          <div className="hidden items-center gap-3 lg:flex">
            {user ? (
              <>
                <div className="flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#EFE5DB] text-[#8B2635]">
                    <User size={18} />
                  </div>

                  <div>
                    <p className="max-w-32 truncate text-sm font-semibold text-[#351D1D]">
                      {user.name || user.email || "Account"}
                    </p>
                    <p className="text-xs text-[#927D70]">
                      {isAdmin
                        ? "Administrator"
                        : isUser
                          ? "Customer"
                          : "Account"}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex items-center gap-2 rounded-lg border border-[#8B2635] px-4 py-2 text-sm font-semibold text-[#8B2635] transition hover:bg-[#8B2635] hover:text-white"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-semibold text-[#351D1D] transition hover:text-[#8B2635]"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  className="rounded-lg bg-[#8B2635] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#6F1D2A]"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-lg p-2 text-[#351D1D] hover:bg-[#EFE5DB] lg:hidden"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={25} /> : <Menu size={25} />}
          </button>
        </div>
      </div>

      {/* Mobile navigation */}
      {mobileMenuOpen && (
        <div className="border-b border-[#E8DED3] bg-[#FBF8F3] px-5 py-5 shadow-lg lg:hidden">
          <nav className="flex flex-col gap-5 text-sm font-medium">
            {navigation}
          </nav>

          <div className="mt-6 border-t border-[#E8DED3] pt-5">
            {user ? (
              <div className="space-y-4">
                <div>
                  <p className="font-semibold text-[#351D1D]">
                    {user.name || user.email || "Account"}
                  </p>
                  <p className="text-xs text-[#927D70]">
                    {isAdmin
                      ? "Administrator"
                      : isUser
                        ? "Customer"
                        : "Account"}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#8B2635] px-4 py-3 font-semibold text-white transition hover:bg-[#6F1D2A]"
                >
                  <LogOut size={17} />
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex gap-3">
                <Link
                  to="/login"
                  onClick={closeMenus}
                  className="flex-1 rounded-lg border border-[#8B2635] py-3 text-center font-semibold text-[#8B2635]"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  onClick={closeMenus}
                  className="flex-1 rounded-lg bg-[#8B2635] py-3 text-center font-semibold text-white"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
