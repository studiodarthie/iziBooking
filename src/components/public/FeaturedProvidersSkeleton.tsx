export function FeaturedProvidersSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="bg-white rounded-xl shadow-sm border border-divider overflow-hidden animate-pulse">
          {/* Image Skeleton */}
          <div className="h-[220px] w-full bg-neutral-200"></div>
          
          <div className="p-5">
            {/* Title Skeleton */}
            <div className="h-6 w-3/4 bg-neutral-200 rounded mb-4"></div>
            
            {/* Bio Skeleton */}
            <div className="h-4 w-full bg-neutral-200 rounded mb-2"></div>
            <div className="h-4 w-5/6 bg-neutral-200 rounded mb-6"></div>
            
            {/* Location Skeleton */}
            <div className="h-3 w-1/2 bg-neutral-200 rounded mb-6"></div>
            
            {/* Price & Divider Skeleton */}
            <div className="flex justify-between items-center mt-5 pt-4 border-t border-divider">
              <div className="h-5 w-1/3 bg-neutral-200 rounded"></div>
            </div>
            
            {/* Buttons Skeleton */}
            <div className="flex gap-2 mt-4">
              <div className="flex-1 h-10 bg-neutral-200 rounded-lg"></div>
              <div className="flex-1 h-10 bg-neutral-300 rounded-lg"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
