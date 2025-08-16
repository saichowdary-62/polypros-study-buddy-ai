import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MessageCircle, BookOpen, Clock, Users, Send, Bot, Mail, Phone, Instagram, ArrowDown, Chrome, X, Menu, Sparkles, Zap, Star } from "lucide-react";
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 relative overflow-hidden">
      {/* Enhanced Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating orbs with glow effects */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full opacity-20 animate-float blur-xl"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-r from-pink-400 to-rose-500 rounded-full opacity-30 animate-bounce blur-lg" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-40 left-20 w-40 h-40 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full opacity-25 animate-pulse blur-2xl" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-60 left-1/3 w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full opacity-30 animate-bounce blur-lg" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute bottom-60 right-1/4 w-28 h-28 bg-gradient-to-r from-violet-400 to-purple-500 rounded-full opacity-25 animate-float blur-xl" style={{ animationDelay: '1.5s' }}></div>
        
        {/* Animated particles */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white rounded-full animate-ping opacity-40"></div>
        <div className="absolute top-3/4 right-1/3 w-1 h-1 bg-cyan-300 rounded-full animate-pulse opacity-60" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-3/4 w-3 h-3 bg-pink-300 rounded-full animate-ping opacity-30" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Navigation */}
      <nav className="bg-white/10 backdrop-blur-xl shadow-2xl fixed w-full top-0 z-50 border-b border-white/20 animate-slide-down">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3 animate-fade-in group">
              <div className="relative">
                <Bot className="h-8 w-8 text-cyan-400 animate-bounce group-hover:text-pink-400 transition-colors duration-500" />
                <div className="absolute inset-0 bg-cyan-400 rounded-full blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>
              </div>
              <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-cyan-400 via-pink-400 to-violet-400 bg-clip-text text-transparent hover:from-pink-400 hover:via-violet-400 hover:to-cyan-400 transition-all duration-700 animate-shimmer bg-300%">
                PolyPros
              </span>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex space-x-8 animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <Link to="/" className="text-white/90 hover:text-cyan-400 transition-all duration-300 hover:scale-110 relative group font-medium">
                Home
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-pink-400 group-hover:w-full transition-all duration-500"></span>
                <div className="absolute inset-0 bg-cyan-400/20 rounded-lg blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
              </Link>
              <Link to="/question-papers" className="text-white/90 hover:text-pink-400 transition-all duration-300 hover:scale-110 relative group font-medium">
                Paper
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-pink-400 to-violet-400 group-hover:w-full transition-all duration-500"></span>
                <div className="absolute inset-0 bg-pink-400/20 rounded-lg blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
              </Link>
              <Link to="/about" className="text-white/90 hover:text-violet-400 transition-all duration-300 hover:scale-110 relative group font-medium">
                About
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-violet-400 to-emerald-400 group-hover:w-full transition-all duration-500"></span>
                <div className="absolute inset-0 bg-violet-400/20 rounded-lg blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
              </Link>
              <Link to="/admin" className="text-white/90 hover:text-emerald-400 transition-all duration-300 hover:scale-110 relative group font-medium">
                Admin
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-emerald-400 to-cyan-400 group-hover:w-full transition-all duration-500"></span>
                <div className="absolute inset-0 bg-emerald-400/20 rounded-lg blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
              </Link>
            </div>
            
            {/* Mobile Hamburger Menu Button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleMobileMenu}
                className="p-2 text-white/90 hover:text-cyan-400 hover:bg-white/10 transition-all duration-300 hover:scale-110 relative group"
              >
                <Menu className="h-6 w-6 transition-transform duration-300 group-hover:rotate-180" />
                <div className="absolute inset-0 bg-cyan-400/20 rounded-lg blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Button>
            </div>
          </div>
        </div>
        
        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white/10 backdrop-blur-xl border-t border-white/20 animate-slide-down">
            <div className="px-4 py-2 space-y-1">
              <Link 
                to="/" 
                onClick={closeMobileMenu}
                className="block px-4 py-3 text-white/90 hover:text-cyan-400 hover:bg-white/10 rounded-lg transition-all duration-300 relative group font-medium"
              >
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <span>Home</span>
                </div>
              </Link>
              <Link 
                to="/question-papers" 
                onClick={closeMobileMenu}
                className="block px-4 py-3 text-white/90 hover:text-pink-400 hover:bg-white/10 rounded-lg transition-all duration-300 relative group font-medium"
              >
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-pink-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <span>Paper</span>
                </div>
              </Link>
              <Link 
                to="/about" 
                onClick={closeMobileMenu}
                className="block px-4 py-3 text-white/90 hover:text-violet-400 hover:bg-white/10 rounded-lg transition-all duration-300 relative group font-medium"
              >
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-violet-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <span>About</span>
                </div>
              </Link>
              <Link 
                to="/admin" 
                onClick={closeMobileMenu}
                className="block px-4 py-3 text-white/90 hover:text-emerald-400 hover:bg-white/10 rounded-lg transition-all duration-300 relative group font-medium"
              >
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <span>Admin</span>
                </div>
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="flex justify-center mb-6 animate-scale-in">
              <div className="relative">
                <Sparkles className="h-16 w-16 text-cyan-400 animate-spin" style={{ animationDuration: '3s' }} />
                <div className="absolute inset-0 bg-cyan-400 rounded-full blur-xl opacity-50 animate-pulse"></div>
              </div>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-6 animate-slide-up">
              <span className="bg-gradient-to-r from-cyan-400 via-pink-400 to-violet-400 bg-clip-text text-transparent animate-shimmer bg-300%">
                PolyPros
              </span>
              <br />
              <span className="text-white/90 text-2xl sm:text-3xl md:text-4xl font-medium animate-fade-in-delayed">
                Study Assistant
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-white/80 mb-8 max-w-3xl mx-auto animate-fade-in-delayed opacity-0 px-4 leading-relaxed" style={{ animationDelay: '0.5s', animationFillMode: 'forwards' }}>
              Get instant help with SBTET AP polytechnic subjects using our AI-powered study companion
            </p>
            <div className="animate-fade-in-delayed opacity-0 flex flex-col sm:flex-row gap-4 justify-center items-center" style={{ animationDelay: '0.7s', animationFillMode: 'forwards' }}>
              <Button
                onClick={handleChatbotClick}
                size="lg"
                className="bg-gradient-to-r from-cyan-500 via-pink-500 to-violet-500 hover:from-cyan-600 hover:via-pink-600 hover:to-violet-600 text-white px-8 py-4 text-lg font-bold rounded-full shadow-2xl hover:shadow-cyan-500/25 transition-all duration-500 hover:scale-110 transform group relative overflow-hidden border-0"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 skew-x-12"></div>
                <MessageCircle className="mr-3 h-6 w-6 animate-bounce" />
                Start Chatting
                <Zap className="ml-3 h-5 w-5 animate-pulse" />
              </Button>
              <div className="flex items-center space-x-2 text-white/60 animate-pulse">
                <Star className="h-4 w-4 text-yellow-400" />
                <span className="text-sm">AI-Powered Learning</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white/5 backdrop-blur-sm border-y border-white/10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-cyan-400 to-pink-400 bg-clip-text text-transparent mb-4 animate-fade-in">
              Powerful Features
            </h2>
            <p className="text-white/70 text-lg animate-fade-in-delayed">
              Everything you need for polytechnic success
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="animate-slide-up-stagger" style={{ animationDelay: '0.1s' }}>
              <Link to="/question-papers" className="block group">
                <Card className="bg-white/10 backdrop-blur-xl border-white/20 hover:bg-white/20 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/20 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <CardContent className="p-8 relative z-10">
                    <div className="flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                      <div className="relative">
                        <BookOpen className="h-12 w-12 text-cyan-400 group-hover:text-pink-400 transition-colors duration-500" />
                        <div className="absolute inset-0 bg-cyan-400 rounded-full blur-lg opacity-30 group-hover:opacity-60 transition-opacity duration-500"></div>
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-cyan-400 transition-colors duration-500">
                      All Subjects
                    </h3>
                    <p className="text-white/80 group-hover:text-white transition-colors duration-500">
                      Previous question papers for all subjects with detailed solutions
                    </p>
                  </CardContent>
                </Card>
              </Link>
            </div>
            <div className="animate-slide-up-stagger" style={{ animationDelay: '0.2s' }}>
              <Card className="bg-white/10 backdrop-blur-xl border-white/20 hover:bg-white/20 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-pink-500/20 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 to-violet-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <CardContent className="p-8 relative z-10">
                  <div className="flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                    <div className="relative">
                      <MessageCircle className="h-12 w-12 text-pink-400 group-hover:text-violet-400 transition-colors duration-500" />
                      <div className="absolute inset-0 bg-pink-400 rounded-full blur-lg opacity-30 group-hover:opacity-60 transition-opacity duration-500"></div>
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-pink-400 transition-colors duration-500">
                    Instant Help
                  </h3>
                  <p className="text-white/80 group-hover:text-white transition-colors duration-500">
                    Get answers and explanations instantly with our AI assistant
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Support Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-cyan-900/20 to-pink-900/20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-8 sm:p-12 animate-fade-in border border-white/20 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-pink-500/5"></div>
            <div className="relative z-10">
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="text-6xl animate-bounce">💝</div>
                  <div className="absolute inset-0 bg-pink-400 rounded-full blur-2xl opacity-30 animate-pulse"></div>
                </div>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-cyan-400 to-pink-400 bg-clip-text text-transparent mb-6">
                Support PolyPros Development
              </h3>
              <p className="text-white/80 mb-8 text-lg leading-relaxed">
                Help us keep PolyPros free and accessible for all SBTET AP students
              </p>
              <div className="bg-gradient-to-r from-cyan-500/20 to-pink-500/20 rounded-2xl p-6 mb-8 border border-white/20">
                <p className="text-white font-bold text-lg mb-2">
                  Donate via UPI
                </p>
                <p className="font-mono text-xl bg-gradient-to-r from-cyan-400 to-pink-400 bg-clip-text text-transparent break-all">
                  918688673113@upi
                </p>
              </div>
              <p className="text-white/60 text-sm">
                Your support helps us maintain and improve the platform ✨
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/20 backdrop-blur-xl text-white py-16 px-4 sm:px-6 lg:px-8 relative border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center animate-fade-in">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="relative">
                <Bot className="h-10 w-10 text-cyan-400 animate-pulse" />
                <div className="absolute inset-0 bg-cyan-400 rounded-full blur-lg opacity-40"></div>
              </div>
              <span className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-cyan-400 to-pink-400 bg-clip-text text-transparent">
                PolyPros
              </span>
            </div>
            <p className="text-white/80 mb-8 px-4 text-lg">
              Your trusted AI study companion for polytechnic success
            </p>
            
            {/* Contact Information */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-12 px-4">
              <div className="flex items-center justify-center space-x-3 hover:scale-105 transition-transform duration-300 animate-fade-in group" style={{ animationDelay: '0.1s' }}>
                <div className="relative">
                  <Mail className="h-6 w-6 text-cyan-400 animate-pulse group-hover:text-pink-400 transition-colors duration-300" />
                  <div className="absolute inset-0 bg-cyan-400 rounded-full blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
                </div>
                <span className="text-white/90 break-all group-hover:text-cyan-400 transition-colors duration-300">
                  ropebitlabs@gmail.com
                </span>
              </div>
              <div className="flex items-center justify-center space-x-3 hover:scale-105 transition-transform duration-300 animate-fade-in group" style={{ animationDelay: '0.2s' }}>
                <div className="relative">
                  <Phone className="h-6 w-6 text-pink-400 animate-pulse group-hover:text-violet-400 transition-colors duration-300" />
                  <div className="absolute inset-0 bg-pink-400 rounded-full blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
                </div>
                <span className="text-white/90 group-hover:text-pink-400 transition-colors duration-300">
                  8712403113
                </span>
              </div>
              <div className="flex items-center justify-center space-x-3 hover:scale-105 transition-transform duration-300 animate-fade-in sm:col-span-2 md:col-span-1 group" style={{ animationDelay: '0.3s' }}>
                <div className="relative">
                  <Instagram className="h-6 w-6 text-violet-400 animate-pulse group-hover:text-emerald-400 transition-colors duration-300" />
                  <div className="absolute inset-0 bg-violet-400 rounded-full blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
                </div>
                <span className="text-white/90 group-hover:text-violet-400 transition-colors duration-300">
                  @aditya_poly_pros
                </span>
              </div>
            </div>
            
            <div className="border-t border-white/20 pt-8 animate-fade-in" style={{ animationDelay: '0.5s' }}>
              <p className="text-white/60 px-4">
                © 2025 PolyPros | Created by Aditya Polytechnic College students with Ropebit Labs
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* Chatbot Loading */}
      {isLoadingChatbot && (
        <div className="fixed inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 z-50 flex flex-col items-center justify-center animate-fade-in">
          <div className="text-center">
            {/* Enhanced Cooking Animation */}
            <div className="relative mb-8">
              <div className="w-24 h-24 bg-gradient-to-r from-cyan-500 via-pink-500 to-violet-500 rounded-full flex items-center justify-center animate-spin relative" style={{ animationDuration: '2s' }}>
                <Bot className="h-12 w-12 text-white" />
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-pink-500 rounded-full blur-xl opacity-50"></div>
              </div>
              {/* Enhanced Steam/Cooking Effects */}
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-cyan-400 rounded-full opacity-70 animate-bounce blur-sm"></div>
              <div className="absolute -top-6 right-2 w-6 h-6 bg-pink-400 rounded-full opacity-50 animate-bounce blur-sm" style={{ animationDelay: '0.2s' }}></div>
              <div className="absolute -top-8 right-8 w-4 h-4 bg-violet-400 rounded-full opacity-40 animate-bounce blur-sm" style={{ animationDelay: '0.4s' }}></div>
              <div className="absolute -top-2 -left-4 w-6 h-6 bg-emerald-400 rounded-full opacity-60 animate-bounce blur-sm" style={{ animationDelay: '0.6s' }}></div>
            </div>
            
            {/* Enhanced Loading Text */}
            <div className="space-y-4">
              <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-cyan-400 to-pink-400 bg-clip-text text-transparent animate-pulse">
                🍳 PolyPros is cooking up answers...
              </h2>
              <p className="text-white/80 animate-fade-in text-lg" style={{ animationDelay: '0.5s' }}>
                Preparing your AI study assistant
              </p>
            </div>
            
            {/* Enhanced Loading Dots */}
            <div className="flex space-x-3 mt-8 justify-center">
              <div className="w-4 h-4 bg-cyan-500 rounded-full animate-bounce"></div>
              <div className="w-4 h-4 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-4 h-4 bg-violet-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-4 h-4 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
            </div>
          </div>
        </div>
      )}

      {/* Browser Recommendation Popup */}
      <Dialog open={showBrowserPopup} onOpenChange={setShowBrowserPopup}>
        <DialogContent className="sm:max-w-sm mx-4 bg-white/10 backdrop-blur-xl border-white/20 text-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-cyan-400">
              <Chrome className="h-5 w-5" />
              Better Experience
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <p className="text-white/80">
              For best AI chat performance, use Chrome or modern browsers.
            </p>
            <Button 
              onClick={handleCloseBrowserPopup} 
              className="w-full bg-gradient-to-r from-cyan-500 to-pink-500 hover:from-cyan-600 hover:to-pink-600 border-0" 
              size="sm"
            >
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