
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";
import { Plus, Edit3, Trash2, Folder, Beef } from "lucide-react";

interface Category {
  id: string;
  name: string;
  description?: string;
  status?: string;
  image?: string;
}

const Categories: React.FC = () => {
  const navigate = useNavigate();

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  const isAdmin = localStorage.getItem("role") === "ADMIN";

  useEffect(() => {
    void fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await api.get("/categories/");
      setCategories(response.data.data || response.data);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (categoryId: string) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;

    try {
      const token = localStorage.getItem("accessToken");

      if (!token) {
        alert("Please log in again.");
        return;
      }

      await api.delete(`/categories/${categoryId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      await fetchCategories();
    } catch (error) {
      console.error("Delete category failed:", error);
      alert("Unable to delete category. Please check your login and permissions.");
    }
  };

  const handleImageError = (id: string) => {
    setImageErrors((prev) => ({ ...prev, [id]: true }));
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 bg-[#FBF8F3] font-sans">
        <Beef className="h-9 w-9 animate-pulse text-[#8B2635]" />
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#927D70]">
          Loading Categories...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FBF8F3] font-sans text-[#351D1D]">
      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:py-14">
        <div className="mb-9 flex flex-wrap items-center justify-between gap-5 border-b border-[#E8DED3] pb-7">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-[#927D70]">
              Butcher Shop · Management Portal
            </span>
            <h1 className="mt-2 text-3xl font-black tracking-tight text-[#351D1D] sm:text-4xl">
              Categories<span className="text-[#8B2635]">.</span>
            </h1>
            <p className="mt-2 text-xs text-[#927D70] sm:text-sm">
              Explore product categories and discover the items available in our online store.
            </p>
          </div>

          {isAdmin && (
            <button
              type="button"
              onClick={() => navigate("/createcategory")}
              className="inline-flex items-center gap-2 rounded-xl bg-[#8B2635] px-5 py-3.5 text-xs font-extrabold uppercase tracking-wider text-white shadow-md transition hover:bg-[#6F1D2A]"
            >
              <Plus size={16} />
              Add Category
            </button>
          )}
        </div>

        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-sm font-extrabold text-[#351D1D]">
            Explore Our Categories
          </h2>
          <span className="rounded-full bg-[#F4EEE6] px-3 py-1 text-[10px] font-bold text-[#8B2635]">
            {categories.length} CATEGORIES
          </span>
        </div>

        {categories.length === 0 ? (
          <div className="rounded-2xl border border-[#E8DED3] bg-white px-6 py-16 text-center shadow-sm">
            <Folder className="mx-auto mb-4 h-10 w-10 text-[#8B2635]" />
            <h2 className="text-lg font-black text-[#351D1D]">No Categories Found</h2>
            <p className="mt-2 text-sm text-[#927D70]">
              There are currently no categories available.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => {
              const hasImage = category.image && !imageErrors[category.id];

              return (
                <div
                  key={category.id}
                  onClick={() => navigate(`/categories/${category.id}/products`)}
                  className="group flex cursor-pointer flex-col justify-between rounded-2xl border border-[#E8DED3] bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[#8B2635] hover:shadow-lg"
                >
                  <div>
                    <div className="relative mb-5 flex h-52 w-full items-center justify-center overflow-hidden rounded-xl border border-[#E8DED3] bg-[#F4EEE6]">
                      <span className="absolute right-3 top-3 z-10 rounded-full bg-[#351D1D]/85 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-white">
                        {category.status || "ACTIVE"}
                      </span>

                      {hasImage ? (
                        <img
                          src={category.image}
                          alt={category.name}
                          onError={() => handleImageError(category.id)}
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex flex-col items-center gap-2 text-[#B6A394]">
                          <Folder size={36} />
                          <span className="text-[10px] font-bold uppercase tracking-widest">
                            No Image
                          </span>
                        </div>
                      )}
                    </div>

                    <h3 className="text-base font-extrabold text-[#351D1D] transition group-hover:text-[#8B2635]">
                      {category.name}
                    </h3>

                    <p className="mt-2 line-clamp-2 text-xs leading-6 text-[#927D70]">
                      {category.description || "No description provided for this category."}
                    </p>
                  </div>

                  <div>
                    <div className="my-5 border-t border-[#E8DED3]" />

                    {isAdmin && (
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/editcategory/${category.id}`);
                          }}
                          className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-[#E8DED3] bg-[#FBF8F3] px-3 py-2.5 text-xs font-bold text-[#6D5B52] transition hover:border-[#8B2635] hover:text-[#8B2635]"
                        >
                          <Edit3 size={13} />
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            void handleDelete(category.id);
                          }}
                          className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-3 py-2.5 text-xs font-bold text-red-600 transition hover:bg-red-50"
                        >
                          <Trash2 size={13} />
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Categories;
