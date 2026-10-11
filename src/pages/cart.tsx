import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getCartByUserId, createCart } from "../services/cartservices";

import {
  getCartItemsByCartId,
  deleteCartItem,
  updateCartItem,
} from "../services/cartitemservice";

import { getAllProducts } from "../services/productservices";

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

  // Load the user's cart
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

        // Add product information to every cart item
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

  // Calculate total price
  const totalPrice = cartItems.reduce((total, item) => {
    const price = Number(item.product?.price ?? 0);
    return total + price * item.quantity;
  }, 0);

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // Update quantity
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

  // Remove item
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

  // Save order details (including cart item ids) and go to checkout
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
      // Used by the checkout page to empty the cart after the order is placed
      cartItemIds: cartItems.map((item) => item.id),
      total: totalPrice,
    };

    localStorage.setItem("checkoutOrder", JSON.stringify(order));

    // Navigate only after saving the order
    navigate("/checkout");
  };

  const formatPrice = (price: number) => `$${price.toFixed(2)}`;

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-slate-400">
        Loading cart...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-10 font-sans text-slate-100">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Your Cart
          </h1>

          <p className="mt-1 text-sm text-gray-400">
            Review your items before checkout.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate("/product")}
          className="text-xs font-semibold text-cyan-400 hover:underline"
        >
          ← Continue Shopping
        </button>
      </div>

      {/* Error message */}
      {error && (
        <p
          role="alert"
          className="mb-5 rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-300"
        >
          {error}
        </p>
      )}

      {cartItems.length === 0 ? (
        <div className="rounded-2xl border border-gray-800 bg-[#0b0f19] p-12 text-center text-gray-400">
          Your cart is currently empty.

          <div className="mt-5">
            <button
              type="button"
              onClick={() => navigate("/product")}
              className="rounded-xl bg-cyan-500 px-5 py-3 font-semibold text-white hover:bg-cyan-400"
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
                className="flex items-center justify-between gap-4 rounded-2xl border border-gray-800 bg-[#0b0f19] p-4"
              >
                <div className="flex min-w-0 items-center gap-4">
                  <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-gray-800 bg-gray-900">
                    {item.product?.image ? (
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="text-xs text-gray-500">No Image</span>
                    )}
                  </div>

                  <div className="min-w-0">
                    <h3 className="font-bold text-white">
                      {item.product?.name ?? "Product"}
                    </h3>

                    <p className="mt-1 font-semibold text-emerald-400">
                      {formatPrice(Number(item.product?.price ?? 0))}
                    </p>

                    {/* Quantity Controls */}
                    <div className="mt-3 flex items-center gap-3">
                      <button
                        type="button"
                        disabled={item.quantity <= 1}
                        onClick={() =>
                          void handleQuantityChange(item.id, item.quantity - 1)
                        }
                        className="h-7 w-7 rounded-lg border border-slate-700 bg-slate-800 text-white hover:bg-slate-700 disabled:opacity-40"
                      >
                        -
                      </button>

                      <span className="min-w-5 text-center text-sm font-semibold">
                        {item.quantity}
                      </span>

                      <button
                        type="button"
                        onClick={() =>
                          void handleQuantityChange(item.id, item.quantity + 1)
                        }
                        className="h-7 w-7 rounded-lg border border-slate-700 bg-slate-800 text-white hover:bg-slate-700"
                      >
                        +
                      </button>
                    </div>

                    <p className="mt-2 text-xs text-gray-400">
                      Subtotal:{" "}
                      {formatPrice(
                        Number(item.product?.price ?? 0) * item.quantity
                      )}
                    </p>
                  </div>
                </div>

                {/* Remove Item */}
                <button
                  type="button"
                  onClick={() => void handleRemove(item.id)}
                  className="shrink-0 rounded-xl border border-pink-500/40 px-3 py-2 text-xs font-medium text-pink-500 transition hover:bg-pink-500/10"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="h-fit space-y-4 rounded-2xl border border-gray-800 bg-[#0b0f19] p-6 lg:col-span-4">
            <h2 className="text-lg font-bold text-white">Order Summary</h2>

            <div className="flex justify-between text-sm text-gray-300">
              <span>Total Items:</span>
              <span>{totalItems}</span>
            </div>

            <div className="flex justify-between text-sm text-gray-300">
              <span>Total Amount:</span>
              <span className="font-bold text-emerald-400">
                {formatPrice(totalPrice)}
              </span>
            </div>

            <hr className="border-gray-800" />

            <button
              type="button"
              onClick={handleCheckout}
              className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-cyan-400 py-3 text-sm font-bold text-white shadow-lg shadow-cyan-500/20 transition hover:brightness-110"
            >
              Proceed to Checkout →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
