import type { Message } from "@/types/message";

export const SEED_DATA: Message[] = [
  {
    id: "msg-1",
    name: "John Doe",
    email: "johndoe@example.com",
    subject: "Freelance Project Inquiry",
    message:
      "Hi Sengleang, I saw your portfolio and was impressed by your case studies. We are looking for a freelance Next.js developer to help us rebuild our landing page. Are you available for a chat next week?",
    status: "unread",
    createdAt: "2026-07-23T10:00:00.000Z",
  },
  {
    id: "msg-2",
    name: "Sarah Jenkins",
    email: "sarah.j@techcorp.com",
    subject: "Job Opportunity - Senior Developer",
    message:
      "Hello! TechCorp is currently hiring for a Senior Front-End Developer position. We love your work and would like to invite you for a preliminary interview. Please let me know if you are interested and your availability.",
    status: "read",
    createdAt: "2026-07-22T14:30:00.000Z",
  },
  {
    id: "msg-3",
    name: "Alex Chen",
    email: "alex.chen@designstudio.io",
    subject: "Collaboration Request",
    message:
      "Hey there, I am a UI/UX designer and I am looking for a developer to partner with on some upcoming client projects. Let me know if you would be open to collaborating!",
    status: "read",
    createdAt: "2026-07-19T09:15:00.000Z",
  },
];

export function generateId(): string {
  return (
    "msg-" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6)
  );
}
