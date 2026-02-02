import React from 'react';

const HomeSkeleton = () => {
    const SectionSkeleton = () => (
        <div className="py-8 md:py-16 bg-white border-t border-gray-100 animate-pulse">
            <div className="max-w-[1600px] mx-auto px-3 sm:px-6 lg:px-8">
                <div className="flex justify-between items-end mb-6 md:mb-12">
                    <div className="w-48 h-8 bg-gray-200 rounded-md"></div>
                    <div className="w-24 h-4 bg-gray-200 rounded-md"></div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="min-h-[220px] md:min-h-[280px] bg-gray-50 rounded-xl p-4 flex flex-col gap-3">
                            <div className="w-full h-40 bg-gray-200 rounded-lg"></div>
                            <div className="w-3/4 h-4 bg-gray-200 rounded-md"></div>
                            <div className="w-1/2 h-4 bg-gray-200 rounded-md"></div>
                            <div className="w-full mt-auto h-8 bg-gray-200 rounded-md"></div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    return (
        <div className="w-full bg-gray-50">
            {/* Hero Skeleton */}
            <div className="h-[380px] md:h-[650px] bg-gray-200 w-full animate-pulse relative">
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-gray-300 font-bold text-4xl">LuxeMarket</div>
                </div>
            </div>

            {/* Features Skeleton */}
            <div className="max-w-7xl mx-auto -mt-12 relative z-20 p-8">
                <div className="h-24 bg-white rounded-2xl shadow-sm w-full"></div>
            </div>

            {/* Sections */}
            <SectionSkeleton />
            <SectionSkeleton />
            <SectionSkeleton />
        </div>
    );
};

export default HomeSkeleton;
