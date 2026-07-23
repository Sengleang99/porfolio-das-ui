import { HTMLAttributes, ReactNode } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  padding?: "none" | "sm" | "md" | "lg";
}

interface CardHeaderProps {
  title: string;
  description?: string;
  action?: ReactNode; // e.g. a button in the top-right corner
}

interface CardSectionProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

const paddingMap = {
  none: "",
  sm: "px-4 py-3",
  md: "px-6 py-5",
  lg: "px-8 py-6",
};

// ─── Card ─────────────────────────────────────────────────────────────────────
export function Card({
  children,
  padding = "md",
  className = "",
  ...props
}: CardProps) {
  return (
    <div
      className={`
        bg-white rounded-2xl border border-slate-100
        shadow-[0_2px_12px_rgba(0,0,0,0.04)]
        ${paddingMap[padding]}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}

// ─── Card.Header ──────────────────────────────────────────────────────────────
export function CardHeader({ title, description, action }: CardHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-4 mb-4">
      <div className="space-y-0.5">
        <h2 className="text-base font-semibold text-slate-800">{title}</h2>
        {description && <p className="text-sm text-slate-500">{description}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

// ─── Card.Divider ─────────────────────────────────────────────────────────────
export function CardDivider({ className = "" }: { className?: string }) {
  return <div className={`-mx-6 my-4 h-px bg-slate-100 ${className}`} />;
}

// ─── Card.Footer ─────────────────────────────────────────────────────────────
export function CardFooter({
  children,
  className = "",
  ...props
}: CardSectionProps) {
  return (
    <div
      className={`-mx-6 -mb-5 mt-4 px-6 py-3 bg-slate-50 rounded-b-2xl border-t border-slate-100 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
