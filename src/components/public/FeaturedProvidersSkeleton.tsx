export function FeaturedProvidersSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
      {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
        <div key={i} className="aspect-square rounded-xl bg-neutral-200 animate-pulse"></div>
      ))}
    </div>
  );
}
