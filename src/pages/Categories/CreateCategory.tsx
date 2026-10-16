import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Layers, PackagePlus } from "lucide-react";
import { createCategory } from "../../services/categorieservices";
import { createproduct } from "../../services/productservices";
import ImageSelector from "../../components/ImageSelector";

export default function CreateCategory() {
  const navigate = useNavigate();

  // Category State
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  
  // Image handling states using ImageSelector
  const [image, setImage] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Product Inline Addition State
  const [includeProduct, setIncludeProduct] = useState(false);
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productStock, setProductStock] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name.trim()) {
      setMessage("Category name is required.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const finalImage = image.trim();

      const categoryPayload = {
        name: name.trim(),
        description: description.trim() ? description.trim() : undefined,
        image: finalImage ? finalImage : undefined,
      };

      const result = await createCategory(categoryPayload);
      const createdCategory = result.data || result;
      const createdCategoryId = createdCategory.id;

      if (includeProduct && createdCategoryId) {
        const productPayload = {
          name: productName.trim(),
          description: productDescription.trim(),
          price: Number(productPrice),
          stock: Number(productStock),
          categoryId: createdCategoryId,
          image: finalImage ? finalImage : undefined,
        };

        await createproduct(productPayload);
        navigate(`/categories/${createdCategoryId}/products`);
      } else {
        navigate("/createproduct", {
          state: {
            categoryId: createdCategoryId,
            categoryName: createdCategory.name,
          },
        });
      }
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      setMessage(
        err.response?.data?.message ??
          "Failed to create category. Please check your inputs."
      );
    } finally {
      setLoading(false);
    }
  };

  const inputStyle =
    "w-full rounded-xl border border-blue-900/40 bg-[#060b19] px-4 py-3.5 text-sm text-white outline-none transition focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 placeholder:text-slate-600";

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#030712] px-4 py-12 font-sans text-slate-100 selection:bg-cyan-500 selection:text-white">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-20 top-20 h-72 w-72 rounded-3xl bg-blue-600/10 blur-3xl" />
        <div className="absolute right-10 top-1/3 h-80 w-80 rounded-3xl bg-cyan-500/10 blur-3xl" />
        <div className="absolute -bottom-20 left-1/3 h-96 w-96 rounded-3xl bg-blue-700/10 blur-3xl" />
      </div>

      <div className="relative w-full max-w-5xl">
        {/* Header Bar */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-tr from-blue-600 to-cyan-400 shadow-lg shadow-cyan-500/20">
              <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <span className="text-xl font-bold tracking-tight text-white">The Butcher's Shop</span>
          </div>

          <Link
            to="/categories"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-800 bg-[#0a1128]/60 px-4 py-2 text-xs font-medium text-slate-300 transition hover:border-slate-700 hover:text-white"
          >
            <ArrowLeft size={15} />
            Back to Categories
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-start">
          {/* Left Hero Column */}
          <div className="flex flex-col justify-between rounded-3xl border border-slate-800/80 bg-[#0a1128]/80 p-8 backdrop-blur-xl lg:col-span-5 lg:p-10">
            <div>
              <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-500/30 bg-linear-to-br from-blue-500/20 to-cyan-500/20 text-cyan-400 shadow-inner">
                <Layers size={32} />
              </div>

              <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                Create <span className="bg-linear-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Category</span>
              </h1>

              <p className="mt-3 text-sm leading-relaxed text-slate-400">
                Organize your catalog by creating new category groupings for your store items.
              </p>
            </div>

            <div className="mt-10 rounded-2xl border border-blue-900/40 bg-[#060b19]/60 p-5">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cyan-400">
                <span className="h-2 w-2 rounded-full bg-cyan-400" />
                Integrated Catalog Flow
              </div>
              <p className="mt-1.5 text-xs text-slate-400">
                You can create a category and attach its first product directly in one step.
              </p>
            </div>
          </div>

          {/* Right Column Form */}
          <div className="rounded-3xl border border-slate-800/80 bg-[#0a1128]/90 p-6 shadow-2xl shadow-black/50 backdrop-blur-xl sm:p-8 lg:col-span-7">
            <div className="mb-6 border-b border-slate-800/60 pb-5">
              <h2 className="text-xl font-bold text-white">Category Information</h2>
              <p className="mt-1 text-xs text-slate-400">Fill in details and choose a category image.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="category-name" className="mb-1.5 block text-xs font-medium text-slate-300">
                  Category Name <span className="text-cyan-400">*</span>
                </label>
                <input
                  id="category-name"
                  type="text"
                  placeholder="e.g. Devices, Electronics, Accessories"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={inputStyle}
                />
              </div>

              <div>
                <label htmlFor="category-description" className="mb-1.5 block text-xs font-medium text-slate-300">
                  Description <span className="text-slate-500">(Optional)</span>
                </label>
                <textarea
                  id="category-description"
                  rows={3}
                  placeholder="Describe this category..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className={`${inputStyle} resize-none`}
                />
              </div>

              {/* REUSABLE IMAGE SELECTOR COMPONENT */}
              <ImageSelector
                imagePreview={imagePreview}
                setImage={setImage}
                setImagePreview={setImagePreview}
                setMessage={setMessage}
              />

              {/* INLINE PRODUCT ADDITION SECTION */}
              <div className="rounded-2xl border border-cyan-500/30 bg-[#060b19]/80 p-5 mt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <PackagePlus className="text-cyan-400" size={18} />
                    <span className="text-xs font-bold text-white uppercase tracking-wider">
                      Add First Product Now?
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    id="includeProductToggle"
                    checked={includeProduct}
                    onChange={(e) => setIncludeProduct(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-700 bg-slate-900 text-cyan-400 focus:ring-cyan-400"
                  />
                </div>

                {includeProduct && (
                  <div className="mt-4 space-y-4 border-t border-slate-800/80 pt-4">
                    <div>
                      <label className="mb-1 block text-xs font-medium text-slate-300">
                        Product Name <span className="text-cyan-400">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Wireless Mouse"
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                        className={inputStyle}
                        required={includeProduct}
                      />
                    </div>

                    <div>
                      <label className="mb-1 block text-xs font-medium text-slate-300">
                        Product Description
                      </label>
                      <input
                        type="text"
                        placeholder="Brief product summary..."
                        value={productDescription}
                        onChange={(e) => setProductDescription(e.target.value)}
                        className={inputStyle}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="mb-1 block text-xs font-medium text-slate-300">
                          Price ($) <span className="text-cyan-400">*</span>
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          placeholder="29.99"
                          value={productPrice}
                          onChange={(e) => setProductPrice(e.target.value)}
                          className={inputStyle}
                          required={includeProduct}
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-xs font-medium text-slate-300">
                          Stock Quantity <span className="text-cyan-400">*</span>
                        </label>
                        <input
                          type="number"
                          placeholder="10"
                          value={productStock}
                          onChange={(e) => setProductStock(e.target.value)}
                          className={inputStyle}
                          required={includeProduct}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {message && (
                <div role="alert" className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-xs font-medium text-rose-400">
                  {message}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => navigate("/categories")}
                  className="flex-1 rounded-xl border border-slate-800 bg-[#0a1128] py-3.5 text-xs font-semibold text-slate-300 transition hover:border-slate-700 hover:text-white"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 rounded-xl bg-linear-to-r from-blue-600 to-cyan-400 py-3.5 text-xs font-bold text-white shadow-lg shadow-cyan-500/25 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading
                    ? "Saving..."
                    : includeProduct
                    ? "Create Category & Save Product"
                    : "Create Category & Add Product →"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}