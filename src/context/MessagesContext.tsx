"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { getUnreadCount } from "@/app/(dashboard)/messages/actions";

interface MessagesContextType {
  unreadCount: number;
  triggerRefresh: () => Promise<void>;
}

const MessagesContext = createContext<MessagesContextType | undefined>(
  undefined,
);

export function MessagesProvider({ children }: { children: React.ReactNode }) {
  const [unreadCount, setUnreadCount] = useState(0);

  const triggerRefresh = async () => {
    const count = await getUnreadCount();
    setUnreadCount(count);
  };

  useEffect(() => {
    // Fetch initial count
    triggerRefresh();

    // Subscribe to real-time events proxy
    const eventSource = new EventSource("/api/contacts/stream");

    eventSource.onmessage = async (event) => {
      try {
        const payload = JSON.parse(event.data);
        if (payload?.type === "new-message") {
          await triggerRefresh();
          // Dispatch a custom event to notify the active messages page
          window.dispatchEvent(new CustomEvent("new-message-event"));
        }
      } catch (err) {
        console.error("Error parsing SSE event data in provider:", err);
      }
    };

    eventSource.onerror = () => {
      if (eventSource.readyState === EventSource.CONNECTING) {
        console.log("SSE proxy disconnected. Reconnecting automatically...");
      } else {
        console.warn(
          "SSE stream connection closed or failed (state: " +
            eventSource.readyState +
            "). Reconnecting...",
        );
      }
    };

    return () => {
      eventSource.close();
    };
  }, []);

  return (
    <MessagesContext.Provider value={{ unreadCount, triggerRefresh }}>
      {children}
    </MessagesContext.Provider>
  );
}

export function useMessages() {
  const context = useContext(MessagesContext);
  if (context === undefined) {
    throw new Error("useMessages must be used within a MessagesProvider");
  }
  return context;
}
