import { Suspense, lazy } from "react";
import { AnimatePresence, motion, } from "motion/react";
import { Routes, Route, useLocation,Navigate } from "react-router-dom";


// IN COMPONENTS LAYOUT SECTION
import Header from "./components/layout/header";
import Footer from "./components/layout/footer";


// AUTH SECTION 
const Login = lazy(() => import("./pages/auth/login"));
const Register = lazy(() => import("./pages/auth/register"));
const Forgetpass = lazy(() => import("./pages/auth/forgetpass"));
const VerfyEmail = lazy(() => import("./pages/auth/verfiemail"));


// CART SECTION
const Cart = lazy(() => import("./pages/cart/cart"));
const CartItems = lazy(() => import("./pages/cart/CartItems"));
import Checkout from "./pages/cart/Checkout";


// CATEGOREEA SECTION
const Categories = lazy(() => import("./pages/Categories/Categories"));
const CreateCategory = lazy(() => import("./pages/Categories/CreateCategory"));
const EditCategory = lazy(() => import("./pages/Categories/EditCategory"));
const CategoryProductsPage = lazy(() => import("./pages/Categories/CategoryProductsPage").then((m) => ({default: m.CategoryProductsPage,})));


// GOOGLE SECTION
import GoogleSuccess from "./pages/google/GoogleSuccess";


// IN PAGES LAYOUT SEECTION
const Home = lazy(() => import("./pages/layout/home"));


// POLICY SECTION
const TermsOfService = lazy(() => import("./pages/policy/TermsOfService"));
const PrivacyPolicy = lazy(() => import("./pages/policy/PrivacyPolicy"));


// PRODUCT SECTION
const CreateProduct = lazy(() => import("./pages/product/createproduct"));
const EditProduct = lazy(() => import("./pages/product/EditProduct"));
const Products = lazy(() => import("./pages/product/Products"));


// IN COMPONENTS FOLDER
import CustomCursor from "./components/cursor";

// IN COMPONENTS FOLDER
import ProtectedRoute from "./components/ProtectedRoute";


function App() {
  const location = useLocation();

  const hideLayout = [
    "/login",
    "/register",
    "/forgetpass",
    "/verfyemail",
    "/google-success",
  ].includes(location.pathname);

  return (
    <div className="flex min-h-screen flex-col text-white">
      {!hideLayout && <Header />}
      <CustomCursor />

      <main className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22 }}
          >
            <Suspense fallback={<div className="p-10 text-center">Loading...</div>}>
              <Routes location={location}>
                <Route
                  path="/"
                  element={
                    <Navigate
                      to={localStorage.getItem("accessToken") ? "/home" : "/login"}
                      replace
                    />
                  }
                />

                {/* Authentication */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgetpass" element={<Forgetpass />} />
                <Route path="/verfyemail" element={<VerfyEmail />} />
                <Route path="/google-success" element={<GoogleSuccess />} />

                {/* Products */}
                <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
                <Route path="/product" element={<ProtectedRoute><Products /></ProtectedRoute>} />
                <Route path="/createproduct" element={<ProtectedRoute><CreateProduct /></ProtectedRoute>} />
                <Route path="/editproduct/:id" element={<ProtectedRoute><EditProduct /></ProtectedRoute>} />

                {/* Categories */}
                <Route path="/categories" element={<ProtectedRoute><Categories /></ProtectedRoute>} />
                <Route path="/createcategory" element={<ProtectedRoute><CreateCategory /></ProtectedRoute>} />
                <Route path="/editcategory/:id" element={<ProtectedRoute><EditCategory /></ProtectedRoute>} />
                <Route path="/categories/:categoryId/products" element={<ProtectedRoute><CategoryProductsPage /></ProtectedRoute>} />

                {/* Cart and checkout */}
                <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
                <Route path="/cartitems" element={<ProtectedRoute><CartItems /></ProtectedRoute>} />
                <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />

                {/* Legal pages */}
                <Route path="/terms" element={<ProtectedRoute><TermsOfService /></ProtectedRoute>} />
                <Route path="/privacy" element={<ProtectedRoute><PrivacyPolicy /></ProtectedRoute>} />

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

export default App;
