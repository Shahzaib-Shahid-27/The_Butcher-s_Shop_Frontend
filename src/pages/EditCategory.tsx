import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Layers } from "lucide-react";
import {
  getCategoryById,
  updateCategory,
} from "../services/categorieservices";
import ImageSelector from "../components/ImageSelector";

import type { UpdateCategoryType } from "../types/category.ts";

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
    "w-full rounded-xl border border-blue-900/40 bg-[#060b19] px-4 py-3.5 text-sm text-white outline-none transition focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 placeholder:text-slate-600";

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#030712] text-slate-300">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-cyan-400 border-t-transparent"></div>
      </div>
    );
  }

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

          <button
            type="button"
            onClick={() => navigate("/categories")}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-800 bg-[#0a1128]/60 px-4 py-2 text-xs font-medium text-slate-300 transition hover:border-slate-700 hover:text-white"
          >
            <ArrowLeft size={15} />
            Back to Categories
          </button>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-start">
          {/* Left Hero Column */}
          <div className="flex flex-col justify-between rounded-3xl border border-slate-800/80 bg-[#0a1128]/80 p-8 backdrop-blur-xl lg:col-span-5 lg:p-10">
            <div>
              <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-500/30 bg-linear-to-tr from-blue-500/20 to-cyan-500/20 text-cyan-400 shadow-inner">
                <Layers size={32} />
              </div>

              <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                Edit <span className="bg-linear-to-tr from-blue-400 to-cyan-400 bg-clip-text text-transparent">Category</span>
              </h1>

              <p className="mt-3 text-sm leading-relaxed text-slate-400">
                Update category details, description, and preview media assets.
              </p>
            </div>

            <div className="mt-10 rounded-2xl border border-blue-900/40 bg-[#060b19]/60 p-5">
              <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">Category Identifier</span>
              <p className="mt-1 font-mono text-xs text-slate-300 break-all">{id}</p>
            </div>
          </div>

          {/* Right Column Form */}
          <div className="rounded-3xl border border-slate-800/80 bg-[#0a1128]/90 p-6 shadow-2xl shadow-black/50 backdrop-blur-xl sm:p-8 lg:col-span-7">
            <div className="mb-6 border-b border-slate-800/60 pb-5">
              <h2 className="text-xl font-bold text-white">Category Information</h2>
              <p className="mt-1 text-xs text-slate-400">Modify the fields below and save changes.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="category-name" className="mb-1.5 block text-xs font-medium text-slate-300">
                  Category Name <span className="text-cyan-400">*</span>
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
                <label htmlFor="category-description" className="mb-1.5 block text-xs font-medium text-slate-300">
                  Description <span className="text-slate-500">(Optional)</span>
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
              <ImageSelector
                imagePreview={imagePreview}
                setImage={setImage}
                setImagePreview={setImagePreview}
                setMessage={setMessage}
              />

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
                  disabled={saving}
                  className="flex-1 rounded-xl bg-linear-to-tr from-blue-600 to-cyan-400 py-3.5 text-xs font-bold text-white shadow-lg shadow-cyan-500/25 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving ? "Saving Changes..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}