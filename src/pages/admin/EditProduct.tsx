import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getProductById, updateProduct } from "../../services/productservices";
import { getAllCategories, createCategory } from "../../services/categorieservices";
import ImageSelector from "../../components/ImageSelector";
import type { UpdateProductType } from "../../types/product";
import type { CategoryResponse } from "../../types/category";
import { ArrowLeft, Save } from "lucide-react";

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
        setImagePreview(product.image ?? null);
        setCategoryId(product.categoryId ?? "");
      } catch {
        setMessage("Failed to load product details.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!id) return;

    setMessage("");
    setSaving(true);

    const updatedData: UpdateProductType = {
      name: name.trim(),
      description: description.trim(),
      price: Number(price),
      stock: Number(stock),
      image: image || undefined,
      categoryId: categoryId || undefined,
    };

    try {
      await updateProduct(id, updatedData);
      setMessage("Product updated successfully! Redirecting...");
      setTimeout(() => navigate(-1), 1200);
    } catch {
      setMessage("Failed to update product. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const inputStyle =
    "w-full rounded-xl border border-neutral-200 bg-neutral-50 py-3 px-4 text-xs text-neutral-900 placeholder-neutral-400 outline-none transition focus:border-neutral-900 focus:bg-white focus:ring-1 focus:ring-neutral-900";

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white font-sans text-xs font-semibold text-neutral-500">
        Loading product details...
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-white font-sans text-neutral-900 px-4 py-12 selection:bg-neutral-900 selection:text-white">
      
      <div className="absolute top-0 inset-x-0 bg-neutral-900 text-white text-[11px] py-2 px-4 text-center font-medium tracking-wide">
        Inventory Management — Product Update Suite
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
                Inventory Control
              </span>

              <h1 className="text-3xl font-black tracking-tight text-neutral-900 sm:text-4xl leading-tight">
                EDIT PRODUCT <br />
                <span className="text-neutral-400">SPECIFICATIONS</span>
              </h1>

              <p className="mt-4 text-xs leading-relaxed text-neutral-600">
                Update prices, change active inventory stock, modify descriptions, or reassign product category tags.
              </p>
            </div>
          </div>

          {/* Right Form Container */}
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-xl shadow-neutral-100 sm:p-8 lg:col-span-7">
            <div className="mb-6">
              <h2 className="text-2xl font-bold tracking-tight text-neutral-900">Update Product</h2>
              <p className="mt-1 text-xs text-neutral-500">Modify the fields below to update your item.</p>
            </div>

            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <label htmlFor="edit-categoryId" className="block text-xs font-semibold text-neutral-700">
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
                    id="edit-categoryId"
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
                <label htmlFor="edit-name" className="mb-1.5 block text-xs font-semibold text-neutral-700">
                  Product Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="edit-name"
                  type="text"
                  className={inputStyle}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div>
                <label htmlFor="edit-description" className="mb-1.5 block text-xs font-semibold text-neutral-700">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="edit-description"
                  className={`${inputStyle} min-h-28 resize-y`}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  required
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="edit-price" className="mb-1.5 block text-xs font-semibold text-neutral-700">
                    Price ($) <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="edit-price"
                    type="number"
                    step="0.01"
                    min="0"
                    className={inputStyle}
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="edit-stock" className="mb-1.5 block text-xs font-semibold text-neutral-700">
                    Stock Quantity <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="edit-stock"
                    type="number"
                    min="0"
                    className={inputStyle}
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

              {localStorage.getItem("role") === "ADMIN" && (
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
                    disabled={saving}
                    className="flex-1 rounded-xl bg-neutral-900 py-3.5 text-xs font-bold uppercase tracking-wider text-white shadow-md transition hover:bg-neutral-800 active:scale-[0.99] disabled:opacity-50 inline-flex items-center justify-center gap-2"
                  >
                    <Save size={15} /> {saving ? "Saving..." : "Update Product"}
                  </button>
                </div>
              )}
              
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}