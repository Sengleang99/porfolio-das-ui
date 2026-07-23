export type CaseStudyStatus = "completed" | "in-progress" | "planned";
export type CaseStudyTag = string;

export interface CaseStudy {
  id: string;
  title: string;
  description: string;
  techStack: string; // comma-separated, e.g. "React, Node.js, PostgreSQL"
  liveUrl?: string;
  repoUrl?: string;
  status: CaseStudyStatus;
  createdAt: string; // ISO date string
}
