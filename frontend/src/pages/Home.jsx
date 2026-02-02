import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '@/store/productsSlice';
import ProductGrid from '@/components/ProductGrid';

const Home = () => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProducts('home'));
  }, [dispatch]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-4 md:py-8">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center py-24">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900 mx-auto mb-4"></div>
              <p className="text-gray-600 font-medium">Loading products...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-4 md:py-8">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center py-24">
            <div className="text-center">
              <div className="bg-red-50 p-6 rounded-full mb-6 mx-auto max-w-sm">
                <svg className="w-12 h-12 text-red-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong</h3>
              <p className="text-gray-500 max-w-sm mx-auto mb-8 leading-relaxed">
                {error}
              </p>
              <button
                onClick={() => dispatch(fetchProducts('home'))}
                className="bg-slate-900 text-white px-8 py-3.5 rounded-full font-bold hover:bg-blue-600 transition-all shadow-lg hover:shadow-blue-200"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 md:py-8">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-slate-900 capitalize">Home & Living</h1>
        </div>
        <ProductGrid products={products} />
      </div>
    </div>
  );
};

export default Home;
