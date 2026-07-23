export interface Message {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: "read" | "unread";
  createdAt: string; // ISO date string
}
