export function SkeletonGrid() {
  return (
    <section className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: 8 }).map((_, idx) => (
        <div key={idx} className="overflow-hidden rounded-2xl border border-white/10 bg-panel">
          <div className="skeleton aspect-[3/4] w-full" />
          <div className="space-y-2 p-4">
            <div className="skeleton h-4 w-4/5 rounded-lg" />
            <div className="skeleton h-3 w-2/3 rounded-lg" />
            <div className="grid grid-cols-2 gap-2">
              <div className="skeleton h-7 rounded-lg" />
              <div className="skeleton h-7 rounded-lg" />
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}


