import axios from "axios";

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_REAL_API_URL,
  timeout: 10000, // Set a timeout for requests
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiClient;
