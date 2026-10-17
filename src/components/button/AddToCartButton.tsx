import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api"; // Adjust import path to your Axios/API module
import { ShoppingBag, ArrowRight, Loader2, Check, ShieldCheck } from "lucide-react";

interface AddToCartButtonProps {
  userId: string;
  productId: string;
  className?: string;
}

export const AddToCartButton: React.FC<AddToCartButtonProps> = ({
  userId,
  productId,
  className = "",
}) => {
  const navigate = useNavigate();
  const [loadingType, setLoadingType] = useState<"cart" | "buy" | null>(null);
  const [addedSuccess, setAddedSuccess] = useState<boolean>(false);

  const handleAddToCart = async (directCheckout: boolean): Promise<void> => {
    const actionType = directCheckout ? "buy" : "cart";
    setLoadingType(actionType);

    try {
      // 1. Send API request to add product to user's cart
      await api.post("/cart/", {
        userId,
        productId,
        quantity: 1,
      });

      if (directCheckout) {
        // Direct checkout flow
        navigate("/checkout", {
          state: { productId, userId },
        });
      } else {
        // Show success state on the button
        setAddedSuccess(true);
        setTimeout(() => setAddedSuccess(false), 2500);
      }
    } catch (error) {
      console.error("Failed to update cart:", error);
      alert("Failed to update cart. Please try again.");
    } finally {
      setLoadingType(null);
    }
  };

  const isProcessing = loadingType !== null;

  return (
    <div className={`flex flex-col gap-3 w-full ${className}`}>
      <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
        {/* Add to Bag (Secondary Option) */}
        <button
          type="button"
          onClick={() => void handleAddToCart(false)}
          disabled={isProcessing}
          className="relative w-full sm:w-1/2 inline-flex items-center justify-center gap-2 px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-neutral-900 bg-white border border-neutral-200 rounded-xl hover:bg-neutral-50 hover:border-neutral-900 active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
        >
          {loadingType === "cart" ? (
            <div className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-neutral-900" />
              <span>Adding...</span>
            </div>
          ) : addedSuccess ? (
            <div className="flex items-center gap-1.5 text-emerald-600 font-bold">
              <Check className="w-4 h-4 stroke-[2.5]" />
              <span>Added to Bag</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-neutral-700" />
              <span>Add to Bag</span>
            </div>
          )}
        </button>

        {/* Buy Now (Primary CTA) */}
        <button
          type="button"
          onClick={() => void handleAddToCart(true)}
          disabled={isProcessing}
          className="relative w-full sm:w-1/2 inline-flex items-center justify-center gap-2 px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-white bg-neutral-900 rounded-xl hover:bg-neutral-800 active:scale-[0.98] transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loadingType === "buy" ? (
            <div className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-white" />
              <span>Redirecting...</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span>Buy Now</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          )}
        </button>
      </div>

      {/* Admin Action Button Integration */}
      {localStorage.getItem("role") === "ADMIN" && (
        <button
          type="button"
          onClick={() => navigate(`/editproduct/${productId}`)}
          className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-neutral-800 bg-neutral-100 border border-neutral-200 rounded-xl hover:bg-neutral-200 transition shadow-sm"
        >
          <ShieldCheck className="w-4 h-4 text-neutral-900" />
          <span>Edit Product (Admin Override)</span>
        </button>
      )}
    </div>
  );
};

export default AddToCartButton;