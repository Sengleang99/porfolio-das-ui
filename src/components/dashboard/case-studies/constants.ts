
// ─── Types ────────────────────────────────────────────────────────────────────
export interface FormData {
  title: string;
  tag: string;
  description: string;
  tech: string; // Comma-separated string for user input
  githubUrl: string;
  demoUrl: string;
}

export const EMPTY_FORM: FormData = {
  title: "",
  tag: "",
  description: "",
  tech: "",
  githubUrl: "",
  demoUrl: "",
};

export const TECH_OPTIONS = [
  "React",
  "Next.js",
  "Vue.js",
  "Angular",
  "Svelte",
  "TypeScript",
  "JavaScript",
  "Node.js",
  "Express",
  "NestJS",
  "FastAPI",
  "Python",
  "Go",
  "Rust",
  "GraphQL",
  "PostgreSQL",
  "MySQL",
  "MongoDB",
  "SQLite",
  "Redis",
  "Firebase",
  "Supabase",
  "Tailwind CSS",
  "Bootstrap",
  "Docker",
  "Kubernetes",
  "AWS",
  "Google Cloud",
  "Vercel",
  "OpenAI API",
  "Socket.io",
  "TensorFlow",
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}
