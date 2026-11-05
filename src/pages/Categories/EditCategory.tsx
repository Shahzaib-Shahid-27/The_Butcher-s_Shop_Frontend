
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save, Beef } from "lucide-react";
import {
  getCategoryById,
  updateCategory,
} from "../../services/categorieservices";
import ImageSelector from "../../components/ImageSelector";
import type { UpdateCategoryType } from "../../types/category.ts";

export default function EditCategory() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
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

        if (categoryImg) setImagePreview(categoryImg);
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
        description: description.trim() || undefined,
        image: finalImage || undefined,
      };

      await updateCategory(id, categoryPayload);
      navigate("/categories");
    } catch (error: unknown) {
      const err = error as {
        response?: { data?: { message?: string } };
      };

      setMessage(
        err.response?.data?.message ??
          "Failed to update category. Please check your inputs."
      );
    } finally {
      setSaving(false);
    }
  };

  const inputStyle =
    "w-full rounded-xl border border-[#E8DED3] bg-[#FBF8F3] px-4 py-3 text-sm text-[#351D1D] outline-none transition placeholder:text-[#B6A394] focus:border-[#8B2635] focus:bg-white focus:ring-1 focus:ring-[#8B2635]";

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#FBF8F3] font-sans">
        <Beef className="h-9 w-9 animate-pulse text-[#8B2635]" />
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#927D70]">
          Loading Category...
        </p>
      </div>
    );
  }

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

          <button
            type="button"
            onClick={() => navigate("/categories")}
            className="inline-flex items-center gap-2 rounded-xl border border-[#E8DED3] bg-white px-4 py-3 text-xs font-bold text-[#6D5B52] shadow-sm transition hover:border-[#8B2635] hover:text-[#8B2635]"
          >
            <ArrowLeft size={15} />
            Back to Categories
          </button>
        </div>

        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
          <div className="flex flex-col justify-between rounded-2xl border border-[#E8DED3] bg-[#F4EEE6] p-8 lg:col-span-5 lg:p-10">
            <div>
              <span className="mb-6 inline-block rounded-full bg-white px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-widest text-[#8B2635]">
                Category Manager
              </span>

              <h1 className="text-3xl font-black leading-tight tracking-tight text-[#351D1D] sm:text-4xl">
                EDIT CATEGORY
                <br />
                <span className="text-[#8B2635]">SPECIFICATIONS</span>
              </h1>

              <p className="mt-5 text-sm leading-7 text-[#6D5B52]">
                Update category names, descriptions, and cover images displayed in your online product catalog.
              </p>
            </div>

            <div className="mt-12 space-y-2 rounded-xl border border-[#E8DED3] bg-white p-5 shadow-sm">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#927D70]">
                Category Identifier
              </span>
              <p className="break-all font-mono text-xs text-[#351D1D]">
                {id}
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-[#E8DED3] bg-white p-6 shadow-sm sm:p-8 lg:col-span-7">
            <div className="mb-7">
              <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#927D70]">
                Update Collection
              </span>
              <h2 className="mt-2 text-2xl font-black tracking-tight text-[#351D1D]">
                Category Details
              </h2>
              <p className="mt-2 text-xs text-[#927D70]">
                Modify the information customers see when browsing this category.
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
                    disabled={saving}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#8B2635] py-3.5 text-xs font-extrabold uppercase tracking-wider text-white shadow-md transition hover:bg-[#6F1D2A] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Save size={15} />
                    {saving ? "Saving Changes..." : "Save Changes"}
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
