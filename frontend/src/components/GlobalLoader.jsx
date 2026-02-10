import { ClipLoader } from 'react-spinners';

const GlobalLoader = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">

      <div className="flex flex-col items-center gap-3 sm:gap-4">
        <ClipLoader
          size={36}
          color="#334155"  
          speedMultiplier={1.2}
        />

        <p className="text-xs sm:text-sm text-slate-600 tracking-wide">
          Loading LuxeMarket…
        </p>
      </div>
    </div>
  );
};

export default GlobalLoader;
