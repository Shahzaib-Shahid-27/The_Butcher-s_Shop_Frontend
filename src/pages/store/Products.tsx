
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllProducts, deleteProduct } from "../../services/productservices";
import {
  getCartByUserId,
  createCart,
} from "../../services/cartservices";
import {
  getCartItemsByCartId,
  createCartItem,
  updateCartItem,
} from "../../services/cartitemservice";
import {
  Plus,
  Edit3,
  Trash2,
  ShoppingBag,
  Package,
  Loader2,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";

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

  const isAdmin = localStorage.getItem("role") === "ADMIN";

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

        if (user?.id) {
          const userCart = await getCartByUserId(user.id).catch(() => null);

          if (userCart?.id) {
            const items = await getCartItemsByCartId(userCart.id).catch(
              () => []
            );

            const ids = new Set<string>(
              (items || [])
                .map(
                  (item: {
                    productId?: string;
                    product?: { id: string };
                  }) => item.productId || item.product?.id
                )
                .filter(Boolean) as string[]
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

      if (!user?.id) {
        alert("Please log in to add items to your cart.");
        navigate("/login");
        return;
      }

      let userCart = await getCartByUserId(user.id).catch(() => null);

      if (!userCart?.id) {
        userCart = await createCart({ userId: user.id });
      }

      const existingItems = await getCartItemsByCartId(userCart.id).catch(
        () => []
      );

      const existingItem = existingItems.find(
        (item: {
          id: string;
          productId?: string;
          product?: { id: string };
          quantity: number;
        }) =>
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
      setSuccessMessage(`"${product.name}" added to your cart!`);

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
        setProducts((prev) => prev.filter((product) => product.id !== id));
      } catch (error) {
        console.error("Failed to delete product:", error);
        alert("Failed to delete product. Please try again.");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-[#FBF8F3] font-sans">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-[#8B2635]" />
          <p className="text-sm font-semibold text-[#927D70]">
            Loading our products...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FBF8F3] font-sans text-[#351D1D]">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Page Heading */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-5 border-b border-[#E8DED3] pb-7">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#8B2635]">
              Butcher Shop Collection
            </span>

            <h1 className="mt-2 text-3xl font-black tracking-tight text-[#351D1D] sm:text-4xl">
              Our Fresh Products
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-relaxed text-[#927D70]">
              Explore our carefully selected quality meats and discover
              products for your next meal.
            </p>
          </div>

          {isAdmin && (
            <button
              type="button"
              onClick={() => navigate("/admin/products/create")}
              className="inline-flex items-center gap-2 rounded-xl bg-[#8B2635] px-5 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-md transition hover:bg-[#70202C] hover:shadow-lg"
            >
              <Plus size={17} />
              Add Product
            </button>
          )}
        </div>

        {/* Success Message */}
        {successMessage && (
          <div
            role="status"
            className="mb-6 flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800"
          >
            <CheckCircle2 size={19} />
            {successMessage}
          </div>
        )}

        {/* Product Count */}
        {products.length > 0 && (
          <div className="mb-5 flex items-center justify-between">
            <p className="text-sm font-semibold text-[#6D5B52]">
              Showing {products.length} products
            </p>
          </div>
        )}

        {/* Empty State */}
        {products.length === 0 ? (
          <div className="rounded-2xl border border-[#E8DED3] bg-white px-6 py-16 text-center shadow-sm">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#F4EEE6]">
              <Package className="h-8 w-8 text-[#8B2635]" />
            </div>

            <h2 className="text-xl font-bold text-[#351D1D]">
              No Products Available
            </h2>

            <p className="mt-2 text-sm text-[#927D70]">
              Our product collection is currently empty. Please check back soon.
            </p>

            {isAdmin && (
              <button
                type="button"
                onClick={() => navigate("/admin/products/create")}
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#8B2635] px-5 py-3 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-[#70202C]"
              >
                <Plus size={16} />
                Add First Product
              </button>
            )}
          </div>
        ) : (
          /* Products Grid */
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => {
              const isInCart = cartProductIds.has(product.id);

              return (
                <div
                  key={product.id}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-[#E8DED3] bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[#C9A7A5] hover:shadow-xl"
                >
                  {/* Product Image */}
                  <div className="relative h-56 overflow-hidden bg-[#F4EEE6]">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <Package className="h-14 w-14 text-[#C9B9AA]" />
                      </div>
                    )}

                    <div className="absolute left-3 top-3 rounded-full bg-[#351D1D]/90 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white">
                      Fresh Quality
                    </div>
                  </div>

                  {/* Product Information */}
                  <div className="flex flex-1 flex-col p-5">
                    <div className="mb-3 flex items-start justify-between gap-3">
                      <h3 className="text-base font-bold leading-snug text-[#351D1D] transition group-hover:text-[#8B2635]">
                        {product.name}
                      </h3>

                      {product.price !== undefined && (
                        <span className="shrink-0 text-base font-black text-[#8B2635]">
                          ${Number(product.price).toFixed(2)}
                        </span>
                      )}
                    </div>

                    <p className="mb-5 line-clamp-2 text-xs leading-relaxed text-[#927D70]">
                      {product.description ||
                        "Quality products selected with care."}
                    </p>

                    <div className="mt-auto">
                      {/* Add to Cart */}
                      <button
                        type="button"
                        onClick={() => void handleAddToCart(product)}
                        disabled={addingId === product.id}
                        className={`inline-flex w-full items-center justify-center gap-2 rounded-xl py-3 text-xs font-bold uppercase tracking-wider shadow-sm transition disabled:cursor-not-allowed disabled:opacity-60 ${
                          isInCart
                            ? "border border-emerald-200 bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
                            : "bg-[#8B2635] text-white hover:bg-[#70202C] hover:shadow-md"
                        }`}
                      >
                        {addingId === product.id ? (
                          <>
                            <Loader2 size={15} className="animate-spin" />
                            Adding...
                          </>
                        ) : isInCart ? (
                          <>
                            <CheckCircle2 size={15} />
                            In Your Cart
                          </>
                        ) : (
                          <>
                            <ShoppingBag size={15} />
                            Add to Cart
                          </>
                        )}
                      </button>

                      {/* Admin Controls */}
                      {isAdmin && (
                        <div className="mt-4 border-t border-[#E8DED3] pt-3">
                          <div className="mb-2 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[#927D70]">
                            <ShieldCheck
                              size={13}
                              className="text-[#8B2635]"
                            />
                            Admin Controls
                          </div>

                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                navigate(`/editproduct/${product.id}`)
                              }
                              className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-[#E8DED3] bg-[#FBF8F3] px-3 py-2 text-xs font-semibold text-[#351D1D] transition hover:border-[#8B2635] hover:text-[#8B2635]"
                            >
                              <Edit3 size={13} />
                              Edit
                            </button>

                            <button
                              type="button"
                              onClick={() => void handleDelete(product.id)}
                              className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-red-200 bg-white px-3 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-50"
                            >
                              <Trash2 size={13} />
                              Delete
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
