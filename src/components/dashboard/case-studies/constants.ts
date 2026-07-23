import type { CaseStudy, CaseStudyStatus } from "@/types/caseStudy";

// ─── Seed data ────────────────────────────────────────────────────────────────
export const SEED_DATA: CaseStudy[] = [
  {
    id: "1",
    title: "E-Commerce Dashboard",
    description:
      "A full-featured admin dashboard for an online store with real-time inventory tracking, sales analytics, and order management built with Next.js and Tailwind CSS.",
    techStack: "Next.js, TypeScript, Tailwind CSS, PostgreSQL",
    liveUrl: "https://demo.example.com",
    repoUrl: "https://github.com/example/ecommerce",
    status: "completed",
    createdAt: "2024-11-15",
  },
  {
    id: "2",
    title: "AI Chat Application",
    description:
      "Real-time messaging platform integrated with OpenAI's GPT-4 API. Supports multi-room chat, file sharing, and contextual AI replies with conversation history.",
    techStack: "React, Node.js, Socket.io, OpenAI API, MongoDB",
    liveUrl: "https://chat.example.com",
    repoUrl: "https://github.com/example/ai-chat",
    status: "completed",
    createdAt: "2024-09-03",
  },
  {
    id: "3",
    title: "Task Management System",
    description:
      "Kanban-style project management tool with drag-and-drop support, team collaboration, deadline reminders, and Slack integration.",
    techStack: "Vue.js, Laravel, MySQL, Redis",
    repoUrl: "https://github.com/example/taskman",
    status: "in-progress",
    createdAt: "2025-02-20",
  },
  {
    id: "4",
    title: "Portfolio Analytics API",
    description:
      "RESTful API that aggregates GitHub activity, blog post metrics, and LinkedIn stats into a unified data stream for portfolio dashboards.",
    techStack: "Python, FastAPI, Redis, Docker",
    repoUrl: "https://github.com/example/portfolio-api",
    status: "in-progress",
    createdAt: "2025-05-10",
  },
  {
    id: "5",
    title: "Mobile Expense Tracker",
    description:
      "Cross-platform mobile application for personal finance tracking with AI-powered spending categorization, budget alerts, and monthly reports.",
    techStack: "React Native, Expo, Supabase, TensorFlow Lite",
    status: "planned",
    createdAt: "2025-07-01",
  },
];

// ─── Status display maps ──────────────────────────────────────────────────────
export const STATUS_LABELS: Record<CaseStudyStatus, string> = {
  completed: "Completed",
  "in-progress": "In Progress",
  planned: "Planned",
};

export const STATUS_BADGE: Record<
  CaseStudyStatus,
  "success" | "warning" | "primary"
> = {
  completed: "success",
  "in-progress": "warning",
  planned: "primary",
};

// ─── Types ────────────────────────────────────────────────────────────────────
export type FormData = Omit<CaseStudy, "id" | "createdAt">;

export const EMPTY_FORM: FormData = {
  title: "",
  description: "",
  techStack: "",
  liveUrl: "",
  repoUrl: "",
  status: "planned",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}
