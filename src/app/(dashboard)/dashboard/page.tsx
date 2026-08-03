import { getDashboardCounts } from "./actions";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const counts = await getDashboardCounts();

  const cards = [
    {
      label: "Projects Completed",
      value: String(counts.caseStudies),
      change: `${counts.caseStudies} case studies`,
      color: "from-indigo-500 to-blue-400",
    },
    {
      label: "Years of Experience",
      value: "4+",
      change: "Since 2021",
      color: "from-violet-500 to-purple-400",
    },
    {
      label: "Technologies",
      value: String(counts.techStacks),
      change: `${counts.techStacks} tech stacks`,
      color: "from-sky-500 to-cyan-400",
    },
    {
      label: "Messages",
      value: String(counts.messages),
      change: `${counts.messages} messages`,
      color: "from-emerald-500 to-teal-400",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stat cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
        {cards.map((card) => (
          <div
            key={card.label}
            className="bg-white rounded-2xl p-3.5 sm:p-5 border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_20px_rgba(99,102,241,0.1)] transition-shadow duration-300"
          >
            <div
              className={`inline-flex w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br ${card.color} items-center justify-center text-white font-bold text-xs sm:text-sm shadow-md mb-2 sm:mb-3`}
            >
              {card.value.replace("+", "").replace(" ", "").charAt(0) || "0"}
            </div>
            <p className="text-xl sm:text-2xl font-bold text-slate-800">{card.value}</p>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5 truncate">{card.label}</p>
            <p className="text-[11px] sm:text-xs text-indigo-500 mt-1 font-medium truncate">
              {card.change}
            </p>
          </div>
        ))}
      </div>

      {/* Placeholder content area */}
      <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
        <h2 className="text-base font-semibold text-slate-800 mb-4">
          Recent Activity
        </h2>
        <div className="space-y-3">
          {[
            "Updated Case Study: E-Commerce Dashboard",
            "Added new project to portfolio",
            "Received 3 new profile views",
            "Education record updated",
          ].map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-3 py-2 border-b border-slate-50 last:border-0"
            >
              <span className="w-2 h-2 rounded-full bg-indigo-400 shrink-0" />
              <span className="text-sm text-slate-600">{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
