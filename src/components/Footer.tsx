import { Link } from "react-router-dom";
import { Mail, Phone, Instagram } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900 text-white py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500 rounded-full opacity-10 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500 rounded-full opacity-10 blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
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
  );
};
