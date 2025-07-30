import apiClient from "./apiClient";

export const uploadPanelUserProfilePicture = (userId, file) => {
  const formData = new FormData();
  formData.append("file", file); // Backend IFormFile file bekliyor
  return apiClient.post(
    `/panelUsers/${userId}/uploadProfilePicture`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
};
export const getPanelUser = (userId) => {
  try {
    const response = apiClient.get(`/panelUsers/${userId}`);
    return response;
  } catch (error) {
    console.error(`Error fetching panel user with id ${userId}:`, error);
    throw error;
  }
};
