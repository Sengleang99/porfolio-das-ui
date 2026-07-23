import { Input } from "@/components/ui";
import type { FormData } from "./constants";

interface EducationFormProps {
  data: FormData;
  onChange: (field: keyof FormData, value: string) => void;
  errors: Partial<Record<keyof FormData, string>>;
}

export function EducationForm({ data, onChange, errors }: EducationFormProps) {
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
      <Input
        id="edu-institution"
        label="Institution / School"
        placeholder="e.g. Stanford University"
        value={data.institution}
        onChange={(e) => onChange("institution", e.target.value)}
        error={errors.institution}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          id="edu-degree"
          label="Degree / Certificate"
          placeholder="e.g. Bachelor of Science"
          value={data.degree}
          onChange={(e) => onChange("degree", e.target.value)}
          error={errors.degree}
        />

        <Input
          id="edu-field"
          label="Field of Study"
          placeholder="e.g. Computer Science"
          value={data.fieldOfStudy}
          onChange={(e) => onChange("fieldOfStudy", e.target.value)}
          error={errors.fieldOfStudy}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          id="edu-start"
          label="Start Date"
          type="month"
          value={data.startDate}
          onChange={(e) => onChange("startDate", e.target.value)}
          error={errors.startDate}
        />

        <div className="space-y-1.5">
          <Input
            id="edu-end"
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
            I am currently studying here
          </label>
        </div>
      </div>

      <Input
        id="edu-grade"
        label="Grade / GPA (Optional)"
        placeholder="e.g. GPA: 3.8 / 4.0 or Grade: Distinction"
        value={data.grade ?? ""}
        onChange={(e) => onChange("grade", e.target.value)}
        error={errors.grade}
      />

      <div className="space-y-1.5">
        <label
          htmlFor="edu-desc"
          className="block text-sm font-medium text-slate-700"
        >
          Description (Optional)
        </label>
        <textarea
          id="edu-desc"
          rows={3}
          placeholder="Describe relevant courses, activities, achievements, or research…"
          value={data.description ?? ""}
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
