import { HTMLAttributes, ReactNode, ReactElement } from "react";

// ─── Avatar ───────────────────────────────────────────────────────────────────
type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl";
type AvatarShape = "rounded" | "square";
type OnlineStatus = "online" | "away" | "busy" | "offline";

interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
  initials: string; // e.g. "SL"
  size?: AvatarSize;
  shape?: AvatarShape;
  status?: OnlineStatus; // shows a colored dot indicator
  gradient?: string; // Tailwind gradient classes
}

const sizeMap: Record<
  AvatarSize,
  { wrapper: string; text: string; dot: string }
> = {
  xs: { wrapper: "w-6 h-6", text: "text-[9px]", dot: "w-1.5 h-1.5" },
  sm: { wrapper: "w-8 h-8", text: "text-xs", dot: "w-2 h-2" },
  md: { wrapper: "w-10 h-10", text: "text-sm", dot: "w-2.5 h-2.5" },
  lg: { wrapper: "w-12 h-12", text: "text-base", dot: "w-3 h-3" },
  xl: { wrapper: "w-16 h-16", text: "text-xl", dot: "w-3.5 h-3.5" },
};

const statusColor: Record<OnlineStatus, string> = {
  online: "bg-emerald-400",
  away: "bg-amber-400",
  busy: "bg-red-500",
  offline: "bg-slate-300",
};

const shapeMap: Record<AvatarShape, string> = {
  rounded: "rounded-full",
  square: "rounded-xl",
};

export function Avatar({
  initials,
  size = "md",
  shape = "square",
  status,
  gradient = "from-indigo-500 to-blue-400",
  className = "",
  ...props
}: AvatarProps) {
  const s = sizeMap[size];
  return (
    <div className={`relative inline-flex shrink-0 ${className}`} {...props}>
      <div
        className={`
          ${s.wrapper} ${shapeMap[shape]}
          bg-gradient-to-br ${gradient}
          flex items-center justify-center
          text-white font-bold shadow-sm select-none
          ${s.text}
        `}
      >
        {initials}
      </div>
      {status && (
        <span
          className={`
            absolute -bottom-0.5 -right-0.5
            ${s.dot} rounded-full border-2 border-white
            ${statusColor[status]}
          `}
        />
      )}
    </div>
  );
}

// ─── Divider ──────────────────────────────────────────────────────────────────
interface DividerProps {
  label?: string;
  className?: string;
}

export function Divider({ label, className = "" }: DividerProps) {
  if (label) {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        <div className="flex-1 h-px bg-slate-200" />
        <span className="text-xs text-slate-400 font-medium whitespace-nowrap">
          {label}
        </span>
        <div className="flex-1 h-px bg-slate-200" />
      </div>
    );
  }
  return <div className={`h-px bg-slate-100 ${className}`} />;
}

// ─── Spinner ──────────────────────────────────────────────────────────────────
type SpinnerSize = "sm" | "md" | "lg";

interface SpinnerProps {
  size?: SpinnerSize;
  className?: string;
}

const spinnerSizeMap: Record<SpinnerSize, string> = {
  sm: "w-4 h-4",
  md: "w-6 h-6",
  lg: "w-8 h-8",
};

export function Spinner({ size = "md", className = "" }: SpinnerProps) {
  return (
    <svg
      className={`animate-spin text-indigo-600 ${spinnerSizeMap[size]} ${className}`}
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}

// ─── Alert ───────────────────────────────────────────────────────────────────
type AlertVariant = "info" | "success" | "warning" | "error";

interface AlertProps {
  variant?: AlertVariant;
  children: ReactNode;
  className?: string;
}

const alertStyles: Record<
  AlertVariant,
  { wrapper: string; icon: ReactElement }
> = {
  info: {
    wrapper: "bg-sky-50 border-sky-100 text-sky-700",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-4 h-4 shrink-0"
      >
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
    ),
  },
  success: {
    wrapper: "bg-emerald-50 border-emerald-100 text-emerald-700",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-4 h-4 shrink-0"
      >
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    ),
  },
  warning: {
    wrapper: "bg-amber-50 border-amber-100 text-amber-700",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-4 h-4 shrink-0"
      >
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
        <line x1="12" y1="9" x2="12" y2="13" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    ),
  },
  error: {
    wrapper: "bg-red-50 border-red-100 text-red-600",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-4 h-4 shrink-0"
      >
        <circle cx="12" cy="12" r="10" />
        <line x1="15" y1="9" x2="9" y2="15" />
        <line x1="9" y1="9" x2="15" y2="15" />
      </svg>
    ),
  },
};

export function Alert({
  variant = "info",
  children,
  className = "",
}: AlertProps) {
  const { wrapper, icon } = alertStyles[variant];
  return (
    <div
      className={`flex items-start gap-2.5 px-4 py-3 rounded-xl border text-sm ${wrapper} ${className}`}
    >
      {icon}
      <span>{children}</span>
    </div>
  );
}
