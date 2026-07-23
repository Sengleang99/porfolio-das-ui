// ─────────────────────────────────────────────────────────────────────────────
// routes.ts — Global route configuration
// Edit this file to add, remove, or reorder navigation items.
// The Sidebar and Navbar automatically reflect these changes.
// ─────────────────────────────────────────────────────────────────────────────

export type NavItem = {
  label: string; // Display label shown in the sidebar
  href: string; // Route path (must match Next.js app directory)
  badge?: number; // Optional notification badge count (0 = hidden)
  description?: string; // Short subtitle shown in the Navbar
};

// ── Main navigation (shown in sidebar + navbar title) ────────────────────────
export const mainNavItems: NavItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    description: "Welcome back, here's what's happening",
  },
  {
    label: "Experience",
    href: "/experiences",
    description: "Your professional work history",
  },
  {
    label: "Education",
    href: "/education",
    description: "Academic background & certifications",
  },
  {
    label: "Case Studies",
    href: "/case-studies",
    description: "Deep-dive project breakdowns",
  },
  {
    label: "Messages",
    href: "/messages",
    badge: 3,
    description: "Your inbox & conversations",
  },
];

// ── Bottom navigation (settings, etc.) ───────────────────────────────────────
export const bottomNavItems: NavItem[] = [
  {
    label: "Settings",
    href: "/settings",
    description: "Manage your account preferences",
  },
];

// ── All routes combined (useful for lookups) ──────────────────────────────────
export const allNavItems: NavItem[] = [...mainNavItems, ...bottomNavItems];

// ── Helper: get page info by pathname ────────────────────────────────────────
export function getPageInfo(
  pathname: string,
): Pick<NavItem, "label" | "description"> {
  const match = allNavItems.find(
    (item) => pathname === item.href || pathname.startsWith(item.href + "/"),
  );
  return {
    label: match?.label ?? "Portfolio",
    description: match?.description ?? "Manage your portfolio",
  };
}
