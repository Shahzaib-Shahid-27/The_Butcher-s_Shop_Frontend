
import api from "../api/api";

export const createCart = async (data: { userId: string }) => {
  const response = await api.post("/carts", data);
  return response.data.data;
};

export const getCartByUserId = async (userId: string) => {
  const response = await api.get(`/carts/user/${userId}`);
  return response.data.data;
};

export const getAllCarts = async () => {
  const response = await api.get("/carts");
  return response.data.data;
};

export const getCartById = async (id: string) => {
  const response = await api.get(`/carts/${id}`);
  return response.data.data;
};

export const updateCart = async (id: string,data: { userId?: string }) => {
  const response = await api.patch(`/carts/${id}`, data);
  return response.data.data;
};

export const deleteCart = async (id: string) => {
  const response = await api.delete(`/carts/${id}`);
  return response.data;
};

