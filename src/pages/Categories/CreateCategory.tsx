import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Layers, PackagePlus, Plus } from "lucide-react";
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
    "w-full rounded-xl border border-neutral-200 bg-neutral-50 py-3 px-4 text-xs text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-neutral-900 focus:bg-white focus:ring-1 focus:ring-neutral-900";

  return (
    <div className="relative min-h-screen bg-white font-sans text-neutral-900 px-4 py-12 selection:bg-neutral-900 selection:text-white">
      
      {/* Top Banner */}
      <div className="absolute top-0 inset-x-0 bg-neutral-900 text-white text-[11px] py-2 px-4 text-center font-medium tracking-wide">
        Category Registration Suite — The Butcher's Shop
      </div>

      <div className="relative mx-auto max-w-5xl mt-6">
        {/* Header Bar */}
        <div className="mb-8 flex items-center justify-between border-b border-neutral-100 pb-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-neutral-900 text-white shadow-sm">
              <span className="font-black tracking-tighter text-base">BS</span>
            </div>
            <span className="text-xl font-black tracking-tighter uppercase">The Butcher's Shop</span>
          </div>

          <Link
            to="/categories"
            className="inline-flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-2 text-xs font-semibold text-neutral-700 transition hover:border-neutral-900 hover:text-neutral-900 shadow-sm"
          >
            <ArrowLeft size={15} /> Back to Categories
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-start">
          {/* Left Hero Column */}
          <div className="flex flex-col justify-between rounded-2xl border border-neutral-200 bg-neutral-50/50 p-8 lg:col-span-5 lg:p-10">
            <div>
              <span className="inline-block px-3 py-1 mb-6 rounded-full bg-neutral-200/60 text-[10px] font-bold tracking-widest uppercase text-neutral-700">
                Catalog Management
              </span>

              <h1 className="text-3xl font-black tracking-tight text-neutral-900 sm:text-4xl leading-tight">
                CREATE NEW <br />
                <span className="text-neutral-400">CATEGORY</span> <br />
                GROUPING.
              </h1>

              <p className="mt-4 text-xs leading-relaxed text-neutral-600">
                Organize your product catalog by creating distinct category groupings for your storefront.
              </p>
            </div>

            <div className="mt-12 rounded-xl border border-neutral-200 bg-white p-5 shadow-sm space-y-1">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-900">
                <Layers size={16} className="text-neutral-700" /> Integrated Setup
              </div>
              <p className="text-xs text-neutral-500">
                You can create a category and immediately attach its first item in a single submission.
              </p>
            </div>
          </div>

          {/* Right Column Form */}
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-xl shadow-neutral-100 sm:p-8 lg:col-span-7">
            <div className="mb-6">
              <h2 className="text-2xl font-bold tracking-tight text-neutral-900">Category Information</h2>
              <p className="mt-1 text-xs text-neutral-500">Enter category specifications and upload a cover asset.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="category-name" className="mb-1.5 block text-xs font-semibold text-neutral-700">
                  Category Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="category-name"
                  type="text"
                  placeholder="e.g. Premium Beef Cuts, Poultry, Sausages"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={inputStyle}
                />
              </div>

              <div>
                <label htmlFor="category-description" className="mb-1.5 block text-xs font-semibold text-neutral-700">
                  Description <span className="text-neutral-400 font-normal">(Optional)</span>
                </label>
                <textarea
                  id="category-description"
                  rows={3}
                  placeholder="Provide a short description for this category..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className={`${inputStyle} resize-none`}
                />
              </div>

              {/* REUSABLE IMAGE SELECTOR COMPONENT */}
              <div className="pt-2">
                <ImageSelector
                  imagePreview={imagePreview}
                  setImage={setImage}
                  setImagePreview={setImagePreview}
                  setMessage={setMessage}
                />
              </div>

              {/* INLINE PRODUCT ADDITION SECTION */}
              <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-5 mt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <PackagePlus className="text-neutral-800" size={18} />
                    <span className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
                      Add First Product Now?
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    id="includeProductToggle"
                    checked={includeProduct}
                    onChange={(e) => setIncludeProduct(e.target.checked)}
                    className="h-4 w-4 rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900 accent-neutral-900 cursor-pointer"
                  />
                </div>

                {includeProduct && (
                  <div className="mt-4 space-y-3 border-t border-neutral-200 pt-4">
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-neutral-700">
                        Product Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Angus Sirloin Steak"
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                        className={inputStyle}
                        required={includeProduct}
                      />
                    </div>

                    <div>
                      <label className="mb-1 block text-xs font-semibold text-neutral-700">
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
                        <label className="mb-1 block text-xs font-semibold text-neutral-700">
                          Price ($) <span className="text-red-500">*</span>
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
                        <label className="mb-1 block text-xs font-semibold text-neutral-700">
                          Stock Quantity <span className="text-red-500">*</span>
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
                <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-medium text-red-600">
                  {message}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => navigate("/categories")}
                  className="flex-1 rounded-xl border border-neutral-200 bg-white py-3.5 text-xs font-semibold text-neutral-700 transition hover:border-neutral-900 hover:text-neutral-900 shadow-sm"
                >
                  Cancel
                </button>

                {localStorage.getItem("role") === "ADMIN" && (
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 rounded-xl bg-neutral-900 py-3.5 text-xs font-bold uppercase tracking-wider text-white shadow-md transition hover:bg-neutral-800 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {loading
                      ? "Saving..."
                      : includeProduct
                      ? "Create Category & Product"
                      : "Create Category"}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}