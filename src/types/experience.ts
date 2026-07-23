export interface Experience {
  id: string;
  company: string;
  role: string;
  employmentType: string; // e.g., "Full-time", "Part-time", "Contract", "Freelance", "Internship"
  startDate: string; // e.g., "2022-03"
  endDate: string; // e.g., "2024-08" or "Present"
  location: string; // e.g., "Remote" or "New York, NY"
  description: string; // Responsibilities and achievements
}
