import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getAllProducts, deleteProduct } from "../../services/productservices";
import api from "../../api/api";

interface Product {
  id: string;
  name: string;
  description?: string;
  price?: number;
  categoryId?: string;
  category?: { id: string; name: string } | string;
  image?: string;
}

export const CategoryProductsPage: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      try {
        setLoading(true);
        const data = await getAllProducts();

        const filteredProducts = data.filter((item: Product) => {
          if (typeof item.category === "object" && item.category !== null) {
            return item.category.id === categoryId;
          }
          return item.categoryId === categoryId || item.category === categoryId;
        });

        setProducts(filteredProducts);
      } catch (error) {
        console.error("Failed to load category products:", error);
      } finally {
        setLoading(false);
      }
    };

    if (categoryId) {
      void fetchCategoryProducts();
    }
  }, [categoryId]);

 const handleAddToCart = async (product: Product) => {
    try {
      // Try adjusting the payload keys if your backend expects different names (e.g., product_id)
      await api.post("/carts/", {
        productId: product.id, // or product_id: product.id
        quantity: 1,
      });
      setSuccessMessage(`Added "${product.name}" to cart!`);
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error: unknown) {
      const err = error as { response?: { data?: unknown } };
      console.error("Failed to add to cart:", err.response?.data || error);
      alert("Failed to add product to cart. Check console for details.");
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteProduct(id);
        setProducts((prev) => prev.filter((product) => product.id !== id));
      } catch (error) {
        console.error("Failed to delete product:", error);
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 font-sans text-slate-100">
      <button
        onClick={() => navigate("/categories")}
        className="mb-6 text-sm text-gray-400 hover:text-white transition flex items-center gap-2"
      >
        ← Back to Categories
      </button>

      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Category Products</h1>
          <p className="text-gray-400 text-sm mt-1">Showing all items under this category.</p>
        </div>
        <button
          onClick={() => navigate("/createproduct")}
          className="group relative inline-flex items-center gap-2 overflow-hidden rounded-xl bg-linear-to-r from-blue-600 to-cyan-400 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-cyan-500/20 transition duration-200 hover:brightness-110"
        >
          + Add Product
        </button>
      </div>

      {successMessage && (
        <div className="mb-6 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-xs font-medium text-emerald-400">
          {successMessage}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center min-h-[40vh] text-gray-400">
          Loading products...
        </div>
      ) : products.length === 0 ? (
        <div className="bg-[#0b0f19] border border-gray-800 rounded-2xl p-12 text-center text-gray-400">
          No products found in this category.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-[#0b0f19] border border-gray-800 rounded-2xl p-4 flex flex-col justify-between"
            >
              <div>
                <div className="w-full h-40 bg-[#070a10] border border-gray-800/60 rounded-xl flex items-center justify-center overflow-hidden mb-4">
                  {product.image ? (
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                  ) : (
                    <svg className="w-10 h-10 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  )}
                </div>

                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-bold text-white">{product.name}</h3>
                  {product.price !== undefined && (
                    <span className="text-emerald-400 font-semibold text-sm">${product.price}</span>
                  )}
                </div>

                <p className="text-gray-400 text-sm line-clamp-2">
                  {product.description || "No description provided."}
                </p>
              </div>

              <div>
                <button
                  onClick={() => void handleAddToCart(product)}
                  className="mt-4 w-full rounded-xl bg-linear-to-r from-blue-600 to-cyan-400 py-2.5 text-xs font-bold text-white shadow transition hover:brightness-110"
                >
                  Add to Cart
                </button>

                <hr className="border-gray-800 my-3" />
                <div className="flex gap-3">
                  <button
                    onClick={() => navigate(`/editproduct/${product.id}`)}
                    className="flex-1 py-1.5 px-3 border border-cyan-500/40 text-cyan-400 font-medium rounded-xl hover:bg-cyan-500/10 transition text-xs"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => void handleDelete(product.id)}
                    className="flex-1 py-1.5 px-3 border border-pink-500/40 text-pink-500 font-medium rounded-xl hover:bg-pink-500/10 transition text-xs"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryProductsPage;