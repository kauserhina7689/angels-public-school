"use client";
import LoginForm from "@/components/common/login-form";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/login");
  }, [router]);
  return <></>;
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-2xl font-bold">SM</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">
            School Management
          </h1>
          <p className="text-slate-600">Sign in to your account</p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
