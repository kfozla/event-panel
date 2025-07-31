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
export const updatePanelUser = (userId, data) => {
  try {
    const response = apiClient.put(`/panelUsers/${userId}`, data);
    return response;
  } catch (error) {
    console.error(`Error updating panel user with id ${userId}:`, error);
    throw error;
  }
};
export const changePanelUserPassword = (userId, oldPassword, newPassword) => {
  try {
    const response = apiClient.put(`/panelUsers/${userId}/changePassword`, {
      oldPassword,
      newPassword,
    });
    return response;
  } catch (error) {
    console.error(
      `Error changing password for panel user with id ${userId}:`,
      error
    );
    throw error;
  }
};
