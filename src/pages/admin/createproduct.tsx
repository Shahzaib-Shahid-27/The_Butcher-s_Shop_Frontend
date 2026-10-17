import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Plus, ArrowLeft, PackageCheck } from "lucide-react";

import { createproduct } from "../../services/productservices";
import { getAllCategories, createCategory } from "../../services/categorieservices";
import ImageSelector from "../../components/ImageSelector";

import type { CreateProductType } from "../../types/product";
import type { CategoryResponse } from "../../types/category";

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
    "w-full rounded-xl border border-neutral-200 bg-neutral-50 py-3 px-4 text-xs text-neutral-900 placeholder-neutral-400 outline-none transition focus:border-neutral-900 focus:bg-white focus:ring-1 focus:ring-neutral-900";

  return (
    <div className="relative min-h-screen bg-white font-sans text-neutral-900 px-4 py-12 selection:bg-neutral-900 selection:text-white">
      
      <div className="absolute top-0 inset-x-0 bg-neutral-900 text-white text-[11px] py-2 px-4 text-center font-medium tracking-wide">
        Inventory Management — Product Creation Suite
      </div>

      <div className="relative mx-auto max-w-5xl mt-6">
        <div className="mb-8 flex items-center justify-between border-b border-neutral-100 pb-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-neutral-900 text-white shadow-sm">
              <span className="font-black tracking-tighter text-base">BS</span>
            </div>
            <span className="text-xl font-black tracking-tighter uppercase">The Butcher's Shop</span>
          </div>

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-2 text-xs font-semibold text-neutral-700 transition hover:border-neutral-900 hover:text-neutral-900 shadow-sm"
          >
            <ArrowLeft size={15} /> Back
          </button>
        </div>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-start">
          {/* Left Hero Section */}
          <div className="flex flex-col justify-between rounded-2xl border border-neutral-200 bg-neutral-50/50 p-8 lg:col-span-5 lg:p-10">
            <div>
              <span className="inline-block px-3 py-1 mb-6 rounded-full bg-neutral-200/60 text-[10px] font-bold tracking-widest uppercase text-neutral-700">
                Catalog Expansion
              </span>

              <h1 className="text-3xl font-black tracking-tight text-neutral-900 sm:text-4xl leading-tight">
                CREATE NEW <br />
                <span className="text-neutral-400">STORE</span> <br />
                PRODUCT.
              </h1>

              <p className="mt-4 text-xs leading-relaxed text-neutral-600">
                Expand your catalog by registering new items with pricing, inventory count, category labels, and image assets.
              </p>
            </div>

            {passedCategoryName && (
              <div className="mt-8 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                  Pre-selected Category
                </span>
                <p className="mt-1 text-xs font-bold text-neutral-900">
                  {passedCategoryName}
                </p>
              </div>
            )}
          </div>

          {/* Right Form Container */}
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-xl shadow-neutral-100 sm:p-8 lg:col-span-7">
            <div className="mb-6">
              <h2 className="text-2xl font-bold tracking-tight text-neutral-900">Product Details</h2>
              <p className="mt-1 text-xs text-neutral-500">Fill in the specifications below to register your item.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <label htmlFor="categoryId" className="block text-xs font-semibold text-neutral-700">
                    Category
                  </label>
                  {!isAddingCategory && (
                    <button
                      type="button"
                      onClick={() => setIsAddingCategory(true)}
                      className="text-xs font-bold text-neutral-900 hover:text-neutral-600 transition underline underline-offset-2"
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
                      className="rounded-xl bg-neutral-900 px-4 text-xs font-bold text-white shadow-md transition hover:bg-neutral-800 disabled:opacity-50"
                    >
                      {isCreatingCategory ? "Adding..." : "Save"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsAddingCategory(false);
                        setNewCategoryName("");
                      }}
                      className="rounded-xl border border-neutral-200 bg-white px-4 text-xs font-semibold text-neutral-600 transition hover:border-neutral-900 hover:text-neutral-900"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>

              <div>
                <label htmlFor="name" className="mb-1.5 block text-xs font-semibold text-neutral-700">
                  Product Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="name"
                  type="text"
                  className={inputStyle}
                  placeholder="e.g. Ribeye Premium Cut"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div>
                <label htmlFor="description" className="mb-1.5 block text-xs font-semibold text-neutral-700">
                  Description <span className="text-red-500">*</span>
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
                  <label htmlFor="price" className="mb-1.5 block text-xs font-semibold text-neutral-700">
                    Price ($) <span className="text-red-500">*</span>
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
                  <label htmlFor="stock" className="mb-1.5 block text-xs font-semibold text-neutral-700">
                    Stock Quantity <span className="text-red-500">*</span>
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
              <div className="pt-2">
                <ImageSelector
                  imagePreview={imagePreview}
                  setImage={setImage}
                  setImagePreview={setImagePreview}
                  setMessage={setMessage}
                />
              </div>

              {message && (
                <div role="status" className="rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-xs font-medium text-neutral-800">
                  {message}
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="flex-1 rounded-xl border border-neutral-200 bg-white py-3.5 text-xs font-semibold text-neutral-700 transition hover:border-neutral-900 hover:text-neutral-900 shadow-sm"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 rounded-xl bg-neutral-900 py-3.5 text-xs font-bold uppercase tracking-wider text-white shadow-md transition hover:bg-neutral-800 active:scale-[0.99] disabled:opacity-50"
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