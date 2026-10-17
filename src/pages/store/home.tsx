import { Link } from "react-router-dom";
import { ShoppingBag, Layers, ShieldCheck, ArrowRight } from "lucide-react";

const features = [
  {
    number: "01",
    title: "Explore Products",
    description: "Browse your products in a clean, modern shopping experience.",
    icon: ShoppingBag,
  },
  {
    number: "02",
    title: "Organize Categories",
    description: "Find products more easily with organized categories.",
    icon: Layers,
  },
  {
    number: "03",
    title: "Simple Shopping",
    description: "Add products to your cart and adjust quantities whenever you need.",
    icon: ShieldCheck,
  },
];

export default function Home() {
  return (
    <div className="relative min-h-screen bg-white font-sans text-neutral-900 selection:bg-neutral-900 selection:text-white">
      
      {/* Top Banner */}
      <div className="absolute top-0 inset-x-0 bg-neutral-900 text-white text-[11px] py-2 px-4 text-center font-medium tracking-wide">
        Welcome to The Butcher's Shop — Premium Quality & Cuts
      </div>

      {/* Hero Section */}
      <section className="relative mx-auto grid min-h-[75vh] max-w-7xl items-center gap-12 px-6 py-20 lg:grid-cols-2 lg:px-8 mt-6">
        <div className="relative z-10">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-neutral-50 px-4 py-1.5 text-xs font-bold tracking-widest text-neutral-700 uppercase shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-neutral-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-neutral-900" />
            </span>
            Modern Shopping Experience
          </div>

          <h1 className="text-4xl font-black leading-tight tracking-tight text-neutral-900 sm:text-5xl lg:text-6xl">
            Find what you <br />
            <span className="text-neutral-400">love to shop.</span>
          </h1>

          <p className="mt-6 max-w-xl text-xs sm:text-sm leading-relaxed text-neutral-600">
            Discover premium products, explore organized categories, and keep everything you want in one convenient shopping cart.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              to="/product"
              className="group inline-flex items-center gap-2 rounded-xl bg-neutral-900 px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-white shadow-md hover:bg-neutral-800 transition"
            >
              Explore Products
              <ArrowRight size={15} className="transition-transform duration-200 group-hover:translate-x-1" />
            </Link>

            <Link
              to="/categories"
              className="rounded-xl border border-neutral-200 bg-white px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-neutral-700 transition hover:border-neutral-900 hover:text-neutral-900 shadow-sm"
            >
              Browse Categories
            </Link>
          </div>

          {/* Stats Bar */}
          <div className="mt-12 flex flex-wrap gap-8 border-t border-neutral-200 pt-8 text-xs">
            <div>
              <p className="text-2xl font-black text-neutral-900">Explore</p>
              <p className="mt-1 text-[11px] text-neutral-500 uppercase tracking-wider">Products Catalog</p>
            </div>
            <div className="h-10 w-px bg-neutral-200" />
            <div>
              <p className="text-2xl font-black text-neutral-900">Organize</p>
              <p className="mt-1 text-[11px] text-neutral-500 uppercase tracking-wider">Custom Categories</p>
            </div>
            <div className="h-10 w-px bg-neutral-200" />
            <div>
              <p className="text-2xl font-black text-neutral-900">Shop</p>
              <p className="mt-1 text-[11px] text-neutral-500 uppercase tracking-wider">Cart & Items</p>
            </div>
          </div>
        </div>

        {/* Right Hero Interactive Mockup */}
        <div className="relative mx-auto w-full max-w-lg">
          <div className="rounded-2xl border border-neutral-200 bg-neutral-50/50 p-6 shadow-xl shadow-neutral-100 sm:p-8">
            <div className="flex items-center gap-2 border-b border-neutral-200 pb-4">
              <span className="h-3 w-3 rounded-full bg-neutral-300" />
              <span className="h-3 w-3 rounded-full bg-neutral-300" />
              <span className="h-3 w-3 rounded-full bg-neutral-300" />
              <div className="ml-4 h-5 flex-1 rounded-full bg-white border border-neutral-200" />
            </div>

            <div className="grid grid-cols-2 gap-4 py-6">
              <div className="flex min-h-48 flex-col items-center justify-center rounded-xl border border-neutral-200 bg-white p-5 text-center shadow-sm">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-neutral-900 text-white shadow-sm mb-3">
                  <ShoppingBag size={24} />
                </div>
                <p className="text-xs font-bold text-neutral-900">Shop your style</p>
                <p className="mt-1 text-[11px] text-neutral-500">Discover something new</p>
              </div>

              <div className="flex flex-col justify-center gap-3">
                <div className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm">
                  <div className="mb-2 flex items-center gap-2">
                    <span className="rounded-lg bg-neutral-100 p-1.5 text-neutral-900 text-xs font-bold">✦</span>
                    <span className="text-xs font-bold text-neutral-900">Products</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-neutral-100">
                    <div className="h-1.5 w-4/5 rounded-full bg-neutral-900" />
                  </div>
                </div>

                <div className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm">
                  <div className="mb-2 flex items-center gap-2">
                    <span className="rounded-lg bg-neutral-100 p-1.5 text-neutral-900 text-xs font-bold">◈</span>
                    <span className="text-xs font-bold text-neutral-900">Categories</span>
                  </div>
                  <div className="flex gap-1.5">
                    <span className="h-4 flex-1 rounded bg-neutral-900" />
                    <span className="h-4 flex-1 rounded bg-neutral-500" />
                    <span className="h-4 flex-1 rounded bg-neutral-300" />
                  </div>
                </div>
              </div>
            </div>

            <Link
              to="/cart"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-neutral-900 py-3.5 text-xs font-bold uppercase tracking-wider text-white shadow-md transition hover:bg-neutral-800"
            >
              <ShoppingBag size={15} /> View Your Cart
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Section */}
      <section className="mx-auto max-w-7xl px-6 pb-20 lg:px-8">
        <div className="mb-8 rounded-2xl border border-neutral-200 bg-neutral-50/50 p-6 sm:p-8">
          <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
            Built for Easy Shopping
          </span>
          <h2 className="mt-1 text-2xl font-black text-neutral-900 tracking-tight sm:text-3xl">
            Everything you need, in one place
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div
                key={feature.number}
                className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm hover:border-neutral-900 transition"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2.5 rounded-xl bg-neutral-50 border border-neutral-200 text-neutral-900">
                    <IconComponent size={20} />
                  </div>
                  <span className="text-xs font-mono font-bold text-neutral-400">{feature.number}</span>
                </div>
                <h3 className="text-base font-bold text-neutral-900">{feature.title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-neutral-500">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}