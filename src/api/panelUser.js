import apiClient from "./apiClient";

export const uploadPanelUserProfilePicture = (file) => {
  const formData = new FormData();
  formData.append("file", file); // Backend IFormFile file bekliyor
  return apiClient.post(`/panelUsers/uploadProfilePicture`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
export const getPanelUser = () => {
  try {
    const response = apiClient.get(`/panelUsers`);
    return response;
  } catch (error) {
    console.error(`Error fetching panel user with id :`, error);
    throw error;
  }
};
export const updatePanelUser = (data) => {
  try {
    const response = apiClient.put(`/panelUsers`, data);
    return response;
  } catch (error) {
    console.error(`Error updating panel user:`, error);
    throw error;
  }
};
export const changePanelUserPassword = (oldPassword, newPassword) => {
  try {
    const response = apiClient.put(`/panelUsers/changePassword`, {
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
export const getPanelUserEvents = () => {
  try {
    const response = apiClient.get("/panelUsers/events");
    return response;
  } catch (error) {
    console.error("Error fetching panel user events:", error);
    throw error;
  }
};
export const addPanelUser = (userData) => {
  try {
    const response = apiClient.post("/panelUsers", userData);
    return response.data;
  } catch (error) {
    console.error("Error adding panel user:", error);
    throw error;
  }
};
export const deletePanelUser = (userId) => {
  try {
    const response = apiClient.delete(`/panelUsers/${userId}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting panel user with id ${userId}:`, error);
    throw error;
  }
};
export const getPanelUserAll = async () => {
  try {
    const response = await apiClient.get("/panelUsers/all");
    return response.data;
  } catch (error) {
    console.error("Error fetching panel user list:", error);
    throw error;
  }
};
export const getPanelUserById = async (userId) => {
  try {
    const response = await apiClient.get(`/panelUsers/${userId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching panel user with id ${userId}:`, error);
    throw error;
  }
};
export const getPanelUserEventsById = async (userId) => {
  try {
    const response = await apiClient.get(`/panelUsers/${userId}/events`);
    return response.data;
  } catch (error) {
    console.error(
      `Error fetching events for panel user with id ${userId}:`,
      error
    );
    throw error;
  }
};
export const changeServicePackage = async (userId, servicePackageId) => {
  try {
    const response = await apiClient.put(
      `/panelUsers/${userId}/changeServicePackage?servicePackageId=${servicePackageId}`
    );
    return response.data;
  } catch (error) {
    console.error(
      `Error changing service package for panel user with id ${userId}:`,
      error
    );
    throw error;
  }
};
export const getPanelUserRandevular = async (userId) => {
  try {
    const response = await apiClient.get(`/panelUsers/${userId}/randevular`);
    return response.data;
  } catch (error) {
    console.error(
      `Error fetching randevular for panel user with id ${userId}:`,
      error
    );
    throw error;
  }
};
