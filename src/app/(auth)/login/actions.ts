"use server";

import { fetcher, poster } from "@/lib/base.api";
import { cookies } from "next/headers";

interface LoginResult {
  success?: boolean;
  error?: string;
}

export interface UserProfile {
  id?: string;
  email?: string;
  name?: string;
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
      user?: UserProfile;
    }>("/auth/signin", { email, password }, false);

    const flatResponse = response as unknown as Record<
      string,
      unknown
    >;
    const token =
      response.data?.accessToken ||
      response.data?.token ||
      (flatResponse?.accessToken as string | undefined) ||
      (flatResponse?.token as string | undefined);

    const refreshToken =
      response.data?.refreshToken || (flatResponse?.refreshToken as string | undefined);

    const user =
      response.data?.user || (flatResponse?.user as UserProfile | undefined);

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

    if (user) {
      cookieStore.set("user", JSON.stringify(user), {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 7,
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
    cookieStore.delete("user");
  }
}

export async function getCurrentUserAction(): Promise<UserProfile | null> {
  try {
    const cookieStore = await cookies();
    const userCookie = cookieStore.get("user")?.value;
    if (userCookie) {
      try {
        return JSON.parse(userCookie);
      } catch {
        // Invalid JSON in cookie
      }
    }

    const token = cookieStore.get("token")?.value;
    if (!token) return null;

    const user = await fetcher<UserProfile>("/auth/me");
    if (user) {
      cookieStore.set("user", JSON.stringify(user), {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
        sameSite: "lax",
      });
      return user;
    }
  } catch (err) {
    console.error("Failed to fetch current user:", err);
  }
  return null;
}
