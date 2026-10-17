import { Suspense, lazy } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";

// Layout components
import Header from "./components/layout/header";
import Footer from "./components/layout/footer";
import CustomCursor from "./components/cursor";

// Route protection
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";

// Authentication pages
const Login = lazy(() => import("./pages/auth/login"));
const Register = lazy(() => import("./pages/auth/register"));
const Forgetpass = lazy(() => import("./pages/auth/forgetpass"));
const VerfyEmail = lazy(() => import("./pages/auth/verfiemail"));
import GoogleSuccess from "./pages/google/GoogleSuccess";

// Store & products
const Home = lazy(() => import("./pages/store/home"));
const Products = lazy(() => import("./pages/store/Products"));

// Admin pages
const CreateProduct = lazy(() => import("./pages/admin/createproduct"));
const EditProduct = lazy(() => import("./pages/admin/EditProduct"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminProducts = lazy(() => import("./pages/admin/AdminProducts"));
const AdminCategories = lazy(() => import("./pages/admin/AdminCategories"));

// Category pages
const Categories = lazy(() => import("./pages/Categories/Categories"));
const CreateCategory = lazy(() => import("./pages/Categories/CreateCategory"));
const EditCategory = lazy(() => import("./pages/Categories/EditCategory"));
const CategoryProductsPage = lazy(() => import("./pages/Categories/CategoryProductsPage").then((m) => ({ default: m.CategoryProductsPage })));

// Cart & checkout
const Cart = lazy(() => import("./pages/store/cart"));
const CartItems = lazy(() => import("./pages/cart/CartItems"));
const Checkout = lazy(() => import("./pages/cart/Checkout"));

// Policy pages
const TermsOfService = lazy(() => import("./pages/policy/TermsOfService"));
const PrivacyPolicy = lazy(() => import("./pages/policy/PrivacyPolicy"));

export default function App() {
  const location = useLocation();
  const hideLayout = ["/login", "/register", "/forgetpass", "/verfyemail", "/google-success"].includes(location.pathname);

  return (
    <div className="flex min-h-screen flex-col bg-white text-neutral-900 font-sans selection:bg-neutral-900 selection:text-white">
      {!hideLayout && <Header />}
      <CustomCursor />
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
          >
            <Suspense fallback={<div className="p-12 text-center text-xs font-semibold text-neutral-400">Loading...</div>}>
              <Routes location={location}>
                <Route
                  path="/"
                  element={<Navigate to={localStorage.getItem("accessToken") ? "/home" : "/login"} replace />}
                />
                {/* Auth */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgetpass" element={<Forgetpass />} />
                <Route path="/verfyemail" element={<VerfyEmail />} />
                <Route path="/google-success" element={<GoogleSuccess />} />

                {/* Store */}
                <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
                <Route path="/product" element={<ProtectedRoute><Products /></ProtectedRoute>} />

                {/* Categories */}
                <Route path="/categories" element={<ProtectedRoute><Categories /></ProtectedRoute>} />
                <Route path="/createcategory" element={<ProtectedRoute><CreateCategory /></ProtectedRoute>} />
                <Route path="/editcategory/:id" element={<AdminRoute><EditCategory /></AdminRoute>} />
                <Route path="/categories/:categoryId/products" element={<ProtectedRoute><CategoryProductsPage /></ProtectedRoute>} />

                {/* Cart & Checkout */}
                <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
                <Route path="/cartitems" element={<ProtectedRoute><CartItems /></ProtectedRoute>} />
                <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />

                {/* Admin */}
                <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
                <Route path="/admin/products" element={<AdminRoute><AdminProducts /></AdminRoute>} />
                <Route path="/admin/products/create" element={<AdminRoute><CreateProduct /></AdminRoute>} />
                <Route path="/admin/categories" element={<AdminRoute><AdminCategories /></AdminRoute>} />
                <Route path="/editproduct/:id" element={<AdminRoute><EditProduct /></AdminRoute>} />

                {/* Legal */}
                <Route path="/terms" element={<ProtectedRoute><TermsOfService /></ProtectedRoute>} />
                <Route path="/privacy" element={<ProtectedRoute><PrivacyPolicy /></ProtectedRoute>} />

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>
          </motion.div>
        </AnimatePresence>
      </main>
      {!hideLayout && <Footer />}
    </div>
  );
}