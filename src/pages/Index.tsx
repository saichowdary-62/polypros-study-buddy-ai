
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MessageCircle, BookOpen, Clock, Users, Send, Bot, Mail, Phone, Instagram, ArrowDown, Chrome, X } from "lucide-react";
import { Chatbot } from "@/components/Chatbot";
import { FeatureCard } from "@/components/FeatureCard";
import { Link } from "react-router-dom";

const Index = () => {
  const [showChatbot, setShowChatbot] = useState(false);
  const [isLoadingChatbot, setIsLoadingChatbot] = useState(false);
  const [showBrowserPopup, setShowBrowserPopup] = useState(false);

  useEffect(() => {
    // Show browser recommendation popup if not shown before
    const hasSeenPopup = localStorage.getItem("browser_popup_seen");
    if (!hasSeenPopup) {
      setShowBrowserPopup(true);
    }
  }, []);

  const handleCloseBrowserPopup = () => {
    setShowBrowserPopup(false);
    localStorage.setItem("browser_popup_seen", "true");
  };

  const handleChatbotClick = () => {
    setIsLoadingChatbot(true);
    // Show loading for 2 seconds then show chatbot
    setTimeout(() => {
      setIsLoadingChatbot(false);
      setShowChatbot(true);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-20 h-20 bg-blue-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-purple-200 rounded-full opacity-30 animate-bounce" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-40 left-20 w-24 h-24 bg-blue-300 rounded-full opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-60 left-1/3 w-12 h-12 bg-purple-300 rounded-full opacity-25 animate-bounce" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute bottom-60 right-1/4 w-18 h-18 bg-blue-400 rounded-full opacity-20 animate-pulse" style={{ animationDelay: '1.5s' }}></div>
      </div>

      {/* Navigation */}
      <nav className="bg-white/90 backdrop-blur-md shadow-lg fixed w-full top-0 z-50 border-b border-blue-100/50 animate-slide-down">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2 animate-fade-in">
              <Bot className="h-8 w-8 text-blue-600 animate-bounce" />
              <span className="text-2xl font-bold text-blue-900 hover:text-blue-700 transition-colors duration-300">PolyPros</span>
            </div>
            <div className="flex space-x-8 animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <Link to="/" className="text-gray-700 hover:text-blue-600 transition-all duration-300 hover:scale-105 relative group">
                Home
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
              </Link>
              <Link to="/about" className="text-gray-700 hover:text-blue-600 transition-all duration-300 hover:scale-105 relative group">
                About
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
              </Link>
              <Link to="/monitor" className="text-gray-700 hover:text-blue-600 transition-all duration-300 hover:scale-105 relative group">
                Monitor
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-20 pb-12 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-blue-900 mb-4 animate-slide-up">
              PolyPros Study Assistant
            </h1>
            <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto animate-fade-in-delayed opacity-0" style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}>
              Get instant help with SBTET AP polytechnic subjects
            </p>
            <div className="animate-fade-in-delayed opacity-0" style={{ animationDelay: '0.5s', animationFillMode: 'forwards' }}>
              <Button
                onClick={handleChatbotClick}
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 text-base font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 transform group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12"></div>
                <MessageCircle className="mr-2 h-4 w-4" />
                Start Chatting
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white/80 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="animate-slide-up-stagger" style={{ animationDelay: '0.1s' }}>
              <FeatureCard
                icon={<BookOpen className="h-8 w-8 text-blue-600" />}
                title="All Subjects"
                description="Engineering, Computer Science, Mathematics & more"
                delay={0}
              />
            </div>
            <div className="animate-slide-up-stagger" style={{ animationDelay: '0.2s' }}>
              <FeatureCard
                icon={<MessageCircle className="h-8 w-8 text-blue-600" />}
                title="Instant Help"
                description="Get answers and explanations instantly"
                delay={100}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Support Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-blue-50">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-white rounded-2xl shadow-lg p-8 animate-fade-in">
            <h3 className="text-2xl font-bold text-blue-900 mb-4">
              💝 Support PolyPros Development
            </h3>
            <p className="text-gray-600 mb-6">
              Help us keep PolyPros free and accessible for all SBTET AP students
            </p>
            <div className="bg-blue-50 rounded-lg p-4 mb-6">
              <p className="text-blue-700 font-semibold">
                Donate via UPI: <span className="font-mono text-lg">918688673113@upi</span>
              </p>
            </div>
            <p className="text-sm text-gray-500">
              Your support helps us maintain and improve the platform
            </p>
          </div>
        </div>
      </section>


      {/* Footer */}
      <footer className="bg-blue-900 text-white py-12 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center animate-fade-in">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Bot className="h-8 w-8 text-blue-400 animate-pulse" />
              <span className="text-2xl font-bold">PolyPros</span>
            </div>
            <p className="text-blue-200 mb-6">
              Your trusted PolyPros study companion for polytechnic success
            </p>
            
            {/* Contact Information */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="flex items-center justify-center space-x-2 hover:scale-105 transition-transform duration-300 animate-fade-in" style={{ animationDelay: '0.1s' }}>
                <Mail className="h-5 w-5 text-blue-400 animate-pulse" />
                <span className="text-blue-200">ropebitlabs@gmail.com</span>
              </div>
              <div className="flex items-center justify-center space-x-2 hover:scale-105 transition-transform duration-300 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                <Phone className="h-5 w-5 text-blue-400 animate-pulse" />
                <span className="text-blue-200">8712403113</span>
              </div>
              <div className="flex items-center justify-center space-x-2 hover:scale-105 transition-transform duration-300 animate-fade-in" style={{ animationDelay: '0.3s' }}>
                <Instagram className="h-5 w-5 text-blue-400 animate-pulse" />
                <span className="text-blue-200">@aditya_poly_pros</span>
              </div>
            </div>
            
            <div className="border-t border-blue-800 pt-8 animate-fade-in" style={{ animationDelay: '0.5s' }}>
              <p className="text-blue-300">
                © 2025 PolyPros | Created by Aditya Polytechnic College students with Ropebit Labs
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* Chatbot Loading */}
      {isLoadingChatbot && (
        <div className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center animate-fade-in">
          <div className="text-center">
            {/* Cooking Animation */}
            <div className="relative mb-8">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center animate-pulse">
                <Bot className="h-10 w-10 text-white" />
              </div>
              {/* Steam/Cooking Effects */}
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-400 rounded-full opacity-70 animate-bounce"></div>
              <div className="absolute -top-4 right-2 w-4 h-4 bg-purple-400 rounded-full opacity-50 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              <div className="absolute -top-6 right-6 w-3 h-3 bg-blue-300 rounded-full opacity-40 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
            </div>
            
            {/* Loading Text */}
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-blue-900 animate-pulse">
                🍳 PolyPros is cooking up answers...
              </h2>
              <p className="text-gray-600 animate-fade-in" style={{ animationDelay: '0.5s' }}>
                Preparing your study assistant
              </p>
            </div>
            
            {/* Loading Dots */}
            <div className="flex space-x-2 mt-6 justify-center">
              <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce"></div>
              <div className="w-3 h-3 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          </div>
        </div>
      )}

      {/* Browser Recommendation Popup */}
      <Dialog open={showBrowserPopup} onOpenChange={setShowBrowserPopup}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Chrome className="h-6 w-6 text-blue-600" />
              Best Experience Tip
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="text-center space-y-3">
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <Bot className="h-8 w-8 text-white" />
              </div>
              <p className="text-gray-600">
                For the best chatting experience with PolyPros AI, we recommend using:
              </p>
            </div>
            
            <div className="grid gap-3">
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <Chrome className="h-5 w-5 text-blue-600" />
                <span className="font-medium text-blue-900">Google Chrome</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <div className="w-5 h-5 bg-gradient-to-r from-blue-400 to-purple-500 rounded-sm"></div>
                <span className="font-medium text-gray-700">Microsoft Edge</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <div className="w-5 h-5 bg-orange-500 rounded-sm"></div>
                <span className="font-medium text-gray-700">Firefox</span>
              </div>
            </div>
            
            <div className="text-center">
              <p className="text-sm text-gray-500 mb-4">
                Modern browsers provide better AI chat performance and features.
              </p>
              <Button onClick={handleCloseBrowserPopup} className="w-full">
                Got it, thanks!
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Chatbot Modal */}
      {showChatbot && (
        <div className="animate-scale-in">
          <Chatbot onClose={() => setShowChatbot(false)} />
        </div>
      )}
    </div>
  );
};

export default Index;
