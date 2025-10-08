
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MessageCircle, BookOpen, Clock, Users, Send, Bot, Mail, Phone, Instagram, ArrowDown, Chrome, X, Menu, GraduationCap, Zap, Shield, Star, TrendingUp, Award } from "lucide-react";
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
    // Show simple loading then chatbot
    setTimeout(() => {
      setIsLoadingChatbot(false);
      setShowChatbot(true);
    }, 800);
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
              <img src="/polylogo-removebg-preview.png" alt="PolyPros Logo" className="h-12 w-12 object-contain" />
              <span className="text-xl sm:text-2xl font-bold text-blue-900 hover:text-blue-700 transition-colors duration-300">POLYPROS</span>
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
      <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 relative min-h-[70vh] flex items-center">
        <div className="max-w-7xl mx-auto w-full">
          <div className="text-center">
            <div className="inline-block animate-float mb-6">
              <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-full px-6 py-2 border border-blue-200">
                <span className="text-blue-700 font-semibold text-sm flex items-center gap-2">
                  <Star className="h-4 w-4 fill-blue-600 text-blue-600" />
                  Trusted by 1000+ Students
                </span>
              </div>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-blue-900 mb-6 animate-slide-up">
              POLYPROS Study Assistant
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-2xl mx-auto animate-fade-in-delayed opacity-0 px-4" style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}>
              Your AI-powered companion for SBTET AP polytechnic success. Get instant answers, study materials, and exam preparation help 24/7
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-delayed opacity-0" style={{ animationDelay: '0.5s', animationFillMode: 'forwards' }}>
              <Button
                onClick={handleChatbotClick}
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-6 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 transform group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12"></div>
                <MessageCircle className="mr-2 h-5 w-5" />
                Start Chatting
              </Button>
              <Link to="/question-papers">
                <Button
                  variant="outline"
                  size="lg"
                  className="px-8 py-6 text-lg font-semibold rounded-full border-2 border-blue-600 text-blue-600 hover:bg-blue-50 transition-all duration-300 hover:scale-105 transform"
                >
                  <BookOpen className="mr-2 h-5 w-5" />
                  Browse Papers
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white/80 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-blue-900 mb-4 animate-fade-in">Why Choose POLYPROS?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto animate-fade-in-delayed opacity-0" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
              Everything you need to excel in your polytechnic studies
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="animate-slide-up-stagger" style={{ animationDelay: '0.1s' }}>
              <Link to="/question-papers" className="block">
                <Card className="hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:border-blue-300 border-2 group">
                  <CardContent className="p-6">
                    <div className="bg-blue-100 w-14 h-14 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                      <BookOpen className="h-7 w-7 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Question Papers</h3>
                    <p className="text-gray-600">Access previous year papers for all SBTET subjects</p>
                  </CardContent>
                </Card>
              </Link>
            </div>
            <div className="animate-slide-up-stagger" style={{ animationDelay: '0.2s' }}>
              <Card className="hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:border-blue-300 border-2 group cursor-pointer" onClick={handleChatbotClick}>
                <CardContent className="p-6">
                  <div className="bg-purple-100 w-14 h-14 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <MessageCircle className="h-7 w-7 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">AI Chat Assistant</h3>
                  <p className="text-gray-600">Get instant answers to your study questions 24/7</p>
                </CardContent>
              </Card>
            </div>
            <div className="animate-slide-up-stagger" style={{ animationDelay: '0.3s' }}>
              <Card className="hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:border-blue-300 border-2 group">
                <CardContent className="p-6">
                  <div className="bg-green-100 w-14 h-14 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Zap className="h-7 w-7 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Quick Solutions</h3>
                  <p className="text-gray-600">Fast and accurate explanations for complex topics</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-purple-600 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center animate-fade-in">
              <div className="text-4xl sm:text-5xl font-bold text-white mb-2">1000+</div>
              <div className="text-blue-100 text-sm sm:text-base">Active Students</div>
            </div>
            <div className="text-center animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <div className="text-4xl sm:text-5xl font-bold text-white mb-2">50+</div>
              <div className="text-blue-100 text-sm sm:text-base">Subjects Covered</div>
            </div>
            <div className="text-center animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="text-4xl sm:text-5xl font-bold text-white mb-2">24/7</div>
              <div className="text-blue-100 text-sm sm:text-base">Available Support</div>
            </div>
            <div className="text-center animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <div className="text-4xl sm:text-5xl font-bold text-white mb-2">100%</div>
              <div className="text-blue-100 text-sm sm:text-base">Free Access</div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-blue-900 mb-4 animate-fade-in">How It Works</h2>
            <p className="text-gray-600 max-w-2xl mx-auto animate-fade-in-delayed opacity-0" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
              Get started in three simple steps
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center animate-slide-up-stagger" style={{ animationDelay: '0.1s' }}>
              <div className="bg-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4 hover:scale-110 transition-transform duration-300">
                1
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Ask Your Question</h3>
              <p className="text-gray-600">Type any study question or topic you need help with</p>
            </div>
            <div className="text-center animate-slide-up-stagger" style={{ animationDelay: '0.2s' }}>
              <div className="bg-purple-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4 hover:scale-110 transition-transform duration-300">
                2
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">AI Processes</h3>
              <p className="text-gray-600">Our AI analyzes and prepares detailed explanations</p>
            </div>
            <div className="text-center animate-slide-up-stagger" style={{ animationDelay: '0.3s' }}>
              <div className="bg-green-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4 hover:scale-110 transition-transform duration-300">
                3
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Get Instant Help</h3>
              <p className="text-gray-600">Receive clear answers and study guidance instantly</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900 text-white py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500 rounded-full opacity-10 blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500 rounded-full opacity-10 blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
            {/* Brand Section */}
            <div className="text-center md:text-left animate-fade-in">
              <div className="flex items-center justify-center md:justify-start space-x-3 mb-4">
                <img src="/polylogo-removebg-preview.png" alt="PolyPros Logo" className="h-12 w-12 object-contain" />
                <span className="text-2xl sm:text-3xl font-bold">POLYPROS</span>
              </div>
              <p className="text-blue-200 mb-4 leading-relaxed">
                Your trusted AI-powered study companion for SBTET AP polytechnic success. Learn smarter, not harder.
              </p>
              <div className="flex items-center justify-center md:justify-start space-x-2">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-500 rounded-full border-2 border-white"></div>
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-purple-500 rounded-full border-2 border-white"></div>
                  <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-500 rounded-full border-2 border-white"></div>
                </div>
                <span className="text-sm text-blue-200">1000+ Happy Students</span>
              </div>
            </div>

            {/* Quick Links */}
            <div className="text-center animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <h3 className="text-lg font-bold mb-4 text-white">Quick Links</h3>
              <div className="space-y-3">
                <Link to="/" className="block text-blue-200 hover:text-white transition-colors duration-300 hover:translate-x-1 transform">
                  Home
                </Link>
                <Link to="/question-papers" className="block text-blue-200 hover:text-white transition-colors duration-300 hover:translate-x-1 transform">
                  Question Papers
                </Link>
                <Link to="/about" className="block text-blue-200 hover:text-white transition-colors duration-300 hover:translate-x-1 transform">
                  About Us
                </Link>
                <Link to="/admin" className="block text-blue-200 hover:text-white transition-colors duration-300 hover:translate-x-1 transform">
                  Admin Panel
                </Link>
              </div>
            </div>

            {/* Contact Information */}
            <div className="text-center md:text-left animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <h3 className="text-lg font-bold mb-4 text-white">Get in Touch</h3>
              <div className="space-y-4">
                <a href="mailto:ropebitlabs@gmail.com" className="flex items-center justify-center md:justify-start space-x-3 text-blue-200 hover:text-white transition-all duration-300 hover:translate-x-1 transform group">
                  <div className="bg-blue-700/50 p-2 rounded-lg group-hover:bg-blue-600 transition-colors duration-300">
                    <Mail className="h-5 w-5" />
                  </div>
                  <span className="text-sm break-all">ropebitlabs@gmail.com</span>
                </a>
                <a href="tel:8712403113" className="flex items-center justify-center md:justify-start space-x-3 text-blue-200 hover:text-white transition-all duration-300 hover:translate-x-1 transform group">
                  <div className="bg-blue-700/50 p-2 rounded-lg group-hover:bg-blue-600 transition-colors duration-300">
                    <Phone className="h-5 w-5" />
                  </div>
                  <span className="text-sm">8712403113</span>
                </a>
                <a href="https://instagram.com/aditya_poly_pros" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center md:justify-start space-x-3 text-blue-200 hover:text-white transition-all duration-300 hover:translate-x-1 transform group">
                  <div className="bg-gradient-to-br from-purple-600 to-pink-600 p-2 rounded-lg group-hover:scale-110 transition-transform duration-300">
                    <Instagram className="h-5 w-5" />
                  </div>
                  <span className="text-sm">@aditya_poly_pros</span>
                </a>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-blue-700/50 pt-8 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <p className="text-blue-300 text-sm text-center md:text-left">
                © 2025 POLYPROS. All rights reserved.
              </p>
              <div className="flex items-center space-x-2 text-sm text-blue-300">
                <span>Built with</span>
                <span className="text-red-400 animate-pulse">❤</span>
                <span>by Aditya Polytechnic College students with Ropebit Labs</span>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Simple Page Loader */}
      {isLoadingChatbot && (
        <div className="fixed inset-0 bg-white z-50 flex items-center justify-center animate-fade-in">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center animate-pulse mx-auto">
              <Bot className="h-8 w-8 text-white" />
            </div>
            <div className="flex space-x-2 justify-center">
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
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
