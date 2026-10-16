import React from 'react';
import { useNavigate } from 'react-router-dom';

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

export const CategoryCard: React.FC<CategoryCardProps> = ({ category, onEdit, onDelete }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/categories/${category.id}/products`);
  };

  return (
    <div 
      onClick={handleCardClick} 
      className="bg-[#0b0f19] border border-gray-800 rounded-2xl p-4 cursor-pointer hover:border-gray-700 transition duration-200"
    >
      {/* Image Container */}
      <div className="relative w-full h-48 bg-[#070a10] rounded-xl flex items-center justify-center overflow-hidden mb-4">
        <span className="absolute top-3 right-3 bg-emerald-950/80 text-emerald-400 text-xs font-semibold px-2.5 py-1 rounded-full border border-emerald-500/30">
          {category.status || 'ACTIVE'}
        </span>
        {category.image ? (
          <img src={category.image} alt={category.name} className="w-full h-full object-cover" />
        ) : (
          <svg className="w-12 h-12 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        )}
      </div>

      {/* Category Info */}
      <h3 className="text-white text-xl font-bold mb-1">{category.name}</h3>
      <p className="text-gray-400 text-sm mb-4">
        {category.description || "No description provided for this category."}
      </p>

      <hr className="border-gray-800 my-4" />

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          onClick={(e) => {
            e.stopPropagation(); // Prevents navigating to the category page when clicking Edit
            onEdit(category.id);
          }}
          className="flex-1 py-2 px-4 border border-cyan-500/40 text-cyan-400 rounded-xl hover:bg-cyan-500/10 transition"
        >
          Edit
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation(); // Prevents navigating to the category page when clicking Delete
            onDelete(category.id);
          }}
          className="flex-1 py-2 px-4 border border-pink-500/40 text-pink-500 rounded-xl hover:bg-pink-500/10 transition"
        >
          Delete
        </button>
      </div>
    </div>
  );
};