import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:5176/api",
  timeout: 10000, // Set a timeout for requests
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiClient;
