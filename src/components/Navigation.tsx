import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

export const Navigation = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="bg-gradient-to-r from-white via-blue-50 to-white backdrop-blur-xl shadow-xl fixed w-full top-0 z-50 border-b-2 border-blue-200/50 animate-slide-down">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="flex items-center gap-2 animate-fade-in group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur-md opacity-0 group-hover:opacity-30 transition-opacity duration-500"></div>
              <img src="/polylogo-removebg-preview.png" alt="PolyPros Logo" className="h-14 w-14 object-contain relative z-10 transform group-hover:scale-110 transition-transform duration-300" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-blue-700 via-blue-900 to-purple-700 bg-clip-text text-transparent group-hover:from-blue-600 group-hover:to-purple-600 transition-all duration-300">POLYPROS</span>
              <span className="text-[10px] text-gray-500 font-medium tracking-wide hidden sm:block">Study Smart, Achieve More</span>
            </div>
          </Link>

          <div className="hidden md:flex items-center space-x-1 animate-fade-in bg-white/60 backdrop-blur-sm rounded-full px-2 py-2 shadow-md" style={{ animationDelay: '0.3s' }}>
            <Link to="/" className="px-5 py-2.5 text-gray-700 hover:text-blue-600 font-semibold transition-all duration-300 hover:scale-105 relative group rounded-full">
              Home
              <span className="absolute inset-0 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 -z-10"></span>
              <span className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full group-hover:w-3/4 transition-all duration-300"></span>
            </Link>
            <Link to="/question-papers" className="px-5 py-2.5 text-gray-700 hover:text-blue-600 font-semibold transition-all duration-300 hover:scale-105 relative group rounded-full">
              Papers
              <span className="absolute inset-0 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 -z-10"></span>
              <span className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full group-hover:w-3/4 transition-all duration-300"></span>
            </Link>
            <Link to="/about" className="px-5 py-2.5 text-gray-700 hover:text-blue-600 font-semibold transition-all duration-300 hover:scale-105 relative group rounded-full">
              About
              <span className="absolute inset-0 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 -z-10"></span>
              <span className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full group-hover:w-3/4 transition-all duration-300"></span>
            </Link>
            <Link to="/admin" className="px-5 py-2.5 text-gray-700 hover:text-blue-600 font-semibold transition-all duration-300 hover:scale-105 relative group rounded-full">
              Admin
              <span className="absolute inset-0 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 -z-10"></span>
              <span className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full group-hover:w-3/4 transition-all duration-300"></span>
            </Link>
          </div>

          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMobileMenu}
              className="p-3 text-gray-700 hover:text-blue-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-300 rounded-full shadow-md hover:shadow-lg"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden bg-gradient-to-b from-white to-blue-50/50 backdrop-blur-xl border-t-2 border-blue-100/50 animate-slide-down shadow-xl">
          <div className="px-4 py-4 space-y-2">
            <Link
              to="/"
              onClick={closeMobileMenu}
              className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 rounded-xl transition-all duration-300 font-semibold group"
            >
              <div className="w-2 h-2 bg-blue-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              Home
            </Link>
            <Link
              to="/question-papers"
              onClick={closeMobileMenu}
              className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 rounded-xl transition-all duration-300 font-semibold group"
            >
              <div className="w-2 h-2 bg-blue-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              Papers
            </Link>
            <Link
              to="/about"
              onClick={closeMobileMenu}
              className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 rounded-xl transition-all duration-300 font-semibold group"
            >
              <div className="w-2 h-2 bg-blue-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              About
            </Link>
            <Link
              to="/admin"
              onClick={closeMobileMenu}
              className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 rounded-xl transition-all duration-300 font-semibold group"
            >
              <div className="w-2 h-2 bg-blue-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              Admin
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};
