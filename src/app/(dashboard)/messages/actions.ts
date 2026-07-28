"use server";

import { fetcher, deleter, updater, poster } from "@/lib/base.api";
import type { Message } from "@/types/message";

export async function getMessages(): Promise<Message[]> {
  try {
    const rawData = await fetcher<any>("/contacts");

    // Handle NestJS response wrapper (e.g. rawData.data)
    const list = Array.isArray(rawData) ? rawData : rawData?.data || [];

    if (!Array.isArray(list)) {
      return [];
    }

    return list.map((item): Message => {
      return {
        id: item._id || item.id || "",
        name: item.username || "",
        email: item.email || "",
        message: item.message || "",
        status: item.status || "unread",
        createdAt: item.createdAt || "",
        replies: item.replies
          ? item.replies.map((r: any) => ({
              message: r.message || "",
              createdAt: r.createdAt || "",
            }))
          : [],
      };
    });
  } catch (error) {
    console.error("Error in getMessages server action:", error);
    return [];
  }
}

export interface ActionResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export async function deleteMessage(id: string): Promise<ActionResult<void>> {
  try {
    await deleter<void>(`/contacts/${id}`);
    return {
      success: true,
    };
  } catch (error: unknown) {
    console.error("Error in deleteMessage server action:", error);
    const message =
      error instanceof Error ? error.message : "Failed to delete message.";
    return {
      success: false,
      error: message,
    };
  }
}

export async function updateMessageStatus(
  id: string,
  status: "read" | "unread",
): Promise<ActionResult<Message>> {
  try {
    const response = await updater<any>(`/contacts/${id}`, { status });
    const rawMessage = response?.data || response;

    if (rawMessage && (rawMessage._id || rawMessage.id)) {
      return {
        success: true,
        data: {
          id: rawMessage._id || rawMessage.id || "",
          name: rawMessage.username || "",
          email: rawMessage.email || "",
          message: rawMessage.message || "",
          status: rawMessage.status || "unread",
          createdAt: rawMessage.createdAt || "",
          replies: rawMessage.replies
            ? rawMessage.replies.map((r: any) => ({
                message: r.message || "",
                createdAt: r.createdAt || "",
              }))
            : [],
        },
      };
    }

    return {
      success: true,
    };
  } catch (error: unknown) {
    console.error("Error in updateMessageStatus server action:", error);
    const message =
      error instanceof Error
        ? error.message
        : "Failed to update message status.";
    return {
      success: false,
      error: message,
    };
  }
}

export async function getUnreadCount(): Promise<number> {
  try {
    const rawData = await fetcher<any>("/contacts");
    const list = Array.isArray(rawData) ? rawData : rawData?.data || [];

    if (!Array.isArray(list)) {
      return 0;
    }

    return list.filter((item) => item.status === "unread" || !item.status)
      .length;
  } catch (error) {
    console.error("Error in getUnreadCount server action:", error);
    return 0;
  }
}

export async function replyToMessage(
  id: string,
  messageBody: string,
): Promise<ActionResult<Message>> {
  try {
    const response = await poster<any>(`/contacts/${id}/reply`, {
      message: messageBody,
    });
    const rawMessage = response?.data?.data || response?.data || response;

    if (rawMessage && (rawMessage._id || rawMessage.id)) {
      return {
        success: true,
        data: {
          id: rawMessage._id || rawMessage.id || "",
          name: rawMessage.username || "",
          email: rawMessage.email || "",
          message: rawMessage.message || "",
          status: rawMessage.status || "unread",
          createdAt: rawMessage.createdAt || "",
          replies: rawMessage.replies
            ? rawMessage.replies.map((r: any) => ({
                message: r.message || "",
                createdAt: r.createdAt || "",
              }))
            : [],
        },
      };
    }

    return {
      success: true,
    };
  } catch (error: unknown) {
    console.error("Error in replyToMessage server action:", error);
    const message =
      error instanceof Error ? error.message : "Failed to send reply.";
    return {
      success: false,
      error: message,
    };
  }
}
