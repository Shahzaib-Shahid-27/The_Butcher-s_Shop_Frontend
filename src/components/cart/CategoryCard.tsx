import React from "react";
import { useNavigate } from "react-router-dom";
import { Edit3, Trash2, Folder } from "lucide-react";

interface CategoryCardProps {
  category: {
    id: string;
    name: string;
    description?: string;
    status: string;
    image?: string;
  };
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  onEdit,
  onDelete,
}) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/categories/${category.id}/products`);
  };

  return (
    <div
      onClick={handleCardClick}
      className="group relative bg-white border border-neutral-200 rounded-2xl p-5 cursor-pointer hover:border-neutral-900 transition duration-200 flex flex-col justify-between shadow-sm"
    >
      <div>
        {/* Image Container */}
        <div className="relative w-full h-48 bg-neutral-100 border border-neutral-200 rounded-xl flex items-center justify-center overflow-hidden mb-4">
          <span className="absolute top-3 right-3 bg-neutral-900/80 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider z-10">
            {category.status || "ACTIVE"}
          </span>
          {category.image ? (
            <img
              src={category.image}
              alt={category.name}
              className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
            />
          ) : (
            <div className="flex flex-col items-center gap-2 text-neutral-400">
              <Folder size={32} />
              <span className="text-[10px] font-medium uppercase tracking-wider">
                No Image
              </span>
            </div>
          )}
        </div>

        {/* Category Info */}
        <h3 className="text-neutral-900 text-base font-bold mb-1">
          {category.name}
        </h3>
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
                onEdit(category.id);
              }}
              className="flex-1 py-2 px-3 border border-neutral-200 text-neutral-700 font-semibold rounded-xl hover:border-neutral-900 hover:text-neutral-900 transition text-xs inline-flex items-center justify-center gap-1.5 bg-white shadow-sm"
            >
              <Edit3 size={13} /> Edit
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(category.id);
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
};