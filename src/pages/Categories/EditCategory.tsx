import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Layers, Save } from "lucide-react";
import { getCategoryById, updateCategory } from "../../services/categorieservices";
import ImageSelector from "../../components/ImageSelector";
import type { UpdateCategoryType } from "../../types/category.ts";

export default function EditCategory() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  // Image handling states using ImageSelector
  const [image, setImage] = useState<string>("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchCategory = async () => {
      if (!id) {
        setMessage("Category ID is missing.");
        setLoading(false);
        return;
      }

      try {
        const result = await getCategoryById(id);
        const categoryData = result.data || result;

        setName(categoryData.name ?? "");
        setDescription(categoryData.description ?? "");
        const categoryImg = categoryData.image ?? "";
        setImage(categoryImg);
        if (categoryImg) {
          setImagePreview(categoryImg);
        }
      } catch (error: unknown) {
        const err = error as {
          response?: { data?: { message?: string } };
          message?: string;
        };

        setMessage(
          err.response?.data?.message ??
            err.message ??
            "Failed to load category."
        );
      } finally {
        setLoading(false);
      }
    };

    void fetchCategory();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!id) {
      setMessage("Category ID is missing.");
      return;
    }

    if (!name.trim()) {
      setMessage("Category name is required.");
      return;
    }

    setSaving(true);
    setMessage("");

    try {
      const finalImage = image.trim();

      const categoryPayload: UpdateCategoryType = {
        name: name.trim(),
        description: description.trim() ? description.trim() : undefined,
        image: finalImage ? finalImage : undefined,
      };

      await updateCategory(id, categoryPayload);
      navigate("/categories");
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      setMessage(
        err.response?.data?.message ??
          "Failed to update category. Please check your inputs."
      );
    } finally {
      setSaving(false);
    }
  };

  const inputStyle =
    "w-full rounded-xl border border-neutral-200 bg-neutral-50 py-3 px-4 text-xs text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-neutral-900 focus:bg-white focus:ring-1 focus:ring-neutral-900";

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white font-sans text-xs font-semibold text-neutral-400">
        Loading category specifications...
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-white font-sans text-neutral-900 px-4 py-12 selection:bg-neutral-900 selection:text-white">
      
      {/* Top Banner */}
      <div className="absolute top-0 inset-x-0 bg-neutral-900 text-white text-[11px] py-2 px-4 text-center font-medium tracking-wide">
        Category Specification Portal — The Butcher's Shop
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

          <button
            type="button"
            onClick={() => navigate("/categories")}
            className="inline-flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-2 text-xs font-semibold text-neutral-700 transition hover:border-neutral-900 hover:text-neutral-900 shadow-sm"
          >
            <ArrowLeft size={15} /> Back to Categories
          </button>
        </div>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-start">
          {/* Left Hero Column */}
          <div className="flex flex-col justify-between rounded-2xl border border-neutral-200 bg-neutral-50/50 p-8 lg:col-span-5 lg:p-10">
            <div>
              <span className="inline-block px-3 py-1 mb-6 rounded-full bg-neutral-200/60 text-[10px] font-bold tracking-widest uppercase text-neutral-700">
                Category Manager
              </span>

              <h1 className="text-3xl font-black tracking-tight text-neutral-900 sm:text-4xl leading-tight">
                EDIT CATEGORY <br />
                <span className="text-neutral-400">SPECIFICATIONS</span>
              </h1>

              <p className="mt-4 text-xs leading-relaxed text-neutral-600">
                Update category titles, descriptions, and cover image media assets across your catalog.
              </p>
            </div>

            <div className="mt-12 rounded-xl border border-neutral-200 bg-white p-5 shadow-sm space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Category Identifier</span>
              <p className="font-mono text-xs text-neutral-800 break-all">{id}</p>
            </div>
          </div>

          {/* Right Column Form */}
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-xl shadow-neutral-100 sm:p-8 lg:col-span-7">
            <div className="mb-6">
              <h2 className="text-2xl font-bold tracking-tight text-neutral-900">Category Details</h2>
              <p className="mt-1 text-xs text-neutral-500">Modify the fields below to update this category.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="category-name" className="mb-1.5 block text-xs font-semibold text-neutral-700">
                  Category Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="category-name"
                  type="text"
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
                    disabled={saving}
                    className="flex-1 rounded-xl bg-neutral-900 py-3.5 text-xs font-bold uppercase tracking-wider text-white shadow-md transition hover:bg-neutral-800 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50 inline-flex items-center justify-center gap-2"
                  >
                    <Save size={14} /> {saving ? "Saving Changes..." : "Save Changes"}
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