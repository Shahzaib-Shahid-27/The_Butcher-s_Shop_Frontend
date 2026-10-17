import { useState } from "react";
import { Upload, X, ShieldCheck } from "lucide-react";
import { PUBLIC_PRODUCT_ASSETS } from "../constants/publicAssets";

interface ImageSelectorProps {
  imagePreview: string | null;
  setImage: (val: string) => void;
  setImagePreview: (val: string | null) => void;
  setMessage: (val: string) => void;
}

export default function ImageSelector({
  imagePreview,
  setImage,
  setImagePreview,
  setMessage,
}: ImageSelectorProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [selectedAssetId, setSelectedAssetId] = useState<string>("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setMessage("Please upload a valid image file (PNG, JPG, WebP).");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setMessage("File size must be under 5MB.");
      return;
    }

    setIsUploading(true);
    setMessage("");

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setImage(base64String);
      setImagePreview(base64String);
      setSelectedAssetId("");
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleSelectAsset = (asset: { id: string; url: string }) => {
    setSelectedAssetId(asset.id);
    setImage(asset.url);
    setImagePreview(asset.url);
    setMessage("");
  };

  const handleRemoveImage = () => {
    setImage("");
    setImagePreview(null);
    setSelectedAssetId("");
  };

  return (
    <div className="space-y-4 font-sans">
      <label className="block text-xs font-bold uppercase tracking-wider text-neutral-900">
        Product Image
      </label>

      {/* Option 1: Upload Local Image File */}
      <div className="rounded-2xl border border-neutral-200 bg-neutral-50/50 p-5 shadow-sm">
        <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
          Option 1: Upload Local Image File
        </span>
        <div className="mt-3 flex items-center gap-3">
          <label
            htmlFor="local-file-upload"
            className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-neutral-900 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-md transition hover:bg-neutral-800"
          >
            <Upload size={14} /> Choose File
          </label>
          <span className="text-xs text-neutral-500 font-medium truncate">
            {isUploading ? "Uploading..." : "No file chosen"}
          </span>
          <input
            id="local-file-upload"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      </div>

      <div className="flex items-center justify-center">
        <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 bg-white px-2">
          OR
        </span>
      </div>

      {/* Option 2: Select from Public Assets Dropdown */}
      <div className="rounded-2xl border border-neutral-200 bg-neutral-50/50 p-5 shadow-sm">
        <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
          Option 2: Select from Public Assets
        </span>
        <div className="mt-3">
          <select
            value={selectedAssetId}
            onChange={(e) => {
              const assetId = e.target.value;
              if (!assetId) {
                setSelectedAssetId("");
                setImage("");
                setImagePreview(null);
                return;
              }
              const found = PUBLIC_PRODUCT_ASSETS.find((a) => a.id === assetId);
              if (found) {
                handleSelectAsset(found);
              }
            }}
            className="w-full rounded-xl border border-neutral-200 bg-white py-3 px-4 text-xs font-medium text-neutral-900 outline-none transition focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 shadow-sm"
          >
            <option value="">Select a public asset...</option>
            {PUBLIC_PRODUCT_ASSETS.map((asset) => (
              <option key={asset.id} value={asset.id}>
                {asset.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Admin Action Button Integration */}
      {localStorage.getItem("role") === "ADMIN" && (
        <button
          type="button"
          onClick={() => alert("Admin Asset Manager Triggered")}
          className="w-full rounded-xl border border-neutral-200 bg-white py-3 px-4 text-xs font-bold uppercase tracking-wider text-neutral-800 transition hover:bg-neutral-50 hover:border-neutral-900 shadow-sm inline-flex items-center justify-center gap-2"
        >
          <ShieldCheck size={15} /> Manage Global Asset Repository
        </button>
      )}

      {/* Active Preview Area */}
      {imagePreview && (
        <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
            Active Preview
          </span>
          <div className="relative mt-3 flex h-40 w-full items-center justify-center overflow-hidden rounded-xl border border-neutral-200 bg-neutral-50 p-2">
            <img
              src={imagePreview}
              alt="Product Preview"
              className="h-full w-full object-contain rounded-lg"
            />
            <button
              type="button"
              onClick={handleRemoveImage}
              className="absolute right-3 top-3 rounded-xl bg-neutral-900 p-1.5 text-white shadow-md transition hover:bg-neutral-800"
            >
              <X size={15} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}