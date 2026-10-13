import api from "../api/api";

export const registerUser = async (data: {name: string;email: string;password: string;}) => {
  const response = await api.post("/auth/register", data);
  return response.data;
};

export const loginUser = async (data: {email: string;password: string;}) => {
  const response = await api.post("/auth/login", data);
  return response.data;
};

export const getProfile = async (accessToken: string) => {
  const response = await api.get("/auth/get-profile", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return response.data;
};

export const forgotPassword = async (data: { email: string }) => {
  const response = await api.post("/auth/forgot-password", data);
  return response.data;
};

export const resetPassword = async (data: {email: string;newPassword: string;}) => {
  const response = await api.post("/auth/reset-password", data);
  return response.data;
};
