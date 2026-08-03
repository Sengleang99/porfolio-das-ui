import { useState } from "react";
import { Button } from "@/components/ui";
import type { Education } from "@/types/education";

// ─── Icons ────────────────────────────────────────────────────────────────────
const IconGraduation = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-5 h-5 text-indigo-500"
  >
    <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
    <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
  </svg>
);

const IconCalendar = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-3.5 h-3.5 text-slate-400"
  >
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const IconEdit = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-4 h-4"
  >
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
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
function formatDate(dateStr: string): string {
  if (!dateStr) return "";
  if (dateStr.toLowerCase() === "present") return "Present";

  const parts = dateStr.split("-");
  if (parts.length < 2) return dateStr;

  const year = parts[0];
  const monthNum = parseInt(parts[1], 10);

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  if (monthNum >= 1 && monthNum <= 12) {
    return `${months[monthNum - 1]} ${year}`;
  }
  return dateStr;
}

// ─── Props ────────────────────────────────────────────────────────────────────
interface EducationTableProps {
  items: Education[];
  onEdit: (item: Education) => void;
  onDelete: (item: Education) => void;
}

// ─── Component ────────────────────────────────────────────────────────────────
export function EducationTable({
  items,
  onEdit,
  onDelete,
}: EducationTableProps) {
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({});

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="w-full overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
      <table className="w-full min-w-[600px] text-left border-collapse text-sm">
        <thead>
          <tr className="border-b border-slate-100 bg-slate-50/75 text-slate-500 font-semibold">
            <th className="p-4 pl-6">Institution</th>
            <th className="p-4 whitespace-nowrap">Degree & Field</th>
            <th className="p-4 whitespace-nowrap">Duration</th>
            <th className="p-4 pr-6 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 text-slate-700">
          {items.map((item) => (
            <tr
              key={item.id}
              className="hover:bg-slate-50/50 transition-colors duration-150 group"
            >
              {/* Institution */}
              <td className="p-4 pl-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0 mt-0.5">
                    <IconGraduation />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="font-semibold text-slate-900 block group-hover:text-indigo-600 transition-colors duration-150">
                      {item.university}
                    </span>

                    {item.descr && (
                      <div className="text-xs text-slate-400 mt-2 max-w-xs md:max-w-md">
                        <p className="inline leading-relaxed whitespace-pre-wrap">
                          {item.descr.length > 80 && !expandedIds[item.id]
                            ? `${item.descr.slice(0, 80)}... `
                            : item.descr + " "}
                        </p>
                        {item.descr.length > 80 && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleExpand(item.id);
                            }}
                            className="text-indigo-600 hover:text-indigo-700 font-semibold inline hover:underline ml-1 cursor-pointer focus:outline-none"
                          >
                            {expandedIds[item.id] ? "Show less" : "Read more"}
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </td>

              {/* Degree & Field */}
              <td className="p-4 whitespace-nowrap">
                <div>
                  <span className="font-medium text-slate-800 block">
                    {item.degree}
                  </span>
                  <span className="text-xs text-slate-500 block mt-0.5">
                    {item.major}
                  </span>
                </div>
              </td>

              {/* Duration */}
              <td className="p-4 whitespace-nowrap">
                <div className="flex items-center gap-1.5 text-slate-600 font-medium">
                  <IconCalendar />
                  <span className="text-xs">
                    {formatDate(item.start_year)} — {formatDate(item.end_year)}
                  </span>
                </div>
              </td>

              {/* Actions */}
              <td className="p-4 pr-6">
                <div className="flex items-center justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center"
                    onClick={() => onEdit(item)}
                  >
                    <IconEdit />
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
          ))}
        </tbody>
      </table>
    </div>
  );
}
