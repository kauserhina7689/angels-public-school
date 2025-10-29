"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, Home, RefreshCw, ArrowLeft } from "lucide-react";

// Custom Error class to pass additional metadata
export class CustomError extends Error {
  title?: string;
  redirectUrl?: string;
  redirectLabel?: string;
  statusCode?: number;

  constructor(
    message: string,
    options?: {
      title?: string;
      redirectUrl?: string;
      redirectLabel?: string;
      statusCode?: number;
    }
  ) {
    super(message);
    this.name = "CustomError";
    this.title = options?.title;
    this.redirectUrl = options?.redirectUrl;
    this.redirectLabel = options?.redirectLabel;
    this.statusCode = options?.statusCode;
  }
}

interface ErrorPageProps {
  error: (Error | CustomError) & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  const router = useRouter();

  useEffect(() => {
    console.error("Error:", error);
  }, [error]);

  // Check if error is CustomError and extract custom properties
  const isCustomError = error instanceof CustomError;
  console.log({ isCustomError });

  const handleGoHome = () => {
    router.push("/school");
  };

  const handleGoBack = () => {
    router.back();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Error Card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col items-center">
          {/* Header */}
          <h1 className="text-xl font-bold text-center flex items-center justify-center gap-4">
            <AlertCircle className="w-10 h-10 text-destructive" />
            {error.message}
          </h1>

          {/* Content */}
          <div className="p-8 border">
            {/* Action Buttons */}
            <div className="space-y-4">
              {/* Try Again Button */}
              <button
                onClick={reset}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-3"
              >
                <RefreshCw className="w-5 h-5" />
                Try Again
              </button>

              {/* Secondary Actions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={handleGoHome}
                  className="bg-white hover:bg-gray-50 text-gray-700 font-semibold py-3 px-6 rounded-xl border-2 border-gray-300 hover:border-gray-400 transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <Home className="w-5 h-5" />
                  Home
                </button>

                <button
                  onClick={handleGoBack}
                  className="bg-white hover:bg-gray-50 text-gray-700 font-semibold py-3 px-6 rounded-xl border-2 border-gray-300 hover:border-gray-400 transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Go Back
                </button>
              </div>
            </div>

            {/* Help Text */}
            <div className=" pt-8 border-t border-gray-200">
              <p className="text-center text-gray-600 text-sm">
                If this problem persists, please contact our support team
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
