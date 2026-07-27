import { Input } from "@/components/ui";
import type { FormData } from "./constants";

interface EducationFormProps {
  data: FormData;
  onChange: (field: keyof FormData, value: string) => void;
  errors: Partial<Record<keyof FormData, string>>;
}

export function EducationForm({ data, onChange, errors }: EducationFormProps) {
  const isPresent = data.end_year === "Present";

  const handlePresentChange = (checked: boolean) => {
    if (checked) {
      onChange("end_year", "Present");
    } else {
      onChange("end_year", "");
    }
  };

  return (
    <div className="space-y-4">
      <Input
        id="edu-institution"
        label="Institution / School"
        placeholder="e.g. Stanford University"
        value={data.university}
        onChange={(e) => onChange("university", e.target.value)}
        error={errors.university}
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
          value={data.major}
          onChange={(e) => onChange("major", e.target.value)}
          error={errors.major}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          id="edu-start"
          label="Start Date"
          type="month"
          value={data.start_year}
          onChange={(e) => onChange("start_year", e.target.value)}
          error={errors.start_year}
        />

        <div className="space-y-1.5">
          <Input
            id="edu-end"
            label="End Date"
            type="month"
            value={isPresent ? "" : data.end_year}
            onChange={(e) => onChange("end_year", e.target.value)}
            disabled={isPresent}
            error={errors.end_year}
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
          value={data.descr ?? ""}
          onChange={(e) => onChange("descr", e.target.value)}
          className={`
            w-full px-3.5 py-2.5 rounded-xl border text-sm text-slate-800
            placeholder-slate-400 bg-white outline-none resize-none
            transition-all duration-200 hover:border-slate-300
            focus:border-indigo-400 focus:ring-3 focus:ring-indigo-100
            ${errors.descr ? "border-red-400" : "border-slate-200"}
          `}
        />
        {errors.descr && <p className="text-xs text-red-500">{errors.descr}</p>}
      </div>
    </div>
  );
}
