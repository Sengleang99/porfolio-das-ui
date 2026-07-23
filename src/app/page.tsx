import { redirect } from "next/navigation";

// Root "/" redirects to the login page.
// Once authenticated, login redirects to /dashboard.
export default function RootPage() {
  redirect("/login");
}
