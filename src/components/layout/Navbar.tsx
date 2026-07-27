"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { getPageInfo } from "@/lib/routes";
import { useSidebar } from "@/context/SidebarContext";
import { logoutAction } from "@/app/(auth)/login/actions";
import { useMessages } from "@/context/MessagesContext";

// ─── Icons ────────────────────────────────────────────────────────────────────
const IconSearch = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-4 h-4"
  >
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const IconBell = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-5 h-5"
  >
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);

const IconMessage = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-5 h-5"
  >
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

const IconChevronDown = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-3.5 h-3.5"
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const IconUser = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-4 h-4"
  >
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const IconLogOut = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-4 h-4"
  >
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

const IconSettings = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-4 h-4"
  >
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);

// ─── Notification data ────────────────────────────────────────────────────────
const notifications = [
  {
    id: 1,
    avatar: "JD",
    color: "from-violet-500 to-purple-400",
    name: "Jane Doe",
    action: "viewed your profile",
    time: "2m ago",
    unread: true,
  },
  {
    id: 2,
    avatar: "TK",
    color: "from-emerald-500 to-teal-400",
    name: "Tom Kraken",
    action: "sent you a message",
    time: "15m ago",
    unread: true,
  },
  {
    id: 3,
    avatar: "MR",
    color: "from-orange-500 to-amber-400",
    name: "Maria R.",
    action: "left a comment on Case Study #3",
    time: "1h ago",
    unread: false,
  },
];

