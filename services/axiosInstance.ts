import axios from "axios";
import { APIURLS } from "./config";
import { getAccessToken, clearAuthCookies } from "./authCookie";

const axiosInstance = axios.create({
  baseURL: APIURLS.baseUrl,
});
// axiosInstance.defaults.headers['ngrok-skip-browser-warning'] = true
// axiosInstance.defaults.headers.common["ngrok-skip-browser-warning"] = "true";

axiosInstance.interceptors.request.use((config) => {
  config.headers = config.headers || {};
  
  config.headers["ngrok-skip-browser-warning"] = "true";

  const token = getAccessToken();
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }

  return config;
});

axiosInstance.interceptors.response.use(
  (res) => res,
  (error) => {
    // console.log(error);
    
    if (error.response?.status === 401) {
      console.warn("Token expired or unauthorized");

      // Remove old token
      clearAuthCookies();

      // Redirect to login
      window.location.href = "/";
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;