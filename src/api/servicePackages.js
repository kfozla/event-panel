import apiClient from "./apiClient";

export const getServicePackages = async () => {
  try {
    const response = await apiClient.get("/servicepackage");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getServicePackageById = async (id) => {
  try {
    const response = await apiClient.get(`/servicePackage/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const createServicePackage = async (data) => {
  try {
    const response = await apiClient.post("/servicePackage", data);
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const updateServicePackage = async (id, data) => {
  try {
    const response = await apiClient.put(`/servicePackage/${id}`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const deleteServicePackage = async (id) => {
  try {
    const response = await apiClient.delete(`/servicePackage/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
