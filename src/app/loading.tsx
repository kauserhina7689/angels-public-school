import React from "react";
import { GraduationCap } from "lucide-react";

export default function SchoolSplashScreen() {
  return (
    <div className="h-svh w-full bg-gradient-to-br from-blue-600 via-primary to-indigo-800 flex items-center justify-center relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 bg-white/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-white/5 rounded-full blur-3xl animate-pulse delay-700"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center gap-8 px-6">
        {/* School Logo/Icon */}
        <div className="relative">
          <div className="absolute inset-0 bg-white/20 rounded-full blur-2xl animate-pulse"></div>
          <div className="relative bg-white rounded-full p-8 shadow-2xl">
            <GraduationCap
              className="w-20 h-20 text-primary"
              strokeWidth={1.5}
            />
          </div>
        </div>

        {/* School Name */}
        <div className="text-center space-y-2">
          <h1 className="text-5xl md:text-6xl font-bold text-white tracking-tight">
            Angels Public School
          </h1>
          <p className="text-blue-100 text-lg md:text-xl font-light tracking-wide">
            Nurturing Excellence, Inspiring Futures
          </p>
        </div>

        {/* Loader */}
        <div className="flex flex-col items-center gap-4 mt-8">
          {/* Spinning Loader */}
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 border-4 border-white/20 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-transparent border-t-white rounded-full animate-spin"></div>
          </div>

          {/* Loading Text */}
          <p className="text-white/80 text-sm font-medium animate-pulse">
            Loading your experience...
          </p>
        </div>

        {/* Decorative Line */}
        <div className="w-32 h-1 bg-gradient-to-r from-transparent via-white/40 to-transparent rounded-full mt-4"></div>
      </div>

      {/* Bottom Wave Decoration */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/10 to-transparent"></div>

      {/* Additional CSS for custom animations */}
      <style jsx>{`
        @keyframes pulse {
          0%,
          100% {
            opacity: 0.6;
          }
          50% {
            opacity: 1;
          }
        }
        .delay-700 {
          animation-delay: 700ms;
        }
        .delay-1000 {
          animation-delay: 1000ms;
        }
      `}</style>
    </div>
  );
}
