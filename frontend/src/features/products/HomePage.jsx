import React, { useState, useEffect,useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Truck, Shield, Clock, RotateCcw, Zap, TrendingUp } from 'lucide-react';
import ProductCard from '@/components/ProductCard.jsx';
import HomeSkeleton from '@/components/skeletons/HomeSkeleton.jsx';
import { getHomePageData } from '@/api';
import { CATEGORIES } from '@/constants/categories';
import { useToast } from '@/context/ToastContext';
import Countdown from 'react-countdown';

// Static Data: Slides
const slides = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop',
    title: 'Fashion Festival',
    subtitle: 'Up to 70% Off on Top Brands',
    cta: 'Shop Sale',
    link: '/shop?category=women-clothes'
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?q=80&w=2101&auto=format&fit=crop',
    title: 'Future Tech',
    subtitle: 'Experience the latest in electronics.',
    cta: 'Discover',
    link: '/shop?category=electronics'
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=2070&auto=format&fit=crop',
    title: 'Beauty & Wellness',
    subtitle: 'Discover your natural glow with premium beauty products.',
    cta: 'Shop Beauty',
    link: '/shop?category=beauty'
  }
];

// Static Data: Features
const features = [
  { icon: Truck, title: 'Free Shipping', desc: 'On all orders over $50' },
  { icon: Shield, title: 'Secure Payment', desc: '100% protected transactions' },
  { icon: RotateCcw, title: 'Easy Returns', desc: '30-day money back guarantee' },
  { icon: Clock, title: '24/7 Support', desc: 'Dedicated support team' },
];

