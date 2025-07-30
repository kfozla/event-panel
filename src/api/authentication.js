import apiClient from "./apiClient";

export const registerUser = async (userData) => {
  try {
    const response = await apiClient.post("/auth/register", userData);
    return response.data;
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
};
export const loginUser = async (credentials) => {
  try {
    const response = await apiClient.post("/auth/login", credentials);
    return response.data;
  } catch (error) {
    console.error("Error logging in user:", error);
    throw error;
  }
};
export const getLoggedInUser = async (username) => {
  try {
    const response = await apiClient.get(`/auth/user/${username}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching logged-in user:", error);
    throw error;
  }
};
export const logoutUser = async (refreshToken) => {
  try {
    const response = await apiClient.post("/auth/logout", { refreshToken });
    return response.data;
  } catch (error) {
    console.error("Error logging out user:", error);
    throw error;
  }
};
export const refreshToken = async (refreshToken) => {
  try {
    const response = await apiClient.post("/auth/refresh", { refreshToken });
    return response.data;
  } catch (error) {
    console.error("Error refreshing token:", error);
    throw error;
  }
};
