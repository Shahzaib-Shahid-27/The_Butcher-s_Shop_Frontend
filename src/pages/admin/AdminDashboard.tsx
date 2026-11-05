
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Package,
  FolderTree,
  Plus,
  Store,
  ArrowRight,
} from "lucide-react";

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
    {
      title: "Products",
      count: products,
      link: "/admin/products",
      icon: Package,
      description: "Manage your store inventory and products.",
    },
    {
      title: "Categories",
      count: categories,
      link: "/admin/categories",
      icon: FolderTree,
      description: "Organize your products into categories.",
    },
  ];

  return (
    <section className="min-h-screen bg-[#FBF8F3] px-4 py-12 font-sans text-[#351D1D] sm:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="border-b border-[#E8DED3] pb-6">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#927D70]">
            Control Center
          </span>

          <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
            Admin Dashboard
          </h1>

          <p className="mt-2 text-xs text-[#927D70]">
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
                className="group rounded-2xl border border-[#E8DED3] bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-[#8B2635] hover:shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold uppercase tracking-wider text-[#927D70]">
                    {card.title}
                  </p>

                  <div className="rounded-xl border border-[#E8DED3] bg-[#F4EEE6] p-3 text-[#8B2635] transition group-hover:border-[#8B2635] group-hover:bg-[#8B2635] group-hover:text-white">
                    <IconComponent size={20} />
                  </div>
                </div>

                <p className="mt-5 text-4xl font-black tracking-tight text-[#351D1D]">
                  {card.count}
                </p>

                <p className="mt-2 text-xs text-[#927D70]">
                  {card.description}
                </p>

                <p className="mt-5 inline-flex items-center gap-2 text-xs font-bold text-[#8B2635] transition group-hover:translate-x-1">
                  Manage {card.title.toLowerCase()}
                  <ArrowRight size={14} />
                </p>
              </Link>
            );
          })}
        </div>

        <div className="mt-10 rounded-2xl border border-[#E8DED3] bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-6">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8B2635]">
              Store Management
            </span>
            <h2 className="mt-2 text-xl font-black tracking-tight text-[#351D1D]">
              Quick Actions
            </h2>
            <p className="mt-1 text-xs text-[#927D70]">
              Quickly access your store management tools.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              to="/admin/products/create"
              className="inline-flex items-center gap-2 rounded-xl bg-[#8B2635] px-5 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-md transition hover:bg-[#70202C]"
            >
              <Plus size={15} /> Create Product
            </Link>

            <Link
              to="/createcategory"
              className="inline-flex items-center gap-2 rounded-xl border border-[#E8DED3] bg-[#F4EEE6] px-5 py-3 text-xs font-bold uppercase tracking-wider text-[#351D1D] transition hover:border-[#8B2635] hover:text-[#8B2635]"
            >
              <Plus size={15} /> Create Category
            </Link>

            <Link
              to="/product"
              className="inline-flex items-center gap-2 rounded-xl border border-[#E8DED3] bg-white px-5 py-3 text-xs font-bold uppercase tracking-wider text-[#6D5B52] transition hover:border-[#8B2635] hover:text-[#8B2635]"
            >
              <Store size={15} /> View Store Products
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
