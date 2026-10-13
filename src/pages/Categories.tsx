import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

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

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        await api.delete(`/categories/${id}/`);
        setCategories((prev) => prev.filter((cat) => cat.id !== id));
      } catch (error) {
        console.error("Failed to delete category:", error);
      }
    }
  };

  const handleImageError = (id: string) => {
    setImageErrors((prev) => ({ ...prev, [id]: true }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh] text-gray-400">
        Loading categories...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      {/* Header Bar */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Categories</h1>
          <p className="text-gray-400 text-sm mt-1">
            Manage your product categories or click to view items within a category.
          </p>
        </div>
        <button
          onClick={() => navigate("/createcategory")}
          className="group relative inline-flex items-center gap-2 overflow-hidden rounded-xl bg-linear-to-r from-blue-600 to-cyan-400 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-cyan-500/20 transition duration-200 hover:brightness-110"
        >
          + Add Category
        </button>
      </div>

      {/* Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => {
          const hasImage = category.image && !imageErrors[category.id];

          return (
            <div
              key={category.id}
              onClick={() => navigate(`/categories/${category.id}/products`)}
              className="group relative bg-[#0b0f19] border border-gray-800 rounded-2xl p-4 cursor-pointer hover:border-gray-700 transition duration-200 flex flex-col justify-between"
            >
              <div>
                {/* Category Image Box */}
                <div className="relative w-full h-48 bg-[#070a10] border border-gray-800/60 rounded-xl flex items-center justify-center overflow-hidden mb-4">
                  <span className="absolute top-3 right-3 bg-emerald-950/80 text-emerald-400 text-xs font-semibold px-2.5 py-1 rounded-full border border-emerald-500/30 z-10">
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
                    <svg
                      className="w-12 h-12 text-gray-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  )}
                </div>

                {/* Title & Description */}
                <h3 className="text-white text-xl font-bold mb-1">{category.name}</h3>
                <p className="text-gray-400 text-sm line-clamp-2">
                  {category.description || "No description provided for this category."}
                </p>
              </div>

              <div>
                <hr className="border-gray-800 my-4" />

                {/* Buttons with stopPropagation */}
                <div className="flex gap-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/editcategory/${category.id}`);
                    }}
                    className="flex-1 py-2 px-4 border border-cyan-500/40 text-cyan-400 font-medium rounded-xl hover:bg-cyan-500/10 transition text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      void handleDelete(category.id);
                    }}
                    className="flex-1 py-2 px-4 border border-pink-500/40 text-pink-500 font-medium rounded-xl hover:bg-pink-500/10 transition text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Categories;