import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:5176/api",
  timeout: 10000, // Set a timeout for requests
  headers: {
    "Content-Type": "application/json",
  },
});

// Sayfa reload sonrası token'ı header'a ekle
const token = sessionStorage.getItem("token");
if (token) {
  apiClient.defaults.headers.common["Authorization"] = "Bearer " + token;
}

// Token refresh interceptor
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    // Eğer 401 ise ve daha önce refresh denenmediyse
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      if (isRefreshing) {
        // Refresh işlemi devam ediyorsa, kuyruğa ekle
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers["Authorization"] = "Bearer " + token;
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }
      originalRequest._retry = true;
      isRefreshing = true;
      try {
        const refreshToken = sessionStorage.getItem("refreshToken");
        console.log(refreshToken);
        if (!refreshToken) throw new Error("No refresh token");
        // Refresh endpointine istek at
        const res = await apiClient.post("/auth/refresh", { refreshToken });
        const newAccessToken = res.data.accessToken;
        const newRefreshToken = res.data.refreshToken;
        // Tokenları güncelle
        sessionStorage.setItem("token", newAccessToken);
        sessionStorage.setItem("refreshToken", newRefreshToken);
        // authUser objesini de güncelle
        const authUser = JSON.parse(
          sessionStorage.getItem("authUser") || "null"
        );
        if (authUser) {
          authUser.token = newAccessToken;
          sessionStorage.setItem("authUser", JSON.stringify(authUser));
        }
        apiClient.defaults.headers.common["Authorization"] =
          "Bearer " + newAccessToken;
        processQueue(null, newAccessToken);

        console.log("Token refreshed successfully");
        // Orijinal isteği yeni token ile tekrar gönder
        originalRequest.headers["Authorization"] = "Bearer " + newAccessToken;
        return apiClient(originalRequest);
      } catch (err) {
        processQueue(err, null);
        // Refresh de başarısızsa, oturumu temizle ve login'e yönlendir
        sessionStorage.clear();
        window.location.href = "/login";
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
