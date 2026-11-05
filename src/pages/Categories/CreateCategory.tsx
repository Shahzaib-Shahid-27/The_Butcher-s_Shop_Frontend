
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Layers, PackagePlus } from "lucide-react";
import { createCategory } from "../../services/categorieservices";
import { createproduct } from "../../services/productservices";
import ImageSelector from "../../components/ImageSelector";

export default function CreateCategory() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);

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
        description: description.trim() || undefined,
        image: finalImage || undefined,
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
          image: finalImage || undefined,
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
      const err = error as {
        response?: { data?: { message?: string } };
      };

      setMessage(
        err.response?.data?.message ??
          "Failed to create category. Please check your inputs."
      );
    } finally {
      setLoading(false);
    }
  };

  const inputStyle =
    "w-full rounded-xl border border-[#E8DED3] bg-[#FBF8F3] px-4 py-3 text-sm text-[#351D1D] outline-none transition placeholder:text-[#B6A394] focus:border-[#8B2635] focus:bg-white focus:ring-1 focus:ring-[#8B2635]";

  return (
    <div className="min-h-screen bg-[#FBF8F3] px-4 py-10 font-sans text-[#351D1D] sm:px-6 lg:py-14">
      <div className="fixed inset-x-0 top-0 z-20 bg-[#351D1D] px-4 py-2.5 text-center text-[10px] font-bold uppercase tracking-[0.2em] text-white">
        Butcher Shop — Online Category Management
      </div>

      <div className="mx-auto mt-7 max-w-5xl">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-[#E8DED3] pb-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#8B2635] text-white shadow-md">
              <span className="text-base font-black tracking-tighter">BS</span>
            </div>

            <div>
              <h2 className="text-lg font-black uppercase tracking-tight text-[#351D1D]">
                Butcher Shop
              </h2>
              <p className="text-[10px] font-semibold text-[#927D70]">
                Quality You Can Taste
              </p>
            </div>
          </div>

          <Link
            to="/categories"
            className="inline-flex items-center gap-2 rounded-xl border border-[#E8DED3] bg-white px-4 py-3 text-xs font-bold text-[#6D5B52] shadow-sm transition hover:border-[#8B2635] hover:text-[#8B2635]"
          >
            <ArrowLeft size={15} />
            Back to Categories
          </Link>
        </div>

        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
          <div className="flex flex-col justify-between rounded-2xl border border-[#E8DED3] bg-[#F4EEE6] p-8 lg:col-span-5 lg:p-10">
            <div>
              <span className="mb-6 inline-block rounded-full bg-white px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-widest text-[#8B2635]">
                Catalog Management
              </span>

              <h1 className="text-3xl font-black leading-tight tracking-tight text-[#351D1D] sm:text-4xl">
                CREATE NEW
                <br />
                <span className="text-[#8B2635]">CATEGORY</span>
                <br />
                GROUPING.
              </h1>

              <p className="mt-5 text-sm leading-7 text-[#6D5B52]">
                Organize your online product catalog into clear categories so customers can easily discover their favorites.
              </p>
            </div>

            <div className="mt-12 space-y-2 rounded-xl border border-[#E8DED3] bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[#351D1D]">
                <Layers size={17} className="text-[#8B2635]" />
                Integrated Setup
              </div>

              <p className="text-xs leading-6 text-[#927D70]">
                Create a category and immediately add its first product in a single submission.
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-[#E8DED3] bg-white p-6 shadow-sm sm:p-8 lg:col-span-7">
            <div className="mb-7">
              <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#927D70]">
                New Collection
              </span>
              <h2 className="mt-2 text-2xl font-black tracking-tight text-[#351D1D]">
                Category Information
              </h2>
              <p className="mt-2 text-xs text-[#927D70]">
                Enter category details and select a cover image for your online store.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="category-name" className="mb-2 block text-xs font-bold text-[#6D5B52]">
                  Category Name <span className="text-[#8B2635]">*</span>
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
                <label htmlFor="category-description" className="mb-2 block text-xs font-bold text-[#6D5B52]">
                  Description{" "}
                  <span className="font-normal text-[#B6A394]">(Optional)</span>
                </label>
                <textarea
                  id="category-description"
                  rows={3}
                  placeholder="Write a short description customers will see..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className={`${inputStyle} resize-none`}
                />
              </div>

              <div className="pt-2">
                <ImageSelector
                  imagePreview={imagePreview}
                  setImage={setImage}
                  setImagePreview={setImagePreview}
                  setMessage={setMessage}
                />
              </div>

              <div className="mt-6 rounded-xl border border-[#E8DED3] bg-[#FBF8F3] p-5">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <PackagePlus size={19} className="text-[#8B2635]" />
                    <span className="text-xs font-extrabold uppercase tracking-wider text-[#351D1D]">
                      Add First Product Now?
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    id="includeProductToggle"
                    checked={includeProduct}
                    onChange={(e) => setIncludeProduct(e.target.checked)}
                    className="h-4 w-4 cursor-pointer accent-[#8B2635]"
                  />
                </div>

                {includeProduct && (
                  <div className="mt-5 space-y-4 border-t border-[#E8DED3] pt-5">
                    <div>
                      <label className="mb-2 block text-xs font-bold text-[#6D5B52]">
                        Product Name <span className="text-[#8B2635]">*</span>
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
                      <label className="mb-2 block text-xs font-bold text-[#6D5B52]">
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
                        <label className="mb-2 block text-xs font-bold text-[#6D5B52]">
                          Price ($) <span className="text-[#8B2635]">*</span>
                        </label>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          placeholder="29.99"
                          value={productPrice}
                          onChange={(e) => setProductPrice(e.target.value)}
                          className={inputStyle}
                          required={includeProduct}
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-xs font-bold text-[#6D5B52]">
                          Stock Quantity <span className="text-[#8B2635]">*</span>
                        </label>
                        <input
                          type="number"
                          min="0"
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

              <div className="flex flex-col gap-3 pt-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() => navigate("/categories")}
                  className="flex-1 rounded-xl border border-[#E8DED3] bg-white py-3.5 text-xs font-bold text-[#6D5B52] shadow-sm transition hover:border-[#8B2635] hover:text-[#8B2635]"
                >
                  Cancel
                </button>

                {localStorage.getItem("role") === "ADMIN" && (
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 rounded-xl bg-[#8B2635] py-3.5 text-xs font-extrabold uppercase tracking-wider text-white shadow-md transition hover:bg-[#6F1D2A] disabled:cursor-not-allowed disabled:opacity-50"
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
