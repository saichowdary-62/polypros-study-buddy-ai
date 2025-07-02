
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
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="mb-8 animate-fade-in">
              <div className="relative inline-block">
                <Bot className="h-24 w-24 text-blue-600 mx-auto mb-6 animate-float" />
                <div className="absolute inset-0 bg-blue-600/10 rounded-full animate-ping"></div>
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-blue-900 mb-6 animate-slide-up">
              Master Polytechnic Subjects with{" "}
              <span className="text-blue-600 relative inline-block animate-gradient bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent bg-300% animate-shimmer">
                PolyPros!
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto animate-fade-in-delayed opacity-0" style={{ animationDelay: '0.5s', animationFillMode: 'forwards' }}>
              Your intelligent PolyPros study assistant for all polytechnic subjects. Get instant answers, 
              explanations, and study help for Engineering, Computer Science, Mathematics, and more.
            </p>
            <div className="animate-fade-in-delayed opacity-0" style={{ animationDelay: '0.8s', animationFillMode: 'forwards' }}>
              <Button
                onClick={() => setShowChatbot(true)}
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold rounded-full shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-110 transform group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12"></div>
                <MessageCircle className="mr-2 h-5 w-5 animate-bounce" />
                Start Learning Now
              </Button>
            </div>
            
            {/* Animated scroll indicator */}
            <div className="mt-16 animate-bounce">
              <ArrowDown className="h-6 w-6 text-blue-600 mx-auto opacity-60" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-4xl font-bold text-blue-900 mb-4 animate-slide-up">
              Why Choose PolyPros?
            </h2>
            <p className="text-xl text-gray-600 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              Everything you need to excel in your polytechnic studies
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto mt-4 rounded animate-width-expand"></div>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="animate-slide-up-stagger" style={{ animationDelay: '0.1s' }}>
              <FeatureCard
                icon={<BookOpen className="h-12 w-12 text-blue-600 group-hover:scale-110 transition-transform duration-300" />}
                title="Subject Expertise"
                description="Get help with all polytechnic subjects from Mathematics to Engineering"
                delay={0}
              />
            </div>
            <div className="animate-slide-up-stagger" style={{ animationDelay: '0.2s' }}>
              <FeatureCard
                icon={<MessageCircle className="h-12 w-12 text-blue-600 group-hover:scale-110 transition-transform duration-300" />}
                title="Instant Answers"
                description="Ask questions and get detailed explanations instantly"
                delay={100}
              />
            </div>
            <div className="animate-slide-up-stagger" style={{ animationDelay: '0.3s' }}>
              <FeatureCard
                icon={<Clock className="h-12 w-12 text-blue-600 group-hover:scale-110 transition-transform duration-300" />}
                title="24/7 Study Support"
                description="Study anytime, anywhere with our PolyPros-powered assistant"
                delay={200}
              />
            </div>
            <div className="animate-slide-up-stagger" style={{ animationDelay: '0.4s' }}>
              <FeatureCard
                icon={<Users className="h-12 w-12 text-blue-600 group-hover:scale-110 transition-transform duration-300" />}
                title="Made for Students"
                description="Specifically designed for polytechnic curriculum and students"
                delay={300}
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full animate-float"></div>
          <div className="absolute bottom-10 right-10 w-24 h-24 bg-white/10 rounded-full animate-float" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white/10 rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
        </div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-4xl font-bold text-white mb-6 animate-fade-in">
            Ready to Transform Your Study Experience?
          </h2>
          <p className="text-xl text-blue-100 mb-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            Join thousands of polytechnic students who are already excelling with PolyPros
          </p>
          <div className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <Button
              onClick={() => setShowChatbot(true)}
              size="lg"
              variant="secondary"
              className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold rounded-full shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-110 transform group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-blue-600/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12"></div>
              Start Your Study Journey
            </Button>
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
