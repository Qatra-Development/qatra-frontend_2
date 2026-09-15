interface InfoRow {
  label: string;
  value: React.ReactNode;
}

interface Props {
  title: string;
  rows: InfoRow[];
  className?: string;
}

export default function ReviewInfoSection({
  title,
  rows,
  className = "",
}: Props) {
  return (
    <section
      className={`
        admin-section
        ${className}
      `}
    >
      <div className="admin-section-header">{title}</div>

      <div>
        {rows.map((row, index) => (
          <div
            key={`${row.label}-${index}`}
            className="
                grid
                min-h-[50px]
                grid-cols-[150px_minmax(0,1fr)]
                border-b
                border-[var(--admin-border-soft)]
                last:border-b-0
                sm:grid-cols-[170px_minmax(0,1fr)]
              "
          >
            <div
              className="
                  flex
                  items-center
                  bg-[#fafafb]
                  px-4
                  text-xs
                  text-[var(--admin-text-muted)]
                "
            >
              {row.label}
            </div>

            <div
              className="
                  flex
                  min-w-0
                  items-center
                  px-4 py-3
                  text-xs
                  font-medium
                  text-[var(--admin-text-primary)]
                "
            >
              {row.value}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
