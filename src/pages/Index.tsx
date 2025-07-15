
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MessageCircle, BookOpen, Clock, Users, Send, Bot, Mail, Phone, Instagram, ArrowDown } from "lucide-react";
import { Chatbot } from "@/components/Chatbot";
import { FeatureCard } from "@/components/FeatureCard";
import { Link } from "react-router-dom";

const Index = () => {
  const [showChatbot, setShowChatbot] = useState(false);

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
                onClick={() => setShowChatbot(true)}
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
