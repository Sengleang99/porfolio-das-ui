import type { Experience } from "@/types/experience";

export type FormData = Omit<Experience, "id">;

export const SEED_DATA: Experience[] = [
  {
    id: "exp-1",
    company: "Innovative Tech Solutions",
    role: "Senior Front-End Developer",
    employmentType: "Full-time",
    startDate: "2022-03",
    endDate: "Present",
    location: "San Francisco, CA (Hybrid)",
    description:
      "Led a team of 4 developers to rebuild the legacy e-commerce dashboard in Next.js, improving page speed by 40% and increasing conversions by 15%.",
  },
  {
    id: "exp-2",
    company: "Pixel Perfect Agency",
    role: "Junior Web Developer",
    employmentType: "Full-time",
    startDate: "2020-06",
    endDate: "2022-02",
    location: "Remote",
    description:
      "Designed and developed custom WordPress and React sites for high-traffic clients, ensuring cross-browser compliance and pixel-perfect design accuracy.",
  },
];

export const EMPTY_FORM: FormData = {
  company: "",
  role: "",
  employmentType: "Full-time",
  startDate: "",
  endDate: "",
  location: "",
  description: "",
};

export function generateId(): string {
  return (
    "exp-" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6)
  );
}
