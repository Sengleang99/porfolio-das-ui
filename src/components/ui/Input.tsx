import { InputHTMLAttributes, ReactNode, forwardRef } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: ReactNode;
  rightElement?: ReactNode; // for show/hide password button, etc.
}

// ─── Input Component ──────────────────────────────────────────────────────────
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, hint, leftIcon, rightElement, id, className = "", ...props },
  ref,
) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-medium text-slate-700"
        >
          {label}
        </label>
      )}

      <div className="relative">
        {leftIcon && (
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
            {leftIcon}
          </span>
        )}

        <input
          ref={ref}
          id={id}
          className={`
            w-full py-2.5 rounded-xl border text-sm text-slate-800
            placeholder-slate-400 bg-white outline-none
            transition-all duration-200
            hover:border-slate-300
            focus:border-indigo-400 focus:ring-3 focus:ring-indigo-100
            disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed
            ${error ? "border-red-400 focus:border-red-400 focus:ring-red-100" : "border-slate-200"}
            ${leftIcon ? "pl-10" : "px-3.5"}
            ${rightElement ? "pr-11" : "pr-3.5"}
            ${className}
          `}
          {...props}
        />

        {rightElement && (
          <span className="absolute right-3.5 top-1/2 -translate-y-1/2">
            {rightElement}
          </span>
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
});
