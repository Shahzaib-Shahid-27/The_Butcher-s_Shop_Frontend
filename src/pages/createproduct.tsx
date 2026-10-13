import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { createproduct } from "../services/productservices";
import { getAllCategories, createCategory } from "../services/categorieservices";
import ImageSelector from "../components/ImageSelector";

import type { CreateProductType } from "../types/product";
import type { CategoryResponse } from "../types/category";

export default function CreateProduct() {
  const location = useLocation();
  const navigate = useNavigate();

  const passedCategoryId = location.state?.categoryId || "";
  const passedCategoryName = location.state?.categoryName || "";

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [image, setImage] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [categoryId, setCategoryId] = useState(passedCategoryId);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [categories, setCategories] = useState<CategoryResponse[]>([]);

  // Inline category creation states
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);

  useEffect(() => {
    getAllCategories()
      .then((data) => {
        setCategories(data);
        if (passedCategoryId && !categoryId) {
          setCategoryId(passedCategoryId);
        }
      })
      .catch(() => setMessage("Failed to load categories."));
  }, [passedCategoryId, categoryId]);

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) return;

    setIsCreatingCategory(true);
    setMessage("");

    try {
      const created = await createCategory({ name: newCategoryName.trim() });
      setCategories((prev) => [...prev, created]);
      setCategoryId(created.id);
      setNewCategoryName("");
      setIsAddingCategory(false);
      setMessage("Category created successfully!");
    } catch {
      setMessage("Failed to create category. Please try again.");
    } finally {
      setIsCreatingCategory(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage("");
    setIsLoading(true);

    const product: CreateProductType = {
      name: name.trim(),
      description: description.trim(),
      price: Number(price),
      stock: Number(stock),
      image: image || undefined,
      categoryId: categoryId || undefined,
    };

    try {
      await createproduct(product);
      setMessage("Product created successfully!");

      setName("");
      setDescription("");
      setPrice("");
      setStock("");
      setImage("");
      setImagePreview(null);
      setCategoryId("");
      
      if (categoryId) {
        navigate(`/categories/${categoryId}/products`);
      }
    } catch {
      setMessage("Failed to create product. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const inputStyle =
    "w-full rounded-xl border border-blue-900/40 bg-[#060b19] py-3.5 px-4 text-sm text-slate-100 placeholder-slate-500 outline-none transition focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50";

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#030712] font-sans text-slate-100 selection:bg-cyan-500 selection:text-white">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-20 top-20 h-72 w-72 rounded-3xl bg-blue-600/10 blur-3xl"></div>
        <div className="absolute right-10 top-1/3 h-80 w-80 rounded-3xl bg-cyan-500/10 blur-3xl"></div>
        <div className="absolute -bottom-20 left-1/3 h-96 w-96 rounded-3xl bg-blue-700/10 blur-3xl"></div>
      </div>

      <div className="relative mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-tr from-blue-600 to-cyan-400 shadow-lg shadow-cyan-500/20">
              <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <span className="text-xl font-bold tracking-tight text-white">The Butcher's Shop</span>
          </div>

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-800 bg-[#0a1128]/60 px-4 py-2 text-sm font-medium text-slate-300 transition hover:border-slate-700 hover:bg-[#0a1128] hover:text-white"
          >
            ← Back
          </button>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-start">
          <div className="flex flex-col justify-between rounded-3xl border border-slate-800/80 bg-[#0a1128]/80 p-8 backdrop-blur-xl lg:col-span-5 lg:p-10">
            <div>
              <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-500/30 bg-linear-to-tr from-blue-500/20 to-cyan-500/20 text-cyan-400 shadow-inner">
                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>

              <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                Create <span className="bg-linear-to-tr from-blue-400 to-cyan-400 bg-clip-text text-transparent">Product</span>
              </h1>

              <p className="mt-3 text-sm leading-relaxed text-slate-400">
                Expand your catalog by adding new products with pricing, category tags, and image assets.
              </p>
            </div>

            {passedCategoryName && (
              <div className="mt-8 rounded-2xl border border-emerald-500/30 bg-emerald-950/30 p-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                  Pre-selected Category
                </span>
                <p className="mt-1 text-sm font-semibold text-white">
                  {passedCategoryName}
                </p>
              </div>
            )}
          </div>

          <div className="rounded-3xl border border-slate-800/80 bg-[#0a1128]/90 p-6 shadow-2xl shadow-black/50 backdrop-blur-xl sm:p-8 lg:col-span-7">
            <div className="mb-6 border-b border-slate-800/60 pb-5">
              <h2 className="text-xl font-bold text-white">Product Details</h2>
              <p className="mt-1 text-xs text-slate-400">Fill in the information below to register your product.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <label htmlFor="categoryId" className="block text-xs font-medium text-slate-300">
                    Category
                  </label>
                  {!isAddingCategory && (
                    <button
                      type="button"
                      onClick={() => setIsAddingCategory(true)}
                      className="text-xs font-semibold text-cyan-400 transition hover:text-cyan-300"
                    >
                      + Add New Category
                    </button>
                  )}
                </div>

                {!isAddingCategory ? (
                  <select
                    id="categoryId"
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className={inputStyle}
                  >
                    <option value="">Select a category</option>
                    {categories.map((cat: any) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter new category name..."
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      className={inputStyle}
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => void handleCreateCategory()}
                      disabled={isCreatingCategory || !newCategoryName.trim()}
                      className="rounded-xl bg-linear-to-tr from-blue-600 to-cyan-400 px-4 text-xs font-bold text-white shadow-md transition hover:brightness-110 disabled:opacity-50"
                    >
                      {isCreatingCategory ? "Adding..." : "Save"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsAddingCategory(false);
                        setNewCategoryName("");
                      }}
                      className="rounded-xl border border-slate-800 bg-[#060b19] px-4 text-xs font-semibold text-slate-400 transition hover:text-white"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>

              <div>
                <label htmlFor="name" className="mb-1.5 block text-xs font-medium text-slate-300">
                  Product Name <span className="text-cyan-400">*</span>
                </label>
                <input
                  id="name"
                  type="text"
                  className={inputStyle}
                  placeholder="e.g. Wireless Headphones"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div>
                <label htmlFor="description" className="mb-1.5 block text-xs font-medium text-slate-300">
                  Description <span className="text-cyan-400">*</span>
                </label>
                <textarea
                  id="description"
                  className={`${inputStyle} min-h-28 resize-y`}
                  placeholder="Describe your product details..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  required
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="price" className="mb-1.5 block text-xs font-medium text-slate-300">
                    Price ($) <span className="text-cyan-400">*</span>
                  </label>
                  <input
                    id="price"
                    type="number"
                    step="0.01"
                    min="0"
                    className={inputStyle}
                    placeholder="0.00"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="stock" className="mb-1.5 block text-xs font-medium text-slate-300">
                    Stock Quantity <span className="text-cyan-400">*</span>
                  </label>
                  <input
                    id="stock"
                    type="number"
                    min="0"
                    className={inputStyle}
                    placeholder="0"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Dual Image Selector Component */}
              <ImageSelector
                imagePreview={imagePreview}
                setImage={setImage}
                setImagePreview={setImagePreview}
                setMessage={setMessage}
              />

              {message && (
                <div role="status" className="rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-4 py-3 text-xs font-medium text-cyan-400">
                  {message}
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="flex-1 rounded-xl border border-slate-800 bg-[#060b19] py-3.5 text-sm font-semibold text-slate-300 transition hover:border-slate-700 hover:text-white"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 rounded-xl bg-linear-to-tr from-blue-600 to-cyan-400 py-3.5 text-sm font-bold text-white shadow-lg shadow-cyan-500/25 transition hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isLoading ? "Creating..." : "Create Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}