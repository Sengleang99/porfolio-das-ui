"use server";

import ApiResponse from "@/types/ApiResponse";
import { mapStatusCodeToException } from "./errors/error-mapper";
import { getUserToken } from "./utils/user-token";
import { cookies } from "next/headers";

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

const refreshTokens = async (): Promise<string | null> => {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get("refreshToken")?.value;
    if (!refreshToken) {
      return null;
    }

    const reqHeaders = new Headers({
      "Content-Type": "application/json",
    });
    if (process.env.X_API_KEY) {
      reqHeaders.set("x-api-key", process.env.X_API_KEY);
    }
    reqHeaders.set("Authorization", `Bearer ${refreshToken}`);

    const response = await fetch(`${process.env.BACKEND_API_BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: reqHeaders,
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      cookieStore.delete("token");
      cookieStore.delete("refreshToken");
      return null;
    }

    const json: ApiResponse<{ accessToken?: string; token?: string; refreshToken?: string }> = await response.json();
    const rawData = json.data || (json as any);
    const newAccessToken = rawData?.accessToken || rawData?.token;
    const newRefreshToken = rawData?.refreshToken;

    if (newAccessToken) {
      cookieStore.set("token", newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
        sameSite: "lax",
      });

      if (newRefreshToken) {
        cookieStore.set("refreshToken", newRefreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          maxAge: 60 * 60 * 24 * 7,
          path: "/",
          sameSite: "lax",
        });
      }
      return newAccessToken;
    }
    return null;
  } catch (error) {
    console.error("Failed to refresh tokens:", error);
    return null;
  }
};

const fetchWithRetry = async (
  input: string,
  init?: RequestInit,
  includeToken: boolean = true,
): Promise<Response> => {
  let response = await fetch(input, init);

  if (response.status === 401 && includeToken) {
    console.log("Token expired (401), attempting silent refresh...");
    const newToken = await refreshTokens();
    if (newToken) {
      console.log("Refresh successful, retrying request...");
      const newHeaders = new Headers(init?.headers);
      newHeaders.set("Authorization", `Bearer ${newToken}`);
      response = await fetch(input, {
        ...init,
        headers: newHeaders,
      });
    }
  }

  return response;
};

const fetcher = async <T>(
  path: string,
  next?: NextFetchRequestConfig | undefined,
  { includeToken = true }: { includeToken?: boolean } = {},
): Promise<T> => {
  const reqHeaders = await buildJsonHeaders(includeToken);
  const response = await fetchWithRetry(
    `${process.env.BACKEND_API_BASE_URL}${path}`,
    {
      headers: reqHeaders,
      next: next,
    },
    includeToken,
  );

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
  const response = await fetchWithRetry(
    `${process.env.BACKEND_API_BASE_URL}${path}`,
    {
      method: "POST",
      headers: reqHeaders,
      body: JSON.stringify(body),
    },
    includeToken,
  );

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
  const response = await fetchWithRetry(
    `${process.env.BACKEND_API_BASE_URL}${path}`,
    {
      method: "PATCH",
      headers: reqHeaders,
      body: JSON.stringify(body),
    },
    includeToken,
  );

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
  const response = await fetchWithRetry(
    `${process.env.BACKEND_API_BASE_URL}${path}`,
    {
      method: "DELETE",
      headers: reqHeaders,
    },
    includeToken,
  );

  if (!response.ok) {
    await handleResponseError(response);
  }

  const json: ApiResponse<T> = await response.json();
  return json;
};

export { fetcher, poster, updater, deleter };
