export interface CaseStudy {
  _id?: string;
  id: string;
  title: string;
  tag: string;
  description: string;
  tech: string[]; // comma-separated, e.g. "React, Node.js, PostgreSQL"
  githubUrl?: string;
  demoUrl?: string;
  createdAt: string; // ISO date string
}
