import apiClient from "./apiClient";

export const getUserById = (id) => {
  return apiClient.get(`/user/${id}`);
};

export const updateUser = (id, data) => {
  return apiClient.put(`/user/${id}`, data);
};
export const deleteUser = (id) => {
  return apiClient.delete(`/user/${id}`);
};
export const getAllUsers = () => {
  return apiClient.get("/user");
};
export const getUserMediaCount = (userId) => {
  return apiClient.get(`/user/${userId}/mediaCount`);
};
export const getUserMediaList = (userId) => {
  return apiClient.get(`/user/${userId}/media`);
};
export const addUser = (data) => {
  return apiClient.post("/user", data);
};
