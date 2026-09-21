import { useMutation } from "@tanstack/react-query";
import { useRouter } from "@/components/navigation";

import {
  loginApiMethod,
  setToken,
  LoginResponse,
} from "../../services/authService";

import { showToast } from "@/lib/toastSonner";

interface LoginPayload {
  email: string;
  password: string;
}

interface LoginApiProps {
  url: {
    apiUrl: string;
  };

  body: LoginPayload;
}

interface ErrorResponse {
  message?: string;
  detail?: string;
}

export default function useLoginMutation() {
  const router = useRouter();

  return useMutation<LoginResponse, unknown, LoginApiProps>({
    mutationFn: loginApiMethod,

    onSuccess: (data) => {
      console.log("✅ LOGIN SUCCESS");
      console.log("Login data:", data);

      if (!data.success) {
        showToast.error(data.message || "Login failed");
        return;
      }

      if (!data.is_active) {
        showToast.error("Your account is inactive");
        return;
      }

      if (!data.access_token) {
        showToast.error("Access token not received");
        return;
      }

      setToken(data.access_token, data.refresh_token);

      showToast.success(data.message || "Login successful");

      // Direct Dashboard
      router.replace("/dashboard");
    },

    // =================================================
    // ERROR
    // =================================================

    onError: (error) => {
      console.error("Login mutation error:", error);

      const err = error as {
        response?: {
          data?: ErrorResponse;
        };

        message?: string;
      };

      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.detail ||
        err.message ||
        "Login error";

      showToast.error(errorMessage);
    },
  });
}
