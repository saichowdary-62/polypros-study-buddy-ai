import { Bot } from "lucide-react";

export const PageLoader = () => {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center z-50">
      <div className="text-center">
        <div className="relative mb-8">
          <div className="w-20 h-20 border-4 border-blue-200 rounded-full animate-spin border-t-blue-600"></div>
          <Bot className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-8 w-8 text-blue-600 animate-pulse" />
        </div>
        <h2 className="text-2xl font-bold text-blue-900 mb-2 animate-pulse">PolyPros</h2>
        <p className="text-blue-600 animate-fade-in">Loading your study companion...</p>
      </div>
    </div>
  );
};