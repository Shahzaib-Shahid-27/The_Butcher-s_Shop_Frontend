import { Suspense, lazy } from "react";
// Import animation components from Motion
import { AnimatePresence, motion } from "motion/react";

// Import routing components from React Router
import { Routes, Route, useLocation } from "react-router-dom";

// Import common layout components directly (keep initial layout fast)
import Header from "./components/header";
import Footer from "./components/footer";
import CustomCursor from "./components/cursor";


// Dynamically import product pages
const CreateProduct = lazy(() => import("./pages/createproduct"));
const EditProduct = lazy(() => import("./pages/EditProduct"));
const Products = lazy(() => import("./pages/Products"));

// Dynamically import category pages
const Categories = lazy(() => import("./pages/Categories"));
const CreateCategory = lazy(() => import("./pages/CreateCategory"));
const EditCategory = lazy(() => import("./pages/EditCategory"));
const CategoryProductsPage = lazy(() =>
  import("./pages/CategoryProductsPage").then((m) => ({
    default: m.CategoryProductsPage,
  }))
);
import Checkout from "./pages/Checkout";

// Dynamically import cart pages
const Cart = lazy(() => import("./pages/cart"));
const CartItems = lazy(() => import("./pages/CartItems"));

// Dynamically import home page
const Home = lazy(() => import("./pages/home"));

// Dynamically import authentication pages
const Login = lazy(() => import("./pages/login"));
const Register = lazy(() => import("./pages/register"));
const Forgetpass = lazy(() => import("./pages/forgetpass"));
const VerfyEmail = lazy(() => import("./pages/verfiemail"));

// Dynamically import legal pages
const TermsOfService = lazy(() => import("./pages/TermsOfService"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));



function App() {
  const location = useLocation();

  const hideLayout = [
    "/login",
    "/register",
    "/forgetpass",
    "/verfyemail",
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
            transition={{ duration: 0.22, ease: "easeOut" }}
          >
            {/* Wrap lazy routes inside Suspense */}
            <Suspense
              fallback={
                <div className="flex min-h-[50vh] items-center justify-center text-gray-400">
                  Loading...
                </div>
              }
            >

              <Routes location={location}>
                {/* Home routes */}
                <Route path="/" element={<Home />} />
                <Route path="/home" element={<Home />} />

                {/* Authentication routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgetpass" element={<Forgetpass />} />
                <Route path="/verfyemail" element={<VerfyEmail />} />

                {/* Product management routes */}
                <Route path="/product" element={<Products />} />
                <Route path="/createproduct" element={<CreateProduct />} />
                <Route path="/editproduct/:id" element={<EditProduct />} />
                

                {/* Category management routes */}
                <Route path="/categories" element={<Categories />} />
                <Route path="/createcategory" element={<CreateCategory />} />
                <Route path="/editcategory/:id" element={<EditCategory />} />
                <Route
                  path="/categories/:categoryId/products"
                  element={<CategoryProductsPage />}
                />

                {/* Shopping cart routes */}
                <Route path="/cart" element={<Cart />} />
                <Route path="/cartitems" element={<CartItems />} />
                <Route path="/checkout" element={<Checkout />} />


                {/* Legal routes */}
                <Route path="/terms" element={<TermsOfService />} />
                <Route path="/privacy" element={<PrivacyPolicy />} />
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