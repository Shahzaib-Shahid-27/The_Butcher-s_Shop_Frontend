
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, ArrowLeft, Trash2, Edit3, Package } from "lucide-react";

const API_URL = import.meta.env.VITE_API_BASE_URL;

interface Product {
  id: string;
  name: string;
  description?: string | null;
  price: number | string;
  stock: number;
  image?: string | null;
  isActive?: boolean;
}

function getItems<T>(result: any): T[] {
  const data = result.data?.data ?? result.data;
  return Array.isArray(data) ? data : [];
}

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/products`);
      if (!response.ok) throw new Error("Failed to load products");

      const result = await response.json();
      setProducts(getItems<Product>(result));
    } catch {
      setError("Could not load products. Check your backend connection.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  async function deleteProduct(id: string) {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }

    try {
      const token = localStorage.getItem("accessToken");

      const response = await fetch(`${API_URL}/products/${id}`, {
        method: "DELETE",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (!response.ok) throw new Error("Delete failed");

      setProducts((current) => current.filter((item) => item.id !== id));
    } catch {
      setError("Could not delete product. Check your admin login and backend.");
    }
  }

  return (
    <section className="min-h-screen bg-[#FBF8F3] px-4 py-12 font-sans text-[#351D1D] sm:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E8DED3] pb-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#927D70]">
              Inventory Catalog
            </span>
            <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
              Manage Products
            </h1>
            <p className="mt-2 text-xs text-[#927D70]">
              View, edit, and manage your store products.
            </p>
          </div>

          <Link
            to="/admin/products/create"
            className="inline-flex items-center gap-2 rounded-xl bg-[#8B2635] px-5 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-md transition hover:bg-[#70202C]"
          >
            <Plus size={16} /> Create Product
          </Link>
        </div>

        {error && (
          <p className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-xs font-medium text-red-600">
            {error}
          </p>
        )}

        <div className="mt-8 overflow-x-auto rounded-2xl border border-[#E8DED3] bg-white shadow-sm">
          {loading ? (
            <p className="p-12 text-center text-xs font-medium text-[#927D70]">
              Loading products...
            </p>
          ) : products.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-sm font-bold text-[#351D1D]">
                No products found.
              </p>
              <p className="mt-2 text-xs text-[#927D70]">
                Create your first product to get started.
              </p>
            </div>
          ) : (
            <table className="w-full min-w-175 border-collapse text-left">
              <thead className="border-b border-[#E8DED3] bg-[#F4EEE6] text-[11px] uppercase tracking-wider text-[#6D5B52]">
                <tr>
                  <th className="p-4 font-bold">Product</th>
                  <th className="p-4 font-bold">Price</th>
                  <th className="p-4 font-bold">Stock</th>
                  <th className="p-4 font-bold">Status</th>
                  <th className="p-4 text-right font-bold">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#E8DED3] text-xs">
                {products.map((product) => (
                  <tr
                    key={product.id}
                    className="transition hover:bg-[#FBF8F3]"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        {product.image ? (
                          <img
                            src={product.image}
                            alt={product.name}
                            className="h-11 w-11 rounded-xl border border-[#E8DED3] object-cover"
                          />
                        ) : (
                          <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#E8DED3] bg-[#F4EEE6]">
                            <Package size={17} className="text-[#927D70]" />
                          </div>
                        )}

                        <div>
                          <p className="font-bold text-[#351D1D]">
                            {product.name}
                          </p>
                          <p className="max-w-xs truncate text-[11px] text-[#927D70]">
                            {product.description || "No description"}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="p-4 font-bold text-[#8B2635]">
                      ${Number(product.price).toFixed(2)}
                    </td>

                    <td className="p-4 font-medium text-[#6D5B52]">
                      {product.stock} units
                    </td>

                    <td className="p-4">
                      <span
                        className={
                          product.isActive === false
                            ? "rounded-full border border-red-200 bg-red-50 px-3 py-1 text-[10px] font-bold uppercase text-red-600"
                            : "rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[10px] font-bold uppercase text-emerald-700"
                        }
                      >
                        {product.isActive === false ? "Inactive" : "Active"}
                      </span>
                    </td>

                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <Link
                          to={`/editproduct/${product.id}`}
                          className="inline-flex items-center gap-1 font-semibold text-[#6D5B52] transition hover:text-[#8B2635]"
                        >
                          <Edit3 size={14} /> Edit
                        </Link>

                        <button
                          type="button"
                          onClick={() => deleteProduct(product.id)}
                          className="inline-flex items-center gap-1 font-semibold text-red-500 transition hover:text-red-700"
                        >
                          <Trash2 size={14} /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <Link
          to="/admin"
          className="mt-6 inline-flex items-center gap-2 text-xs font-bold text-[#6D5B52] transition hover:text-[#8B2635]"
        >
          <ArrowLeft size={14} /> Back to dashboard
        </Link>
      </div>
    </section>
  );
}
