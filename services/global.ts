import axios from "./axiosInstance";
import axiosLib from "axios";
import { APIURLS } from "./apiconfig";
import { QueryFunctionContext } from "@tanstack/react-query";

/* =====================================================
   GET AUTHENTICATED API
===================================================== */

export const getApiMethos = async <T>({
  queryKey,
  signal,
}: QueryFunctionContext<readonly unknown[]>): Promise<T> => {
  const [, apiConstant, query_string] = queryKey as [
    string,
    string,
    string
  ];

  const api =
    `${apiConstant}${query_string || ""}`;

  // console.log("GET:", api);

  const response =
    await axios.get<T>(api, {
      signal,
    });

  return response.data;
};

/* =====================================================
   GET PUBLIC API
===================================================== */

export const getPublicApiMethod = async <T>({
  queryKey,
  signal,
}: QueryFunctionContext<readonly unknown[]>): Promise<T> => {
  const [, apiConstant, query_string] = queryKey as [
    string,
    string,
    string
  ];

  const api = `${apiConstant}${query_string || ""}`;

  const response = await axios.get<T>(api, {
    signal,
  });

  return response.data;
};

/* =====================================================
   FETCH API
===================================================== */

export const fetchApi = async <T>(
  apiConstant: string,
  query_string = "",
): Promise<T> => {
  const api = `${apiConstant}${query_string}`;

  // console.log("FETCH API:", api);

  const response = await axios.get<T>(api);

  return response.data;
};

/* =====================================================
   POST
===================================================== */

export const postApiMethod = async (
  apiUrl: string,
  body:
    | Record<string, unknown>
    | FormData
    | URLSearchParams,
) => {
  try {
    // console.log("POST API:", apiUrl);
    // console.log("POST BODY:", body);

    const response = await axios.post(
      apiUrl,
      body,
    );

    return response.data;
  } catch (error) {
    // console.error(
    //   "POST error:",
    //   apiUrl,
    //   error
    // );

    throw error;
  }
};

/* =====================================================
   PUT
===================================================== */

export const putApiMethod = async (
  apiUrl: string,
  body:
    | Record<string, unknown>
    | FormData,
) => {
  try {
    // console.log("PUT API:", apiUrl);
    // console.log("PUT BODY:", body);

    const response = await axios.put(
      apiUrl,
      body,
    );

    return response.data;
  } catch (error) {
    // console.error(
    //   "PUT error:",
    //   apiUrl,
    //   error
    // );

    throw error;
  }
};

/* =====================================================
   PATCH
===================================================== */

export const patchApiMethod = async (
  apiUrl: string,
  body:
    | Record<string, unknown>
    | FormData,
) => {
  try {
    // console.log("PATCH API:", apiUrl);

    const response = await axios.patch(
      apiUrl,
      body,
    );

    return response.data;
  } catch (error) {
    // console.error(
    //   "PATCH error:",
    //   apiUrl,
    //   error
    // );

    throw error;
  }
};

/* =====================================================
   GENERIC API METHOD
===================================================== */

export const apiMethod = async (
  method:
    | "post"
    | "put"
    | "patch"
    | "delete"
    | "get",
  apiUrl: string,
  body?: Record<string, unknown> | FormData,
) => {
  try {
    // console.log(
    //   `${method.toUpperCase()} ${apiUrl}`
    // );

    const config: any = {
      method,
      url: apiUrl,
    };

    if (
      body !== undefined &&
      method !== "delete" &&
      method !== "get"
    ) {
      config.data = body;
    }

    const response = await axios(config);

    // console.log(
    //   `${method.toUpperCase()} STATUS:`,
    //   response.status
    // );

    return response.data;
  } catch (error) {
    // console.error(
    //   `${method.toUpperCase()} ERROR:`,
    //   error
    // );

    throw error;
  }
};

/* =====================================================
   VIDEO UPLOAD
===================================================== */

export const postVideoMethod = async (
  apiUrl: string,
  file: File,
  onUploadProgress?: (
    progress: number
  ) => void,
  controller?: AbortController,
) => {
  const formData = new FormData();

  const fullUrl =
    `${APIURLS.baseUrl}${apiUrl}`;

  const param =
    new URL(fullUrl).searchParams.get("type");

  formData.append(
    param === "course-attachments"
      ? "attachment"
      : "lectureFiles",
    file,
  );

  try {
    const config = {
      signal: controller?.signal,

      onUploadProgress: (
        event: import("axios").AxiosProgressEvent
      ) => {
        if (event.total) {
          const progress = Math.round(
            (event.loaded * 100) /
            event.total
          );

          onUploadProgress?.(progress);
        }
      },

      headers: {
        "Content-Type":
          "multipart/form-data",
      },
    };

    const response =
      await axios.post(
        apiUrl,
        formData,
        config
      );

    return response.data;
  } catch (error: unknown) {
    if (
      axiosLib.isCancel(error)
    ) {
      // console.warn(
      //   "Upload canceled by user"
      // );
    } else {
      // console.error(
      //   "Video upload failed:",
      //   error
      // );
    }

    throw error;
  }
};