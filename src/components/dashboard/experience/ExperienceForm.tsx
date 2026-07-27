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
  const isPresent = data.to_year === "Present";

  const handlePresentChange = (checked: boolean) => {
    if (checked) {
      onChange("to_year", "Present");
    } else {
      onChange("to_year", "");
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
          value={data.position}
          onChange={(e) => onChange("position", e.target.value)}
          error={errors.position}
        />
      </div>

      <div>
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
            value={data.status}
            onChange={(e) => onChange("status", e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 bg-white outline-none transition-all duration-200 hover:border-slate-300 focus:border-indigo-400 focus:ring-3 focus:ring-indigo-100"
          >
            <option value="full-time">Full-time</option>
            <option value="part-time">Part-time</option>
            <option value="contract">Contract</option>
            <option value="freelance">Freelance</option>
            <option value="intern">Internship</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          id="exp-start"
          label="Start Date"
          type="date"
          value={data.from_year}
          onChange={(e) => onChange("from_year", e.target.value)}
          error={errors.from_year}
        />

        <div className="space-y-1.5">
          <Input
            id="exp-end"
            label="End Date"
            type="date"
            value={isPresent ? "" : data.to_year}
            onChange={(e) => onChange("to_year", e.target.value)}
            disabled={isPresent}
            error={errors.to_year}
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
          value={data.descr}
          onChange={(e) => onChange("descr", e.target.value)}
          className={`
            w-full px-3.5 py-2.5 rounded-xl border text-sm text-slate-800
            placeholder-slate-400 bg-white outline-none resize-none
            transition-all duration-200 hover:border-slate-300
            focus:border-indigo-400 focus:ring-3 focus:ring-indigo-100
            ${errors.descr ? "border-red-400" : "border-slate-200"}
          `}
        />
        {errors.descr && (
          <p className="text-xs text-red-500">{errors.descr}</p>
        )}
      </div>
    </div>
  );
}
