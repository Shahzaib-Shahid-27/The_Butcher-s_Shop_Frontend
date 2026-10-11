
// CREATE PRODUCT TYPE
export interface CreateProductType {
  name: string;
  description: string;
  price: number;
  stock: number;
  image?: string;
  isActive?: boolean;
  categoryId?: string;
}

// UPDATE PRODUCT TYPE
export interface UpdateProductType {
  name?: string;
  description?: string;
  price?: number;
  stock?: number;
  image?: string | null;
  categoryId?: string;
  isActive?: boolean;
}

// PRODUCT RESPONSE TYPE
export interface ProductResponse {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  image?: string | null;
  isActive: boolean;
  categoryId: string;
  createdAt: string;
  updatedAt: string;
}
