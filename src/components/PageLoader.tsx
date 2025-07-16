import { Bot } from "lucide-react";

export const PageLoader = () => {
  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="text-center space-y-4 animate-fade-in">
        {/* Simple animated icon */}
        <div className="w-16 h-16 mx-auto bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center animate-pulse">
          <Bot className="w-8 h-8 text-primary-foreground" />
        </div>
        
        {/* Minimal text */}
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-foreground">PolyPros</h2>
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>

        {/* Simple dots */}
        <div className="flex items-center justify-center space-x-1">
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>
    </div>
  );
};