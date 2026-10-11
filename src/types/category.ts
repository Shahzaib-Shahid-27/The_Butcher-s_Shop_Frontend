
export interface CreateCategoryType {
  name: string;
  description?: string;
  image?: string;
  isActive?: boolean;
}

export interface UpdateCategoryType {
  name?: string;
  description?: string;
  image?: string;
  isActive?: boolean;
}

export interface CategoryResponse {
  id: string;
  name: string;
  description?: string | null;
  image?: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}