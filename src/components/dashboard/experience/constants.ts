import type { Experience } from "@/types/experience";

export type FormData = Omit<Experience, "_id">;

export const EMPTY_FORM: FormData = {
  company: "",
  position: "",
  status: "full-time",
  from_year: "",
  to_year: "",
  descr: "",
};

export function generateId(): string {
  return (
    "exp-" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6)
  );
}
