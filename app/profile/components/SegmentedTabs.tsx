type SegmentedTab = { key: string; label: string };

export default function SegmentedTabs({
  tabs,
  value,
  onChange,
}: {
  tabs: SegmentedTab[];
  value: string;
  onChange: (key: string) => void;
}) {
  const idx = Math.max(0, tabs.findIndex((t) => t.key === value));
  return (
    <div className="relative grid w-full grid-cols-3 rounded-full bg-gray-100 p-1">
      <span
        className="absolute inset-y-1 left-1 w-1/3 rounded-full bg-white shadow-sm transition-transform duration-200"
        style={{ transform: `translateX(${idx * 100}%)` }}
        aria-hidden
      />
      {tabs.map((t) => {
        const active = t.key === value;
        return (
          <button
            key={t.key}
            onClick={() => onChange(t.key)}
            className={[
              "relative z-10 py-2 text-center text-sm font-semibold transition-colors",
              active ? "text-gray-900" : "text-gray-600",
            ].join(" ")}
          >
            {t.label}
          </button>
        );
      })}
    </div>
  );
}
