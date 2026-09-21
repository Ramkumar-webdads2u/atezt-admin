import axios from "axios";
import { APIURLS } from "./apiconfig";
import { getAccessToken, clearAuthCookies } from "./authCookie";

const axiosInstance = axios.create({
  baseURL: APIURLS.baseUrl,

  // Don't wait 1-2 minutes for a dead tunnel/backend
  timeout: 20000,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = getAccessToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // console.log(
    //   "API REQUEST:",
    //   config.method?.toUpperCase(),
    //   `${config.baseURL}${config.url}`
    // );

    // console.log(
    //   "TOKEN:",
    //   token
    //     ? "FOUND"
    //     : "NOT FOUND"
    // );

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

axiosInstance.interceptors.response.use(
  (response) => {
    // console.log(
    //   "API RESPONSE:",
    //   response.status,
    //   response.config.method?.toUpperCase(),
    //   response.config.url
    // );

    return response;
  },

  (error) => {
    // console.error(
    //   "API ERROR:",
    //   error.config?.method?.toUpperCase(),
    //   error.config?.url,
    //   error.response?.status,
    //   error.code,
    //   error.message
    // );

    if (error.response?.status === 401) {
      clearAuthCookies();

      window.location.href = "/";
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
