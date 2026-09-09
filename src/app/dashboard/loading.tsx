export default function DashboardLoading() {
  return (
    <div className="flex flex-col h-full pb-12 animate-pulse">
      {/* Header Skeleton */}
      <div className="mb-6">
        <div className="h-8 w-48 bg-ink/5 rounded-md mb-2"></div>
        <div className="h-4 w-64 bg-ink/5 rounded-md"></div>
      </div>

      {/* 4 KPIs Top Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-2xl p-5 border border-ink/5 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-ink/5 shrink-0"></div>
            <div className="flex-1 space-y-2">
              <div className="h-3 w-20 bg-ink/5 rounded"></div>
              <div className="h-6 w-12 bg-ink/5 rounded"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Middle Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {[1, 2].map((i) => (
          <div key={i} className="bg-white rounded-2xl p-6 border border-ink/5 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div className="h-6 w-32 bg-ink/5 rounded"></div>
              <div className="h-8 w-40 bg-ink/5 rounded-lg"></div>
            </div>
            <div className="h-[200px] w-full bg-ink/5 rounded-xl"></div>
          </div>
        ))}
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0">
        <div className="lg:col-span-4 bg-white rounded-2xl p-6 border border-ink/5 shadow-sm">
          <div className="h-6 w-32 bg-ink/5 rounded mb-6"></div>
          <div className="space-y-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-ink/5 shrink-0"></div>
                <div className="flex-1 space-y-2 py-1">
                  <div className="flex justify-between">
                    <div className="h-4 w-24 bg-ink/5 rounded"></div>
                    <div className="h-3 w-12 bg-ink/5 rounded"></div>
                  </div>
                  <div className="h-3 w-32 bg-ink/5 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="lg:col-span-8 bg-white rounded-2xl p-6 border border-ink/5 shadow-sm">
          <div className="h-6 w-48 bg-ink/5 rounded mb-6"></div>
          <div className="h-[300px] w-full bg-ink/5 rounded-xl"></div>
        </div>
      </div>
    </div>
  );
}
