import apiClient from "./apiClient";

export const getEvents = async () => {
  try {
    const response = await apiClient.get("/events");
    return response;
  } catch (error) {
    console.error("Error fetching events:", error);
    throw error;
  }
};
export const getEventById = async (id) => {
  try {
    const response = await apiClient.get(`/events/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching event with id ${id}:`, error);
    throw error;
  }
};
export const createEvent = async (data) => {
  try {
    const response = await apiClient.post("/events", data);
    return response.data;
  } catch (error) {
    console.error("Error creating event:", error);
    throw error;
  }
};
export const updateEvent = async (id, data) => {
  try {
    const response = await apiClient.put(`/events/${id}`, data);
    return response.data;
  } catch (error) {
    console.error(`Error updating event with id ${id}:`, error);
    throw error;
  }
};
export const deleteEvent = async (id) => {
  try {
    const response = await apiClient.delete(`/events/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting event with id ${id}:`, error);
    throw error;
  }
};
export const getEventMediaList = async (eventId) => {
  try {
    const response = await apiClient.get(`/events/${eventId}/medias`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching media for event with id ${eventId}:`, error);
    throw error;
  }
};
export const getEventUserList = async (eventId) => {
  try {
    const response = await apiClient.get(`/events/${eventId}/users`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching users for event with id ${eventId}:`, error);
    throw error;
  }
};
