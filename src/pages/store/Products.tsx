import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllProducts, deleteProduct } from "../../services/productservices";
import { getCartByUserId, createCart } from "../../services/cartservices";
import { getCartItemsByCartId, createCartItem, updateCartItem } from "../../services/cartitemservice";
import { Plus, Edit3, Trash2, ShoppingBag, Package } from "lucide-react";

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
      <div className="flex justify-center items-center min-h-[60vh] bg-white text-xs font-semibold text-neutral-400">
        Loading products...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 bg-white min-h-screen font-sans text-neutral-900">
      <div className="flex flex-wrap justify-between items-center mb-8 border-b border-neutral-100 pb-6 gap-4">
        <div>
          <span className="text-xs font-bold tracking-widest text-neutral-400 uppercase">Catalog Portal</span>
          <h1 className="text-3xl font-black tracking-tight text-neutral-900 mt-1">All Products</h1>
          <p className="text-neutral-500 text-xs mt-1">Browse our catalog and add items to your bag.</p>
        </div>

        {localStorage.getItem("role") === "ADMIN" && (
          <button
            onClick={() => navigate("/createproduct")}
            className="inline-flex items-center gap-2 rounded-xl bg-neutral-900 px-5 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-md hover:bg-neutral-800 transition"
          >
            <Plus size={16} /> Add Product
          </button>
        )}
      </div>

      {successMessage && (
        <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs font-medium text-emerald-700">
          {successMessage}
        </div>
      )}

      {products.length === 0 ? (
        <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-12 text-center text-xs text-neutral-500">
          No products available.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => {
            const isInCart = cartProductIds.has(product.id);

            return (
              <div
                key={product.id}
                className="bg-white border border-neutral-200 rounded-2xl p-5 flex flex-col justify-between shadow-sm hover:border-neutral-900 transition"
              >
                <div>
                  <div className="w-full h-48 bg-neutral-100 border border-neutral-200 rounded-xl flex items-center justify-center overflow-hidden mb-4">
                    {product.image ? (
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                    ) : (
                      <Package className="w-10 h-10 text-neutral-400" />
                    )}
                  </div>

                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-sm font-bold text-neutral-900">{product.name}</h3>
                    {product.price !== undefined && (
                      <span className="text-neutral-900 font-bold text-sm">${Number(product.price).toFixed(2)}</span>
                    )}
                  </div>

                  <p className="text-neutral-500 text-xs line-clamp-2 leading-relaxed">
                    {product.description || "No description provided."}
                  </p>
                </div>

                <div className="mt-6">
                  <button
                    onClick={() => void handleAddToCart(product)}
                    disabled={addingId === product.id}
                    className={`w-full rounded-xl py-3 text-xs font-bold uppercase tracking-wider shadow transition inline-flex items-center justify-center gap-2 ${
                      isInCart
                        ? "border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                        : "bg-neutral-900 text-white hover:bg-neutral-800"
                    } disabled:opacity-50`}
                  >
                    <ShoppingBag size={14} />
                    {addingId === product.id
                      ? "Adding..."
                      : isInCart
                      ? "In Cart ✓"
                      : "Add to Bag"}
                  </button>

                  {localStorage.getItem("role") === "ADMIN" && (
                    <>
                      <div className="border-t border-neutral-100 my-3" />
                      <div className="flex gap-2">
                        <button
                          onClick={() => navigate(`/editproduct/${product.id}`)}
                          className="flex-1 py-2 px-3 border border-neutral-200 text-neutral-700 font-semibold rounded-xl hover:border-neutral-900 hover:text-neutral-900 transition text-xs inline-flex items-center justify-center gap-1.5 bg-white shadow-sm"
                        >
                          <Edit3 size={13} /> Edit
                        </button>

                        <button
                          onClick={() => handleDelete(product.id)}
                          className="flex-1 py-2 px-3 border border-red-200 text-red-600 font-semibold rounded-xl hover:bg-red-50 transition text-xs inline-flex items-center justify-center gap-1.5 bg-white shadow-sm"
                        >
                          <Trash2 size={13} /> Delete
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}