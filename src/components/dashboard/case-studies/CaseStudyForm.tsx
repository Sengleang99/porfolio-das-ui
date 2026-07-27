import { Input, MultiSelect } from "@/components/ui";
import { type FormData, TECH_OPTIONS } from "./constants";

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

      <Input
        id="cs-tag"
        label="Tag / Category"
        placeholder="e.g. E-Commerce, Web App, AI, Mobile"
        value={data.tag}
        onChange={(e) => onChange("tag", e.target.value)}
        error={errors.tag}
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

      <MultiSelect
        id="cs-tech"
        label="Tech Stack"
        placeholder="Select technologies..."
        value={data.tech}
        onChange={(value) => onChange("tech", value)}
        options={TECH_OPTIONS}
        error={errors.tech}
      />

      <div className="grid grid-cols-2 gap-3">
        <Input
          id="cs-demo"
          label="Demo URL"
          type="url"
          placeholder="https://..."
          value={data.demoUrl}
          onChange={(e) => onChange("demoUrl", e.target.value)}
          error={errors.demoUrl}
        />
        <Input
          id="cs-github"
          label="GitHub URL"
          type="url"
          placeholder="https://github.com/..."
          value={data.githubUrl}
          onChange={(e) => onChange("githubUrl", e.target.value)}
          error={errors.githubUrl}
        />
      </div>
    </div>
  );
}
