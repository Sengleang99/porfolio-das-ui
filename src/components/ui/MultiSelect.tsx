import { ReactNode, useState, useEffect, useRef } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface MultiSelectProps {
  id?: string;
  label?: string;
  placeholder?: string;
  value: string; // Comma-separated string
  onChange: (value: string) => void;
  options: string[];
  error?: string;
  hint?: string;
}

// ─── MultiSelect Component ───────────────────────────────────────────────────
export function MultiSelect({
  id,
  label,
  placeholder = "Select options...",
  value,
  onChange,
  options,
  error,
  hint,
}: MultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  // Parse comma-separated selected values
  const selectedValues = value
    ? value
        .split(",")
        .map((v) => v.trim())
        .filter(Boolean)
    : [];

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleToggleOption = (option: string) => {
    let newSelected: string[];
    if (selectedValues.includes(option)) {
      newSelected = selectedValues.filter((val) => val !== option);
    } else {
      newSelected = [...selectedValues, option];
    }
    onChange(newSelected.join(", "));
  };

  const handleRemoveOption = (option: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent opening the dropdown
    const newSelected = selectedValues.filter((val) => val !== option);
    onChange(newSelected.join(", "));
  };

  const handleClearAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange("");
  };

  // Filter options based on search query
  const filteredOptions = options.filter((option) =>
    option.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="space-y-1.5" ref={containerRef}>
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-medium text-slate-700"
        >
          {label}
        </label>
      )}

      <div className="relative">
        {/* Trigger Button */}
        <div
          onClick={() => setIsOpen(!isOpen)}
          className={`
            min-h-[42px] w-full px-3.5 py-1.5 rounded-xl border text-sm text-slate-800 bg-white
            outline-none transition-all duration-200 cursor-pointer flex flex-wrap items-center gap-1.5 pr-10
            hover:border-slate-300
            ${isOpen ? "border-indigo-400 ring-3 ring-indigo-100" : "border-slate-200"}
            ${error ? "border-red-400 ring-red-100" : ""}
          `}
        >
          {selectedValues.length === 0 ? (
            <span className="text-slate-400 py-1">{placeholder}</span>
          ) : (
            selectedValues.map((val) => (
              <span
                key={val}
                className="inline-flex items-center gap-1 bg-indigo-55 bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs px-2.5 py-1 rounded-lg font-medium"
              >
                {val}
                <button
                  type="button"
                  onClick={(e) => handleRemoveOption(val, e)}
                  className="w-3.5 h-3.5 rounded-full hover:bg-indigo-100 flex items-center justify-center text-indigo-500 hover:text-indigo-700 transition-colors"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-2.5 h-2.5"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </span>
            ))
          )}

          {/* Indicators */}
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5 text-slate-400 pointer-events-none">
            {selectedValues.length > 0 && (
              <button
                type="button"
                onClick={handleClearAll}
                className="pointer-events-auto hover:text-slate-650 hover:text-slate-600 text-slate-400 p-0.5"
                title="Clear all"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-3.5 h-3.5"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            )}
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`w-4 h-4 transition-transform duration-200 ${isOpen ? "rotate-180 text-indigo-500" : ""}`}
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>
        </div>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute z-50 w-full mt-1.5 bg-white border border-slate-200 rounded-xl shadow-lg max-h-60 overflow-y-auto flex flex-col">
            {/* Search Box */}
            <div className="p-2 border-b border-slate-100 bg-slate-50/50 sticky top-0 z-10">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search technologies..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 border border-slate-200 rounded-lg text-xs outline-none focus:border-indigo-400 bg-white"
                />
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-450 text-slate-400">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-3.5 h-3.5"
                  >
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                </span>
              </div>
            </div>

            {/* Options List */}
            <div className="py-1 divide-y divide-slate-50 overflow-y-auto">
              {filteredOptions.length === 0 ? (
                <div className="p-4 text-xs text-slate-450 text-center text-slate-400">
                  No options found.
                </div>
              ) : (
                filteredOptions.map((option) => {
                  const isChecked = selectedValues.includes(option);
                  return (
                    <div
                      key={option}
                      onClick={() => handleToggleOption(option)}
                      className={`
                        px-3.5 py-2 text-xs flex items-center gap-2.5 cursor-pointer transition-colors
                        hover:bg-slate-50
                        ${isChecked ? "bg-indigo-50/20 text-indigo-700 font-medium" : "text-slate-700"}
                      `}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        readOnly
                        className="rounded border-slate-350 text-indigo-600 focus:ring-indigo-100 h-3.5 w-3.5 cursor-pointer accent-indigo-600"
                      />
                      <span>{option}</span>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>

      {error && (
        <p className="text-xs text-red-500 flex items-center gap-1">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-3.5 h-3.5 shrink-0"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          {error}
        </p>
      )}

      {hint && !error && <p className="text-xs text-slate-400">{hint}</p>}
    </div>
  );
}
