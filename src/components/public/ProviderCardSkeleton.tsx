import React from 'react';

export function ProviderCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-ink/10 overflow-hidden shadow-sm h-full flex flex-col animate-pulse">
      {/* Cover Image Skeleton */}
      <div className="relative h-48 w-full bg-sand">
        {/* Badges Skeleton */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          <div className="bg-white/80 h-7 w-24 rounded-full" />
          <div className="bg-white/80 h-7 w-20 rounded-full" />
        </div>
        {/* Ribbon Skeleton */}
        <div className="absolute top-3 right-0 bg-white/80 h-7 w-24 rounded-l-full" />
      </div>

      {/* Content Skeleton */}
      <div className="p-5 flex flex-col flex-1">
        {/* Title & Rating */}
        <div className="flex justify-between items-start mb-3">
          <div className="h-6 bg-sand w-2/3 rounded-lg" />
          <div className="h-5 bg-sand w-10 rounded-lg ml-2 shrink-0" />
        </div>

        {/* Bio Skeleton */}
        <div className="space-y-2 mb-4">
          <div className="h-4 bg-sand w-full rounded-md" />
          <div className="h-4 bg-sand w-4/5 rounded-md" />
        </div>

        {/* Location Skeleton */}
        <div className="h-4 bg-sand w-1/2 rounded-md mb-2" />

        {/* Available Date Skeleton */}
        <div className="h-6 bg-sand/50 w-32 rounded-lg mb-3" />

        {/* Footer Skeleton */}
        <div className="mt-auto pt-4 border-t border-ink/5 flex items-end justify-between">
          <div className="space-y-2">
            <div className="h-3 bg-sand w-16 rounded-sm" />
            <div className="h-5 bg-sand w-20 rounded-md" />
          </div>
          
          <div className="h-10 bg-sand/50 w-28 rounded-xl" />
        </div>
      </div>
    </div>
  );
}
