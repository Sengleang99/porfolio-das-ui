import { HTMLAttributes } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
type BadgeVariant =
  "default" | "primary" | "success" | "warning" | "danger" | "info";
type BadgeSize = "sm" | "md";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  dot?: boolean; // show a colored dot instead of text
}

// ─── Style maps ───────────────────────────────────────────────────────────────
const variantStyles: Record<BadgeVariant, string> = {
  default: "bg-slate-100 text-slate-600",
  primary: "bg-indigo-100 text-indigo-700",
  success: "bg-emerald-100 text-emerald-700",
  warning: "bg-amber-100 text-amber-700",
  danger: "bg-red-100 text-red-700",
  info: "bg-sky-100 text-sky-700",
};

const dotColors: Record<BadgeVariant, string> = {
  default: "bg-slate-500",
  primary: "bg-indigo-600",
  success: "bg-emerald-500",
  warning: "bg-amber-500",
  danger: "bg-red-500",
  info: "bg-sky-500",
};

const sizeStyles: Record<BadgeSize, string> = {
  sm: "text-[10px] px-1.5 py-0.5 min-w-[18px] h-[18px]",
  md: "text-xs px-2 py-0.5 min-w-[20px] h-5",
};

// ─── Badge Component ──────────────────────────────────────────────────────────
export function Badge({
  variant = "default",
  size = "md",
  dot = false,
  children,
  className = "",
  ...props
}: BadgeProps) {
  if (dot) {
    return (
      <span
        className={`inline-block w-2 h-2 rounded-full ${dotColors[variant]} ${className}`}
        {...props}
      />
    );
  }

  return (
    <span
      className={`
        inline-flex items-center justify-center rounded-full font-bold
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${className}
      `}
      {...props}
    >
      {children}
    </span>
  );
}
