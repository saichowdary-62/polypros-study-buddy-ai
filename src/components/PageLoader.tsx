export const PageLoader = () => {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center z-50">
      <div className="text-center">
        <div className="relative mb-8">
          {/* Animated books stack with enhanced animation */}
          <div className="relative w-24 h-24 mx-auto">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg transform rotate-12 animate-pulse shadow-lg"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg transform -rotate-6 animate-pulse shadow-lg" style={{ animationDelay: '0.2s' }}></div>
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg transform rotate-3 animate-pulse shadow-lg" style={{ animationDelay: '0.4s' }}></div>
            {/* Page flipping effect */}
            <div className="absolute top-1 right-1 w-2 h-8 bg-white rounded-sm transform rotate-12 animate-pulse opacity-70" style={{ animationDelay: '0.1s' }}></div>
            <div className="absolute top-1 right-1 w-2 h-8 bg-white rounded-sm transform -rotate-6 animate-pulse opacity-70" style={{ animationDelay: '0.3s' }}></div>
          </div>
          {/* Enhanced floating elements */}
          <div className="absolute -top-3 -right-3 w-4 h-4 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full animate-bounce shadow-md"></div>
          <div className="absolute -bottom-3 -left-3 w-3 h-3 bg-gradient-to-r from-purple-400 to-purple-500 rounded-full animate-bounce shadow-md" style={{ animationDelay: '0.3s' }}></div>
          <div className="absolute top-1/2 -right-5 w-2 h-2 bg-gradient-to-r from-blue-300 to-blue-400 rounded-full animate-bounce shadow-sm" style={{ animationDelay: '0.6s' }}></div>
          <div className="absolute top-1/4 -left-4 w-2 h-2 bg-gradient-to-r from-purple-300 to-purple-400 rounded-full animate-bounce shadow-sm" style={{ animationDelay: '0.8s' }}></div>
          {/* Sparkle effects */}
          <div className="absolute top-0 left-1/2 w-1 h-1 bg-yellow-400 rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-2 right-2 w-1 h-1 bg-yellow-300 rounded-full animate-ping" style={{ animationDelay: '1.2s' }}></div>
        </div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-900 via-purple-800 to-blue-900 bg-clip-text text-transparent mb-3 animate-pulse">PolyPros</h2>
        <div className="flex items-center justify-center space-x-2 mb-3">
          <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full animate-bounce shadow-sm"></div>
          <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full animate-bounce shadow-sm" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full animate-bounce shadow-sm" style={{ animationDelay: '0.2s' }}></div>
        </div>
        <p className="text-blue-700 text-sm font-medium animate-pulse">Loading your study companion...</p>
      </div>
    </div>
  );
};