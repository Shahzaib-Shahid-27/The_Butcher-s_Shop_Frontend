import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Package, FolderTree, Plus, Store, ArrowRight } from "lucide-react";

const API_URL = import.meta.env.VITE_API_BASE_URL;

async function getCount(endpoint: string): Promise<number> {
  const response = await fetch(`${API_URL}${endpoint}`);
  if (!response.ok) throw new Error("Could not load data");

  const result = await response.json();
  const items = result.data?.data ?? result.data;

  return Array.isArray(items) ? items.length : 0;
}

export default function AdminDashboard() {
  const [products, setProducts] = useState(0);
  const [categories, setCategories] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDashboard() {
      try {
        const [productCount, categoryCount] = await Promise.all([
          getCount("/products"),
          getCount("/categories"),
        ]);

        setProducts(productCount);
        setCategories(categoryCount);
      } catch {
        setError("Unable to load dashboard statistics. Check your API URL.");
      }
    }

    loadDashboard();
  }, []);

  const cards = [
    { title: "Products", count: products, link: "/admin/products", icon: Package },
    { title: "Categories", count: categories, link: "/admin/categories", icon: FolderTree },
  ];

  return (
    <section className="min-h-screen bg-white px-4 py-12 text-neutral-900 sm:px-8 font-sans">
      <div className="mx-auto max-w-7xl">
        <div className="border-b border-neutral-100 pb-6">
          <span className="text-xs font-bold tracking-widest text-neutral-400 uppercase">Control Center</span>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight mt-1">Admin Dashboard</h1>
          <p className="mt-1 text-xs text-neutral-500">
            Manage your store inventory, catalog products, and categories.
          </p>
        </div>

        {error && (
          <p className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-xs font-medium text-red-600">
            {error}
          </p>
        )}

        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          {cards.map((card) => {
            const IconComponent = card.icon;
            return (
              <Link
                key={card.title}
                to={card.link}
                className="group rounded-2xl border border-neutral-200 bg-neutral-50/50 p-6 transition hover:border-neutral-900 hover:bg-white shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold uppercase tracking-wider text-neutral-500">{card.title}</p>
                  <div className="p-2.5 rounded-xl bg-white border border-neutral-200 text-neutral-900 shadow-sm group-hover:bg-neutral-900 group-hover:text-white transition">
                    <IconComponent size={18} />
                  </div>
                </div>
                <p className="mt-4 text-4xl font-black tracking-tight">{card.count}</p>
                <p className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-neutral-900 transition group-hover:translate-x-1">
                  Manage {card.title.toLowerCase()} <ArrowRight size={14} />
                </p>
              </Link>
            );
          })}
        </div>

        <div className="mt-10 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
          <h2 className="text-base font-bold tracking-tight mb-4">Quick Actions</h2>

          <div className="flex flex-wrap gap-3">
            <Link
              to="/admin/products/create"
              className="inline-flex items-center gap-2 rounded-xl bg-neutral-900 px-5 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-md hover:bg-neutral-800 transition"
            >
              <Plus size={15} /> Create Product
            </Link>

            <Link
              to="/createcategory"
              className="inline-flex items-center gap-2 rounded-xl border border-neutral-200 bg-neutral-50 px-5 py-3 text-xs font-bold uppercase tracking-wider text-neutral-900 hover:bg-neutral-100 transition shadow-sm"
            >
              <Plus size={15} /> Create Category
            </Link>

            <Link
              to="/product"
              className="inline-flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-5 py-3 text-xs font-bold uppercase tracking-wider text-neutral-700 hover:border-neutral-900 hover:text-neutral-900 transition shadow-sm"
            >
              <Store size={15} /> View Store Products
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}