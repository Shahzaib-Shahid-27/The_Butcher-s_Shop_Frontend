import api from "../api/api.ts";
import type { CreateCategoryType, UpdateCategoryType } from "../types/category";


// CREATE CATEGORY
export const createCategory = async (data: CreateCategoryType) => {
  const result = await api.post("/categories/", data);
  return result.data;
};

// GET ALL CATEGORIES
export const getAllCategories = async () => {
  const result = await api.get("/categories");
  return result.data.data;
};

// GET CATEGORY BY ID
export const getCategoryById = async (id: string) => {
  const result = await api.get(`/categories/${id.trim()}`);
  return result.data.data;
};

// UPDATE CATEGORY
export const updateCategory = async (id: string, data: UpdateCategoryType | FormData) => {
  const cleanId = id.trim();
  const isFormData = data instanceof FormData;

  const result = await api.patch(`/categories/${cleanId}`, data, {
    headers: isFormData ? { "Content-Type": "multipart/form-data" } : {},
  });

  return result.data;
};

// DELETE CATEGORY
export const deleteCategory = async (id: string) => {
  const result = await api.delete(`/categories/${id.trim()}`);
  return result.data;
};