import { Button } from "@/components/ui";

interface CaseStudyHeaderProps {
  count: number;
  onCreateClick: () => void;
}

const IconPlus = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-4 h-4"
  >
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

export function CaseStudyHeader({
  count,
  onCreateClick,
}: CaseStudyHeaderProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <h1 className="text-xl font-bold text-slate-800">Case Studies</h1>
        <p className="text-sm text-slate-500 mt-0.5">
          {count} project{count !== 1 ? "s" : ""}
        </p>
      </div>
      <Button variant="primary" onClick={onCreateClick} leftIcon={<IconPlus />}>
        New Project
      </Button>
    </div>
  );
}
