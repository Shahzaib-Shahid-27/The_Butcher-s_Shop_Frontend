import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  getProductById,
  updateProduct,
} from "../services/productservices";
import { getAllCategories, createCategory } from "../services/categorieservices";
import ImageSelector from "../components/ImageSelector";

import type { UpdateProductType } from "../types/product";
import type { CategoryResponse } from "../types/category";

export default function EditProduct() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [image, setImage] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [categoryId, setCategoryId] = useState("");

  const [categories, setCategories] = useState<CategoryResponse[]>([]);

  // Inline category creation states
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      if (!id) {
        setMessage("Product ID is missing.");
        setLoading(false);
        return;
      }

      try {
        const [product, catsData] = await Promise.all([
          getProductById(id),
          getAllCategories().catch(() => []),
        ]);

        setCategories(catsData);
        setName(product.name ?? "");
        setDescription(product.description ?? "");
        setPrice(product.price !== undefined && product.price !== null ? String(product.price) : "");
        setStock(product.stock !== undefined && product.stock !== null ? String(product.stock) : "");
        setImage(product.image ?? "");
        setCategoryId(product.categoryId ?? "");
        if (product.image) {
          setImagePreview(product.image);
        }
      } catch {
        setMessage("Failed to load product details.");
      } finally {
        setLoading(false);
      }
    };

    void fetchData();
  }, [id]);

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

    if (!id) {
      setMessage("Product ID is missing.");
      return;
    }

    const data: UpdateProductType = {
      name,
      description,
      price: Number(price),
      stock: Number(stock),
      image: image || undefined,
      categoryId: categoryId || undefined,
    };

    setSaving(true);
    setMessage("");

    try {
      await updateProduct(id, data);
      navigate("/product");
    } catch {
      setMessage("Failed to update product.");
    } finally {
      setSaving(false);
    }
  };

  const inputStyle =
    "w-full rounded-xl border border-blue-900/40 bg-[#060b19] py-3.5 px-4 text-sm text-slate-100 placeholder-slate-500 outline-none transition focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50";

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#030712] text-slate-300">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-cyan-400 border-t-transparent"></div>
      </div>
    );
  }

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
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-400 shadow-lg shadow-cyan-500/20">
              <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <span className="text-xl font-bold tracking-tight text-white">The Butcher's Shop</span>
          </div>

          <button
            type="button"
            onClick={() => navigate("/product")}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-800 bg-[#0a1128]/60 px-4 py-2 text-sm font-medium text-slate-300 transition hover:border-slate-700 hover:text-white"
          >
            ← Back to Products
          </button>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-start">
          <div className="flex flex-col justify-between rounded-3xl border border-slate-800/80 bg-[#0a1128]/80 p-8 backdrop-blur-xl lg:col-span-5 lg:p-10">
            <div>
              <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-500/30 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 text-cyan-400 shadow-inner">
                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>

              <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                Edit <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Product</span>
              </h1>

              <p className="mt-3 text-sm leading-relaxed text-slate-400">
                Update product pricing, stock count, description, category, and preview media.
              </p>
            </div>

            <div className="mt-10 rounded-2xl border border-blue-900/40 bg-[#060b19]/60 p-5">
              <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">Product Identifier</span>
              <p className="mt-1 font-mono text-xs text-slate-300 break-all">{id}</p>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-800/80 bg-[#0a1128]/90 p-6 shadow-2xl backdrop-blur-xl sm:p-8 lg:col-span-7">
            <div className="mb-6 border-b border-slate-800/60 pb-5">
              <h2 className="text-xl font-bold text-white">Product Information</h2>
              <p className="mt-1 text-xs text-slate-400">Modify the fields below and save changes.</p>
            </div>

            {message && (
              <div role="status" className={`mb-5 rounded-xl border px-4 py-3 text-xs font-medium ${message.includes("successfully") ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400" : "border-rose-500/30 bg-rose-500/10 text-rose-400"}`}>
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <label htmlFor="editCategoryId" className="block text-xs font-medium text-slate-300">
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
                    id="editCategoryId"
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
                      className="rounded-xl bg-gradient-to-r from-blue-600 to-cyan-400 px-4 text-xs font-bold text-white shadow-md transition hover:brightness-110 disabled:opacity-50"
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
                <label htmlFor="productName" className="mb-1.5 block text-xs font-medium text-slate-300">
                  Product Name <span className="text-cyan-400">*</span>
                </label>
                <input
                  id="productName"
                  type="text"
                  className={inputStyle}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div>
                <label htmlFor="productDesc" className="mb-1.5 block text-xs font-medium text-slate-300">
                  Description <span className="text-cyan-400">*</span>
                </label>
                <textarea
                  id="productDesc"
                  className={`${inputStyle} min-h-28 resize-y`}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  required
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="productPrice" className="mb-1.5 block text-xs font-medium text-slate-300">
                    Price ($) <span className="text-cyan-400">*</span>
                  </label>
                  <input
                    id="productPrice"
                    type="number"
                    className={inputStyle}
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    min="0"
                    step="0.01"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="productStock" className="mb-1.5 block text-xs font-medium text-slate-300">
                    Stock Quantity <span className="text-cyan-400">*</span>
                  </label>
                  <input
                    id="productStock"
                    type="number"
                    className={inputStyle}
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    min="0"
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

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => navigate("/product")}
                  className="flex-1 rounded-xl border border-slate-800 bg-[#060b19] py-3.5 text-sm font-semibold text-slate-300 transition hover:border-slate-700 hover:text-white"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-400 py-3.5 text-sm font-bold text-white shadow-lg shadow-cyan-500/25 transition hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}