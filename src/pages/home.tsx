import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const features = [
  {
    number: "01",
    title: "Explore Products",
    description: "Browse your products in a clean, modern shopping experience.",
    color: "from-blue-500/20 to-cyan-400/5",
    icon: "✦",
  },
  {
    number: "02",
    title: "Organize Categories",
    description: "Find products more easily with organized categories.",
    color: "from-violet-500/20 to-blue-500/5",
    icon: "◈",
  },
  {
    number: "03",
    title: "Simple Shopping",
    description: "Add products to your cart and adjust quantities whenever you need.",
    color: "from-cyan-400/20 to-blue-500/5",
    icon: "🛒",
  },
];

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#030712] font-sans text-slate-100 selection:bg-cyan-500 selection:text-white">
      {/* Background glow effects */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-20 top-20 h-72 w-72 rounded-3xl bg-blue-600/10 blur-3xl" />
        <div className="absolute right-10 top-1/3 h-80 w-80 rounded-3xl bg-cyan-500/10 blur-3xl" />
        <div className="absolute -bottom-20 left-1/3 h-96 w-96 rounded-3xl bg-blue-700/10 blur-3xl" />
      </div>

      {/* Hero Section */}
      <section className="relative mx-auto grid min-h-[80vh] max-w-7xl items-center gap-12 px-6 py-12 lg:grid-cols-2 lg:px-8">
        <motion.div
          initial={{ opacity: 0, x: -25 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10"
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-900/40 bg-[#060b19] px-4 py-2 text-xs font-semibold text-cyan-400">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-500" />
            </span>
            Your modern shopping experience
          </div>

          <h1 className="text-5xl font-black leading-tight tracking-tight text-white sm:text-6xl lg:text-7xl">
            Find what you{" "}
            <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-violet-400 bg-clip-text text-transparent">
              love to shop.
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-sm leading-relaxed text-slate-400 sm:text-base">
            Discover products, explore categories, and keep everything you want in one convenient shopping cart.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              to="/product"
              className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-400 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-cyan-500/25 transition duration-200 hover:brightness-110"
            >
              Explore Products
              <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
            </Link>

            <Link
              to="/categories"
              className="rounded-xl border border-slate-800 bg-[#0a1128]/80 px-6 py-3.5 text-sm font-semibold text-slate-300 transition hover:border-slate-700 hover:text-white"
            >
              Browse Categories
            </Link>
          </div>

          {/* Stats Bar */}
          <div className="mt-12 flex flex-wrap gap-8 border-t border-slate-800/80 pt-8 text-sm">
            <div>
              <p className="text-2xl font-extrabold text-white">Explore</p>
              <p className="mt-1 text-xs text-slate-400">Products Catalog</p>
            </div>
            <div className="h-10 w-px bg-slate-800" />
            <div>
              <p className="text-2xl font-extrabold text-white">Organize</p>
              <p className="mt-1 text-xs text-slate-400">Custom Categories</p>
            </div>
            <div className="h-10 w-px bg-slate-800" />
            <div>
              <p className="text-2xl font-extrabold text-white">Shop</p>
              <p className="mt-1 text-xs text-slate-400">Cart & Items</p>
            </div>
          </div>
        </motion.div>

        {/* Right Hero Interactive Mockup */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="relative mx-auto w-full max-w-lg"
        >
          <div className="rounded-3xl border border-slate-800/80 bg-[#0a1128]/90 p-6 shadow-2xl shadow-black/50 backdrop-blur-xl sm:p-8">
            <div className="flex items-center gap-2 border-b border-slate-800/60 pb-4">
              <span className="h-3 w-3 rounded-full bg-rose-500" />
              <span className="h-3 w-3 rounded-full bg-amber-500" />
              <span className="h-3 w-3 rounded-full bg-emerald-500" />
              <div className="ml-4 h-6 flex-1 rounded-full bg-[#060b19]" />
            </div>

            <div className="grid grid-cols-2 gap-4 py-6">
              <div className="flex min-h-48 flex-col items-center justify-center rounded-2xl border border-blue-900/40 bg-[#060b19] p-5 text-center">
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-400 text-3xl shadow-lg shadow-cyan-500/20"
                >
                  🛍️
                </motion.div>
                <p className="mt-4 text-sm font-bold text-white">Shop your style</p>
                <p className="mt-1 text-xs text-slate-400">Discover something new</p>
              </div>

              <div className="flex flex-col justify-center gap-3">
                <div className="rounded-2xl border border-blue-900/40 bg-[#060b19] p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <span className="rounded-lg bg-blue-500/20 p-1.5 text-xs text-cyan-300">✦</span>
                    <span className="text-xs font-bold text-white">Products</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-slate-800">
                    <div className="h-1.5 w-4/5 rounded-full bg-gradient-to-r from-blue-600 to-cyan-400" />
                  </div>
                </div>

                <div className="rounded-2xl border border-blue-900/40 bg-[#060b19] p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <span className="rounded-lg bg-cyan-400/20 p-1.5 text-xs text-cyan-300">◈</span>
                    <span className="text-xs font-bold text-white">Categories</span>
                  </div>
                  <div className="flex gap-1.5">
                    <span className="h-5 flex-1 rounded-md bg-blue-600" />
                    <span className="h-5 flex-1 rounded-md bg-cyan-400" />
                    <span className="h-5 flex-1 rounded-md bg-violet-600" />
                  </div>
                </div>
              </div>
            </div>

            <Link
              to="/cart"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-400 py-3.5 text-sm font-bold text-white shadow-lg shadow-cyan-500/20 transition hover:brightness-110"
            >
              🛒 View Your Cart
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Feature Section */}
      <section className="mx-auto max-w-7xl px-6 pb-20 lg:px-8">
        <div className="mb-8 rounded-3xl border border-slate-800/80 bg-[#0a1128]/80 p-6 backdrop-blur-xl sm:p-8">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-400">
            Built for Easy Shopping
          </p>
          <h2 className="mt-1 text-2xl font-extrabold text-white sm:text-3xl">
            Everything you need, in one place
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {features.map((feature, index) => (
            <motion.div
              key={feature.number}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="rounded-3xl border border-slate-800/80 bg-[#0a1128]/90 p-6 shadow-xl backdrop-blur-xl"
            >
              <div className="flex items-center justify-between">
                <span className="text-2xl text-cyan-400">{feature.icon}</span>
                <span className="text-xs font-mono text-slate-500">{feature.number}</span>
              </div>
              <h3 className="mt-5 text-lg font-bold text-white">{feature.title}</h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-400">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}