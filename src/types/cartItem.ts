export interface CreateCartItemType {
  cartId: string;
  productId: string;
  quantity: number;
}

export interface UpdateCartItemType {
  quantity?: number;
}

export interface CartItemResponse {
  id: string;
  cartId: string;
  productId: string;
  quantity: number;
  createdAt: string;
  updatedAt: string;
}