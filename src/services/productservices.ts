import api from "../api/api.ts";
import type { CreateProductType, UpdateProductType } from "../types/product";

export const createproduct = async (data: CreateProductType) => { 
  const result = await api.post("/products/", data);
  return result.data.data;
};

// GET ALL PRODUCTS (Supports optional category query)
export const getAllProducts = async (categoryId?: string) => {
  const params = categoryId ? { category: categoryId } : {};
  const result = await api.get("/products/", { params });
  return result.data.data;
};

// GET PRODUCT BY ID
export const getProductById = async (id: string) => { 
  const result = await api.get(`/products/${id}`);
  return result.data;
};

// UPDATE PRODUCT
export const updateProduct = async (id: string, data: UpdateProductType) => {
  const result = await api.patch(`/products/${id}/`, data);
  return result.data;
};

// DELETE PRODUCT
export const deleteProduct = async (id: string) => {
  const result = await api.delete(`/products/${id}/`);
  return result.data;
};