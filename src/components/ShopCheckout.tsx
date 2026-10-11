import { useMemo, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";

/* ------------------------------------------------------------------ */
/*  CONFIG                                                             */
/* ------------------------------------------------------------------ */
// Orders are emailed to the address registered on this Formspree form
// (shahzaibshahidr10@gmail.com) — verify in Formspree > Form > Settings.
const FORMSPREE_ENDPOINT = "https://formspree.io/f/xjygrylp";
const SHOP_NAME = "The Butcher's Shop";

/* ------------------------------------------------------------------ */
/*  TYPES + SAMPLE PRODUCTS (replace with your real products)          */
/* ------------------------------------------------------------------ */
type Product = { id: number; name: string; price: number; image?: string; emoji?: string };
type CartItem = Product & { qty: number };
type Customer = { name: string; email: string; phone: string; address: string; city: string; notes: string };
type View = "products" | "cart" | "checkout" | "done";

const PRODUCTS: Product[] = [
  { id: 1, name: "gloves", price: 100, emoji: "🧤" },
  { id: 2, name: "wireless mouse", price: 1200, emoji: "🖱️" },
  { id: 3, name: "headphones", price: 800, emoji: "🎧" },
  { id: 4, name: "backpack", price: 450, emoji: "🎒" },
];

const EMPTY: Customer = { name: "", email: "", phone: "", address: "", city: "", notes: "" };
const money = (n: number) => `$${n.toFixed(2)}`;

/* ------------------------------------------------------------------ */
/*  APP                                                                */
/* ------------------------------------------------------------------ */
export default function ShopCheckout({ userName = "Shahzaib" }: { userName?: string }) {
  const [view, setView] = useState<View>("products");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customer, setCustomer] = useState<Customer>(EMPTY);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [orderId, setOrderId] = useState("");

  const total = useMemo(() => cart.reduce((s, i) => s + i.price * i.qty, 0), [cart]);
  const count = cart.reduce((s, i) => s + i.qty, 0);

  const addToCart = (p: Product) =>
    setCart((c) =>
      c.some((i) => i.id === p.id)
        ? c.map((i) => (i.id === p.id ? { ...i, qty: i.qty + 1 } : i))
        : [...c, { ...p, qty: 1 }]
    );
  const changeQty = (id: number, d: number) =>
    setCart((c) => c.map((i) => (i.id === id ? { ...i, qty: Math.max(1, i.qty + d) } : i)));
  const removeItem = (id: number) => setCart((c) => c.filter((i) => i.id !== id));

  const onField = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setCustomer({ ...customer, [e.target.name]: e.target.value });

  const placeOrder = async (e: FormEvent) => {
    e.preventDefault();
    if (!cart.length) return;
    setSending(true);
    setError("");
    const id = "ORD-" + Date.now().toString().slice(-8);

    const productLines = cart
      .map((i, n) => `${n + 1}. ${i.name} | Qty: ${i.qty} | Price: ${money(i.price)} | Subtotal: ${money(i.price * i.qty)}`)
      .join("\n");

    const payload = {
      _subject: `New order ${id} from ${customer.name}`,
      order_id: id,
      customer_name: customer.name,
      email: customer.email, // used as reply-to
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
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.errors?.[0]?.message || "Could not send the order.");
      }
      setOrderId(id);
      setCart([]);
      setCustomer(EMPTY);
      setView("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSending(false);
    }
  };

  const Thumb = ({ p }: { p: Product }) => (
    <div className="thumb">{p.image ? <img src={p.image} alt={p.name} /> : <span>{p.emoji ?? "📦"}</span>}</div>
  );

  return (
    <div className="bs">
      <style>{css}</style>

      {/* ---------- NAVBAR ---------- */}
      <nav className="nav">
        <div className="brand" onClick={() => setView("products")}>
          <span className="logo">🛒</span>
          {SHOP_NAME}
        </div>
        <div className="links">
          <button onClick={() => setView("products")}>Home</button>
          <button onClick={() => setView("products")}>Products</button>
          <button className={`pill ${view === "cart" || view === "checkout" ? "on" : ""}`} onClick={() => setView("cart")}>
            Cart{count > 0 ? ` (${count})` : ""}
          </button>
        </div>
        <div className="user">Hi, {userName}</div>
      </nav>

      <div className="page">
        {/* ---------- PRODUCTS ---------- */}
        {view === "products" && (
          <>
            <h1>Products</h1>
            <p className="sub">Discover products. Shop with confidence.</p>
            <div className="pgrid">
              {PRODUCTS.map((p) => (
                <div className="card prod" key={p.id}>
                  <Thumb p={p} />
                  <h3>{p.name}</h3>
                  <div className="price">{money(p.price)}</div>
                  <button className="cta sm" onClick={() => addToCart(p)}>Add to cart</button>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ---------- CART ---------- */}
        {view === "cart" && (
          <>
            <div className="head">
              <div>
                <h1>Your Cart</h1>
                <p className="sub">Review your items before checkout.</p>
              </div>
              <button className="back" onClick={() => setView("products")}>← Continue Shopping</button>
            </div>

            {cart.length === 0 ? (
              <div className="card empty">Your cart is empty. Add a product to get started.</div>
            ) : (
              <div className="two">
                <div className="list">
                  {cart.map((i) => (
                    <div className="card item" key={i.id}>
                      <Thumb p={i} />
                      <div className="info">
                        <h3>{i.name}</h3>
                        <div className="price">{money(i.price)}</div>
                        <div className="qty">
                          <button onClick={() => changeQty(i.id, -1)} aria-label="Decrease quantity">-</button>
                          <span>{i.qty}</span>
                          <button onClick={() => changeQty(i.id, 1)} aria-label="Increase quantity">+</button>
                        </div>
                        <div className="subt">Subtotal: {money(i.price * i.qty)}</div>
                      </div>
                      <button className="remove" onClick={() => removeItem(i.id)}>Remove</button>
                    </div>
                  ))}
                </div>
                <div className="card summary">
                  <h2>Order Summary</h2>
                  <div className="srow"><span>Total Items:</span><span>{count}</span></div>
                  <div className="srow"><span>Total Amount:</span><span className="price">{money(total)}</span></div>
                  <hr />
                  <button className="cta" onClick={() => setView("checkout")}>Proceed to Checkout →</button>
                </div>
              </div>
            )}
          </>
        )}

        {/* ---------- CHECKOUT ---------- */}
        {view === "checkout" && (
          <>
            <div className="head">
              <div>
                <h1>Checkout</h1>
                <p className="sub">Enter your details to place the order.</p>
              </div>
              <button className="back" onClick={() => setView("cart")}>← Back to Cart</button>
            </div>

            <div className="two">
              <form className="card form" onSubmit={placeOrder}>
                <h2>Delivery Details</h2>
                <label>Full name<input name="name" value={customer.name} onChange={onField} required /></label>
                <label>Email<input type="email" name="email" value={customer.email} onChange={onField} required /></label>
                <label>Phone number<input type="tel" name="phone" value={customer.phone} onChange={onField} required /></label>
                <label>Address<input name="address" value={customer.address} onChange={onField} required /></label>
                <label>City<input name="city" value={customer.city} onChange={onField} required /></label>
                <label>Order notes (optional)<textarea name="notes" rows={3} value={customer.notes} onChange={onField} /></label>
                {error && <p className="error" role="alert">{error}</p>}
                <button className="cta" type="submit" disabled={sending || cart.length === 0}>
                  {sending ? "Placing order…" : "Place Order →"}
                </button>
              </form>

              <div className="card summary">
                <h2>Order Summary</h2>
                {cart.map((i) => (
                  <div className="srow" key={i.id}>
                    <span>{i.name} × {i.qty}</span>
                    <span>{money(i.price * i.qty)}</span>
                  </div>
                ))}
                <hr />
                <div className="srow"><span>Total Items:</span><span>{count}</span></div>
                <div className="srow"><span>Total Amount:</span><span className="price">{money(total)}</span></div>
              </div>
            </div>
          </>
        )}

        {/* ---------- SUCCESS ---------- */}
        {view === "done" && (
          <div className="card done">
            <div className="tick">✓</div>
            <h1>Order placed</h1>
            <p className="sub">
              Thank you! Your order number is <strong>{orderId}</strong>. We will contact you soon to confirm delivery.
            </p>
            <button className="cta" onClick={() => setView("products")}>Continue Shopping</button>
          </div>
        )}
      </div>

      <footer className="foot">© {new Date().getFullYear()} {SHOP_NAME}. All rights reserved.</footer>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  STYLES (matches your dark navy / cyan theme)                       */
/* ------------------------------------------------------------------ */
const css = `
.bs{--bg:#050a16;--card:#0a0f1c;--line:#1a2236;--text:#f2f6ff;--muted:#9aa7bd;--cyan:#00d0ff;--blue:#1565ff;--green:#10d98a;--pink:#ff2e7e;
  min-height:100vh;color:var(--text);font-family:system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;
  background:radial-gradient(ellipse at 20% 0%,#0a1f5c 0%,#07122e 35%,var(--bg) 75%);display:flex;flex-direction:column}
.bs *{box-sizing:border-box}
.bs button{font:inherit;cursor:pointer}
.bs button:focus-visible,.bs input:focus-visible,.bs textarea:focus-visible{outline:2px solid var(--cyan);outline-offset:2px}

.nav{display:flex;align-items:center;justify-content:space-between;gap:16px;padding:14px 32px;background:rgba(5,10,22,.92);border-bottom:1px solid var(--line);position:sticky;top:0;z-index:5}
.brand{display:flex;align-items:center;gap:12px;font-weight:800;font-size:1.25rem;cursor:pointer}
.logo{width:44px;height:44px;border-radius:12px;display:grid;place-items:center;background:linear-gradient(135deg,var(--blue),var(--cyan));box-shadow:0 0 18px rgba(0,208,255,.35)}
.links{display:flex;gap:10px;align-items:center}
.links button{background:none;border:1px solid transparent;color:var(--text);padding:8px 14px;border-radius:10px;font-weight:600;font-size:.9rem}
.links button:hover{color:var(--cyan)}
.links .pill.on{border-color:var(--blue);background:rgba(21,101,255,.18);color:var(--cyan)}
.user{font-weight:600;font-size:.9rem}

.page{flex:1;width:100%;max-width:1240px;margin:0 auto;padding:36px 32px 56px}
h1{margin:0;font-size:2.1rem;font-weight:800}
h2{margin:0 0 18px;font-size:1.4rem}
.sub{margin:6px 0 0;color:var(--muted)}
.head{display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:30px;gap:12px;flex-wrap:wrap}
.back{background:none;border:0;color:var(--cyan);font-size:1.05rem}
.two{display:grid;grid-template-columns:1fr 440px;gap:32px;align-items:start}

.card{background:var(--card);border:1px solid var(--line);border-radius:18px;padding:22px}
.price{color:var(--green);font-weight:700;font-size:1.1rem}
.thumb{width:100px;height:100px;border-radius:12px;background:#fff;display:grid;place-items:center;overflow:hidden;flex-shrink:0;font-size:2.8rem}
.thumb img{width:100%;height:100%;object-fit:cover}

.list{display:flex;flex-direction:column;gap:20px}
.item{display:flex;align-items:center;gap:20px}
.info{flex:1;display:flex;flex-direction:column;gap:8px}
.info h3,.prod h3{margin:0;font-size:1.1rem}
.qty{display:flex;align-items:center;gap:14px}
.qty button{width:36px;height:36px;border-radius:9px;border:1px solid var(--line);background:#141c30;color:var(--text);font-size:1rem}
.qty button:hover{border-color:var(--blue)}
.qty span{min-width:14px;text-align:center;font-weight:700}
.subt{color:var(--muted);font-size:.88rem}
.remove{padding:12px 20px;border-radius:12px;border:1px solid #6b1840;background:rgba(255,46,126,.08);color:var(--pink);font-size:1rem}
.remove:hover{background:rgba(255,46,126,.18)}

.summary h2{font-size:1.5rem}
.srow{display:flex;justify-content:space-between;gap:12px;padding:8px 0;font-size:1.02rem}
.summary hr{border:0;border-top:1px solid var(--line);margin:16px 0 20px}
.cta{width:100%;padding:18px;border:0;border-radius:14px;color:#fff;font-weight:600;font-size:1.1rem;background:linear-gradient(90deg,#1565ff,#00d4ff);box-shadow:0 8px 24px rgba(21,101,255,.3)}
.cta:hover:not(:disabled){filter:brightness(1.1)}
.cta:disabled{opacity:.6;cursor:not-allowed}
.cta.sm{padding:11px;font-size:.95rem;margin-top:6px}

.pgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:22px;margin-top:28px}
.prod{display:flex;flex-direction:column;gap:8px}
.prod .thumb{width:100%;height:170px}

.form{display:flex;flex-direction:column;gap:16px}
.form h2{margin-bottom:4px}
.form label{display:flex;flex-direction:column;gap:7px;font-size:.9rem;font-weight:600;color:var(--muted)}
.form input,.form textarea{padding:13px 14px;border-radius:11px;border:1px solid var(--line);background:#060b17;color:var(--text);font:inherit;font-weight:400}
.form input:focus,.form textarea:focus{border-color:var(--blue)}
.error{margin:0;padding:12px 14px;border-radius:10px;color:#ff8fb3;background:rgba(255,46,126,.1);border:1px solid #6b1840;font-size:.9rem}

.empty{text-align:center;color:var(--muted);padding:48px}
.done{max-width:520px;margin:40px auto;text-align:center;display:flex;flex-direction:column;align-items:center;gap:10px;padding:44px 32px}
.done .cta{margin-top:14px}
.tick{width:68px;height:68px;border-radius:50%;display:grid;place-items:center;font-size:2rem;background:linear-gradient(135deg,var(--blue),var(--cyan))}
.foot{border-top:1px solid var(--line);text-align:center;color:var(--muted);font-size:.85rem;padding:22px}

@media (max-width:900px){
  .two{grid-template-columns:1fr}
  .nav{padding:12px 16px;flex-wrap:wrap}
  .page{padding:24px 16px 40px}
  .item{flex-wrap:wrap}
  .remove{width:100%}
}
`;
