import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api"; // Or your cart service function

interface AddToCartButtonProps {
  userId: string;
  productId: string;
}

export default function AddToCartButton({ userId, productId }: AddToCartButtonProps) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleAddToCart = async () => {
    setLoading(true);
    try {
      // 1. Send API request to add product to user's cart
      await api.post("/cart/", {
        userId,
        productId,
        quantity: 1,
      });

      // 2. Automatically navigate to the order details / checkout page
      navigate("/checkout", {
        state: { productId, userId }, // Optionally pass order context
      });
    } catch (error) {
      console.error("Failed to add product to cart:", error);
      alert("Failed to add product to cart. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={() => void handleAddToCart()}
      disabled={loading}
      className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-cyan-400 py-3 text-xs font-bold text-white shadow-lg shadow-cyan-500/20 transition hover:brightness-110 disabled:opacity-50"
    >
      {loading ? "Processing..." : "Buy Now / Add to Cart"}
    </button>
  );
}