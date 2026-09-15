export default function InstitutionsSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="mb-5 h-9 w-[330px] rounded-full bg-gray-100" />

      <div className="h-11 rounded-xl bg-[#edf6f5]" />

      <div className="divide-y divide-gray-100">
        {Array.from({
          length: 5,
        }).map((_, index) => (
          <div
            key={index}
            className="
              grid min-h-[72px]
              grid-cols-5
              items-center
              gap-4
              px-5
            "
          >
            <div className="h-3 w-32 rounded bg-gray-100" />
            <div className="h-3 w-24 rounded bg-gray-100" />
            <div className="h-3 w-28 rounded bg-gray-100" />
            <div className="h-3 w-32 rounded bg-gray-100" />
            <div className="h-8 w-14 rounded-md bg-gray-100" />
          </div>
        ))}
      </div>
    </div>
  );
}
