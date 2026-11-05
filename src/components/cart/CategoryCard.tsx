
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
      className="group relative flex cursor-pointer flex-col justify-between rounded-2xl border border-[#E8DED3] bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[#8B2635] hover:shadow-lg"
    >
      {/* Category Image */}
      <div>
        <div className="relative mb-4 flex h-48 w-full items-center justify-center overflow-hidden rounded-xl border border-[#E8DED3] bg-[#F4EEE6]">
          <span className="absolute right-3 top-3 z-10 rounded-full bg-[#8B2635] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm">
            {category.status || "ACTIVE"}
          </span>

          {category.image ? (
            <img
              src={category.image}
              alt={category.name}
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex flex-col items-center gap-2 text-[#927D70]">
              <Folder size={34} />
              <span className="text-[10px] font-semibold uppercase tracking-wider">
                No Image Available
              </span>
            </div>
          )}
        </div>

        {/* Category Information */}
        <h3 className="mb-1 text-base font-bold text-[#351D1D] transition group-hover:text-[#8B2635]">
          {category.name}
        </h3>

        <p className="line-clamp-2 text-xs leading-relaxed text-[#927D70]">
          {category.description ||
            "Explore products available in this category."}
        </p>
      </div>

      {/* Admin Actions */}
      <div>
        <hr className="my-4 border-[#E8DED3]" />

        {localStorage.getItem("role") === "ADMIN" && (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(category.id);
              }}
              className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-[#E8DED3] bg-[#F4EEE6] px-3 py-2 text-xs font-semibold text-[#351D1D] shadow-sm transition hover:border-[#8B2635] hover:bg-[#8B2635] hover:text-white"
            >
              <Edit3 size={13} />
              Edit
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(category.id);
              }}
              className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-red-200 bg-white px-3 py-2 text-xs font-semibold text-red-600 shadow-sm transition hover:bg-red-50"
            >
              <Trash2 size={13} />
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
