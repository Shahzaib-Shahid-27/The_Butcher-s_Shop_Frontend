import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllProducts, deleteProduct } from "../services/productservices";
import { getCartByUserId, createCart } from "../services/cartservices";
import { getCartItemsByCartId, createCartItem, updateCartItem } from "../services/cartitemservice";

interface ProductType {
  id: string;
  name: string;
  description?: string;
  price?: number;
  image?: string;
}

export default function Products() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<ProductType[]>([]);
  const [cartProductIds, setCartProductIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState<boolean>(true);
  const [addingId, setAddingId] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        const [productData, userStr] = await Promise.all([
          getAllProducts(),
          Promise.resolve(localStorage.getItem("user")),
        ]);

        setProducts(productData || []);

        const user = userStr ? JSON.parse(userStr) : null;
        if (user && user.id) {
          const userCart = await getCartByUserId(user.id).catch(() => null);
          if (userCart && userCart.id) {
            const items = await getCartItemsByCartId(userCart.id).catch(() => []);
            const ids = new Set<string>(
              (items || []).map(
                (item: { productId?: string; product?: { id: string } }) =>
                  item.productId || item.product?.id
              ).filter(Boolean) as string[]
            );
            setCartProductIds(ids);
          }
        }
      } catch (error) {
        console.error("Failed to load products or cart:", error);
      } finally {
        setLoading(false);
      }
    };

    void fetchInitialData();
  }, []);

  const handleAddToCart = async (product: ProductType) => {
    try {
      setAddingId(product.id);

      const userStr = localStorage.getItem("user");
      const user = userStr ? JSON.parse(userStr) : null;

      if (!user || !user.id) {
        alert("Please log in to add items to your cart.");
        navigate("/login");
        return;
      }

      let userCart = await getCartByUserId(user.id).catch(() => null);
      if (!userCart || !userCart.id) {
        userCart = await createCart({ userId: user.id });
      }

      const existingItems = await getCartItemsByCartId(userCart.id).catch(() => []);
      const existingItem = existingItems.find(
        (item: { productId?: string; product?: { id: string } }) =>
          item.productId === product.id || item.product?.id === product.id
      );

      if (existingItem) {
        await updateCartItem(existingItem.id, {
          quantity: existingItem.quantity + 1,
        });
      } else {
        await createCartItem({
          cartId: userCart.id,
          productId: product.id,
          quantity: 1,
        });
      }

      setCartProductIds((prev) => new Set(prev).add(product.id));
      setSuccessMessage(`Added "${product.name}" to cart!`);
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      console.error("Failed to add to cart:", error);
      alert("Failed to add product to cart. Please check your network or try again.");
    } finally {
      setAddingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteProduct(id);
        setProducts((prev) => prev.filter((p) => p.id !== id));
      } catch (error) {
        console.error("Failed to delete product:", error);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh] text-gray-400">
        Loading products...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 font-sans text-slate-100">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">All Products</h1>
          <p className="text-gray-400 text-sm mt-1">Browse our catalog and add items to your cart.</p>
        </div>
        <button
          onClick={() => navigate("/createproduct")}
          className="group relative inline-flex items-center gap-2 overflow-hidden rounded-xl bg-linear-to-tr from-blue-600 to-cyan-400 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-cyan-500/20 transition duration-200 hover:brightness-110"
        >
          + Add Product
        </button>
      </div>

      {successMessage && (
        <div className="mb-6 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-xs font-medium text-emerald-400">
          {successMessage}
        </div>
      )}

      {products.length === 0 ? (
        <div className="bg-[#0b0f19] border border-gray-800 rounded-2xl p-12 text-center text-gray-400">
          No products available.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => {
            const isInCart = cartProductIds.has(product.id);

            return (
              <div
                key={product.id}
                className="bg-[#0b0f19] border border-gray-800 rounded-2xl p-4 flex flex-col justify-between"
              >
                <div>
                  <div className="w-full h-48 bg-[#070a10] border border-gray-800/60 rounded-xl flex items-center justify-center overflow-hidden mb-4">
                    {product.image ? (
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                    ) : (
                      <svg className="w-12 h-12 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                    )}
                  </div>

                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-white">{product.name}</h3>
                    {product.price !== undefined && (
                      <span className="text-emerald-400 font-semibold text-sm">${product.price}</span>
                    )}
                  </div>

                  <p className="text-gray-400 text-sm line-clamp-2">
                    {product.description || "No description provided."}
                  </p>
                </div>

                <div>
                  <button
                    onClick={() => void handleAddToCart(product)}
                    disabled={addingId === product.id}
                    className={`mt-4 w-full rounded-xl py-2.5 text-xs font-bold shadow transition ${
                      isInCart
                        ? "border border-emerald-500/40 bg-emerald-950/20 text-emerald-400 hover:bg-emerald-500/10"
                        : "bg-linear-to-tr from-blue-600 to-cyan-400 text-white hover:brightness-110"
                    } disabled:opacity-50`}
                  >
                    {addingId === product.id
                      ? "Adding..."
                      : isInCart
                      ? "Product is in Cart ✓"
                      : "Add to Cart"}
                  </button>

                  <hr className="border-gray-800 my-3" />
                  <div className="flex gap-3">
                    <button
                      onClick={() => navigate(`/editproduct/${product.id}`)}
                      className="flex-1 py-1.5 px-3 border border-cyan-500/40 text-cyan-400 font-medium rounded-xl hover:bg-cyan-500/10 transition text-xs"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => void handleDelete(product.id)}
                      className="flex-1 py-1.5 px-3 border border-pink-500/40 text-pink-500 font-medium rounded-xl hover:bg-pink-500/10 transition text-xs"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}