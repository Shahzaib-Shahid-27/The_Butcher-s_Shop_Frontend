
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getProductById,
  updateProduct,
} from "../../services/productservices";
import {
  getAllCategories,
  createCategory,
} from "../../services/categorieservices";
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
        setPrice(
          product.price !== undefined && product.price !== null
            ? String(product.price)
            : ""
        );
        setStock(
          product.stock !== undefined && product.stock !== null
            ? String(product.stock)
            : ""
        );
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
      const created = await createCategory({
        name: newCategoryName.trim(),
      });

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
    "w-full rounded-xl border border-[#E8DED3] bg-[#F4EEE6] px-4 py-3 text-xs text-[#351D1D] placeholder-[#927D70] outline-none transition focus:border-[#8B2635] focus:bg-white focus:ring-1 focus:ring-[#8B2635]";

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FBF8F3] font-sans text-xs font-semibold text-[#927D70]">
        Loading product details...
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#FBF8F3] px-4 py-12 font-sans text-[#351D1D] selection:bg-[#8B2635] selection:text-white">
      <div className="absolute inset-x-0 top-0 bg-[#351D1D] px-4 py-2 text-center text-[11px] font-medium tracking-wide text-[#FBF8F3]">
        Butcher Shop — Online Product Management
      </div>

      <div className="relative mx-auto mt-6 max-w-5xl">
        <div className="mb-8 flex items-center justify-between border-b border-[#E8DED3] pb-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#8B2635] text-white shadow-sm">
              <span className="text-base font-black tracking-tighter">BS</span>
            </div>
            <div>
              <span className="text-lg font-black uppercase tracking-tight text-[#351D1D]">
                Butcher Shop
              </span>
              <p className="text-[10px] font-medium tracking-wide text-[#927D70]">
                Quality You Can Taste
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 rounded-xl border border-[#E8DED3] bg-white px-4 py-2 text-xs font-semibold text-[#6D5B52] shadow-sm transition hover:border-[#8B2635] hover:text-[#8B2635]"
          >
            <ArrowLeft size={15} /> Back
          </button>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-start">
          <div className="flex flex-col justify-between rounded-2xl border border-[#E8DED3] bg-[#F4EEE6] p-8 lg:col-span-5 lg:p-10">
            <div>
              <span className="mb-6 inline-block rounded-full border border-[#E8DED3] bg-white px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[#8B2635]">
                Online Catalog Management
              </span>
              <h1 className="text-3xl font-black leading-tight tracking-tight text-[#351D1D] sm:text-4xl">
                UPDATE
                <br />
                <span className="text-[#8B2635]">PRODUCT</span>
                <br />
                DETAILS.
              </h1>
              <p className="mt-4 text-xs leading-relaxed text-[#6D5B52]">
                Update your online product listings, including prices,
                available stock, descriptions, images, and categories.
              </p>
            </div>

            <div className="mt-8 border-t border-[#E8DED3] pt-6">
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#927D70]">
                Butcher Shop
              </p>
              <p className="mt-2 text-xs text-[#6D5B52]">
                Quality You Can Taste
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-[#E8DED3] bg-white p-6 shadow-xl shadow-[#351D1D]/5 sm:p-8 lg:col-span-7">
            <div className="mb-6">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#8B2635]">
                Product Catalog
              </span>
              <h2 className="mt-2 text-2xl font-black tracking-tight text-[#351D1D]">
                Edit Product
              </h2>
              <p className="mt-1 text-xs text-[#927D70]">
                Update the information displayed in your online store.
              </p>
            </div>

            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <div className="mb-1.5 flex items-center justify-between gap-2">
                  <label htmlFor="edit-categoryId" className="text-xs font-semibold text-[#6D5B52]">
                    Category
                  </label>
                  {!isAddingCategory && (
                    <button
                      type="button"
                      onClick={() => setIsAddingCategory(true)}
                      className="text-xs font-bold text-[#8B2635] underline underline-offset-2 transition hover:text-[#70202C]"
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
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className="flex flex-col gap-2 sm:flex-row">
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
                      className="rounded-xl bg-[#8B2635] px-4 py-3 text-xs font-bold text-white transition hover:bg-[#70202C] disabled:opacity-50"
                    >
                      {isCreatingCategory ? "Adding..." : "Save"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsAddingCategory(false);
                        setNewCategoryName("");
                      }}
                      className="rounded-xl border border-[#E8DED3] bg-[#F4EEE6] px-4 py-3 text-xs font-semibold text-[#6D5B52] transition hover:border-[#8B2635] hover:text-[#8B2635]"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>

              <div>
                <label htmlFor="edit-name" className="mb-1.5 block text-xs font-semibold text-[#6D5B52]">
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
                <label htmlFor="edit-description" className="mb-1.5 block text-xs font-semibold text-[#6D5B52]">
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
                  <label htmlFor="edit-price" className="mb-1.5 block text-xs font-semibold text-[#6D5B52]">
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
                  <label htmlFor="edit-stock" className="mb-1.5 block text-xs font-semibold text-[#6D5B52]">
                    Available Stock <span className="text-red-500">*</span>
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

              <div className="border-t border-[#E8DED3] pt-4">
                <ImageSelector
                  imagePreview={imagePreview}
                  setImage={setImage}
                  setImagePreview={setImagePreview}
                  setMessage={setMessage}
                />
              </div>

              {message && (
                <div role="status" className="rounded-xl border border-[#E8DED3] bg-[#F4EEE6] px-4 py-3 text-xs font-medium text-[#6D5B52]">
                  {message}
                </div>
              )}

              {localStorage.getItem("role") === "ADMIN" && (
                <div className="flex flex-col gap-3 border-t border-[#E8DED3] pt-5 sm:flex-row">
                  <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="flex-1 rounded-xl border border-[#E8DED3] bg-white py-3.5 text-xs font-semibold text-[#6D5B52] shadow-sm transition hover:border-[#8B2635] hover:text-[#8B2635]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#8B2635] py-3.5 text-xs font-bold uppercase tracking-wider text-white shadow-md transition hover:bg-[#70202C] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Save size={15} />
                    {saving ? "Saving..." : "Update Product"}
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
