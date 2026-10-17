import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getAllProducts, deleteProduct } from "../../services/productservices";
import api from "../../api/api";
import { ArrowLeft, Plus, Edit3, Trash2, ShoppingBag, Package } from "lucide-react";

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

  const isAdmin = localStorage.getItem("role") === "ADMIN";

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
      await api.post("/carts/", {
        productId: product.id,
        quantity: 1,
      });
      setSuccessMessage(`Added "${product.name}" to bag!`);
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
    <div className="max-w-7xl mx-auto px-6 py-12 font-sans text-neutral-900 bg-white min-h-screen">
      <button
        onClick={() => navigate("/categories")}
        className="mb-6 text-xs font-semibold text-neutral-500 hover:text-neutral-950 transition flex items-center gap-1.5"
      >
        <ArrowLeft size={14} /> Back to Categories
      </button>

      <div className="flex flex-wrap justify-between items-center mb-8 border-b border-neutral-100 pb-6 gap-4">
        <div>
          <span className="text-xs font-bold tracking-widest text-neutral-400 uppercase">Catalog View</span>
          <h1 className="text-3xl font-black tracking-tight text-neutral-900 mt-1">Category Products</h1>
          <p className="text-neutral-500 text-xs mt-1">Showing all items available under this category.</p>
        </div>

        {isAdmin && (
          <button
            onClick={() => navigate("/createproduct")}
            className="inline-flex items-center gap-2 rounded-xl bg-neutral-900 px-5 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-md hover:bg-neutral-800 transition"
          >
            <Plus size={16} /> Add Product
          </button>
        )}
      </div>

      {successMessage && (
        <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs font-medium text-emerald-700">
          {successMessage}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center min-h-[40vh] text-xs font-semibold text-neutral-400">
          Loading products...
        </div>
      ) : products.length === 0 ? (
        <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-12 text-center text-xs text-neutral-500">
          No products found in this category.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white border border-neutral-200 rounded-2xl p-5 flex flex-col justify-between shadow-sm hover:border-neutral-900 transition"
            >
              <div>
                <div className="w-full h-48 bg-neutral-100 border border-neutral-200 rounded-xl flex items-center justify-center overflow-hidden mb-4">
                  {product.image ? (
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                  ) : (
                    <Package className="w-10 h-10 text-neutral-400" />
                  )}
                </div>

                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-sm font-bold text-neutral-900">{product.name}</h3>
                  {product.price !== undefined && (
                    <span className="text-neutral-900 font-bold text-sm">
                      ${Number(product.price).toFixed(2)}
                    </span>
                  )}
                </div>

                <p className="text-neutral-500 text-xs line-clamp-2 leading-relaxed">
                  {product.description || "No description provided."}
                </p>
              </div>

              <div className="mt-6">
                <button
                  onClick={() => void handleAddToCart(product)}
                  className="w-full rounded-xl bg-neutral-900 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-md hover:bg-neutral-800 transition inline-flex items-center justify-center gap-2"
                >
                  <ShoppingBag size={14} /> Add to Bag
                </button>

                {isAdmin && (
                  <>
                    <div className="border-t border-neutral-100 my-3" />
                    <div className="flex gap-2">
                      <button
                        onClick={() => navigate(`/editproduct/${product.id}`)}
                        className="flex-1 py-2 px-3 border border-neutral-200 text-neutral-700 font-semibold rounded-xl hover:border-neutral-900 hover:text-neutral-900 transition text-xs inline-flex items-center justify-center gap-1.5 bg-white shadow-sm"
                      >
                        <Edit3 size={13} /> Edit
                      </button>
                      <button
                        onClick={() => void handleDelete(product.id)}
                        className="flex-1 py-2 px-3 border border-red-200 text-red-600 font-semibold rounded-xl hover:bg-red-50 transition text-xs inline-flex items-center justify-center gap-1.5 bg-white shadow-sm"
                      >
                        <Trash2 size={13} /> Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryProductsPage;