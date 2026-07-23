"use client";

import { useState } from "react";
import { Alert, Card, Input } from "@/components/ui";
import type { Message } from "@/types/message";

import { MessageTable } from "@/components/dashboard/messages/MessageTable";
import {
  MessageViewModal,
  DeleteModal,
} from "@/components/dashboard/messages/MessageModals";
import { SEED_DATA } from "@/components/dashboard/messages/constants";

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>(SEED_DATA);
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Message | null>(null);
  const [successMsg, setSuccessMsg] = useState("");

  // ── Helpers ──────────────────────────────────────────────────────────────
  const flash = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  // ── Open View & Mark as Read ─────────────────────────────────────────────
  const handleViewMessage = (msg: Message) => {
    setSelectedMessage(msg);
    if (msg.status === "unread") {
      setMessages((prev) =>
        prev.map((m) => (m.id === msg.id ? { ...m, status: "read" } : m)),
      );
    }
  };

  // ── Send Reply ───────────────────────────────────────────────────────────
  const handleReplySent = (messageId: string, replyBody: string) => {
    const originalMsg = messages.find((m) => m.id === messageId);
    if (originalMsg) {
      flash(
        `Reply sent to ${originalMsg.name} (${originalMsg.email}) successfully.`,
      );
      console.log("Simulating reply body:", replyBody);
    }
    setSelectedMessage(null);
  };

  // ── Delete Message ────────────────────────────────────────────────────────
  const handleDeleteMessage = () => {
    if (!deleteTarget) return;
    setMessages((prev) => prev.filter((m) => m.id !== deleteTarget.id));
    setDeleteTarget(null);
    if (selectedMessage?.id === deleteTarget.id) {
      setSelectedMessage(null);
    }
    flash("Message deleted successfully.");
  };

  // ── Stats ─────────────────────────────────────────────────────────────────
  const totalCount = messages.length;
  const unreadCount = messages.filter((m) => m.status === "unread").length;

  // ── Filter & Search Logic ────────────────────────────────────────────────
  const filteredMessages = messages
    .filter((m) => {
      if (filter === "unread") return m.status === "unread";
      if (filter === "read") return m.status === "read";
      return true;
    })
    .filter((m) => {
      const q = searchQuery.toLowerCase().trim();
      if (!q) return true;
      return (
        m.name.toLowerCase().includes(q) ||
        m.email.toLowerCase().includes(q) ||
        m.subject.toLowerCase().includes(q) ||
        m.message.toLowerCase().includes(q)
      );
    });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-800">Messages</h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Manage contact inquiries submitted on your landing page
        </p>
      </div>

      {/* Success alert */}
      {successMsg && <Alert variant="success">{successMsg}</Alert>}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="flex items-center gap-4 p-4 hover:shadow-md transition-shadow duration-200">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-5 h-5 text-indigo-600"
            >
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400 block uppercase tracking-wider">
              Total Messages
            </span>
            <span className="text-2xl font-bold text-slate-800">
              {totalCount}
            </span>
          </div>
        </Card>

        <Card className="flex items-center gap-4 p-4 hover:shadow-md transition-shadow duration-200">
          <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center shrink-0">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-5 h-5 text-amber-500"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400 block uppercase tracking-wider">
              Unread
            </span>
            <span className="text-2xl font-bold text-slate-800">
              {unreadCount}
            </span>
          </div>
        </Card>
      </div>

      {/* Filters and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
        {/* Filter Tabs */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl w-fit shrink-0 select-none">
          <button
            onClick={() => setFilter("all")}
            className={`
              px-4 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 cursor-pointer
              ${filter === "all" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700"}
            `}
          >
            All
          </button>
          <button
            onClick={() => setFilter("unread")}
            className={`
              px-4 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 cursor-pointer
              ${filter === "unread" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700"}
            `}
          >
            Unread
            {unreadCount > 0 && (
              <span className="ml-1.5 px-1.5 py-0.5 rounded-full text-[9px] bg-indigo-600 text-white font-bold">
                {unreadCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setFilter("read")}
            className={`
              px-4 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 cursor-pointer
              ${filter === "read" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700"}
            `}
          >
            Read
          </button>
        </div>

        {/* Search Input */}
        <div className="w-full sm:max-w-xs">
          <Input
            id="message-search"
            type="search"
            placeholder="Search sender, email or subject..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="rounded-xl py-2 px-3 border border-slate-200 focus:border-indigo-400 focus:ring-3 focus:ring-indigo-100 text-sm w-full"
            leftIcon={
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-4 h-4 text-slate-400"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            }
          />
        </div>
      </div>

      {/* Message List Table */}
      {filteredMessages.length === 0 ? (
        <Card className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center mb-4">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-6 h-6 text-slate-400"
            >
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
          </div>
          <p className="text-sm font-medium text-slate-700">
            No messages found
          </p>
          <p className="text-xs text-slate-400 mt-1">
            {searchQuery
              ? "Try refining your search query"
              : "Check back later for new form submissions"}
          </p>
        </Card>
      ) : (
        <MessageTable
          items={filteredMessages}
          onView={handleViewMessage}
          onDelete={setDeleteTarget}
        />
      )}

      {/* Message Viewer Modal */}
      <MessageViewModal
        message={selectedMessage}
        onClose={() => setSelectedMessage(null)}
        onReplySent={handleReplySent}
      />

      {/* Delete Confirmation Modal */}
      <DeleteModal
        open={deleteTarget !== null}
        title={
          deleteTarget
            ? `${deleteTarget.subject} from ${deleteTarget.name}`
            : ""
        }
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteMessage}
      />
    </div>
  );
}
