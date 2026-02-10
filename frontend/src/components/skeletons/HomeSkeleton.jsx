import React from 'react';

const ShimmerBlock = ({ className = '' }) => (
  <div className={`relative overflow-hidden bg-gray-200 rounded-md ${className}`}>
    <div className="absolute inset-0 -translate-x-full 
      bg-gradient-to-r from-transparent via-white/50 to-transparent 
      animate-[shimmer_1.6s_infinite]" />
  </div>
);

const SectionSkeleton = () => (
  <div className="py-6 md:py-16 bg-white border-t border-gray-100">
    <div className="max-w-[1600px] mx-auto px-3 sm:px-6 lg:px-8">

      {/* Section header */}
      <div className="flex justify-between items-end mb-4 md:mb-12">
        <ShimmerBlock className="w-32 md:w-48 h-6 md:h-8" />
        <ShimmerBlock className="w-16 md:w-24 h-3 md:h-4" />
      </div>

      {/* Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="min-h-[200px] md:min-h-[280px] bg-white rounded-xl p-3 md:p-4 flex flex-col gap-3"
          >
            <ShimmerBlock className="w-full h-28 md:h-40 rounded-lg" />
            <ShimmerBlock className="w-3/4 h-3 md:h-4" />
            <ShimmerBlock className="w-1/2 h-3 md:h-4" />
            <ShimmerBlock className="w-full mt-auto h-7 md:h-8" />
          </div>
        ))}
      </div>
    </div>
  </div>
);

const HomeSkeleton = () => {
  return (
    <div className="w-full bg-gray-50">

      {/* Hero Skeleton */}
      <div className="h-[260px] sm:h-[320px] md:h-[650px] 
        relative overflow-hidden bg-gray-200">
        <div className="absolute inset-0 -translate-x-full 
          bg-gradient-to-r from-transparent via-white/40 to-transparent 
          animate-[shimmer_2s_infinite]" />

        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-gray-300 font-bold text-2xl md:text-4xl">
            LuxeMarket
          </span>
        </div>
      </div>

      {/* Features Skeleton */}
      <div className="max-w-7xl mx-auto -mt-10 md:-mt-12 relative z-20 px-4 md:p-8">
        <ShimmerBlock className="h-20 md:h-24 rounded-2xl bg-white" />
      </div>

      {/* Sections */}
      <SectionSkeleton />
      <SectionSkeleton />
      <SectionSkeleton />
    </div>
  );
};

export default HomeSkeleton;
