import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCartByUserId, createCart } from "../../services/cartservices";
import { getCartItemsByCartId, deleteCartItem, updateCartItem } from "../../services/cartitemservice";
import { getAllProducts } from "../../services/productservices";
import { ArrowLeft, Trash2, ShoppingBag, ShieldCheck, Package } from "lucide-react";

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
              product.id === item.productId || product.id === item.product?.id
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

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleQuantityChange = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;

    try {
      await updateCartItem(itemId, { quantity: newQuantity });

      setCartItems((previousItems) =>
        previousItems.map((item) =>
          item.id === itemId ? { ...item, quantity: newQuantity } : item
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
        subtotal: Number(item.product?.price ?? 0) * item.quantity,
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
      <div className="flex min-h-[60vh] items-center justify-center bg-white font-sans text-xs font-semibold text-neutral-400">
        Loading cart...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-12 font-sans text-neutral-900 bg-white min-h-screen">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-neutral-100 pb-6 mb-8">
        <div>
          <span className="text-xs font-bold tracking-widest text-neutral-400 uppercase">Shopping Bag</span>
          <h1 className="text-3xl font-black tracking-tight text-neutral-900 mt-1">Your Cart</h1>
          <p className="mt-1 text-xs text-neutral-500">
            Review your selected items before proceeding to checkout.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate("/product")}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-600 hover:text-neutral-900 transition"
        >
          <ArrowLeft size={14} /> Continue Shopping
        </button>
      </div>

      {error && (
        <p
          role="alert"
          className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-xs font-medium text-red-600"
        >
          {error}
        </p>
      )}

      {cartItems.length === 0 ? (
        <div className="rounded-2xl border border-neutral-200 bg-neutral-50/50 p-12 text-center">
          <Package className="mx-auto h-12 w-12 text-neutral-400 mb-3" />
          <h2 className="text-base font-bold text-neutral-900">Your cart is currently empty</h2>
          <p className="mt-1 text-xs text-neutral-500">Explore our product catalog to add items.</p>

          <div className="mt-6">
            <button
              type="button"
              onClick={() => navigate("/product")}
              className="rounded-xl bg-neutral-900 px-5 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-md hover:bg-neutral-800 transition"
            >
              Browse Products
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Cart Items */}
          <div className="space-y-4 lg:col-span-8">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-4 rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm"
              >
                <div className="flex min-w-0 items-center gap-4">
                  <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-neutral-200 bg-neutral-100">
                    {item.product?.image ? (
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <Package size={20} className="text-neutral-400" />
                    )}
                  </div>

                  <div className="min-w-0">
                    <h3 className="font-bold text-neutral-900 text-sm">
                      {item.product?.name ?? "Product"}
                    </h3>

                    <p className="mt-1 font-bold text-neutral-900 text-xs">
                      {formatPrice(Number(item.product?.price ?? 0))}
                    </p>

                    {/* Quantity Controls */}
                    <div className="mt-3 flex items-center gap-2.5">
                      <button
                        type="button"
                        disabled={item.quantity <= 1}
                        onClick={() =>
                          void handleQuantityChange(item.id, item.quantity - 1)
                        }
                        className="h-7 w-7 rounded-lg border border-neutral-200 bg-neutral-50 text-neutral-800 hover:border-neutral-900 disabled:opacity-40 text-xs font-bold"
                      >
                        -
                      </button>

                      <span className="min-w-6 text-center text-xs font-semibold text-neutral-900">
                        {item.quantity}
                      </span>

                      <button
                        type="button"
                        onClick={() =>
                          void handleQuantityChange(item.id, item.quantity + 1)
                        }
                        className="h-7 w-7 rounded-lg border border-neutral-200 bg-neutral-50 text-neutral-800 hover:border-neutral-900 text-xs font-bold"
                      >
                        +
                      </button>
                    </div>

                    <p className="mt-2 text-[11px] text-neutral-500 font-medium">
                      Subtotal:{" "}
                      <span className="text-neutral-900 font-bold">
                        {formatPrice(
                          Number(item.product?.price ?? 0) * item.quantity
                        )}
                      </span>
                    </p>
                  </div>
                </div>

                {/* Remove Item */}
                <button
                  type="button"
                  onClick={() => void handleRemove(item.id)}
                  className="shrink-0 rounded-xl border border-red-200 bg-white px-3.5 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50 inline-flex items-center gap-1.5 shadow-sm"
                >
                  <Trash2 size={13} /> Remove
                </button>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="h-fit space-y-4 rounded-2xl border border-neutral-200 bg-neutral-50/50 p-6 lg:col-span-4 shadow-sm">
            <h2 className="text-base font-bold text-neutral-900 tracking-tight">Order Summary</h2>

            <div className="flex justify-between text-xs text-neutral-600">
              <span>Total Items:</span>
              <span className="font-semibold text-neutral-900">{totalItems}</span>
            </div>

            <div className="flex justify-between text-xs text-neutral-600">
              <span>Total Amount:</span>
              <span className="font-black text-neutral-900 text-sm">
                {formatPrice(totalPrice)}
              </span>
            </div>

            <hr className="border-neutral-200" />

            <button
              type="button"
              onClick={handleCheckout}
              className="w-full rounded-xl bg-neutral-900 py-3.5 text-xs font-bold uppercase tracking-wider text-white shadow-md transition hover:bg-neutral-800 inline-flex items-center justify-center gap-2"
            >
              <ShoppingBag size={15} /> Proceed to Checkout →
            </button>

            <p className="text-center text-[11px] text-neutral-400 mt-2 flex items-center justify-center gap-1">
              <ShieldCheck size={13} /> Secure encrypted checkout
            </p>
          </div>
        </div>
      )}
    </div>
  );
}