
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, ArrowLeft, Trash2, Edit3 } from "lucide-react";

const API_URL = import.meta.env.VITE_API_BASE_URL;

interface Category {
  id: string;
  name: string;
  description?: string | null;
  image?: string | null;
  isActive?: boolean;
}

function getItems<T>(result: any): T[] {
  const data = result.data?.data ?? result.data;
  return Array.isArray(data) ? data : [];
}

export default function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/categories`);
      if (!response.ok) throw new Error("Failed to load categories");

      const result = await response.json();
      setCategories(getItems<Category>(result));
    } catch {
      setError("Could not load categories. Check your backend connection.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  async function deleteCategory(id: string) {
    if (!window.confirm("Are you sure you want to delete this category?")) {
      return;
    }

    try {
      const token = localStorage.getItem("accessToken");

      const response = await fetch(`${API_URL}/categories/${id}`, {
        method: "DELETE",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (!response.ok) throw new Error("Delete failed");

      setCategories((current) =>
        current.filter((category) => category.id !== id)
      );
    } catch {
      setError(
        "Could not delete category. It may be in use by products, or you may need admin access."
      );
    }
  }

  return (
    <section className="min-h-screen bg-[#FBF8F3] px-4 py-12 font-sans text-[#351D1D] sm:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E8DED3] pb-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#927D70]">
              Management Portal
            </span>
            <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
              Manage Categories
            </h1>
            <p className="mt-2 text-xs text-[#927D70]">
              Organize and manage your store categories.
            </p>
          </div>

          <Link
            to="/createcategory"
            className="inline-flex items-center gap-2 rounded-xl bg-[#8B2635] px-5 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-md transition hover:bg-[#70202C] active:scale-[0.98]"
          >
            <Plus size={16} /> Create Category
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
              Loading categories...
            </p>
          ) : categories.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-sm font-bold text-[#351D1D]">
                No categories found.
              </p>
              <p className="mt-2 text-xs text-[#927D70]">
                Create your first category to get started.
              </p>
            </div>
          ) : (
            <table className="w-full min-w-162.5 border-collapse text-left">
              <thead className="border-b border-[#E8DED3] bg-[#F4EEE6] text-[11px] uppercase tracking-wider text-[#6D5B52]">
                <tr>
                  <th className="p-4 font-bold">Category</th>
                  <th className="p-4 font-bold">Description</th>
                  <th className="p-4 font-bold">Status</th>
                  <th className="p-4 text-right font-bold">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#E8DED3] text-xs">
                {categories.map((category) => (
                  <tr
                    key={category.id}
                    className="transition hover:bg-[#FBF8F3]"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        {category.image ? (
                          <img
                            src={category.image}
                            alt={category.name}
                            className="h-11 w-11 rounded-xl border border-[#E8DED3] object-cover"
                          />
                        ) : (
                          <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#E8DED3] bg-[#F4EEE6]">
                            <span className="text-[9px] font-semibold text-[#927D70]">
                              No img
                            </span>
                          </div>
                        )}

                        <span className="font-bold text-[#351D1D]">
                          {category.name}
                        </span>
                      </div>
                    </td>

                    <td className="max-w-xs truncate p-4 text-[#927D70]">
                      {category.description || "No description"}
                    </td>

                    <td className="p-4">
                      <span
                        className={
                          category.isActive === false
                            ? "rounded-full border border-red-200 bg-red-50 px-3 py-1 text-[10px] font-bold uppercase text-red-600"
                            : "rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[10px] font-bold uppercase text-emerald-700"
                        }
                      >
                        {category.isActive === false ? "Inactive" : "Active"}
                      </span>
                    </td>

                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <Link
                          to={`/editcategory/${category.id}`}
                          className="inline-flex items-center gap-1 font-semibold text-[#6D5B52] transition hover:text-[#8B2635]"
                        >
                          <Edit3 size={14} /> Edit
                        </Link>

                        <button
                          type="button"
                          onClick={() => deleteCategory(category.id)}
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
