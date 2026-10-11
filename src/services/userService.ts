import api from "../api/api";

export const getProfile = async () => {
  const token = localStorage.getItem("accessToken");

  const response = await api.get("/auth/get-profile", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};