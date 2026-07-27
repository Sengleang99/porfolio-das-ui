import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function isTokenExpired(token: string): boolean {
  try {
    const [, payloadBase64] = token.split(".");
    const normalizedPayload = payloadBase64
      .replace(/-/g, "+")
      .replace(/_/g, "/");
    const payloadDecoded = atob(normalizedPayload);
    const payload = JSON.parse(payloadDecoded);
    if (payload && typeof payload.exp === "number") {
      // 10-second buffer to prevent race conditions
      return Date.now() >= (payload.exp - 10) * 1000;
    }
  } catch {
    return true;
  }
  return false;
}

export async function middleware(request: NextRequest) {
  let token = request.cookies.get("token")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;
  const { pathname } = request.nextUrl;
  const isPublicPath = pathname === "/login";

  const refreshResponseCookies: {
    name: string;
    value: string;
    options?: Record<string, string | boolean | number>;
  }[] = [];

  // If token exists and is expired, try to refresh it
  if (token && isTokenExpired(token)) {
    if (refreshToken) {
      console.log("Middleware: Token expired, attempting silent refresh...");
      try {
        const refreshResponse = await fetch(
          `${process.env.BACKEND_API_BASE_URL}/auth/refresh`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-api-key": process.env.X_API_KEY || "",
              Authorization: `Bearer ${refreshToken}`,
            },
            body: JSON.stringify({ refreshToken }),
          },
        );

        if (refreshResponse.ok) {
          const json = await refreshResponse.json();
          const rawData = json.data || json;
          const newAccessToken = rawData?.accessToken || rawData?.token;
          const newRefreshToken = rawData?.refreshToken;

          if (newAccessToken) {
            console.log("Middleware: Silent refresh successful!");
            token = newAccessToken;

            // Prepare cookies to be set on the response
            refreshResponseCookies.push({
              name: "token",
              value: newAccessToken,
              options: {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                maxAge: 60 * 60 * 24 * 7,
                path: "/",
                sameSite: "lax",
              },
            });

            if (newRefreshToken) {
              refreshResponseCookies.push({
                name: "refreshToken",
                value: newRefreshToken,
                options: {
                  httpOnly: true,
                  secure: process.env.NODE_ENV === "production",
                  maxAge: 60 * 60 * 24 * 7,
                  path: "/",
                  sameSite: "lax",
                },
              });
            }

            // Update request cookies for downstream rendering
            request.cookies.set("token", newAccessToken);
            if (newRefreshToken) {
              request.cookies.set("refreshToken", newRefreshToken);
            }
          } else {
            console.warn(
              "Middleware: Refresh response missing token. Logging out.",
            );
            token = undefined;
          }
        } else {
          console.warn(
            "Middleware: Refresh API returned error status. Logging out.",
          );
          token = undefined;
        }
      } catch (err) {
        console.error("Middleware: Refresh call failed:", err);
        token = undefined;
      }
    } else {
      console.log(
        "Middleware: Token expired and no refresh token available. Logging out.",
      );
      token = undefined;
    }
  }

  // 1. If user is signed in and attempts to access `/login` or `/`, redirect them to `/dashboard`
  if (token && (pathname === "/login" || pathname === "/")) {
    const response = NextResponse.redirect(new URL("/dashboard", request.url));
    for (const cookie of refreshResponseCookies) {
      response.cookies.set(cookie.name, cookie.value, cookie.options);
    }
    return response;
  }

  // 2. If user is NOT signed in and attempts to access protected routes, redirect to `/login`
  if (!token && !isPublicPath) {
    const response = NextResponse.redirect(new URL("/login", request.url));
    response.cookies.delete("token");
    response.cookies.delete("refreshToken");
    return response;
  }

  // 3. Otherwise, proceed
  const response = NextResponse.next({
    request: {
      headers: new Headers(request.headers),
    },
  });

  for (const cookie of refreshResponseCookies) {
    response.cookies.set(cookie.name, cookie.value, cookie.options);
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, icons, etc.)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*$).*)",
  ],
};
