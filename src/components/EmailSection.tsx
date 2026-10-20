import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, ArrowLeft, Package } from "lucide-react";

interface CartItem {
  id: string | number;
  name: string;
  price: number;
  quantity: number;
}

interface CustomerForm {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  deliveryInstructions: string;
  message: string;
}

const FORMSPREE_URL = import.meta.env.VITE_FORMSPREE_URL as string;
const LOCAL_KEYS = ["cart", "cartItems", "cart-items", "shoppingCart"];
const CART_API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api/v1"; 
const TOKEN_KEY = "token";
const THANK_YOU_ROUTE = "/thankyou"; 

const normalizeItems = (raw: any): CartItem[] => {
  const list: any[] = Array.isArray(raw)
    ? raw
    : raw?.items || raw?.cartItems || raw?.cart?.items || raw?.products || [];

  return list.map((item, i) => {
    const product = item.product || item.productId || {};
    return {
      id: item._id ?? item.id ?? product._id ?? product.id ?? i,
      name: item.name ?? product.name ?? item.productName ?? item.title ?? "Product",
      price: Number(item.price ?? product.price ?? 0),
      quantity: Number(item.quantity ?? item.qty ?? 1),
    };
  });
};

const inputClass =
  "w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-900 " +
  "placeholder:text-neutral-400 outline-none transition " +
  "focus:border-neutral-900 focus:bg-white focus:ring-1 focus:ring-neutral-900";
const labelClass = "mb-1.5 block text-xs font-semibold text-neutral-700";
const sectionClass = "rounded-2xl border border-neutral-200 bg-white p-5 sm:p-6 shadow-sm";