// ─── Navbar Component ─────────────────────────────────────────────────────────
export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { toggle } = useSidebar();
  const { unreadCount } = useMessages();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  const handleSignOut = async () => {
    await logoutAction();
    router.push("/login");
  };

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const pageInfo = getPageInfo(pathname);
  const mockNotifUnreadCount = notifications.filter((n) => n.unread).length;

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
      if (
        profileRef.current &&
        !profileRef.current.contains(e.target as Node)
      ) {
        setShowProfile(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <header className="sticky top-0 z-30 h-16 flex items-center bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 gap-4 shadow-[0_1px_12px_rgba(0,0,0,0.04)]">
      {/* ── Hamburger — mobile only ── */}
      <button
        onClick={toggle}
        className="lg:hidden flex items-center justify-center w-9 h-9 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors shrink-0"
        aria-label="Toggle sidebar"
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
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>

      {/* ── Page Title ── */}
      <div className="flex-1 min-w-0">
        <h1 className="text-base font-bold text-slate-800 leading-tight truncate">
          {pageInfo.label}
        </h1>
        <p className="text-xs text-slate-400 leading-tight truncate hidden sm:block">
          {pageInfo.description}
        </p>
      </div>

      {/* ── Search Bar ── */}
      <div
        className={`
          hidden md:flex items-center gap-2 px-3 py-2 rounded-xl border
          transition-all duration-200 bg-slate-50
          ${
            searchFocused
              ? "border-indigo-300 shadow-[0_0_0_3px_rgba(99,102,241,0.12)] bg-white w-64"
              : "border-slate-200 w-48 hover:border-slate-300"
          }
        `}
      >
        <span className="text-slate-400 shrink-0">
          <IconSearch />
        </span>
        <input
          type="text"
          placeholder="Search…"
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
          className="bg-transparent text-sm text-slate-700 placeholder-slate-400 outline-none flex-1 min-w-0"
        />
        <kbd className="hidden lg:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-mono text-slate-400 bg-slate-200 border border-slate-300">
          ⌘K
        </kbd>
      </div>

      {/* ── Right Controls ── */}
      <div className="flex items-center gap-1.5">
        {/* Messages icon */}
        <Link
          href="/messages"
          className="relative flex items-center justify-center w-9 h-9 rounded-xl text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-200"
        >
          <IconMessage />
          {unreadCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-4 px-1 rounded-full bg-indigo-600 text-white text-[9px] font-bold flex items-center justify-center ring-2 ring-white">
              {unreadCount}
            </span>
          )}
        </Link>

        {/* Notifications dropdown */}
        <div ref={notifRef} className="relative">
          <button
            id="navbar-notifications-btn"
            onClick={() => {
              setShowNotifications((v) => !v);
              setShowProfile(false);
            }}
            className={`relative flex items-center justify-center w-9 h-9 rounded-xl transition-all duration-200 ${
              showNotifications
                ? "bg-indigo-50 text-indigo-600"
                : "text-slate-500 hover:text-indigo-600 hover:bg-indigo-50"
            }`}
          >
            <IconBell />
            {mockNotifUnreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 min-w-[16px] h-4 px-0.5 rounded-full bg-indigo-600 text-white text-[9px] font-bold flex items-center justify-center ring-2 ring-white">
                {mockNotifUnreadCount}
              </span>
            )}
          </button>

          {/* Notification panel */}
          {showNotifications && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.12)] border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                <span className="text-sm font-semibold text-slate-800">
                  Notifications
                </span>
                <span className="text-xs font-medium text-indigo-600 cursor-pointer hover:underline">
                  Mark all read
                </span>
              </div>
              <div className="max-h-72 overflow-y-auto">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`flex items-start gap-3 px-4 py-3 hover:bg-slate-50 cursor-pointer transition-colors duration-150 ${
                      n.unread ? "bg-indigo-50/40" : ""
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-xl bg-gradient-to-br ${n.color} flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-sm`}
                    >
                      {n.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-slate-700 leading-snug">
                        <span className="font-semibold">{n.name}</span>{" "}
                        {n.action}
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">{n.time}</p>
                    </div>
                    {n.unread && (
                      <span className="w-2 h-2 rounded-full bg-indigo-500 mt-1 shrink-0" />
                    )}
                  </div>
                ))}
              </div>
              <div className="px-4 py-3 border-t border-slate-100 text-center">
                <Link
                  href="/notifications"
                  className="text-xs font-medium text-indigo-600 hover:underline"
                  onClick={() => setShowNotifications(false)}
                >
                  View all notifications →
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Vertical divider */}
        <div className="w-px h-6 bg-slate-200 mx-1" />

        {/* Profile dropdown */}
        <div ref={profileRef} className="relative">
          <button
            id="navbar-profile-btn"
            onClick={() => {
              setShowProfile((v) => !v);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-slate-50 transition-all duration-200 group"
          >
            <div className="relative">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-400 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                SL
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-white" />
            </div>
            <div className="hidden sm:flex flex-col items-start">
              <span className="text-xs font-semibold text-slate-800 leading-tight">
                Sengleang
              </span>
              <span className="text-[10px] text-slate-400 leading-tight">
                Developer
              </span>
            </div>
            <span
              className={`text-slate-400 group-hover:text-slate-600 transition-all duration-200 ${
                showProfile ? "rotate-180" : ""
              }`}
            >
              <IconChevronDown />
            </span>
          </button>

          {/* Profile menu */}
          {showProfile && (
            <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.12)] border border-slate-100 overflow-hidden">
              {/* User info header */}
              <div className="px-4 py-3 border-b border-slate-100 bg-gradient-to-br from-indigo-50/80 to-blue-50/40">
                <p className="text-sm font-semibold text-slate-800">
                  Sengleang
                </p>
                <p className="text-xs text-slate-500">sengleang@dev.io</p>
              </div>

              {/* Menu items */}
              <div className="py-1.5 px-2">
                {[
                  { label: "My Profile", icon: <IconUser />, href: "/profile" },
                  {
                    label: "Settings",
                    icon: <IconSettings />,
                    href: "/settings",
                  },
                ].map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setShowProfile(false)}
                    className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-slate-600 hover:bg-slate-50 hover:text-indigo-700 transition-colors duration-150"
                  >
                    <span className="text-slate-400">{item.icon}</span>
                    {item.label}
                  </Link>
                ))}
              </div>

              <div className="border-t border-slate-100 py-1.5 px-2">
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors duration-150"
                >
                  <IconLogOut />
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
