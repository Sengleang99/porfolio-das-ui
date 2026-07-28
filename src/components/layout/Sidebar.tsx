"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { mainNavItems, bottomNavItems } from "@/lib/routes";
import { useSidebar } from "@/context/SidebarContext";
import { useMessages } from "@/context/MessagesContext";

// ─── Inner nav content (shared between desktop & mobile) ──────────────────────
function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const { unreadCount } = useMessages();

  return (
    <>
      {/* ── Brand ── */}
      <div className="flex items-center gap-2.5 px-5 h-16 border-b border-slate-100 shrink-0">
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-600 to-blue-500 shadow-sm shrink-0" />
        <span className="font-bold text-slate-800 text-sm tracking-tight">
          Dev<span className="text-indigo-600">Portfolio</span>
        </span>
      </div>

      {/* ── Main Nav ── */}
      <nav className="flex-1 py-5 px-3 flex flex-col gap-0.5 overflow-y-auto">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 px-3 mb-3">
          Main Menu
        </p>

        {mainNavItems.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");
          const badgeCount =
            item.href === "/messages" ? unreadCount : (item.badge ?? 0);

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={`
                                relative flex items-center justify-between px-3 py-2.5 rounded-xl
                                text-sm font-medium transition-all duration-200 select-none
                                ${
                                  isActive
                                    ? "bg-indigo-50 text-indigo-700"
                                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                                }
                            `}
            >
              {/* Active left bar */}
              {isActive && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full bg-indigo-600" />
              )}
              <span>{item.label}</span>
              {badgeCount > 0 && (
                <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-[10px] font-bold rounded-full bg-indigo-600 text-white">
                  {badgeCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* ── Divider ── */}
      <div className="mx-4 h-px bg-slate-100 shrink-0" />

      {/* ── Bottom nav ── */}
      <div className="py-4 px-3 flex flex-col gap-0.5 shrink-0">
        {bottomNavItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={`
                                relative flex items-center px-3 py-2.5 rounded-xl
                                text-sm font-medium transition-all duration-200 select-none
                                ${
                                  isActive
                                    ? "bg-indigo-50 text-indigo-700"
                                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                                }
                            `}
            >
              {isActive && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full bg-indigo-600" />
              )}
              {item.label}
            </Link>
          );
        })}
      </div>
    </>
  );
}

// ─── Sidebar Component ────────────────────────────────────────────────────────
export default function Sidebar() {
  const { isOpen, close } = useSidebar();

  // Close drawer when pressing Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [close]);

  return (
    <>
      {/* ══ DESKTOP sidebar — always visible on lg+ ════════════════════ */}
      <aside
        className="
                hidden lg:flex flex-col
                w-56 h-screen shrink-0 z-40
                relative bg-white border-r border-slate-100
                shadow-[2px_0_12px_rgba(0,0,0,0.04)]
            "
      >
        {/* Decorative gradient strip */}
        <div className="absolute top-0 left-0 w-0.5 h-full bg-gradient-to-b from-indigo-600 via-blue-400 to-transparent" />
        <SidebarContent />
      </aside>

      {/* ══ MOBILE drawer ═════════════════════════════════════════════ */}

      {/* Backdrop */}
      <div
        className={`
                    fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm
                    lg:hidden transition-opacity duration-300
                    ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
                `}
        onClick={close}
        aria-hidden="true"
      />

      {/* Drawer panel */}
      <aside
        className={`
                    fixed top-0 left-0 z-50 h-full w-64 flex flex-col
                    bg-white border-r border-slate-100 shadow-2xl
                    lg:hidden
                    transition-transform duration-300 ease-in-out
                    ${isOpen ? "translate-x-0" : "-translate-x-full"}
                `}
        aria-label="Mobile navigation"
      >
        {/* Decorative gradient strip */}
        <div className="absolute top-0 left-0 w-0.5 h-full bg-gradient-to-b from-indigo-600 via-blue-400 to-transparent" />

        {/* Close button (top-right of drawer) */}
        <button
          onClick={close}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors z-10"
          aria-label="Close sidebar"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-5 h-5"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <SidebarContent onNavigate={close} />
      </aside>
    </>
  );
}
