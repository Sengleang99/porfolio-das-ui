import type { Education } from "@/types/education";

export type FormData = Omit<Education, "id">;

export const EMPTY_FORM: FormData = {
  university: "",
  degree: "",
  major: "",
  start_year: "",
  end_year: "",
  descr: "",
};

export function generateId(): string {
  return (
    "edu-" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6)
  );
}
