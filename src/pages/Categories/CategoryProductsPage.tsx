
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getAllProducts, deleteProduct } from "../../services/productservices";
import api from "../../api/api";
import {
  ArrowLeft,
  Plus,
  Edit3,
  Trash2,
  ShoppingBag,
  Package,
  Beef,
} from "lucide-react";

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

    if (categoryId) void fetchCategoryProducts();
  }, [categoryId]);

  const handleAddToCart = async (product: Product) => {
    try {
      await api.post("/carts/", {
        productId: product.id,
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
    <div className="min-h-screen bg-[#FBF8F3] font-sans text-[#351D1D]">
      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:py-14">
        <button
          type="button"
          onClick={() => navigate("/categories")}
          className="mb-7 inline-flex items-center gap-2 text-xs font-bold text-[#927D70] transition hover:text-[#8B2635]"
        >
          <ArrowLeft size={15} />
          Back to Categories
        </button>

        <div className="mb-8 flex flex-wrap items-center justify-between gap-5 border-b border-[#E8DED3] pb-7">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-[#927D70]">
              Butcher Shop · Product Catalog
            </span>
            <h1 className="mt-2 text-3xl font-black tracking-tight text-[#351D1D] sm:text-4xl">
              Category Products<span className="text-[#8B2635]">.</span>
            </h1>
            <p className="mt-2 text-xs text-[#927D70] sm:text-sm">
              Explore products available in this category and add your favorites to your cart.
            </p>
          </div>

          {isAdmin && (
            <button
              type="button"
              onClick={() => navigate("/createproduct")}
              className="inline-flex items-center gap-2 rounded-xl bg-[#8B2635] px-5 py-3.5 text-xs font-extrabold uppercase tracking-wider text-white shadow-md transition hover:bg-[#6F1D2A]"
            >
              <Plus size={16} />
              Add Product
            </button>
          )}
        </div>

        {successMessage && (
          <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs font-semibold text-emerald-700">
            {successMessage}
          </div>
        )}

        {loading ? (
          <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4">
            <Beef className="h-9 w-9 animate-pulse text-[#8B2635]" />
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#927D70]">
              Loading Products...
            </p>
          </div>
        ) : products.length === 0 ? (
          <div className="rounded-2xl border border-[#E8DED3] bg-white px-6 py-16 text-center shadow-sm">
            <Package className="mx-auto mb-4 h-10 w-10 text-[#8B2635]" />
            <h2 className="text-lg font-black text-[#351D1D]">No Products Found</h2>
            <p className="mt-2 text-sm text-[#927D70]">
              There are currently no products in this category.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <div
                key={product.id}
                className="group flex flex-col justify-between rounded-2xl border border-[#E8DED3] bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[#8B2635] hover:shadow-lg"
              >
                <div>
                  <div className="mb-5 flex h-52 w-full items-center justify-center overflow-hidden rounded-xl border border-[#E8DED3] bg-[#F4EEE6]">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <Package className="h-10 w-10 text-[#B6A394]" />
                    )}
                  </div>

                  <div className="mb-2 flex items-start justify-between gap-3">
                    <h3 className="text-sm font-extrabold text-[#351D1D] transition group-hover:text-[#8B2635]">
                      {product.name}
                    </h3>

                    {product.price !== undefined && (
                      <span className="shrink-0 text-sm font-black text-[#8B2635]">
                        ${Number(product.price).toFixed(2)}
                      </span>
                    )}
                  </div>

                  <p className="line-clamp-2 text-xs leading-6 text-[#927D70]">
                    {product.description || "No description provided."}
                  </p>
                </div>

                <div className="mt-6">
                  <button
                    type="button"
                    onClick={() => void handleAddToCart(product)}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#8B2635] py-3.5 text-xs font-extrabold uppercase tracking-wider text-white shadow-md transition hover:bg-[#6F1D2A]"
                  >
                    <ShoppingBag size={15} />
                    Add to Cart
                  </button>

                  {isAdmin && (
                    <>
                      <div className="my-4 border-t border-[#E8DED3]" />
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => navigate(`/editproduct/${product.id}`)}
                          className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-[#E8DED3] bg-[#FBF8F3] px-3 py-2.5 text-xs font-bold text-[#6D5B52] transition hover:border-[#8B2635] hover:text-[#8B2635]"
                        >
                          <Edit3 size={13} />
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() => void handleDelete(product.id)}
                          className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-3 py-2.5 text-xs font-bold text-red-600 transition hover:bg-red-50"
                        >
                          <Trash2 size={13} />
                          Delete
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
    </div>
  );
};

export default CategoryProductsPage;
