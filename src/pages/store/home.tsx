
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  Beef,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Truck,
  ShoppingCart,
  ShoppingBag,
  CreditCard,
  PackageCheck,
} from "lucide-react";
import { motion } from "motion/react";
import api from "../../api/api";

interface Category {
  id: string;
  name: string;
  image?: string;
  description?: string;
}

const benefits = [
  {
    icon: ShoppingBag,
    title: "Easy Online Shopping",
    description: "Explore products and shop conveniently from anywhere.",
  },
  {
    icon: ShieldCheck,
    title: "Secure Shopping",
    description: "Enjoy a simple and secure online shopping experience.",
  },
  {
    icon: Truck,
    title: "Home Delivery",
    description: "Get your orders delivered conveniently to your doorstep.",
  },
  {
    icon: Clock,
    title: "Quick Ordering",
    description: "Choose your products and place your order in a few steps.",
  },
];

const categoryImages = [
  "https://images.unsplash.com/photo-1607082349566-187342175e2f?w=900&q=85",
  "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=900&q=85",
  "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=900&q=85",
];

export default function Home() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get("/categories/");
        const data = response.data.data || response.data;

        setCategories(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to load categories:", error);
      } finally {
        setLoading(false);
      }
    };

    void fetchCategories();
  }, []);

  return (
    <div className="overflow-hidden bg-[#FBF8F3] text-[#351D1D]">
      {/* Announcement */}
      <div className="bg-[#8B2635] px-4 py-2.5 text-center text-[10px] font-bold uppercase tracking-[0.18em] text-white sm:text-xs">
        Welcome to Butcher Shop · Quality You Can Taste
      </div>

      {/* Hero */}
      <section className="relative mx-auto max-w-[1600px] px-4 py-8 sm:px-8 lg:px-12 lg:py-12">
        <div className="relative min-h-[560px] overflow-hidden rounded-[28px] bg-[#351D1D] sm:min-h-[620px]">
          <img
            src="https://images.unsplash.com/photo-1607082349566-187342175e2f?w=1800&q=90"
            alt="Modern online shopping experience"
            className="absolute inset-0 h-full w-full object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/65 to-black/20" />

          <div className="relative z-10 flex min-h-[560px] items-center px-7 py-16 sm:min-h-[620px] sm:px-14 lg:px-20">
            <motion.div
              initial={{ opacity: 0, x: -25 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              className="max-w-2xl"
            >
              <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white backdrop-blur-md">
                <span className="h-2 w-2 rounded-full bg-[#D8A36C]" />
                Your Online Shopping Destination
              </div>

              <h1 className="text-5xl font-black leading-[1.08] tracking-tight text-white sm:text-6xl lg:text-7xl">
                Shop smarter.
                <br />
                <span className="text-[#D8A36C]">
                  Enjoy better.
                </span>
              </h1>

              <p className="mt-7 max-w-lg text-sm leading-7 text-white/75 sm:text-base">
                Discover quality products, explore our collections, and
                order your favorites online. Butcher Shop makes shopping
                simple, convenient, and accessible from anywhere.
              </p>

              <div className="mt-9 flex flex-wrap gap-4">
                <Link
                  to="/product"
                  className="group inline-flex items-center gap-3 rounded-full bg-[#8B2635] px-7 py-4 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-[#A73545]"
                >
                  Explore Products
                  <ArrowRight
                    size={16}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </Link>

                <Link
                  to="/categories"
                  className="inline-flex items-center gap-3 rounded-full border border-white/50 bg-white/10 px-7 py-4 text-xs font-bold uppercase tracking-wider text-white backdrop-blur-sm transition hover:bg-white hover:text-[#351D1D]"
                >
                  Browse Categories
                </Link>
              </div>

              <div className="mt-12 flex flex-wrap items-center gap-6 border-t border-white/20 pt-7 text-white">
                <div>
                  <p className="text-xl font-black">Quality</p>
                  <p className="mt-1 text-[10px] uppercase tracking-widest text-white/55">
                    Product Selection
                  </p>
                </div>

                <div className="h-10 w-px bg-white/25" />

                <div>
                  <p className="text-xl font-black">Simple</p>
                  <p className="mt-1 text-[10px] uppercase tracking-widest text-white/55">
                    Online Ordering
                  </p>
                </div>

                <div className="h-10 w-px bg-white/25" />

                <div>
                  <p className="text-xl font-black">Convenient</p>
                  <p className="mt-1 text-[10px] uppercase tracking-widest text-white/55">
                    Home Delivery
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="absolute bottom-8 right-8 hidden items-center gap-3 text-white/70 lg:flex">
            <span className="h-px w-12 bg-white/50" />
            <span className="text-[10px] uppercase tracking-[0.25em]">
              Quality You Can Taste
            </span>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:px-12">
        <div className="grid gap-8 border-y border-[#E8DED3] py-10 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((item, index) => {
            const Icon = item.icon;

            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start gap-4"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#F4EEE6] text-[#8B2635]">
                  <Icon size={22} />
                </div>

                <div>
                  <h3 className="text-sm font-bold">{item.title}</h3>
                  <p className="mt-2 text-xs leading-6 text-[#927D70]">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-12">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-5">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#8B2635]">
              Find Your Favorites
            </span>

            <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
              Shop by category
            </h2>

            <p className="mt-3 text-sm text-[#927D70]">
              Browse our collections and discover products for your needs.
            </p>
          </div>

          <Link
            to="/categories"
            className="group inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#8B2635]"
          >
            View All Categories
            <ArrowUpRight
              size={16}
              className="transition-transform group-hover:-translate-y-1 group-hover:translate-x-1"
            />
          </Link>
        </div>

        {loading ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-80 animate-pulse rounded-2xl bg-[#F4EEE6]"
              />
            ))}
          </div>
        ) : categories.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category, index) => (
              <Link
                key={category.id}
                to={`/categories/${category.id}/products`}
                className="group relative h-[330px] overflow-hidden rounded-2xl bg-[#351D1D]"
              >
                <img
                  src={
                    category.image ||
                    categoryImages[index % categoryImages.length]
                  }
                  alt={`${category.name} collection`}
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />

                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-6 text-white">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#E1B78B]">
                      Explore Collection
                    </p>
                    <h3 className="mt-2 text-2xl font-black">
                      {category.name}
                    </h3>
                  </div>

                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#8B2635] transition group-hover:bg-[#8B2635] group-hover:text-white">
                    <ArrowUpRight size={20} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-[#E8DED3] bg-white p-12 text-center">
            <Beef size={35} className="mx-auto text-[#8B2635]" />
            <h3 className="mt-4 text-lg font-bold">
              Categories coming soon
            </h3>
            <p className="mt-2 text-sm text-[#927D70]">
              We're preparing our product collections for you.
            </p>
          </div>
        )}
      </section>

      {/* Online Shopping Banner */}
      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:px-12">
        <div className="relative overflow-hidden rounded-[28px] bg-[#8B2635]">
          <div className="absolute -right-16 -top-28 h-80 w-80 rounded-full border-[45px] border-white/5" />
          <div className="absolute -bottom-36 right-40 h-80 w-80 rounded-full border-[45px] border-white/5" />

          <div className="relative grid items-center gap-8 px-8 py-14 sm:px-14 lg:grid-cols-2 lg:px-20">
            <div className="text-white">
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#E7B88D]">
                A Better Way to Shop
              </span>

              <h2 className="mt-4 text-3xl font-black leading-tight sm:text-5xl">
                Your favorites,
                <br />
                just a few clicks away.
              </h2>

              <p className="mt-5 max-w-md text-sm leading-7 text-white/75">
                Browse products, add your favorites to the cart, and
                complete your order with a convenient online checkout.
              </p>

              <Link
                to="/product"
                className="mt-8 inline-flex items-center gap-3 rounded-full bg-[#FBF8F3] px-7 py-4 text-xs font-bold uppercase tracking-wider text-[#8B2635] transition hover:bg-white"
              >
                Start Shopping
                <ShoppingCart size={16} />
              </Link>
            </div>

            <div className="hidden justify-center lg:flex">
              <div className="relative flex h-64 w-64 items-center justify-center rounded-full border border-white/25">
                <div className="flex h-52 w-52 items-center justify-center rounded-full border border-white/20">
                  <div className="flex h-40 w-40 flex-col items-center justify-center rounded-full bg-white/10 text-center backdrop-blur-md">
                    <ShoppingBag size={42} className="text-[#E7B88D]" />
                    <span className="mt-3 text-xs font-black uppercase tracking-[0.2em] text-white">
                      Shop Online
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Online Shopping Experience */}
      <section className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-20 sm:px-8 lg:grid-cols-2 lg:px-12">
        <div className="relative h-[350px] overflow-hidden rounded-[24px] sm:h-[460px]">
          <img
            src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&q=85"
            alt="Customer completing an online shopping payment"
            className="h-full w-full object-cover"
          />
        </div>

        <div>
          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#8B2635]">
            About Butcher Shop
          </span>

          <h2 className="mt-4 text-3xl font-black leading-tight tracking-tight sm:text-5xl">
            Quality products.
            <span className="text-[#8B2635]"> Easy shopping.</span>
          </h2>

          <p className="mt-6 text-sm leading-8 text-[#927D70]">
            Butcher Shop makes buying quality meat products online simple
            and convenient. Explore our collections, choose your favorite
            products, and manage your order through one easy-to-use
            shopping platform.
          </p>

          <div className="mt-7 space-y-4">
            {[
              "Explore different product categories",
              "Add your favorite products to your cart",
              "Complete your order through online checkout",
            ].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <CheckCircle2
                  size={19}
                  className="shrink-0 text-[#8B2635]"
                />
                <span className="text-sm font-semibold text-[#6D5B52]">
                  {item}
                </span>
              </div>
            ))}
          </div>

          <Link
            to="/product"
            className="mt-9 inline-flex items-center gap-3 rounded-full bg-[#351D1D] px-7 py-4 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-[#8B2635]"
          >
            Discover Products
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* Shopping Process */}
      <section className="bg-[#F4EEE6] px-5 py-16 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#8B2635]">
              Simple Shopping Process
            </span>

            <h2 className="mt-3 text-3xl font-black sm:text-4xl">
              Shop in three easy steps
            </h2>

            <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-[#927D70]">
              Getting your favorite products is simple with Butcher Shop.
            </p>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {[
              {
                icon: ShoppingBag,
                number: "01",
                title: "Explore Products",
                description:
                  "Browse our collections and find the products you want.",
              },
              {
                icon: ShoppingCart,
                number: "02",
                title: "Add to Cart",
                description:
                  "Choose your products and add them to your shopping cart.",
              },
              {
                icon: PackageCheck,
                number: "03",
                title: "Place Your Order",
                description:
                  "Complete checkout and submit your order online.",
              },
            ].map((step, index) => {
              const Icon = step.icon;

              return (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.12 }}
                  className="rounded-2xl border border-[#E8DED3] bg-white p-8 text-center"
                >
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#F4EEE6] text-[#8B2635]">
                    <Icon size={28} />
                  </div>

                  <p className="mt-6 text-xs font-black tracking-[0.2em] text-[#8B2635]">
                    STEP {step.number}
                  </p>

                  <h3 className="mt-2 text-xl font-black">
                    {step.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-[#927D70]">
                    {step.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="border-t border-[#E8DED3] bg-[#FBF8F3] px-5 py-16 text-center">
        <CreditCard size={30} className="mx-auto text-[#8B2635]" />

        <h2 className="mt-5 text-2xl font-black sm:text-4xl">
          Ready to start shopping?
        </h2>

        <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-[#927D70]">
          Discover our product collections and enjoy a simple online
          shopping experience with Butcher Shop.
        </p>

        <Link
          to="/product"
          className="mt-7 inline-flex items-center gap-3 rounded-full bg-[#8B2635] px-8 py-4 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-[#A73545]"
        >
          Shop Our Products
          <ArrowRight size={16} />
        </Link>
      </section>
    </div>
  );
}
