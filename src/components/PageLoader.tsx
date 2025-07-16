import { Bot, BookOpen, Sparkles } from "lucide-react";

export const PageLoader = () => {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="text-center space-y-8 animate-fade-in">
        {/* Modern Animated Logo */}
        <div className="relative">
          <div className="w-32 h-32 mx-auto relative">
            {/* Outer ring */}
            <div className="absolute inset-0 border-4 border-primary/20 rounded-full animate-spin"></div>
            <div className="absolute inset-2 border-4 border-secondary/30 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '3s' }}></div>
            
            {/* Center icon container */}
            <div className="absolute inset-6 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center shadow-2xl">
              <Bot className="w-12 h-12 text-primary-foreground animate-pulse" />
            </div>
            
            {/* Floating elements */}
            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
              <BookOpen className="w-6 h-6 text-primary animate-bounce" />
            </div>
            <div className="absolute -right-2 top-1/2 transform -translate-y-1/2">
              <Sparkles className="w-5 h-5 text-secondary animate-bounce" style={{ animationDelay: '0.2s' }} />
            </div>
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
              <div className="w-4 h-4 bg-accent rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
            </div>
            <div className="absolute -left-2 top-1/2 transform -translate-y-1/2">
              <div className="w-3 h-3 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.6s' }}></div>
            </div>
          </div>
        </div>

        {/* Brand and Loading Text */}
        <div className="space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent animate-pulse">
            PolyPros
          </h1>
          <p className="text-muted-foreground text-lg font-medium">
            Preparing your AI study companion...
          </p>
        </div>

        {/* Progress indicator */}
        <div className="flex items-center justify-center space-x-2">
          <div className="w-3 h-3 bg-primary rounded-full animate-bounce"></div>
          <div className="w-3 h-3 bg-secondary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-3 h-3 bg-accent rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
        </div>

        {/* Loading bar */}
        <div className="w-64 mx-auto">
          <div className="h-1 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-primary to-secondary rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
};