const HomePage = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);

  // Single State Object
  const [homeData, setHomeData] = useState({
    flashSale: [],
    bestSellers: [],
    electronics: [],
    mensFashion: [],
    womensFashion: [],
    justForYou: []
  });

  // Carousel Effect
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Fetch Data Logic
  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoading(true);

        // 1. Check Session Cache (5 Minutes TTL)
        const cachedData = sessionStorage.getItem('homePageData');
        const cachedTime = sessionStorage.getItem('homePageCacheTime');
        const now = Date.now();
        const TTL = 5 * 60 * 1000;

        if (cachedData && cachedTime && (now - parseInt(cachedTime) < TTL)) {
          setHomeData(JSON.parse(cachedData));
          setLoading(false);
          return; // Exit if cache hit
        }

        // 2. Fetch from API
        // Axios interceptor returns response.data directly
        // Backend returns: { success: true, data: { ... } }
               const response = await getHomePageData();

        if (!response?.success) {
          throw new Error("Invalid home page response");
        }

        const data = {
          flashSale: response.data.flashSale || [],
          bestSellers: response.data.bestSellers || [],
          electronics: response.data.electronics || [],
          mensFashion: response.data.mensFashion || [],
          womensFashion: response.data.womensFashion || [],
          justForYou: response.data.justForYou || [],
        };

        setHomeData(data);
        sessionStorage.setItem("homePageData", JSON.stringify(data));
        sessionStorage.setItem("homePageCacheTime", now.toString());
      } catch (error) {
        console.error("Home Page Fetch Error:", error);
        addToast("Failed to load home page", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);



  // Helper Component: Section Header
  const SectionHeader = ({ title, subtitle, link, linkText = "View All", isDark = false }) => (
    <div className="flex justify-between items-end mb-4 md:mb-8 px-2 md:px-0">
      <div>
        <h2 className={`text-lg md:text-3xl font-extrabold tracking-tight font-display ${isDark ? 'text-white' : 'text-slate-900'}`}>
          {title}
        </h2>
        {subtitle && <p className={`mt-1 text-xs md:text-sm font-medium line-clamp-1 ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>
          {subtitle}
        </p>}
      </div>
      <Link to={link || '/shop'} className={`shrink-0 group flex items-center px-3 py-1.5 md:px-5 md:py-2.5 rounded-full shadow-sm hover:shadow-md border transition-all text-xs md:text-sm font-bold ${isDark ? 'bg-white/10 border-white/20 text-white hover:bg-white/20 hover:border-white/30' : 'bg-white border-gray-100 text-gray-800 hover:text-blue-600'}`}>
        {linkText}{" "}
        <ArrowRight size={16} className="ml-1 md:ml-2 group-hover:translate-x-1 transition-transform" />
      </Link>
    </div>
  );

  const categoriesToShow = useMemo(
  () => CATEGORIES.filter((cat) => cat.id !== "home"),
  []
);

  if (loading) return <HomeSkeleton />;

  return (
    <div className="min-w-[320px] overflow-x-hidden bg-gray-50/50 pb-20">
      <div className="flex flex-col min-h-screen bg-gray-50/50">

        {/* HERO SECTION */}
        <section className="relative h-[380px] md:h-[650px] overflow-hidden bg-gray-900">
          {slides.map((slide, index) =>
            <div key={slide.id} className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}>
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent z-10" />
              <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 z-20 flex items-center">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                  <div className="max-w-xl animate-slide-up pl-2 md:pl-0 mt-16 md:mt-0">
                    <span className="inline-block px-3 py-1 bg-blue-600 text-white text-[10px] md:text-xs font-bold rounded-full mb-3 md:mb-4 shadow-lg uppercase font-display">
                      New Collection
                    </span>
                    <h1 className="text-4xl md:text-7xl font-black text-white mb-2 md:mb-6 tracking-tight leading-none drop-shadow-lg font-display">
                      {slide.title}
                    </h1>
                    <p className="text-sm md:text-xl text-gray-200 mb-6 md:mb-10 font-medium drop-shadow-md max-w-[90%]">
                      {slide.subtitle}
                    </p>
                    <Link to={slide.link} className="inline-flex items-center bg-white text-slate-900 px-6 py-2.5 md:px-10 md:py-4 rounded-full font-bold text-xs md:text-base hover:bg-blue-600 hover:text-white transition-all duration-300 shadow-xl">
                      {slide.cta}{" "}
                      <ArrowRight className="ml-2" size={16} />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-30 flex space-x-2">
            {slides.map((_, idx) =>
              <button key={idx} onClick={() => setCurrentSlide(idx)} className={`h-1 md:h-1.5 rounded-full transition-all duration-500 shadow-sm ${idx === currentSlide ? 'bg-blue-500 w-6 md:w-8' : 'bg-white/30 w-2 hover:bg-white'
                }`} />
            )}
          </div>
        </section>

        {/* FEATURES */}
        <section className="bg-white border-b border-gray-100 shadow-sm relative z-20 md:-mt-12 mx-3 md:mx-auto max-w-7xl rounded-xl md:rounded-2xl p-4 md:p-8 transform -translate-y-6 md:translate-y-0 shadow-gray-200/50">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-8">
            {features.map((feature, idx) =>
              <Link key={idx} to={feature.title === '24/7 Support' ? '/support' : '#'} className="group flex flex-col md:flex-row items-center md:items-start text-center md:text-left cursor-pointer">
                <div className="p-2 md:p-3 bg-blue-50 text-blue-600 rounded-xl md:rounded-2xl shadow-sm mb-2 md:mb-0 md:mr-4 group-hover:bg-blue-100 transition-colors">
                  <feature.icon size={20} className="stroke-[1.5]" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-xs md:text-base mb-0.5 font-display group-hover:text-blue-600 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-[10px] md:text-xs text-gray-500 font-medium hidden sm:block">
                    {feature.desc}
                  </p>
                </div>
              </Link>
            )}
          </div>
        </section>

        {/* FLASH SALE */}
        {homeData.flashSale.length > 0 && (
          <section className="py-2 md:py-8 w-full">
            <div className="max-w-[1600px] mx-auto px-3 md:px-8">
              <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-xl md:rounded-2xl p-3 md:p-8 text-white shadow-xl overflow-hidden relative">
                <div className="relative z-10">
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-3 md:mb-6">
                    <div className="flex items-center gap-2 md:gap-3">
                      <div className="p-1.5 md:p-2 bg-white/20 backdrop-blur-md rounded-lg md:rounded-xl border border-white/20">
                        <Zap size={16} className="text-yellow-300 fill-current animate-pulse" />
                      </div>
                      <div>
                        <h2 className="text-lg md:text-3xl font-black italic tracking-tighter font-display">
                          FLASH SALE
                        </h2>
                        <p className="text-purple-100 font-medium text-xs md:text-sm opacity-90">
                          Limited time deals
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 md:gap-3 mt-2 md:mt-0 bg-black/30 px-3 py-1.5 md:px-4 md:py-2 rounded-full backdrop-blur-md border border-white/10">
                      <span className="font-bold text-[9px] md:text-xs text-purple-200 uppercase tracking-widest">
                        Ends in
                      </span>
                      <Countdown
                        date={new Date(Date.now() + 12 * 60 * 60 * 1000)}
                        renderer={({ hours, minutes, seconds, completed }) => {
                          if (completed) {
                            return <div className="font-mono text-xs md:text-lg font-bold text-white tracking-widest">00:00:00</div>;
                          }
                          return (
                            <div className="font-mono text-xs md:text-lg font-bold text-white tracking-widest">
                              {String(hours).padStart(2, '0')}:{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                            </div>
                          );
                        }}
                      />
                    </div>
                  </div>
                  <div className="flex overflow-x-auto pb-4 gap-3 no-scrollbar snap-x md:grid md:grid-cols-5 md:gap-3">
                    {homeData.flashSale.map(product =>
                      <div key={product._id} className="min-h-[140px] sm:min-h-[180px] md:min-h-[220px] flex-shrink-0 w-36 sm:w-40 md:w-auto snap-center">
                        <ProductCard product={product} />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* SHOP BY CATEGORY */}
        <section className="py-6 md:py-12 bg-gradient-to-b from-white to-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-lg md:text-3xl font-extrabold text-slate-900 mb-6 text-center font-display">
              Shop by Category
            </h2>
            <div className="flex overflow-x-auto pb-4 gap-4 md:gap-8 no-scrollbar snap-x px-2 md:px-0 md:flex-wrap md:justify-center">
              {categoriesToShow.map(cat =>
                <Link key={cat.id} to={`/shop?category=${cat.id}`} className="group flex flex-col items-center gap-2 md:gap-3 min-w-[70px] md:w-32 snap-center">
                  <div className="w-16 h-16 md:w-28 md:h-28 rounded-full bg-gradient-to-br from-blue-50 to-indigo-100 p-1 md:p-1.5 shadow-sm group-hover:shadow-lg border-2 border-transparent group-hover:border-indigo-400 relative overflow-hidden transition-all duration-300">
                    <img src={`https://picsum.photos/seed/${cat.name}/200`} alt={cat.name} className="w-full h-full object-cover rounded-full grayscale group-hover:grayscale-0 transition-all duration-300" />
                  </div>
                  <span className="font-bold text-gray-600 group-hover:text-indigo-600 text-[10px] md:text-sm text-center uppercase tracking-wide transition-colors duration-300">
                    {cat.name.split(" ")[0]}
                  </span>
                </Link>
              )}
            </div>
          </div>
        </section>

        {/* PROMO BANNERS */}
        <section className="py-4 md:py-16 max-w-[1600px] mx-auto px-3 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-8">
            <div className="relative h-48 md:h-96 rounded-2xl overflow-hidden group cursor-pointer shadow-lg" onClick={() => navigate('/shop?discount=true')}>
              <img src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=2070" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="Offer" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent p-6 md:p-14 flex flex-col justify-center items-start">
                <span className="text-yellow-400 font-bold tracking-widest text-[10px] uppercase mb-2 px-2 py-0.5 bg-yellow-400/10 rounded-full border border-yellow-400/20">
                  Limited Time
                </span>
                <h3 className="text-2xl md:text-5xl font-black text-white mb-3 md:mb-8 leading-tight font-display">
                  Black Friday
                </h3>
                <button className="bg-white text-slate-900 px-4 py-2 md:px-8 md:py-3.5 rounded-full font-bold text-xs md:text-base">
                  Shop Deals
                </button>
              </div>
            </div>
            <div className="relative h-48 md:h-96 rounded-2xl overflow-hidden group cursor-pointer shadow-lg" onClick={() => navigate('/shop?isNew=true')}>
              <img src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="Offer" />
              <div className="absolute inset-0 bg-gradient-to-l from-black/90 via-black/40 to-transparent p-6 md:p-14 flex flex-col justify-center items-end text-right">
                <span className="text-pink-400 font-bold tracking-widest text-[10px] uppercase mb-2 px-2 py-0.5 bg-pink-400/10 rounded-full border border-pink-400/20">
                  New Season
                </span>
                <h3 className="text-2xl md:text-5xl font-black text-white mb-3 md:mb-8 leading-tight font-display">
                  Winter
                </h3>
                <button className="bg-white text-slate-900 px-4 py-2 md:px-8 md:py-3.5 rounded-full font-bold text-xs md:text-base">
                  Explore Now
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ELECTRONICS */}
        {homeData.electronics.length > 0 && (
          <section className="relative py-6 md:py-16 my-4 md:my-8 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-50/60 via-indigo-50/40 to-purple-50/60 md:rounded-[3rem]" />
            <div className="max-w-[1600px] mx-auto px-3 md:px-8 relative z-10">
              <SectionHeader title="Best of Electronics" subtitle="Discover cutting-edge technology and innovation" link="/shop?category=electronics" />
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {homeData.electronics.map(product =>
                  <div key={product._id} className="min-h-[160px] sm:min-h-[220px] md:min-h-[280px]">
                    <ProductCard product={product} />
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* BEST SELLERS */}
        {homeData.bestSellers.length > 0 && (
          <section className="py-8 md:py-20 bg-slate-900 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
            <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <div className="flex justify-between items-end mb-6 md:mb-12">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="text-green-400 w-4 h-4 md:w-5 md:h-5" />
                    <span className="text-green-400 font-bold uppercase tracking-widest text-[10px] md:text-xs">
                      Trending Now
                    </span>
                  </div>
                  <h2 className="text-2xl md:text-5xl font-black font-display tracking-tight">
                    Best Sellers
                  </h2>
                </div>
                <Link to="/shop" className="text-white/80 border-b border-white/30 pb-1 text-xs md:text-sm font-semibold">
                  View Leaderboard
                </Link>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {homeData.bestSellers.map(product =>
                  <div key={product._id} className="min-h-[160px] sm:min-h-[220px] md:min-h-[280px]">
                    <ProductCard product={product} />
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* FASHION SECTIONS */}
        <section className="relative py-8 md:py-16 bg-gradient-to-br from-gray-50 to-white overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-50/30 via-purple-50/20 to-pink-50/30" />
          <div className="max-w-[1600px] mx-auto px-3 sm:px-6 lg:px-8 relative z-10">

            {/* Men's Fashion */}
            {homeData.mensFashion.length > 0 && (
              <div className="mb-12">
                <SectionHeader title="Men's Premium Collection" subtitle="Sophisticated styles for modern gentlemen" link="/shop?category=men-clothes" />
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {homeData.mensFashion.map(product =>
                    <div key={product._id} className="min-h-[160px] sm:min-h-[220px] md:min-h-[280px]">
                      <ProductCard product={product} />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Women's Fashion */}
            {homeData.womensFashion.length > 0 && (
              <div>
                <SectionHeader title="Women's Trending Styles" subtitle="Elegance redefined for every occasion" link="/shop?category=women-clothes" />
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {homeData.womensFashion.map(product =>
                    <div key={product._id} className="min-h-[160px] sm:min-h-[220px] md:min-h-[280px]">
                      <ProductCard product={product} />
                    </div>
                  )}
                </div>
              </div>
            )}

          </div>
        </section>

        {/* JUST FOR YOU */}
        {homeData.justForYou.length > 0 && (
          <section className="py-8 md:py-16 bg-white border-t border-gray-100">
            <div className="max-w-[1800px] mx-auto px-3 sm:px-6 lg:px-8">
              <div className="text-center mb-6 md:mb-12">
                <h2 className="text-xl md:text-4xl font-extrabold text-slate-900 font-display">
                  Just For You
                </h2>
                <p className="text-gray-500 mt-2 text-xs md:text-base max-w-2xl mx-auto">
                  Recommended based on your history.
                </p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {homeData.justForYou.map(product =>
                  <div key={product._id} className="min-h-[160px] sm:min-h-[220px] md:min-h-[280px]">
                    <ProductCard product={product} />
                  </div>
                )}
              </div>
              <div className="mt-8 md:mt-16 text-center">
                <button onClick={() => navigate('/shop')} className="px-8 py-3 bg-slate-900 text-white rounded-full font-bold shadow-xl text-sm">
                  Load More Products
                </button>
              </div>
            </div>
          </section>
        )}

      </div>
    </div>
  );
};

export default HomePage;
