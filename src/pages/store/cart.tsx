
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getCartByUserId,
  createCart,
} from "../../services/cartservices";
import {
  getCartItemsByCartId,
  deleteCartItem,
  updateCartItem,
} from "../../services/cartitemservice";
import { getAllProducts } from "../../services/productservices";
import {
  ArrowLeft,
  Trash2,
  ShoppingBag,
  ShieldCheck,
  Package,
  Minus,
  Plus,
  Beef,
  Truck,
} from "lucide-react";

interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  product?: {
    id: string;
    name: string;
    price: number;
    image?: string;
  };
}

export default function Cart() {
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCartData = async () => {
      try {
        setLoading(true);
        setError("");

        const userStr = localStorage.getItem("user");
        const user = userStr ? JSON.parse(userStr) : null;

        if (!user?.id) {
          setCartItems([]);
          return;
        }

        let userCart = await getCartByUserId(user.id).catch(() => null);

        if (!userCart?.id) {
          userCart = await createCart({ userId: user.id });
        }

        const items = await getCartItemsByCartId(userCart.id);
        const allProducts = await getAllProducts();

        const enrichedItems = (items || []).map((item: CartItem) => {
          const matchedProduct = allProducts.find(
            (product: { id: string }) =>
              product.id === item.productId ||
              product.id === item.product?.id
          );

          return {
            ...item,
            product: item.product || matchedProduct,
          };
        });

        setCartItems(enrichedItems);
      } catch (err) {
        console.error("Failed to load cart:", err);
        setError("Failed to load your cart. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    void fetchCartData();
  }, []);

  const totalPrice = cartItems.reduce((total, item) => {
    const price = Number(item.product?.price ?? 0);
    return total + price * item.quantity;
  }, 0);

  const totalItems = cartItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const handleQuantityChange = async (
    itemId: string,
    newQuantity: number
  ) => {
    if (newQuantity < 1) return;

    try {
      await updateCartItem(itemId, { quantity: newQuantity });

      setCartItems((previousItems) =>
        previousItems.map((item) =>
          item.id === itemId
            ? { ...item, quantity: newQuantity }
            : item
        )
      );
    } catch (err) {
      console.error("Failed to update quantity:", err);
      setError("Could not update quantity. Please try again.");
    }
  };

  const handleRemove = async (itemId: string) => {
    try {
      await deleteCartItem(itemId);

      setCartItems((previousItems) =>
        previousItems.filter((item) => item.id !== itemId)
      );

      setError("");
    } catch (err) {
      console.error("Failed to remove item:", err);
      setError("Could not remove the product. Please try again.");
    }
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    const order = {
      items: cartItems.map((item) => ({
        productId: item.productId,
        productName: item.product?.name ?? "Product",
        quantity: item.quantity,
        price: Number(item.product?.price ?? 0),
        subtotal:
          Number(item.product?.price ?? 0) * item.quantity,
      })),
      cartItemIds: cartItems.map((item) => item.id),
      total: totalPrice,
    };

    localStorage.setItem("checkoutOrder", JSON.stringify(order));
    navigate("/checkout");
  };

  const formatPrice = (price: number) => `$${price.toFixed(2)}`;

  if (loading) {
    return (
      <div className="flex min-h-[65vh] flex-col items-center justify-center gap-4 bg-[#FBF8F3] font-sans">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#F4EEE6]">
          <Beef className="h-7 w-7 animate-pulse text-[#8B2635]" />
        </div>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#927D70]">
          Preparing your cart...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FBF8F3] font-sans text-[#351D1D]">
      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:py-14">
        {/* Header */}
        <div className="mb-9 flex flex-wrap items-center justify-between gap-5 border-b border-[#E8DED3] pb-7">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <ShoppingBag size={14} className="text-[#8B2635]" />
              <span className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-[#927D70]">
                Butcher Shop
              </span>
            </div>

            <h1 className="text-3xl font-black tracking-tight text-[#351D1D] sm:text-4xl">
              Your Cart
              <span className="ml-2 text-[#8B2635]">.</span>
            </h1>

            <p className="mt-2 text-xs text-[#927D70] sm:text-sm">
              Review your selected products before proceeding to checkout.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/product")}
            className="inline-flex items-center gap-2 rounded-xl border border-[#E8DED3] bg-white px-4 py-3 text-xs font-bold text-[#6D5B52] transition hover:border-[#8B2635] hover:text-[#8B2635]"
          >
            <ArrowLeft size={15} />
            Continue Shopping
          </button>
        </div>

        {/* Error */}
        {error && (
          <p
            role="alert"
            className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-xs font-medium text-red-600"
          >
            {error}
          </p>
        )}

        {cartItems.length === 0 ? (
          /* Empty Cart */
          <div className="rounded-3xl border border-[#E8DED3] bg-white px-6 py-16 text-center shadow-sm">
            <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-[#F4EEE6]">
              <Package size={34} className="text-[#8B2635]" />
            </div>

            <h2 className="text-xl font-black text-[#351D1D]">
              Your Cart Is Empty
            </h2>

            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[#927D70]">
              Your cart is waiting for something delicious. Explore our
              product collection and find your favorites.
            </p>

            <button
              type="button"
              onClick={() => navigate("/product")}
              className="mt-7 inline-flex items-center justify-center gap-2 rounded-xl bg-[#8B2635] px-7 py-3.5 text-xs font-extrabold uppercase tracking-wider text-white shadow-md transition hover:bg-[#6F1D2A]"
            >
              <ShoppingBag size={15} />
              Browse Products
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 items-start gap-7 lg:grid-cols-12">
            {/* Cart Items */}
            <div className="space-y-4 lg:col-span-8">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-sm font-extrabold text-[#351D1D]">
                  Cart Items
                </h2>

                <span className="rounded-full bg-[#F4EEE6] px-3 py-1 text-[10px] font-bold text-[#8B2635]">
                  {totalItems} ITEMS
                </span>
              </div>

              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-wrap items-center justify-between gap-5 rounded-2xl border border-[#E8DED3] bg-white p-4 shadow-sm transition hover:border-[#D7C4B8] sm:flex-nowrap sm:p-5"
                >
                  {/* Product Information */}
                  <div className="flex min-w-0 flex-1 items-center gap-4">
                    <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-[#E8DED3] bg-[#F4EEE6]">
                      {item.product?.image ? (
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="h-full w-full object-cover transition duration-500 hover:scale-110"
                        />
                      ) : (
                        <Package size={26} className="text-[#B6A394]" />
                      )}
                    </div>

                    <div className="min-w-0">
                      <h3 className="truncate text-sm font-extrabold text-[#351D1D] sm:text-base">
                        {item.product?.name ?? "Product"}
                      </h3>

                      <p className="mt-1 text-sm font-black text-[#8B2635]">
                        {formatPrice(Number(item.product?.price ?? 0))}
                      </p>

                      {/* Quantity Controls */}
                      <div className="mt-3 inline-flex items-center gap-3 rounded-xl border border-[#E8DED3] bg-[#FBF8F3] p-1">
                        <button
                          type="button"
                          disabled={item.quantity <= 1}
                          onClick={() =>
                            void handleQuantityChange(
                              item.id,
                              item.quantity - 1
                            )
                          }
                          aria-label="Decrease quantity"
                          className="flex h-7 w-7 items-center justify-center rounded-lg text-[#6D5B52] transition hover:bg-[#8B2635] hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          <Minus size={13} />
                        </button>

                        <span className="min-w-5 text-center text-xs font-extrabold text-[#351D1D]">
                          {item.quantity}
                        </span>

                        <button
                          type="button"
                          onClick={() =>
                            void handleQuantityChange(
                              item.id,
                              item.quantity + 1
                            )
                          }
                          aria-label="Increase quantity"
                          className="flex h-7 w-7 items-center justify-center rounded-lg text-[#6D5B52] transition hover:bg-[#8B2635] hover:text-white"
                        >
                          <Plus size={13} />
                        </button>
                      </div>

                      <p className="mt-2 text-[11px] font-medium text-[#927D70]">
                        Subtotal:{" "}
                        <span className="font-extrabold text-[#351D1D]">
                          {formatPrice(
                            Number(item.product?.price ?? 0) *
                              item.quantity
                          )}
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* Remove Item */}
                  <button
                    type="button"
                    onClick={() => void handleRemove(item.id)}
                    className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-[#E8DED3] bg-white px-3.5 py-2.5 text-xs font-bold text-[#8B2635] transition hover:border-[#8B2635] hover:bg-[#FBF1F0]"
                  >
                    <Trash2 size={14} />
                    Remove
                  </button>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <aside className="h-fit rounded-2xl border border-[#E8DED3] bg-white p-6 shadow-sm lg:sticky lg:top-6 lg:col-span-4">
              <div className="mb-5">
                <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#927D70]">
                  Butcher Shop
                </span>

                <h2 className="mt-1 text-xl font-black text-[#351D1D]">
                  Order Summary
                </h2>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between text-xs text-[#927D70]">
                  <span>Total Items</span>
                  <span className="font-bold text-[#351D1D]">
                    {totalItems}
                  </span>
                </div>

                <div className="flex justify-between text-xs text-[#927D70]">
                  <span>Subtotal</span>
                  <span className="font-bold text-[#351D1D]">
                    {formatPrice(totalPrice)}
                  </span>
                </div>

                <div className="flex justify-between text-xs text-[#927D70]">
                  <span>Shipping</span>
                  <span className="font-bold text-[#8B2635]">
                    Calculated at checkout
                  </span>
                </div>

                <div className="border-t border-dashed border-[#E8DED3] pt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-extrabold text-[#351D1D]">
                      Total Amount
                    </span>

                    <span className="text-xl font-black text-[#8B2635]">
                      {formatPrice(totalPrice)}
                    </span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleCheckout}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#8B2635] py-4 text-xs font-extrabold uppercase tracking-wider text-white shadow-md transition hover:bg-[#6F1D2A]"
              >
                <ShoppingBag size={16} />
                Proceed to Checkout
              </button>

              <div className="mt-5 space-y-3 border-t border-[#E8DED3] pt-4">
                <p className="flex items-center justify-center gap-2 text-[11px] font-medium text-[#927D70]">
                  <ShieldCheck size={14} className="text-[#8B2635]" />
                  Secure encrypted checkout
                </p>

                <p className="flex items-center justify-center gap-2 text-[11px] font-medium text-[#927D70]">
                  <Truck size={14} className="text-[#8B2635]" />
                  Fresh products, carefully packed
                </p>
              </div>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}
