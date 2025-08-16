
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MessageCircle, BookOpen, Clock, Users, Send, Bot, Mail, Phone, Instagram, ArrowDown, Chrome, X, Menu } from "lucide-react";
import { Chatbot } from "@/components/Chatbot";
import { FeatureCard } from "@/components/FeatureCard";
import { Link } from "react-router-dom";

const Index = () => {
  const [showChatbot, setShowChatbot] = useState(false);
  const [isLoadingChatbot, setIsLoadingChatbot] = useState(false);
  const [showBrowserPopup, setShowBrowserPopup] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
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
              <span className="text-xl sm:text-2xl font-bold text-blue-900 hover:text-blue-700 transition-colors duration-300">PolyPros</span>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex space-x-8 animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <Link to="/" className="text-gray-700 hover:text-blue-600 transition-all duration-300 hover:scale-105 relative group">
                Home
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
              </Link>
              <Link to="/question-papers" className="text-gray-700 hover:text-blue-600 transition-all duration-300 hover:scale-105 relative group">
                Paper
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
              </Link>
              <Link to="/about" className="text-gray-700 hover:text-blue-600 transition-all duration-300 hover:scale-105 relative group">
                About
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
              </Link>
              <Link to="/admin" className="text-gray-700 hover:text-blue-600 transition-all duration-300 hover:scale-105 relative group">
                Admin
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
              </Link>
            </div>
            
            {/* Mobile Hamburger Menu Button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleMobileMenu}
                className="p-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300"
              >
                <Menu className="h-6 w-6" />
              </Button>
            </div>
          </div>
        </div>
        
        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-md border-t border-blue-100/50 animate-slide-down">
            <div className="px-4 py-2 space-y-1">
              <Link 
                to="/" 
                onClick={closeMobileMenu}
                className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-all duration-300 relative group"
              >
                Home
              </Link>
              <Link 
                to="/question-papers" 
                onClick={closeMobileMenu}
                className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-all duration-300 relative group"
              >
                Paper
              </Link>
              <Link 
                to="/about" 
                onClick={closeMobileMenu}
                className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-all duration-300 relative group"
              >
                About
              </Link>
              <Link 
                to="/admin" 
                onClick={closeMobileMenu}
                className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-all duration-300 relative group"
              >
                Admin
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-20 pb-12 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-blue-900 mb-4 animate-slide-up">
              PolyPros Study Assistant
            </h1>
            <p className="text-base sm:text-lg text-gray-600 mb-6 max-w-2xl mx-auto animate-fade-in-delayed opacity-0 px-4" style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}>
              Get instant help with SBTET AP polytechnic subjects
            </p>
            <div className="animate-fade-in-delayed opacity-0" style={{ animationDelay: '0.5s', animationFillMode: 'forwards' }}>
              <Button
                onClick={handleChatbotClick}
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 transform group relative overflow-hidden"
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="animate-slide-up-stagger" style={{ animationDelay: '0.1s' }}>
              <Link to="/question-papers" className="block">
                <FeatureCard
                  icon={<BookOpen className="h-8 w-8 text-blue-600" />}
                  title="All Subjects"
                  description="Previous question papers for all subjects"
                  delay={0}
                />
              </Link>
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
          <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 animate-fade-in">
            <h3 className="text-xl sm:text-2xl font-bold text-blue-900 mb-4">
              💝 Support PolyPros Development
            </h3>
            <p className="text-sm sm:text-base text-gray-600 mb-6">
              Help us keep PolyPros free and accessible for all SBTET AP students
            </p>
            <div className="bg-blue-50 rounded-lg p-3 sm:p-4 mb-6">
              <p className="text-blue-700 font-semibold text-sm sm:text-base">
                Donate via UPI: <span className="font-mono text-sm sm:text-lg break-all">918688673113@upi</span>
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
              <span className="text-xl sm:text-2xl font-bold">PolyPros</span>
            </div>
            <p className="text-sm sm:text-base text-blue-200 mb-6 px-4">
              Your trusted PolyPros study companion for polytechnic success
            </p>
            
            {/* Contact Information */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-8 px-4">
              <div className="flex items-center justify-center space-x-2 hover:scale-105 transition-transform duration-300 animate-fade-in" style={{ animationDelay: '0.1s' }}>
                <Mail className="h-5 w-5 text-blue-400 animate-pulse" />
                <span className="text-blue-200 text-sm sm:text-base break-all">ropebitlabs@gmail.com</span>
              </div>
              <div className="flex items-center justify-center space-x-2 hover:scale-105 transition-transform duration-300 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                <Phone className="h-5 w-5 text-blue-400 animate-pulse" />
                <span className="text-blue-200 text-sm sm:text-base">8712403113</span>
              </div>
              <div className="flex items-center justify-center space-x-2 hover:scale-105 transition-transform duration-300 animate-fade-in sm:col-span-2 md:col-span-1" style={{ animationDelay: '0.3s' }}>
                <Instagram className="h-5 w-5 text-blue-400 animate-pulse" />
                <span className="text-blue-200 text-sm sm:text-base">@aditya_poly_pros</span>
              </div>
            </div>
            
            <div className="border-t border-blue-800 pt-8 animate-fade-in" style={{ animationDelay: '0.5s' }}>
              <p className="text-blue-300 text-xs sm:text-sm px-4">
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
              <h2 className="text-xl sm:text-2xl font-bold text-blue-900 animate-pulse">
                🍳 PolyPros is cooking up answers...
              </h2>
              <p className="text-sm sm:text-base text-gray-600 animate-fade-in" style={{ animationDelay: '0.5s' }}>
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
        <DialogContent className="sm:max-w-sm mx-4">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Chrome className="h-5 w-5 text-blue-600" />
              Better Experience
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              For best AI chat performance, use Chrome or modern browsers.
            </p>
            <Button onClick={handleCloseBrowserPopup} className="w-full" size="sm">
              Got it!
            </Button>
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
