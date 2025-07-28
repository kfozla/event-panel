import apiClient from "./apiClient";

export const getMediaList = async () => {
  try {
    const response = await apiClient.get("/medias");
    return response.data;
  } catch (error) {
    console.error("Error fetching media:", error);
    throw error;
  }
};
export const getMediaById = async (id) => {
  try {
    const response = await apiClient.get(`/medias/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching media with id ${id}:`, error);
    throw error;
  }
};
export const addMedia = async (userId, file) => {
  try {
    const formData = new FormData();
    formData.append("userId", userId);
    formData.append("media", file); // input[type='file'] ile seçilen dosya

    const response = await apiClient.post("/medias", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    console.error("Error adding media:", error);
    throw error;
  }
};
export const getMediaByUserId = async (userId) => {
  try {
    const response = await apiClient.get(`/medias/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching media for user with id ${userId}:`, error);
    throw error;
  }
};
export const getMediaByEventId = async (eventId) => {
  try {
    const response = await apiClient.get(`/medias/event/${eventId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching media for event with id ${eventId}:`, error);
    throw error;
  }
};
export const deleteMedia = async (id) => {
  try {
    const response = await apiClient.delete(`/medias/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting media with id ${id}:`, error);
    throw error;
  }
};
