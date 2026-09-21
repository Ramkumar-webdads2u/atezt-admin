import axios from "./axiosInstance";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  access_token: string;
  refresh_token: string;
  is_active: boolean;
}

// =====================================================
// TOKEN FUNCTIONS
// =====================================================

import {
  setAuthCookies,
  getAccessToken as getCookieAccessToken,
  getRefreshToken as getCookieRefreshToken,
  clearAuthCookies,
} from "./authCookie";

export const setToken = (
  accessToken: string,
  refreshToken?: string,
) => {
  setAuthCookies(accessToken, refreshToken);
};

export const getToken = () => getCookieAccessToken();

export const getAccessToken = () => getCookieAccessToken();

export const getRefreshToken = () => getCookieRefreshToken();

export const getUserId = () => {
  if (typeof document === "undefined") return null;
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith("user_id="));
  return match ? decodeURIComponent(match.slice("user_id=".length)) : null;
};

export const clearToken = () => {
  clearAuthCookies();
  if (typeof document !== "undefined") {
    document.cookie = "user_id=; Path=/; Max-Age=0; SameSite=Lax";
  }
};

export const clearTokens = clearToken;

// =====================================================
// LOGIN API
// =====================================================

export const loginApiMethod = async (payload: {
  url: {
    apiUrl: string;
  };
  body: LoginPayload;
}): Promise<LoginResponse> => {
  console.log("🔐 LOGIN REQUEST");

  console.log(
    "Endpoint:",
    payload.url.apiUrl
  );

  console.log("Payload:", {
    email: payload.body.email,
    password: "********",
  });

  const response =
    await axios.post<LoginResponse>(
      payload.url.apiUrl,
      payload.body
    );

  console.log(
    "✅ LOGIN RESPONSE:",
    response.data
  );

  return response.data;
};