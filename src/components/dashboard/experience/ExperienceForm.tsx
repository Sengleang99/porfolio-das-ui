import { Input } from "@/components/ui";
import type { FormData } from "./constants";

interface ExperienceFormProps {
  data: FormData;
  onChange: (field: keyof FormData, value: string) => void;
  errors: Partial<Record<keyof FormData, string>>;
}

export function ExperienceForm({
  data,
  onChange,
  errors,
}: ExperienceFormProps) {
  const isPresent = data.endDate === "Present";

  const handlePresentChange = (checked: boolean) => {
    if (checked) {
      onChange("endDate", "Present");
    } else {
      onChange("endDate", "");
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          id="exp-company"
          label="Company / Organization"
          placeholder="e.g. Google"
          value={data.company}
          onChange={(e) => onChange("company", e.target.value)}
          error={errors.company}
        />

        <Input
          id="exp-role"
          label="Role / Title"
          placeholder="e.g. Senior Software Engineer"
          value={data.role}
          onChange={(e) => onChange("role", e.target.value)}
          error={errors.role}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Employment Type select */}
        <div className="space-y-1.5">
          <label
            htmlFor="exp-type"
            className="block text-sm font-medium text-slate-700"
          >
            Employment Type
          </label>
          <select
            id="exp-type"
            value={data.employmentType}
            onChange={(e) => onChange("employmentType", e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 bg-white outline-none transition-all duration-200 hover:border-slate-300 focus:border-indigo-400 focus:ring-3 focus:ring-indigo-100"
          >
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Contract">Contract</option>
            <option value="Freelance">Freelance</option>
            <option value="Internship">Internship</option>
          </select>
        </div>

        <Input
          id="exp-location"
          label="Location"
          placeholder="e.g. Mountain View, CA or Remote"
          value={data.location}
          onChange={(e) => onChange("location", e.target.value)}
          error={errors.location}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          id="exp-start"
          label="Start Date"
          type="month"
          value={data.startDate}
          onChange={(e) => onChange("startDate", e.target.value)}
          error={errors.startDate}
        />

        <div className="space-y-1.5">
          <Input
            id="exp-end"
            label="End Date"
            type="month"
            value={isPresent ? "" : data.endDate}
            onChange={(e) => onChange("endDate", e.target.value)}
            disabled={isPresent}
            error={errors.endDate}
          />
          <label className="flex items-center gap-2 mt-1.5 cursor-pointer text-xs text-slate-600 select-none">
            <input
              type="checkbox"
              checked={isPresent}
              onChange={(e) => handlePresentChange(e.target.checked)}
              className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
            />
            I currently work in this role
          </label>
        </div>
      </div>

      <div className="space-y-1.5">
        <label
          htmlFor="exp-desc"
          className="block text-sm font-medium text-slate-700"
        >
          Description
        </label>
        <textarea
          id="exp-desc"
          rows={4}
          placeholder="Describe your responsibilities, key achievements, and technologies used…"
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
    </div>
  );
}
