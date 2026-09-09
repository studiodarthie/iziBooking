export default function ProviderProfileLoading() {
  return (
    <div className="min-h-screen bg-[#FBF6EE] pb-20 animate-pulse">
      {/* Navbar Skeleton */}
      <header className="bg-[#0d0d0d] border-b border-white/5 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 md:px-8 h-[72px] flex items-center justify-between">
          <div className="w-32 h-8 bg-white/10 rounded"></div>
          <div className="flex gap-4">
            <div className="w-24 h-4 bg-white/10 rounded hidden lg:block"></div>
            <div className="w-24 h-4 bg-white/10 rounded hidden lg:block"></div>
            <div className="w-10 h-10 rounded-full bg-white/10"></div>
          </div>
        </div>
      </header>

      {/* Cover Image & Avatar Section Skeleton */}
      <div className="relative">
        <div className="h-64 md:h-[400px] w-full bg-neutral-200"></div>

        <div className="max-w-6xl mx-auto px-4 md:px-8 relative z-20 -mt-20 flex flex-col md:flex-row md:items-end gap-6 mb-12">
          {/* Avatar */}
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-[#FBF6EE] bg-neutral-200 shrink-0"></div>
          
          <div className="flex-1 pb-2">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-3">
                <div className="w-24 h-6 bg-neutral-200 rounded-full"></div>
                <div className="w-64 h-10 bg-neutral-200 rounded"></div>
                <div className="w-48 h-5 bg-neutral-200 rounded"></div>
              </div>
              <div className="flex gap-3 mt-4 md:mt-0">
                <div className="w-32 h-12 bg-neutral-200 rounded-xl"></div>
                <div className="w-40 h-12 bg-neutral-200 rounded-xl"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-8 grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-10">
        
        {/* Left Column Skeleton */}
        <div className="space-y-10">
          <section>
            <div className="w-40 h-8 bg-neutral-200 rounded mb-6"></div>
            <div className="space-y-3">
              <div className="w-full h-4 bg-neutral-200 rounded"></div>
              <div className="w-full h-4 bg-neutral-200 rounded"></div>
              <div className="w-5/6 h-4 bg-neutral-200 rounded"></div>
              <div className="w-4/6 h-4 bg-neutral-200 rounded"></div>
            </div>
          </section>

          <section>
            <div className="w-56 h-8 bg-neutral-200 rounded mb-6"></div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="aspect-square bg-neutral-200 rounded-xl"></div>
              <div className="aspect-square bg-neutral-200 rounded-xl"></div>
              <div className="aspect-square bg-neutral-200 rounded-xl"></div>
              <div className="aspect-square bg-neutral-200 rounded-xl"></div>
              <div className="aspect-square bg-neutral-200 rounded-xl"></div>
              <div className="aspect-square bg-neutral-200 rounded-xl"></div>
            </div>
          </section>
        </div>

        {/* Right Column Skeleton */}
        <div className="space-y-8">
          <div className="bg-white rounded-2xl p-6 border border-neutral-200 shadow-sm sticky top-24">
            <div className="w-32 h-6 bg-neutral-100 rounded mb-4"></div>
            <div className="w-48 h-10 bg-neutral-200 rounded mb-8"></div>
            
            <div className="space-y-4 mb-8">
              <div className="w-full h-4 bg-neutral-100 rounded"></div>
              <div className="w-5/6 h-4 bg-neutral-100 rounded"></div>
              <div className="w-4/6 h-4 bg-neutral-100 rounded"></div>
            </div>

            <div className="w-full h-12 bg-neutral-200 rounded-xl mb-4"></div>
            <div className="w-full h-12 bg-neutral-100 rounded-xl"></div>
          </div>
        </div>

      </div>
    </div>
  );
}
