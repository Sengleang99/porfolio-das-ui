import type { Education } from "@/types/education";

export type FormData = Omit<Education, "id">;

export const SEED_DATA: Education[] = [
  {
    id: "edu-1",
    institution: "University of Technology",
    degree: "Bachelor of Science",
    fieldOfStudy: "Software Engineering",
    startDate: "2020-09",
    endDate: "2024-06",
    grade: "GPA: 3.9 / 4.0",
    description:
      "Specialized in distributed systems and web architectures. Graduated with Honors.",
  },
  {
    id: "edu-2",
    institution: "Academy of Design & Technology",
    degree: "Associate Degree",
    fieldOfStudy: "Full Stack Web Development",
    startDate: "2018-09",
    endDate: "2020-06",
    grade: "Grade: A",
    description:
      "Intensive program focused on modern JavaScript frameworks, database design, and UI/UX fundamentals.",
  },
];

export const EMPTY_FORM: FormData = {
  institution: "",
  degree: "",
  fieldOfStudy: "",
  startDate: "",
  endDate: "",
  grade: "",
  description: "",
};

export function generateId(): string {
  return (
    "edu-" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6)
  );
}
