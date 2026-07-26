"use server";

import ApiResponse from "@/types/ApiResponse";
import { mapStatusCodeToException } from "./errors/error-mapper";
import { getUserToken } from "./utils/user-token";

const buildJsonHeaders = async (includeToken: boolean): Promise<Headers> => {
  const reqHeaders = new Headers({
    "Content-Type": "application/json",
  });

  if (process.env.X_API_KEY) {
    reqHeaders.set("x-api-key", process.env.X_API_KEY);
  }

  if (includeToken) {
    const token = await getUserToken();
    if (token) reqHeaders.set("Authorization", `Bearer ${token}`);
  }

  return reqHeaders;
};

const handleResponseError = async (response: Response): Promise<never> => {
  let errorMessage = response.statusText;
  try {
    const errorJson = await response.json();
    if (errorJson && errorJson.message) {
      errorMessage = Array.isArray(errorJson.message)
        ? errorJson.message.join(", ")
        : errorJson.message;
    }
  } catch {
    // Ignore JSON parsing errors
  }
  throw mapStatusCodeToException(response.status, errorMessage);
};

const fetcher = async <T>(
  path: string,
  next?: NextFetchRequestConfig | undefined,
  { includeToken = true }: { includeToken?: boolean } = {},
): Promise<T> => {
  const reqHeaders = await buildJsonHeaders(includeToken);
  const response = await fetch(`${process.env.BACKEND_API_BASE_URL}${path}`, {
    headers: reqHeaders,
    next: next,
  });

  if (!response.ok) {
    await handleResponseError(response);
  }

  const json: ApiResponse<T> = await response.json();
  return json.data;
};

const poster = async <T>(
  path: string,
  body: object,
  includeToken: boolean = true,
): Promise<ApiResponse<T>> => {
  const reqHeaders = await buildJsonHeaders(includeToken);
  const response = await fetch(`${process.env.BACKEND_API_BASE_URL}${path}`, {
    method: "POST",
    headers: reqHeaders,
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    await handleResponseError(response);
  }

  const json: ApiResponse<T> = await response.json();
  return json;
};

const updater = async <T>(
  path: string,
  body: object,
  includeToken: boolean = true,
): Promise<ApiResponse<T>> => {
  const reqHeaders = await buildJsonHeaders(includeToken);
  const response = await fetch(`${process.env.BACKEND_API_BASE_URL}${path}`, {
    method: "PATCH",
    headers: reqHeaders,
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    await handleResponseError(response);
  }

  const json: ApiResponse<T> = await response.json();
  return json;
};

const deleter = async <T>(
  path: string,
  includeToken: boolean = true,
): Promise<ApiResponse<T>> => {
  const reqHeaders = await buildJsonHeaders(includeToken);
  const response = await fetch(`${process.env.BACKEND_API_BASE_URL}${path}`, {
    method: "DELETE",
    headers: reqHeaders,
  });

  if (!response.ok) {
    await handleResponseError(response);
  }

  const json: ApiResponse<T> = await response.json();
  return json;
};

export { fetcher, poster, updater, deleter };
