import { useMemo, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import {
  ShoppingBag,
  ArrowLeft,
  Trash2,
  CheckCircle2,
  ShieldCheck,
  Package,
} from "lucide-react";

const FORMSPREE_ENDPOINT = "https://formspree.io/f/xjygrylp";
const SHOP_NAME = "The Butcher's Shop";

type Product = {
  id: number;
  name: string;
  price: number;
  image?: string;
  emoji?: string;
};
type CartItem = Product & { qty: number };
type Customer = {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  notes: string;
};
type View = "products" | "cart" | "checkout" | "done";

const PRODUCTS: Product[] = [
  { id: 1, name: "Ribeye Steak", price: 34.99, emoji: "🥩" },
  { id: 2, name: "Angus Beef Burger Patties", price: 18.5, emoji: "🍔" },
  { id: 3, name: "Organic Chicken Breast", price: 14.2, emoji: "🍗" },
  { id: 4, name: "Smoked Bacon Strips", price: 9.99, emoji: "🥓" },
];

const EMPTY: Customer = {
  name: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  notes: "",
};
const money = (n: number) => `$${n.toFixed(2)}`;

export default function ShopCheckout({
  userName = "Shahzaib",
}: {
  userName?: string;
}) {
  const [view, setView] = useState<View>("products");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customer, setCustomer] = useState<Customer>(EMPTY);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [orderId, setOrderId] = useState("");

  const total = useMemo(
    () => cart.reduce((s, i) => s + i.price * i.qty, 0),
    [cart]
  );
  const count = cart.reduce((s, i) => s + i.qty, 0);

  const addToCart = (p: Product) =>
    setCart((c) =>
      c.some((i) => i.id === p.id)
        ? c.map((i) => (i.id === p.id ? { ...i, qty: i.qty + 1 } : i))
        : [...c, { ...p, qty: 1 }]
    );

  const changeQty = (id: number, d: number) =>
    setCart((c) =>
      c.map((i) => (i.id === id ? { ...i, qty: Math.max(1, i.qty + d) } : i))
    );

  const removeItem = (id: number) =>
    setCart((c) => c.filter((i) => i.id !== id));

  const onField = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setCustomer({ ...customer, [e.target.name]: e.target.value });

  const placeOrder = async (e: FormEvent) => {
    e.preventDefault();
    if (!cart.length) return;
    setSending(true);
    setError("");
    const id = "ORD-" + Date.now().toString().slice(-8);

    const productLines = cart
      .map(
        (i, n) =>
          `${n + 1}. ${i.name} | Qty: ${i.qty} | Price: ${money(
            i.price
          )} | Subtotal: ${money(i.price * i.qty)}`
      )
      .join("\n");

    const payload = {
      _subject: `New order ${id} from ${customer.name}`,
      order_id: id,
      customer_name: customer.name,
      email: customer.email,
      phone: customer.phone,
      address: customer.address,
      city: customer.city,
      notes: customer.notes || "-",
      products: productLines,
      total_items: count,
      order_total: money(total),
    };

    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(
          data?.errors?.[0]?.message || "Could not send the order."
        );
      }
      setOrderId(id);
      setCart([]);
      setCustomer(EMPTY);
      setView("done");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setSending(false);
    }
  };

  const Thumb = ({ p }: { p: Product }) => (
    <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-neutral-200 bg-neutral-100 font-bold text-2xl text-neutral-800">
      {p.image ? (
        <img
          src={p.image}
          alt={p.name}
          className="h-full w-full object-cover"
        />
      ) : (
        <span>{p.emoji ?? "📦"}</span>
      )}
    </div>
  );

  const inputStyle =
    "w-full rounded-xl border border-neutral-200 bg-neutral-50 py-3 px-4 text-xs text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-neutral-900 focus:bg-white focus:ring-1 focus:ring-neutral-900";

  return (
    <div className="min-h-screen bg-white font-sans text-neutral-900 flex flex-col justify-between selection:bg-neutral-900 selection:text-white">
      {/* Top Banner */}
      <div className="bg-neutral-900 text-white text-[11px] py-2 px-4 text-center font-medium tracking-wide">
        Welcome to {SHOP_NAME} — Premium Quality Store
      </div>

      {/* ---------- NAVBAR ---------- */}
      <nav className="sticky top-0 z-50 border-b border-neutral-100 bg-white/90 backdrop-blur-md px-6 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <div
            className="flex items-center gap-2.5 cursor-pointer"
            onClick={() => setView("products")}
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-neutral-900 text-white shadow-sm">
              <span className="font-black tracking-tighter text-base">BS</span>
            </div>
            <span className="text-lg font-black tracking-tighter uppercase">
              {SHOP_NAME}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setView("products")}
              className={`rounded-xl px-4 py-2 text-xs font-bold transition ${
                view === "products"
                  ? "bg-neutral-100 text-neutral-900"
                  : "text-neutral-600 hover:text-neutral-900"
              }`}
            >
              Products
            </button>
            <button
              type="button"
              onClick={() => setView("cart")}
              className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition ${
                view === "cart" || view === "checkout"
                  ? "bg-neutral-900 text-white shadow-sm"
                  : "border border-neutral-200 bg-white text-neutral-700 hover:border-neutral-900"
              }`}
            >
              <ShoppingBag size={14} /> Cart
              {count > 0 && (
                <span className="ml-1 rounded-full bg-neutral-200 px-2 py-0.5 text-[10px] text-neutral-900 font-extrabold">
                  {count}
                </span>
              )}
            </button>
          </div>

          <div className="hidden sm:block text-xs font-semibold text-neutral-500">
            Hi, <span className="text-neutral-900 font-bold">{userName}</span>
          </div>
        </div>
      </nav>

      {/* ---------- PAGE CONTAINER ---------- */}
      <main className="mx-auto w-full max-w-7xl flex-1 px-6 py-10">
        {/* ---------- PRODUCTS ---------- */}
        {view === "products" && (
          <div>
            <div className="flex flex-wrap justify-between items-center mb-8 border-b border-neutral-100 pb-6 gap-4">
              <div>
                <span className="text-xs font-bold tracking-widest text-neutral-400 uppercase">
                  Catalog View
                </span>
                <h1 className="text-3xl font-black tracking-tight text-neutral-900 mt-1">
                  Products
                </h1>
                <p className="text-neutral-500 text-xs mt-1">
                  Discover fresh items. Shop with confidence.
                </p>
              </div>

              {localStorage.getItem("role") === "ADMIN" && (
                <button
                  type="button"
                  onClick={() => alert("Admin Add Product Clicked")}
                  className="rounded-xl bg-neutral-900 px-5 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-md hover:bg-neutral-800 transition"
                >
                  + Add Product
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {PRODUCTS.map((p) => (
                <div
                  key={p.id}
                  className="bg-white border border-neutral-200 rounded-2xl p-5 flex flex-col justify-between shadow-sm hover:border-neutral-900 transition"
                >
                  <div>
                    <div className="w-full h-44 bg-neutral-100 border border-neutral-200 rounded-xl flex items-center justify-center overflow-hidden mb-4 font-bold text-4xl">
                      {p.image ? (
                        <img
                          src={p.image}
                          alt={p.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span>{p.emoji ?? "📦"}</span>
                      )}
                    </div>

                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-sm font-bold text-neutral-900 capitalize">
                        {p.name}
                      </h3>
                      <span className="text-neutral-900 font-bold text-sm">
                        {money(p.price)}
                      </span>
                    </div>
                  </div>

                  <div className="mt-6">
                    <button
                      type="button"
                      onClick={() => addToCart(p)}
                      className="w-full rounded-xl bg-neutral-900 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-md hover:bg-neutral-800 transition inline-flex items-center justify-center gap-2"
                    >
                      <ShoppingBag size={14} /> Add to Bag
                    </button>

                    {localStorage.getItem("role") === "ADMIN" && (
                      <>
                        <div className="border-t border-neutral-100 my-3" />
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => alert(`Edit Product ${p.id}`)}
                            className="flex-1 py-2 px-3 border border-neutral-200 text-neutral-700 font-semibold rounded-xl hover:border-neutral-900 hover:text-neutral-900 transition text-xs bg-white shadow-sm"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => alert(`Delete Product ${p.id}`)}
                            className="flex-1 py-2 px-3 border border-red-200 text-red-600 font-semibold rounded-xl hover:bg-red-50 transition text-xs bg-white shadow-sm"
                          >
                            Delete
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ---------- CART ---------- */}
        {view === "cart" && (
          <div>
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-neutral-100 pb-6 mb-8">
              <div>
                <span className="text-xs font-bold tracking-widest text-neutral-400 uppercase">
                  Shopping Bag
                </span>
                <h1 className="text-3xl font-black tracking-tight text-neutral-900 mt-1">
                  Your Cart
                </h1>
                <p className="text-neutral-500 text-xs mt-1">
                  Review your items before checkout.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setView("products")}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-600 hover:text-neutral-900 transition"
              >
                <ArrowLeft size={14} /> Continue Shopping
              </button>
            </div>

            {cart.length === 0 ? (
              <div className="rounded-2xl border border-neutral-200 bg-neutral-50/50 p-12 text-center">
                <Package className="mx-auto h-12 w-12 text-neutral-400 mb-3" />
                <h2 className="text-base font-bold text-neutral-900">
                  Your cart is currently empty
                </h2>
                <p className="mt-1 text-xs text-neutral-500">
                  Add a product to get started.
                </p>
                <button
                  type="button"
                  onClick={() => setView("products")}
                  className="mt-6 rounded-xl bg-neutral-900 px-5 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-md hover:bg-neutral-800 transition"
                >
                  Browse Products
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
                <div className="space-y-4 lg:col-span-8">
                  {cart.map((i) => (
                    <div
                      key={i.id}
                      className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-4 rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm"
                    >
                      <div className="flex min-w-0 items-center gap-4">
                        <Thumb p={i} />
                        <div className="min-w-0">
                          <h3 className="font-bold text-neutral-900 text-sm capitalize">
                            {i.name}
                          </h3>
                          <p className="mt-0.5 font-bold text-neutral-900 text-xs">
                            {money(i.price)}
                          </p>

                          <div className="mt-3 flex items-center gap-2.5">
                            <button
                              type="button"
                              onClick={() => changeQty(i.id, -1)}
                              className="h-7 w-7 rounded-lg border border-neutral-200 bg-neutral-50 text-neutral-800 hover:border-neutral-900 text-xs font-bold"
                            >
                              -
                            </button>
                            <span className="min-w-6 text-center text-xs font-semibold text-neutral-900">
                              {i.qty}
                            </span>
                            <button
                              type="button"
                              onClick={() => changeQty(i.id, 1)}
                              className="h-7 w-7 rounded-lg border border-neutral-200 bg-neutral-50 text-neutral-800 hover:border-neutral-900 text-xs font-bold"
                            >
                              +
                            </button>
                          </div>

                          <p className="mt-2 text-[11px] text-neutral-500 font-medium">
                            Subtotal:{" "}
                            <span className="text-neutral-900 font-bold">
                              {money(i.price * i.qty)}
                            </span>
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeItem(i.id)}
                        className="shrink-0 rounded-xl border border-red-200 bg-white px-3.5 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50 inline-flex items-center gap-1.5 shadow-sm"
                      >
                        <Trash2 size={13} /> Remove
                      </button>
                    </div>
                  ))}
                </div>

                <div className="h-fit space-y-4 rounded-2xl border border-neutral-200 bg-neutral-50/50 p-6 lg:col-span-4 shadow-sm">
                  <h2 className="text-base font-bold text-neutral-900 tracking-tight">
                    Order Summary
                  </h2>

                  <div className="flex justify-between text-xs text-neutral-600">
                    <span>Total Items:</span>
                    <span className="font-semibold text-neutral-900">
                      {count}
                    </span>
                  </div>

                  <div className="flex justify-between text-xs text-neutral-600">
                    <span>Total Amount:</span>
                    <span className="font-black text-neutral-900 text-sm">
                      {money(total)}
                    </span>
                  </div>

                  <hr className="border-neutral-200" />

                  <button
                    type="button"
                    onClick={() => setView("checkout")}
                    className="w-full rounded-xl bg-neutral-900 py-3.5 text-xs font-bold uppercase tracking-wider text-white shadow-md transition hover:bg-neutral-800 inline-flex items-center justify-center gap-2"
                  >
                    Proceed to Checkout →
                  </button>

                  {localStorage.getItem("role") === "ADMIN" && (
                    <button
                      type="button"
                      onClick={() => alert("Admin Quick Override Clicked")}
                      className="w-full rounded-xl border border-neutral-200 bg-white py-2.5 text-xs font-bold uppercase tracking-wider text-neutral-800 hover:bg-neutral-100 transition shadow-sm"
                    >
                      Admin Express Process
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ---------- CHECKOUT ---------- */}
        {view === "checkout" && (
          <div>
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-neutral-100 pb-6 mb-8">
              <div>
                <span className="text-xs font-bold tracking-widest text-neutral-400 uppercase">
                  Finalization
                </span>
                <h1 className="text-3xl font-black tracking-tight text-neutral-900 mt-1">
                  Checkout
                </h1>
                <p className="text-neutral-500 text-xs mt-1">
                  Enter your delivery details to place the order.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setView("cart")}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-600 hover:text-neutral-900 transition"
              >
                <ArrowLeft size={14} /> Back to Cart
              </button>
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
              <form
                className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-xl shadow-neutral-100/50 space-y-4 lg:col-span-8"
                onSubmit={placeOrder}
              >
                <h2 className="text-lg font-bold text-neutral-900">
                  Delivery Details
                </h2>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-neutral-700">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="name"
                    value={customer.name}
                    onChange={onField}
                    required
                    className={inputStyle}
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-neutral-700">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={customer.email}
                      onChange={onField}
                      required
                      className={inputStyle}
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-neutral-700">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={customer.phone}
                      onChange={onField}
                      required
                      className={inputStyle}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-neutral-700">
                      Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      name="address"
                      value={customer.address}
                      onChange={onField}
                      required
                      className={inputStyle}
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-neutral-700">
                      City <span className="text-red-500">*</span>
                    </label>
                    <input
                      name="city"
                      value={customer.city}
                      onChange={onField}
                      required
                      className={inputStyle}
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-neutral-700">
                    Order Notes{" "}
                    <span className="text-neutral-400 font-normal">
                      (Optional)
                    </span>
                  </label>
                  <textarea
                    name="notes"
                    rows={3}
                    value={customer.notes}
                    onChange={onField}
                    className={`${inputStyle} resize-none`}
                  />
                </div>

                {error && (
                  <p
                    className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-medium text-red-600"
                    role="alert"
                  >
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={sending || cart.length === 0}
                  className="w-full rounded-xl bg-neutral-900 py-3.5 text-xs font-bold uppercase tracking-wider text-white shadow-md transition hover:bg-neutral-800 disabled:opacity-50"
                >
                  {sending ? "Placing Order..." : "Place Order →"}
                </button>
              </form>

              <div className="h-fit space-y-4 rounded-2xl border border-neutral-200 bg-neutral-50/50 p-6 lg:col-span-4 shadow-sm">
                <h2 className="text-base font-bold text-neutral-900">
                  Order Summary
                </h2>

                {cart.map((i) => (
                  <div
                    className="flex justify-between text-xs text-neutral-600"
                    key={i.id}
                  >
                    <span className="capitalize font-medium">
                      {i.name} × {i.qty}
                    </span>
                    <span className="font-bold text-neutral-900">
                      {money(i.price * i.qty)}
                    </span>
                  </div>
                ))}

                <hr className="border-neutral-200" />

                <div className="flex justify-between text-xs text-neutral-600">
                  <span>Total Items:</span>
                  <span className="font-semibold text-neutral-900">
                    {count}
                  </span>
                </div>

                <div className="flex justify-between text-xs text-neutral-600">
                  <span>Total Amount:</span>
                  <span className="font-black text-neutral-900 text-sm">
                    {money(total)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ---------- SUCCESS ---------- */}
        {view === "done" && (
          <div className="mx-auto max-w-lg rounded-2xl border border-neutral-200 bg-white p-8 shadow-xl shadow-neutral-100 text-center my-12">
            <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 shadow-sm">
              <CheckCircle2 size={28} />
            </div>

            <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
              Confirmation
            </span>
            <h1 className="text-3xl font-black tracking-tight text-neutral-900 mt-1">
              Order Placed!
            </h1>

            <p className="mt-2 text-xs font-semibold text-neutral-800">
              Thank you! Your order ID is{" "}
              <strong className="font-mono text-neutral-900">{orderId}</strong>.
            </p>
            <p className="mt-1 text-xs text-neutral-500 leading-relaxed max-w-sm mx-auto">
              We will contact you shortly to confirm delivery.
            </p>

            <div className="mt-8 space-y-3">
              <button
                type="button"
                onClick={() => setView("products")}
                className="w-full rounded-xl bg-neutral-900 py-3.5 text-xs font-bold uppercase tracking-wider text-white shadow-md transition hover:bg-neutral-800 inline-flex items-center justify-center gap-2"
              >
                <ShoppingBag size={15} /> Continue Shopping
              </button>

              {localStorage.getItem("role") === "ADMIN" && (
                <button
                  type="button"
                  onClick={() => alert("Go to Admin Orders")}
                  className="w-full rounded-xl border border-neutral-200 bg-neutral-50 py-3.5 text-xs font-bold uppercase tracking-wider text-neutral-800 transition hover:bg-neutral-100 shadow-sm"
                >
                  <ShieldCheck size={15} className="inline mr-1.5" />
                  View Orders in Admin Panel
                </button>
              )}
            </div>
          </div>
        )}
      </main>

      <footer className="border-t border-neutral-100 py-6 text-center text-xs text-neutral-400">
        © {new Date().getFullYear()} {SHOP_NAME}. All rights reserved.
      </footer>
    </div>
  );
}