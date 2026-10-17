import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";
import { Plus, Edit3, Trash2, Folder, ImageOff } from "lucide-react";

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
    try {
      const token = localStorage.getItem("accessToken");

      if (!token) {
        alert("Please log in again.");
        return;
      }

      await api.delete(`/categories/${categoryId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
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
      <div className="flex justify-center items-center min-h-[60vh] text-xs font-semibold text-neutral-400">
        Loading categories...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 font-sans text-neutral-900 bg-white min-h-screen">
      {/* Header Bar */}
      <div className="flex flex-wrap justify-between items-center mb-8 border-b border-neutral-100 pb-6 gap-4">
        <div>
          <span className="text-xs font-bold tracking-widest text-neutral-400 uppercase">Management Portal</span>
          <h1 className="text-3xl font-black tracking-tight text-neutral-900 mt-1">Categories</h1>
          <p className="text-neutral-500 text-xs mt-1">
            Manage product categories or click any category to view included items.
          </p>
        </div>

        {localStorage.getItem("role") === "ADMIN" && (
          <button
            onClick={() => navigate("/createcategory")}
            className="inline-flex items-center gap-2 rounded-xl bg-neutral-900 px-5 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-md hover:bg-neutral-800 transition"
          >
            <Plus size={16} /> Add Category
          </button>
        )}
      </div>

      {/* Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => {
          const hasImage = category.image && !imageErrors[category.id];

          return (
            <div
              key={category.id}
              onClick={() => navigate(`/categories/${category.id}/products`)}
              className="group relative bg-white border border-neutral-200 rounded-2xl p-5 cursor-pointer hover:border-neutral-900 transition duration-200 flex flex-col justify-between shadow-sm"
            >
              <div>
                {/* Category Image Box */}
                <div className="relative w-full h-48 bg-neutral-100 border border-neutral-200 rounded-xl flex items-center justify-center overflow-hidden mb-4">
                  <span className="absolute top-3 right-3 bg-neutral-900/80 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider z-10">
                    {category.status || "ACTIVE"}
                  </span>

                  {hasImage ? (
                    <img
                      src={category.image}
                      alt={category.name}
                      onError={() => handleImageError(category.id)}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-neutral-400">
                      <Folder size={32} />
                      <span className="text-[10px] font-medium uppercase tracking-wider">No Image</span>
                    </div>
                  )}
                </div>

                {/* Title & Description */}
                <h3 className="text-neutral-900 text-base font-bold mb-1">{category.name}</h3>
                <p className="text-neutral-500 text-xs line-clamp-2 leading-relaxed">
                  {category.description || "No description provided for this category."}
                </p>
              </div>

              <div>
                <hr className="border-neutral-100 my-4" />

                {/* Admin Action Buttons */}
                {localStorage.getItem("role") === "ADMIN" && (
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/editcategory/${category.id}`);
                      }}
                      className="flex-1 py-2 px-3 border border-neutral-200 text-neutral-700 font-semibold rounded-xl hover:border-neutral-900 hover:text-neutral-900 transition text-xs inline-flex items-center justify-center gap-1.5 bg-white shadow-sm"
                    >
                      <Edit3 size={13} /> Edit
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        void handleDelete(category.id);
                      }}
                      className="flex-1 py-2 px-3 border border-red-200 text-red-600 font-semibold rounded-xl hover:bg-red-50 transition text-xs inline-flex items-center justify-center gap-1.5 bg-white shadow-sm"
                    >
                      <Trash2 size={13} /> Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Categories;