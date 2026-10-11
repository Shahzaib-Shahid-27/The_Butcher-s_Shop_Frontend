import { useState } from "react";
import { Upload, X } from "lucide-react";
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
    <div className="space-y-4">
      <label className="block text-xs font-medium text-slate-300">
        Product Image
      </label>

      {/* Option 1: Upload Local Image File */}
      <div className="rounded-2xl border border-blue-900/40 bg-[#060b19] p-4">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-cyan-400">
          Option 1: Upload Local Image File
        </span>
        <div className="mt-2 flex items-center gap-3">
          <label
            htmlFor="local-file-upload"
            className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-blue-600/20 px-4 py-2 text-xs font-semibold text-cyan-400 border border-blue-900/50 transition hover:bg-blue-600/30"
          >
            <Upload size={16} /> Choose File
          </label>
          <span className="text-xs text-slate-400 truncate">
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

      <span  className="flex justify-center text-[11px] font-semibold uppercase tracking-wider text-cyan-400" >OR</span>

      {/* Option 2: Select from Public Assets Dropdown */}
      <div className="rounded-2xl border border-blue-900/40 bg-[#060b19] p-4">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-cyan-400">
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
            className="w-full rounded-xl border border-blue-900/40 bg-[#0a1128] py-3.5 px-4 text-sm text-slate-100 placeholder-slate-500 outline-none transition focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50"
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

      {/* Active Preview Area */}
      {imagePreview && (
        <div className="rounded-2xl border border-blue-900/40 bg-[#060b19] p-4">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Active Preview
          </span>
          <div className="relative mt-2 flex h-40 w-full items-center justify-center overflow-hidden rounded-xl border border-blue-900/40 bg-[#030712] p-2">
            <img
              src={imagePreview}
              alt="Product Preview"
              className="h-full w-full object-contain rounded-lg"
            />
            <button
              type="button"
              onClick={handleRemoveImage}
              className="absolute right-3 top-3 rounded-xl bg-rose-600/80 p-1.5 text-white backdrop-blur-md transition hover:bg-rose-500"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}