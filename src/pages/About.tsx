
import { Card, CardContent } from "@/components/ui/card";
import { Bot, Users, Heart, Award } from "lucide-react";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md shadow-sm fixed w-full top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <img src="/polylogo-removebg-preview.png" alt="PolyPros Logo" className="h-16 w-16 object-contain" />
              <span className="text-xl sm:text-2xl font-bold text-blue-900">POLYPROS</span>
            </div>
            <div className="hidden sm:flex space-x-8">
              <Link to="/" className="text-gray-700 hover:text-blue-600 transition-colors">Home</Link>
              <Link to="/about" className="text-blue-600 font-semibold">About</Link>
            </div>
            <div className="sm:hidden">
              <Link to="/" className="text-gray-700 hover:text-blue-600 transition-colors text-sm">Home</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center animate-fade-in">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-blue-900 mb-6">
            About PolyPros
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 mb-12">
            Empowering polytechnic students with AI-powered study assistance
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Card className="mb-12 animate-fade-in border-0 shadow-lg">
            <CardContent className="p-6 sm:p-8">
              <div className="flex items-center mb-6">
                <Heart className="h-8 w-8 text-blue-600 mr-3" />
                <h2 className="text-2xl sm:text-3xl font-bold text-blue-900">Our Mission</h2>
              </div>
              <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
                PolyPros is a smart study assistant built by students of{" "}
                <span className="font-semibold text-blue-600">Aditya Polytechnic College</span>, 
                with support from{" "}
                <span className="font-semibold text-blue-600">Ropebit Labs</span>. 
                Our mission is to help Andhra Pradesh polytechnic students succeed by making 
                exam preparation easier and smarter through AI-powered assistance.
              </p>
            </CardContent>
          </Card>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-12">
            <Card className="animate-fade-in border-0 shadow-lg" style={{ animationDelay: "100ms" }}>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Users className="h-6 w-6 text-blue-600 mr-3" />
                  <h3 className="text-lg sm:text-xl font-semibold text-blue-900">For Students, By Students</h3>
                </div>
                <p className="text-sm sm:text-base text-gray-700">
                  Created by polytechnic students who understand the challenges of SBTET exams 
                  and the need for accessible study resources.
                </p>
              </CardContent>
            </Card>

            <Card className="animate-fade-in border-0 shadow-lg" style={{ animationDelay: "200ms" }}>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Award className="h-6 w-6 text-blue-600 mr-3" />
                  <h3 className="text-lg sm:text-xl font-semibold text-blue-900">SBTET Focused</h3>
                </div>
                <p className="text-sm sm:text-base text-gray-700">
                  Specifically designed for the Andhra Pradesh State Board of Technical 
                  Education and Training (SBTET) curriculum and exam patterns.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Creators Section */}
          <Card className="animate-fade-in border-0 shadow-lg" style={{ animationDelay: "300ms" }}>
            <CardContent className="p-6 sm:p-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-blue-900 mb-6 text-center">
                Our Team
              </h2>
              <div className="text-center">
                <div className="mb-6">
                  <h3 className="text-lg sm:text-xl font-semibold text-blue-600 mb-2">
                    Aditya Polytechnic College Students
                  </h3>
                  <p className="text-sm sm:text-base text-gray-700">
                    Passionate students dedicated to helping their peers succeed in polytechnic education
                  </p>
                </div>
                <div className="border-t pt-6">
                  <h3 className="text-lg sm:text-xl font-semibold text-blue-600 mb-2">
                    Ropebit Labs
                  </h3>
                  <p className="text-sm sm:text-base text-gray-700">
                    Technology partner providing AI expertise and development support
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-blue-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Bot className="h-8 w-8 text-blue-400" />
              <span className="text-xl sm:text-2xl font-bold">PolyPros</span>
            </div>
            <p className="text-sm sm:text-base text-blue-200 mb-4 px-4">
              Your trusted AI study companion for polytechnic success
            </p>
            <div className="border-t border-blue-800 pt-8">
              <p className="text-blue-300 text-xs sm:text-sm px-4">
                © 2025 PolyPros | Created by Aditya Polytechnic College students with Ropebit Labs
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default About;
