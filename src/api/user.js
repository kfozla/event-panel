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

export const uploadMedia = async (formData) => {
  try {
    const response = await apiClient.post(
      `/user/${formData.get("userId")}/media`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response;
  } catch (error) {
    console.error("Error uploading images:", error);
    throw error;
  }
};
export const getUserByUsernameandSession = async (username, sessionId) => {
  try {
    const response = await apiClient.get(
      `/user/getByUsername/${username}/sessionId/${sessionId}`
    );
    return response;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      // 404 ise hiçbir log yazma, sadece null dön
      return null;
    }
    console.error("Error fetching user by username and session:", error);
    throw error;
  }
};
