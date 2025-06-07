
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MessageCircle, BookOpen, Clock, Users, Send, Bot, Mail, Phone, Instagram } from "lucide-react";
import { Chatbot } from "@/components/Chatbot";
import { FeatureCard } from "@/components/FeatureCard";
import { Link } from "react-router-dom";

const Index = () => {
  const [showChatbot, setShowChatbot] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md shadow-sm fixed w-full top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Bot className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-blue-900">PolyPros</span>
            </div>
            <div className="flex space-x-8">
              <Link to="/" className="text-gray-700 hover:text-blue-600 transition-colors">Home</Link>
              <Link to="/about" className="text-gray-700 hover:text-blue-600 transition-colors">About</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center animate-fade-in">
            <div className="mb-8">
              <Bot className="h-24 w-24 text-blue-600 mx-auto mb-6 animate-pulse" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-blue-900 mb-6">
              Master Polytechnic Subjects with{" "}
              <span className="text-blue-600">PolyPros!</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Your intelligent AI study assistant for all polytechnic subjects. Get instant answers, 
              explanations, and study help for Engineering, Computer Science, Mathematics, and more.
            </p>
            <Button
              onClick={() => setShowChatbot(true)}
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <MessageCircle className="mr-2 h-5 w-5" />
              Start Learning Now
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-blue-900 mb-4">
              Why Choose PolyPros?
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need to excel in your polytechnic studies
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              icon={<BookOpen className="h-12 w-12 text-blue-600" />}
              title="Subject Expertise"
              description="Get help with all polytechnic subjects from Mathematics to Engineering"
              delay={0}
            />
            <FeatureCard
              icon={<MessageCircle className="h-12 w-12 text-blue-600" />}
              title="Instant Answers"
              description="Ask questions and get detailed explanations instantly"
              delay={100}
            />
            <FeatureCard
              icon={<Clock className="h-12 w-12 text-blue-600" />}
              title="24/7 Study Support"
              description="Study anytime, anywhere with our AI-powered assistant"
              delay={200}
            />
            <FeatureCard
              icon={<Users className="h-12 w-12 text-blue-600" />}
              title="Made for Students"
              description="Specifically designed for polytechnic curriculum and students"
              delay={300}
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-blue-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Transform Your Study Experience?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of polytechnic students who are already excelling with PolyPros
          </p>
          <Button
            onClick={() => setShowChatbot(true)}
            size="lg"
            variant="secondary"
            className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            Start Your Study Journey
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-blue-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Bot className="h-8 w-8 text-blue-400" />
              <span className="text-2xl font-bold">PolyPros</span>
            </div>
            <p className="text-blue-200 mb-6">
              Your trusted AI study companion for polytechnic success
            </p>
            
            {/* Contact Information */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="flex items-center justify-center space-x-2">
                <Mail className="h-5 w-5 text-blue-400" />
                <span className="text-blue-200">ropebitlabs@gmail.com</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <Phone className="h-5 w-5 text-blue-400" />
                <span className="text-blue-200">8712403113</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <Instagram className="h-5 w-5 text-blue-400" />
                <span className="text-blue-200">@aditya_poly_pros</span>
              </div>
            </div>
            
            <div className="border-t border-blue-800 pt-8">
              <p className="text-blue-300">
                © 2025 PolyPros | Created by Aditya Polytechnic College students with Ropebit Labs
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* Chatbot Modal */}
      {showChatbot && (
        <Chatbot onClose={() => setShowChatbot(false)} />
      )}
    </div>
  );
};

export default Index;
