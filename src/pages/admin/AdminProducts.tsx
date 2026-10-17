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
        headers: token
          ? { Authorization: `Bearer ${token}` }
          : {},
      });

      if (!response.ok) {
        throw new Error("Delete failed");
      }

      setProducts((current) => current.filter((item) => item.id !== id));
    } catch {
      setError("Could not delete product. Check your admin login and backend.");
    }
  }

  return (
    <section className="min-h-screen bg-white px-4 py-12 text-neutral-900 sm:px-8 font-sans">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-neutral-100 pb-6">
          <div>
            <span className="text-xs font-bold tracking-widest text-neutral-400 uppercase">Inventory Catalog</span>
            <h1 className="text-3xl font-black tracking-tight mt-1">Manage Products</h1>
          </div>

          <Link
            to="/admin/products/create"
            className="inline-flex items-center gap-2 rounded-xl bg-neutral-900 px-5 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-md hover:bg-neutral-800 transition"
          >
            <Plus size={16} /> Create Product
          </Link>
        </div>

        {error && (
          <p className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-xs font-medium text-red-600">
            {error}
          </p>
        )}

        <div className="mt-8 overflow-x-auto rounded-2xl border border-neutral-200 bg-white shadow-sm">
          {loading ? (
            <p className="p-12 text-center text-xs font-medium text-neutral-400">Loading products...</p>
          ) : products.length === 0 ? (
            <p className="p-12 text-center text-xs font-medium text-neutral-400">
              No products found. Create your first product.
            </p>
          ) : (
            <table className="w-full min-w-[700px] text-left border-collapse">
              <thead className="bg-neutral-50 text-[11px] uppercase tracking-wider text-neutral-500 border-b border-neutral-200">
                <tr>
                  <th className="p-4 font-semibold">Product</th>
                  <th className="p-4 font-semibold">Price</th>
                  <th className="p-4 font-semibold">Stock</th>
                  <th className="p-4 font-semibold">Status</th>
                  <th className="p-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-neutral-100 text-xs">
                {products.map((product) => (
                  <tr
                    key={product.id}
                    className="hover:bg-neutral-50/50 transition"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        {product.image ? (
                          <img
                            src={product.image}
                            alt={product.name}
                            className="h-10 w-10 rounded-lg object-cover border border-neutral-200"
                          />
                        ) : (
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-100 border border-neutral-200">
                            <Package size={16} className="text-neutral-400" />
                          </div>
                        )}

                        <div>
                          <p className="font-semibold text-neutral-900">{product.name}</p>
                          <p className="max-w-xs truncate text-[11px] text-neutral-500">
                            {product.description || "No description"}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="p-4 font-semibold text-neutral-900">
                      ${Number(product.price).toFixed(2)}
                    </td>

                    <td className="p-4 text-neutral-700 font-medium">{product.stock} units</td>

                    <td className="p-4">
                      <span
                        className={
                          product.isActive === false
                            ? "rounded-full bg-red-50 border border-red-200 px-3 py-1 text-[10px] font-bold text-red-600 uppercase"
                            : "rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-[10px] font-bold text-emerald-700 uppercase"
                        }
                      >
                        {product.isActive === false ? "Inactive" : "Active"}
                      </span>
                    </td>

                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <Link
                          to={`/editproduct/${product.id}`}
                          className="inline-flex items-center gap-1 text-neutral-600 hover:text-neutral-900 font-semibold transition"
                        >
                          <Edit3 size={14} /> Edit
                        </Link>

                        <button
                          type="button"
                          onClick={() => deleteProduct(product.id)}
                          className="inline-flex items-center gap-1 text-red-500 hover:text-red-700 font-semibold transition"
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
          className="mt-6 inline-flex items-center gap-2 text-xs font-bold text-neutral-600 hover:text-neutral-900 transition"
        >
          <ArrowLeft size={14} /> Back to dashboard
        </Link>
      </div>
    </section>
  );
}