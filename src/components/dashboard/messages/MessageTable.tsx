import { Button, Badge } from "@/components/ui";
import type { Message } from "@/types/message";

// ─── Icons ────────────────────────────────────────────────────────────────────
const IconMail = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-5 h-5 text-indigo-500"
  >
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);

const IconMailOpen = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-5 h-5 text-slate-400"
  >
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);

const IconEye = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-4 h-4"
  >
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const IconDelete = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-4 h-4"
  >
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    <line x1="10" y1="11" x2="10" y2="17" />
    <line x1="14" y1="11" x2="14" y2="17" />
  </svg>
);

// ─── Date Formatter Helper ────────────────────────────────────────────────────
function formatMessageDate(dateStr: string): string {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// ─── Props ────────────────────────────────────────────────────────────────────
interface MessageTableProps {
  items: Message[];
  onView: (item: Message) => void;
  onDelete: (item: Message) => void;
}

// ─── Component ────────────────────────────────────────────────────────────────
export function MessageTable({ items, onView, onDelete }: MessageTableProps) {
  return (
    <div className="w-full overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
      <table className="w-full text-left border-collapse text-sm">
        <thead>
          <tr className="border-b border-slate-100 bg-slate-50/75 text-slate-500 font-semibold">
            <th className="p-4 pl-6 w-[220px]">Sender</th>
            <th className="p-4">Message Preview</th>
            <th className="p-4 w-[130px]">Received</th>
            <th className="p-4 w-[110px]">Status</th>
            <th className="p-4 pr-6 w-[100px] text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 text-slate-700">
          {items.map((item) => {
            const isUnread = item.status === "unread";
            return (
              <tr
                key={item.id}
                className={`
                  hover:bg-slate-50/50 transition-colors duration-150 group cursor-pointer
                  ${isUnread ? "bg-indigo-50/15 font-medium text-slate-900" : "text-slate-600"}
                `}
                onClick={() => onView(item)}
              >
                {/* Sender Details */}
                <td className="p-4 pl-6">
                  <div className="flex items-center gap-3">
                    {/* Status Dot + Avatar icon */}
                    <div className="relative shrink-0 w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                      {isUnread ? <IconMail /> : <IconMailOpen />}
                      {isUnread && (
                        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-indigo-600 rounded-full ring-2 ring-white" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <span className="block truncate font-semibold text-slate-800">
                        {item.name}
                      </span>
                      <span className="block truncate text-xs text-slate-400">
                        {item.email}
                      </span>
                    </div>
                  </div>
                </td>

                {/* Message Preview */}
                <td className="p-4">
                  <div className="min-w-0">
                    <span className="block truncate text-xs text-slate-450 text-slate-400 max-w-xs md:max-w-md">
                      {item.message}
                    </span>
                  </div>
                </td>

                {/* Received Date */}
                <td className="p-4 text-xs text-slate-500 font-medium">
                  {formatMessageDate(item.createdAt)}
                </td>

                {/* Status Badge */}
                <td className="p-4">
                  <Badge variant={isUnread ? "primary" : "default"} size="sm">
                    {isUnread ? "Unread" : "Read"}
                  </Badge>
                </td>

                {/* Actions */}
                <td className="p-4 pr-6" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center"
                      onClick={() => onView(item)}
                    >
                      <IconEye />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 rounded-lg text-red-500 hover:text-red-600 hover:bg-red-50 flex items-center justify-center"
                      onClick={() => onDelete(item)}
                    >
                      <IconDelete />
                    </Button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
