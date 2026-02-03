import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '@/store/productsSlice';
import ProductGrid from '@/components/ProductGrid';

const Section = ({ title, products }) => {
  if (!products || products.length === 0) return null;
  return (
    <div className="mb-12">
      <div className="flex justify-between items-end mb-6">
        <h2 className="text-2xl font-bold text-slate-900 capitalize">{title}</h2>
        {/* <Link to={link || "/products"} className="text-sm font-semibold text-blue-600 hover:text-blue-700">See All →</Link> */}
      </div>
      <ProductGrid products={products} />
    </div>
  );
};

const Home = () => {
  const dispatch = useDispatch();
  const { homeData, loading, error } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchHomePageData());
  }, [dispatch]);

  if (loading && !homeData) {
    return (
      <div className="min-h-screen bg-gray-50 py-4 md:py-8">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          {/* Skeleton - Could extract to a component */}
          {[1, 2, 3].map((i) => (
            <div key={i} className="mb-12">
              <div className="h-8 w-48 bg-gray-200 rounded mb-6 animate-pulse" />
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
                {[1, 2, 3, 4, 5].map((j) => (
                  <div key={j} className="aspect-[3/4] bg-gray-200 rounded-xl animate-pulse" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-md mx-auto px-4 text-center">
          <div className="bg-red-50 p-6 rounded-full mb-6 mx-auto w-24 h-24 flex items-center justify-center">
            <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Failed to load</h3>
          <p className="text-gray-500 mb-8">{error}</p>
          <button
            onClick={() => dispatch(fetchHomePageData())}
            className="bg-slate-900 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-slate-800 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 md:py-8">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">

        {/* HERO / FLASH SALE - Highlight this section? For now keeping same grid style */}
        {homeData?.flashSale?.length > 0 && (
          <Section title="⚡ Flash Sale" products={homeData.flashSale} />
        )}

        {homeData?.bestSellers?.length > 0 && (
          <Section title="🔥 Best Sellers" products={homeData.bestSellers} />
        )}

        {homeData?.electronics?.length > 0 && (
          <Section title="Electronics" products={homeData.electronics} />
        )}

        {homeData?.mensFashion?.length > 0 && (
          <Section title="Men's Fashion" products={homeData.mensFashion} />
        )}

        {homeData?.womensFashion?.length > 0 && (
          <Section title="Women's Fashion" products={homeData.womensFashion} />
        )}

        {homeData?.justForYou?.length > 0 && (
          <Section title="Just For You" products={homeData.justForYou} />
        )}

      </div>
    </div>
  );
};

export default Home;
