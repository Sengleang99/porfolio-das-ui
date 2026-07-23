import { useState } from "react";
import { Button, Modal } from "@/components/ui";
import type { Message } from "@/types/message";

// ─── Message View & Reply Modal ────────────────────────────────────────────────
interface MessageViewModalProps {
  message: Message | null;
  onClose: () => void;
  onReplySent: (messageId: string, replyBody: string) => void;
}

export function MessageViewModal({
  message,
  onClose,
  onReplySent,
}: MessageViewModalProps) {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyBody, setReplyBody] = useState("");
  const [replyError, setReplyError] = useState("");
  const [isSending, setIsSending] = useState(false);

  if (!message) return null;

  const handleSend = () => {
    if (!replyBody.trim()) {
      setReplyError("Reply message cannot be empty.");
      return;
    }
    setReplyError("");
    setIsSending(true);
    // Simulate API delay
    setTimeout(() => {
      onReplySent(message.id, replyBody);
      setIsSending(false);
      setReplyBody("");
      setShowReplyForm(false);
    }, 1000);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Modal
      open={message !== null}
      onClose={onClose}
      title={message.subject}
      size="lg"
      footer={
        <div className="flex w-full items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => setShowReplyForm((prev) => !prev)}
            className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 font-medium"
          >
            {showReplyForm ? "Discard Reply" : "Reply to Message"}
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            {showReplyForm && (
              <Button
                variant="primary"
                onClick={handleSend}
                disabled={isSending}
              >
                {isSending ? "Sending..." : "Send Reply"}
              </Button>
            )}
          </div>
        </div>
      }
    >
      <div className="space-y-4">
        {/* Header Metadata */}
        <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <div>
            <span className="text-slate-400 font-medium block">From:</span>
            <span className="font-semibold text-slate-800">{message.name}</span>
            <span className="text-xs text-slate-500 block">
              {message.email}
            </span>
          </div>
          <div className="md:text-right">
            <span className="text-slate-400 font-medium block">
              Date Received:
            </span>
            <span className="text-slate-700 font-medium">
              {formatDate(message.createdAt)}
            </span>
          </div>
        </div>

        {/* Message Body */}
        <div className="p-4 bg-white border border-slate-200 rounded-xl max-h-60 overflow-y-auto whitespace-pre-wrap text-sm text-slate-700 leading-relaxed">
          {message.message}
        </div>

        {/* Expandable Reply Form */}
        {showReplyForm && (
          <div className="border-t border-slate-100 pt-4 space-y-3">
            <h4 className="text-sm font-semibold text-slate-800">
              Compose Reply
            </h4>
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-400">
                To:
              </label>
              <div className="px-3.5 py-2 rounded-lg bg-slate-50 text-sm text-slate-500 border border-slate-100 select-none">
                {message.name} &lt;{message.email}&gt;
              </div>
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-400">
                Subject:
              </label>
              <div className="px-3.5 py-2 rounded-lg bg-slate-50 text-sm text-slate-500 border border-slate-100 select-none">
                Re: {message.subject}
              </div>
            </div>
            <div className="space-y-1.5">
              <label
                htmlFor="reply-body"
                className="block text-xs font-semibold text-slate-400"
              >
                Message Body
              </label>
              <textarea
                id="reply-body"
                rows={4}
                placeholder="Type your response here..."
                value={replyBody}
                onChange={(e) => {
                  setReplyBody(e.target.value);
                  if (replyError) setReplyError("");
                }}
                className={`
                  w-full px-3.5 py-2.5 rounded-xl border text-sm text-slate-800
                  placeholder-slate-400 bg-white outline-none resize-none
                  transition-all duration-200 hover:border-slate-300
                  focus:border-indigo-400 focus:ring-3 focus:ring-indigo-100
                  ${replyError ? "border-red-400" : "border-slate-200"}
                `}
              />
              {replyError && (
                <p className="text-xs text-red-500">{replyError}</p>
              )}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}

// ─── Delete Confirm Modal ─────────────────────────────────────────────────────
interface DeleteModalProps {
  open: boolean;
  title: string;
  onClose: () => void;
  onConfirm: () => void;
}

export function DeleteModal({
  open,
  title,
  onClose,
  onConfirm,
}: DeleteModalProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Delete Message"
      size="sm"
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="danger" onClick={onConfirm}>
            Delete
          </Button>
        </>
      }
    >
      <p className="text-sm text-slate-600">
        Are you sure you want to delete the message{" "}
        <span className="font-semibold text-slate-800">
          &quot;{title}&quot;
        </span>
        ? This action cannot be undone.
      </p>
    </Modal>
  );
}
