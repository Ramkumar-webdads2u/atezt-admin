"use client";

import { useMutation, UseMutationResult } from "@tanstack/react-query";

import axios from "@/services/axiosInstance";

type HttpMethod = "post" | "put" | "patch" | "delete" | "get";

interface MutationVariables {
  url: {
    apiUrl: string;
  };

  body?: Record<string, unknown> | FormData;
}

const useApiMutation = (
  method: HttpMethod,
): UseMutationResult<any, unknown, MutationVariables> => {
  return useMutation({
    mutationFn: async ({ url, body }: MutationVariables) => {
      // console.log(
      //   `${method.toUpperCase()} REQUEST`
      // );

      // console.log(
      //   "URL:",
      //   url.apiUrl
      // );

      // console.log(
      //   "BODY:",
      //   body
      // );

      const response = await axios.request({
        method,
        url: url.apiUrl,
        data: method === "delete" || method === "get" ? undefined : body,
      });

      // console.log(
      //   `${method.toUpperCase()} RESPONSE:`,
      //   response.status,
      //   response.data
      // );

      return response.data;
    },
  });
};

export default useApiMutation;
