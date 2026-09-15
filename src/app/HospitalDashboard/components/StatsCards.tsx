import { CircleDot, Droplets, Megaphone, TriangleAlert } from "lucide-react";

const stats = [
  { label: "الطلبات الواردة", value: "48", icon: CircleDot, color: "#607078", bg: "#f0f3f4" },
  { label: "بحاجة لاستجابة", value: "14", icon: TriangleAlert, color: "#d9a231", bg: "#fff5d9" },
  { label: "وحدات متاحة", value: "26", icon: Droplets, color: "#24a77d", bg: "#e9f8f2" },
  { label: "نداءات التبرع", value: "8", icon: Megaphone, color: "#a91f38", bg: "#fbecef" },
];

export default function StatsCards() {
  return (
    <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4" aria-label="ملخص الطلبات">
      {stats.map(({ label, value, icon: Icon, color, bg }) => (
        <article key={label} className="relative min-h-[120px] overflow-hidden rounded-xl border border-[#f0f2f3] bg-white px-5 py-5 shadow-[0_5px_20px_rgba(28,50,58,0.025)]">
          <div className="relative z-10 flex w-full items-center justify-between text-xs font-medium text-[#58676d]">
            <span>{label}</span>
            <Icon className="h-[17px] w-[17px] shrink-0" style={{ color }} strokeWidth={1.7} />
          </div>
          <strong className="relative z-10 mt-8 block text-xl font-bold leading-none text-[#26373d]">{value}</strong>
          <span className="absolute -bottom-8 -right-7 h-[86px] w-[86px] rounded-full" style={{ backgroundColor: bg }} />
        </article>
      ))}
    </section>
  );
}
