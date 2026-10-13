
import api from "../api/api";

export const createCartItem = async (data: {cartId: string;productId: string;quantity: number;}) => {
  const result = await api.post("/cart-items/", data);
  return result.data.data;
};

export const getCartItemsByCartId = async (cartId: string) => {
  const result = await api.get(`/cart-items/cart/${cartId}`);
  return result.data.data;
};

export const updateCartItem = async (id: string,data: { quantity: number }) => {
  const result = await api.patch(`/cart-items/${id}`, data);
  return result.data;
};

export const deleteCartItem = async (id: string) => {
  const result = await api.delete(`/cart-items/${id}`);
  return result.data;
};

export const addCartItem = async (data: { cartId: string; productId: string; quantity: number }) => {
  const response = await api.post("/cart-items", data);
  return response.data.data;
};

export const getCartItems = async (cartId: string) => {
  const response = await api.get(`/cart-items/cart/${cartId}`);
  return response.data.data;
};