const Checkout: React.FC = () => {
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartLoading, setCartLoading] = useState(true);

  /* ---- Load cart ---- */
  useEffect(() => {
    const loadCart = async () => {
      try {
        if (CART_API_URL) {
          const token = localStorage.getItem(TOKEN_KEY);
          const res = await fetch(CART_API_URL, {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
            credentials: "include",
          });
          const data = await res.json();
          setCartItems(normalizeItems(data));
          return;
        }

        for (const key of LOCAL_KEYS) {
          const stored = localStorage.getItem(key);
          if (stored) {
            const items = normalizeItems(JSON.parse(stored));
            if (items.length > 0) {
              setCartItems(items);
              return;
            }
          }
        }
      } catch (err) {
        console.error("Checkout: failed to load cart", err);
      } finally {
        setCartLoading(false);
      }
    };
    loadCart();
  }, []);

  const clearCart = () => {
    LOCAL_KEYS.forEach((k) => localStorage.removeItem(k));
    setCartItems([]);
  };

  /* ---- Form ---- */
  const [form, setForm] = useState<CustomerForm>({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    deliveryInstructions: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const totalAmount = cartItems.reduce((s, i) => s + i.price * i.quantity, 0);

  const buildOrderText = () => {
    const productLines = cartItems
      .map(
        (item, i) =>
          `${i + 1}. ${item.name}\n    Unit Price: $${item.price.toFixed(2)}\n    Quantity: ${item.quantity}\n    Subtotal: $${(item.price * item.quantity).toFixed(2)}`
      )
      .join("\n\n");

    return `
      ===== CUSTOMER DETAILS =====
      Name: ${form.fullName}
      Email: ${form.email}
      Phone: ${form.phone}
      Address: ${form.address}

      ===== ORDER DETAILS =====
      ${productLines}

      TOTAL AMOUNT: $${totalAmount.toFixed(2)}

      ===== ADDITIONAL DETAILS =====
      Delivery Instructions: ${form.deliveryInstructions || "None"}
      Message to shop: ${form.message || "None"}
    `.trim();
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (cartItems.length === 0) {
      setError("Your cart is empty.");
      return;
    }
    if (!form.fullName || !form.email || !form.phone || !form.address) {
      setError("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(FORMSPREE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          _subject: `New Order from ${form.fullName} - $${totalAmount.toFixed(2)}`,
          _replyto: form.email,
          name: form.fullName,
          email: form.email,
          phone: form.phone,
          address: form.address,
          delivery_instructions: form.deliveryInstructions || "None",
          message_to_shop: form.message || "None",
          total_amount: `$${totalAmount.toFixed(2)}`,
          order_details: buildOrderText(),
        }),
      });

      if (!response.ok) throw new Error("Failed to send order email.");

      clearCart();
      navigate(THANK_YOU_ROUTE);
    } catch (err) {
      console.error(err);
      setError("Something went wrong while placing your order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans text-neutral-900 px-4 py-10 selection:bg-neutral-900 selection:text-white">
      <form
        onSubmit={handlePlaceOrder}
        className="mx-auto w-full max-w-3xl overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-xl shadow-neutral-100"
      >
        <div className="border-b border-neutral-100 bg-neutral-50 px-6 py-6 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold tracking-widest text-neutral-400 uppercase">Secure Checkout</span>
            <h2 className="text-3xl font-black tracking-tight text-neutral-900 mt-1">Checkout</h2>
            <p className="mt-1 text-xs text-neutral-500">
              Confirm your order and enter your delivery details.
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate("/cart")}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-600 hover:text-neutral-900 transition"
          >
            <ArrowLeft size={14} /> Back to Cart
          </button>
        </div>

        <div className="space-y-6 p-6 sm:p-8">
          {/* Customer Details */}
          <section className={sectionClass}>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-neutral-900">Customer Details</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="fullName" className={labelClass}>Full Name *</label>
                <input id="fullName" name="fullName" type="text" value={form.fullName}
                  onChange={handleChange} placeholder="Enter your full name" required className={inputClass} />
              </div>
              <div>
                <label htmlFor="email" className={labelClass}>Email Address *</label>
                <input id="email" name="email" type="email" value={form.email}
                  onChange={handleChange} placeholder="Enter your email" required className={inputClass} />
              </div>
              <div>
                <label htmlFor="phone" className={labelClass}>Phone Number *</label>
                <input id="phone" name="phone" type="tel" value={form.phone}
                  onChange={handleChange} placeholder="Enter your phone number" required className={inputClass} />
              </div>
              <div>
                <label htmlFor="address" className={labelClass}>Delivery Address *</label>
                <input id="address" name="address" type="text" value={form.address}
                  onChange={handleChange} placeholder="Enter your full address" required className={inputClass} />
              </div>
            </div>
          </section>

          {/* Order Summary */}
          <section className={sectionClass}>
            <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900">Your Order</h3>
            <p className="mb-4 mt-1 text-xs text-neutral-500">
              These products have been loaded from your cart.
            </p>

            {cartLoading ? (
              <p className="text-xs text-neutral-400">Loading your cart...</p>
            ) : cartItems.length === 0 ? (
              <div className="text-center py-6 text-neutral-400 text-xs">
                <Package className="mx-auto h-8 w-8 mb-2 text-neutral-300" />
                Your cart is empty.
              </div>
            ) : (
              <div className="space-y-3">
                {cartItems.map((item) => (
                  <div key={item.id} className="rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3">
                    <div className="flex items-center justify-between">
                      <strong className="text-xs font-bold text-neutral-900">{item.name}</strong>
                      <span className="text-xs font-bold text-neutral-900">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                    <div className="mt-1 flex items-center justify-between text-[11px] text-neutral-500 font-medium">
                      <span>Unit Price: ${item.price.toFixed(2)}</span>
                      <span>Quantity: {item.quantity}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-5 flex items-center justify-between border-t border-neutral-100 pt-4">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-900">Total Amount</span>
              <strong className="text-base font-black text-neutral-900">${totalAmount.toFixed(2)}</strong>
            </div>
          </section>

          {/* Additional Details */}
          <section className={sectionClass}>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-neutral-900">Additional Details (Optional)</h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="deliveryInstructions" className={labelClass}>Delivery Instructions</label>
                <textarea id="deliveryInstructions" name="deliveryInstructions" value={form.deliveryInstructions}
                  onChange={handleChange} placeholder="Any special delivery instructions?" rows={3}
                  className={`${inputClass} resize-y`} />
              </div>
              <div>
                <label htmlFor="message" className={labelClass}>Message to the Shop</label>
                <textarea id="message" name="message" value={form.message}
                  onChange={handleChange} placeholder="Write your message here..." rows={3}
                  className={`${inputClass} resize-y`} />
              </div>
            </div>
          </section>

          {error && (
            <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-medium text-red-600" role="alert">
              {error}
            </p>
          )}

          <div className="space-y-3">
            <button
              type="submit"
              disabled={loading || cartLoading || cartItems.length === 0}
              className="w-full rounded-xl bg-neutral-900 px-6 py-4 text-xs font-bold uppercase tracking-wider text-white shadow-md transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Placing order..." : "Place Order →"}
            </button>

            {/* Admin Quick Override Button */}
            {localStorage.getItem("role") === "ADMIN" && (
              <button
                type="button"
                onClick={() => alert("Admin Direct Dispatch Override Triggered")}
                className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-neutral-800 transition hover:bg-neutral-100 shadow-sm"
              >
                <ShieldCheck size={14} className="inline mr-1.5" /> Admin Direct Dispatch Override
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default Checkout;