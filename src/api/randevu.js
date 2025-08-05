import apiClient from "./apiClient";

export const createRandevu = async (randevuData) => {
  const response = await apiClient.post("/randevu", randevuData);
  return response.data;
};

export const getRandevuById = async (id) => {
  const response = await apiClient.get(`/randevu/${id}`);
  return response.data;
};

export const updateRandevu = async (id, randevuData) => {
  const response = await apiClient.put(`/randevu/${id}`, randevuData);
  return response.data;
};

export const deleteRandevu = async (id) => {
  const response = await apiClient.delete(`/randevu/${id}`);
  return response.data;
};
export const getAllRandevular = async () => {
  const response = await apiClient.get("/randevu");
  return response.data;
};
