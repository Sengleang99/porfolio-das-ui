export interface Reply {
  message: string;
  createdAt: string; // ISO date string
}

export interface Message {
  _id?: string;
  id: string;
  name: string;
  email: string;
  message: string;
  status: "read" | "unread";
  createdAt: string; // ISO date string
  replies?: Reply[];
}
