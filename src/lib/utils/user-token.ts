import { cookies } from "next/headers";

/**
 * Retrieves the user's authentication token from cookies.
 * This helper is designed for use in Server Actions and Server Components.
 */
export async function getUserToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get("token")?.value;
}
