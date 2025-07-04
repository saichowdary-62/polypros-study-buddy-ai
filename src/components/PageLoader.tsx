export const PageLoader = () => {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center z-50">
      <div className="text-center">
        <div className="relative mb-8">
          {/* Animated books stack */}
          <div className="relative w-20 h-20 mx-auto">
            <div className="absolute inset-0 bg-blue-600 rounded-lg transform rotate-12 animate-pulse"></div>
            <div className="absolute inset-0 bg-purple-600 rounded-lg transform -rotate-6 animate-pulse" style={{ animationDelay: '0.2s' }}></div>
            <div className="absolute inset-0 bg-blue-500 rounded-lg transform rotate-3 animate-pulse" style={{ animationDelay: '0.4s' }}></div>
          </div>
          {/* Floating dots */}
          <div className="absolute -top-2 -right-2 w-3 h-3 bg-blue-400 rounded-full animate-bounce"></div>
          <div className="absolute -bottom-2 -left-2 w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
          <div className="absolute top-1/2 -right-4 w-2 h-2 bg-blue-300 rounded-full animate-bounce" style={{ animationDelay: '0.6s' }}></div>
        </div>
        <h2 className="text-2xl font-bold text-blue-900 mb-2">PolyPros</h2>
        <div className="flex items-center justify-center space-x-1 mb-2">
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
        <p className="text-blue-600 text-sm">Loading your study companion...</p>
      </div>
    </div>
  );
};