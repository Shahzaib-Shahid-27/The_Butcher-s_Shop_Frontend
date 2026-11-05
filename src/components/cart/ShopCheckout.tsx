
import { useMemo, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";

import {
  ShoppingBag,
  ArrowLeft,
  Trash2,
  CheckCircle2,
  ShieldCheck,
  Package,
  ShoppingCart,
  Truck,
  Plus,
} from "lucide-react";

const FORMSPREE_ENDPOINT = "https://formspree.io/f/xjygrylp";
const SHOP_NAME = "Butcher Shop";

type Product = {
  id: number;
  name: string;
  price: number;
  image?: string;
  emoji?: string;
};

type CartItem = Product & {
  qty: number;
};

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
  userName = "Customer",
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
    () => cart.reduce((sum, item) => sum + item.price * item.qty, 0),
    [cart]
  );

  const count = cart.reduce((sum, item) => sum + item.qty, 0);

  const isAdmin = localStorage.getItem("role") === "ADMIN";

  // Add product to cart
  const addToCart = (product: Product) => {
    setCart((currentCart) =>
      currentCart.some((item) => item.id === product.id)
        ? currentCart.map((item) =>
            item.id === product.id
              ? { ...item, qty: item.qty + 1 }
              : item
          )
        : [...currentCart, { ...product, qty: 1 }]
    );
  };

  // Change product quantity
  const changeQty = (id: number, difference: number) => {
    setCart((currentCart) =>
      currentCart.map((item) =>
        item.id === id
          ? { ...item, qty: Math.max(1, item.qty + difference) }
          : item
      )
    );
  };

  // Remove product from cart
  const removeItem = (id: number) => {
    setCart((currentCart) =>
      currentCart.filter((item) => item.id !== id)
    );
  };

  // Handle customer form inputs
  const onField = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setCustomer((current) => ({
      ...current,
      [name]: value,
    }));
  };

  // Place customer order
  const placeOrder = async (e: FormEvent) => {
    e.preventDefault();

    if (!cart.length) return;

    setSending(true);
    setError("");

    const id = "ORD-" + Date.now().toString().slice(-8);

    const productLines = cart
      .map(
        (item, index) =>
          `${index + 1}. ${item.name} | Qty: ${item.qty} | Price: ${money(
            item.price
          )} | Subtotal: ${money(item.price * item.qty)}`
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
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);

        throw new Error(
          data?.errors?.[0]?.message ||
            "Could not send the order. Please try again."
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

  // Product thumbnail
  const Thumb = ({ p }: { p: Product }) => (
    <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-[#E8DED3] bg-[#F4EEE6] text-2xl font-bold text-[#351D1D]">
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

  // Shared styles
  const inputStyle =
    "w-full rounded-xl border border-[#E8DED3] bg-[#FBF8F3] px-4 py-3 text-xs text-[#351D1D] outline-none transition placeholder:text-[#927D70] focus:border-[#8B2635] focus:bg-white focus:ring-1 focus:ring-[#8B2635]";

  const primaryButton =
    "inline-flex items-center justify-center gap-2 rounded-xl bg-[#8B2635] px-5 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-sm transition hover:bg-[#70202C] disabled:cursor-not-allowed disabled:opacity-50";

  const secondaryButton =
    "rounded-xl border border-[#E8DED3] bg-[#F4EEE6] px-4 py-2 text-xs font-bold text-[#351D1D] transition hover:border-[#8B2635] hover:text-[#8B2635]";

  return (
    <div className="flex min-h-screen flex-col justify-between bg-[#FBF8F3] font-sans text-[#351D1D] selection:bg-[#8B2635] selection:text-white">

      {/* Top Banner */}
      <div className="bg-[#351D1D] px-4 py-2 text-center text-[11px] font-medium tracking-wide text-[#FBF8F3]">
        Welcome to {SHOP_NAME} — Your Online Meat Store
      </div>

      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-[#E8DED3] bg-[#FBF8F3]/95 px-4 py-4 backdrop-blur-md sm:px-6">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">

          {/* Brand */}
          <button
            type="button"
            onClick={() => setView("products")}
            className="flex items-center gap-2.5 text-left"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#8B2635] text-white shadow-sm">
              <span className="text-base font-black tracking-tighter">
                BS
              </span>
            </div>

            <div>
              <span className="block text-sm font-black uppercase tracking-tight text-[#351D1D] sm:text-lg">
                {SHOP_NAME}
              </span>

              <span className="hidden text-[10px] font-medium tracking-wide text-[#927D70] sm:block">
                Quality You Can Taste
              </span>
            </div>
          </button>

          {/* Navigation */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setView("products")}
              className={`rounded-xl px-3 py-2 text-xs font-bold transition sm:px-4 ${
                view === "products"
                  ? "bg-[#F4EEE6] text-[#8B2635]"
                  : "text-[#6D5B52] hover:bg-[#F4EEE6] hover:text-[#8B2635]"
              }`}
            >
              Products
            </button>

            <button
              type="button"
              onClick={() => setView("cart")}
              className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold transition sm:px-4 ${
                view === "cart" || view === "checkout"
                  ? "bg-[#8B2635] text-white shadow-sm"
                  : "border border-[#E8DED3] bg-white text-[#351D1D] hover:border-[#8B2635]"
              }`}
            >
              <ShoppingBag size={14} />
              Cart

              {count > 0 && (
                <span className="ml-1 rounded-full bg-[#F4EEE6] px-2 py-0.5 text-[10px] font-extrabold text-[#8B2635]">
                  {count}
                </span>
              )}
            </button>
          </div>

          {/* Customer */}
          <div className="hidden text-xs font-semibold text-[#927D70] sm:block">
            Hi, <span className="font-bold text-[#351D1D]">{userName}</span>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 sm:py-10">

        {/* PRODUCTS */}
        {view === "products" && (
          <div>
            <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-[#E8DED3] pb-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#927D70]">
                  Online Store
                </span>

                <h1 className="mt-1 text-3xl font-black tracking-tight text-[#351D1D]">
                  Explore Our Products
                </h1>

                <p className="mt-1 text-xs text-[#927D70]">
                  Discover quality products and order your favorites online.
                </p>
              </div>

              {isAdmin && (
                <button
                  type="button"
                  onClick={() => alert("Admin Add Product Clicked")}
                  className={primaryButton}
                >
                  <Plus size={15} />
                  Add Product
                </button>
              )}
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {PRODUCTS.map((product) => (
                <div
                  key={product.id}
                  className="flex flex-col justify-between rounded-2xl border border-[#E8DED3] bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[#8B2635] hover:shadow-lg"
                >
                  <div>
                    <div className="mb-4 flex h-44 w-full items-center justify-center overflow-hidden rounded-xl border border-[#E8DED3] bg-[#F4EEE6] text-4xl font-bold">
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span>{product.emoji ?? "📦"}</span>
                      )}
                    </div>

                    <div className="mb-2 flex items-start justify-between gap-2">
                      <h3 className="text-sm font-bold capitalize text-[#351D1D]">
                        {product.name}
                      </h3>

                      <span className="shrink-0 text-sm font-bold text-[#8B2635]">
                        {money(product.price)}
                      </span>
                    </div>
                  </div>

                  <div className="mt-6">
                    <button
                      type="button"
                      onClick={() => addToCart(product)}
                      className={`${primaryButton} w-full`}
                    >
                      <ShoppingCart size={14} />
                      Add to Cart
                    </button>

                    {isAdmin && (
                      <>
                        <div className="my-3 border-t border-[#E8DED3]" />

                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              alert(`Edit Product ${product.id}`)
                            }
                            className={`flex-1 ${secondaryButton}`}
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              alert(`Delete Product ${product.id}`)
                            }
                            className="flex-1 rounded-xl border border-red-200 bg-white px-4 py-2 text-xs font-bold text-red-600 transition hover:bg-red-50"
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

        {/* CART */}
        {view === "cart" && (
          <div>
            <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-[#E8DED3] pb-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#927D70]">
                  Shopping
                </span>

                <h1 className="mt-1 text-3xl font-black tracking-tight text-[#351D1D]">
                  Your Cart
                </h1>

                <p className="mt-1 text-xs text-[#927D70]">
                  Review your products before checkout.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setView("products")}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#6D5B52] transition hover:text-[#8B2635]"
              >
                <ArrowLeft size={14} />
                Continue Shopping
              </button>
            </div>

            {cart.length === 0 ? (
              <div className="rounded-2xl border border-[#E8DED3] bg-white p-12 text-center shadow-sm">
                <Package className="mx-auto mb-3 h-12 w-12 text-[#927D70]" />

                <h2 className="text-base font-bold text-[#351D1D]">
                  Your cart is empty
                </h2>

                <p className="mt-1 text-xs text-[#927D70]">
                  Explore our products and add something to your cart.
                </p>

                <button
                  type="button"
                  onClick={() => setView("products")}
                  className={`${primaryButton} mt-6`}
                >
                  <ShoppingBag size={14} />
                  Browse Products
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
                {/* Cart Items */}
                <div className="space-y-4 lg:col-span-8">
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[#E8DED3] bg-white p-5 shadow-sm sm:flex-nowrap"
                    >
                      <div className="flex min-w-0 items-center gap-4">
                        <Thumb p={item} />

                        <div className="min-w-0">
                          <h3 className="text-sm font-bold capitalize text-[#351D1D]">
                            {item.name}
                          </h3>

                          <p className="mt-0.5 text-xs font-bold text-[#8B2635]">
                            {money(item.price)}
                          </p>

                          {/* Quantity */}
                          <div className="mt-3 flex items-center gap-2.5">
                            <button
                              type="button"
                              onClick={() => changeQty(item.id, -1)}
                              className="h-7 w-7 rounded-lg border border-[#E8DED3] bg-[#F4EEE6] text-xs font-bold text-[#351D1D] transition hover:border-[#8B2635] hover:text-[#8B2635]"
                            >
                              -
                            </button>

                            <span className="min-w-6 text-center text-xs font-semibold text-[#351D1D]">
                              {item.qty}
                            </span>

                            <button
                              type="button"
                              onClick={() => changeQty(item.id, 1)}
                              className="h-7 w-7 rounded-lg border border-[#E8DED3] bg-[#F4EEE6] text-xs font-bold text-[#351D1D] transition hover:border-[#8B2635] hover:text-[#8B2635]"
                            >
                              +
                            </button>
                          </div>

                          <p className="mt-2 text-[11px] font-medium text-[#927D70]">
                            Subtotal:{" "}
                            <span className="font-bold text-[#351D1D]">
                              {money(item.price * item.qty)}
                            </span>
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-red-200 bg-white px-3.5 py-2 text-xs font-semibold text-red-600 shadow-sm transition hover:bg-red-50"
                      >
                        <Trash2 size={13} />
                        Remove
                      </button>
                    </div>
                  ))}
                </div>

                {/* Order Summary */}
                <div className="h-fit space-y-4 rounded-2xl border border-[#E8DED3] bg-[#F4EEE6] p-6 shadow-sm lg:col-span-4">
                  <h2 className="text-base font-bold tracking-tight text-[#351D1D]">
                    Order Summary
                  </h2>

                  <div className="flex justify-between text-xs text-[#6D5B52]">
                    <span>Total Items:</span>
                    <span className="font-semibold text-[#351D1D]">
                      {count}
                    </span>
                  </div>

                  <div className="flex justify-between text-xs text-[#6D5B52]">
                    <span>Total Amount:</span>
                    <span className="text-sm font-black text-[#8B2635]">
                      {money(total)}
                    </span>
                  </div>

                  <hr className="border-[#E8DED3]" />

                  <button
                    type="button"
                    onClick={() => setView("checkout")}
                    className={`${primaryButton} w-full`}
                  >
                    Proceed to Checkout
                  </button>

                  {isAdmin && (
                    <button
                      type="button"
                      onClick={() => alert("Admin Quick Override Clicked")}
                      className="w-full rounded-xl border border-[#E8DED3] bg-white py-2.5 text-xs font-bold uppercase tracking-wider text-[#351D1D] shadow-sm transition hover:border-[#8B2635] hover:text-[#8B2635]"
                    >
                      Admin Express Process
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* CHECKOUT */}
        {view === "checkout" && (
          <div>
            <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-[#E8DED3] pb-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#927D70]">
                  Complete Your Purchase
                </span>

                <h1 className="mt-1 text-3xl font-black tracking-tight text-[#351D1D]">
                  Checkout
                </h1>

                <p className="mt-1 text-xs text-[#927D70]">
                  Enter your delivery details to place your order.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setView("cart")}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#6D5B52] transition hover:text-[#8B2635]"
              >
                <ArrowLeft size={14} />
                Back to Cart
              </button>
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
              {/* Delivery Form */}
              <form
                className="space-y-4 rounded-2xl border border-[#E8DED3] bg-white p-6 shadow-sm lg:col-span-8"
                onSubmit={placeOrder}
              >
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F4EEE6] text-[#8B2635]">
                    <Truck size={19} />
                  </div>

                  <div>
                    <h2 className="text-lg font-bold text-[#351D1D]">
                      Delivery Details
                    </h2>
                    <p className="text-xs text-[#927D70]">
                      Where should we deliver your order?
                    </p>
                  </div>
                </div>

                {/* Full Name */}
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-[#6D5B52]">
                    Full Name <span className="text-red-500">*</span>
                  </label>

                  <input
                    name="name"
                    value={customer.name}
                    onChange={onField}
                    required
                    className={inputStyle}
                    placeholder="Enter your full name"
                  />
                </div>

                {/* Email and Phone */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-[#6D5B52]">
                      Email <span className="text-red-500">*</span>
                    </label>

                    <input
                      type="email"
                      name="email"
                      value={customer.email}
                      onChange={onField}
                      required
                      className={inputStyle}
                      placeholder="Enter your email"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-[#6D5B52]">
                      Phone Number <span className="text-red-500">*</span>
                    </label>

                    <input
                      type="tel"
                      name="phone"
                      value={customer.phone}
                      onChange={onField}
                      required
                      className={inputStyle}
                      placeholder="Enter your phone number"
                    />
                  </div>
                </div>

                {/* Address and City */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-[#6D5B52]">
                      Address <span className="text-red-500">*</span>
                    </label>

                    <input
                      name="address"
                      value={customer.address}
                      onChange={onField}
                      required
                      className={inputStyle}
                      placeholder="Enter your delivery address"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-[#6D5B52]">
                      City <span className="text-red-500">*</span>
                    </label>

                    <input
                      name="city"
                      value={customer.city}
                      onChange={onField}
                      required
                      className={inputStyle}
                      placeholder="Enter your city"
                    />
                  </div>
                </div>

                {/* Order Notes */}
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-[#6D5B52]">
                    Order Notes{" "}
                    <span className="font-normal text-[#927D70]">
                      (Optional)
                    </span>
                  </label>

                  <textarea
                    name="notes"
                    rows={3}
                    value={customer.notes}
                    onChange={onField}
                    placeholder="Any special delivery instructions?"
                    className={`${inputStyle} resize-none`}
                  />
                </div>

                {/* Error Message */}
                {error && (
                  <p
                    className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-medium text-red-600"
                    role="alert"
                  >
                    {error}
                  </p>
                )}

                {/* Place Order */}
                <button
                  type="submit"
                  disabled={sending || cart.length === 0}
                  className={`${primaryButton} w-full py-3.5`}
                >
                  {sending ? (
                    "Placing Order..."
                  ) : (
                    <>
                      <ShoppingBag size={15} />
                      Place Order
                    </>
                  )}
                </button>

                <div className="flex items-center justify-center gap-2 pt-1 text-[11px] font-medium text-[#927D70]">
                  <ShieldCheck size={14} className="text-[#8B2635]" />
                  Your delivery details are submitted securely.
                </div>
              </form>

              {/* Checkout Summary */}
              <div className="h-fit space-y-4 rounded-2xl border border-[#E8DED3] bg-[#F4EEE6] p-6 shadow-sm lg:col-span-4">
                <h2 className="text-base font-bold text-[#351D1D]">
                  Order Summary
                </h2>

                {cart.map((item) => (
                  <div
                    className="flex justify-between gap-3 text-xs text-[#6D5B52]"
                    key={item.id}
                  >
                    <span className="font-medium capitalize">
                      {item.name} × {item.qty}
                    </span>

                    <span className="shrink-0 font-bold text-[#351D1D]">
                      {money(item.price * item.qty)}
                    </span>
                  </div>
                ))}

                <hr className="border-[#E8DED3]" />

                <div className="flex justify-between text-xs text-[#6D5B52]">
                  <span>Total Items:</span>
                  <span className="font-semibold text-[#351D1D]">
                    {count}
                  </span>
                </div>

                <div className="flex justify-between text-xs text-[#6D5B52]">
                  <span>Total Amount:</span>
                  <span className="text-sm font-black text-[#8B2635]">
                    {money(total)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SUCCESS */}
        {view === "done" && (
          <div className="mx-auto my-12 max-w-lg rounded-2xl border border-[#E8DED3] bg-white p-8 text-center shadow-lg">
            <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-200 bg-emerald-50 text-emerald-600 shadow-sm">
              <CheckCircle2 size={28} />
            </div>

            <span className="text-[10px] font-bold uppercase tracking-widest text-[#927D70]">
              Order Confirmation
            </span>

            <h1 className="mt-1 text-3xl font-black tracking-tight text-[#351D1D]">
              Order Placed!
            </h1>

            <p className="mt-2 text-xs font-semibold text-[#6D5B52]">
              Thank you for shopping with {SHOP_NAME}!
            </p>

            <p className="mt-2 text-xs font-semibold text-[#6D5B52]">
              Your order ID is{" "}
              <strong className="font-mono text-[#8B2635]">
                {orderId}
              </strong>.
            </p>

            <p className="mx-auto mt-2 max-w-sm text-xs leading-relaxed text-[#927D70]">
              We will contact you shortly to confirm your order and delivery.
            </p>

            <div className="mt-8 space-y-3">
              <button
                type="button"
                onClick={() => setView("products")}
                className={`${primaryButton} w-full py-3.5`}
              >
                <ShoppingBag size={15} />
                Continue Shopping
              </button>

              {isAdmin && (
                <button
                  type="button"
                  onClick={() => alert("Go to Admin Orders")}
                  className="w-full rounded-xl border border-[#E8DED3] bg-[#F4EEE6] py-3.5 text-xs font-bold uppercase tracking-wider text-[#351D1D] shadow-sm transition hover:border-[#8B2635] hover:text-[#8B2635]"
                >
                  <ShieldCheck size={15} className="mr-1.5 inline" />
                  View Orders in Admin Panel
                </button>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-[#E8DED3] bg-[#F4EEE6] py-6 text-center text-xs text-[#927D70]">
        © {new Date().getFullYear()} {SHOP_NAME}. All rights reserved.

        <p className="mt-1 font-medium text-[#8B2635]">
          Quality You Can Taste
        </p>
      </footer>
    </div>
  );
}
