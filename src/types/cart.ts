export interface CreateCartType {
  userId: string;
}

export interface UpdateCartType {
  userId?: string;
}

export interface CartResponse {
  id: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}