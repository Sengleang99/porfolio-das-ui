"use server";

import { poster } from "@/lib/base.api";
import { cookies } from "next/headers";

interface LoginResult {
  success?: boolean;
  error?: string;
}

export async function loginAction(
  credentials: Record<string, string>,
): Promise<LoginResult> {
  const { email, password } = credentials;

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  try {
    const response = await poster<{
      accessToken?: string;
      token?: string;
      refreshToken?: string;
    }>("/auth/signin", { email, password }, false);

    const flatResponse = response as unknown as Record<
      string,
      string | undefined
    >;
    const token =
      response.data?.accessToken ||
      response.data?.token ||
      flatResponse?.accessToken ||
      flatResponse?.token;

    const refreshToken =
      response.data?.refreshToken || flatResponse?.refreshToken;

    if (!token) {
      return {
        error: response.message || "Failed to retrieve authentication token.",
      };
    }

    const cookieStore = await cookies();
    cookieStore.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
      sameSite: "lax",
    });

    if (refreshToken) {
      cookieStore.set("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: "/",
        sameSite: "lax",
      });
    }

    return { success: true };
  } catch (err: unknown) {
    const errorMessage =
      err instanceof Error
        ? err.message
        : "Sign in failed. Please check your credentials.";
    return { error: errorMessage };
  }
}

export async function logoutAction(): Promise<void> {
  try {
    await poster("/auth/signout", {});
  } catch (err) {
    console.error("Backend signout failed:", err);
  } finally {
    const cookieStore = await cookies();
    cookieStore.delete("token");
    cookieStore.delete("refreshToken");
  }
}
