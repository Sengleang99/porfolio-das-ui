import { Input } from "@/components/ui";
import type { FormData } from "./constants";

interface CaseStudyFormProps {
  data: FormData;
  onChange: (field: keyof FormData, value: string) => void;
  errors: Partial<Record<keyof FormData, string>>;
}

export function CaseStudyForm({ data, onChange, errors }: CaseStudyFormProps) {
  return (
    <div className="space-y-4">
      <Input
        id="cs-title"
        label="Project Title"
        placeholder="e.g. E-Commerce Dashboard"
        value={data.title}
        onChange={(e) => onChange("title", e.target.value)}
        error={errors.title}
      />

      {/* Description textarea */}
      <div className="space-y-1.5">
        <label
          htmlFor="cs-desc"
          className="block text-sm font-medium text-slate-700"
        >
          Description
        </label>
        <textarea
          id="cs-desc"
          rows={3}
          placeholder="Describe the project, your role, and key outcomes…"
          value={data.description}
          onChange={(e) => onChange("description", e.target.value)}
          className={`
            w-full px-3.5 py-2.5 rounded-xl border text-sm text-slate-800
            placeholder-slate-400 bg-white outline-none resize-none
            transition-all duration-200 hover:border-slate-300
            focus:border-indigo-400 focus:ring-3 focus:ring-indigo-100
            ${errors.description ? "border-red-400" : "border-slate-200"}
          `}
        />
        {errors.description && (
          <p className="text-xs text-red-500">{errors.description}</p>
        )}
      </div>

      <Input
        id="cs-tech"
        label="Tech Stack"
        placeholder="e.g. React, Node.js, PostgreSQL"
        value={data.techStack}
        onChange={(e) => onChange("techStack", e.target.value)}
        error={errors.techStack}
        hint="Comma-separated list of technologies"
      />

      <div className="grid grid-cols-2 gap-3">
        <Input
          id="cs-live"
          label="Live URL"
          type="url"
          placeholder="https://..."
          value={data.liveUrl ?? ""}
          onChange={(e) => onChange("liveUrl", e.target.value)}
        />
        <Input
          id="cs-repo"
          label="Repository URL"
          type="url"
          placeholder="https://github.com/..."
          value={data.repoUrl ?? ""}
          onChange={(e) => onChange("repoUrl", e.target.value)}
        />
      </div>

      {/* Status select */}
      <div className="space-y-1.5">
        <label
          htmlFor="cs-status"
          className="block text-sm font-medium text-slate-700"
        >
          Status
        </label>
        <select
          id="cs-status"
          value={data.status}
          onChange={(e) => onChange("status", e.target.value)}
          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 bg-white outline-none transition-all duration-200 hover:border-slate-300 focus:border-indigo-400 focus:ring-3 focus:ring-indigo-100"
        >
          <option value="planned">Planned</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>
    </div>
  );
}
