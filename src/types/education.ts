export interface Education {
  id: string;
  university: string;
  degree: string;
  major: string;
  start_year: string; // e.g., "2020-09"
  end_year: string; // e.g., "2024-06" or "Present"
  descr?: string;
}
