export const PageLoader = () => {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center z-50">
      <div className="text-center">
        <div className="relative mb-8">
          {/* Optimized animated books stack */}
          <div className="relative w-24 h-24 mx-auto will-change-transform">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg transform rotate-12 shadow-lg animate-[pulse_2s_ease-in-out_infinite]"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg transform -rotate-6 shadow-lg animate-[pulse_2s_ease-in-out_infinite_0.2s]"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg transform rotate-3 shadow-lg animate-[pulse_2s_ease-in-out_infinite_0.4s]"></div>
            {/* Simplified page effects */}
            <div className="absolute top-1 right-1 w-2 h-8 bg-white rounded-sm transform rotate-12 opacity-70 animate-[pulse_2s_ease-in-out_infinite_0.1s]"></div>
            <div className="absolute top-1 right-1 w-2 h-8 bg-white rounded-sm transform -rotate-6 opacity-70 animate-[pulse_2s_ease-in-out_infinite_0.3s]"></div>
          </div>
          {/* Optimized floating elements */}
          <div className="absolute -top-3 -right-3 w-4 h-4 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full shadow-md animate-[bounce_1s_ease-in-out_infinite]"></div>
          <div className="absolute -bottom-3 -left-3 w-3 h-3 bg-gradient-to-r from-purple-400 to-purple-500 rounded-full shadow-md animate-[bounce_1s_ease-in-out_infinite_0.3s]"></div>
          <div className="absolute top-1/2 -right-5 w-2 h-2 bg-gradient-to-r from-blue-300 to-blue-400 rounded-full shadow-sm animate-[bounce_1s_ease-in-out_infinite_0.6s]"></div>
          <div className="absolute top-1/4 -left-4 w-2 h-2 bg-gradient-to-r from-purple-300 to-purple-400 rounded-full shadow-sm animate-[bounce_1s_ease-in-out_infinite_0.8s]"></div>
          {/* Simplified sparkle effects */}
          <div className="absolute top-0 left-1/2 w-1 h-1 bg-yellow-400 rounded-full animate-[ping_2s_ease-in-out_infinite_1s]"></div>
          <div className="absolute bottom-2 right-2 w-1 h-1 bg-yellow-300 rounded-full animate-[ping_2s_ease-in-out_infinite_1.2s]"></div>
        </div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-900 via-purple-800 to-blue-900 bg-clip-text text-transparent mb-3 animate-[pulse_2s_ease-in-out_infinite]">PolyPros</h2>
        <div className="flex items-center justify-center space-x-2 mb-3">
          <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full shadow-sm animate-[bounce_1s_ease-in-out_infinite]"></div>
          <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full shadow-sm animate-[bounce_1s_ease-in-out_infinite_0.1s]"></div>
          <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full shadow-sm animate-[bounce_1s_ease-in-out_infinite_0.2s]"></div>
        </div>
        <p className="text-blue-700 text-sm font-medium animate-[pulse_2s_ease-in-out_infinite]">Loading your study companion...</p>
      </div>
    </div>
  );
};