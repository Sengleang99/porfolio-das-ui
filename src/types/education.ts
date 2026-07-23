export interface Education {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string; // e.g., "2020-09"
  endDate: string; // e.g., "2024-06" or "Present"
  grade?: string; // e.g., "GPA: 3.8 / 4.0" (optional)
  description?: string; // Achievements, courses, details (optional)
}
