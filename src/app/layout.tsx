import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// ── Global metadata — applies to every page unless overridden ─────────────────
export const metadata: Metadata = {
  title: {
    default: "DevPortfolio",
    template: "%s | DevPortfolio", // e.g. "Dashboard | DevPortfolio"
  },
  description:
    "A personal developer portfolio dashboard — manage experience, projects, education, and more.",
};

// ── Root layout — wraps every page in the app ─────────────────────────────────
// Note: Sidebar and Navbar are NOT here. They live in (dashboard)/layout.tsx
// so that auth pages (/login) stay clean without any navigation chrome.
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-slate-50 text-slate-900">{children}</body>
    </html>
  );
}
