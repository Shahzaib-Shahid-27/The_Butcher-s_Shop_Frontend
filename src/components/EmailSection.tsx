import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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
const CART_API_URL = " http://localhost:4000/api/v1"  ; 
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
  "w-full rounded-xl border border-slate-700/70 bg-[#070b14] px-4 py-3 text-sm text-white " +
  "placeholder:text-slate-500 outline-none transition " +
  "focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20";
const labelClass = "mb-2 block text-xs font-semibold text-slate-200";
const sectionClass = "rounded-2xl border border-slate-800 bg-[#080c15] p-5 sm:p-6";

const Checkout: React.FC = () => {
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartLoading, setCartLoading] = useState(true);

  /* ---- Load cart ---- */
  useEffect(() => {
    const loadCart = async () => {
      try {
        // A) Backend API
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

        // B) localStorage
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
        console.warn(
          "Checkout: no cart found. Check LOCAL_KEYS or set CART_API_URL. localStorage keys:",
          Object.keys(localStorage)
        );
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
          `${i + 1}. ${item.name}\n   Unit Price: $${item.price.toFixed(2)}\n   Quantity: ${item.quantity}\n   Subtotal: $${(item.price * item.quantity).toFixed(2)}`
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
    <div className="min-h-screen bg-linear-to-b from-[#0a1a4a] via-[#050c26] to-[#030716] px-4 py-10">
      <form
        onSubmit={handlePlaceOrder}
        className="mx-auto w-full max-w-3xl overflow-hidden rounded-2xl border border-slate-800 bg-[#060a12]/90 shadow-[0_0_60px_rgba(0,120,255,0.08)]"
      >
        <div className="border-b border-slate-800 bg-linear-to-r from-cyan-500/10 to-transparent px-6 py-6">
          <h2 className="text-3xl font-bold text-white">Checkout</h2>
          <p className="mt-1 text-sm text-slate-400">
            Confirm your order and enter your delivery details.
          </p>
        </div>

        <div className="space-y-5 p-5 sm:p-6">
          {/* Customer Details */}
          <section className={sectionClass}>
            <h3 className="mb-4 text-base font-bold text-white">Customer Details</h3>
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

          {/* Order */}
          <section className={sectionClass}>
            <h3 className="text-base font-bold text-white">Your Order</h3>
            <p className="mb-4 mt-1 text-xs text-slate-400">
              These products have been loaded from your cart.
            </p>

            {cartLoading ? (
              <p className="text-sm text-slate-400">Loading your cart...</p>
            ) : cartItems.length === 0 ? (
              <p className="text-sm text-slate-400">Your cart is empty.</p>
            ) : (
              <div className="space-y-3">
                {cartItems.map((item) => (
                  <div key={item.id} className="rounded-xl border border-slate-800 bg-[#070b14] px-4 py-3">
                    <div className="flex items-center justify-between">
                      <strong className="text-sm font-semibold text-white">{item.name}</strong>
                      <span className="text-sm font-bold text-cyan-400">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                    <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
                      <span>Unit Price: ${item.price.toFixed(2)}</span>
                      <span>Quantity: {item.quantity}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-5 flex items-center justify-between border-t border-slate-800 pt-4">
              <span className="text-sm font-semibold text-white">Total Amount</span>
              <strong className="text-xl font-bold text-emerald-400">${totalAmount.toFixed(2)}</strong>
            </div>
          </section>

          {/* Additional */}
          <section className={sectionClass}>
            <h3 className="mb-4 text-base font-bold text-white">Additional Details (optional)</h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="deliveryInstructions" className={labelClass}>Delivery Instructions</label>
                <textarea id="deliveryInstructions" name="deliveryInstructions" value={form.deliveryInstructions}
                  onChange={handleChange} placeholder="Any special delivery instructions?" rows={3}
                  className={`${inputClass} resize-y`} />
              </div>
              <div>
                <label htmlFor="message" className={labelClass}>Message to the shop</label>
                <textarea id="message" name="message" value={form.message}
                  onChange={handleChange} placeholder="Write your message here..." rows={3}
                  className={`${inputClass} resize-y`} />
              </div>
            </div>
          </section>

          {error && (
            <p className="rounded-xl border border-pink-500/30 bg-pink-500/10 px-4 py-3 text-sm text-pink-400">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading || cartLoading || cartItems.length === 0}
            className="w-full rounded-xl bg-linear-to-r from-blue-600 via-blue-500 to-cyan-400 px-6 py-4 text-sm font-semibold text-white shadow-[0_8px_30px_rgba(0,160,255,0.25)] transition hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-cyan-300/50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Placing order..." : "Place Order →"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Checkout;
