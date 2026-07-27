import type { FormData } from "./constants";

export type FormErrors = Partial<Record<keyof FormData, string>>;

/**
 * Validates the Experience form data and returns an object containing validation error messages.
 */
export function validateExperienceForm(formData: FormData): FormErrors {
  const errs: FormErrors = {};

  if (!formData.company || !formData.company.trim()) {
    errs.company = "Company is required.";
  }

  if (!formData.position || !formData.position.trim()) {
    errs.position = "Role / Title is required.";
  }

  if (!formData.from_year) {
    errs.from_year = "Start date is required.";
  }

  if (!formData.to_year) {
    errs.to_year = "End date or 'Currently work here' is required.";
  } else if (
    formData.to_year !== "Present" &&
    formData.from_year &&
    formData.to_year < formData.from_year
  ) {
    errs.to_year = "End date must be after start date.";
  }

  if (!formData.descr || !formData.descr.trim()) {
    errs.descr = "Description is required.";
  }

  return errs;
}
